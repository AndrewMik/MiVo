let path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

let conf = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    // publicPath: '/dist/'
  },
  devServer: {
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        //exclude: '/node_modules/'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          //fallback: "style-loader",
          use: "css-loader"
        })
        // use: [
        //   'style-loader',
        //   'css-loader'
        // ]

      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css"),
    new HtmlWebpackPlugin({
      title: 'MiVo',
      filename: 'index.html',
      template: 'src/index.html'
    })
  ]
};

module.exports = (env, options) => {
  let production = options.mode === 'production';

  conf.devtool = production ? 'source-map' : 'eval-sourcemap';

  return conf;
};