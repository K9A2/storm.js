---
title: JavaScript 面试题集锦
tag: javascript, interview
date: 2019-02-19
description: 本文总结了一些作者在面试的时候所遇到的问题, 以供大家参考
---

# JavaScript 面试题集锦

## JavaScript 数组去重

来自：[js 数组去重的 5 种算法实现](http://www.jb51.net/article/74347.htm)

**indexOf 是 ES6 新特性，部分旧浏览器不支持**

### 遍历法：

```javascript
function unique(arr) {
  var result = []

  for (var i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i]) == -1) {
      result.push(arr[i])
    }
  }

  return result
}
```

### 对象键值对法

```javascript
function unique(array) {
  var n = {},
    result = [],
    val,
    type

  for (var i = 0; i < array.length; i++) {
    val = array[i]
    type = typeof val
    if (!n[val]) {
      n[val] = [type]
      result.push(val)
    } else if (n[val].indexOf(type) < 0) {
      n[val].push(type)
      result.push(val)
    }
  }

  return result
}
```

### 数组下标判断法

```javascript
function unique(array) {
  var result = [array[0]] //结果数组
  //从第二项开始遍历
  for (var i = 1; i < array.length; i++) {
    //如果当前数组的第i项在当前数组中第一次出现的位置不是i，
    //那么表示第i项是重复的，忽略掉。否则存入结果数组
    if (array.indexOf(array[i]) == i) result.push(array[i])
  }
  return result
}
```

### 排序后相邻去除法

```javascript
// 将相同的值相邻，然后遍历去除重复值
function unique(array) {
  array.sort()
  var result = [array[0]]
  for (var i = 1; i < array.length; i++) {
    if (array[i] !== result[result.length - 1]) {
      result.push(array[i])
    }
  }
  return result
}
```

### 优化遍历数组法

```javascript
// 思路：获取没重复的最右一值放入新数组
function unique(array) {
  var result = []
  for (var i = 0, l = array.length; i < l; i++) {
    for (var j = i + 1; j < l; j++) if (array[i] === array[j]) j = ++i
    result.push(array[i])
  }
  return result
}
```

## 添加事件监听器的方法

### JQuery

使用 jQuery 的 click() 或者别的事件，如：

```javascript
$('#btn').click(handler)
```

### 原声 JavaScript 绑定事件

```javascript
document.getElementById('#btn').addEventListener(handler)
```

### 在 HTML 代码中使用 onlick 等属性

不推荐使用此方法

## 事件冒泡和事件捕获

事件冒泡是自底向上的事件传播方式，事件捕获是自顶向下的事件传播方式。

默认的事件传播方式是事件冒泡方式，在 addEventListener() 中，可填入第三个布尔参数：false 是默认值，代表事件冒泡方式；true 由用户填入，代表事件捕获方式。

主要用途：在父组件上绑定事件处理程序，并使用事件冒泡方法，可免去遍历子组件添加事件处理函数的麻烦，提高性能。

## CSS 选择器的优先级

### 选择器分类

1. 标签选择器(如：body,div,p,ul,li)
2. 类选择器(如：class="head",class="head_logo")
3. ID 选择器(如：id="name",id="name_txt")
4. 全局选择器(如：\*号)
5. 组合选择器(如：.head .head_logo,注意两选择器用空格键分开)
6. 后代选择器 (如：#head .nav ul li 从父集到子孙集的选择器)
7. 群组选择器 div,span,img {color:Red} 即具有相同样式的标签分组显示
8. 继承选择器(如：div p,注意两选择器用空格键分开)
9. 伪类选择器(如：就是链接样式,a 元素的伪类，4 种不同的状态：link、visited、active、hover。)
10. 字符串匹配的属性选择符(^ \$ \*三种，分别对应开始、结尾、包含)
11. 子选择器 (如：div>p ,带大于号>)
12. CSS 相邻兄弟选择器器 (如：h1+p,带加号+)

### 优先级

**总结排序：!important > 行内样式>ID 选择器 > 类选择器 > 标签 > 通配符 > 继承 > 浏览器默认属性**

1. 在属性后面使用 !important 会覆盖页面内任何位置定义的元素样式。
2. 作为 style 属性写在元素内的样式
3. id 选择器
4. 类选择器
5. 标签选择器
6. 通配符选择器
7. 浏览器自定义或继承

### 同级 CSS 优先性

CSS 优先级：是由四个级别和各级别的出现次数决定的。四个级别分别为：行内选择符、ID 选择符、类别选择符、元素选择符。优先级的算法：

- 每个规则对应一个初始"四位数"：0、0、0、0
- 若是 行内选择符，则加 1、0、0、0
- 若是 ID 选择符，则加 0、1、0、0
- 若是 类选择符/属性选择符/伪类选择符，则分别加 0、0、1、0
- 若是 元素选择符/伪元素选择符，则分别加 0、0、0、1

**算法：将每条规则中，选择符对应的数相加后得到的”四位数“，从左到右进行比较，大的优先级越高。**

## JavaScript 的面向对象、集成、原型与原型链
