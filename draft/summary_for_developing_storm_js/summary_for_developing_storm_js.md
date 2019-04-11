---
title: storm.js 开发总结
tag: Javascript
date: 2017-01-01
description: 记录了开发 storm.js 中所遇到的一些要点和坑点，分享给大家。
---

# storm.js 开发总结

storm.js 是一种轻量级的 js 博客系统。下面是一些在开发它时所遇到的一些要点和坑点，分享给大家。

## 1. Javascript 的执行顺序

storm.js 的下的 index.html 里面有这么一段代码：

```html
<!-- 代码段一 -->
<script>
  $.get('./md/index.md').success(function(content) {
    $('.markdown-body').append(marked(content))
    $('pre').addClass('prettyprint linenums')
    $('title').html($('h1').html())
    $('a').attr('target', '_blank')
  })
</script>
```

代码段一中的第 5 行负责获取这个 markdown 文档中的 h1，并把页面 title 设定为这个 h1；第 6 行负责给页面内所有的链接加上在新一页打开的功能（即 target="\_blank"）。这两行原来在整个 index.html 的底部，设想由它们两段代码对第 4 行、第 5 行渲染后的 html 文件进行 DOM 操作。而代码段二则是原来的代码块。

```html
<!-- 代码段二 -->
<script>
  $.get('./md/index.md').success(function(content) {
    $('.markdown-body').append(marked(content))
    $('pre').addClass('prettyprint linenums')
  })
</script>
```

由于在调试的时候，用 `alert($("h1").html())` 无法获取到渲染后的 h1，所以也就不能设定 title 的值了。故转而考虑到是否是页面内的 JavaScript 代码执行顺序出了问题。Google 后获得以下结果*（为什么这么重要的内容在 JavaScript 权威指南里面没有呢？）*：

- **浏览器在加载 html 文档是会会把这个 html 文档当成文档流来处理。对于其中的 JavaScript 代码块会按照顺序以块为单位执行**：

  ```javascript
  <script>
      alert("block 1");
  </script>
  <html>
      <head>
          <script>
              alert("block 2");
          </script>
      </head>
      <body>
          <script>
              alert("block 3");
          </script>
      </body>
  </html>
  <script>
      alert("block 4");
  </script>
  ```

  执行顺序为 1 -> 2 -> 3 -> 4。

- **JavaScript 引擎会也并非完全按照顺序来执行代码。在解释之前，引擎会对代码进行一次预编译。定义式函数会被优先执行，赋值式函数在用的时候才会处理**：

  ```javascript
  <script>
      "use strict"

      function Hello() {
          alert("Hello");
      }
      Hello();

      function Hello() {
          alert("Hello World");
      }
      Hello();
  </script>
  ```

  以上的代码块中，并不会出现 _Hello_ 和 _Hello World_。而是两次 _Hello World_。

  在解析之前，JavaScript 引擎会对 html 文档进行一次**预编译**操作。在此过程中，**定义式的函数会被优先执行**，各种 var 变量也会被创建并赋值为 undefined：

  ```javascript
  <script>
      var Hello = function() {
          alert("Hello");
      }

      Hello = function() {
          alert("Hello World");
      }

      Hello();
      Hello();
  </script>
  ```

  而要防止两个 _Hello_ 函数被 JavaScript 引擎优化掉，可以把他们分别放到两个代码块中。

  定义式函数与赋值式函数：

  ```javascript
  <script>
      //定义式函数
      function fun1() {
          alert("fun1");
      }
      fun1();

      //赋值式函数
      Fun2();
      var Fun2 = function() {
          alert("fun2");
      }
  </script>
  ```

  如果这么写，那在 Chrome 的 Console 就能看到：_Uncaught TypeError: Fun2 is not a function_ 的警告了。

  如果把 fun1() 写到其定义之上，那么受到**函数提升**的作用，也是能执行的，浏览器不会报错，无论是否处在**严格模式（"use strict"）**之下

- **使用 document.wirte() 来输出 JavaScript 脚本，那么浏览器会在加载完所有 document.wirte() 之后再解析 html 文档：**

  ```javascript
  document.write('<script type="text/javascript">')
  document.write('f();')
  document.write('function f(){')
  document.write('alert(1);')
  document.write('}')
  document.write('</script>')
  ```

  等价于：

  ```javascript
  <script>
      f();
      function f() {
          alert(1);
      }
  </script>
  ```

- **如果一个 html 页面中有多个 _window.onload_ 事件处理函数，那么会按照顺序执行：**

  ```javascript
  <script>
      "use strict"

      function fun1() {
          alert("fun1");
      }

      function fun2() {
          alert("fun2");
      }
      window.onload = fun1();
      window.onload = fun2();
  </script>
  ```

