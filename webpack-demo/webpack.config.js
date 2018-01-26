/**
 * Created by liweihong on 2018/1/18.
 */
const path = require('path');
const glob = require('glob');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCssPlugin = require('purifycss-webpack');
const entry = require('./webpack_config/entry_webpack.js');
const copyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');


if(process.env.type == 'build'){
  var website = {
    publicPath: 'http://jspang.com:1717'
  }
}else {
  var website = {
    publicPath: 'http://127.0.0.1:1717/'
  }
}
module.exports = {
  // source-map 独立 map 行 列 慢
  //
  // cheap-moudle-source-map 独立 map 行 不包括列 快一点
  //
  // eval-source-map 不独立 行 列  js 快 开发阶段 上线前要修改
  //
  // cheap-module-eval-source-map 列
  devtool: 'source-map',
  entry: entry.path,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: website.publicPath
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: "postcss-loader"
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'images/'
          }
        }]
      },
      {
        test: /\.(htm|html)$/i,
        use: ['html-withimg-loader']
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'less-loader'
          }],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],
          // 在开发环境使用 style-loader
          fallback: "style-loader"
        })
      },
      {
        test: /\.(jsx|js)$/,
        use:{
          loader: 'babel-loader',
        },
        exclude:/node_modules/
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['jquery','vue'],
      filename:'assets/js/[name].js',
      minChunks: 2
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    // new UglifyJsPlugin({
    //   test: /\.js($|\?)/i
    // }),
    new htmlPlugin({
      minify: {
        removeAttributeQuotes: true
      },
      hash: true,
      template: './src/index.html'
    }),
    new ExtractTextPlugin('css/index.css'),
    new PurifyCssPlugin({
      paths: glob.sync(path.join(__dirname,'src/*.html'))
    }),
    new webpack.BannerPlugin('jspang 版权所有'),
    new copyWebpackPlugin([{
      from:__dirname+'/src/public',
      to: './public'
    }]),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '127.0.0.1',
    compress: true,
    port: '1717'
  },
  // watchOptions:{
  //   poll: 1000,
  //   aggregeateTimeout: 500,
  //   ignored:/node_modules/,
  // },
  watchOptions:{
    //检测修改的时间，以毫秒为单位
    poll:1000,
    //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
    aggregateTimeout:500,
    //不监听的目录
    ignored:/node_modules/
  }
}