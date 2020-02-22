import * as SK from "surakarta";

// Pebble/position base hash codes
const baseCodes: number[][] = [];

let isInit = false;

export type HashCode = number;

/**
 * Initialize the zobrist hasher.
 */
export function initZobrist(): void {
  if (isInit) {
    return;
  }

  for (let player = -1; player <= 1; player++) {
    const playerHashes = new Array(36);

    for (let pos = 0; pos < 36; pos++) {
      playerHashes[pos] = Math.random() * (1 << 30);
    }

    baseCodes[player] = playerHashes;
  }

  isInit = true;
}

/**
 * @param {SK.Surakarta} node - node to hash
 * @returns {number} - hash code
 */
export function hash(node: SK.Surakarta): number {
  initZobrist();
  let hashCode = 0;

  for (let p = 0; p < 36; p++) {
    hashCode ^= baseCodes[node.states[p]][p];
  }

  return hashCode;
}
