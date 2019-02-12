/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  entry: './worker.js',
  output: {
    filename: 'worker.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }],
      },
    ],
  },
  resolve: {
    alias: {
      // Stop bundling a huge and unnecessary esprima module
      // https://github.com/nodeca/js-yaml/pull/435
      'js-yaml$': path.resolve(
        __dirname,
        'node_modules/js-yaml/dist/js-yaml.min.js'
      ),
    },
    extensions: ['.js', '.ts'],
  },
}
