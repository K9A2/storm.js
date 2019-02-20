---
title: 在Ubuntu 16.04下集成Mininet与FloodLight
tag: Mininet, Floodlight, Ubuntu
date: 2017-02-24
description: 博主花费了许多时间在摸索集成Mininet和FloodLight的方法。本文整理了博主所摸索出来的方法，以供大家参考。
---

# 在 Ubuntu 16.04 下集成 Mininet 与 FloodLight

## 前言

博主花费了许多时间在摸索集成 Mininet 和 FloodLight 的方法。本文整理了博主所摸索出来的方法，以供大家参考。

## 集成前的准备工作

集成之前应完成以下工作：

- 下载安装 Virtual Box
- 下载 FloodLight VM 并且加载到 Virtual Box 中
- 在主机上运行 FloodLight

## 下载安装 Virtual Box

- 到 Virtual Box 官网下载对应版本的 Virtual Box。
- 使用以下命令来安装 Virtual Box（假定文件名为 vb.deb）：
  ```bash
  $ sudo dpkg -i vb.deb
  ```

## 下载 FloodLight VM 并且加载到 Virtual Box 中

- 在 FloodLight 官网上下载 FloodLight VM 镜像
- 在 Virtual Box 中新建虚拟机。在虚拟硬盘一页选择使用现有的虚拟硬盘文件，并选中下载好的 vmdk 文件

## 在主机上运行 FloodLight

在 FloodLight 文件夹打开控制台，并向控制台输入以下命令：

```bash
$ java -jar target/floodlight.jar
```

在浏览器中输入以下地址，以打开 FloodLight 的 Web 管理页面：http://localhost:8080/ui/pages/index.html

## 通过主机的 FloodLight 控制器获取信息

- 开启虚拟机后会直接进入虚拟机桌面，不用登录。账户名和密码均为：floodlight。打开桌面上的 README 文件可以查看相关信息。
- 依次点击：Applications->Accessories->Terminal 以打开控制台（不得不吐槽这个设计，非常不人性化）
- 分别在主机和 VM 的控制台中输入以下命令来获取本机的 ip 地址，本文分别称为 PC-ip 和 VM-ip：`$ ifconfig`
- 在 VM 的控制台中输入以下命令（把命令中的 PC-ip 替换为本机 ip 地址）：

```bash
$ sudo mn --controller=remote,ip=PC-ip,port=6653 --switch ovsk,protocols=OpenFlow13
```

此时 VM 中的 Mininet 就会运行，在 PC 中的浏览器中打开 FloodLight 的 Web 管理界面就可以看到此网络的相关信息。
