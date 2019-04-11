# stormlin

一个以 Markdown + gulp 4 + Node.js 为技术栈的静态博客生成器, 能够按照给定的主题包一键生成部署所需的 HTML, CSS 和 JS 文件, 并打包为 zip 文件.

## 1. 使用方法

本项目使用 gulp 4 作为构建工具. 生成, 打包, 清理的 gulp 语句如下:

- `gulp build` - 按照给定的主题包把 Markdown 文件转换为页面文件, 并和主题包附带的资源文件一起输出到 `./dist/` 文件夹中
- `gulp package` - 把上述生成的 `./dist/` 文件夹打包为 `dist.zip`, 并放置在当前文件夹中
- `gulp clean` - 删除上述生成的 `./dist/` 文件夹和 `dist.zip` 文件

## 2. 模块化主题包开发

gulpfil.js 的工作流程:

- 读取主题包设置, 与生成页面文件的生成器
- 
