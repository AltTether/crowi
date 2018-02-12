const path = require('path')
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  entry: {
    app:          path.join(__dirname, '/../client/app.js'),
    crowi:        path.join(__dirname, '/../client/crowi.js'),
    presentation: path.join(__dirname, '/../client/crowi-presentation.js'),
    form:         path.join(__dirname, '/../client/crowi-form.js'),
    admin:        path.join(__dirname, '/../client/crowi-admin.js'),
  },
  output: {
    path: path.join(__dirname, "/../public/js"),
    filename: "[name].js"
  },
  devtool: 'inline-source-map',
  resolve: {
    modules: [
      './node_modules', './client/thirdparty-js',
    ],
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
        }]
      },
    ]
  },
  plugins: [
  ],
};

if (!isProduction) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
  )
}
if (isProduction) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: false
      }
    })
  );
}

module.exports = config
