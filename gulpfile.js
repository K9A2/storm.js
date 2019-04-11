/* 引入与 gulp 处理相关的模块 */
var gulp = require('gulp')

var cleanCSS = require('gulp-clean-css')
var autoprefixer = require('gulp-autoprefixer')

/* JavaScript 文件压缩 */
var uglify = require('gulp-uglify')

/* 图像处理包 */
var imagemin = require('gulp-imagemin')
var pngquant = require('imagemin-pngquant')

/* 通用工具包 */
var concat = require('gulp-concat')
var del = require('del')
var yaml = require('yaml-front-matter')
var fs = require('fs')
var zip = require('gulp-zip')

/* 主题设置 */
var config = require('./src/config/config.json')
var themePath = './src/theme/' + config.theme

/**
 * 获取 rootPath 下的所有子目录名字
 *
 * @param {string} rootPath 求子目录时的父目录
 */
function getTheNameOfAllChildFolders(rootPath) {
  let folders = []
  let files = fs.readdirSync(rootPath)
  files.forEach(function(item) {
    if (fs.lstatSync(rootPath + item).isDirectory() === true) {
      folders.push(item)
    }
  })
  return folders
}

/**
 * 以 YAML 文件格式解析指定路径的文件, 无法解析的内容会被放在返回值的 '__content' 字段中
 *
 * @param {string} filePath 文件路径
 */
function loadMarkdownFile(filePath) {
  return yaml.loadFront(fs.readFileSync(filePath, 'utf-8'))
}

/* 生成并输出 HTML 文件 */
gulp.task('html', done => {
  /* 引入与页面生成相关的模块 */
  var themeConfig = require(themePath + '/themeConfig.json')
  var generator = require('./src/theme/' + config.theme + '/generate')

  /* 需要获取 ./draft 文件夹下面所有 Markdown 格式文章草稿并按 YAML 格式解析之 */
  let posts = []
  let pages = []
  let folders = getTheNameOfAllChildFolders('./draft/')
  for (let index in folders) {
    let parsedObject = loadMarkdownFile(
      './draft/' + folders[index] + '/' + folders[index] + '.md'
    )
    // Markdown 文件名与文件夹名相同
    parsedObject['name'] = folders[index]
    if (typeof parsedObject['template'] != 'undefined') {
      pages.push(parsedObject)
    } else {
      posts.push(parsedObject)
    }
  }

  generator.generate(posts, pages, config, themeConfig)

  /* 复制生成的 HTML 文件 */
  gulp.src('./src/out/html/*.html').pipe(gulp.dest('./dist/'))
  for (let index in posts) {
    delete posts[index]['__content']
  }
  for (let index in pages) {
    delete pages[index]['__content']
  }

  /* 制作 description.json 文件供其他模块使用 */
  fs.writeFileSync(
    './draft/description.json',
    JSON.stringify(
      {
        posts: posts,
        pages: pages
      },
      null,
      2
    )
  )

  done()
})

/* CSS 压缩、合并、重命名、添加浏览器前缀、输出 */
gulp.task(
  'css',
  gulp.series('html', done => {
    gulp
      .src(themePath + '/css/' + '*.css')
      .pipe(
        autoprefixer({
          browsers: ['> 5%'],
          cascade: false
        })
      )
      .pipe(concat('deploy.min.css'))
      .pipe(
        cleanCSS({
          compatibility: 'ie8'
        })
      )
      .pipe(gulp.dest('./dist/css'))
    done()
  })
)

/* JavaScript 文件的压缩、合并、输出 */
gulp.task('js', done => {
  // 压缩主题自定义 js 文件
  gulp
    .src(themePath + '/js/custom.js')
    .pipe(concat('custom.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))

  // 复制不需要压缩的库文件
  gulp
    .src('src/theme/' + config.theme + '/js/{highlight.min,jquery.min}.js')
    .pipe(gulp.dest('./dist/js'))

  done()
})

gulp.task(
  'img',
  gulp.series('html', done => {
    // 复制文章自带的图片
    gulp
      .src('./src/out/attachment/*.{png,jpg,gif}')
      .pipe(
        imagemin({
          progressive: true,
          optimizationLevel: 5,
          interlaced: true,
          multipass: true,
          use: [pngquant()]
        })
      )
      .pipe(gulp.dest('./dist/attachment'))
    // 复制主题自带的图片
    gulp
      .src(themePath + '/img/*.{png,jpg,gif}')
      .pipe(
        imagemin({
          progressive: true,
          optimizationLevel: 5,
          interlaced: true,
          multipass: true,
          use: [pngquant()]
        })
      )
      .pipe(gulp.dest('./dist/img'))
    done()
  })
)

/**
 * 复制 description.json 至输出文件夹
 */
gulp.task('description', done => {
  gulp.src('./draft/description.json').pipe(gulp.dest('./dist'))
  done()
})

/**
 * 把输出文件夹打包为 zip 文件
 */
gulp.task('package', done => {
  gulp.src('./dist/*')
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'))
  done()
})

// /* 清理输出文件夹 */
gulp.task('cleanDistFolder', done => {
  del.sync('./dist')
  done()
})

/* 程序执行后需要手动运行 orz */
gulp.task('clean', done => {
  del.sync('./src/out')
  del.sync('./dist')
  // del.sync('./dist.zip')
  done()
})

/* 总任务 */
gulp.task(
  'build',
  gulp.series('cleanDistFolder', 'css', 'js', 'img', 'description', done => {
    console.log('finish')
    done()
  })
)
