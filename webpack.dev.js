const path = require('path');
const merge = require("webpack-merge");
const common = require("./webpack.config.js");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    mode: "development",

    output: {
        filename: "assets/[name].js",
        chunkFilename: "assets/[id].js"
    },
    
    devServer: {
        port: process.env.PORT || 3000,
        contentBase: path.join(process.cwd(), "./dist"),
        watchContentBase: true,
        quiet: false,
        open: true,
        historyApiFallback: {
            rewrites: [
                {from: /./, to: "404.html"}
            ]
        }
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: './assets/[name].css',
            chunkFilename: './assets/[id].css'
        })    
    ]
});