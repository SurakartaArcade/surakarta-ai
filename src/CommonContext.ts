import { TranspositionTable } from "./mem";

/**
 * @namespace SK.ai
 */
export class CommonContext {
  requestHandle: number;
  useCache: boolean;

  private _cache: TranspositionTable;

  constructor(noCache = false, requestHandle = 0) {
    /**
     * A random bitstring used to identify this context across the internal
     * threads.
     *
     * @member {number}
     */
    this.requestHandle = requestHandle || Math.random() * (1 << 30);

    /**
     * Enables cache usage (transposition table)
     *
     * @member {boolean}
     */
    this.useCache = !noCache;
  }

  /**
   * Transposition table containing previously evaluated positions.
   *
   * @returns {TranspositionTable} cache table, is {@code useCache} is true
   */
  get cache(): TranspositionTable {
    if (!this.useCache) {
      return null;
    } else if (!this._cache) {
      this._cache = new TranspositionTable({ nodeLimit: 9000 });
    }

    return this._cache;
  }

  /**
   * Repairs a {@code CommonContext} object after it is copied over a
   * web-worker boundary.
   *
   * @param {CommonContext} context - context received
   * @returns {CommonContext} repaired context
   */
  static postThreadBoundary(context: CommonContext): CommonContext {
    return new CommonContext(!!context.cache, context.requestHandle);
  }
}
