# 在Ubuntu 16.04中安装软件时提示缺少某个包应该怎么办？

## 问题描述

博主在Ubuntu 16.04下安装Virtual Box时，控制台提示未安装libqt5x11extras5和libsdl1.2debian两个软件包，安装过程被终止。

## 解决方案

在控制台输入以下命令即可：

```bash
sudo apt-get update
sudo apt-get -f install
```
