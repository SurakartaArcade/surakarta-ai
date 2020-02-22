import * as SK from "surakarta";
import { search } from "./search";
import { createContext } from "./SearchContext";
import { spawn, Worker, Thread } from "threads";
import { ZygoteThread } from "./parallel";

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
  const zygote = await spawn<ZygoteThread>(
    new Worker("./parallel/ZygoteThread.worker.ts")
  );

  const result = await zygote.exec(createContext(surakarta));

  await Thread.terminate(zygote);
  return result;
}

export default {
  suggestPlay
};
