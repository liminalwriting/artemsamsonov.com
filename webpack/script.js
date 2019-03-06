module.exports = function () {
  return {
    module: {
      rules: [
        {
          test:   /\.js$/,
          loader: 'babel-loader'
        }
      ]
    }
  };
};
