let path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let conf = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    publicPath: 'dist/'
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
        // include: [
        //   path.resolve(__dirname, "../vasya/")
        // ],
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

      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css"),
  ]
};

module.exports = (env, options) => {
  let production = options.mode === 'production';

  conf.devtool = production ? 'source-map' : 'eval-sourcemap';

  return conf;
}