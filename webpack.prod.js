const merge = require("webpack-merge");
const common = require("./webpack.config.js");

const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = merge(common, {
    mode: "production",

    output: {
        filename: "assets/[name].[hash:5].js",
        chunkFilename: "assets/[id].[hash:5].js"
    },
    
    plugins: [
      new AssetsPlugin({
        filename: './site/assets/webpack.json',
        prettyPrint: true
      })
    ],

    optimization: {
        minimizer: [
          new MiniCssExtractPlugin({
            filename: "assets/[name].[hash:5].css",
            chunkFilename: "assets/[id].[hash:5].css"
          }),
    
          new OptimizeCSSAssetsPlugin({})
        ]
      }
});