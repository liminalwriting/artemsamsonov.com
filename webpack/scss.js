const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (paths) {
  return {
    module: {
      rules: [
        {
          test:    /\.(sass|scss)$/,
          include: paths,
          use:     [
            {
              loader:  MiniCssExtractPlugin.loader,
              options: {
                outputPath: paths
              }
            },
            {
              loader:  'css-loader',
              options: {
                sourceMap: true,
                url:       false
              }
            },
            {
              loader:  'postcss-loader',
              options: {
                ident:     'postcss',
                sourceMap: true,
                plugins:   () => [
                  require('cssnano')({
                    preset: [
                      'default',
                      {
                        discardComments: {
                          removeAll: true
                        }
                      }
                    ]
                  })
                ]
              }
            },
            {
              loader:  'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }
      ]
    }
  };
};
