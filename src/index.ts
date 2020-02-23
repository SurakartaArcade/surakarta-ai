import * as SK from "surakarta";
import { search } from "./search";
import { createContext } from "./SearchContext";
import { spawn, Worker, Thread } from "threads";
import { ZygoteThread } from "./parallel";

// All access to threads must pass through this.
const WorkerPortal = {
  _zygoteThread: null,

  zygoteThread(): Promise<ZygoteThread> {
    if (!this._zygoteThread) {
      this._zygoteThread = spawn<ZygoteThread>(
        new Worker("./parallel/ZygoteThread.worker.ts")
      );
    }

    return this._zygoteThread;
  }
};

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
  const zygote = await WorkerPortal.zygoteThread();
  const result = await zygote.exec(createContext(surakarta));

  return result;
}

/**
 * Destroys any resources held by this engine. It will terminate all threads
 * and requests without waiting for them to finish.
 */
export async function resetResources(): Promise<void> {
  if (WorkerPortal._zygoteThread) {
    Thread.terminate(await WorkerPortal._zygoteThread);
    WorkerPortal._zygoteThread = null;
  }
}

export default {
  suggestPlay
};
