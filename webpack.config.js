const path = require('path');
const slsw = require('serverless-webpack');
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const entries = {};

Object.keys(slsw.lib.entries).forEach(
  (key) => (entries[key] = ['./source-map-install.js', slsw.lib.entries[key]])
);

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: entries,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      // '@': path.join(__dirname, 'src'),
      '~': path.resolve(__dirname, 'src/')
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  externals: [
    {
      'nock': 'commonjs2 nock',
      'mock-aws-s3': 'commonjs2 mock-aws-s3'
    }
  ],
};
