---
title: 在Ubuntu 16.04中安装软件时提示缺少某个包应该怎么办？
tag: 开发杂记, apt
date: 2017-02-23
description: 如何解决安装过程中出现的丢失某个包的现象
---

# 在 Ubuntu 16.04 中安装软件时提示缺少某个包应该怎么办？

## 问题描述

博主在 Ubuntu 16.04 下安装 Virtual Box 时，控制台提示未安装 libqt5x11extras5 和 libsdl1.2debian 两个软件包，安装过程被终止。

## 解决方案

在控制台输入以下命令即可：

```bash
sudo apt-get update
sudo apt-get -f install
```
