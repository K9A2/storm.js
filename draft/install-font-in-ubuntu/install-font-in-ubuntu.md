---
title: Linux 下安装 Source Code Pro 字体
tag: 开发杂记, Source Code Pro
date: 2017-04-21
description: Linux 下安装 Source Code Pro 字体。则需要执行以下步骤。
---

# Linux 下安装 Source Code Pro 字体

例如在：Linux 下安装 Source Code Pro 字体。则需要执行以下步骤：

1. 下载 [Souce Code Pro](https://github.com/adobe-fonts/source-code-pro) 字体；
2. 使用 `sudo mv scp /usr/share/fonts/opentype/` 来把文件复制到系统字体文件夹 **fonts** 下；
3. 通过 `cd scp` 来切换到字体文件夹中；
4. 依次输入以下命令来安装字体并刷新系统字体缓存：

```bash
mkfontscale
mkfontdir
fc-cache
```

5. 完成。如果字体还没有加载成功，重启试试。
