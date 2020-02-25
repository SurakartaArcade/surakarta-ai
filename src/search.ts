import * as SK from "surakarta";
import {
  Finder,
  PebbleMoves,
  evaluate as heuristic,
  Indexer,
  MoveHelper
} from "surakarta-analysis";
import { createInheritedContext, SearchContext } from "./SearchContext";
import { hash } from "./mem";

const { inflateHandle } = MoveHelper;

// Simple wrapper around the Indexer's index-buffer that inflates the
// move-handles in a forEach loop.
class Aggregate {
  indexed: number[];

  constructor() {
    this.indexed = [];
  }

  get length() {
    return this.indexed.length;
  }

  forEach(callback: Function): void {
    const moveTarget = new SK.Move();

    this.indexed.forEach(moveHandle => {
      callback(inflateHandle(moveHandle, moveTarget));
    });
  }

  static from(context: SearchContext): Aggregate {
    const { surakarta } = context;
    const movesArray = new Aggregate();

    Indexer.index(surakarta, movesArray.indexed);

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
