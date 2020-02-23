import peerDepsExternal from "rollup-plugin-peer-deps-external";
import ts from "rollup-plugin-typescript2";
import replace from "@rollup/plugin-replace";
import typescript from "typescript";

export default {
  input: {
    index: "src/index.ts",
    "ZygoteThread.worker": "src/parallel/ZygoteThread.worker.ts"
  },
  output: {
    dir: "bundles",
    format: "esm"
  },
  plugins: [
    replace({
      [`new Worker("./parallel/ZygoteThread.worker.ts")`]: `new Worker("./ZygoteThread.js")`,
      delimiters: ["", ""]
    }),
    peerDepsExternal(),
    ts({ typescript })
  ]
};
