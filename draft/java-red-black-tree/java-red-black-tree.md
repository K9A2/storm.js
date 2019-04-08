---
title: Java 红黑树
date: 2019-04-08
tag: Java
description: Java 红黑树
---

# Java 红黑树

红黑树的性质:

- 所有节点均是红色或者黑色
- 根节点必须是黑色
- 所有的叶节点必须是黑色
- 红色节点的两个子节点必须是黑色 (不能有两个连续的红色节点)
- 任何到达叶子节点的路径都必须包含相同数目的黑色节点

## 1. 红黑树的插入

以 N 代表新节点, P 代表新节点的父节点, U 代表父节点的兄弟 (即 N 叔叔节点). 则插入分四种情况:

在开始调整前, N 节点的颜色会被调整为红色. 调整结束后, 新节点的父节点 P 都会被设置为黑色

1. N 是根节点, 即第一次插入. 修改新节点的颜色为黑色.
2. P 是黑色节点. 无需调整.
3. P 是红色节点, 并且 U 也是红色节点.
4. P 是黑色节点, 并且 U 也是黑色节点.

借用 TreeMap 的插入后修复代码来解释这些情况, 图解参考 [红黑树（一）：插入](https://zhuanlan.zhihu.com/p/25358857).

```java
private void fixAfterInsertion(Entry<K,V> x) {
    // 新节点 x 的颜色会被默认设置为红色
    x.color = RED;

    while (x != null && x != root && x.parent.color == RED) {
        // 一直循环到调整完毕
        if (parentOf(x) == leftOf(parentOf(parentOf(x)))) {
            // 当前节点位于祖父节点的左子树上
            Entry<K,V> y = rightOf(parentOf(parentOf(x)));  // y 是新节点 x 的叔叔节点
            if (colorOf(y) == RED) {
                // 叔叔节点为红色, 把父节点和叔叔节点设为黑色, 祖父节点设为红色
                setColor(parentOf(x), BLACK);
                setColor(y, BLACK);
                setColor(parentOf(parentOf(x)), RED);
                // 当前节点调整为祖父节点
                x = parentOf(parentOf(x));
            } else {
                // 叔叔结点为黑色
                if (x == rightOf(parentOf(x))) {
                    // 当前节点位于父节点的右子树上, 则把当前节点切换为原父节点, 并对当前节点进行左旋操作
                    x = parentOf(x);
                    rotateLeft(x);
                }
                // 把当前节点的父节点设为黑色
                setColor(parentOf(x), BLACK);
                // 把当前节点的祖父节点设为红色
                setColor(parentOf(parentOf(x)), RED);
                // 对祖父节点进行右旋操作
                rotateRight(parentOf(parentOf(x)));
            }
        } else {
            // 当前节点位于祖父节点的右子树上, 与左子树上的操作类似
            Entry<K,V> y = leftOf(parentOf(parentOf(x))); // 获取叔叔节点
            if (colorOf(y) == RED) {
                setColor(parentOf(x), BLACK);
                setColor(y, BLACK);
                setColor(parentOf(parentOf(x)), RED);
                x = parentOf(parentOf(x));
            } else {
                if (x == leftOf(parentOf(x))) {
                    x = parentOf(x);
                    rotateRight(x);
                }
                setColor(parentOf(x), BLACK);
                setColor(parentOf(parentOf(x)), RED);
                rotateLeft(parentOf(parentOf(x)));
            }
        }
    }
    // 根节点的颜色总是会被调整为黑色
    root.color = BLACK;
}
```

## 2. 红黑树的删除

继续借用 TreeMap 的代码, 图解见 [红黑树（二）：删除](https://zhuanlan.zhihu.com/p/25402654?refer=hinus), 以及 [Red–black tree](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree) 可能的情况有以下几种:

- Case 1: N 是新树的根
- Case 2: S 是红色的
- Case 3: S 及其孩子都是黑色的, P 是黑色的
- Case 4: S 及其孩子都是黑色的, P 是红色的
- Case 5: S 是黑色的, S 的左孩子是红色, S 的右孩子是黑色
- Case 6: S 是黑色的, S 的右孩子是红色

```java
private void fixAfterDeletion(Entry<K,V> x) {
    // x 默认指向代替被删除节点的那个元素
    // Case 1: 当 x 指向新树的根, 则无需调整
    while (x != root && colorOf(x) == BLACK) {
        // 当前节点位于父节点的左子树
        if (x == leftOf(parentOf(x))) {
            // 当前节点的兄弟节点
            Entry<K,V> sib = rightOf(parentOf(x));

            if (colorOf(sib) == RED) {
                /* ---- Case 2 ---- */
                // 兄弟节点为红色, 则设置兄弟节点的颜色为黑色, 并把父节点的颜色设为红色, 然后对父节点进行左旋操作
                setColor(sib, BLACK);
                setColor(parentOf(x), RED);
                rotateLeft(parentOf(x));
                // 重设兄弟节点
                sib = rightOf(parentOf(x));
            }

            // 兄弟节点为黑色
            if (colorOf(leftOf(sib)) == BLACK && colorOf(rightOf(sib)) == BLACK) {
                /* ---- Case 3 & 4---- */
                // 兄弟的两个孩子都是黑色的, 把兄弟设为红色以维持红黑树的性质
                setColor(sib, RED);
                // 把当前节点调整为父节点以递归调整
                x = parentOf(x);
            } else {
                if (colorOf(rightOf(sib)) == BLACK) {
                    /* --- Case 5 ---- */
                    // 兄弟节点的右孩子是黑色, 把左孩子也设为黑色, 而兄弟节点设为红色
                    setColor(leftOf(sib), BLACK);
                    setColor(sib, RED);
                    // 对兄弟节点进行右旋
                    rotateRight(sib);
                    sib = rightOf(parentOf(x));
                }
                /* ---- Case 6 ---- */
                // 把兄弟节点的颜色设置为父节点的颜色
                setColor(sib, colorOf(parentOf(x)));
                // 把父节点设置为黑色
                setColor(parentOf(x), BLACK);
                // 把兄弟节点的右孩子的颜色设为黑色
                setColor(rightOf(sib), BLACK);
                // 对父节点进行左旋操作
                rotateLeft(parentOf(x));
                // 调整完成
                x = root;
            }
        } else { // symmetric
            Entry<K,V> sib = leftOf(parentOf(x));

            if (colorOf(sib) == RED) {
                setColor(sib, BLACK);
                setColor(parentOf(x), RED);
                rotateRight(parentOf(x));
                sib = leftOf(parentOf(x));
            }

            if (colorOf(rightOf(sib)) == BLACK && colorOf(leftOf(sib)) == BLACK) {
                setColor(sib, RED);
                x = parentOf(x);
            } else {
                if (colorOf(leftOf(sib)) == BLACK) {
                    setColor(rightOf(sib), BLACK);
                    setColor(sib, RED);
                    rotateLeft(sib);
                    sib = leftOf(parentOf(x));
                }
                setColor(sib, colorOf(parentOf(x)));
                setColor(parentOf(x), BLACK);
                setColor(leftOf(sib), BLACK);
                rotateRight(parentOf(x));
                x = root;
            }
        }
    }

    setColor(x, BLACK);
}
```
