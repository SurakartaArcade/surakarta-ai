import peerDepsExternal from "rollup-plugin-peer-deps-external";
import ts from "rollup-plugin-typescript2";
import typescript from "typescript";

export default {
  input: {
    index: "src/index.ts",
    zygoteWorker: "src/parallel/ZygoteThread.worker.ts"
  },
  output: {
    dir: "bundles",
    format: "esm"
  },
  plugins: [peerDepsExternal(), ts({ typescript })]
};
