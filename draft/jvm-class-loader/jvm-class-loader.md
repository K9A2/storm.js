---
title: Java 中的 ClassLoader
date: 2019-04-02
tag: Java, ClassLoader
description: Java 中的 ClassLoader
---

# Java 中的 ClassLoader

## 1 Java 类文件包含的字段

1. 魔数 Magic Number。确定文件类型，以确定这个文件能否被 JVM 接受，值为 0xCAFEBABE。
2. 主版本号和次版本号。版本号不受 JVM 支持则无法运行。
3. 常量池。占用 Class 文件空间最大的字段。
4. 访问标志。声明文件是类还是接口，是否 public，是否 abstract，是否 final 等
5. 类索引和父类索引。确定继承关系。
6. 字段表。描述接口或类中声明的变量。
7. 方法表。描述接口或类中的方法。
8. 属性表。

## 2. ClassLoader 与双亲委派模型

不同的 ClassLoader 加载同一份 class 文件会导致不同的类。


ClassLoader 的类型。应用程序由以下三种 ClassLoader 加载到内存。

1. 启动加载器 Bootstrap ClassLoader。负责把合法的类加载到内存。无法被 Java 程序直接引用。
2. 扩展类加载器 Extension ClassLoader。负责加载各种 lib。程序员可以直接使用。
3. 应用程序类加载器 Application ClassLoader。加载用户路径 ClassPath 上的指定类库。为程序的默认 ClassLoader。

ClassLoader 之间的继承关系见右图。称为双亲委派模型。要求除了顶层的启动类加载器以外，其余的 ClassLoader 都应该有自己的父类加载器。其工作过程为：

1. 若一个 ClassLoader 收到类加载请求，就委派给父类完成。
2. 若父类无法完成，则由子类尝试加载。
这样就可以最大限度地保证同一份 class 文件加载出来的实例相同。

![双亲委派模型](https://img-blog.csdn.net/20180118174920669?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcWlhbjUyMGFv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

## 3. 类加载的基本流程

### 3.1 类的生命周期

1. 加载 Loading
2. 验证 Verification。保证 class 文件不会危害 JVM 安全。
3. 准备 Preparation。在方法区中为类中 static 变量分配内存并设置初始值（零值）。真正的值会在初始化阶段分配。Final 修饰的变量会立刻分配值。实例变量会在实例化过程中分配到堆内存。
4. 解析 Resolution。把常量池内的符号引用（到目标的字面量）解析为直接引用（指针）。
5. 初始化 Initialization。加载资源。
6. 使用 Using
7. 卸载 Unloading

其中，第 2 - 4 步为连接 Linking 阶段。

### 3.2 主动加载类的时机

有且只有以下四种情况：

1. 遇到 new 等字节码指令
2. 通过反射调用类
3. 初始化类的时候发现其父类仍未初始化
4. 加载主类 Main Class

其余加载类称为被动加载。类加载的过程并没有要求类从何处被加载，即可以是 jar 包，class 文件以及其他来源。

## 4. 虚拟机字节码的执行

### 4.1 虚拟机栈

栈帧：支持 JVM 进行方法调用和执行的数据结构，是 JVM 运行时数据区中的虚拟机栈（VM Stack）的栈元素，包括局部变量表、操作数栈、动态链接和方法返回地址等信息。方法的运行过程就是对应的栈帧在虚拟机栈里面从进入到退出的过程。

在活动线程中，只有 vm stack 最底部的栈帧处于执行状态，称为当前栈帧 current vm stack frame，对应的方法称为当前方法 current method。

### 4.2 局部变量表

储存方法参数和方法内部定义的局部变量，以变量槽 variable slot 为最小单位。线程私有。动态链接：指向运行时常量池中该栈帧所属方法的引用。

方法退出的两种方式：

1. 正常退出 normal method invocation completion
2. 异常退出 abrupt method invocation completion，没有在异常表中搜索到匹配的异常处理器。不会产生任何返回值。

### 4.3 方法调用

确定被调用方法的版本签名。不涉及具体的运行过程。

1. 解析。把其中的一部分符号引用转化为直接引用。使得方法有一个确定的可调用版本。
2. 分派。为虚拟机执行确定正确的目标函数。子类型包括静态分派和动态分派：
	+ 静态分派：也称为方法重载 overload 分派。用于在编译期根据方法签名确定最终会被执行的方法。比如使用子类构造函数实例化父类 `Fater fater = new children()` 并执行方法。如右图代码，其执行结果为
    ```text
		is man
		is woman
		fuck human
		fuck human
    ```
	+ 动态分派：也称为重写 override 分派。代码见右图。

### 4.4 方法执行

解释执行。基本执行方式，解析字节码执行。基于栈的指令集（零地址指令居多，指令中不包含寄存器地址）与基于寄存器的指令集（指令中包含寄存器的地址）。基于栈的指令集不受具体硬件实现的限制，可以提供更好的可移植性。
