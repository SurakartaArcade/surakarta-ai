import { RED_PLAYER, BLACK_PLAYER, Surakarta, Position } from 'surakarta'
import { Finder, evaluate as heuristic } from 'surakarta-analysis'
import { NegamaxContext } from './NegamaxContext'

export class SurakartaEngine {
    constructor (surakarta) {
        this.surakarta = surakarta

        this._negamaxContextPool = []
        //    this._positionPool = []
        this._surakartaPool = []
    }

    run () {
        return this._negamax(this._createContext(this.surakarta))
    }

    _createContext (surakarta) {
        const context = this._negamaxContextPool.pop() || new NegamaxContext()

        context.init(
            surakarta,
            surakarta.turnPlayer,
            4
        )

        return context
    }

    _createInheritedContext (surakarta, parent) {
        const context = this._negamaxContextPool.pop() || new NegamaxContext()

        context.surakarta = surakarta
        context.playerId = parent.playerId === BLACK_PLAYER ? RED_PLAYER : BLACK_PLAYER

        context.searchDepth = parent.searchDepth + 1
        context.depthLimit = parent.depthLimit

        return context
    }

    _aggregate (context) {
        const { surakarta, playerId } = context
        const movesArray = []

        for (let i = 0; i < 36; i++) {
            if (surakarta.states[i] === playerId) {
                movesArray.push(Finder.exploreAll(
                    surakarta,
                    new Position(Math.floor(i / 6), i % 6)
                ))
            }
        }

        // Fix this by creating an _aggregate_ in surakarta-analysis
        movesArray.forEach = function (callback) {
            for (let i = 0; i < movesArray.length; i++) {
                movesArray[i].forEach(callback)
            }
        }

        return movesArray
    }

    _negamax (context) {
        const { surakarta, playerId, searchDepth, depthLimit } = context

        if (searchDepth === depthLimit) {
            return (2 * playerId - 1) * (heuristic(surakarta))
        }

        const childState = this._surakartaPool.pop() || new Surakarta(true)
        childState.copyFrom(surakarta)
        childState.turn = surakarta.turn

        const movesIterable = this._aggregate(context)
        let bestMove = null
        let bestValue = Number.NEGATIVE_INFINITY

        movesIterable.forEach(move => {
            childState.step(
                move.srcRow, move.srcColumn,
                move.dstRow, move.dstColumn,
                true, move.isAttack)
            ++childState.turn

            const value = -this._negamax(this._createInheritedContext(childState, context))

            if (value > bestValue) {
                if (searchDepth === 0) {
                    bestMove = move.clone()
                }
                bestValue = value
            }

            childState.copyFrom(surakarta)
            --childState.turn
        })

        if (searchDepth === 0) {
            return bestMove
        }

        return bestValue
    }
}
