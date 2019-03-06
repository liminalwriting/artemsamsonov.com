const path = require('path');
const glob = require('glob');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const merge = require('webpack-merge');
const files = require('./webpack/files');
const pug = require('./webpack/pug');
const script = require('./webpack/script');
const scss = require('./webpack/scss');
const pugToHtml = require('./webpack/pug-to-html');

/* ПУТИ */
const PATHS = {
  dist:    path.join(__dirname, './dist'),
  distImg: path.join(__dirname, './dist/img'),
  src:     path.join(__dirname, './src'),
  img:     path.join(__dirname, './src/img'),
  styles:  path.join(__dirname, 'src/scss')
};

/* ПЛАГИНЫ */
let plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: './css/style.bundle.css'
  }),
  new CopyWebpackPlugin([
    {
      from: PATHS.img,
      to:   PATHS.distImg
    }
  ])
];

/* КОНВЕРТ PUG В HTML */
pugToHtml(PATHS.src);

/* MAIN */
const common = merge([
  {
    entry:       [`${PATHS.src}/js/index.js`, `${PATHS.src}/scss/imports.scss`],
    output:      {
      filename: './js/bundle.js',
      path:     PATHS.dist
    },
    devServer:   {
      overlay: true
    },
    plugins:     plugins,
    performance: {
      hints: false
    }
  },
  files(),
  pug(),
  script(),
  scss()
]);

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    return common;
  }
  return common;
};
