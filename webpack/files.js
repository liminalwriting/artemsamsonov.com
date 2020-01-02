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
                outputPath: paths
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use:  [
            {
              loader:  'file-loader',
              options: {
                name:       '[name].[ext]',
                outputPath: 'type/'
              }
            }
          ]
        }
      ]
    }
  };
};
