import * as SK from 'surakarta';

const negamaxContextPool = []

/**
 * Pooled object used for recursive communication in the negamax algorithm.
 */
export class NegamaxContext {
    surakarta: SK.Surakarta;
    playerId: number;
    searchDepth: number;
    depthLimit: number;

    alpha: number;
    beta: number;

    constructor () {
        this.surakarta = null
        this.playerId = SK.NOT_FILLED

        this.searchDepth = 0
        this.depthLimit = 0

        this.alpha = Number.NEGATIVE_INFINITY;
        this.beta = Number.POSITIVE_INFINITY;
    }

    init (surakarta: SK.Surakarta, playerId: number, depthLimit: number, searchDepth = 0): void {
        this.surakarta = surakarta
        this.playerId = playerId
        this.depthLimit = depthLimit

        this.searchDepth = searchDepth

        this.alpha = Number.NEGATIVE_INFINITY;
        this.beta = Number.POSITIVE_INFINITY;
    }
}

/**
 * @param {SK.Surakarta} surakarta -
 * @returns {NegamaxContext} top-level context
 */
export function createContext (surakarta: SK.Surakarta): NegamaxContext {
    const context = negamaxContextPool.pop() || new NegamaxContext()

    context.init(
        surakarta,
        surakarta.turnPlayer,
        3
    )

    return context
}

/**
 * @param {SK.Surakarta} surakarta -
 * @param {SK.ai.NegamaxContext} parent -
 * @returns {NegamaxContext} child context
 */
export function createInheritedContext (surakarta: SK.Surakarta, parent: NegamaxContext): NegamaxContext {
    const context = negamaxContextPool.pop() || new NegamaxContext()

    context.surakarta = surakarta
    context.playerId = parent.playerId === SK.BLACK_PLAYER ? SK.RED_PLAYER : SK.BLACK_PLAYER

    context.searchDepth = parent.searchDepth + 1
    context.depthLimit = parent.depthLimit

    context.alpha = -parent.beta
    context.beta = -parent.alpha

    return context
}
