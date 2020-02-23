import 'surakarta';
import 'surakarta-analysis';
import { S as SearchContext, s as search } from './search-a9800131.js';
import 'perf_hooks';
import { expose } from 'threads/worker';
import { Subject, Observable } from 'threads/observable';

var ZygoteRequest = (function () {
    function ZygoteRequest() {
        this.id = -1;
        this.depth = null;
        this.progress = null;
    }
    ZygoteRequest.prototype.init = function (id) {
        if (ZygoteRequest.requestMap[id]) {
            throw new Error("Cannot initate ZygoteRequest due to request-handle collision");
        }
        this.id = id;
        this.depth = new Subject();
        this.progress = new Subject();
        ZygoteRequest.requestMap[id] = this;
        return this;
    };
    ZygoteRequest.prototype.destroy = function () {
        ZygoteRequest.requestMap[this.id] = null;
        ZygoteRequest.requestPool.push(this);
    };
    ZygoteRequest.init = function (context) {
        return (ZygoteRequest.requestPool.pop() || new ZygoteRequest()).init(context.common.requestHandle);
    };
    ZygoteRequest.requestPool = [];
    ZygoteRequest.requestMap = {};
    return ZygoteRequest;
}());
var zygoteTemplate = {
    exec: function (context) {
        context = SearchContext.postThreadBoundary(context);
        ZygoteRequest.init(context);
        return search(context);
    },
    depth: function (requestHandle) {
        var _a;
        return Observable.from((_a = ZygoteRequest.requestMap[requestHandle]) === null || _a === void 0 ? void 0 : _a.depth);
    },
    progress: function (requestHandle) {
        var _a;
        return Observable.from((_a = ZygoteRequest.requestMap[requestHandle]) === null || _a === void 0 ? void 0 : _a.progress);
    }
};
expose(zygoteTemplate);
