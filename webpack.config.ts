import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration } from 'webpack';
import 'webpack-dev-server';
import NpmDtsPlugin from 'npm-dts-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = (_env: any, argv: { mode: string }): Configuration => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      index: './src/demo/index.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      library: {
        name: 'maUI',
        type: 'umd',
        export: 'default'
      },
      globalObject: 'this',
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@tpl/*.html': path.resolve(__dirname, 'src/components/*/template.html')
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: [
            /node_modules/,
            /__tests__/,
            /\.test\./,
            /\.spec\./
          ]
        },
        // SCSS 作为字符串导入 (用于 Web Components Shadow DOM)
        {
          test: /\.s[ac]ss$/i,
          resourceQuery: /inline/,
          use: [
            {
              loader: 'to-string-loader'
            },
            {
              loader: 'css-loader',
              options: {
                exportType: 'string'
              }
            },
            {
              loader: 'sass-loader',
              options: {
                api: 'modern'
              }
            }
          ]
        },
        // Demo 样式文件 (不使用 CSS 模块)
        {
          test: /\.s[ac]ss$/i,
          include: path.resolve(__dirname, 'src/demo'),
          resourceQuery: { not: [/inline/] },
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern'
              }
            }
          ]
        },
        // 组件样式文件 (使用 CSS 模块)
        {
          test: /\.s[ac]ss$/i,
          exclude: path.resolve(__dirname, 'src/demo'),
          resourceQuery: { not: [/inline/] },
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isProduction
                    ? '[hash:base64:8]'
                    : '[name]__[local]__[hash:base64:5]'
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                api: 'modern'
              }
            }
          ]
        },
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            esModule: false
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/demo/index.html',
        filename: 'index.html',
        chunks: ['index']
      }),
      ...(isProduction
        ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
          }),
          new (NpmDtsPlugin as any)({
            entry: './src/components.ts',
            output: './dist/components.d.ts'
          })
        ]
        : []
      )
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      port: 3001,
      hot: true,
      open: false
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map'
  };
};

export default config;