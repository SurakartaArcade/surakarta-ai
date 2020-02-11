import { NOT_FILLED } from 'surakarta'

/**
 * Pooled object used for recursive communication in the negamax algorithm.
 */
export class NegamaxContext {
    constructor () {
        this.surakarta = null
        this.playerId = NOT_FILLED

        this.searchDepth = 0
        this.depthLimit = 0
    }

    /**
     * @param {SK.Surakarta} surakarta
     * @param {number} playerId - (RED = 0, BLACK = 1)
     * @param {number} depthLimit - no. of nodes deep the algorithm should explore moves
     * @param {number}[searchDepth=0] - current search depth of the algorithm
     */
    init (surakarta, playerId, depthLimit, searchDepth = 0) {
        this.surakarta = surakarta
        this.playerId = playerId
        this.depthLimit = depthLimit

        this.searchDepth = searchDepth
    }
}
