const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = () => {
  return {
    entry: {
      index: ["./demo/index.js"]
    },
    output: {
      path: path.resolve(__dirname + "/build"),
      filename: "[name].js"
    },
    devServer: {
      stats: "minimal"
    },
    node: {
      fs: "empty"
    },
    module: {
      rules: [
        {
          test: require.resolve("react"),
          loader: "expose-loader?React"
        },
        {
          test: require.resolve("react-dom"),
          loader: "expose-loader?ReactDOM"
        },
        {
          test: require.resolve("react-dom/server"),
          loader: "expose-loader?ReactDOMServer"
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ["babel-loader", "eslint-loader"]
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx", ".scss"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "demo/index.html"
      })
    ]
  };
};
