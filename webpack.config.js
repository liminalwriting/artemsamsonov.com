const path = require('path');
const glob = require('glob');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

let pugPages = glob.sync(__dirname + '/src/components/pages/**/*.pug');

let pugFilesList = [
  new MiniCssExtractPlugin({
    filename: './css/style.bundle.css'
  })
];

pugPages.forEach(function (file) {
  let base = path.basename(file, '.pug');
  pugFilesList.push(
    new HtmlWebpackPlugin({
      filename: `./${base}.html`,
      template: `./src/components/pages/${base}/${base}.pug`,
      inject:   true
    })
  );
});

module.exports = {
  entry:     ["./src/js/index.js", "./src/scss/style.scss"],
  output:    {
    filename:   './js/bundle.js',
    path:       path.resolve(__dirname, './dist'),
    publicPath: ''
  },
  module:    {
    rules: [
      {
        test:   /\.js$/,
        loader: 'babel-loader'
      },
      {
        test:    /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use:     [
          {
            loader:  MiniCssExtractPlugin.loader,
            options: {}
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
      },
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
      }]
  },
  devServer: {
    overlay: true
  },
  plugins:   pugFilesList
};