- **重复定义函数会覆盖掉前面定义的函数：**

  ```javascript
  <script>
      "use strict"

      function fun1() {
          alert("fun1");
      }

      function fun1() {
          alert("fun2");
      }
      fun1();
  </script>
  ```

  其中，后面的 fun1 会覆盖掉前面的 fun1，运行结果为 _alert("fun2");_。

- **body 的 onload 是在 html 加载完成后发生，故其顺序在 body 里面的 JavaScript 代码之后：**

  ```html
  <body onload="fun1()">
    <script>
      'use strict'

      function fun1() {
        alert('fun1')
      }

      function fun2() {
        alert('fun2')
      }
      fun2()
    </script>
  </body>
  ```

  fun2() 会先于 fun1() 被执行。

## 2. 使用 jQuery 读取本地 markdown 文档

```javascript
<script>$.get(url).success().error();</script>
```

以上是本项目中用到的 jQuery get 方法。其中 success 填入操作成功时的回调函数，error 填入操作失败是的回调函数。

官方参考文档：[http://jquery.cuishifeng.cn/jQuery.get.html](http://jquery.cuishifeng.cn/jQuery.get.html)。

_但是，这个方法有个很大的问题：当要获取的文件的文件名中含有 **.** 时会出错。例如获取 **storm.js.md** 或出错。如第一点中的代码段一，会先执行 success 中的内容再执行 error 中的内容。目前此问题已经到 jQuery 的 GitHub 上提交 issue，等待对方处理。_

## 3. 为移动设备放大字体

目前有两种方法：

- 使用 CSS3 中的 **@media 查询**来获取客户机的分辨率，以动态地调整客户机浏览器上的字体大小；
- 使用 js 代码进行动态计算并用 DOM 操作来改变字体大小。

显然，方法二的性能损失比方法一要大；而且方法一有现成的 API 可用，何乐而不为？

下面是一些我为小米四上的 Chrome 和 Firefox 调整过的 CSS 样式，大家可以参考：

```css
/* 屏幕最小分辨率为 320 px 的设备 */
@media screen and (min-width: 320px) {
  html {
    font-size: 26px;
  }
  article {
    margin: auto 15px auto 15px;
  }
  body {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    border: none;
  }
}

/* 屏幕最小分辨率为 360 px 的设备 */
@media screen and (min-width: 360px) {
  html {
    font-size: 28px;
  }
  article {
    margin: auto 15px auto 15px;
  }
  body {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    border: none;
  }
}

/* 屏幕最小分辨率为 400 px 的设备 */
@media screen and (min-width: 400px) {
  html {
    font-size: 30px;
  }
  article {
    margin: auto 15px auto 15px;
  }
  body {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    border: none;
  }
}

/* 屏幕最小分辨率为 440 px 的设备 */
@media screen and (min-width: 440px) {
  html {
    font-size: 32px;
  }
  article {
    margin: auto 15px auto 15px;
  }
  body {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    border: none;
  }
}

/* 屏幕最小分辨率为 480 px 的设备 */
@media screen and (min-width: 480px) {
  html {
    font-size: 34px;
  }
  article {
    margin: auto 15px auto 15px;
  }
  body {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    border: none;
  }
}

/* 屏幕最小分辨率为 640 px 的设备 */
@media screen and (min-width: 640px) {
  html {
    font-size: 40px;
  }
  article {
    margin: auto 15px auto 15px;
  }
  body {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    border: none;
  }
}

/* 屏幕最小分辨率为 1080 px 的设备 */
@media screen and (min-width: 1080px) {
  html {
    font-size: 16px;
  }
  body {
    margin: 5% auto;
    width: 60%;
    border: none;
    border: 1px solid #ddd;
  }
}

/* 默认大小，适配 PC 页面 */
body {
  border-radius: 3px;
  padding: 3% 3% 3% 3%;
  font-size: 16px;
}
```

## 4. 使用 Chrome 来调试移动设备上的网页

有些时候，我们需要查看一下移动设备上的网页的具体情况。但是移动端浏览器一般没有 Chrome 的 Inspect 功能，所以需要借助 PC 端的 Chrome 来“代理”一下：

1.  PC 端以及 Android 端安装最新的 Chrome 浏览器；
2.  Android 端打开 Debug 模式，并用 USB 线连接到 PC 上；
3.  在 PC 端的 Chrome 浏览器的地址框中输入：**chrome://inspect**，即可看到自己的 Android 设备；
4.  在刚才的页面中点击 Inspect 即可。

_注意：在点击 Inspect 之后弹出空白页面，请打开 VPN。_

_参考资料：[移动前端调试方案（Android + Chrome 实现远程调试）](http://www.cnblogs.com/alantao/p/5220392.html)。_
