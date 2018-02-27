# 在Ubuntu 16.04下集成Mininet与FloodLight

## 前言

博主花费了许多时间在摸索集成Mininet和FloodLight的方法。本文整理了博主所摸索出来的方法，以供大家参考。

## 集成前的准备工作

集成之前应完成以下工作：

+ 下载安装Virtual Box
+ 下载FloodLight VM并且加载到Virtual Box中
+ 在主机上运行FloodLight

## 下载安装Virtual Box

+ 到Virtual Box官网下载对应版本的Virtual Box。
+ 使用以下命令来安装Virtual Box（假定文件名为vb.deb）：
  ```bash
  $ sudo dpkg -i vb.deb
  ```
## 下载FloodLight VM并且加载到Virtual Box中

+ 在FloodLight官网上下载FloodLight VM镜像
+ 在Virtual Box中新建虚拟机。在虚拟硬盘一页选择使用现有的虚拟硬盘文件，并选中下载好的vmdk文件

## 在主机上运行FloodLight

在FloodLight文件夹打开控制台，并向控制台输入以下命令：

```bash
$ java -jar target/floodlight.jar
```

在浏览器中输入以下地址，以打开FloodLight的Web管理页面：http://localhost:8080/ui/pages/index.html

## 通过主机的FloodLight控制器获取信息

+ 开启虚拟机后会直接进入虚拟机桌面，不用登录。账户名和密码均为：floodlight。打开桌面上的README文件可以查看相关信息。
+ 依次点击：Applications->Accessories->Terminal以打开控制台（不得不吐槽这个设计，非常不人性化）
+ 分别在主机和VM的控制台中输入以下命令来获取本机的ip地址，本文分别称为PC-ip和VM-ip：`$ ifconfig`
+ 在VM的控制台中输入以下命令（把命令中的PC-ip替换为本机ip地址）：

```bash
$ sudo mn --controller=remote,ip=PC-ip,port=6653 --switch ovsk,protocols=OpenFlow13
```

此时VM中的Mininet就会运行，在PC中的浏览器中打开FloodLight的Web管理界面就可以看到此网络的相关信息。