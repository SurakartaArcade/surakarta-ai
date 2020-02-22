import { search } from "../src/search";
import { play } from "../src";
import { createContext } from "../src/SearchContext";
import { Suite } from "benchmark";
import { Surakarta } from "surakarta";

const mockSurakarta = new Surakarta();

new Suite()
  .add("Negamax + alpha/beta pruning", function() {
    search(createContext(mockSurakarta, { noCache: true }));
  })
  .add("Negamax + alpha/beta pruning + transposition table", function() {
    search(createContext(mockSurakarta));
  })
  .add(
    "Negamax + alpha/beta pruning + transposition table + parallelization",
    function() {
      play(mockSurakarta);
    }
  )
  .on("complete", function() {
    for (let i = 0; i < this.length; i++) {
      const bm = this[i];
      console.log(`"${bm.name}" takes ${Math.round(bm.times.period * 1000)}ms`);
    }
  })
  .run();
