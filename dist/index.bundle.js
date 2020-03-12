(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("surakarta"), require("surakarta-analysis"));
	else if(typeof define === 'function' && define.amd)
		define(["surakarta", "surakarta-analysis"], factory);
	else if(typeof exports === 'object')
		exports["SKAI"] = factory(require("surakarta"), require("surakarta-analysis"));
	else
		root["SKAI"] = factory(root["_"], root["_"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_surakarta__, __WEBPACK_EXTERNAL_MODULE_surakarta_analysis__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/opool/index.js":
/*!*************************************!*\
  !*** ./node_modules/opool/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var Pool = (function () {\n    function Pool(Func) {\n        this.pool = [];\n        this.Func = Func;\n    }\n    Pool.prototype.get = function () {\n        if (this.pool.length) {\n            return this.pool.splice(0, 1)[0];\n        }\n        return new this.Func();\n    };\n    Pool.prototype.release = function (obj) {\n        if (this.Func.reset) {\n            this.Func.reset(obj);\n        }\n        this.pool.push(obj);\n    };\n    return Pool;\n})();\nmodule.exports = Pool;\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack://SKAI/./node_modules/opool/index.js?");

/***/ }),

/***/ "./src/CommonContext.ts":
/*!******************************!*\
  !*** ./src/CommonContext.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar mem_1 = __webpack_require__(/*! ./mem */ \"./src/mem/index.ts\");\nvar CommonContext = (function () {\n    function CommonContext(noCache, requestHandle) {\n        if (noCache === void 0) { noCache = false; }\n        if (requestHandle === void 0) { requestHandle = 0; }\n        this.requestHandle = requestHandle || Math.random() * (1 << 30);\n        this.useCache = !noCache;\n    }\n    Object.defineProperty(CommonContext.prototype, \"cache\", {\n        get: function () {\n            if (!this.useCache) {\n                return null;\n            }\n            else if (!this._cache) {\n                this._cache = new mem_1.TranspositionTable({ nodeLimit: 9000 });\n            }\n            return this._cache;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    CommonContext.postThreadBoundary = function (context) {\n        return new CommonContext(!!context.cache, context.requestHandle);\n    };\n    return CommonContext;\n}());\nexports.CommonContext = CommonContext;\n\n\n//# sourceURL=webpack://SKAI/./src/CommonContext.ts?");

/***/ }),

