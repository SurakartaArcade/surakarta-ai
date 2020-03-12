import * as SK from "surakarta";
import { search } from "./search";
import { createContext } from "./SearchContext";

/**
 * @param {SK.Surakarta} surakarta - node to play for
 * @returns {SK.Move} - best move
 */
export function suggestPlay(surakarta: SK.Surakarta): SK.Move {
  return search(createContext(surakarta)) as SK.Move;
}

/**
 * @param {SK.Surakarta} surakarta - surakarta
 */
export async function play(surakarta: SK.Surakarta): Promise<SK.Move> {
  return search(createContext(surakarta)) as SK.Move;
}

/**
 * Destroys any resources held by this engine. It will terminate all threads
 * and requests without waiting for them to finish.
 */
export async function resetResources(): Promise<void> {}

export default {
  suggestPlay
};

export const AI = { suggestPlay };
