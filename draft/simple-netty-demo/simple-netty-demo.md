---
title: Simple Netty Echo Server
date: 2019-04-03
tag: Java, Netty
description: 基于 Netty 构造了一个简单的回显服务器.
---

# Simple Netty Echo Server

## 1. 预备知识

### 1.1 网络通信模型

![网络 IO 模型](https://segmentfault.com/img/remote/1460000012976688?w=858&h=851)

- BIO (Block IO) 阻塞式 IO: 服务器通过一个 Acceptor 线程负责监听客户端请求和为每个客户端创建一个新的线程进行链路处理. 典型的一请求一应答模式. 若客户端数量增多, 频繁地创建和销毁线程会给服务器打开很大的压力. 后改良为用线程池的方式代替新增线程, 被称为伪异步 IO.
- NIO (Non-Block IO) 非阻塞式 iO: 客户端和服务器之间通过 Channel 通信. NIO 可以在 Channel 进行读写操作. 这些 Channel 都会被注册在 Selector 多路复用器上. Selector 通过一个线程不停的轮询这些 Channel. 找出已经准备就绪的 Channel 执行 IO 操作.  
  NIO 通过一个线程轮询，实现千万个客户端的请求，这就是非阻塞 NIO 的特点。
  - 缓冲区 Buffer: 它是 NIO 与 BIO 的一个重要区别. BIO 是将数据直接写入或读取到 Stream 对象中. 而 NIO 的数据操作都是在缓冲区中进行的. 缓冲区实际上是一个数组. Buffer 最常见的类型是 ByteBuffer, 另外还有 CharBuffer, ShortBuffer, IntBuffer, LongBuffer, FloatBuffer, DoubleBuffer 等.
  - 通道 Channel: 和流不同, 通道是双向的. NIO 可以通过 Channel 进行数据的读, 写和同时读写操作. 通道分为两大类: 一类是网络读写(SelectableChannel), 一类是用于文件操作 (FileChannel), 我们使用的 SocketChannel 和 ServerSocketChannel 都是 SelectableChannel 的子类.
  - 多路复用器 Selector: NIO 编程的基础. 多路复用器提供选择已经就绪的任务的能力. 就是 Selector 会不断地轮询注册在其上的通道(Channel), 如果某个通道处于就绪状态, 会被 Selector 轮询出来, 然后通过 SelectionKey 可以取得就绪的 Channel 集合, 从而进行后续的 IO 操作. 服务器端只要提供一个线程负责 Selector 的轮询, 就可以接入成千上万个客户端, 这就是 JDK NIO 库的巨大进步.
- AIO (Asynchronous IO) 异步式 IO: 使用异步通道的概念. 其 read, write 方法的返回类型都是 Future 对象. 而 Future 模型是异步的, 其核心思想是: 去主函数等待时间. AIO 模型中通过 AsynchronousSocketChannel 和 AsynchronousServerSocketChannel 完成套接字通道的实现, 非阻塞, 异步.

### 1.2 两者之间的区别

- BIO, NIB, AIO 区别
  - BIO 阻塞同步通信模式, 客户端和服务器连接需要三次握手, 使用简单, 但吞吐量小;
  - NIO 非阻塞同步通信模式, 客户端与服务器通过 Channel 连接, 采用多路复用器轮询注册的 Channel, 提高吞吐量和可靠性;
  - AIO 非阻塞异步通信模式, NIO 的升级版, 采用异步通道实现异步通信, 其 read 和 write 方法均是异步方法.
- BIO 通信的伪代码实现流程
  ```text
  服务器绑定端口: server = new ServerSocket(PORT)
  服务器阻塞监听: socket = server.accept()
  服务器开启线程: new Thread(Handle handle)
  服务器读写数据: BufferedReader PrintWriter
  客户端绑定 IP 和 PORT: new Socket(IP_ADDRESS, PORT)
  客户端传输接收数据: BufferedReader PrintWriter
  ```
- 什么是同步阻塞 BIO, 同步非阻塞 NIO, 异步非阻塞 AIO
  - 同步阻塞 IO: 用户进程发起一个 IO 操作以后, 必须等待 IO 操作的真正完成后, 才能继续运行.
  - 同步非阻塞 IO: 用户进程发起一个 IO 操作以后, 可做其它事情, 但用户进程需要经常询问 IO 操作是否完成, 这样造成不必要的 CPU 资源浪费.
  - 异步非阻塞 IO: 用户进程发起一个 IO 操作然后, 立即返回, 等 IO 操作真正的完成以后, 应用程序会得到 IO 操作完成的通知. 类比 Future 模式.

材料来自[segmentfault](https://segmentfault.com/a/1190000012976683).

## 2. Netty 的基本概念

- EventLoopGroup: 调度内部线程, 注册 Channel, 管理生命周期.
- Channel: 一个连接的抽象. 所有的读写数据, 最终都是通过 Channel 流通的. 主要有 NioSocketChannel、NioServerSocketChannel.
- ByteBuf: 缓存. 所有的数据都是从 Channel 中读取并缓存到 Buffer 中, 用户自己的代码再从 Buffer 中读取. 要想写数据, 则必须先写入 Buffer 中, 然后在把 Buffer 写入到 Channel 中.
- ChannelHandler: ChannelHandler 从 Channel 中读取到数据后, 就需要把数据交给 ChannelHandler 进行处理.
- ChannelHandlerContext: 记录当前 ChannelHandler 的环境上下文, 大致有以下信息. 每一个 ChannelHandler 都会有一个 ChannelHandlerContext 与之对应 (一对一关系).
  - 记录当前 ChannelHandler 对象
  - 标识是 inbound 还是 outbound
  - 所属的 ChannelPipeline
  - 前一个 ChannelHandlerContext、后一个 ChannelHandlerContext. 这样形成一个处理链, 类似于 SpringMVC 中的拦截器链.
- ChannelPipeline: netty 是事件驱动的. 在获取到不同的事件后 (数据), 会做不同的业务逻辑处理, 这时候有的可能需要多个 Handler 协作完成, 有的 Handler 可能对当前的事件不做关心, 有的可能处理完了, 不想要后面的 Handler 处理了. 这时候如何对事件进行传播处理, 这时候就需要用到 ChannelPipeline 了. ChannelPipeline 中保存了头部的 ChannelHandlerContext (进来的类型事件会从头开始) 和尾部的 ChannelHandlerContext (出去的类型事件会从尾部开始), 他们是一个串行链接. 事件也分 inbound 和 outbound 两种. 不同类型的事件在 pipeline 上的执行顺序相反.
- Bootstrap: 在 netty 的应用程序中负责引导服务器和客户端:
  - 使用服务器的 ServerBootStrap, 用于接受客户端的连接以及为已接受的连接创建子通道
  - 用于客户端的 BootStrap, 不接受新的连接, 并且是在父通道类完成一些操作

## 3. 用 Netty 做一个简单的回显服务器

代码见 GitHub: [simple-netty-demo](https://github.com/K9A2/simple-netty-demo)

## 4. 粘包问题

由于 TCP 是一个面向数据流的协议, 故不同的应用层消息可能会被放在同一个数据包内发送. 这种情况成为粘包. 对于应用而言, 需要一种合适的方法把数据从粘包中恢复出来. 这种操作成为拆包. 在 Netty 中, 常用以下几种方式来分隔不同的数据包. 这些 Decoder 都需要放在 pipeline 的最前端.

- LineBasedFrameDecoder: 以回车换行符来分隔不同的消息
- DelimiterBasedFrameDecoder: 以指定符号分隔不同的消息
- FixedLengthFrameDecoder: 通过指定消息长度来分隔不同的消息
- LengthFieldBasedFrameDecoder: 使用长度字段来分隔变长消息

## 5. Reactor 与 Proactor

### 5.1 Reactor (I/O 复用模型)

![模型图 1](https://user-gold-cdn.xitu.io/2018/7/11/164874093c4d67ab?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

Reactor 模式是基于事件驱动的分发处理模型. 有一个或多个并发输入源, 有一个 Service Handler, 有多个 Request Handlers. 这个 Service Handler 会同步的将输入的请求 (Event) 多路复用的分发给相应的 Request Handler.

在 Reactor 中, 事件分离器负责等待文件描述符或 socket 为读写操作准备就绪, 然后将就绪事件传递给对应的处理器 (handler), 最后由处理器负责完成实际的读写工作.

> 1. 同步的等待多个事件源到达 (采用 select()实现)
> 2. 将事件多路分解以及分配相应的事件服务进行处理，这个分派采用 server 集中处理(dispatch)
> 3. 分解的事件以及对应的事件服务应用从分派服务中分离出去 (handler)

### 5.2 Proactor (异步 I/O 模型)

在 Proactor 模式中, 处理器--或者兼任处理器的事件分离器, 只负责发起异步读写操作. IO 操作本身由操作系统来完成. 传递给操作系统的参数需要包括用户定义的数据缓冲区地址和数据大小, 操作系统才能从中得到写出操作所需数据, 或写入从 socket 读到的数据. 事件分离器捕获 IO 操作完成事件, 然后将事件传递给对应处理器. 比如，在 windows 上, 处理器发起一个异步 IO 操作, 再由事件分离器等待 IOCompletion 事件. 典型的异步模式实现, 都建立在操作系统支持异步 API 的基础之上, 我们将这种实现称为 "系统级" 异步或 "真" 异步, 因为应用程序完全依赖操作系统执行真正的 IO 工作。

与 Reactor 模型相比, Proactor 模型更加关注 "IO 操作到达" 这一事件. 简而言之, Reactor 模型是通知用户外部消息到达, 然后由用户 "阻塞" 地读取完消息之后再行处理; 而 Proactor 模型则更加关注 "IO 操作完成" 这一事件. 即通知用户所需的数据已经读取完成, 用户可以无需等待 IO 操作而 "非" 阻塞地处理数据. 举个例子:

> reactor: 能收了你跟俺说一声  
> proactor: 你给我收十个字节, 收好了跟俺说一声
