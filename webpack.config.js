module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
    loaders: [
      {
        test: /\.(ico|png|eot|svg|ttf|woff|woff2)$/,
        loader: 'file?name=[name]-[hash:6].[ext]',
      },
    ],
  },
};
