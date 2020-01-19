const path = require('path');
const glob = require('glob');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const merge = require('webpack-merge');
const pug = require('./webpack/pug');
const script = require('./webpack/script');
const scss = require('./webpack/scss');
const pugToHtml = require('./webpack/pug-to-html');

/* ПУТИ */
const PATHS = {
  src:       path.join(__dirname, './src'),
  dist:      path.join(__dirname, './docs'),
  img:       path.join(__dirname, './src/img'),
  distImg:   path.join(__dirname, './docs/img'),
  styles:    path.join(__dirname, './src/scss'),
  fonts:     path.join(__dirname, './src/fonts'),
  distFonts: path.join(__dirname, './docs/fonts')
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
    },
    {
      from: PATHS.fonts,
      to:   PATHS.distFonts
    },
    {
      from:   './.htaccess',
      to:     '.htaccess',
      toType: 'file'
    }
  ])
];

/* КОНВЕРТ PUG В HTML */
pugToHtml(PATHS.src, plugins);

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
