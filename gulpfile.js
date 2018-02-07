/* 引入与 gulp 处理相关的模块 */
var gulp = require("gulp");

var less = require("gulp-less");
var minify = require("gulp-minify-css");
var cleanCss = require("gulp-clean-css");
var autoprefixer = require("gulp-autoprefixer");

var uglify = require("gulp-uglify");

var concat = require("gulp-concat");
var rename = require("gulp-rename");
var clean = require("gulp-clean");
var sourcemaps = require("gulp-sourcemaps");
var plumber = require("gulp-plumber");

var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");
var cache = require("gulp-cache");

var config = require("./src/config/config.json");

/* 生成并输出 HTML 文件 */
gulp.task("html", function () {
    /* 引入与页面生成相关的模块 */
    var themeConfig = require("./src/theme/" + config.theme + "/themeConfig.json");
    // 加载博客信息
    var posts = require("./src/draft/description").posts;
    var pages = require("./src/draft/description").pages;
    var generator = require("./src/theme/" + config.theme + "/generate");

    generator.generate(posts, pages, config, themeConfig);
});

/* CSS 压缩、合并、重命名、添加浏览器前缀、输出 */
gulp.task("css", function () {

    gulp.src("./src/theme/" + config.theme + "/css/*.css")
        .pipe(concat("deploy.min.css"))
        .pipe(minify())
        .pipe(gulp.dest("./dist/css"));

});

/* JavaScript 文件的压缩、合并、输出 */
gulp.task("js", function () {

});

/* 图片文件的压缩与输出 */
gulp.task("img", function () {

    gulp.src("./src/out/attachment/*.{png,jpg,gif}")
        .pipe(cache(
            imagemin({
                progressive: true,
                use: [pngquant()]
            })
        ))
        .pipe(gulp.dest("./dist/attachement"));

});