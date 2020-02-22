import * as SK from "surakarta";
import { Finder, PebbleMoves, evaluate as heuristic } from "surakarta-analysis";
import { createInheritedContext, SearchContext } from "./SearchContext";
import { hash } from "./mem";

class Aggregate {
  arr: PebbleMoves[];

  constructor() {
    this.arr = [];
  }

  push(moves: PebbleMoves): void {
    this.arr.push(moves);
  }

  forEach(callback: any): void {
    this.arr.forEach(moves => moves.forEach(callback));
  }

  static from(context: SearchContext): Aggregate {
    const { surakarta, playerId } = context;
    const movesArray = new Aggregate();

    for (let i = 0; i < 36; i++) {
      if (surakarta.states[i] === playerId) {
        movesArray.push(
          Finder.exploreAll(
            surakarta,
            new SK.Position(Math.floor(i / 6), i % 6)
          )
        );
      }
    }

    return movesArray;
  }
}

const surakartaPool: Array<SK.Surakarta> = [];

/**
 * @param {SearchContext} context -
 * @returns {SK.Move | number} -
 */
export function search(context: SearchContext): SK.Move | number {
  const { surakarta, playerId, searchDepth, depthLimit } = context;

  if (searchDepth === depthLimit) {
    return (2 * playerId - 1) * heuristic(surakarta);
  }

  // Check cache-table if this position has been evaluated.
  let hit;
  const hashCode = hash(surakarta);
  if (context.common.cache && searchDepth > 0) {
    hit = context.common.cache.hit(hashCode);

    if (typeof hit === "number") {
      return hit;
    }
  }

  const childState = surakartaPool.pop() || new SK.Surakarta(true);
  childState.copyFrom(surakarta);
  childState.turn = surakarta.turn;

  const movesIterable = Aggregate.from(context);
  let bestMove = null;
  let bestValue = Number.NEGATIVE_INFINITY;

  let stopped = false;
  let counter = 0;

  movesIterable.forEach((move: SK.Move) => {
    if (stopped) {
      return;
    }

    childState.step(
      move.srcRow,
      move.srcColumn,
      move.dstRow,
      move.dstColumn,
      true,
      move.isAttack
    );
    ++childState.turn;

    const value = -search(createInheritedContext(childState, context));

    if (value > bestValue) {
      if (searchDepth === 0) {
        bestMove = move.clone();
      }
      bestValue = value;
    }

    context.alpha = Math.max(context.alpha, value);

    if (context.alpha >= context.beta) {
      stopped = true; /* alpha/beta cutoff */
    }

    childState.copyFrom(surakarta);
    --childState.turn;
    ++counter;
  });

  if (searchDepth === 0) {
    return bestMove;
  }

  if (hit) {
    hit.feed(hashCode, bestValue, searchDepth);
  }

  context.destroy();
  return bestValue;
}
