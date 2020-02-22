import { SearchContext } from "../SearchContext";
import { expose } from "threads/worker";
import { Subject, Observable } from "threads/observable";
import { search } from "../search";
import * as SK from "surakarta";
import { performance } from "perf_hooks";

let depth: Subject<number>;
let progress: Subject<number>;

const zygoteTemplate = {
  exec(context: SearchContext): SK.Move {
    context = SearchContext.postThreadBoundary(context);
    depth = new Subject();
    progress = new Subject();

    const result = search(context);
    return result;
  },
  depth(): Observable<number> {
    return Observable.from(depth);
  },
  progress(): Observable<number> {
    return Observable.from(progress);
  },
  test(): number {
    return 234;
  }
};

export type ZygoteThread = typeof zygoteTemplate;
expose(zygoteTemplate);
