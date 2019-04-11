---
title: 在Ubuntu 16.04下安装Java 8
tag: 开发杂记
date: 2017-02-22
description: 本文记录了在 Ubuntu 16.04 下安装 Java 8 的操作流程
---

# 在 Ubuntu 16.04 下安装 Java 8

## 准备工作

- 在 Oracle 网站下载 Java 8 的安装包
- 博主此时下载到的版本为 8u121，故所得安装包的文件名为 jdk-8u121-linux-x64.tar.gz
- 提取压缩包里面的文件到任意目录
- 由于目标/usr/lib/jvm 需要使用管理员权限来访问，故在命令行中输入以下命令来把文件复制到目标文件夹中：`sudo mv jdk1.8.0_121 /usr/lib/jvm`

准备工作完成

## 安装与配置

- 在命令行中输入以下命令来添加 Java 的环境变量：`sudo nano /etc/profile`

- 在打开的文件的末尾复制粘贴以下语句：

```profile
export JAVA_HOME=/usr/lib/jvm/jdk1.8.0_121
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH={JAVA_HOME}/bin:$PATH
```

- 按按照软件下方的提示按 ctrl+x 保存并退出
- 在命令行中依次输入以下命令来更新默认 jdk：

```bash
update-alternatives --install /usr/bin/java java /usr/lib/jvm/jdk1.8.0_121/bin/java 300

update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/jdk1.8.0_121/bin/javac 300

update-alternatives --config java
```

输入完成后，系统会在命令行中显示出所有在/uer/lib/jvm 下可用的 jdk 版本，按照屏幕的提示数字选择刚才复制进去的 jdk 即可

- 在命令行中输入以下命令来验证 Java 8 是否成功安装：`java -version`

如果命令行作如下显示，则安装成功：

```bash
java version "1.8.0_121"
Java(TM) SE Runtime Environment (build 1.8.0_121-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.121-b13, mixed mode)
```
