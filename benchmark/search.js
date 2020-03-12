"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var search_1 = require("../src/search");
var src_1 = require("../src");
var SearchContext_1 = require("../src/SearchContext");
var benchmark_1 = require("benchmark");
var surakarta_1 = require("surakarta");
var mockSurakarta = new surakarta_1.Surakarta();
new benchmark_1.Suite()
    .add("Negamax + alpha/beta pruning", function () {
    search_1.search(SearchContext_1.createContext(mockSurakarta, { noCache: true }));
})
    .add("Negamax + alpha/beta pruning + transposition table", function () {
    search_1.search(SearchContext_1.createContext(mockSurakarta));
})
    .add("Negamax + alpha/beta pruning + transposition table + parallelization", {
    defer: true,
    fn: function (deferred) {
        src_1.play(mockSurakarta).then(function () { return deferred.resolve(); });
    }
})
    .on("complete", function () {
    src_1.resetResources();
    for (var i = 0; i < this.length; i++) {
        var bm = this[i];
        console.log("\"" + bm.name + "\" takes " + Math.round(bm.times.period * 1000) + "ms");
    }
})
    .run();
