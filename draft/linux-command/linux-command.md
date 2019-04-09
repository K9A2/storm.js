---
title: Linux 常用命令
date: 2019-04-03
tag: Linux
description: Linux 常用命令搜集
---

# Linux 常用命令

## 显示进程状态 ps

常用参数:

- a 显示所有的进程
- u 指定用户的所有进程
- x 显示其他用户的进程

常用参数搭配: -aux 显示所有进程的详细信息

## 显示网络链接状态 netstat

常用参数:

- a 显示所有链接
- t 只显示 tcp 链接
- u 只显示 udp 链接
- n 对 IP 地址进行域名解析
- l 显示正在监听的端口
- p 显示进程信息, 需要 root
- e 查看进程所有者
- s 查看统计信息
- r 查看内核路由信息
- i 查看网卡信息

常用搭配: -anp 求端口以及进程 pid, 方便 kill