---
title: Java 基础 - 流的概念与使用
date: 2019-04-04
tag: Java 基础, Stream
description: Java 流的概念与使用
---

# Java 流的概念与使用

> Provides for system input and output through data streams, serialization and the file system.

本地 IO 操作是任何程序都必须进行的操作. 数据的输入输出对象主要为控制台和文件. Stream 由数据的二进制序列组成. 输入流表示从一个源读取数据, 输出流表示向一个目标写数据.

JDK 1.8 Doc 见: [Package java.io](https://docs.oracle.com/javase/8/docs/api/java/io/package-summary.html).

## 1. BufferedReader & BufferedWriter

文本文件的读取与写入主要以来 BufferedReader 和 BufferedWriter 两个类. 读取一个文本文件的例子:

```java
File file = new File(fileName);
// 读取文件之前需要获得文件的输入流
BufferedInputStream inputStream = null;
try {
    inputStream = new BufferedInputStream(new FileInputStream(file));
} catch (FileNotFoundException e) {
    logger.log("File: " + fileName + " not found");
}
if (inputStream == null) {
    return;
}
// 然后才能根据输入的文件流实例化 BufferedReader
BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));

while ((line = reader.readLine()) != null) {
    // do the staff
}
```

读取控制台的输入则更加简单:

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
``` 

除此之外, 还可以用 Scanner 来读取控制台输入, 不过 Scanner 常用于 ACM 比赛.

## 2. File, FileInputStream & FileOutputStream

相比于读取文本文件, 读写二进制文件则要麻烦一些.

```java
try {
    byte bWrite[] = { 11, 21, 3, 40, 5 };
    OutputStream os = new FileOutputStream("test.txt");
    for (int x = 0; x < bWrite.length; x++) {
        os.write(bWrite[x]); // writes the bytes
    }
    os.close();

    InputStream is = new FileInputStream("test.txt");
    int size = is.available();

    for (int i = 0; i < size; i++) {
        System.out.print((char) is.read() + "  ");
    }
    is.close();
} catch (IOException e) {
    System.out.print("Exception");
}
```

## 3. 序列化与反序列化

一般来说, 需要在获得文件输入输出流之后使用 ObjectInputStream & ObjectOutputStream 来从二进制文件中读取数据. 详见: [Java 基础 - 序列化与反序列化](http://www.stormlin.com/java-serialization.html).

