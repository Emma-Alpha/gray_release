import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import path from './paths.js';
import fs from 'fs';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import dotenv from 'dotenv';
import { createRequire } from 'module';

// 创建 require 函数用于 require.resolve
const require = createRequire(import.meta.url);

// 复用现有的环境变量加载逻辑
dotenv.config({ path: path.resolveApp('./config/env/.env.public') });

let extraConfig = {};
try {
  const envFile = path.resolveApp(`./config/env/.env.${process.env.NODE_ENV}`);
  if (fs.existsSync(envFile)) {
    extraConfig = dotenv.parse(fs.readFileSync(envFile));
  }
} catch (error) {
  console.warn('环境变量文件读取失败:', error.message);
}

for (const key in extraConfig) {
  process.env[key] = extraConfig[key];
}

const APP_CNAME = process.env.APP_CNAME || 'Chat应用';
const APP_NAME = process.env.APP_NAME || 'chat';
const OUTPUT_PATH = process.env.OUTPUT_PATH || 'dist';
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

export default defineConfig({
  entry: [path.resolveApp('./src/index')],

  resolve: {
    extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolveApp('./src'),
      '@config': path.resolveApp('./config'),
      '@store': path.resolveApp('./store'),
      '@locales': path.resolveApp('./locales'),
    },
    fallback: {
      path: require.resolve('path-browserify'),
      process: require.resolve('process/browser.js'),
      buffer: require.resolve('buffer'),
      util: require.resolve('util'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      zlib: require.resolve('browserify-zlib'),
      querystring: require.resolve('querystring-es3'),
      url: require.resolve('url'),
      assert: require.resolve('assert'),
      fs: false,
      net: false,
      tls: false,
      os: false,
      https: false,
      http: false,
    },
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: [
          path.resolveApp('src'),
          path.resolveApp('config'),
          path.resolveApp('store'),
          path.resolveApp('packages'),
        ],
        exclude: [path.resolveApp('node_modules')],
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  decorators: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
                target: 'es2015',
              },
              sourceMaps: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp|m3u8|exr|hdr|json)$/,
        include: [path.resolveApp('config')],
        exclude: [path.resolveApp('src'), path.resolveApp('store')],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.md$/,
        include: [path.resolveApp('src')],
        type: 'asset/source',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },

  plugins: [
    new rspack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
    new rspack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
      // ["__CONVENTION_ROUTES__"]: JSON.stringify([]),
    }),
    new rspack.HtmlRspackPlugin({
      template: path.resolveApp('./config/public/index.html'),
      filename: 'index.html',
      inject: 'body',
      hash: true,
      minify: process.env.NODE_ENV === 'production',
      favicon: path.resolveApp('./config/public/favicon.ico'),
      templateParameters: {
        title: APP_CNAME,
        mountRoot: APP_NAME,
      },
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: path.resolveApp('./config/public/images'),
          to: 'public/images',
        },
      ],
    }),
    process.env.RSDOCTOR &&
      new RsdoctorRspackPlugin({
        // 插件选项
      }),
    // new RoutesConventionsRspackPlugin({
    //   base: "src/pages",
    //   exclude: [
    //     /\/components?\//,
    //     /\/models\//,
    //     /\/utils?\//,
    //     /^_/,
    //     /\.d\.ts$/,
    //     /\.(test|spec|e2e)\.(ts|tsx|js|jsx)$/,
    //   ],
    // }),
  ],

  output: {
    assetModuleFilename: 'images/[hash][ext]',
    library: `${APP_CNAME}-[name]`,
    chunkFilename: '[name].[contenthash].js',
    libraryTarget: 'umd',
    globalObject: 'window',
    chunkLoadingGlobal: `chunk_global_${APP_NAME}`,
    publicPath: PUBLIC_PATH,
    path: path.resolveApp(OUTPUT_PATH),
  },

  ignoreWarnings: [
    {
      module: /@testing-library\/react/,
      message: /export 'act'/,
    },
  ],

  devtool: 'source-map',
});