/***/ "./src/SearchContext.ts":
/*!******************************!*\
  !*** ./src/SearchContext.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result[\"default\"] = mod;\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar SK = __importStar(__webpack_require__(/*! surakarta */ \"surakarta\"));\nvar CommonContext_1 = __webpack_require__(/*! ./CommonContext */ \"./src/CommonContext.ts\");\nvar opool_1 = __importDefault(__webpack_require__(/*! opool */ \"./node_modules/opool/index.js\"));\nvar SearchContext = (function () {\n    function SearchContext() {\n        this.surakarta = null;\n        this.playerId = SK.NOT_FILLED;\n        this.searchDepth = 0;\n        this.depthLimit = 0;\n        this.alpha = Number.NEGATIVE_INFINITY;\n        this.beta = Number.POSITIVE_INFINITY;\n        this.common = null;\n    }\n    SearchContext.prototype.init = function (surakarta, playerId, depthLimit, searchDepth) {\n        if (searchDepth === void 0) { searchDepth = 0; }\n        this.surakarta = surakarta;\n        this.playerId = playerId;\n        this.depthLimit = depthLimit;\n        this.searchDepth = searchDepth;\n        this.alpha = Number.NEGATIVE_INFINITY;\n        this.beta = Number.POSITIVE_INFINITY;\n    };\n    SearchContext.prototype.reset = function () {\n        this.surakarta = null;\n        this.playerId = 0;\n        this.depthLimit = 0;\n        this.searchDepth = 0;\n        this.alpha = Number.NEGATIVE_INFINITY;\n        this.beta = Number.POSITIVE_INFINITY;\n    };\n    SearchContext.prototype.destroy = function () {\n        SearchContext.pool.release(this);\n    };\n    SearchContext.postThreadBoundary = function (context) {\n        var newContext = new SearchContext();\n        newContext.surakarta = context.surakarta;\n        newContext.playerId = context.playerId;\n        newContext.depthLimit = context.depthLimit;\n        newContext.searchDepth = context.searchDepth;\n        newContext.alpha = context.alpha;\n        newContext.beta = context.beta;\n        var _a = context.surakarta, states = _a.states, turn = _a.turn;\n        newContext.surakarta = SK.Surakarta.fromState(states);\n        newContext.surakarta.turn = turn;\n        newContext.common = CommonContext_1.CommonContext.postThreadBoundary(context.common);\n        return newContext;\n    };\n    SearchContext.pool = new opool_1.default(SearchContext);\n    return SearchContext;\n}());\nexports.SearchContext = SearchContext;\nfunction createContext(surakarta, searchOptions) {\n    if (searchOptions === void 0) { searchOptions = { noCache: false }; }\n    var context = SearchContext.pool.get();\n    context.init(surakarta, surakarta.turnPlayer, 4);\n    context.common = new CommonContext_1.CommonContext(searchOptions.noCache);\n    return context;\n}\nexports.createContext = createContext;\nfunction createInheritedContext(surakarta, parent) {\n    var context = SearchContext.pool.get();\n    context.surakarta = surakarta;\n    context.playerId =\n        parent.playerId === SK.BLACK_PLAYER ? SK.RED_PLAYER : SK.BLACK_PLAYER;\n    context.searchDepth = parent.searchDepth + 1;\n    context.depthLimit = parent.depthLimit;\n    context.alpha = -parent.beta;\n    context.beta = -parent.alpha;\n    context.common = parent.common;\n    return context;\n}\nexports.createInheritedContext = createInheritedContext;\n\n\n//# sourceURL=webpack://SKAI/./src/SearchContext.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar search_1 = __webpack_require__(/*! ./search */ \"./src/search.ts\");\nvar SearchContext_1 = __webpack_require__(/*! ./SearchContext */ \"./src/SearchContext.ts\");\nfunction suggestPlay(surakarta) {\n    return search_1.search(SearchContext_1.createContext(surakarta));\n}\nexports.suggestPlay = suggestPlay;\nfunction play(surakarta) {\n    return __awaiter(this, void 0, void 0, function () {\n        return __generator(this, function (_a) {\n            return [2, search_1.search(SearchContext_1.createContext(surakarta))];\n        });\n    });\n}\nexports.play = play;\nfunction resetResources() {\n    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {\n        return [2];\n    }); });\n}\nexports.resetResources = resetResources;\nexports.default = {\n    suggestPlay: suggestPlay\n};\nexports.AI = { suggestPlay: suggestPlay };\n\n\n//# sourceURL=webpack://SKAI/./src/index.ts?");

/***/ }),

