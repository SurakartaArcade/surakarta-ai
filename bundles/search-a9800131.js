import { Surakarta, NOT_FILLED, BLACK_PLAYER, RED_PLAYER, Position } from 'surakarta';
import { Finder, evaluate } from 'surakarta-analysis';
import { performance } from 'perf_hooks';

var baseCodes = [];
var isInit = false;
function initZobrist() {
    if (isInit) {
        return;
    }
    for (var player = -1; player <= 1; player++) {
        var playerHashes = new Array(36);
        for (var pos = 0; pos < 36; pos++) {
            playerHashes[pos] = Math.random() * (1 << 30);
        }
        baseCodes[player] = playerHashes;
    }
    isInit = true;
}
function hash(node) {
    initZobrist();
    var hashCode = 0;
    for (var p = 0; p < 36; p++) {
        hashCode ^= baseCodes[node.states[p]][p];
    }
    return hashCode;
}

function npow2(n) {
    return 1 << (31 - Math.clz32(n));
}
var TTEntry = (function () {
    function TTEntry() {
        this.key = -1;
        this.value = 0;
        this.depth = 0;
        this.lastHit = 0;
    }
    Object.defineProperty(TTEntry.prototype, "weight", {
        get: function () {
            return -this.depth - 2 * (performance.now() - this.lastHit);
        },
        enumerable: true,
        configurable: true
    });
    TTEntry.prototype.feed = function (key, value, depth) {
        if (this.weight > -depth) {
            return;
        }
        this.key = key;
        this.value = value;
        this.depth = depth;
        this.lastHit = performance.now();
    };
    TTEntry.prototype.hit = function () {
        this.lastHit = performance.now();
        return this.value;
    };
    return TTEntry;
}());
var TranspositionTable = (function () {
    function TranspositionTable(options) {
        this.nodeLimit = npow2(options.nodeLimit);
        var size = Math.floor(this.nodeLimit / 3);
        this.buckets = new Array(size);
        for (var i = 0; i < size; i++) {
            this.buckets[i] = new Array(3);
            for (var j = 0; j < 3; j++) {
                this.buckets[i][j] = new TTEntry();
            }
        }
        initZobrist();
    }
    TranspositionTable.prototype.hit = function (key, willFeed) {
        if (willFeed === void 0) { willFeed = true; }
        var bucket = this.buckets[key % this.buckets.length];
        for (var i = 0; i < bucket.length; i++) {
            if (bucket[i].key == key) {
                return bucket[i].hit();
            }
        }
        if (willFeed) {
            var worstEntry = bucket[0];
            for (var i = 1; i < bucket.length; i++) {
                var entry = bucket[i];
                if (entry.weight < worstEntry.weight) {
                    worstEntry = entry;
                }
            }
            return worstEntry;
        }
        return null;
    };
    return TranspositionTable;
}());

var CommonContext = (function () {
    function CommonContext(noCache, requestHandle) {
        if (noCache === void 0) { noCache = false; }
        if (!noCache) {
            this.cache = new TranspositionTable({ nodeLimit: 9000 });
        }
        this.requestHandle = requestHandle || Math.random() * (1 << 30);
    }
    CommonContext.postThreadBoundary = function (context) {
        return new CommonContext(!!context.cache, context.requestHandle);
    };
    return CommonContext;
}());

