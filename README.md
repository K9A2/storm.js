# stormlin

一个以 Markdown + gulp 4 + Node.js 为技术栈的静态博客生成器, 能够按照给定的主题包一键生成部署所需的 HTML, CSS 和 JS 文件, 并打包为 zip 文件. 要求使用者具有 Node.js 和 npm 环境. 测试环境为 Node.js 11.10.1 和 npm 6.9.0. 所有功能通过测试.

## 1. 使用方法

本项目使用 gulp 4 作为构建工具. 生成, 打包, 清理的 gulp 语句如下:

- `gulp build` - 按照给定的主题包把 Markdown 文件转换为页面文件, 并和主题包附带的资源文件一起输出到 `./dist/` 文件夹中
- `gulp package` - 把上述生成的 `./dist/` 文件夹打包为 `dist.zip`, 并放置在当前文件夹中
- `gulp clean` - 删除上述生成的 `./dist/` 文件夹和 `dist.zip` 文件

本工具在构建 HTML 文件的时候, 会使用 `yaml-front-matter` 模块来读取 Markdown 文件的 YAML 头信息, 以便构造文件的 Metadata, 来方便其他页面索引. 因此, 编写 Markdown 文件的时候, 需要在 Markdown 文件头添加 YAML 头. 实例如下:

```yaml
---
title: your title
date: file date
tag: tag 1, tag 2, tag 3
description: a sample document
---

# Markdown 标题

接下来是你的笔记内容...
```

## 2. 模块化主题包开发

gulpfil.js 的工作流程:

- 清理之前生成的文件
- 读取程序配置 `./src/config/config.json` 来获取配置的主题
- 根据配置的主题名字, 读取主题包设置 `themeConfig`, 与配套的生成页面文件的生成器 `generator`
- 针对 `./draft/` 文件夹下面的每一个文件夹, 要求文件夹名字与 Markdown 文件名相同, 然后构造 pages 数组 (About 页面等固定页面) 和 posts 数组 (博客文章)
- 把 `pages`, `posts`, `config`, `themeConfig` 作为参数传入 `generator`, 由后者负责具体生成页面到 `./dist/`
- 把 JS 和 CSS 文件处理后复制到 `./dist/` 文件夹下

开发一个主题, 主要的任务就是编写 `generator` 以及配套的各种资源文件. 例子参见默认的 `default` 主题. 默认的生成器是通过替换模板 HTML 文件中的 **特定字符串** 来是实现按博客内容生成页面的. 这些字符串包括 `{{ nav }}`, `{{ tag }}`, `{{ footer }}` 等等, 希望使用者不要在文章中使用这些特殊字符串, 以免出现错误. 在实现了模板文件的替换逻辑之后, 需要通过 JS 的 exports 来导出生成器. 具体例子参见默认生成器 (当然, 你也可以用别的方式来导出生成器模块).
