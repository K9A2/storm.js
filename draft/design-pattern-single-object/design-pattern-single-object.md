---
title: 设计模式 - 单例模式
tag: java, design pattern
date: 2019-04-02
description: 各种单例模式的概念及应用
---

# 设计模式 - 单例模式

## 0. 使用场景举例

比如一个多线程程序, 都需要往控制台或者文件输出日志信息. 那么, 使用单例式的 logger 就能简化 logger 的设计与实现.

```java
public class TerminalLogger {

    private SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    private static TerminalLogger logger = new TerminalLogger();

    private TerminalLogger() {
    }

    public static TerminalLogger getLogger() {
        return logger;
    }

    public void log(String message) {
        Date now = new Date();
        System.out.println(formatter.format(now) + " - " + message);
    }

}
```

## 1. 饿汉式单例

在类加载的时候就实例化. 当需要实例化大对象的时候, 此方式会浪费内存.

```java
public class Singleton {  
    private static Singleton instance = new Singleton();  
    private Singleton (){}  
    public static Singleton getInstance() {  
        return instance;  
    }  
}
```

## 2. 枚举式单例

简洁，自动支持序列化机制，绝对防止多次实例化。

```java
public enum Singleton {  
    INSTANCE;  
    public void whateverMethod() {}  
}
```

## 3. 线程不安全的懒汉式单例

多线程环境中可能会 get 到不同的实例.

```java
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}  
  
    public static Singleton getInstance() {  
        if (instance == null) {  
            instance = new Singleton();  
        }  
        return instance;  
    }  
}
```

## 4. 线程安全的懒汉式单例

在 3 的基础上添加同步块 synchronized 以解决多线程环境中的同步问题.

```java
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}  
    public static synchronized Singleton getInstance() {  
        if (instance == null) {  
            instance = new Singleton();  
        }  
        return instance;  
    }  
}
```

## 5. 双重锁式单例

这种方式采用双锁机制, 安全且在多线程情况下能保持高性能。

```java
public class Singleton {  
    private volatile static Singleton singleton;  
    private Singleton (){}  
    public static Singleton getSingleton() {  
        if (singleton == null) {  
            synchronized (Singleton.class) {  
                if (singleton == null) {  
                    singleton = new Singleton();  
                }  
            }  
        }  
        return singleton;  
    }  
}
```

## 6. 内部类式单例

在使用单例时才初始化. 通过添加一个内部类来屏蔽多线程争用.

```java
public class Singleton {  
    private static class SingletonHolder {  
        private static final Singleton INSTANCE = new Singleton();  
    }  
    private Singleton (){}  
    public static final Singleton getInstance() {  
        return SingletonHolder.INSTANCE;  
    }  
}
```
