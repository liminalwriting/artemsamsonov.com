module.exports = function () {
  return {
    module: {
      rules: [
        {
          test:    /\.pug$/,
          loaders: [
            {
              loader: 'html-loader'
            },
            {
              loader:  'pug-html-loader',
              options: {
                'pretty': true
              }
            }
          ]
        }
      ]
    }
  };
};
