---
title: Java 基础 - ArrayList 与 LinkedList
date: 2019-04-09
tag: Java 基础
description: Java 中的 ArrayList 与 LinkedList
---

# Java 中的 ArrayList 与 LinkedList

在 List 接口的各个实现当中, ArrayList 与 LinkedList 是使用的最多的两个实现. 两者的差异有以下几点:

- ArrayList 内部使用 Object 数组来储存元素, 而 LinkedList 内部使用链表来储存元素 (LinkedList 的实现为双向链表, 可以被当做队列, 堆栈来用)
- 随机访问情况下, ArrayList 的性能好于 LinkedList. 然而, 增减元素可能需要紧缩数组, 这会带来一定的性能开销.
- LinkedList 的在表中时的插入性能比 ArrayList 好; 使用 Iterator 方法来删除添加元素时性能较好.
- 在内存使用上, LinkedList 的内存使用为储存的元素的内存加上指针域所使用的内存; 而 ArrayList 则是等于 Object 数组所使用的内存加上一些字段所使用的. 同时, ArrayList 的默认初始容量只有 10 个单位, 加之 grow 方法会带来十分大的性能开销. 故在能够预测元素数量的情况下, 通过指定略大于实际使用数目的容量来避免频繁进行 grow 操作.

材料可以参考 [When to use LinkedList over ArrayList in Java?](https://stackoverflow.com/questions/322715/when-to-use-linkedlist-over-arraylist-in-java).