var negamaxContextPool = [];
var SearchContext = (function () {
    function SearchContext() {
        this.surakarta = null;
        this.playerId = NOT_FILLED;
        this.searchDepth = 0;
        this.depthLimit = 0;
        this.alpha = Number.NEGATIVE_INFINITY;
        this.beta = Number.POSITIVE_INFINITY;
        this.common = null;
    }
    SearchContext.prototype.init = function (surakarta, playerId, depthLimit, searchDepth) {
        if (searchDepth === void 0) { searchDepth = 0; }
        this.surakarta = surakarta;
        this.playerId = playerId;
        this.depthLimit = depthLimit;
        this.searchDepth = searchDepth;
        this.alpha = Number.NEGATIVE_INFINITY;
        this.beta = Number.POSITIVE_INFINITY;
    };
    SearchContext.prototype.destroy = function () {
        negamaxContextPool.push(this);
    };
    SearchContext.postThreadBoundary = function (context) {
        var newContext = new SearchContext();
        newContext.surakarta = context.surakarta;
        newContext.playerId = context.playerId;
        newContext.depthLimit = context.depthLimit;
        newContext.searchDepth = context.searchDepth;
        newContext.alpha = context.alpha;
        newContext.beta = context.beta;
        var _a = context.surakarta, states = _a.states, turn = _a.turn;
        newContext.surakarta = Surakarta.fromState(states);
        newContext.surakarta.turn = turn;
        newContext.common = CommonContext.postThreadBoundary(context.common);
        return newContext;
    };
    return SearchContext;
}());
function createContext(surakarta, searchOptions) {
    if (searchOptions === void 0) { searchOptions = { noCache: false }; }
    var context = negamaxContextPool.pop() || new SearchContext();
    context.init(surakarta, surakarta.turnPlayer, 4);
    context.common = new CommonContext(searchOptions.noCache);
    return context;
}
function createInheritedContext(surakarta, parent) {
    var context = negamaxContextPool.pop() || new SearchContext();
    context.surakarta = surakarta;
    context.playerId =
        parent.playerId === BLACK_PLAYER ? RED_PLAYER : BLACK_PLAYER;
    context.searchDepth = parent.searchDepth + 1;
    context.depthLimit = parent.depthLimit;
    context.alpha = -parent.beta;
    context.beta = -parent.alpha;
    context.common = parent.common;
    return context;
}

var Aggregate = (function () {
    function Aggregate() {
        this.arr = [];
    }
    Aggregate.prototype.push = function (moves) {
        this.arr.push(moves);
    };
    Aggregate.prototype.forEach = function (callback) {
        this.arr.forEach(function (moves) { return moves.forEach(callback); });
    };
    Aggregate.from = function (context) {
        var surakarta = context.surakarta, playerId = context.playerId;
        var movesArray = new Aggregate();
        for (var i = 0; i < 36; i++) {
            if (surakarta.states[i] === playerId) {
                movesArray.push(Finder.exploreAll(surakarta, new Position(Math.floor(i / 6), i % 6)));
            }
        }
        return movesArray;
    };
    return Aggregate;
}());
var surakartaPool = [];
function search(context) {
    var surakarta = context.surakarta, playerId = context.playerId, searchDepth = context.searchDepth, depthLimit = context.depthLimit;
    if (searchDepth === depthLimit) {
        return (2 * playerId - 1) * evaluate(surakarta);
    }
    var hit;
    var hashCode = hash(surakarta);
    if (context.common.cache && searchDepth > 0) {
        hit = context.common.cache.hit(hashCode);
        if (typeof hit === "number") {
            return hit;
        }
    }
    var childState = surakartaPool.pop() || new Surakarta(true);
    childState.copyFrom(surakarta);
    childState.turn = surakarta.turn;
    var movesIterable = Aggregate.from(context);
    var bestMove = null;
    var bestValue = Number.NEGATIVE_INFINITY;
    var stopped = false;
    movesIterable.forEach(function (move) {
        if (stopped) {
            return;
        }
        childState.step(move.srcRow, move.srcColumn, move.dstRow, move.dstColumn, true, move.isAttack);
        ++childState.turn;
        var value = -search(createInheritedContext(childState, context));
        if (value > bestValue) {
            if (searchDepth === 0) {
                bestMove = move.clone();
            }
            bestValue = value;
        }
        context.alpha = Math.max(context.alpha, value);
        if (context.alpha >= context.beta) {
            stopped = true;
        }
        childState.copyFrom(surakarta);
        --childState.turn;
    });
    if (searchDepth === 0) {
        return bestMove;
    }
    if (hit) {
        hit.feed(hashCode, bestValue, searchDepth);
    }
    context.destroy();
    return bestValue;
}

export { SearchContext as S, createContext as c, search as s };