/***/ "./src/mem/TranspositionTable.ts":
/*!***************************************!*\
  !*** ./src/mem/TranspositionTable.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar ZobristHasher_1 = __webpack_require__(/*! ./ZobristHasher */ \"./src/mem/ZobristHasher.ts\");\nfunction npow2(n) {\n    return 1 << (31 - Math.clz32(n));\n}\nvar TTEntry = (function () {\n    function TTEntry() {\n        this.key = -1;\n        this.value = 0;\n        this.depth = 0;\n        this.lastHit = 0;\n    }\n    Object.defineProperty(TTEntry.prototype, \"weight\", {\n        get: function () {\n            return -this.depth - 2 * (performance.now() - this.lastHit);\n        },\n        enumerable: true,\n        configurable: true\n    });\n    TTEntry.prototype.feed = function (key, value, depth) {\n        if (this.weight > -depth) {\n            return;\n        }\n        this.key = key;\n        this.value = value;\n        this.depth = depth;\n        this.lastHit = performance.now();\n    };\n    TTEntry.prototype.hit = function () {\n        this.lastHit = performance.now();\n        return this.value;\n    };\n    return TTEntry;\n}());\nexports.TTEntry = TTEntry;\nvar TranspositionTable = (function () {\n    function TranspositionTable(options) {\n        this.nodeLimit = npow2(options.nodeLimit);\n        var size = Math.floor(this.nodeLimit / 3);\n        this.buckets = new Array(size);\n        for (var i = 0; i < size; i++) {\n            this.buckets[i] = new Array(3);\n            for (var j = 0; j < 3; j++) {\n                this.buckets[i][j] = new TTEntry();\n            }\n        }\n        ZobristHasher_1.initZobrist();\n    }\n    TranspositionTable.prototype.hit = function (key, willFeed) {\n        if (willFeed === void 0) { willFeed = true; }\n        var bucket = this.buckets[key % this.buckets.length];\n        for (var i = 0; i < bucket.length; i++) {\n            if (bucket[i].key == key) {\n                return bucket[i].hit();\n            }\n        }\n        if (willFeed) {\n            var worstEntry = bucket[0];\n            for (var i = 1; i < bucket.length; i++) {\n                var entry = bucket[i];\n                if (entry.weight < worstEntry.weight) {\n                    worstEntry = entry;\n                }\n            }\n            return worstEntry;\n        }\n        return null;\n    };\n    return TranspositionTable;\n}());\nexports.TranspositionTable = TranspositionTable;\n\n\n//# sourceURL=webpack://SKAI/./src/mem/TranspositionTable.ts?");

/***/ }),

/***/ "./src/mem/ZobristHasher.ts":
/*!**********************************!*\
  !*** ./src/mem/ZobristHasher.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar baseCodes = [];\nvar isInit = false;\nfunction initZobrist() {\n    if (isInit) {\n        return;\n    }\n    for (var player = -1; player <= 1; player++) {\n        var playerHashes = new Array(36);\n        for (var pos = 0; pos < 36; pos++) {\n            playerHashes[pos] = Math.random() * (1 << 30);\n        }\n        baseCodes[player] = playerHashes;\n    }\n    isInit = true;\n}\nexports.initZobrist = initZobrist;\nfunction hash(node) {\n    initZobrist();\n    var hashCode = 0;\n    for (var p = 0; p < 36; p++) {\n        hashCode ^= baseCodes[node.states[p]][p];\n    }\n    return hashCode;\n}\nexports.hash = hash;\n\n\n//# sourceURL=webpack://SKAI/./src/mem/ZobristHasher.ts?");

/***/ }),

/***/ "./src/mem/index.ts":
/*!**************************!*\
  !*** ./src/mem/index.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nfunction __export(m) {\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\n}\nObject.defineProperty(exports, \"__esModule\", { value: true });\n__export(__webpack_require__(/*! ./ZobristHasher */ \"./src/mem/ZobristHasher.ts\"));\n__export(__webpack_require__(/*! ./TranspositionTable */ \"./src/mem/TranspositionTable.ts\"));\n\n\n//# sourceURL=webpack://SKAI/./src/mem/index.ts?");

/***/ }),

