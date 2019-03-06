const path = require('path');
const glob = require('glob');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/* ПЛАГИНЫ */
let plugins = [
  new MiniCssExtractPlugin({
    filename: './css/style.bundle.css'
  }),
  new CopyWebpackPlugin([
    {
      from: './src/img',
      to:   './img'
    }
  ])
];

/* PUG → HTML  */

// получаем список pug-файлов
let pugPages = glob.sync(__dirname + '/src/components/pages/**/*.pug');

// цикл, который берёт список pug-файлов и создаёт плагины для генерации html
pugPages.forEach(function (file) {
  let base = path.basename(file, '.pug');
  plugins.push(
    new HtmlWebpackPlugin({
      filename: `./${base}.html`,
      template: `./src/components/pages/${base}/${base}.pug`,
      inject:   true
    })
  );
});

/* MAIN */
const config = {
  entry:     ['./src/js/index.js', './src/scss/main.scss'],
  output:    {
    filename: './js/bundle.js',
    path:     path.resolve(__dirname, './dist')
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
  plugins:   plugins
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    plugins.push(new CleanWebpackPlugin());
  }
  return config;
};
