const path = require("path"); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "index.bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: "SKAI",
    libraryTarget: "umd"
  },
  externals: {
    surakarta: {
      commonjs: "surakarta",
      commonjs2: "surakarta",
      amd: "surakarta",
      root: "_"
    },
    "surakarta-analysis": {
      commonjs: "surakarta-analysis",
      commonjs2: "surakarta-analysis",
      amd: "surakarta-analysis",
      root: "_"
    }
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ["ts-loader"]
      },
      {
        test: /\.worker\.ts?$/,
        use: [
          {
            loader: "worker-loader",
            options: {
              fallback: false,
              inline: true
            }
          },
          "ts-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};
