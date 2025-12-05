import { defineConfig } from '@rspack/cli';
import { merge } from 'webpack-merge';
import { rspack } from '@rspack/core';
import baseConfig from './rspack.config.mjs';
import path from './paths.js';
import { sentryWebpackPlugin } from '@sentry/webpack-plugin';

export default merge(baseConfig, {
  mode: 'production',
  devtool: 'hidden-source-map',

  output: {
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true,
  },

  module: {
    rules: [
      // Less 处理 - antd
      {
        test: /\.less$/,
        include: [
          /[\\/]node_modules[\\/].*antd/,
          /[\\/]node_modules[\\/]@4399ywkf[\\/]design/,
        ],
        use: [
          {
            loader: rspack.CssExtractRspackPlugin.loader,
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
                loader: rspack.CssExtractRspackPlugin.loader,
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
                  },
                },
              },
            ],
          },
          {
            use: [
              {
                loader: rspack.CssExtractRspackPlugin.loader,
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
                loader: rspack.CssExtractRspackPlugin.loader,
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
                loader: rspack.CssExtractRspackPlugin.loader,
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
        use: [
          {
            loader: rspack.CssExtractRspackPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
        ],
      },
      // CSS 处理 - src 目录中的其他 CSS
      {
        test: /\.css$/,
        include: [path.resolveApp('src')],
        exclude: [path.resolveApp('src/index.css')],
        use: [
          {
            loader: rspack.CssExtractRspackPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      // CSS 处理 - node_modules
      {
        test: /\.css$/,
        include: [path.resolveApp('node_modules')],
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

  plugins: [
    new rspack.CssExtractRspackPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
    }),

    // Sentry 插件 (仅生产环境)
    process.env.SENTRY_ENABLED === 'true' &&
      process.env.SENTRY_AUTH_TOKEN &&
      sentryWebpackPlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        url: process.env.SENTRY_URL,
        errorHandler: () => false,
      }),
  ].filter(Boolean),

  optimization: {
    minimize: true,
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({
        exclude: [path.resolveApp('node_modules')],
        minimizerOptions: {
          compress: {
            pure_funcs: ['console.info', 'console.debug', 'console.warn'],
            drop_console: false,
            drop_debugger: false,
          },
          mangle: {
            reserved: [
              'Sentry',
              'initSentry',
              'captureException',
              'captureMessage',
            ],
          },
        },
      }),
      new rspack.LightningCssMinimizerRspackPlugin(),
    ],
  },
});
