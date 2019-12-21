const path = require('path')

module.exports = () => ({
  mode: 'production',
  target: 'web',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: ["react"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
})
