---
title: Java 基础 - 序列化与反序列化
date: 2019-04-02
tag: Java, Serization
description: Java 基础 - 序列化与反序列化
---

# Java 基础 - 序列化与反序列化

序列化的目的是把对象输出到外部及介质 (包括但不限于保存到硬盘文件, 以及通过网络数据流传输这两中方式). 而反序列化则是把字节流中的 Java 对象还原. 而要序列化对象需要满足以下条件:

1. 则需要保证此对象实现了 Serializable 接口, 并且所有属性都是可序列化的. 
2. 如果某个属性不能或者不想被序列化, 则需要使用 transient 修饰, 使得该对象的生命周期仅限于当前 JVM 内存中.

另外, 为了维持不同版本的代码之间的序列化对象的兼容性, 需要保证不同版本之间的对象其 `serialVersionUID` 相同. 此字段可以同 IDE 自动生成.

## 1. 序列化一个对象

使用 `ObjectOutputStream` 来把对象输出到外部介质.

```java
public static void saveToListFile(TodoList list) {
    try {
        ObjectOutputStream outputStream = new ObjectOutputStream(new FileOutputStream(Const.DEFAULT_FILE_PATH));
        outputStream.writeObject(list);
        outputStream.close();
    } catch (IOException exception) {
        exception.printStackTrace();
        System.out.println("Unable to save the changes!");
    }
}
```

## 2. 反序列化一个对象

使用 `ObjectInputStream` 来反序列化一个对象.

```java
public static TodoList readFromListFile(String listPath) {
    TodoList list;
    try {
        ObjectInputStream inputStream = new ObjectInputStream(new FileInputStream(listPath));
        list = (TodoList) inputStream.readObject();
        inputStream.close();
        return list;
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}
```
