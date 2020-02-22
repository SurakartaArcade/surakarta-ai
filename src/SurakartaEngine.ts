import * as SK from "surakarta";
import { Finder, evaluate as heuristic } from "surakarta-analysis";
import {
  SearchContext,
  createContext,
  createInheritedContext
} from "./SearchContext";

const surakartaPool: Array<SK.Surakarta> = [];

/**
 * @param {SearchContext} context
 * @returns {Array}
 */
function aggregate(context: SearchContext): object[] {
  const { surakarta, playerId } = context;
  const movesArray = [];

  for (let i = 0; i < 36; i++) {
    if (surakarta.states[i] === playerId) {
      movesArray.push(
        Finder.exploreAll(surakarta, new SK.Position(Math.floor(i / 6), i % 6))
      );
    }
  }

  // Fix this by creating an _aggregate_ in surakarta-analysis
  movesArray.forEach = function(callback) {
    for (let i = 0; i < movesArray.length; i++) {
      movesArray[i].forEach(callback);
    }
  };

  return movesArray;
}

/**
 * @param {SearchContext} context
 * @returns {SK.Move | number}
 */
function negamax(context: SearchContext): SK.Move | number {
  const { surakarta, playerId, searchDepth, depthLimit } = context;

  if (searchDepth === depthLimit) {
    return (2 * playerId - 1) * heuristic(surakarta);
  }

  const childState = surakartaPool.pop() || new SK.Surakarta(true);
  childState.copyFrom(surakarta);
  childState.turn = surakarta.turn;

  const movesIterable = aggregate(context);
  let bestMove = null;
  let bestValue = Number.NEGATIVE_INFINITY;

  movesIterable.forEach((move: SK.Move) => {
    childState.step(
      move.srcRow,
      move.srcColumn,
      move.dstRow,
      move.dstColumn,
      true,
      move.isAttack
    );
    ++childState.turn;

    const value = -negamax(createInheritedContext(childState, context));

    if (value > bestValue) {
      if (searchDepth === 0) {
        bestMove = move.clone();
      }
      bestValue = value;
    }

    childState.copyFrom(surakarta);
    --childState.turn;
  });

  if (searchDepth === 0) {
    return bestMove;
  }

  return bestValue;
}

/**
 * @param {SK.Surakarta} surakarta -
 * @returns {SK.Move} best move computed by the engine
 */
export function suggestPlay(surakarta: SK.Surakarta): SK.Move {
  return negamax(createContext(surakarta)) as SK.Move;
}

export default {
  suggestPlay
};
