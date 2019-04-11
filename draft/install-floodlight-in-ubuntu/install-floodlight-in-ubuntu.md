---
title: 在Ubuntu 16.04下安装Floodlight v1.2
tag: 开发杂记, Floodlight
date: 2017-02-23
description: 本文主要介绍在Ubuntu 16.04下安装Floodlight v1.2的安装步骤。其中博主会重点讲博主在安装配置的过程中所踩到的坑。希望大家能在看完此文章之后，避免陷入不必要的麻烦中。
---

# 在 Ubuntu 16.04 下安装 Floodlight v1.2

## 前言

Floodlight 是一款很好的开源 SDN 控制器。

Floodlight 使用 Java 编写，适合习惯开发 Java 的开发者使用。

本文主要介绍在 Ubuntu 16.04 下安装 Floodlight v1.2 的安装步骤。其中博主会重点讲博主在安装配置的过程中所踩到的坑。希望大家能在看完此文章之后，避免陷入不必要的麻烦中。

本文使用\$表示后面的是向控制台输入的命令，使用#表示后面的是控制台输出的信息。

## 步骤一：安装 ant，git 等辅助软件

- 在控制台下输入以下命令来安装：`$ sudo apt-get install ant git`
- 在控制台下分别输入以下命令来检测是否成功安装：

```bash
$ git --version
$ ant -version
```

如果成功返回版本信息，则表明该软件已成功安装。

## 步骤二：下载和安装 Java 8u121

参考博主的另一篇文章。

## 步骤三：下载和安装 Floodlight v1.2

- 通过 git 或者直接下载 zip 压缩包来获取 Floodlight 的最新版本。

  - 方法一：在如下地址可以通过 GitHub 下载软件的 zip 包（推荐）：
    [https://github.com/floodlight/floodlight](https://github.com/floodlight/floodlight)

  - 方法二：使用如下命令可以通过 git 来下载 Floodlight：

  使用 git clone 来下载 Floodlight 的时间非常漫长，我推荐大家通过方法一来获取最新版本的 Floodlight。如果非要通过方法二来下载，那么下载的时候可以去看看 Floodlight 的官方文档。

- 在控制台中输入如下命令来编译下载好的 Floodlight 源码：`$ ant`
- 运行编译好的 Floodlight：`$ java -jar target/floodlight.jar`
  如果 Floodlight 已经成功安装，则会在控制台中打印相关信息。

  如果觉得 Floodlight 无法启动或者是有其他的异常状况，请仔细检查屏幕上的信息，或者使用以下命令来获取有关 Floodlight 进程的信息：`$ ps -ef |grep floodlight`

- 打开浏览器，输入以下网址来查看 Floodlight 自带的 Web 管理界面：[http://localhost:8080/ui/pages/index.html](http://localhost:8080/ui/pages/index.html) 如果能在管理界面获取到网络的相关信息，则基本可以证明 Floodlight 已经成功安装了。

至此，FloodLight 就已经成功安装到系统中了，接下来就是开发的事情了。

至于开发用的 IDE，可选 Eclipse Neon 或者 Idea 2016。选 Eclipse Neon 的请参考步骤四、五；选 Idea 2016 的请参考步骤六。

**不管选哪一个 IDE，请确保你所选的开发工具是最新版本的，博主在解决旧版 IDE 所导致的错误上浪费了太多的时间。**

## 步骤四：下载、安装 Eclipse Neon

一般使用 Eclipse 来开发基于 Floodlight 的软件。

**注意：使用新版本的 Floodlight，如博主使用的 v1.2 版本，强烈建议大家使用最新版的 Eclipse Neon。否则有可能出现把 Floodlight 导入到 Eclipse 后出现几万个错误的情况。**

- 到 Eclipse 官网下载最新版的 Eclipse。
- 得到的一般是一个 tar.gz 文件，我们直接解压到任意目录即可使用。

## 步骤五：导入与配置 Eclipse，使之能够用于开发 Floodlight

我们可以使用 ant 来准备一个 Eclipse 工程文件。

- 在 Floodlight 的文件夹下面打开控制台，输入以下命令：`$ ant eclipse`
- 打开刚才下载好的 Eclipse，新建一个工程。
- 点击 File->Import->General->Existing Projects into Workspace。
- 点击 Browse。选择 Floodlight 的文件夹即可。

配置 Eclipse 的 Run Configurations 以便在 Eclipse 中运行，方便开发调试。

- 打开 Run Configurations 的设置界面。
- 在 Java Application 下面新建一个运行配置，并作入如下设置：
  Name 设置为 FloodlightLaunch。Project 则点击 Browse，选择 Floodligh。Main Class 填入 net.floodlightcontroller.core.Main。然后点击 Apply 使设置生效。
- 然后切换只 JRE 项。如果项目的 JRE 不是刚才我们所下载安装的 Java 8， 则调整为 Java 8。
- 点击运行即可在浏览器输入来查看 Floodlight 的 Web 控制界面了。 地址为：[http://localhost:8080/ui/pages/index.html](http://localhost:8080/ui/pages/index.html)

## 步骤六：使用 Idea 来开发 FloodLight

Eclipse 或者 Idea 各有千秋。

Eclipse 用的人多，出了 bug 也好找答案；Idea 用的人虽然少一点，但是它的自动补全功能用起来真的非常舒服（相对于 Eclipse 那可有可无的自动补全）。

所以，博主也一并介绍如何使用 Idea 来开发 FloodLight 吧。

关于 Idea 的安装与配置问题，请参考博主的另外一篇文章。

以下步骤默认读者已经使用了 ant 命令。

- 导入文件

  - 打开 Idea，选择 Import Project。
  - 在 Import Project 中选中 Floodli 的文件夹。
  - 选择 Import Project from external model，并选 Eclipse。
  - 在下一页选中 Keep project and module file in，并指定为 FloodLight 的文件夹。
  - 然后一路下一步即可。

- 编辑配置文件

  - 打开 Run/Debug Configurations 的设置界面。
  - 在 Name 填入 FloodlightLaunch。
  - 在 Main Class 填入 net.floodlightcontroller.core.Main。
  - 如有需要，在下方的 JRE 选项里面选择项目的 JRE 为下载的 Java 8。
  - 点击 Apply 使设置生效。
  - 点击运行即可在浏览器输入来查看 Floodlight 的 Web 控制界面了。 地址为[http://localhost:8080/ui/pages/index.html](http://localhost:8080/ui/pages/index.html)
