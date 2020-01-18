const merge = require("webpack-merge");
const common = require("./webpack.config.js");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    mode: "development",

    output: {
        filename: "assets/[name].js",
        chunkFilename: "assets/[id].js"
    },
    
    plugins: [
        new MiniCssExtractPlugin({
            filename: './assets/[name].css',
            chunkFilename: './assets/[id].css'
        })    
    ]
});