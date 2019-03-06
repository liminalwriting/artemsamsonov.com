const glob = require('glob');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(pathName, array) {
  let pugPages = glob.sync(`./src/pages/**/*.pug`);
  
  pugPages.forEach(function (file) {
    let base = path.basename(file, '.pug');
    array.push(
      new HtmlWebpackPlugin({
        filename: `./${base}.html`,
        template: `${pathName}/pages/${base}/${base}.pug`,
        inject:   true
      })
    );
  });
  return '';
};
