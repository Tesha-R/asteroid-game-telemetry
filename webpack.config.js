const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file for local development
dotenv.config();

module.exports = {
  entry: './public/scripts/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.HONEYCOMB_API_KEY': JSON.stringify(
        process.env.HONEYCOMB_API_KEY
      ),
    }),
  ],
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
    },
  },
};
