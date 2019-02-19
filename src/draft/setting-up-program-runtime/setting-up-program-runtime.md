# 建立基本的程序运行环境

## 1. 安装 Java 编译环境

一个基本的 Java 编译环境应该至少包含 JDK 和 Maven (部分程序使用 ant 进行编译).

```bash
# 添加 ppa 源
add-apt-repository ppa:webupd8team/java
# 安装 JDK 1.8 本体
apt update
apt install oracle-java8-installer
# 安装 Maven
apt install maven
```

## 2. 安装 Node-js

安装 Node-js 最简单的方式是直接使用 Ubuntu 自带的 apt 来安装. 但是 apt 提供的版本通常比较旧, 所以在安装完成之后需要更新一下.

```bash
apt update
# 安装 Node-js 本体:
apt install nodejs-legacy
# 安装 npm
apt install npm
# 安装 Node-js 的版本管理工具
npm install -g n
# 更新 Node-js 版本至最新的稳定版本
n stable
# 更新 npm 版本
npm install -g npm
```

## 3. 材料来源

+ DigitalOcean, [How To Install Java with Apt-Get on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-get-on-ubuntu-16-04)
+ Linuxize, [How to install Apache Maven on Ubuntu 18.04](https://linuxize.com/post/how-to-install-apache-maven-on-ubuntu-18-04/)
+ nodesource, [NodeSource Node.js Binary Distributions](https://linkhttps://github.com/nodesource/distributions/blob/master/README.md)
