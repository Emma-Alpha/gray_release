import { defineConfig } from '@rspack/cli';
import { merge } from 'webpack-merge';
import { rspack } from '@rspack/core';
import baseConfig from './rspack.config.mjs';
import path from './paths.js';
import fs from 'fs';

const HOST = process.env.APP_HOST;
const PORT = process.env.APP_PORT;

// 存储构建进度
let progress = 0;
let status = '';
let detailInfo = '';
const hijackPage = true;

const handler = (percentage, statusMsg, info) => {
  status = statusMsg;
  progress = percentage;
  detailInfo = info;
};

export default merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',

  output: {
    filename: '[name].bundle.js',
    clean: false,
  },

  stats: 'errors-only',

  devServer: {
    // setupMiddlewares: (middlewares, devServer) => {
    //   if (!devServer) {
    //     throw new Error("rspack-dev-server is not defined");
    //   }

    //   const { app } = devServer;

    //   // 获取进度
    //   app.use("/__progress", (_req, res) => {
    //     res.json({ progress, status, detailInfo });
    //   });

    //   // 劫持所有路由
    //   app.get("*", (_req, res, next) => {
    //     if (progress < 1) {
    //       res.set("Content-Type", "text/html");
    //       const htmlPath = path.resolveApp(
    //         "./config/webpack/plugins/status.html"
    //       );
    //       const html = fs.readFileSync(htmlPath, { encoding: "utf-8" });
    //       res.send(html);
    //       return;
    //     }
    //     if (hijackPage) {
    //       let i = setInterval(() => {
    //         if (progress === 1) {
    //           clearInterval(i);
    //           hijackPage = false;
    //           next();
    //         }
    //       }, 300);
    //     } else {
    //       next();
    //     }
    //   });

    //   return middlewares;
    // },
    host: HOST,
    port: PORT,
    compress: true,
    historyApiFallback: true,
    hot: true,
    allowedHosts: 'all',
    client: {
      overlay: false,
      progress: true,
    },
  },

  module: {
    rules: [
      // Less 处理 - antd
      {
        test: /\.less$/,
        include: [/[\\/]node_modules[\\/].*antd/],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              lessOptions: {
                strictMath: false,
                math: 'always',
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      // Less 处理 - 项目文件
      {
        test: /\.less$/,
        include: [path.resolveApp('src')],
        exclude: [path.resolveApp('node_modules')],
        oneOf: [
          {
            test: /\.module\.less$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  modules: {
                    localIdentName: '[path][name]__[local]--[hash:base64:5]',
                  },
                  importLoaders: 2,
                },
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true,
                  lessOptions: {
                    javascriptEnabled: true,
                    math: 'always',
                  },
                },
              },
            ],
          },
          {
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true,
                  lessOptions: {
                    javascriptEnabled: true,
                  },
                },
              },
            ],
          },
        ],
      },
      // Sass 处理
      {
        test: /\.s[ac]ss$/i,
        include: [path.resolveApp('src')],
        exclude: [path.resolveApp('node_modules')],
        oneOf: [
          {
            test: /\.module\.s[ac]ss$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  modules: {
                    localIdentName: '[path][name]__[local]--[hash:base64:5]',
                  },
                  importLoaders: 2,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                  sassOptions: {
                    outputStyle: 'compressed',
                  },
                },
              },
            ],
          },
          {
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                  sassOptions: {
                    outputStyle: 'compressed',
                  },
                },
              },
            ],
          },
        ],
      },
      // CSS 处理 - TailwindCSS
      {
        test: /\.css$/,
        include: [path.resolveApp('src/index.css')],
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      // CSS 处理 - 其他 CSS
      {
        test: /\.css$/,
        include: [path.resolveApp('src'), path.resolveApp('node_modules')],
        exclude: [path.resolveApp('src/index.css')],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
});
