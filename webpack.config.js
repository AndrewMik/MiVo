let path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let conf = {
  entry: {
    landing: './src/landing/js/index.js',
    game: './src/game/js/index.js' 
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].main.js',
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
      },
      {
        test: /\.mp3$/,
        loader: 'file-loader'
        // test: /\.(ogg|mp3|wav|mpe?g)$/i,
        // use: 'file-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
        'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin("[name].style.css"),
    new HtmlWebpackPlugin({
      title: 'MiVo',
      filename: 'index.html',
      template: 'src/landing/index.html',
      chunks: ['landing']
    }),
    new HtmlWebpackPlugin({
      title: 'MiVo',
      filename: 'game.html',
      template: 'src/game/index.html',
      chunks: ['game']
    })
  ]
};

module.exports = (env, options) => {
  let production = options.mode === 'production';

  conf.devtool = production ? 'source-map' : 'eval-sourcemap';

  return conf;
};