import 'surakarta';
import 'surakarta-analysis';
import { s as search } from './search-3ada05aa.js';
import 'perf_hooks';
import { expose } from 'threads/worker';
import { Subject, Observable } from 'threads/observable';

var depth;
var progress;
var zygoteTemplate = {
    exec: function (context) {
        console.log("HERE");
        depth = new Subject();
        progress = new Subject();
        var t1 = performance.now();
        var result = search(context);
        console.log(performance.now() - t1);
        return result;
    },
    depth: function () {
        return Observable.from(depth);
    },
    progress: function () {
        return Observable.from(progress);
    },
    test: function () {
        return 234;
    }
};
expose(zygoteTemplate);
