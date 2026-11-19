---
title: Doxygen 注释
date: 2024-04-22
slug: doxygen-comments
category: it
tags:
  - cpp
  - c
summary: Doxygen 的使用方法与常用注释命令整理，覆盖文件、结构体、函数、常量和变量的注释写法。
status: published
---

# Doxygen

`Doxygen` 是一个程序的文件产生工具，可将程序中的特定批注转换成为说明文件。通常我们在写程序时，或多或少都会写上批注，但是对于其它人而言，要直接探索程序里的批注，与打捞铁达尼号同样的辛苦。大部分有用的批注都是属于针对函式，类别等等的说明。所以，如果能依据程序本身的结构，将批注经过处理重新整理成为一个纯粹的参考手册，对于后面利用您的程序代码的人而言将会减少许多的负担。不过，反过来说，整理文件的工作对于您来说，就是沉重的负担。

Doxygen 就是在您写批注时，稍微按照一些它所制订的规则。接着，他就可以帮您产生出漂亮的文档了。

因此，Doxygen 的使用可分为两大部分。首先是特定格式的批注撰写，第二便是利用Doxygen的工具来产生文档。



所谓`Doxygen`语法就是在写程序注视时候按照`Doxygen`语法规则来写注释。只有按照标准的注释规则来写注释，生成的文档才会非常偏亮，否则乱七八糟的。

## 1.特殊命令简介

| 命令        | 字段名                                                       | 语法                                                      |
| ----------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| @file       | 文件名                                                       | file [< name >]                                           |
| @brief      | 简介                                                         | brief { brief description }                               |
| @author     | 作者                                                         | author { list of authors }                                |
| @mainpage   | 主页信息                                                     | mainpage [(title)]                                        |
| @date       | 年-月-日                                                     | date { date description }                                 |
| @author     | 版本号                                                       | version { version number }                                |
| @copyright  | 版权                                                         | copyright { copyright description }                       |
| @param      | 参数                                                         | param [(dir)] < parameter-name> { parameter description } |
| @return     | 返回                                                         | return { description of the return value }                |
| @retval     | 返回值                                                       | retval { description }                                    |
| @bug        | 漏洞                                                         | bug { bug description }                                   |
| @details    | 细节                                                         | details { detailed description }                          |
| @pre        | 前提条件                                                     | pre { description of the precondition }                   |
| @see        | 参考                                                         | see { references }                                        |
| @link       | 连接(与@see类库，{@link [http://www.google.com](https://link.zhihu.com/?target=http%3A//www.google.com)}) | link < link-object>                                       |
| @throw      | 异常描述                                                     | throw < exception-object> { exception description }       |
| @todo       | 待处理                                                       | todo { paragraph describing what is to be done }          |
| @warning    | 警告信息                                                     | warning { warning message }                               |
| @deprecated | 弃用说明。可用于描述替代方案，预期寿命等                     | deprecated { description }                                |
| @example    | 弃用说明。可用于描述替代方案，预期寿命等                     | deprecated { description }                                |

以上是写注释是可以加上的，但是实际操作中，并不需要这么多参数。

## 2.文件注释

一般放在文件开头

```text
/**
 * @file 文件名
 * @brief 简介
 * @details 细节
 * @author 作者
 * @version 版本号
 * @date 年-月-日
 * @copyright 版权
 */
```

## 3.结构体注释

```text
/**
 * @brief 类的详细描述
 */
```

## 4.函数注释

```text
/**
  * @brief 函数描述
  * @param 参数描述
  * @return 返回描述
  * @retval 返回值描述
  */
```

## 5.常量/变量注释

一般常量/变量可以有两种形式：

- **常量/变量上一行注释**
- **常量/变量后注释**

```text
//定义一个整型变量a
int a;

/**
 * @brief 定义一个整型变量a
*/
int a;

int a; /*!< 定义一个整型变量a */
int a; /**< 定义一个整型变量a */
int a; //!< 定义一个整型变量a
int a; ///< 定义一个整型变量a
```
