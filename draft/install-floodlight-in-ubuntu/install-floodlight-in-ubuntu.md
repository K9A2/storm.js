# 在Ubuntu 16.04下安装Floodlight v1.2

## 前言

Floodlight是一款很好的开源SDN控制器。

Floodlight使用Java编写，适合习惯开发Java的开发者使用。

本文主要介绍在Ubuntu 16.04下安装Floodlight v1.2的安装步骤。其中博主会重点讲博主在安装配置的过程中所踩到的坑。希望大家能在看完此文章之后，避免陷入不必要的麻烦中。

本文使用$表示后面的是向控制台输入的命令，使用#表示后面的是控制台输出的信息。

## 步骤一：安装ant，git等辅助软件

+ 在控制台下输入以下命令来安装：`$ sudo apt-get install ant git`
+ 在控制台下分别输入以下命令来检测是否成功安装：

```bash
$ git --version
$ ant -version
```

如果成功返回版本信息，则表明该软件已成功安装。

## 步骤二：下载和安装Java 8u121

参考博主的另一篇文章。

## 步骤三：下载和安装Floodlight v1.2

+ 通过git或者直接下载zip压缩包来获取Floodlight的最新版本。

  + 方法一：在如下地址可以通过GitHub下载软件的zip包（推荐）：
[https://github.com/floodlight/floodlight](https://github.com/floodlight/floodlight)

  + 方法二：使用如下命令可以通过git来下载Floodlight：

  使用git clone来下载Floodlight的时间非常漫长，我推荐大家通过方法一来获取最新版本的Floodlight。如果非要通过方法二来下载，那么下载的时候可以去看看Floodlight的官方文档。

+ 在控制台中输入如下命令来编译下载好的Floodlight源码：`$ ant`
+ 运行编译好的Floodlight：`$ java -jar target/floodlight.jar`
  如果Floodlight已经成功安装，则会在控制台中打印相关信息。

  如果觉得Floodlight无法启动或者是有其他的异常状况，请仔细检查屏幕上的信息，或者使用以下命令来获取有关Floodlight进程的信息：`$ ps -ef |grep floodlight`
  
+ 打开浏览器，输入以下网址来查看Floodlight自带的Web管理界面：[http://localhost:8080/ui/pages/index.html](http://localhost:8080/ui/pages/index.html) 如果能在管理界面获取到网络的相关信息，则基本可以证明Floodlight已经成功安装了。

至此，FloodLight就已经成功安装到系统中了，接下来就是开发的事情了。

至于开发用的IDE，可选Eclipse Neon或者Idea 2016。选Eclipse Neon的请参考步骤四、五；选Idea 2016的请参考步骤六。

**不管选哪一个IDE，请确保你所选的开发工具是最新版本的，博主在解决旧版IDE所导致的错误上浪费了太多的时间。**

## 步骤四：下载、安装Eclipse Neon

一般使用Eclipse来开发基于Floodlight的软件。

**注意：使用新版本的Floodlight，如博主使用的v1.2版本，强烈建议大家使用最新版的Eclipse Neon。否则有可能出现把Floodlight导入到Eclipse后出现几万个错误的情况。**

+ 到Eclipse官网下载最新版的Eclipse。
+ 得到的一般是一个tar.gz文件，我们直接解压到任意目录即可使用。

## 步骤五：导入与配置Eclipse，使之能够用于开发Floodlight

我们可以使用ant来准备一个Eclipse工程文件。

+ 在Floodlight的文件夹下面打开控制台，输入以下命令：`$ ant eclipse`
+ 打开刚才下载好的Eclipse，新建一个工程。
+ 点击File->Import->General->Existing Projects into Workspace。
+ 点击Browse。选择Floodlight的文件夹即可。

配置Eclipse的Run Configurations以便在Eclipse中运行，方便开发调试。

+ 打开Run Configurations的设置界面。
+ 在Java Application下面新建一个运行配置，并作入如下设置：
Name设置为FloodlightLaunch。Project则点击Browse，选择Floodligh。Main Class填入net.floodlightcontroller.core.Main。然后点击Apply使设置生效。
+ 然后切换只JRE项。如果项目的JRE不是刚才我们所下载安装的Java 8， 则调整为Java 8。
+ 点击运行即可在浏览器输入来查看Floodlight的Web控制界面了。 地址为：[http://localhost:8080/ui/pages/index.html](http://localhost:8080/ui/pages/index.html)

## 步骤六：使用Idea来开发FloodLight

Eclipse或者Idea各有千秋。

Eclipse用的人多，出了bug也好找答案；Idea用的人虽然少一点，但是它的自动补全功能用起来真的非常舒服（相对于Eclipse那可有可无的自动补全）。

所以，博主也一并介绍如何使用Idea来开发FloodLight吧。

关于Idea的安装与配置问题，请参考博主的另外一篇文章。

以下步骤默认读者已经使用了ant命令。

+ 导入文件

    + 打开Idea，选择Import Project。
    + 在Import Project中选中Floodli的文件夹。
    + 选择Import Project from external model，并选Eclipse。
    + 在下一页选中Keep project and module file in，并指定为 FloodLight的文件夹。
    + 然后一路下一步即可。

+ 编辑配置文件

    + 打开Run/Debug Configurations的设置界面。
    + 在Name填入FloodlightLaunch。
    + 在Main Class填入net.floodlightcontroller.core.Main。
    + 如有需要，在下方的JRE选项里面选择项目的JRE为下载的Java 8。
    + 点击Apply使设置生效。
    + 点击运行即可在浏览器输入来查看Floodlight的Web控制界面了。 地址为[http://localhost:8080/ui/pages/index.html](http://localhost:8080/ui/pages/index.html)
