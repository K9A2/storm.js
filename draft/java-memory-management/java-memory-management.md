---
title: Java 内存管理
tag: Java, JVM, Memory
date: 2019-04-02
description: Java 模型与管理
---

# Java 内存模型与管理

## 内存使用探查常用命令

jps 获取 jvm 中所有进程的 pid

jmap -heap pid 获取指定进程的堆栈信息
jmap -histo pid | head -n 20 查看堆栈中对象数量和大小, 仅输出前 20 名

jstack 查看进程堆栈, 分析进程停顿原因

jstat -gc pid 5000 20 检测进程分代内存使用情况, 每 5000 毫秒统计一次, 一共 20 次
jstat -gcutil pid 5000 20 检测进程分代内存使用率和 GC 情况

jinfo option-name pid 查看进程的 jvm 参数

jconsole 可视化检测工具
