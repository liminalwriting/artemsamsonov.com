const gulp = require('gulp');
const sitemap = require('gulp-sitemap');
const rename = require('gulp-rename');
const fs = require('fs');

// Укажи домен
const SITE_URL = 'https://artemsamsonov.com';

// sitemap.xml
gulp.task('sitemap', function () {
    return gulp.src('docs/**/*.html', { read: false })
        .pipe(sitemap({
            siteUrl: SITE_URL,
            changefreq: 'monthly',
            priority: 0.9,
            getLoc(siteUrl, file) {
                const relativePath = file.relative.replace(/\\/g, '/');
                const url = relativePath === 'index.html' ? '' : relativePath.replace(/\.html$/, '');
                return `${siteUrl}/${url}`;
            }
        }))
        .pipe(gulp.dest('docs'));
});

// robots.txt
gulp.task('robots', function () {
    return gulp.src('src/robots.template.txt')
        .pipe(rename('robots.txt'))
        .pipe(gulp.dest('docs'));
});

// manifest.json
gulp.task('manifest', function (done) {
    const manifest = {
        name: "Артём Самсонов — Продуктовый дизайнер",
        short_name: "artemsamsonov",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: []
    };

    fs.writeFileSync('docs/manifest.json', JSON.stringify(manifest, null, 2));
    done();
});

// Комбо-задача
gulp.task('seo', gulp.parallel('sitemap', 'robots', 'manifest'));