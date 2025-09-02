import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration } from 'webpack';
import 'webpack-dev-server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = (_env: any, argv: { mode: string }): Configuration => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      index: './src/index.ts',
      demo: './src/demo/index.ts'
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
        '@': path.resolve(__dirname, 'src')
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.s[ac]ss$/i,
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
                api: 'modern' // 使用现代 API
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
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/demo/index.html',
        filename: 'demo.html',
        chunks: ['demo']
      }),
      new HtmlWebpackPlugin({
        template: './demo.html',
        filename: 'index.html',
        chunks: ['demo']
      }),
      ...(isProduction 
        ? [new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
          })] 
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
      open: '/demo.html'
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