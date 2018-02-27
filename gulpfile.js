/* 引入与 gulp 处理相关的模块 */
var gulp = require("gulp");

/* Less 文件的编译与处理 */
var less = require("gulp-less");
var cleanCSS = require("gulp-clean-css");
var autoprefixer = require("gulp-autoprefixer");

/* JavaScript 文件压缩 */
var uglify = require("gulp-uglify");

/* 图像处理包 */
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");
var cache = require("gulp-cache");

/* 通用工具包 */
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var sourcemaps = require("gulp-sourcemaps");
var plumber = require("gulp-plumber");
var del = require("del");
var fse = require("fs-extra");

/* 主题设置 */
var config = require("./src/config/config.json");
var themePath = "./src/theme/" + config.theme;

/* 生成并输出 HTML 文件 */
gulp.task("html", function () {
    /* 引入与页面生成相关的模块 */
    var themeConfig = require(themePath + "/themeConfig.json");
    // 加载博客信息
    var posts = require("./src/draft/description").posts;
    var pages = require("./src/draft/description").pages;
    var generator = require("./src/theme/" + config.theme + "/generate");

    generator.generate(posts, pages, config, themeConfig);

    /* 复制生成的 HTML 文件 */
    gulp.src("./src/out/html/*.html")
        .pipe(gulp.dest("./dist/"));
});

/* CSS 压缩、合并、重命名、添加浏览器前缀、输出 */
gulp.task("css", ["html"], function () {
    gulp.src(themePath + "/css/" + "*.css")
        .pipe(autoprefixer({
            browsers: ["> 5%"],
            cascade: false
        }))
        .pipe(concat("deploy.min.css"))
        .pipe(cleanCSS({
            compatibility: "ie8"
        }))
        .pipe(gulp.dest("./dist/css"));
});

/* JavaScript 文件的压缩、合并、输出 */
gulp.task("js", function () {

    // 压缩主题自定义 js 文件
    gulp.src(themePath + "/js/custom.js")
        .pipe(concat("custom.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"));

    // 复制不需要压缩的库文件
    gulp.src("src/theme/" + config.theme + "/js/{highlight.min,jquery.min}.js")
        .pipe(gulp.dest("./dist/js"));

});

/* 图片文件的压缩与输出 */
gulp.task("img", ["html"], function () {
    // 复制文章自带的图片
    gulp.src("./src/out/attachment/*.{png,jpg,gif}")
        .pipe(cache(
            imagemin({
                progressive: true,
                use: [pngquant()]
            })
        ))
        .pipe(gulp.dest("./dist/attachment"));
    // 复制主题自带的图片
    gulp.src(themePath + "/img/*.{png,jpg,gif}")
        .pipe(cache(
            imagemin({
                progressive: true,
                use: [pngquant()]
            })
        ))
        .pipe(gulp.dest("./dist/img"));
});

/**
 * 复制 description.json 至输出文件夹
 */
gulp.task("description", function () {
    gulp.src("./src/draft/description.json")
        .pipe(gulp.dest("./dist"));
});

/* 清理输出文件夹 */
gulp.task("cleanDistFolder", function () {
    del.sync("./dist");
});

/* 程序执行后需要手动运行 orz */
gulp.task("clean", function () {
    console.log("in clean");
    del.sync("./src/out");
    del.sync("./dist");
});

/* 总任务 */
gulp.task("build", ["cleanDistFolder", "css", "js", "img", "description"], function () {
    console.log("finish");
});