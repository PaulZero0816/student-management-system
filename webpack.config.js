const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

const outputDirectory = "dist";

const localProxySever = "http://[::1]:3000";

module.exports = (_, arg) => {
  return {
    mode: arg.mode,
    entry: {
      app: "./src/client/index.tsx",
    },
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: "[name].bundle.[hash].js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
    devtool: "hidden-source-map",
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules|__tests__/,
          use: [
            {
              loader: "awesome-typescript-loader",
              options: {
                useCache: true,
                useBabel: true,
                babelCore: "@babel/core",
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: "url-loader?limit=100000",
        },
      ],
    },
    devServer: {
      contentBase: "./src/client/public",
      port: 3000,
      open: true,
      proxy: {
        "/api/**": {
          target: localProxySever,
          secure: false,
          headers: {
            Connection: "keep-alive",
          },
        },
        "/auth/**": {
          target: localProxySever,
          secure: false,
          headers: {
            Connection: "keep-alive",
          },
        },
      },
      watchOptions: {
        ignored: [path.resolve(__dirname, "node_modules"), "**/__tests__/**/*"],
      },
      compress: true,
    },
    plugins: [
      new CleanWebpackPlugin([outputDirectory]),
      new HtmlWebpackPlugin({
        inject: "body",
        template: "./src/client/public/index.html",
        filename: "./index.html",
        favicon: "./src/client/public/logo.png",
        chunks: ["app"],
      }),
    ],
  };
};
