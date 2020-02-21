module.exports = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/,
          use:  [
            {
              loader:  'file-loader',
              options: {
                name:       '[name].[ext]',
                outputPath: './img'
              }
            }
          ]
        }
      ]
    }
  };
};
