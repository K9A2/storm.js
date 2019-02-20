/* jshint esversion: 6 */

var dateFormatter = require('dateformat')

/**
 * 本文件负责生成过程的具体操作
 */
exports.generate = function(posts, pages, config, themeConfig) {
  /* 基础变量加载 */
  var fs = require('fs')
  var fse = require('fs-extra')
  var marked = require('marked')
  var copydir = require('copy-dir')

  var themeBasePath = 'src/theme/' + config.theme

  var nav = fs.readFileSync(themeBasePath + '/template/nav.html')
  var footer = fs.readFileSync(themeBasePath + '/template/footer.html')

  /* 生成博客文章页面 */
  fse.emptyDirSync('./src/out/attachment')
  fse.emptyDirSync('./src/out/html')
  posts.forEach(post => {
    var template = fs.readFileSync(
      themeBasePath + '/template/' + 'post.html',
      'utf8'
    )
    var content = post['__content']
    // 写入文章主题
    template = template.replace('{{ markdown }}', marked(content))
    // 写入标题
    template = template.replace('{{ title }}', post.title)
    // 写入时间
    post['date'] = dateFormatter(post.date, 'yyyy-mm-dd')
    template = template.replace('{{ date }}', post.date)
    // 写入标签
    var tagArray = post.tag.split(',')
    var tagList = ''
    tagArray.forEach(tag => {
      tag = tag.trim()
      tagList += '<a href="/tag.html?tag=' + tag + '">' + tag + '</a>'
    })
    template = template.replace('{{ tag }}', tagList)
    // 加入 footer 和 header
    template = template.replace('{{ nav }}', nav)
    template = template.replace('{{ footer }}', footer)
    // 写入输出文件夹
    fs.writeFileSync('./src/out/html/' + post.name + '.html', template, 'utf8')
    // 如果 attachment 文件夹存在则复制过去，否则认为这篇博客没有附带任何图片、文件等
    if (fs.existsSync('./draft/' + post.name + '/attachment') == true) {
      copydir.sync(
        './draft/' + post.name + '/attachment',
        './src/out/attachment'
      )
    }
  })

  /* 复制主题提供的各项资源文件 */
  var ignoreFolders = themeConfig.ignoreFolders
  var ignoreFiles = themeConfig.ignoreFiles
  copydir.sync(
    themeBasePath,
    './src/out/',
    function(stat, filepath, filename) {
      if (stat === 'file' && ignoreFiles.indexOf(filename) >= 0) {
        // 过滤掉指定的文件
        return false
      }
      if (stat === 'directory' && ignoreFolders.indexOf(filename) >= 0) {
        // 过滤掉指定的文件夹
        return false
      }
      return true
    },
    function(err) {
      console.log(err)
      return
    }
  )

  /* 生成首页 */
  var index = fs.readFileSync(
    themeBasePath + '/template/' + 'index.html',
    'utf8'
  )
  var indexItem = fs.readFileSync(
    themeBasePath + '/template/' + 'indexItem.html',
    'utf8'
  )
  var tagItem = fs.readFileSync(
    themeBasePath + '/template/' + 'tagItem.html',
    'utf8'
  )
  var postList = ''

  index = index.replace('{{nav}}', nav)
  index = index.replace('{{footer}}', footer)
  posts = posts.sort(by('date'))

  posts.forEach(post => {
    // 复制文章信息
    var newIndexItem = indexItem
    newIndexItem = newIndexItem.replace('{{date}}', post.date)
    newIndexItem = newIndexItem.replace('{{link}}', './' + post.name + '.html')
    newIndexItem = newIndexItem.replace('{{title}}', post.title)
    newIndexItem = newIndexItem.replace('{{description}}', post.description)
    // 复制文章标签列表
    var tagList = ''
    var tagArray = post.tag.toString().split(',')
    tagArray.forEach(tag => {
      tag = tag.trim()
      var newTagItem = tagItem
      newTagItem = newTagItem.replace(/{{tag}}/g, tag)
      tagList += newTagItem
    })
    newIndexItem = newIndexItem.replace('{{tagList}}', tagList)
    postList += newIndexItem
  })

  index = index.replace('{{postList}}', postList)
  fs.writeFileSync('./src/out/html/index.html', index, 'utf8')

  /* 生成固定页面 */
  // 复制博客描述文件供动态页面查询

  // tag 页的处理
  var tagPage = fs.readFileSync(
    themeBasePath + '/template/' + 'tag.html',
    'utf8'
  )
  tagPage = tagPage.replace('{{nav}}', nav)
  tagPage = tagPage.replace('{{footer}}', footer)
  fs.writeFileSync('./src/out/html/tag.html', tagPage)

  // about 页的处理
  var aboutPage = fs.readFileSync(
    themeBasePath + '/template/' + 'about.html',
    'utf8'
  )
  var about = fs.readFileSync('./draft/about/about.md', 'utf8')

  aboutPage = aboutPage.replace('{{nav}}', nav)
  aboutPage = aboutPage.replace('{{footer}}', footer)
  aboutPage = aboutPage.replace('{{markdown}}', marked(about))
  fs.writeFileSync('./src/out/html/about.html', aboutPage)
}

var by = function(name) {
  return function(o, p) {
    var a, b
    if (typeof o === 'object' && typeof p === 'object' && o && p) {
      a = o[name]
      b = p[name]
      if (a === b) {
        return 0
      }
      if (typeof a === typeof b) {
        return a > b ? -1 : 1
      }
      return typeof a > typeof b ? -1 : 1
    } else {
      throw 'error'
    }
  }
}
