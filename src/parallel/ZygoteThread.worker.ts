import { SearchContext } from "../SearchContext";
import { expose } from "threads/worker";
import { Subject, Observable } from "threads/observable";
import { search } from "../search";
import * as SK from "surakarta";

// Each exec() call to ZygoteThread will have an active ZygoteRequest
// parallel to it.
class ZygoteRequest {
  id: number;

  depth: Subject<number>;
  progress: Subject<number>;

  static requestPool: ZygoteRequest[] = [];
  static requestMap = {};

  constructor() {
    this.id = -1;
    this.depth = null;
    this.progress = null;
  }

  init(id: number): ZygoteRequest {
    if (ZygoteRequest.requestMap[id]) {
      throw new Error(
        "Cannot initate ZygoteRequest due to request-handle collision"
      );
    }

    this.id = id;
    this.depth = new Subject();
    this.progress = new Subject();

    ZygoteRequest.requestMap[id] = this;

    return this;
  }

  destroy(): void {
    ZygoteRequest.requestMap[this.id] = null;
    ZygoteRequest.requestPool.push(this);
  }

  static init(context: SearchContext): ZygoteRequest {
    return (ZygoteRequest.requestPool.pop() || new ZygoteRequest()).init(
      context.common.requestHandle
    );
  }
}

const acceptRequests = true;

const zygoteTemplate = {
  /**
   * Runs the negamax search for an optimal move on a zygote thread. To access
   * runtime information, save the {@code requestHandle} at from
   * {@code context.common.requestHandle}.
   *
   * @param {SearchContext} context - initiation context
   * @returns {SK.Move} optimal move
   */
  exec(context: SearchContext): SK.Move {
    if (!acceptRequests) {
      throw new Error("ZygoteThread is now dormant.");
    }

    context = SearchContext.postThreadBoundary(context);
    ZygoteRequest.init(context);

    return search(context);
  },
  depth(requestHandle: number): Observable<number> {
    return Observable.from(ZygoteRequest.requestMap[requestHandle]?.depth);
  },
  progress(requestHandle: number): Observable<number> {
    return Observable.from(ZygoteRequest.requestMap[requestHandle]?.progress);
  }
};

export type ZygoteThread = typeof zygoteTemplate;
expose(zygoteTemplate);
