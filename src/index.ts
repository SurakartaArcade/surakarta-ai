import * as SK from "surakarta";
import { search } from "./search";
import { createContext } from "./SearchContext";

/**
 * @param {SK.Surakarta} surakarta - node to play for
 * @returns {SK.Move} - best move
 */
export function suggestPlay(surakarta: SK.Surakarta): SK.Move {
  return search(createContext(surakarta, { noCache: true })) as SK.Move;
}

export default {
  suggestPlay
};
