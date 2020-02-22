import { TranspositionTable } from "./mem";

/**
 * Common context is shared among all search-context, and is not reallocated
 * during any branch.
 */
export class CommonContext {
  cache: TranspositionTable;

  constructor(noCache = false) {
    if (!noCache) {
      this.cache = new TranspositionTable({ nodeLimit: 9000 });
    }
  }
}
