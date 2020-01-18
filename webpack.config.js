const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
      main: './site/assets/index.js',
  },
  output: {
    filename: './assets/[name].js',
    chunkFilename: './assets/[id].js',
    path: path.resolve(__dirname, 'dist/')    
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    new AssetsPlugin({
        filename: './dist/assets/webpack.json',
        prettyPrint: true
      }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
        { from: 'site', to: './', ignore: ['*.js', '*.css'] },
    ]),
    new MiniCssExtractPlugin({
        filename: './assets/[name].css',
        chunkFilename: './assets/[id].css'
    })
  ]
};