/***/ "./src/search.ts":
/*!***********************!*\
  !*** ./src/search.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result[\"default\"] = mod;\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar SK = __importStar(__webpack_require__(/*! surakarta */ \"surakarta\"));\nvar surakarta_analysis_1 = __webpack_require__(/*! surakarta-analysis */ \"surakarta-analysis\");\nvar SearchContext_1 = __webpack_require__(/*! ./SearchContext */ \"./src/SearchContext.ts\");\nvar mem_1 = __webpack_require__(/*! ./mem */ \"./src/mem/index.ts\");\nvar inflateHandle = surakarta_analysis_1.MoveHelper.inflateHandle;\nvar Aggregate = (function () {\n    function Aggregate() {\n        this.indexed = [];\n    }\n    Object.defineProperty(Aggregate.prototype, \"length\", {\n        get: function () {\n            return this.indexed.length;\n        },\n        enumerable: true,\n        configurable: true\n    });\n    Aggregate.prototype.forEach = function (callback) {\n        var moveTarget = new SK.Move();\n        this.indexed.forEach(function (moveHandle) {\n            callback(inflateHandle(moveHandle, moveTarget));\n        });\n    };\n    Aggregate.from = function (context) {\n        var surakarta = context.surakarta;\n        var movesArray = new Aggregate();\n        surakarta_analysis_1.Indexer.index(surakarta, movesArray.indexed);\n        surakarta_analysis_1.sortIndex(surakarta, movesArray.indexed);\n        return movesArray;\n    };\n    return Aggregate;\n}());\nvar surakartaPool = [];\nfunction search(context) {\n    var surakarta = context.surakarta, playerId = context.playerId, searchDepth = context.searchDepth, depthLimit = context.depthLimit;\n    if (searchDepth === depthLimit) {\n        return (2 * playerId - 1) * surakarta_analysis_1.evaluate(surakarta);\n    }\n    var hit;\n    var hashCode = mem_1.hash(surakarta);\n    if (context.common.cache && searchDepth > 0) {\n        hit = context.common.cache.hit(hashCode);\n        if (typeof hit === \"number\") {\n            return hit;\n        }\n    }\n    var childState = surakartaPool.pop() || new SK.Surakarta(true);\n    childState.copyFrom(surakarta);\n    childState.turn = surakarta.turn;\n    var movesIterable = Aggregate.from(context);\n    var bestMove = null;\n    var bestValue = Number.NEGATIVE_INFINITY;\n    var stopped = false;\n    movesIterable.forEach(function (move) {\n        if (stopped) {\n            return;\n        }\n        childState.step(move.srcRow, move.srcColumn, move.dstRow, move.dstColumn, true, move.isAttack);\n        ++childState.turn;\n        var value = -search(SearchContext_1.createInheritedContext(childState, context));\n        if (value > bestValue) {\n            if (searchDepth === 0) {\n                bestMove = move.clone();\n            }\n            bestValue = value;\n        }\n        context.alpha = Math.max(context.alpha, value);\n        if (context.alpha >= context.beta) {\n            stopped = true;\n        }\n        childState.copyFrom(surakarta);\n        --childState.turn;\n    });\n    if (searchDepth === 0) {\n        return bestMove;\n    }\n    if (hit) {\n        hit.feed(hashCode, bestValue, searchDepth);\n    }\n    context.destroy();\n    return bestValue;\n}\nexports.search = search;\n\n\n//# sourceURL=webpack://SKAI/./src/search.ts?");

/***/ }),

/***/ "surakarta":
/*!**********************************************************************************************!*\
  !*** external {"commonjs":"surakarta","commonjs2":"surakarta","amd":"surakarta","root":"_"} ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_surakarta__;\n\n//# sourceURL=webpack://SKAI/external_%7B%22commonjs%22:%22surakarta%22,%22commonjs2%22:%22surakarta%22,%22amd%22:%22surakarta%22,%22root%22:%22_%22%7D?");

/***/ }),

/***/ "surakarta-analysis":
/*!*************************************************************************************************************************!*\
  !*** external {"commonjs":"surakarta-analysis","commonjs2":"surakarta-analysis","amd":"surakarta-analysis","root":"_"} ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_surakarta_analysis__;\n\n//# sourceURL=webpack://SKAI/external_%7B%22commonjs%22:%22surakarta-analysis%22,%22commonjs2%22:%22surakarta-analysis%22,%22amd%22:%22surakarta-analysis%22,%22root%22:%22_%22%7D?");

/***/ })

/******/ });
});