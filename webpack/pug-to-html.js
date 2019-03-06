const glob = require('glob');

module.exports = function(path) {
  let pugPages = glob.sync(__dirname + `${path}/pages/**/*.pug`);
  
  pugPages.forEach(function (file) {
    let base = path.basename(file, '.pug');
    plugins.push(
      new HtmlWebpackPlugin({
        filename: `./${base}.html`,
        template: `${path}/pages/${base}/${base}.pug`,
        inject:   true
      })
    );
  });
  
  return pugPages;
};
