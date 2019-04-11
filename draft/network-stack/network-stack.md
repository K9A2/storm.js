---
title: 网络协议栈
date: 2019-04-10
tag: TCP/IP
description: 网络协议栈
---

# TCP/IP 网络协议栈

目前的网络应用中, 基于 TCP/IP 协议栈的应用占了绝大多数.

## 1. TCP/IP 协议体系结构

![协议栈架构图](https://user-gold-cdn.xitu.io/2017/11/11/690219fae5b0587fa26e2dee545e6200?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

从以上协议栈架构图可以看出, TCP/IP 模型要比 OSI 模型更加精炼一些. 在 TCP/IP 协议中:

- 数据链路层负责把数据包传递到下一跳
- 网络层负责为数据包寻找到达目的主机的路由
- 传输层负责把数据包交付给目的主机上的目的进程
- 而应用层则负责实现具体的业务

来自应用层的数据每经过一层就会被添加上该层的头部, 组装成为一个该层的数据包后再行传送.

![overhead  ](https://user-gold-cdn.xitu.io/2017/11/11/8e36dfe9c1618385743e62f06fcca9fd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 2. IP 协议

IP 协议负责在网络上唯一地标识一台主机, 并在传输过程中负责寻找到达此主机的路径. IP 协议是一个无状态, 不可靠, 无连接的服务.

![IP 包头](https://upload-images.jianshu.io/upload_images/5853159-1cd12b03db657e08.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/521/format/webp)

在 IP 协议的包头中, 最重要的字段为: 源 IP 地址和目的 IP 地址, 其余字段起辅助作用.

## 2. TCP 协议

TCP 协议是一个可靠的, 面向连接的, 有状态的协议, 负责把数据最终交付给目标进程. 在 TCP 包头的所有字段中, 源端口号和目标端口号, 序列号以及确认号是最重要的字段, 其余的都是辅助性字段:

- 源端口号和目的端口号负责标识收发数据的进程
- 序列号负责标识数据包本身, 而确认号负责告诉对方目前已按序收到的最新数据包的序列号.

![TCP 包头](https://pic2.zhimg.com/80/v2-9cdd39da512d2a09a20aa77a05c6b0ad_hd.jpg)

### 2.1 TCP 三次握手和四次挥手的作用

TCP 的建立需要进行三次握手操作; 连接的关闭需要进行四次挥手的操作.

![tcp 状态机](http://www.cnitblog.com/images/cnitblog_com/wildon/544465b00200001s.png)

![三次握手](https://img-blog.csdn.net/20150907213812049)

为什么需要三次握手? 可以不可以改为两次握手?

> 这主要是为了防止已失效的连接请求报文段突然又传送到了 B. 所谓已失效的连接请求报文段是这样产生的: A 发送连接请求, 但因连接请求报文丢失而未收到确认, 于是 A 重发一次连接请求, 成功后建立了连接. 数据传输完毕后就释放了连接. 现在假定 A 发出的第一个请求报文段并未丢失, 而是在某个网络节点长时间滞留了, 以致延误到连接释放以后的某个时间才到达 B. 本来这是一个早已失效的报文段. 但 B 收到此失效的连接请求报文段后, 就误以为 A 又发了一次新的连接请求, 于是向 A 发出确认报文段, 同意建立连接. 假如不采用三次握手, 那么只要 B 发出确认, 新的连接就建立了. 由于 A 并未发出建立连接的请求, 因此不会理睬 B 的确认, 也不会向 B 发送数据. 但 B 却以为新的运输连接已经建立了, 并一直等待 A 发来数据, 因此白白浪费了许多资源. 采用 TCP 三次握手的方法可以防止上述现象发生. 例如在刚才的情况下, 由于 A 不会向 B 的确认发出确认, 连接就不会建立.

![四次挥手](https://img-blog.csdn.net/20150907213846032)

为什么要四次挥手?

> 为了保证 A 发送的最后一个 ACK 报文段能够到达 B. 即最后这个确认报文段很有可能丢失, 那么 B 会超时重传, 然后 A 再一次确认, 同时启动 2MSL 计时器, 如此下去. 如果没有等待时间, 发送完确认报文段就立即释放连接的话, B就无法重传了 (连接已被释放, 任何数据都不能出传了), 因而也就收不到确认, 就无法按照步骤进入 CLOSED 状态, 即必须收到确认才能 close. 防止 "已失效的连接请求报文段" 出现在连接中, 经过 2MSL, 那些在这个连接持续的时间内, 产生的所有报文段就可以都从网络中消失. 即在这个连接释放的过程中会有一些无效的报文段滞留在楼阁结点. 但是呢, 经过 2MSL 这些无效报文段就肯定可以发送到目的地, 不会滞留在网络中. 这样的话, 在下一个连接中就不会出现上一个连接遗留下来的请求报文段了.

## 3. UDP 协议

UDP 协议是一个无连接, 无状态, 面向报文的传输层协议. 与 TCP 不同, UDP 是不可靠的传输层协议, 意味着它只是尽可能让数据包到达目的主机, 而不保证数据包到达目的主机. 同样地, 由于 UDP 没有这一整台为了实现可靠传输的机制, 使用 UDP 协议的性能开销也较小. 因此, UDP 报头只有源和目的端口号, 数据包长度, 以及 checksum.

由于 UDP 是一种不可靠的协议, 因此 UDP 只适用于能够容忍数据丢失的应用场景, 比如 DNS, 流媒体传输等. FTP 等要求数据完全正确被对方接收的场景只能使用 TCP.

## 4. HTTP 协议

HTTP 1 和 HTTP 1.1 协议是一个无状态的文本传输协议, 传输 HTML 文本, 并由浏览器负责解析与呈现. HTTP 2 是一个二进制传输协议. 在客户端向服务器发送请求的时候, 最常用的方法有 GET 和 POST 两种方式.

- GET: 请求指定的资源
- POST: 向指定的资源提交数据 (表单等)
- HEAD: 只获取 HTTP 请求头
- PUT: 将指定资源的最新数据传送给服务器取代指定的资源的内容
- DELETE: 删除指定的资源
- OPTIONS: 返回服务器支持的 HTTP 方法
- CONNECT: 开启一个客户端与所请求资源之间的双向沟通的通道

### 4.1 GET / POST 的对比

||GET|POST|
|---|---|---|
|后退按钮/刷新|无害|数据会被重新提交（浏览器应该告知用户数据会被重新提交）|
|书签|可收藏为书签|不可收藏为书签|
|缓存|能被缓存|不能缓存|
|编码类型|application/x-www-form-urlencoded|application/x-www-form-urlencoded 或 multipart/form-data。为二进制数据使用多重编码|
|历史|参数保留在浏览器历史中|参数不会保存在浏览器历史中|
|对数据长度的限制|是的。当发送数据时，GET 方法向 URL 添加数据；URL 的长度是受限制的（URL 的最大长度是 2048 个字符）|无限制|
|对数据类型的限制|只允许 ASCII 字符|没有限制。也允许二进制数据|
|安全性|与 POST 相比，GET 的安全性较差，因为所发送的数据是 URL 的一部分。在发送密码或其他敏感信息时绝不要使用 GET ！|POST 比 GET 更安全，因为参数不会被保存在浏览器历史或 web 服务器日志中。|
|可见性|数据在 URL 中对所有人都是可见的。|数据不会显示在 URL 中。|

### 4.2 HTTP 2 支持一些 HTTP 1.x 上没有的新特性:

- 多路复用的单一 TCP 长连接 & 分帧  
  HTTP 1.x 中会使用 6-8 条 TCP 连接来同时下载数据, 带来较大的传输成本. 而 HTTP 2 采用了单一的 TCP 长连接方式来传输数据, 避免了维持多条 TCP 连接带来的开销. 而在传输数据的方式上, HTTP 2 通过把多条数据流切分成不同的数据帧的方式, 实现了多条数据流在同一 TCP 长连接内的多路复用.
  ![HTTP 2 单一长连接](https://blog-10039692.file.myqcloud.com/1492423504046_4739_1492423504526.png)
- 头部压缩 & 二进制格式  
  HTTP 1.x 使用的是纯文本协议来传输页面数据, 而 HTTP 2 采用了二进制形式来传输数据, 降低了通信成本. 同时, 由于不同 HTTP 请求的头部部分具有相似性, HTTP 2 也为头部引入了 HPACK 来对头部进行压缩 (va报文中常见的字段名和值做成索引表). 而对资源路径则采用哈夫曼编码来进行压缩, 增加了 CPU 使用率但是降低了通信成本.
  ![头部压缩](https://blog-10039692.file.myqcloud.com/1492423727376_9229_1492423727598.png)
- 服务器推送  
  HTTP 2 允许服务器向客户端预先推送未来可能会用到的资源, 以降低未来加载这些资源时的延迟.

## 材料来源

- [一篇文章带你熟悉 TCP/IP 协议（网络协议篇二）](https://juejin.im/post/5a069b6d51882509e5432656)
- [IP协议详解](https://www.jianshu.com/p/58a77f173f71)
- [TCP/IP协议详解](https://zhuanlan.zhihu.com/p/33889997)
- [TCP状态转换图](https://www.cnblogs.com/qlee/archive/2011/07/12/2104089.html)
- [TCP 握手和挥手图解（有限状态机）](https://blog.csdn.net/xy010902100449/article/details/48274635)
- [HTTP 方法：GET 对比 POST](http://www.w3school.com.cn/tags/html_ref_httpmethods.asp)
- [HTTP 2 的新特性你 get 了吗？](https://cloud.tencent.com/developer/article/1004874)