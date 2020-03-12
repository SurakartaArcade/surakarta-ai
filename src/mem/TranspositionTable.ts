import * as SK from "surakarta";
import { HashCode, initZobrist, hash } from "./ZobristHasher";

interface TableOptions {
  nodeLimit: number;
}

// eslint-disable-next-line jsdoc/require-jsdoc
function npow2(n: number): number {
  return 1 << (31 - Math.clz32(n));
}

export class TTEntry {
  key: HashCode;
  value: number;
  depth: number;
  lastHit: DOMHighResTimeStamp;

  constructor() {
    this.key = -1;
    this.value = 0;
    this.depth = 0;
    this.lastHit = 0;
  }

  get weight(): number {
    return -this.depth - 2 * (performance.now() - this.lastHit);
  }

  feed(key: HashCode, value: number, depth: number): void {
    if (this.weight > -depth) {
      return; // don't feed less valuable entry
    }

    this.key = key;
    this.value = value;
    this.depth = depth;
    this.lastHit = performance.now();
  }

  hit(): number {
    this.lastHit = performance.now();
    return this.value;
  }
}

export class TranspositionTable {
  nodeLimit: number;
  buckets: TTEntry[][];

  constructor(options: TableOptions) {
    this.nodeLimit = npow2(options.nodeLimit);

    const size = Math.floor(this.nodeLimit / 3);
    this.buckets = new Array(size);
    for (let i = 0; i < size; i++) {
      this.buckets[i] = new Array(3);

      for (let j = 0; j < 3; j++) {
        this.buckets[i][j] = new TTEntry();
      }
    }

    initZobrist();
  }

  hit(key: HashCode, willFeed = true): number | TTEntry {
    const bucket = this.buckets[key % this.buckets.length];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key == key) {
        return bucket[i].hit();
      }
    }

    if (willFeed) {
      let worstEntry = bucket[0];

      for (let i = 1; i < bucket.length; i++) {
        const entry = bucket[i];

        if (entry.weight < worstEntry.weight) {
          worstEntry = entry;
        }
      }

      return worstEntry;
    }

    return null;
  }
}
