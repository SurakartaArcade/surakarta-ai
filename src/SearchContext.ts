import * as SK from "surakarta";
import { CommonContext } from "./CommonContext";
import { search } from "./search";

const negamaxContextPool = [];

/**
 * Pooled object used for recursive communication in the negamax algorithm.
 */
export class SearchContext {
  surakarta: SK.Surakarta;
  playerId: number;
  searchDepth: number;
  depthLimit: number;

  alpha: number;
  beta: number;

  common: CommonContext;

  constructor() {
    this.surakarta = null;
    this.playerId = SK.NOT_FILLED;

    this.searchDepth = 0;
    this.depthLimit = 0;

    this.alpha = Number.NEGATIVE_INFINITY;
    this.beta = Number.POSITIVE_INFINITY;

    this.common = null;
  }

  init(
    surakarta: SK.Surakarta,
    playerId: number,
    depthLimit: number,
    searchDepth = 0
  ): void {
    this.surakarta = surakarta;
    this.playerId = playerId;
    this.depthLimit = depthLimit;

    this.searchDepth = searchDepth;

    this.alpha = Number.NEGATIVE_INFINITY;
    this.beta = Number.POSITIVE_INFINITY;
  }

  destroy(): void {
    negamaxContextPool.push(this);
  }

  static postThreadBoundary(context): SearchContext {
    const newContext = new SearchContext();
    newContext.surakarta = context.surakarta;
    newContext.playerId = context.playerId;
    newContext.depthLimit = context.depthLimit;
    newContext.searchDepth = context.searchDepth;
    newContext.alpha = context.alpha;
    newContext.beta = context.beta;

    const { states, turn } = context.surakarta;

    newContext.surakarta = SK.Surakarta.fromState(states);
    newContext.surakarta.turn = turn;

    newContext.common = CommonContext.postThreadBoundary(context.common);

    return newContext;
  }
}

interface SearchOptions {
  noCache: boolean;
}

/**
 * @param {SK.Surakarta} surakarta -
 * @param {searchOptions} searchOptions
 * @returns {SearchContext} top-level context
 */
export function createContext(
  surakarta: SK.Surakarta,
  searchOptions: SearchOptions = { noCache: false }
): SearchContext {
  const context = negamaxContextPool.pop() || new SearchContext();

  context.init(surakarta, surakarta.turnPlayer, 4);

  context.common = new CommonContext(searchOptions.noCache);

  return context;
}

/**
 * @param {SK.Surakarta} surakarta -
 * @param {SK.ai.NegamaxContext} parent -
 * @returns {SearchContext} child context
 */
export function createInheritedContext(
  surakarta: SK.Surakarta,
  parent: SearchContext
): SearchContext {
  const context = negamaxContextPool.pop() || new SearchContext();

  context.surakarta = surakarta;
  context.playerId =
    parent.playerId === SK.BLACK_PLAYER ? SK.RED_PLAYER : SK.BLACK_PLAYER;

  context.searchDepth = parent.searchDepth + 1;
  context.depthLimit = parent.depthLimit;

  context.alpha = -parent.beta;
  context.beta = -parent.alpha;

  context.common = parent.common;

  return context;
}
