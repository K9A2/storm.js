---
title: 在Ubuntu 16.04下安装配置VS Code、CLion以及Idea
tag: Ubuntu, Clion, VSCode, IDEA
date: 2016-12-28
description: Linux下面安装软件还是相当麻烦的。故在这里记录下博主自己配置开发环境的方法，免得博主自己不记得了。
---

# 在 Ubuntu 16.04 下安装配置 VS Code、CLion 以及 Idea

## 缘起

博主以前是在 Windows 下做软件开发的，现在因为需要在 Linux 下面对 FloodLight 控制器进行二次开发，所以就转投 Linux 阵营了。

FloodLight 是是用 Java 写的，故一款用来进行 Java 开发的 IDE 就很有必要。而且博主本身对算法很感兴趣，经常会上 LeetCode 写点算法题，所以一款趁手的 C/C++语言 IDE 也是很有必要。

在 Windows 下，博主一般都用 VS 来开发 C/C++程序，用 Idea 来开发 Java 程序。故在转投 Linux 之后仍想使用原来的 IDE。然而微软比较小气，Linux 下只有 VSC 而没有 VS，故只能用 VSC。幸而 Linux 下有 Idea，不然就要用 Eclipse 了。

Linux 下面安装软件还是相当麻烦的。故在这里记录下博主自己配置开发环境的方法，免得博主自己不记得了。

## 安装配置 VS Code（VSC）

在 Linux 下安装 VSC 需要进行以下三步工作：

1. 下载 VSC 安装文件。下载地址：VSC 下载地址。博主自己使用的是 Ubuntu 16.04，故选择 deb 版本。
2. 安装 VSC。可以用 dpkg 命令（博主将压缩包命名为 code.deb，dpkg -i code.deb）进行安装。

也可以直接打开 deb 文件，系统会弹出窗口，点击安装即可。

如何在 dpkg 命令中指定软件的安装位置？`dpkg -i –instdir=安装位置 安装包名字`

详情参见百度百科中有关 dpkg 的解释 dpkg 的解释。

## 安装配置 CLion

在 Linux 下安装 CLion 需要完成以下几步工作：

1. 在如下地址下载 CLion，CLion 下载地址。大家不要做坏事哟。
2. 下载完成即可获得一个包含 CLion 的 tar.gz 压缩文件，解压之。可以在终端用 tar -xzvf clion.tar.gz 来解压（假定文件名为 clion.tar.gz）。也可以双击打开，直接拖出来。
3. 把解压后的文件放到你想要安装的地方，就可以开始安装过程了。在 bin 目录中打开终端，填入./clion.sh 即可。有关 CLion 安装的详细信息，参见 CLion 目录下的 Install-Linux-tar.txt 文件。

## 如何解压 tar 文档？

```bash
tar -xzvf .tar.gz
    tar [-cxtzjvfpPN] 文件与目录 ....
    参数：
    -c ：建立一个压缩文件的参数指令(create 的意思)；
    -x ：解开一个压缩文件的参数指令！
    -t ：查看 tarfile 里面的文件！
    特别注意，在参数的下达中， c/x/t 仅能存在一个！不可同时存在！
    因为不可能同时压缩与解压缩。
    -z ：是否同时具有 gzip 的属性？亦即是否需要用 gzip 压缩？
    -j ：是否同时具有 bzip2 的属性？亦即是否需要用 bzip2 压缩？
    -v ：压缩的过程中显示文件！这个常用，但不建议用在背景执行过程！
    -f ：使用档名，请留意，在 f 之后要立即接档名喔！不要再加参数！
```

## 安装配置 Idea

在 Linux 下安装 Idea 需要完成以下几步工作：

1. 到以下地址下载 Idea 安装包：下载地址。
2. 将得到的 tar.gz 文件解压。方法同 CLion。
3. 把解压后的文件夹复制到你想要安装的位置。在 bin 目录中打开终端，输入如下命令：./idea.sh。详情参见说明文档：Install-Linux-tar.txt。

## 安装 OpenJDK

重要：Idea 不需要系统“安装了”JDK，只要在新建工程文件的时候选择解压后的 JDK 文件夹就可以使用此版本的 JDK 了。有关 OpenJDK 和 SunJDK 之间的差别，参考知乎文章 OpenJDK 和 SunJDK 有啥区别？

在 Linux 下安装 OpenJDK 需要完成以下几步工作：

1. 检查系统是否安装了 JDK。在终端下输入 java -version，如果有 java 的版本信息，则证明系统已经安装了 JDK。否则就没有。
2. 如果系统没有安装 JDK，则可使用此命令安装 OpenJDK：sudo apt install openjdk-8-jre-headless。
