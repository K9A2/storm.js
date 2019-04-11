---
title: Java 基础 - 多线程
date: 2019-04-04
tag: Java 基础
description: Java 基础 - 多线程
---

# Java 基础 - 多线程

在计算密集型任务中, 使用多线程能够充分利用多核 CPU 的处理能力. 然而, 在 IO 密集型任务重, 使用多线程带来的加速效果受制于系统的 IO 能力.

## 1. 线程的生命周期

![线程状态转换](https://user-gold-cdn.xitu.io/2018/4/30/163159b8a740b329?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

在 JDK 文档中, Java 线程的状态可以有一下几种. 通常而言, 线程的在这些状态之间转换需要发生指定事件:

- 新建状态 New: 使用 new 关键字和 Thread 类或其子类建立一个线程对象后, 该线程对象就处于新建状态. 它保持这个状态直到程序 start() 这个线程.
- 就绪状态 Runnable: 当线程对象调用了start()方法之后, 该线程就进入就绪状态. 就绪状态的线程处于就绪队列中, 要等待JVM里线程调度器的调度.
- 运行状态 Running: 如果就绪状态的线程获取 CPU 资源, 就可以执行 run(), 此时线程便处于运行状态. 处于运行状态的线程最为复杂, 它可以变为阻塞状态, 就绪状态和死亡状态.
- 无限等待 Waiting: 线程处于无限等待状态, 需要被其他线程显式唤醒.
- 有限等待 Timed_Waiting: 线程会等待指定的时间. 要么是被其他线程唤醒, 要么是超时唤醒.
- 阻塞状态 Blocked: 线程为了等待锁的释放而处于此状态.
- 终止状态 Terminated: 当前线程已经执行完毕.

## 2. 创建线程

通常而言, 创建线程有以下三种方式:

- 继承 Thread 类, 并重写 run 方法, 然后调用 start 方法启动新线程
- 实现 Runnable 接口, 实现 run 方法, 调用 start 方法
- 实现 Callable 接口, 实现 call 方法

```java
//1. 继承 Thread
Thread thread = new Thread() {
    @Override
    public void run() {
        System.out.println("继承Thread");
        super.run();
    }
};
thread.start();
//2. 实现 runnable 接口
Thread thread1 = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("实现runable接口");
    }
});
thread1.start();
//3. 实现 callable 接口
ExecutorService service = Executors.newSingleThreadExecutor();
Future<String> future = service.submit(new Callable() {
    @Override
    public String call() throws Exception {
        return "通过实现Callable接口";
    }
});
try {
    String result = future.get();
    System.out.println(result);
} catch (InterruptedException e) {
    e.printStackTrace();
} catch (ExecutionException e) {
    e.printStackTrace();
}
```

[材料来源](https://juejin.im/post/5ae6cf7a518825670960fcc2)

然而, 受限与 Java 单继承的限制, 通过继承 Thread 来实现多线程并不是一种很好的方式. 在实践中, 通常使用实现 Runnable 接口的方式来实现多线程.

```java
// 创建指定大小的线程池
ExecutorService executor = Executors.newFixedThreadPool(cores);
// Worker 是一个实现了 Runnable 接口的计算类
Worker worker = new Worker(args...);
// 向线程池中添加线程, 之后线程池就会在指定的线程数之内调度线程运行
executor.execute(worker);
// 添加所有线程之后需要关闭线程池. 然后等待线程运行结束.
executor.shutdown();
// 主线程需要等待子线程结束, 可加上这行
executor.awaitTermination(Long.MAX_VALUE, TimeUnit.MINUTES);
```

## 3. 线程同步

线程间的同步主要有以下几种方法:

- 同步方法与同步块 synchronized  
  使用 synchronized 来修饰需要同步的 "对象", 可以绝对放置多条线程同时进入临界区.
- 使用 volatile 修饰信号量  
  volatile 则可以是的被修饰的变量 (仅变量) 在被修改后, 能够立刻被刷新到主内存中而使得其他线程能够访问到最新的值. 然而, 由于 volatile 并非是一个原子性的操作, 故刷新过程有可能被打断, 其他线程有可能依旧拿不到最新的值. 对比见另一篇文章: [Java 基础 - volatile 与 synchronized 的区别](http://www.stormlin.com/java-volatile-synchronized.html). final 类变量无需同步.
- 使用可重入锁 ReentreantLock 来锁住需要同步的内容.
  可重入锁需要实例化, 加锁, 解锁. 使用较为麻烦, 也容易出错. 故能在使用 synchronized 满足需求的情况下不要使用可重入锁. 当然, 在配合 Condition 的时候, ReentreantLock 的功能也十分强大.

    ```java
    class Bank {
        private int account = 100;
        //需要声明这个锁
        private Lock lock = new ReentrantLock();
        public int getAccount() {
            return account;
        }
        //这里不再需要synchronized 
        public void save(int money) {
            lock.lock();
            try{
                account += money;
            }finally{
                lock.unlock();
            }  
        }
    ｝
    ```

- 使用 ThreadLocal 局部变量进行同步

    ```java
    public class Bank{
        //使用ThreadLocal类管理共享变量account
        private static ThreadLocal<Integer> account = new ThreadLocal<Integer>(){
            @Override
            protected Integer initialValue(){
                return 100;
            }
        };
        public void save(int money){
            account.set(account.get()+money);
        }
        public int getAccount(){
            return account.get();
        }
    }
    ```

  在本例中, 当多个线程访问 account 变量时, 会访问到 ThreadLocal 类, 使得每一个使用该变量的线程都获得该变量的副本, 副本之间相互独立, 这样每一个线程都可以随意修改自己的变量副本, 而不会对其他线程产生影响.

- 使用阻塞队列 LinkedBlockingQueue 进行同步  
  即把 LinkedBlockingQueue 实例化, 然后当做参数传递给需要同步的线程. 由于用法与普通的 LinkedList 无差别, 故可以利用它来实现消息队列. 不同的线程依次从 Queue 中去除消息, 然后进行处理.
- 使用原子变量进行同步  
  在 java 的 util.concurrent.atomic 包中提供了创建了原子类型变量的工具类, 例如 AtomicInteger 表可以用原子方式更新 int 的值，可用在应用程序中 (如以原子方式增加的计数器), 但不能用于替换Integer.

    ```java
    class Bank {
        private AtomicInteger account = new AtomicInteger(100);

        public AtomicInteger getAccount() {
            return account;
        }

        public void save(int money) {
            account.addAndGet(money);
        }
    }
    ```

材料部分来自 [java笔记--关于线程同步（7种同步方式）](https://www.cnblogs.com/XHJT/p/3897440.html)

## 4. 线程间通信

### 4.1 wait, notify 和 notifyAll 方法

wait 是让当前线程等待其他线程释放目标对象的锁并进入休眠状态. 注意, 由于 wait 的底层需要获取 monitor lock, 因此, 如果不放在同步块中使用, 则会报 java.lang.IllegalMonitorStateException 异常.

```java
public class Main {
    private void testWait() {
        System.out.println("start");
        // 需要先同步再调用 wait
        synchronized (this) {
            try {
                // 有限等待 1 秒
                wait(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        System.out.println("exit");
    }

    public static void main(String[] args) {
        final Main main = new Main();
        new Thread(main::testWait).start();
    }
}
```

而 notify 和 notifyAll 则是唤醒这些正在休眠的线程.  而且, 在某个线程 wait 之后, 一定要有别的线程调用 notify, 否则调用了 wait 的线程会永远等待下去 (除非它设置了等待时间 timeout).

```java
public static void main(String[] args) {

    final Main main = new Main();
    for (int i = 0; i < 3; i++) {
        new Thread(main::testWait).start();
    }
 
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    System.out.println("now let one thread exit");
    synchronized (main) {
        main.notify();
    }

    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    System.out.println("now let all threads exit");
    synchronized (main) {
        main.notifyAll();
    }
    System.out.println("all threads exited");
}
```

### 4.2 sleep, yield 和 join 方法

sleep 方法的作用是让当前线程休眠指定的时间 (以毫秒计), 不需要在同步块中使用. 因此, sleep 常用于暂停当前线程, 然后 CPU 资源让给其他线程. 与 wait 相比, sleep 不会释放对象锁. 换而言之, sleep 的效果只是暂停当前线程的执行.

yield 方法则是把当前线程转为 Runnable 状态以 "暂时" 地让出 CPU 线程. 但是, 由于 Runnable 状态的线程会被系统调度运行, 故让出 CPU 的效果就十分难以保证. 因此, yield 也不能指定等待的时间.

```java
class TestThread implements Runnable {
    @Override
    public void run() {
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + ": " + i);
            Thread.yield();
        }
    }
}
class Main {
    public static void main(String[] args) { 
        TestThread thread = new TestThread();
        Thread t1 = new Thread(thread, "thread-1");
        Thread t2 = new Thread(thread, "thread-2");

        // 每一次执行的结果都不一样
        t1.start();
        t2.start();
    }
}
```

join 方法则是让主线程等待子线程执行结束之后再执行. 通常而言, 在主线程需要子线程的计算结果的时候, join 方法就十分有用了.

```java
ArrayList<Thread> list = new ArrayList<>;
for (int i = 0; i < 3; i++) {
    Thread newThread = new Thread(new Calculator(HashMap<Integer, Integer> resultMap));
    newThread.start();
    list.add(newThread);
}
try {
    // 等待子线程结束
    for (Thread t : list) {
        t.join();
    }
} catch (InterruptedException e) {
    e.printStackTrace();
}
// 然后一次性输出子进程的结果...
```

显然, 这种方式十分死板, 在线程数目可变的情况下, 就十分的不好用了. 因此, 通常配合使用线程池来实现我们的需求.

```java
ExecutorService executor = Executors.newFixedThreadPool(cores); 
for (String algorithm : algorithmArray) {
    for (String rtt : rttArray) {
        for (String loss : lossArray) {
            // worker 是一个工作线程. 总数量随参数长度变化.
            Worker worker = new Worker(algorithm, rtt, loss, dataFileFolder);
            executor.execute(worker);
        }
    }
}
executor.shutdown();

try {
    // 等待所有子进程结束之后输出结果
    executor.awaitTermination(Long.MAX_VALUE, TimeUnit.MINUTES);
} catch (InterruptedException e) {
    e.printStackTrace();
}
// 输出结果...
```

### 4.3 ReentrantLock & Condition

看一个[官方例子](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/locks/Condition.html). 在 Condition 与 ReentrantLock 配合使用的时候, 可以精细地设置线程唤醒和休眠的时机.

下面是一个 BoundedBuffer 的实例. 在 buffer 为空的时候, 需要阻塞读线程并唤醒写线程; 而在 buffer 满的时候, 则需要阻塞写线程并唤醒读线程. 从同一个 ReentrantLock 实例中使用 newCondition() 方法来获取两个唤醒读写线程的条件可以满足以上需求.

```java
/**
 * 操作者分为读写两条线程. 写线程往环形有界缓冲区中添加数据, 而读线程往缓冲区中取出数据.
 */
class BoundedBuffer {
    // 获取可重入锁实例
    final Lock lock = new ReentrantLock();
    // 从可重入锁中获取唤醒写线程的条件
    final Condition notFull  = lock.newCondition();
    // 从可重入锁中获取唤醒读线程的条件
    final Condition notEmpty = lock.newCondition();

    // 固定大小的缓冲区
    final Object[] items = new Object[100];
    // 写指针
    int putptr;
    // 读指针
    int takeptr;
    // 缓冲区已被使用的元素个数
    int count;

    /**
     * 往缓冲区中放入数据 x, 写线程使用此方法
     */
    public void put(Object x) throws InterruptedException {
        // 获取锁
        lock.lock();
        try {
            while (count == items.length) {
                // 缓冲区已满, 阻塞写线程
                notFull.await();
            }
            items[putptr] = x;
            // 循环写入, 调整写指针的相对位置
            if (++putptr == items.length) {
                putptr = 0;
            }
            // 增加元素个数
            ++count;
            // 唤醒写线程
            notEmpty.signal();
        } finally {
            lock.unlock();
        }
    }

    public Object take() throws InterruptedException {
        // 获取锁
        lock.lock();
        try {
            while (count == 0) {
                // 缓冲区为空, 阻塞读线程
                notEmpty.await();
            }
            // 修改写指针
            Object x = items[takeptr];
            // 循环读出, 修改读指针的相对位置
            if (++takeptr == items.length) {
                takeptr = 0;
            }
            // 移除一个元素
            --count;
            // 唤醒写线程
            notFull.signal();
            return x;
        } finally {
            lock.unlock();
        }
    }
}
```

### 4.4 管道

与 Linux 管道类似, Java 中的管道也可以用来进行线程间通信. 只不过 Java 管道只能连接两个 Java 进程. 在 Java 中进行管道通信, 需要使用 `PipedInputStream` 和 `PipedOutputStream` 两个管道输入输出类. 

基本流程如下:

- 创建管道输入输出流
- 将输入流和输出流匹配
- 从输入流中放入消息, 从输出流中读取消息

使用管道进行线程间通信也有两个缺点:

- 管道流只能单向发送, 双向通信需要两对管道
- 管道只能在两个线程之间进行通信

看一个用管道做生产者-消费者模型的例子.

```java
import java.io.PipedInputStream;
import java.io.PipedOutputStream;

public class Main {
    public static void main(String[] args) throws Exception {
        // 实例化输入管道
        PipedInputStream pis = new PipedInputStream();
        // 实例化输出管道
        PipedOutputStream pos = new PipedOutputStream();
        // 把输入管道和输出管道连接起来, 然后从输出管道中放入数据, 就可以从输出管道中自动获取刚放入的数据
        pos.connect(pis);

        // 创建生产者-消费者模型
        Runnable producer = () -> produceData(pos);
        Runnable consumer = () -> consumeData(pis);
        new Thread(producer).start();
        new Thread(consumer).start();
    }

    public static void produceData(PipedOutputStream pos) {
        try {
            // 向管道中以字节流的形式写入数据
            for (int i = 1; i <= 50; i++) {
                pos.write((byte) i);
                pos.flush();
                System.out.println("Writing: " + i);
                Thread.sleep(500);
            }
            // 需要及时关闭管道
            pos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static void consumeData(PipedInputStream pis) {
        try {
            int num = -1;
            // 从管道中读取数据
            while ((num = pis.read()) != -1) {
                System.out.println("Reading: " + num);
            }
            // 及时关闭管道
            pis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

除了例子中的构造管道的方法, 还有一种更简洁的构造管道的方法:

```java
PipedInputStream pis  = new PipedInputStream();
PipedOutputStream pos  = new PipedOutputStream(pis);
```

材料来自[易百教程](https://www.yiibai.com/java_io/java_io_pipe.html), 有所修改.

### 4.5 socket 通信

socket 通信输入网络通信的范畴, 见网络通信相关的文章, 在此不再赘述.

## 5. 线程的死锁与解除

出现线程需要满足以下四个条件, 而解除线程死锁也只需要破坏其中的任意条件:

- 互斥使用: 有且仅有一个线程可以使用同一个资源
- 不可抢占: 其他线程不能从资源使用者的手中抢夺资源的使用权
- 请求和保持: 当线程请求其他资源时, 不会释放已拥有的资源
- 循环等待: 线程之间循环等待其他线程所拥有的资源
