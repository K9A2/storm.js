---
title: Java 泛型类, 泛型接口, 泛型方法
date: 2019-04-09
tag: Java
description: Java 泛型类, 泛型接口, 泛型方法
---

# Java 泛型类, 泛型接口, 泛型方法

泛型的是指是不在编译期指定类型信息, 而是使用占位符来解决这个问题. 等到实际运行的时候在解决这个问题. 在 JDK 源码中, `ArrayList<E>` 和 `HashMap<K, V>` 就是泛型使用的两个例子. 在这两个例子中, "E, K, V" 就是一个类型的占位符, 而究竟这个占位符代表的是什么类型, 则需要到运行时才确定, 比如 `HashMap<Integer, Integer> hashmap = new HashMap<Integer, Integer>`, 把 K 和 V 的真正类型都指定为 Integer.

## 1. 泛型变量与泛型方法的定义与使用

我们构造了一个简单的泛型类 `GenericTest`, 它 "只能" 接受一个数字, 然后储存在类内. 调用 `getNumber` 方法可以获得这个数字.

```java
class GenericTest<T> {
    private T number; 
    GenericTest(T number) { this.number = number; } 
    T getNumber() { return number; }

    // 这是一个临时定义的泛型方法
    public <U> U method(U number) {
        return number;
    }
}

class Main {
    public static void main(String[] args) {
        GenericTest<Integer> integerGenericTest = new GenericTest<>(1);
        System.out.println(integerGenericTest.getNumber());

        GenericTest<Float> floatGenericTest = new GenericTest<>(1.0f);
        System.out.println(floatGenericTest.getNumber());
    }
}
```

以上程序输出的是 1 和 1.0, 分别对应的类型为整形和浮点型. 在 Java 中, 给泛型确定的类型只能是一个类, 而不能是例如 int 等的基本类型.

把上面的例子稍微改改就可以演示多泛型变量的定义与使用.

```java
class GenericTest<I, F> {
    private I i;
    private F f;

    GenericTest(I i, F f) {
        this.i = i;
        this.f = f;
    }

    void printNumber() {
        System.out.println(i + "-" + f);
    }
}

class Main {
    public static void main(String[] args) {
        GenericTest<Integer, Float> genericTest = new GenericTest<>(1, 1.0f);
        genericTest.printNumber();
    }
}
```

以上程序的输出是 "1-1.0".

## 2. 泛型接口的定义与使用

对于一个泛型接口 (就是使用了泛型变量的接口), 既可以在实现这个接口时就把类型写死, 也可以继续使用泛型, 把类型的确定推迟到运行时.

比如我们的定义了一个泛型接口, 然后用这两种方式实现.

```java
public interface GenericInterface<T> {
    T getNumber();
    void setNumber(T number);
}

// 这个例子在实现的时候就直接写死了泛型的类型, 实现类与普通的 Java 类无区别.
class GenericImpl implements GenericInterface<Integer> {
    private int number;

    @Override
    public Integer getNumber() {
        return number;
    }

    @Override
    public void setNumber(Integer number) {
        this.number = number;
    }
}

// 这个例子保留了泛型的使用
class ImplGeneric<T> implements GenericInterface<T> {
    private T number;

    @Override
    public T getNumber() {
        return number;
    }

    @Override
    public void setNumber(T number) {
        this.number = number;
    }
}
```

更多泛型的使用方法请参考 [Java Document](https://docs.oracle.com/javase/tutorial/java/generics/index.html).