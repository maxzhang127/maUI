import { Configuration } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import path from "path";
import "webpack-dev-server";

const config: Configuration = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    mode: "production",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.ts$/,
                use: "ts-loader",
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                    minimize: {
                        removeComments: true,
                        collapseWhitespace: true,
                        minifyCSS: false,
                        minifyJS: true,
                    },
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "bundle.css",
        }),
    ],
    optimization: {
        minimizer: [new CssMinimizerPlugin()],
    },
};

export default config;
