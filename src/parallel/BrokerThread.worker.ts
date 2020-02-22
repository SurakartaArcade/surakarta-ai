import { SearchContext } from "../SearchContext";
import { expose } from "threads/worker";
import { search } from "../search";

expose({
  search(context: SearchContext) {
    return search(context);
  }
});
