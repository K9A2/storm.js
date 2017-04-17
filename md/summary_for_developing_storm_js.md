# storm.js 开发总结

storm.js 是一种轻量级的 js 博客系统。下面是一些在开发它时所遇到的一些要点和坑点，分享给大家。

## 1. Javascript的执行顺序

storm.js 的下的 index.html 里面有这么一段代码：

```html
<!-- 代码段一 -->
<script>
    $.get("./md/index.md").success(function (content) {
        $(".markdown-body").append(marked(content));
        $("pre").addClass("prettyprint linenums");
        $("title").html($("h1").html());
        $("a").attr("target", "_blank");
    });
</script>
```

代码段一中的第 5 行负责获取这个 markdown 文档中的 h1，并把页面 title 设定为这个 h1；第 6 行负责给页面内所有的链接加上在新一页打开的功能（即 target="_blank"）。这两行原来在整个 index.html 的底部，设想由它们两段代码对第 4 行、第 5 行渲染后的 html 文件进行 DOM 操作。而代码段二则是原来的代码块。
```html
<!-- 代码段二 -->
<script>
    $.get("./md/index.md").success(function (content) {
        $(".markdown-body").append(marked(content));
        $("pre").addClass("prettyprint linenums");
    });
</script>
```

由于在调试的时候，用 `alert($("h1").html())` 无法获取到渲染后的 h1，所以也就不能设定 title 的值了。故转而考虑到是否是页面内的 JavaScript 代码执行顺序出了问题。Google 后获得以下结果*（为什么这么重要的内容在 JavaScript 权威指南里面没有呢？）*：

+   **浏览器在加载 html 文档是会会把这个 html 文档当成文档流来处理。对于其中的 JavaScript 代码块会按照顺序以块为单位执行**：

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

+   **JavaScript 引擎会也并非完全按照顺序来执行代码。在解释之前，引擎会对代码进行一次预编译。定义式函数会被优先执行，赋值式函数在用的时候才会处理**：
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
    以上的代码块中，并不会出现 *Hello* 和 *Hello World*。而是两次 *Hello World*。

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
    而要防止两个 *Hello* 函数被 JavaScript 引擎优化掉，可以把他们分别放到两个代码块中。
    
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
    如果这么写，那在 Chrome 的 Console 就能看到：*Uncaught TypeError: Fun2 is not a function* 的警告了。

    如果把 fun1() 写到其定义之上，那么受到**函数提升**的作用，也是能执行的，浏览器不会报错，无论是否处在**严格模式（"use strict"）**之下
    
+   **使用 document.wirte() 来输出 JavaScript 脚本，那么浏览器会在加载完所有 document.wirte() 之后再解析 html 文档：**
    ```javascript
    document.write('<script type="text/javascript">');
    document.write('f();');
    document.write('function f(){');
    document.write('alert(1);');
    document.write('}');
    document.write('</script>');
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

+   **如果一个 html 页面中有多个 *window.onload* 事件处理函数，那么会按照顺序执行：**
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
    
+   **重复定义函数会覆盖掉前面定义的函数：**
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
    其中，后面的 fun1 会覆盖掉前面的 fun1，运行结果为 *alert("fun2");*。

+   **body 的 onload 是在 html 加载完成后发生，故其顺序在 body 里面的 JavaScript 代码之后：**
    ```html
    <body onload="fun1()">

    <script>
        "use strict"

        function fun1() {
            alert("fun1");
        }

        function fun2() {
            alert("fun2");
        }
        fun2();
    </script>

    </body>
    ```
    fun2() 会先于 fun1() 被执行。

## 2. 使用 jQuery 读取本地 markdown 文档
```javascript
<script>
$.get(url).success().error();
</script>
```
以上是本项目中用到的 jQuery get 方法。其中 success 填入操作成功时的回调函数，error 填入操作失败是的回调函数。

官方参考文档：[http://jquery.cuishifeng.cn/jQuery.get.html](http://jquery.cuishifeng.cn/jQuery.get.html)。
