var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var path = require("path");

var location = {
  protocol: "http://",
  host: "localhost",
  port: 8080,
  open: true
};

var serverUrl = `${location.protocol}${location.host}:${location.port}`;

var config = {
  entry: {
    "examples/list/index": "./examples/list/index.js"
  },
  output: {
    path: path.join(__dirname, "../../dist"),
    filename: "[name].js",
    publicPath: "/"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "file?name=[path][name].html"
      }
    ]
  }
};

var server = new WebpackDevServer(webpack(config), {
  contentBase: config.output.path,
  hot: true,
  stats: {
    colors: true,
    chunkModules: false,
    assets: true
  },
  noInfo: true,
  historyApiFallback: true
});

server.listen(location.port, location.host, function() {
  console.log(`open ${serverUrl}/examples in your browser`);
});

module.exports = config;
