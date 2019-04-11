---
title: Java 面试题
date: 2019-04-10
tag: Java, 面试题
description: Java 面试题
---

# Java 面试题

## 1. String, StringBuilder, StringBuffer 之间的差别

- String 是一个不可变类, 每次拼接字符串都会导致一个新的字符串对象被生成. 如果频繁拼接字符串, 将带来较大的性能开销.
- StringBuilder 与 StringBuffer 都是可变的字符串类, 用于逐步构造最终的字符串.
- StringBuilder 不是线程安全的, 而 StringBuffer 通过给使用 synchronized 关键字修饰可能出现同步问题的方法而保证了线程安全.
- 在单线程环境中, 使用 StringBuffer 会带来额外的性能开销. 而 StringBuilder 性能也因此较 StringBuffer 高.

## 3. 数据库


