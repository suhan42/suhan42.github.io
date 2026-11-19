---
title: Python 笔记
date: 2026-11-18
slug: python-notes
category: it
tags:
  - python
summary: 覆盖 Python 字符串、列表、异步、类型标注、日志、异常、装饰器和常用库的笔记。
status: published
---

# python

异步、类型标注、日志、异常处理、装饰器、上下文管理、基础并发、数据类、常用库

---

查看程序位置cmd

```cmd
where python
```

# pass

在Python中，`pass`是一个空操作语句，通常用于占位，以确保代码结构的完整性。

## 字符串

**[头下标:尾下标]** 获取的子字符串包含头下标的字符，但不包含尾下标的字符。

比如:

```
>>> s = 'abcdef'
>>> s[1:5]
'bcde'
```

当使用以冒号分隔的字符串，python 返回一个新的对象，结果包含了以这对偏移标识的连续的内容，左边的开始是包含了下边界。

上面的结果包含了 **s[1]** 的值 b，而取到的最大范围**不包括尾下标【到不了】**，就是 **s[5]** 的值 f。

![img](https://www.runoob.com/wp-content/uploads/2013/11/o99aU.png)

**加号（+）**是字符串连接运算符，**星号（*）**是重复操作。

### f-string

以`f`开头的字符串，称之为`f-string`，它和普通字符串不同之处在于，字符串如果包含`{xxx}`，就会以对应的变量替换：

```python
>>> r = 2.5
>>> s = 3.14 * r ** 2
>>> print(f'The area of a circle with radius {r} is {s:.2f}')
The area of a circle with radius 2.5 is 19.62
```

上述代码中，`{r}`被变量`r`的值替换，`{s:.2f}`被变量`s`的值替换，并且`:`后面的`.2f`指定了格式化参数（即保留两位小数），因此，`{s:.2f}`的替换结果是`19.62`。

## 列表 list

用索引来访问list中每一个位置的元素，记得索引是从`0`开始的。

当索引超出了范围时，Python会报一个`IndexError`错误，所以，要确保索引不要越界，记得最后一个元素的索引是`len(classmates) - 1`。

```python
list = [ 'runoob', 786 , 2.23, 'john', 70.2 ]
tinylist = [123, 'john']
 
>>>print list               # 输出完整列表
['runoob', 786, 2.23, 'john', 70.2]

>>>print list[0]            # 输出列表的第一个元素
runoob

>>>print list[1:3]          # 输出第二个至第三个元素
[786, 2.23]

>>>print list[2:]           # 输出从第三个开始至列表末尾的所有元素
[2.23, 'john', 70.2]


>>>print tinylist * 2       # 输出列表两次
[123, 'john', 123, 'john']

>>>print list + tinylist    # 打印组合的列表
['runoob', 786, 2.23, 'john', 70.2, 123, 'john']

>>>print(list[-1])			# 直接获取最后一个元素
70.2
```

用`len()`函数可以获得list元素的个数：

```python
>>>print("列表长度: ", len(list))
列表长度: 5
```

### 脚本操作符

列表对 + 和 * 的操作符与字符串相似。+ 号用于组合列表，* 号用于重复列表。

如下所示：

| Python 表达式                | 结果                         | 描述                 |
| :--------------------------- | :--------------------------- | :------------------- |
| len([1, 2, 3])               | 3                            | 长度                 |
| [1, 2, 3] + [4, 5, 6]        | [1, 2, 3, 4, 5, 6]           | 组合                 |
| ['Hi!'] * 4                  | ['Hi!', 'Hi!', 'Hi!', 'Hi!'] | 重复                 |
| 3 in [1, 2, 3]               | True                         | 元素是否存在于列表中 |
| for x in [1, 2, 3]: print x, | 1 2 3                        | 迭代                 |

### 函数&方法

Python包含以下函数:

| 序号 | 函数                                                         |
| :--- | :----------------------------------------------------------- |
| 1    | [cmp(list1, list2)](https://www.runoob.com/python/att-list-cmp.html) 比较两个列表的元素 |
| 2    | [len(list)](https://www.runoob.com/python/att-list-len.html) 列表元素个数 |
| 3    | [max(list)](https://www.runoob.com/python/att-list-max.html) 返回列表元素最大值 |
| 4    | [min(list)](https://www.runoob.com/python/att-list-min.html) 返回列表元素最小值 |
| 5    | [list(seq)](https://www.runoob.com/python/att-list-list.html) 将元组转换为列表 |

Python包含以下方法:

| 序号 | 方法                                                         |
| :--- | :----------------------------------------------------------- |
| 1    | [list.append(obj)](https://www.runoob.com/python/att-list-append.html) 在列表末尾添加新的对象 |
| 2    | [list.count(obj)](https://www.runoob.com/python/att-list-count.html) 统计某个元素在列表中出现的次数 |
| 3    | [list.extend(seq)](https://www.runoob.com/python/att-list-extend.html) 在列表末尾一次性追加另一个序列中的多个值（用新列表扩展原来的列表） |
| 4    | [list.index(obj)](https://www.runoob.com/python/att-list-index.html) 从列表中找出某个值第一个匹配项的索引位置 |
| 5    | [list.insert(index, obj)](https://www.runoob.com/python/att-list-insert.html) 将对象插入列表 |
| 6    | [list.pop([index=-1])](https://www.runoob.com/python/att-list-pop.html) 移除列表中的一个元素（默认最后一个元素），并且返回该元素的值 |
| 7    | [list.remove(obj)](https://www.runoob.com/python/att-list-remove.html) 移除列表中某个值的第一个匹配项 |
| 8    | [list.reverse()](https://www.runoob.com/python/att-list-reverse.html) 反向列表中元素 |
| 9    | [list.sort(cmp=None, key=None, reverse=False)](https://www.runoob.com/python/att-list-sort.html) 对原列表进行排序 |

例如：

```python
list = []          ## 空列表
list.append('Google')   ## 使用 append() 添加元素
list.append('Runoob')
print(list)	# ['Google', 'Runoob']

# del 语句来删除列表的元素
del list[0]
print(list)	# ['Runoob']
```

也可以把元素插入到指定的位置，比如索引号为`1`的位置：

```plain
>>> classmates.insert(1, 'Jack')
>>> classmates
['Michael', 'Jack', 'Bob', 'Tracy', 'Adam']
```

要删除list末尾的元素，用`pop()`方法：

```plain
>>> classmates.pop()
'Adam'
>>> classmates
['Michael', 'Jack', 'Bob', 'Tracy']
```

要删除指定位置的元素，用`pop(i)`方法，其中`i`是索引位置：

```plain
>>> classmates.pop(1)
'Jack'
>>> classmates
['Michael', 'Bob', 'Tracy']
```

## 元组 tuple（只读列表）

元组是另一个数据类型，类似于 List（列表）。元组用 **()** 标识。内部元素用逗号隔开。但是元组不能二次赋值，相当于**只读列表**。

```python
tuple = ( 'runoob', 786 , 2.23, 'john', 70.2 )
tinytuple = (123, 'john')
```

**tuple的陷阱**：当你定义一个tuple时，在定义的时候，tuple的元素就必须被确定下来，比如：

```plain
>>> t = (1, 2)
>>> t
(1, 2)
```

如果要定义一个空的tuple，可以写成`()`：

```plain
>>> t = ()
>>> t
()
```

但是，要定义一个只有1个元素的tuple，如果你这么定义：

```plain
>>> t = (1)
>>> t
1
```

定义的不是tuple，是`1`这个数！这是因为括号`()`既可以表示tuple，又可以表示数学公式中的小括号，这就产生了歧义，因此，Python规定，这种情况下，按小括号进行计算，计算结果自然是`1`。

所以，只有1个元素的tuple定义时必须加一个逗号`,`，来消除歧义：

```plain
>>> t = (1,)
>>> t
(1,)
```

Python在显示只有1个元素的tuple时，也会加一个逗号`,`，以免你误解成数学计算意义上的括号。



## 字典 dict

字典（dictionary）是除列表以外python之中最灵活的内置数据结构类型。在其他语言中也称为**map**，使用键-值（key-value）存储，具有极快的查找速度。

- 列表是**有序**的对象集合；
- 字典是**无序**的对象集合。

两者之间的区别在于：字典当中的元素是通过**键**来存取的，而不是通过偏移存取。

字典用"{ }"标识。字典由索引(key)和它对应的值value组成。

```python
dict = {}
dict['one'] = "This is one"
dict[2] = "This is two"
 
tinydict = {'name': 'runoob',
            'code':6734, 
            'dept': 'sales'}

# tinydict['name']
# 表示当前key下的values

>>>print dict['one']          # 输出键为'one' 的值
This is one

>>>print dict[2]              # 输出键为 2 的值
This is two

>>>print tinydict             # 输出完整的字典
{'dept': 'sales', 'code': 6734, 'name': 'runoob'}

>>>print tinydict.keys()      # 输出所有键
['dept', 'code', 'name']

>>>print tinydict.values()    # 输出所有值
['sales', 6734, 'runoob']

>>>print(f"tinydict['name']: {tinydict['name']}")
tinydict['Name']: runoob
```

1. 一个key只能对应一个value，所以，多次对一个key放入value，后面的值会把前面的值冲掉。

2. 如果key不存在，dict就会报错要避免key不存在的错误，有两种办法，一是通过`in`判断key是否存在：

    ```plain
    >>> 'Thomas' in d
    False
    ```

    二是通过dict提供的`get()`方法，如果key不存在，可以返回`None`，或者自己指定的value：

    ```plain
    >>> d.get('Thomas')
    >>> d.get('Thomas', -1)
    -1
    ```

​	注意：返回`None`的时候Python的交互环境不显示结果。

3. 要删除一个key，用`pop(key)`方法，对应的value也会从dict中删除：

   ```plain
   >>> d.pop('Bob')
   75
   >>> d
   {'Michael': 95, 'Tracy': 85}
   ```

### 字典内置函数&方法

Python字典包含了以下内置函数：

| 序号 | 函数及描述                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | [cmp(dict1, dict2)](https://www.runoob.com/python/att-dictionary-cmp.html) 比较两个字典元素。 |
| 2    | [len(dict)](https://www.runoob.com/python/att-dictionary-len.html) 计算字典元素个数，即键的总数。 |
| 3    | [str(dict)](https://www.runoob.com/python/att-dictionary-str.html) 输出字典可打印的字符串表示。 |
| 4    | [type(variable)](https://www.runoob.com/python/att-dictionary-type.html) 返回输入的变量类型，如果变量是字典就返回字典类型。 |

Python字典包含了以下内置方法：

| 序号 | 函数及描述                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | [dict.clear()](https://www.runoob.com/python/att-dictionary-clear.html) 删除字典内所有元素 |
| 2    | [dict.copy()](https://www.runoob.com/python/att-dictionary-copy.html) 返回一个字典的浅复制 |
| 3    | [dict.fromkeys(seq[, val])](https://www.runoob.com/python/att-dictionary-fromkeys.html) 创建一个新字典，以序列 seq 中元素做字典的键，val 为字典所有键对应的初始值 |
| 4    | [dict.get(key, default=None)](https://www.runoob.com/python/att-dictionary-get.html) 返回指定键的值，如果值不在字典中返回default值 |
| 5    | [dict.has_key(key)](https://www.runoob.com/python/att-dictionary-has_key.html) 如果键在字典dict里返回true，否则返回false。Python3 不支持。 |
| 6    | [dict.items()](https://www.runoob.com/python/att-dictionary-items.html) 以列表返回可遍历的(键, 值) 元组数组 |
| 7    | [dict.keys()](https://www.runoob.com/python/att-dictionary-keys.html) 以列表返回一个字典所有的键 |
| 8    | [dict.setdefault(key, default=None)](https://www.runoob.com/python/att-dictionary-setdefault.html) 和get()类似, 但如果键不存在于字典中，将会添加键并将值设为default |
| 9    | [dict.update(dict2)](https://www.runoob.com/python/att-dictionary-update.html) 把字典dict2的键/值对更新到dict里 |
| 10   | [dict.values()](https://www.runoob.com/python/att-dictionary-values.html) 以列表返回字典中的所有值 |
| 11   | [pop(key[,default])](https://www.runoob.com/python/python-att-dictionary-pop.html) 删除字典给定键 key 所对应的值，返回值为被删除的值。key值必须给出。 否则，返回default值。 |
| 12   | [popitem()](https://www.runoob.com/python/python-att-dictionary-popitem.html) 返回并删除字典中的最后一对键和值。 |

### 字典合并

#### 一、传统方式（Python 3.8 之前）

##### 1. `update()` — 原地修改

```python
a = {'x': 1}
b = {'y': 2}

a.update(b)      # a 被修改了
print(a)         # {'x': 1, 'y': 2}
```

> ⚠️ 缺点：修改原字典，不返回新字典

##### 2. 解包合并 — 创建新字典

```python
a = {'x': 1}
b = {'y': 2}

c = {**a, **b}   # 解包合并，原字典不变
print(c)         # {'x': 1, 'y': 2}
```

> 键冲突时，后面的覆盖前面的：`{**a, **b}` 中 `b` 的键优先

#### 二、现代方式（Python 3.9+）⭐ 推荐

##### `|` 合并运算符

```python
a = {'x': 1, 'y': 2}
b = {'y': 3, 'z': 4}

c = a | b        # 合并为新字典，a、b 都不变
print(c)         # {'x': 1, 'y': 3, 'z': 4}  ← y 被 b 覆盖
```

##### `|=` 原地更新

```python
a |= b           # 等价于 a.update(b)，但写法更简洁
print(a)         # {'x': 1, 'y': 3, 'z': 4}
```

【总结】用 `|`：`dict1 | dict2` 简洁直观；原地更新用 `|=`；

#### 三、对比总结

| 方式                   | 语法          | 是否新建 | 适用版本   |      |
| :--------------------- | :------------ | :------- | :--------- | ---- |
| `update()`             | `a.update(b)` | ❌ 修改 a | 所有       |      |
| 解包                   | `{**a, **b}`  | ✅ 新建   | 3.5+       |      |
| `           | ` 运算符 | `a | b`       | ✅ 新建   | **3.9+** ⭐ |      |
| `|=` 运算符            | `a |= b`      | ❌ 修改 a | **3.9+** ⭐ |      |

#### 四、处理键冲突

```python
# 自定义合并逻辑：值相加而不是覆盖
from collections import Counter

a = {'apple': 3, 'banana': 2}
b = {'apple': 5, 'orange': 4}

c = Counter(a) + Counter(b)
print(dict(c))   # {'apple': 8, 'banana': 2, 'orange': 4}
```





## Python数据类型转换

有时候，我们需要对数据内置的类型进行转换，数据类型的转换，你只需要将数据类型作为函数名即可。

以下几个内置的函数可以执行数据类型之间的转换。这些函数返回一个新的对象，表示转换的值。

| 函数                                                         | 描述                                                |
| :----------------------------------------------------------- | :-------------------------------------------------- |
| [int(x [,base])](https://www.runoob.com/python/python-func-int.html) | 将x转换为一个整数                                   |
| [long(x [,base] )](https://www.runoob.com/python/python-func-long.html) | 将x转换为一个长整数                                 |
| [float(x)](https://www.runoob.com/python/python-func-float.html) | 将x转换到一个浮点数                                 |
| [complex(real [,imag])](https://www.runoob.com/python/python-func-complex.html) | 创建一个复数                                        |
| [str(x)](https://www.runoob.com/python/python-func-str.html) | 将对象 x 转换为字符串                               |
| [repr(x)](https://www.runoob.com/python/python-func-repr.html) | 将对象 x 转换为表达式字符串                         |
| [eval(str)](https://www.runoob.com/python/python-func-eval.html) | 用来计算在字符串中的有效Python表达式,并返回一个对象 |
| [tuple(s)](https://www.runoob.com/python/att-tuple-tuple.html) | 将序列 s 转换为一个元组                             |
| [list(s)](https://www.runoob.com/python/att-list-list.html)  | 将序列 s 转换为一个列表                             |
| [set(s)](https://www.runoob.com/python/python-func-set.html) | 转换为可变集合                                      |
| [dict(d)](https://www.runoob.com/python/python-func-dict.html) | 创建一个字典。d 必须是一个序列 (key,value)元组。    |
| [frozenset(s)](https://www.runoob.com/python/python-func-frozenset.html) | 转换为不可变集合                                    |
| [chr(x)](https://www.runoob.com/python/python-func-chr.html) | 将一个整数转换为一个字符                            |
| [unichr(x)](https://www.runoob.com/python/python-func-unichr.html) | 将一个整数转换为Unicode字符                         |
| [ord(x)](https://www.runoob.com/python/python-func-ord.html) | 将一个字符转换为它的整数值                          |
| [hex(x)](https://www.runoob.com/python/python-func-hex.html) | 将一个整数转换为一个十六进制字符串                  |
| [oct(x)](https://www.runoob.com/python/python-func-oct.html) | 将一个整数转换为一个八进制字符串                    |



## for

`break`语句用来终止循环语句，即循环条件没有False条件或者序列还没被完全递归完，也会停止执行循环语句。

通过`continue`语句，跳过当前的这次循环，直接开始下一次循环。

### rang()

`range()` 函数默认 0 为起始值，不过可以通过添加参数来指定起始值

```python
for x in range(3, 10):
	print(x)
```

输出就是3~9

`range()` 函数默认将序列递增 1，但是可以通过添加第三个参数来指定增量值：`range(1, 10, 2)`

```python
for x in range(1, 10, 2):
	print(x)
	
>
1
3
5
7
9
```

### else

for 循环中的 `else` 关键字指定循环结束时要执行的代码块

## : 冒号

冒号（：）表示的就是一个整体，冒号出现在哪里就代表这个位置对整体。

**1、作为整体用于输出**

同理：`print(a[:])`等价于`print(a)`，a[n]就表示a中的第n个元素，用`：`代替`n`就是取所有元素的意思。

```python
x = np.array([[1,2,3],[4,5,6]])
print(x[0,:])
print(x[:,0])

>
[1 2 3]
[1 4]
```

**2、作为整体参与运算**

就是在原来a=[0 1 2 3 4 5 6 7 8]之上砍掉了最后一个元素，即第-1个元素。冒号在其中第作用就是将a中的所有元素作为一个整体，一个整体被-1就是砍掉最后一个元素。
`:-n`即砍掉最后n个元素。

若`print(a[:1])`，则输出[0]。相当于取`：`代替整体中的第一个元素。

```python
a = np.arange(0,9)
print(a[:-1])

>
[0 1 2 3 4 5 6 7]
```

**3、双冒号**

```python
a = np.arange(0,9)
print(a[::2])

>
[0 1 2 3 4 5 6 7 8]
[0 2 4 6 8]
```

`a[::2]`将a中的元素两个两个分组并取每组中第一个出来，也可以理解为每2个数中取一个。
`a[::3]`将a中的元素三个三个分组并取每组中第一个出来。

```python
a = np.arange(0,9)
print(a[::-1])

>
[8 7 6 5 4 3 2 1 0]
#即将a中的元素倒序。
```

`a[::-2]`即将a中元素倒序后两个两个分组并取每组中第一个。

# 生成器 generator

[生成器 - Python教程 - 廖雪峰的官方网站](https://liaoxuefeng.com/books/python/advanced/generator/index.html)

列表元素可以按照某种算法推算出来，那我们是否可以在循环的过程中不断推算出后续的元素呢？这样就不必创建完整的list，从而节省大量的空间。在Python中，这种一边循环一边计算的机制，称为生成器：generator。

有两种定义方式：

## 列表生成式改写

要创建一个generator，有很多种方法。第一种方法很简单，只要把一个列表生成式的`[]`改成`()`，就创建了一个generator：

```python
>>> L = [x * x for x in range(10)]			# 列表生成式
>>> L
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
>>> g = (x * x for x in range(10))			# 生成器
>>> g
<generator object <genexpr> at 0x1022ef630>
```

因为generator也是可迭代对象，使用`for`循环获取生成的数据：

```python
>>> g = (x * x for x in range(10))
>>> for n in g:
...     print(n)
... 
0
1
4
9
16
25
36
49
64
81
```

## 函数 generator function

例如：**斐波拉契数列**用列表生成式写不出来。用函数把它打印出来却很容易：

```python
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        print(b)
        a, b = b, a + b
        n = n + 1
    return 'done'
```

仔细观察，可以看出，`fib`函数实际上是定义了斐波拉契数列的**推算规则**，可以从第一个元素开始，推算出后续任意的元素，这种逻辑其实非常类似generator。

也就是说，上面的函数和generator仅一步之遥。要把`fib`函数变成generator函数：**只需要把`print(b)`改为`yield b`**就可以了：

```python
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b		# 关键字
        a, b = b, a + b
        n = n + 1
    return 'done'
```

这就是定义generator的另一种方法。如果一个函数定义中包含`yield`关键字，那么这个函数就不再是一个普通函数，而是一个**generator函数**，调用一个generator函数将返回一个generator：

```plain
>>> f = fib(6)
>>> f
<generator object fib at 0x104feaaa0>
```

这里，最难理解的就是generator函数和普通函数的执行流程不一样。普通函数是顺序执行，遇到`return`语句或者最后一行函数语句就返回。

### yield

而变成generator的函数，**在每次调用`next()`的时候执行，遇到`yield`语句返回，再次执行时从上次返回的`yield`语句处继续执行**。

举个简单的例子，定义一个generator函数，依次返回数字1，3，5：

```python
def odd():
    print('step 1')
    yield 1
    print('step 2')
    yield(3)
    print('step 3')
    yield(5)
```

调用该generator函数时，首先要生成一个generator对象，然后用`next()`函数不断获得下一个返回值：

```python
>>> o = odd()
>>> next(o)
step 1
1
>>> next(o)
step 2
3
>>> next(o)
step 3
5
>>> next(o)
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
StopIteration
```

可以看到，`odd`不是普通函数，而是generator函数，在执行过程中，遇到`yield`就中断，下次又继续执行。执行3次`yield`后，已经没有`yield`可以执行了，所以，第4次调用`next(o)`就报错。

【注意】调用generator函数会创建一个generator对象，多次调用generator函数会创建**多个相互独立**的generator。如果不创建对象，调用`next()`每次都返回1：

```plain
>>> next(odd())
step 1
1
>>> next(odd())
step 1
1
>>> next(odd())
step 1
1
```

原因在于`odd()`会创建一个新的generator对象，上述代码实际上创建了3个完全独立的generator，对3个generator分别调用`next()`当然每个都会返回第一个值。

正确的写法是创建一个generator对象，然后不断对这一个generator对象调用`next()`：

```plain
>>> g = odd()
>>> next(g)
step 1
1
>>> next(g)
step 2
3
>>> next(g)
step 3
5
```

回到`fib`的例子，我们在循环过程中不断调用`yield`，就会不断中断。当然要给循环设置一个条件来退出循环，不然就会产生一个无限数列出来。

同样的，把函数改成generator函数后，我们基本上从来不会用`next()`来获取下一个返回值，而是直接使用`for`循环来迭代：

```plain
>>> for n in fib(6):
...     print(n)
...
1
1
2
3
5
8
```

但是用`for`循环调用generator时，发现拿不到generator的`return`语句的返回值。如果想要拿到返回值，必须捕获`StopIteration`错误，返回值包含在`StopIteration`的`value`中：

```python
>>> g = fib(6)
>>> while True:
...     try:
...         x = next(g)
...         print('g:', x)
...     except StopIteration as e:
...         print('Generator return value:', e.value)
...         break
...
g: 1
g: 1
g: 2
g: 3
g: 5
g: 8
Generator return value: done
```

关于如何捕获错误，后面的错误处理还会详细讲解。

# 函数

## 可变数量位置参数

### *args

```python
def show_args(*args):
    print(type(args))   # <class 'tuple'>
    print(args)         # (1, 2, 3)
    print(args[0])      # 1（可以像元组一样索引）

show_args(1, 2, 3)
```

- `*`：打包/解包运算符，表示"收集所有多余的位置参数"
- `args`：变量名（惯例叫 `args`，可以改）

`*args`让函数可以接受**任意个数**的参数，内部当作**元组**处理。

### **kwargs

```python
def show_info(**kwargs):
    print(type(kwargs))   # <class 'dict'>
    print(kwargs)         # {'name': '张三', 'age': 25, 'city': '北京'}

show_info(name="张三", age=25, city="北京")
```

- `**`：收集所有多余的关键字参数
- `kwargs`：变量名（惯例叫 `kwargs`，即 "keyword arguments"）

例如：

```python
def build_profile(**kwargs):
    profile = {}
    for key, value in kwargs.items():
        profile[key] = value
    return profile

# 调用
user = build_profile(name="李四", age=30, job="工程师")
print(user)  # {'name': '李四', 'age': 30, 'job': '工程师'}
```

常见用法

```python
# 1. 不传参数 → 空字典
build_profile()        # kwargs = {}

# 2. 传任意个数
build_profile(a=1)                    # {'a': 1}
build_profile(a=1, b=2, c=3)          # {'a': 1, 'b': 2, 'c': 3}

# 3. 解包传入（已有字典时）
data = {"name": "王五", "age": 28}
build_profile(**data)   # ** 把字典解包成 name="王五", age=28
```

### `*args` 和 `**kwargs` 对比

| 写法       | 接收方式         | 内部类型 | 调用方式         |
| :--------- | :--------------- | :------- | :--------------- |
| `*args`    | 多余的位置参数   | 元组     | `func(1, 2, 3)`  |
| `**kwargs` | 多余的关键字参数 | 字典     | `func(a=1, b=2)` |

### 实际应用：装饰器、继承方法

```python
# 包装函数时保留原函数的所有参数
def my_decorator(func):
    def wrapper(*args, **kwargs):   # 接收任何参数
        print("调用前")
        result = func(*args, **kwargs)  # 原样传给原函数
        print("调用后")
        return result
    return wrapper
```

------

## map()

`map()` 会根据提供的函数对指定序列做**映射**。

它会接收两个参数（一个是函数，一个是`Iterable`），前者是后者的**映射函数**。`map`将传入的函数依次作用到序列的每个元素，并把结果作为新的`Iterator`返回。

```python
map(function, iterable, ...)
```

- 参数
  - function -- 函数
  - Iterable -- 一个或多个序列

- 返回值
  - Python 2.x 返回列表。
  - Python 3.x 返回迭代器。

【例子】假设我们有一个数字列表，我们想要获取每个数字的平方，就可以使用map()函数。

```python
def square(x):
    return x * x
numbers = [1, 2, 3, 4, 5]

squared = map(square, numbers)
print(list(squared))
```

## reduce()

`reduce()` 函数会对参数序列中元素进行**累积**。

函数将一个数据集合iterable（链表，元组等）中的所有数据进行下列操作：

用传给 reduce 中的函数 function（有两个参数）先对集合iterable中的前 1、2 个元素进行操作，得到的结果再与第三个数据用 function 函数运算，最后得到函数计算的结果。

> **注意：**Python3.x reduce() 已经被移到 functools 模块里，如果我们要使用，需要引入 functools 模块来调用 reduce() 函数：
>
> ```
> from functools import reduce
> ```

```python
reduce(function, iterable[, initializer])
```

- 参数

  - function -- 函数，有两个参数

  - iterable -- 可迭代对象

  - initializer -- 可选，初始参数

- 返回值

  - 函数计算的结果

【例子】

```python
from functools import reduce

def add(x, y) :            # 两数相加
    return x + y
sum1 = reduce(add, [1,2,3,4,5])   # 计算列表和：1+2+3+4+5
sum2 = reduce(lambda x, y: x+y, [1,2,3,4,5])  # 使用 lambda 匿名函数
print(sum1)
print(sum2)
```

> 15
> 15

这个例子本身没多大用处，但是，如果考虑到字符串`str`也是一个序列，对上面的例子稍加改动，配合`map()`，我们就可以写出把`str`转换为`int`的函数。整理成一个`str2int`的函数就是：

```python
from functools import reduce

DIGITS = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}

def str2int(s):
    def fn(x, y):
        return x * 10 + y
    def char2num(s):
        return DIGITS[s]
    return reduce(fn, map(char2num, s))
```

还可以用lambda函数进一步简化成：

```python
from functools import reduce

DIGITS = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}

def char2num(s):
    return DIGITS[s]

def str2int(s):
    return reduce(lambda x, y: x * 10 + y, map(char2num, s))
```

> print(str2int('15545'))
>
> 结果：15545

也就是说，假设Python没有提供`int()`函数，你完全可以自己写一个把字符串转化为整数的函数，而且只需要几行代码！

---

## 返回函数

实现一个可变参数的求和。通常情况下，求和的函数是这样定义的：

```python
def calc_sum(*args):
    ax = 0
    for n in args:
        ax = ax + n
    return ax
```

但是，如果**不需要立刻求和，而是在后面的代码中**，根据需要再计算怎么办？可以不返回求和的结果，而是**返回求和的函数**，当调用`lazy_sum()`时，返回的并不是求和结果，而是求和函数，调用函数`f`时，才真正计算求和的结果。

```python
def lazy_sum(*args):
    def sum():
        ax = 0
        for n in args:
            ax = ax + n
        return ax
    return sum

f = lazy_sum(1, 3, 5, 7, 9)
f		# <function lazy_sum.<locals>.sum at 0x101c6ed90>
f()		# 25
```

在这个例子中，我们在函数`lazy_sum`中又定义了函数`sum`，并且，内部函数`sum`可以引用外部函数`lazy_sum`的参数和局部变量，当`lazy_sum`返回函数`sum`时，相关参数和变量都保存在返回的函数中，这种称为“闭包（Closure）”的程序结构拥有极大的威力。

请再注意一点，当我们调用`lazy_sum()`时，每次调用都会返回一个新的函数，即使传入相同的参数：

```plain
>>> f1 = lazy_sum(1, 3, 5, 7, 9)
>>> f2 = lazy_sum(1, 3, 5, 7, 9)
>>> f1==f2
False
```

`f1()`和`f2()`的调用结果互不影响。

### 闭包

- **闭包是一个函数**，它可以访问并记住自己**定义时的作用域**（即使该作用域已经执行完毕）。
- **本质**：函数内部嵌套的函数，能够“捕获”外部函数的变量，并长期保留这些变量的引用。

>### 用「背包」来类比
>
>假设你是一个学生，每天背着书包去上学。闭包就像你的书包：
>
>- **书包里有什么？** 装着你需要的课本、文具（相当于函数内部需要的变量）。
>- **书包的规则：** 你可以在教室里（函数内部）往书包里放东西，**即使放学回家了（函数执行完毕）** ，书包里的东西依然存在，第二天还能继续用。
>- **关键点：** 书包里的东西（变量）**只属于你**，别人拿不到（私有性）。
>
>**闭包的本质：** 函数放学回家了（执行完毕），但它依然背着自己的书包（保存了函数创建时的作用域变量），随时可以打开书包用里面的东西。

注意到返回的函数在其定义内部引用了局部变量`args`，所以，当一个函数返回了一个函数后：

1. 其内部的局部变量还被新函数引用；
2. 返回的函数并没有立刻执行，而是直到调用了`f()`才执行。

```python
def count():
    fs = []
    for i in range(1, 4):
        def f():
             return i*i
        fs.append(f)
    return fs

f1, f2, f3 = count()
```

在上面的例子中，每次循环，都创建了一个新的函数，然后，把创建的3个函数都返回了。

你可能认为调用`f1()`，`f2()`和`f3()`结果应该是`1`，`4`，`9`，但实际结果是：

```plain
>>> f1()
9
>>> f2()
9
>>> f3()
9
```

全部都是`9`！原因就在于返回的函数引用了变量`i`，但它并非立刻执行。等到3个函数都返回时，它们所引用的变量`i`已经变成了`3`，因此最终结果为`9`。

> [!note]
>
> 返回闭包时牢记一点：返回函数**不要引用任何循环变量，或者后续会发生变化的变量**。

如果一定要引用循环变量怎么办？方法是**再创建一个函数**，用该函数的参数绑定循环变量当前的值，无论该循环变量后续如何更改，已绑定到函数参数的值不变：

```python
def count():
    def f(j):
        def g():
            return j*j
        return g
    fs = []
    for i in range(1, 4):
        fs.append(f(i)) # f(i)立刻被执行，因此i的当前值被传入f()
    return fs
```

再看看结果：

```plain
>>> f1, f2, f3 = count()
>>> f1()
1
>>> f2()
4
>>> f3()
9
```

### nonlocal

使用闭包，就是内层函数引用了外层函数的局部变量。如果只是读外层变量的值，我们会发现返回的闭包函数调用一切正常：

```python
def inc():
    x = 0
    def fn():
        # 仅读取x的值:
        return x + 1
    return fn

f = inc()
print(f()) # 1
print(f()) # 1
```

但是，如果**对外层变量赋值**，由于Python解释器会把`x`当作函数`fn()`的局部变量，它会报错：

```python
def inc():
    x = 0
    def fn():
        # nonlocal x
        x = x + 1
        return x
    return fn

f = inc()
print(f()) # 1
print(f()) # 2
```

原因是`x`作为局部变量并没有初始化，直接计算`x+1`是不行的。但我们其实是想引用`inc()`函数内部的`x`，所以需要在`fn()`函数内部加一个`nonlocal x`的声明。加上这个声明后，解释器把`fn()`的`x`看作外层函数的局部变量，它已经被初始化了，可以正确计算`x+1`。

> [!tip]
>
> 使用闭包时，对外层变量赋值前，需要先使用nonlocal声明该变量不是当前函数的局部变量。

## 匿名函数 lambda

关键字`lambda`表示匿名函数，冒号前面的`x`表示函数参数。

匿名函数有个限制，就是只能有一个表达式，不用写`return`，返回值就是该表达式的结果。

用匿名函数有个好处，因为函数没有名字，不必担心函数名冲突。此外，匿名函数也是一个函数对象，也可以把匿名函数赋值给一个变量，再利用变量来调用该函数：

```python
f = lambda x: x * x
f			# <function <lambda> at 0x101c6ef28>
f(5)		# 25
```

同样，也可以把匿名函数作为返回值返回，比如：

```python
def build(x, y):
    return lambda: x * x + y * y
```

## 装饰器 Decorator

由于函数也是一个对象，而且函数对象可以被赋值给变量，所以，通过变量也能调用该函数。

```python
def now():
	print('2024-6-1')

f = now
f()		# 2024-6-1
```

函数对象有一个`__name__`属性（注意：是前后各两个下划线），可以拿到函数的名字：

```python
now.__name__			# 'now'
f.__name__				#'now'
```

现在，假设我们要增强`now()`函数的功能，比如，在函数调用前后自动打印日志，但又不希望修改`now()`函数的定义，这种在代码运行期间动态增加功能的方式，称之为“装饰器”（Decorator）。

本质上，decorator就是一个**返回函数的高阶函数**。所以，我们要定义一个能打印日志的decorator，可以定义如下：

```python
def log(func):
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper
```

观察上面的`log`，因为它是一个decorator，所以接受一个函数作为参数，并返回一个函数。我们要借助Python的@语法，把decorator置于函数的定义处：

```python
@log
def now():
    print('2024-6-1')
```

调用`now()`函数，不仅会运行`now()`函数本身，还会在运行`now()`函数前打印一行日志：

```plain
>>> now()
call now():
2024-6-1
```

把`@log`放到`now()`函数的定义处，相当于执行了语句：

```python
now = log(now)
```

由于`log()`是一个decorator，返回一个函数，所以，原来的`now()`函数仍然存在，只是现在同名的`now`变量指向了新的函数，于是调用`now()`将执行新函数，即在`log()`函数中返回的`wrapper()`函数。

`wrapper()`函数的参数定义是`(*args, **kw)`，因此，`wrapper()`函数可以接受任意参数的调用。在`wrapper()`函数内，首先打印日志，再紧接着调用原始函数。

---

如果decorator本身需要传入参数，那就需要编写一个返回decorator的高阶函数，写出来会更复杂。比如，要自定义log的文本：

```python
def log(text):
    def decorator(func):
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator
```

这个3层嵌套的decorator用法如下：

```python
@log('execute')
def now():
    print('2024-6-1')
```

执行结果如下：

```plain
>>> now()
execute now():
2024-6-1
```

和两层嵌套的decorator相比，3层嵌套的效果是这样的：

```plain
>>> now = log('execute')(now)
```

我们来剖析上面的语句，首先执行`log('execute')`，返回的是`decorator`函数，再调用返回的函数，参数是`now`函数，返回值最终是`wrapper`函数。

以上两种decorator的定义都没有问题，但还差最后一步。因为我们讲了函数也是对象，它有`__name__`等属性，但你去看经过decorator装饰之后的函数，它们的`__name__`已经从原来的`'now'`变成了`'wrapper'`：

```plain
>>> now.__name__
'wrapper'
```

因为返回的那个`wrapper()`函数名字就是`'wrapper'`，所以，需要把原始函数的`__name__`等属性复制到`wrapper()`函数中，否则，有些依赖函数签名的代码执行就会出错。

### 实例

不需要编写`wrapper.__name__ = func.__name__`这样的代码，Python内置的`functools.wraps`就是干这个事的，所以，一个完整的decorator的写法如下：

```python
import functools

def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper
```

或者针对**带参数的decorator**：

```python
import functools

def log(text):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator
```

`import functools`是导入`functools`模块。模块的概念稍候讲解。现在，只需记住在定义`wrapper()`的前面加上`@functools.wraps(func)`即可。



# 类 class

self 参数，它就相当于每个房子的门钥匙，可以保证每个房子的主人仅能进入自己的房子（每个类对象只能调用自己的类变量和类方法）。

```python
# 类：定义"人"这个模板
class Person:
    species: String = "人类"          # 类属性（所有人共有）

    def __init__(self, name):  # 构造方法：创建时自动执行
        self.name = name       # 实例属性（每人不同）

    def say(self):             # 实例方法
        print(f"我是{self.name}")

# 用类创建对象（实例）
p1 = Person("张三")
p2 = Person("李四")

p1.say()   # 我是张三
p2.say()   # 我是李四
print(p1.species)   # 人类
```

## 核心组成

| 部分         | 作用               | 例子               |
| :----------- | :----------------- | :----------------- |
| **类属性**   | 所有实例共享       | `species = "人类"` |
| **实例属性** | 每个实例独立       | `self.name = name` |
| **方法**     | 对象能做的事       | `def say(self)`    |
| `__init__`   | 初始化（出厂设置） | 创建时自动调用     |

## 三大特性

### 1. 封装：把数据和方法包在一起

```python
class BankAccount:
    def __init__(self, money):
        self.__money = money      # 私有，外部不能直接改

    def get_balance(self):
        return self.__money        # 通过方法安全访问
```

### 2. 继承：子类复用父类代码

```python
class Animal:                    # 父类
    def eat(self):
        print("吃东西")

class Dog(Animal):               # 子类继承 Animal
    def bark(self):
        print("汪汪")

dog = Dog()
dog.eat()     # ✅ 继承来的：吃东西
dog.bark()    # ✅ 自己的：汪汪
```

### 3. 多态：同一接口，不同表现

```python
class Cat(Animal):
    def speak(self):             # 重写
        print("喵喵")

class Dog(Animal):
    def speak(self):
        print("汪汪")

def make_speak(animal):
    animal.speak()               # 同一调用，不同结果

make_speak(Cat())   # 喵喵
make_speak(Dog())   # 汪汪
```

## 快速对比

| 概念     | 类比                         |
| :------- | :--------------------------- |
| **类**   | 汽车设计图纸                 |
| **实例** | 一辆具体的汽车               |
| **属性** | 颜色、品牌（数据）           |
| **方法** | 加速、刹车（行为）           |
| **继承** | 在轿车图纸基础上改出跑车图纸 |
| **封装** | 发动机盖起来，只留方向盘操作 |

## 获取对象信息

### 1. 获取类型信息

```python
class Person:
    pass

p = Person()

type(p)           # <class '__main__.Person'>
type(p).__name__  # 'Person'（只拿类名字符串）
isinstance(p, Person)  # True（推荐用于类型判断）
```

> [!note]
> `isinstance()` 比 `type()` 更好，因为它支持继承链判断。

### 2. 获取对象的所有属性和方法

```python
class Person:
    def __init__(self, name):
        self.name = name
    
    def say_hi(self):
        print(f"Hi, {self.name}")

p = Person("张三")

# 所有属性和方法（包括内置的）
dir(p)
# ['__class__', '__delattr__', ..., 'name', 'say_hi']

# 只列出实例自己的属性（不含方法）
[p for p in dir(p) if not p.startswith('_')]
# ['name', 'say_hi']
```

### 3. 获取实例属性

```python
# 判断是否有某个属性
hasattr(p, 'name')      # True
hasattr(p, 'age')       # False

# 获取属性值（不存在会抛异常）
getattr(p, 'name')      # '张三'

# 安全获取（不存在返回默认值）
getattr(p, 'age', 18)   # 18

# 设置属性
setattr(p, 'age', 25)
p.age                   # 25
```

### 4. 获取对象的"身份"信息

```python
id(p)           # 对象的内存地址，如 140234567890
hex(id(p))      # '0x7f8e...'

# 判断是否是同一个对象
p2 = p
p is p2         # True

# 判断值是否相等
p == p2         # 取决于 __eq__ 的实现
```

### 5. 获取类的详细信息

```python
# 类名
p.__class__.__name__    # 'Person'

# 类的所有父类（元组）
Person.__bases__        # (<class 'object'>,)

# 类的文档字符串
Person.__doc__

# 类定义所在的模块
Person.__module__       # '__main__'
```

### 6. 获取可调用对象的签名（Python 3）

```python
from inspect import signature

class Demo:
    def method(self, x: int, y: str = "default") -> bool:
        return True

d = Demo()
sig = signature(d.method)
print(sig)  # (x: int, y: str = 'default') -> bool

# 获取参数详情
for name, param in sig.parameters.items():
    print(name, param.default, param.annotation)
```

### 7. 综合示例

```python
from inspect import signature

def inspect_obj(obj):
    print(f"类型: {type(obj).__name__}")
    print(f"ID: {id(obj)}")
    print(f"属性: {[a for a in dir(obj) if not a.startswith('_')]}")
    
    if callable(obj):
        print(f"签名: {signature(obj)}")

inspect_obj(p)
# 类型: Person
# ID: 140234567890
# 属性: ['name', 'say_hi']
```

### 快速对照表

| 需求               | 方法                                   |
| :----------------- | :------------------------------------- |
| 什么类型？         | `type(obj)` / `isinstance(obj, Class)` |
| 有哪些属性和方法？ | `dir(obj)`                             |
| 有没有某个属性？   | `hasattr(obj, 'attr')`                 |
| 获取属性值         | `getattr(obj, 'attr', default)`        |
| 内存地址           | `id(obj)`                              |
| 是不是同一个对象？ | `obj1 is obj2`                         |
| 函数签名           | `inspect.signature(func)`              |



## 私有方法 Private Methods

Python 的私有方法（Private Methods）通过**命名约定**实现，不像 Java/C++ 有严格的访问控制关键字。

### 一、定义方式：双下划线前缀 `__method`

```python
class BankAccount:
    def __init__(self, balance):
        self.__balance = balance      # 私有属性
        self._owner = "匿名"           # 受保护属性（单下划线，约定俗成）

    def deposit(self, amount):        # 公有方法
        self.__balance += amount
        return self.__balance

    def __check_balance(self):        # 私有方法
        print(f"当前余额: {self.__balance}")
        return self.__balance

    def show(self):                   # 公有方法调用私有方法
        self.__check_balance()        # ✅ 类内部可以调用

# 创建实例
account = BankAccount(1000)
```

### 二、访问规则

| 位置       | 能否访问       | 示例                                           |
| :--------- | :------------- | :--------------------------------------------- |
| **类内部** | ✅ 可以         | `self.__check_balance()`                       |
| **类外部** | ❌ 不能直接     | `account.__check_balance()` → `AttributeError` |
| **子类中** | ❌ 不能直接继承 | 需要特殊处理                                   |

```python
account.deposit(500)      # ✅ 1500  公有方法
account.show()            # ✅ 当前余额: 1500

account.__check_balance() # ❌ AttributeError: 'BankAccount' object has no attribute '__check_balance'
```

### 三、名称改写（Name Mangling）

Python 并非真正"禁止"访问，而是做了**名称改写**：

```python
print(dir(account))  
# 会看到 _BankAccount__check_balance 和 _BankAccount__balance
```



| 原名              | 改写后                        |
| :---------------- | :---------------------------- |
| `__check_balance` | `_BankAccount__check_balance` |
| `__balance`       | `_BankAccount__balance`       |

**所以仍然可以"强制访问"**（但不推荐）：

```python
account._BankAccount__check_balance()   # ✅ 能运行，但破坏封装
print(account._BankAccount__balance)    # ✅ 1500
```

### 四、三种命名约定对比

| 命名     | 含义                    | 访问权限                     | 示例               |
| :------- | :---------------------- | :--------------------------- | :----------------- |
| `name`   | **公有**                | 任意访问                     | `obj.name`         |
| `_name`  | **受保护**（Protected） | 约定不外部访问，但技术上可以 | `obj._name`        |
| `__name` | **私有**（Private）     | 名称改写，类外部难直接访问   | `obj._Class__name` |



```python
class Demo:
    def public(self):      pass      # 公有
    def _protected(self):  pass      # 受保护（约定）
    def __private(self):   pass      # 私有（名称改写）

d = Demo()
d.public()        # ✅
d._protected()    # ⚠️ 能运行，但不建议
d.__private()     # ❌ AttributeError
```

### 五、为什么要用私有方法？

```python
class PasswordManager:
    def __init__(self, password):
        self.__password = self.__encrypt(password)  # 加密后存储

    def __encrypt(self, pwd):        # 私有：内部加密逻辑，不暴露
        return f"加密后的_{pwd}"

    def verify(self, input_pwd):     # 公有：对外接口
        return self.__encrypt(input_pwd) == self.__password

pm = PasswordManager("123456")
print(pm.verify("123456"))   # ✅ True
print(pm.verify("wrong"))    # ✅ False

pm.__encrypt("abc")          # ❌ 无法直接调用，保护加密算法
```

**好处**：

- **封装细节**：内部实现不暴露
- **防止误用**：避免外部随意调用破坏数据
- **易于维护**：内部逻辑改时不影响外部接口

### 六、私有属性 + Getter/Setter（推荐写法）

```python
class Person:
    def __init__(self, name):
        self.__name = name

    @property                      # 像属性一样访问
    def name(self):
        return self.__name

    @name.setter                   # 设置时加校验
    def name(self, value):
        if len(value) < 2:
            raise ValueError("名字太短")
        self.__name = value

p = Person("张三")
print(p.name)        # ✅ 张三  （像属性一样读）

p.name = "李四"      # ✅ 正常设置
# p.name = "A"       # ❌ ValueError: 名字太短
```

### 总结

| 概念     | 要点                                            |
| :------- | :---------------------------------------------- |
| **定义** | `__method(self)` 双下划线前缀                   |
| **机制** | 名称改写（Name Mangling）→ `_ClassName__method` |
| **目的** | 封装内部逻辑，防止外部直接调用                  |
| **访问** | 类内部 ✅ / 类外部 ❌ / 强制访问 ⚠️ 不推荐         |
| **配合** | 常与 `@property` 一起实现安全的数据访问         |

> Python 的哲学是 **"大家都是成年人"**（We're all consenting adults）—— 私有是约定和提示，不是绝对禁止。



# 魔术方法 Magic Methods（定制类）

Python 中的魔法方法（Magic Methods），也称为特殊方法（Special Methods），是以双下划线开头和结尾的方法。这些方法允许我们自定义类的行为，也就是**定制类**，使其在特定情况下自动调用，从而增强 Python 面向对象编程的能力。

## 一、生命周期方法

| 方法                  | 触发时机        | 说明                           |
| :-------------------- | :-------------- | :----------------------------- |
| `__init__(self, ...)` | `obj = Class()` | **构造方法**，初始化实例属性   |
| `__new__(cls, ...)`   | 创建实例时      | 真正创建对象的方法，很少重写   |
| `__del__(self)`       | 实例被销毁时    | 析构方法，用于资源清理（慎用） |



```python
class Demo:
    def __init__(self, name):
        self.name = name        # 初始化属性
    def __del__(self):
        print(f"{self.name} 被销毁了")
```

## 二、字符串表示方法

| 方法                            | 触发时机                       | 说明                                              |
| :------------------------------ | :----------------------------- | :------------------------------------------------ |
| `__str__(self)`                 | `str(obj)` / `print(obj)`      | **用户友好的**字符串表示                          |
| `__repr__(self)`                | `repr(obj)` / 交互式输出       | **开发者友好的**字符串， ideally 能 `eval()` 还原 |
| `__format__(self, format_spec)` | `format(obj, spec)` / f-string | 自定义格式化输出                                  |



```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __str__(self):
        return f"({self.x}, {self.y})"           # print(p) → (1, 2)
    def __repr__(self):
        return f"Point({self.x}, {self.y})"       # repr(p) → Point(1, 2)

p = Point(1, 2)
print(p)        # (1, 2)
print(repr(p))  # Point(1, 2)
```

> **原则**：`__repr__` 应该尽量详细准确；`__str__` 可以更易读简洁。

## 三、比较运算符

| 方法                  | 运算符 | 说明                                           |
| :-------------------- | :----- | :--------------------------------------------- |
| `__eq__(self, other)` | `==`   | 等于                                           |
| `__ne__(self, other)` | `!=`   | 不等于（通常不用写，Python 自动取反 `__eq__`） |
| `__lt__(self, other)` | `<`    | 小于                                           |
| `__le__(self, other)` | `<=`   | 小于等于                                       |
| `__gt__(self, other)` | `>`    | 大于                                           |
| `__ge__(self, other)` | `>=`   | 大于等于                                       |

```python
class Person:
    def __init__(self, age):
        self.age = age
    def __eq__(self, other):      # ==
        return self.age == other.age
    def __lt__(self, other):      # <
        return self.age < other.age

p1, p2 = Person(20), Person(25)
print(p1 < p2)   # True
print(p1 == p2)  # False
```

> [!tip]
>
> 用 `@functools.total_ordering` 装饰器，只需写 `__eq__` + 任意一个比较方法，自动生成其余。

## 四、算术运算符

| 方法                        | 运算符 | 说明   |
| :-------------------------- | :----- | :----- |
| `__add__(self, other)`      | `+`    | 加法   |
| `__sub__(self, other)`      | `-`    | 减法   |
| `__mul__(self, other)`      | `*`    | 乘法   |
| `__truediv__(self, other)`  | `/`    | 真除法 |
| `__floordiv__(self, other)` | `//`   | 整除   |
| `__mod__(self, other)`      | `%`    | 取模   |
| `__pow__(self, other)`      | `**`   | 幂运算 |

**反向运算**（当左操作数不支持时调用右操作数的）：

| 方法                    | 说明                |
| :---------------------- | :------------------ |
| `__radd__(self, other)` | `other + self`      |
| `__rsub__(self, other)` | `other - self`      |
| ...                     | 其他同理加 `r` 前缀 |

**原地运算**（如 `+=`）：

| 方法                    | 说明                          |
| :---------------------- | :---------------------------- |
| `__iadd__(self, other)` | `+=`，应原地修改并返回 `self` |
| `__isub__(self, other)` | `-=`                          |
| ...                     | 其他同理加 `i` 前缀           |



```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):           # v1 + v2
        return Vector(self.x + other.x, self.y + other.y)
    def __mul__(self, scalar):            # v * 3
        return Vector(self.x * scalar, self.y * scalar)
    def __rmul__(self, scalar):           # 3 * v
        return self * scalar
    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v = Vector(1, 2)
print(v + Vector(3, 4))   # Vector(4, 6)
print(2 * v)              # Vector(2, 4)  ← 调用 __rmul__
```

## 五、容器类型方法

| 方法                            | 触发时机                     | 说明             |
| :------------------------------ | :--------------------------- | :--------------- |
| `__len__(self)`                 | `len(obj)`                   | 返回元素个数     |
| `__getitem__(self, key)`        | `obj[key]`                   | 获取元素         |
| `__setitem__(self, key, value)` | `obj[key] = value`           | 设置元素         |
| `__delitem__(self, key)`        | `del obj[key]`               | 删除元素         |
| `__contains__(self, item)`      | `item in obj`                | 成员检测         |
| `__iter__(self)`                | `for x in obj` / `iter(obj)` | 返回迭代器       |
| `__next__(self)`                | `next(iterator)`             | 迭代器的下一个值 |



```python
class MyList:
    def __init__(self):
        self._data = []
    def __len__(self):
        return len(self._data)
    def __getitem__(self, index):
        return self._data[index]
    def __setitem__(self, index, value):
        self._data[index] = value
    def __iter__(self):
        return iter(self._data)
    def append(self, value):
        self._data.append(value)

ml = MyList()
ml.append(1); ml.append(2); ml.append(3)
print(len(ml))       # 3
print(ml[0])         # 1
for x in ml:
    print(x)         # 1 2 3
```

## 六、可调用对象

| 方法                  | 触发时机   | 说明                   |
| :-------------------- | :--------- | :--------------------- |
| `__call__(self, ...)` | `obj(...)` | 让实例像函数一样被调用 |

```python
class Counter:
    def __init__(self):
        self.count = 0
    def __call__(self):
        self.count += 1
        return self.count

c = Counter()
print(c())   # 1
print(c())   # 2
print(c())   # 3
```

## 七、属性访问控制

| 方法                             | 触发时机               | 说明                     |
| :------------------------------- | :--------------------- | :----------------------- |
| `__getattr__(self, name)`        | 访问**不存在**的属性时 | 兜底获取                 |
| `__getattribute__(self, name)`   | 访问**任意**属性时     | 拦截所有属性访问（慎用） |
| `__setattr__(self, name, value)` | 设置属性时             | `self.name = value`      |
| `__delattr__(self, name)`        | 删除属性时             | `del self.name`          |

```python
class LazyObject:
    def __getattr__(self, name):
        # 访问不存在的属性时触发
        print(f"属性 '{name}' 不存在，动态创建")
        setattr(self, name, "default_value")
        return "default_value"

obj = LazyObject()
print(obj.foo)   # 属性 'foo' 不存在... → default_value
print(obj.foo)   # default_value（已存在，不再触发）
```

## 八、上下文管理器（with 语句）

| 方法                                        | 触发时机         | 说明               |
| :------------------------------------------ | :--------------- | :----------------- |
| `__enter__(self)`                           | 进入 `with` 块时 | 返回资源对象       |
| `__exit__(self, exc_type, exc_val, exc_tb)` | 退出 `with` 块时 | 处理异常、释放资源 |

```python
class Timer:
    def __enter__(self):
        self.start = time.time()
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end = time.time()
        print(f"耗时: {self.end - self.start:.4f} 秒")

import time
with Timer():
    time.sleep(1)
# 输出: 耗时: 1.0012 秒
```

## 九、类型转换

| 方法              | 触发时机                    | 说明       |
| :---------------- | :-------------------------- | :--------- |
| `__int__(self)`   | `int(obj)`                  | 转整数     |
| `__float__(self)` | `float(obj)`                | 转浮点数   |
| `__bool__(self)`  | `bool(obj)` / `if obj:`     | 转布尔值   |
| `__hash__(self)`  | `hash(obj)` / 作为 dict key | 返回哈希值 |
| `__index__(self)` | 用于切片索引                | 返回整数   |

```python
class Boolean:
    def __init__(self, value):
        self.value = value
    def __bool__(self):
        return bool(self.value)

b = Boolean(0)
if b:
    print("真")
else:
    print("假")   # 输出: 假
```

## 十、其他实用方法

| 方法                                | 说明                                   |
| :---------------------------------- | :------------------------------------- |
| `__class_getitem__(cls, item)`      | 支持泛型语法 `Class[T]`（Python 3.7+） |
| `__instancecheck__(self, instance)` | `isinstance(obj, cls)` 自定义          |
| `__subclasscheck__(self, subclass)` | `issubclass(sub, cls)` 自定义          |
| `__dir__(self)`                     | `dir(obj)` 返回的属性列表              |
| `__slots__`                         | 限制实例属性，节省内存                 |

### 使用`__slots__`

如果我们想要限制实例的属性怎么办？比如，只允许对Student实例添加`name`和`age`属性。

为了达到限制的目的，Python允许在定义`class`的时候，定义一个特殊的`__slots__`变量，来限制该`class`实例能添加的属性：

```python
class Student(object):
    __slots__ = ('name', 'age') # 用tuple定义允许绑定的属性名称
```



## ✨快速参考图

```plain
创建:     __new__ → __init__ → __del__
字符串:   __str__ / __repr__ / __format__
比较:     __eq__ / __lt__ / __le__ / __gt__ / __ge__ / __ne__
算术:     __add__ / __sub__ / __mul__ / __truediv__ ... (+ r/i 前缀)
容器:     __len__ / __getitem__ / __setitem__ / __delitem__ / __iter__ / __contains__
调用:     __call__
属性:     __getattr__ / __getattribute__ / __setattr__ / __delattr__
上下文:   __enter__ / __exit__
转换:     __int__ / __float__ / __bool__ / __hash__
```







# 默认配置项

**默认配置项 = 属性值 + 元信息（默认值/描述/可选范围）**，让用户**开箱即用、改之有界、错之有拦、回之有门**。

## 为什么要设计默认配置项？

| 问题             | 解决方案               |
| :--------------- | :--------------------- |
| 用户不知道填什么 | 给合理的默认值         |
| 用户填错导致崩溃 | 限制可选范围 `choices` |
| 配置项太多看不懂 | 加 `des` 描述说明      |
| 想恢复初始设置   | 保留 `default` 值      |

## 代码结构拆解

```python
class Config:
    def __init__(self):
        self._config_items = {}      # 登记册：记录所有配置项的元信息

    def add_item(self, key, default=None, des=None, choices=None):
        # ① 设置实际值（开箱即用）
        self.__setattr__(key, default)
        
        # ② 保存元信息（说明书）
        self._config_items[key] = {
            "default": default,      # 默认值（用于重置）
            "des": des,              # 描述（用于文档/帮助）
            "choices": choices       # 可选值（用于校验）
        }
```

## 使用示例

### 1. 添加配置项

```python
cfg = Config()

# 布尔开关型
cfg.add_item("enable_reranker", default=False, des="是否开启重排序")

# 枚举选择型
cfg.add_item(
    "model_provider",
    default="siliconflow",
    choices=["siliconflow", "openai", "anthropic"],
    des="模型供应商"
)

# 数值范围型
cfg.add_item("timeout", default=30, des="请求超时时间(秒)")
```

### 2. 像属性一样访问

```python
print(cfg.enable_reranker)      # False  ← 直接当属性用
print(cfg.model_provider)         # siliconflow
```

### 3. 查看元信息

```python
print(cfg._config_items["model_provider"])
# {
#     'default': 'siliconflow',
#     'des': '模型供应商',
#     'choices': ['siliconflow', 'openai', 'anthropic']
# }
```

## 对比：普通类属性 vs 默认配置项

|              | 普通类属性   | 默认配置项                            |
| :----------- | :----------- | :------------------------------------ |
| **定义**     | `self.x = 1` | `add_item("x", default=1, des="...")` |
| **默认值**   | 写死在代码里 | 显式声明，可恢复                      |
| **描述**     | 无           | 有 `des`                              |
| **校验**     | 无           | 有 `choices` 限制                     |
| **文档生成** | 手动写       | 自动从 `_config_items` 生成           |

## 扩展：加上校验和重置功能

```python
class Config:
    def __init__(self):
        self._config_items = {}

    def add_item(self, key, default=None, des=None, choices=None):
        self.__setattr__(key, default)
        self._config_items[key] = {
            "default": default,
            "des": des,
            "choices": choices
        }

    def set(self, key, value):
        """安全设置：校验 + 赋值"""
        meta = self._config_items.get(key)
        if meta and meta["choices"] and value not in meta["choices"]:
            raise ValueError(f"{key} 必须是 {meta['choices']} 之一")
        self.__setattr__(key, value)

    def reset(self, key):
        """恢复默认值"""
        default = self._config_items[key]["default"]
        self.__setattr__(key, default)

# 使用
cfg = Config()
cfg.add_item("model_provider", default="siliconflow", 
             choices=["siliconflow", "openai"])

cfg.set("model_provider", "openai")     # ✅ 合法
# cfg.set("model_provider", "google")   # ❌ ValueError

cfg.reset("model_provider")             # 恢复为 "siliconflow"
```



# @property变方法为属性

[使用@property - Python教程 - 廖雪峰的官方网站](https://liaoxuefeng.com/books/python/oop-adv/property/index.html)

Python内置的`@property`装饰器就是负责把一个方法变成属性调用的：

```python
class Student(object):
    @property
    def score(self):
        return self._score

    @score.setter
    def score(self, value):
        if not isinstance(value, int):
            raise ValueError('score must be an integer!')
        if value < 0 or value > 100:
            raise ValueError('score must between 0 ~ 100!')
        self._score = value
```

`@property`的实现比较复杂，我们先考察如何使用。把一个getter方法变成属性，只需要加上`@property`就可以了，此时，`@property`本身又创建了另一个装饰器`@score.setter`，负责把一个setter方法变成属性赋值，于是，我们就拥有一个可控的属性操作：

```plain
>>> s = Student()
>>> s.score = 60 # OK，实际转化为s.score(60)
>>> s.score # OK，实际转化为s.score()
60
>>> s.score = 9999
Traceback (most recent call last):
  ...
ValueError: score must between 0 ~ 100!
```

注意到这个神奇的`@property`，我们在对实例属性操作的时候，就知道该属性很可能不是直接暴露的，而是通过getter和setter方法来实现的。

还可以定义只读属性，只定义getter方法，不定义setter方法就是一个只读属性：

```python
class Student(object):
    @property
    def birth(self):
        return self._birth

    @birth.setter
    def birth(self, value):
        self._birth = value

    @property
    def age(self):
        return 2015 - self._birth
```

上面的`birth`是可读写属性，而`age`就是一个*只读*属性，因为`age`可以根据`birth`和当前时间计算出来。

要特别注意：属性的方法名不要和实例变量重名。例如，以下的代码是**错误**的：

```python
class Student(object):
    # 方法名称和实例变量均为birth:
    @property
    def birth(self):
        return self.birth
```

这是因为调用`s.birth`时，首先转换为方法调用，在执行`return self.birth`时，又视为访问`self`的属性，于是又转换为方法调用`self.birth()`，造成无限递归，最终导致栈溢出报错`RecursionError`。



# 元类 metaclass

Python 元类 = 编译时/解释时控制类创建的机制。

元类是“类的类”，即定义类如何被创建的模板。类本身是对象，而元类是创建这些类对象的“工厂”。

### type()

**动态语言**和**静态语言**最大的不同，就是函数和类的定义，不是编译时定义的，而是运行时动态创建的。

>比方说我们要定义一个`Hello`的class，就写一个`hello.py`模块：
>
>```python
>class Hello(object):
>    def hello(self, name='world'):
>     	print('Hello, %s.' % name)
>```
>
>当Python解释器载入`hello`模块时，就会依次执行该模块的所有语句，执行结果就是动态创建出一个`Hello`的class对象，测试如下：
>
>```plain
>>>> from hello import Hello
>>>> h = Hello()
>>>> h.hello()
>Hello, world.
>>>> print(type(Hello))
><class 'type'>
>>>> print(type(h))
><class 'hello.Hello'>
>```
>
>`type()`函数可以查看一个类型或变量的类型，`Hello`是一个class，它的类型就是`type`，而`h`是一个**实例**，它的类型就是class `Hello`。
>
>我们说class的定义是运行时动态创建的，而创建class的方法就是使用`type()`函数。
>
>`type()`函数既可以返回一个对象的类型，又可以创建出新的类型，比如，我们可以通过`type()`函数创建出`Hello`类，而无需通过`class Hello(object)...`的定义：
>
>要创建一个class对象，`type()`函数依次传入3个参数：
>
>1. class的名称；
>2. 继承的父类集合，注意Python支持多重继承，如果只有一个父类，别忘了tuple的单元素写法；
>3. class的方法名称与函数绑定，这里我们把函数`fn`绑定到方法名`hello`上。
>
>通过`type()`函数创建的类和直接写class是完全一样的，因为Python解释器遇到class定义时，仅仅是扫描一下class定义的语法，然后调用`type()`函数创建出class。
>
>正常情况下，我们都用`class Xxx...`来定义类，但是，`type()`函数也允许我们动态创建出类来，也就是说，动态语言本身支持运行期动态创建类，这和静态语言有非常大的不同，要在静态语言运行期创建类，必须构造源代码字符串再调用编译器，或者借助一些工具生成字节码实现，本质上都是动态编译，会非常复杂。

### metaclass

除了使用`type()`动态创建类以外，要控制类的创建行为，还可以使用metaclass。

metaclass，直译为元类，简单的解释就是：

- 当我们定义了类以后，就可以根据这个类创建出实例，所以：先定义类，然后创建实例。
- 但是如果我们想创建出类呢？那就必须根据metaclass创建出类，所以：先定义metaclass，然后创建类。

**【总结】先定义metaclass，就可以创建类，最后创建实例。**

所以，metaclass允许你创建类或者修改类。换句话说，你可以把类看成是metaclass创建出来的“实例”。

> metaclass是Python面向对象里最难理解，也是最难使用的魔术代码。正常情况下，你不会碰到需要使用metaclass的情况，所以，以下内容看不懂也没关系，因为基本上你不会用到。

---

我们先看一个简单的例子，这个metaclass可以给我们自定义的MyList增加一个`add`方法：

定义`ListMetaclass`，按照默认习惯，metaclass的类名总是以Metaclass结尾，以便清楚地表示这是一个metaclass：

```python
# metaclass是类的模板，所以必须从`type`类型派生：
class ListMetaclass(type):
    def __new__(cls, name, bases, attrs):
        attrs['add'] = lambda self, value: self.append(value)
        return type.__new__(cls, name, bases, attrs)
```

有了`ListMetaclass`，我们在定义类的时候还要指示使用`ListMetaclass`来**定制类**，传入关键字参数`metaclass`：

```python
class MyList(list, metaclass=ListMetaclass):
    pass
```

当我们传入关键字参数`metaclass`时，魔术就生效了，它指示Python解释器在创建`MyList`时，要通过`ListMetaclass.__new__()`来创建，在此，我们可以修改类的定义，比如，加上新的方法，然后，返回修改后的定义。

`__new__()`方法接收到的参数依次是：

1. 当前准备创建的类的对象；
2. 类的名字；
3. 类继承的父类集合；
4. 类的方法集合。

测试一下`MyList`是否可以调用`add()`方法：

```plain
>>> L = MyList()
>>> L.add(1)
>> L
[1]
```

而普通的`list`没有`add()`方法：

```plain
>>> L2 = list()
>>> L2.add(1)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'list' object has no attribute 'add'
```

动态修改有什么意义？直接在`MyList`定义中写上`add()`方法不是更简单吗？正常情况下，确实应该直接写，通过metaclass修改纯属变态。

但是，总会遇到需要通过metaclass修改类定义的。ORM就是一个典型的例子。

---

### ORM 对象-关系映射

ORM全称“Object Relational Mapping”，即对象-关系映射，就是把关系数据库的一行映射为一个对象，也就是一个类对应一个表，这样，写代码更简单，不用直接操作SQL语句。

要编写一个ORM框架，所有的类都只能动态定义，因为只有使用者才能根据表的结构定义出对应的类来。

让我们来尝试编写一个ORM框架。

编写底层模块的第一步，就是先把调用接口写出来。比如，使用者如果使用这个ORM框架，想定义一个`User`类来操作对应的数据库表`User`，我们期待他写出这样的代码：

```python
class User(Model):
    # 定义类的属性到列的映射：
    id = IntegerField('id')
    name = StringField('username')
    email = StringField('email')
    password = StringField('password')

# 创建一个实例：
u = User(id=12345, name='Michael', email='test@orm.org', password='my-pwd')
# 保存到数据库：
u.save()
```

其中，父类`Model`和属性类型`StringField`、`IntegerField`是由ORM框架提供的，剩下的魔术方法比如`save()`全部由父类`Model`自动完成。虽然metaclass的编写会比较复杂，但ORM的使用者用起来却异常简单。

现在，我们就按上面的接口来实现该ORM。

首先来定义`Field`类，它负责保存数据库表的字段名和字段类型：

```python
class Field(object):

    def __init__(self, name, column_type):
        self.name = name
        self.column_type = column_type

    def __str__(self):
        return '<%s:%s>' % (self.__class__.__name__, self.name)
```

在`Field`的基础上，进一步定义各种类型的`Field`，比如`StringField`，`IntegerField`等等：

```python
class StringField(Field):
    def __init__(self, name):
        super(StringField, self).__init__(name, 'varchar(100)')

class IntegerField(Field):
    def __init__(self, name):
        super(IntegerField, self).__init__(name, 'bigint')
```

下一步，就是编写最复杂的`ModelMetaclass`了：

```python
class ModelMetaclass(type):
    def __new__(cls, name, bases, attrs):
        if name=='Model':
            return type.__new__(cls, name, bases, attrs)
        print('Found model: %s' % name)
        mappings = dict()
        for k, v in attrs.items():
            if isinstance(v, Field):
                print('Found mapping: %s ==> %s' % (k, v))
                mappings[k] = v
        for k in mappings.keys():
            attrs.pop(k)
        attrs['__mappings__'] = mappings # 保存属性和列的映射关系
        attrs['__table__'] = name # 假设表名和类名一致
        return type.__new__(cls, name, bases, attrs)
```

以及基类`Model`：

```python
class Model(dict, metaclass=ModelMetaclass):
    def __init__(self, **kw):
        super(Model, self).__init__(**kw)

    def __getattr__(self, key):
        try:
            return self[key]
        except KeyError:
            raise AttributeError(r"'Model' object has no attribute '%s'" % key)

    def __setattr__(self, key, value):
        self[key] = value

    def save(self):
        fields = []
        params = []
        args = []
        for k, v in self.__mappings__.items():
            fields.append(v.name)
            params.append('?')
            args.append(getattr(self, k, None))
        sql = 'insert into %s (%s) values (%s)' % (self.__table__, ','.join(fields), ','.join(params))
        print('SQL: %s' % sql)
        print('ARGS: %s' % str(args))
```

当用户定义一个`class User(Model)`时，Python解释器首先在当前类`User`的定义中查找`metaclass`，如果没有找到，就继续在父类`Model`中查找`metaclass`，找到了，就使用`Model`中定义的`metaclass`的`ModelMetaclass`来创建`User`类，也就是说，metaclass可以隐式地继承到子类，但子类自己却感觉不到。

在`ModelMetaclass`中，一共做了几件事情：

1. 排除掉对`Model`类的修改；
2. 在当前类（比如`User`）中查找定义的类的所有属性，如果找到一个`Field`属性，就把它保存到一个`__mappings__`的dict中，同时从类属性中删除该`Field`属性，否则，容易造成运行时错误（实例的属性会遮盖类的同名属性）；
3. 把表名保存到`__table__`中，这里简化为表名默认为类名。

在`Model`类中，就可以定义各种操作数据库的方法，比如`save()`，`delete()`，`find()`，`update`等等。

我们实现了`save()`方法，把一个实例保存到数据库中。因为有表名，属性到字段的映射和属性值的集合，就可以构造出`INSERT`语句。

编写代码试试：

```python
u = User(id=12345, name='Michael', email='test@orm.org', password='my-pwd')
u.save()
```

输出如下：

```plain
Found model: User
Found mapping: email ==> <StringField:email>
Found mapping: password ==> <StringField:password>
Found mapping: id ==> <IntegerField:uid>
Found mapping: name ==> <StringField:username>
SQL: insert into User (password,email,username,id) values (?,?,?,?)
ARGS: ['my-pwd', 'test@orm.org', 'Michael', 12345]
```

可以看到，`save()`方法已经打印出了可执行的SQL语句，以及参数列表，只需要真正连接到数据库，执行该SQL语句，就可以完成真正的功能。

不到100行代码，我们就通过metaclass实现了一个精简的ORM框架，是不是非常简单？



# 错误、调试、测试

Python 错误处理通过 `try-except` 结构实现，以下是完整指南：

## 1. 基本结构

```python
try:
    # 可能出错的代码
    result = 10 / 0
except ZeroDivisionError:
    # 出错后执行的代码
    print("不能除以零")
```

**执行流程**：`try` 内出错 → 跳转到对应 `except` → 继续执行后续代码。

### 1.1 捕获多种异常

```python
try:
    num = int(input("输入数字: "))
    result = 10 / num
except ValueError:
    print("输入的不是数字")
except ZeroDivisionError:
    print("不能除以零")
```

**合并写法**（如果处理逻辑相同）：

```python
except (ValueError, ZeroDivisionError) as e:
    print(f"出错: {e}")
```

### 1.2获取异常详细信息

```python
try:
    1 / 0
except ZeroDivisionError as e:
    print(type(e))      # <class 'ZeroDivisionError'>
    print(e)            # division by zero
    print(repr(e))      # ZeroDivisionError('division by zero')
```

## 2. 完整结构：`try-except-else-finally`

```python
try:
    print("尝试执行...")
    result = 10 / 2
except ZeroDivisionError:
    print("出错了")
else:
    # 没异常时执行
    print(f"结果是 {result}")
finally:
    # 无论有无异常都执行（常用于清理资源）
    print("清理工作完成")
```

**输出**：

```plain
尝试执行...
结果是 5.0
清理工作完成
```

## 3. 主动抛出异常：`raise`

```python
def divide(a, b):
    if b == 0:
        raise ValueError("除数不能为零")  # 抛出自定义错误信息
    return a / b

# 也可以重新抛出当前异常
try:
    risky_operation()
except SomeError:
    print("记录日志...")
    raise  # 把异常继续抛给上层
```

## 4. 自定义异常：`Exception`

继承 `Exception` 或其子类：

```python
class ValidationError(Exception):
    """自定义验证错误"""
    pass

class AgeTooSmallError(ValidationError):
    """年龄太小"""
    def __init__(self, age, min_age):
        self.age = age
        self.min_age = min_age
        super().__init__(f"年龄 {age} 小于最小要求 {min_age}")

# 使用
def set_age(age):
    if age < 18:
        raise AgeTooSmallError(age, 18)
    return age

set_age(15)  # AgeTooSmallError: 年龄 15 小于最小要求 18
```

## 5. 异常类层级（部分）

```plain
BaseException
 ├── SystemExit          # sys.exit() 触发
 ├── KeyboardInterrupt   # Ctrl+C 触发
 └── Exception           # 通常捕获这个以下的
      ├── ArithmeticError
      │    └── ZeroDivisionError
      ├── LookupError
      │    ├── IndexError      # 列表索引越界
      │    └── KeyError        # 字典键不存在
      ├── TypeError            # 类型错误
      ├── ValueError           # 值不合适
      └── ... 等等
```

> **建议**：捕获具体异常，不要裸写 `except:` 或 `except Exception:`，这会隐藏真正的 Bug。

## 5. 实用模式

### 5.1 上下文管理器（自动关闭资源）

```python
# 不用手动 close()
with open("file.txt", "r") as f:
    content = f.read()  # 出了 with 自动关闭，即使有异常
```

### 5.2 忽略特定异常

```python
from contextlib import suppress

# 等价于 try...except KeyError: pass
with suppress(KeyError):
    del my_dict["可能不存在的键"]
```

### 5.3 断言（开发调试用）

```python
assert age >= 0, "年龄不能为负数"  # 为 False 时抛 AssertionError
```

> 生产环境通常关闭断言（`python -O`），不要用它做正式错误处理。

## 6. 完整实战示例

```python
def read_config(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"配置文件 {path} 不存在，使用默认配置")
        return {}
    except json.JSONDecodeError as e:
        print(f"JSON 格式错误: {e}")
        return {}
    else:
        print("配置加载成功")
        return data
    finally:
        print("读取操作结束")
```

## 快速对照表

| 语法                    | 作用                       |
| :---------------------- | :------------------------- |
| `try`                   | 包裹可能出错的代码         |
| `except`                | 捕获并处理异常             |
| `except X as e`         | 捕获特定异常，获取错误对象 |
| `else`                  | 没异常时执行               |
| `finally`               | 无论有无异常都执行         |
| `raise`                 | 主动抛出异常               |
| `raise`（在 except 内） | 重新抛出当前异常           |

---

## ✨7. traceback 模块：打印完整堆栈

如果错误没有被捕获，它就会一直往上抛，最后被Python解释器捕获，打印一个错误信息，然后程序退出。

### 7.1 基础用法

```python
import traceback

try:
    1 / 0
except:
    # 打印到控制台（标准错误输出）
    traceback.print_exc()
    
    # 或者获取字符串
    error_msg = traceback.format_exc()
    print("错误信息:", error_msg)
```

**输出**：
```
Traceback (most recent call last):
  File "test.py", line 4, in <module>
    1 / 0
ZeroDivisionError: division by zero
```

### 7.2 获取更详细的堆栈

```python
import traceback
import sys

try:
    outer_func()
except Exception:
    # 当前异常信息
    exc_type, exc_value, exc_traceback = sys.exc_info()
    
    # 打印完整堆栈（包括调用链）
    traceback.print_tb(exc_traceback, limit=5)
    
    # 或者格式化整个异常
    lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
    print(''.join(lines))
```

### 7.3 打印当前调用栈（无异常时）

```python
import traceback

def inner():
    # 打印当前调用链
    traceback.print_stack()

def outer():
    inner()

outer()
# 输出：
#   File "test.py", line 10, in <module>
#     outer()
#   File "test.py", line 8, in outer
#     inner()
#   File "test.py", line 5, in inner
#     traceback.print_stack()
```

## ✨8. logging 模块：记录异常日志

### 8.1 基础配置

```python
import logging

# 基础配置（一般放在程序入口）
logging.basicConfig(
    level=logging.DEBUG,  # 记录 DEBUG 及以上级别
    format='%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s',
    handlers=[
        logging.FileHandler('app.log', encoding='utf-8'),  # 写入文件
        logging.StreamHandler()  # 同时输出到控制台
    ]
)

logger = logging.getLogger(__name__)
```

### 8.2 记录异常（自动包含堆栈）

```python
try:
    1 / 0
except Exception:
    # exc_info=True 自动附加完整异常堆栈
    logger.error("计算出错", exc_info=True)
    
    # 等价写法
    logger.exception("计算出错")  # 只能在 except 块内用，自动包含堆栈
```

**日志文件内容**：
```
2026-06-18 15:50:23,456 - ERROR - test.py:15 - 计算出错
Traceback (most recent call last):
  File "test.py", line 13, in <module>
    1 / 0
ZeroDivisionError: division by zero
```

### 8.3 不同日志级别

```python
logger.debug("调试信息")      # 开发时详细日志
logger.info("一般信息")       # 正常流程记录
logger.warning("警告")        # 需要注意但不致命
logger.error("错误")          # 功能异常
logger.critical("严重错误")   # 系统可能崩溃
```

### 8.4 完整实战

```python
import logging
import traceback

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.FileHandler('error.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('myapp')

def divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        # 记录完整错误 + 堆栈
        logger.exception("除法运算失败: %s / %s", a, b)
        # 或者手动构造
        # logger.error("除法失败\n%s", traceback.format_exc())
        return None

divide(10, 0)
```

## 调用栈与日志两者结合使用

```python
import logging
import traceback

logger = logging.getLogger(__name__)

try:
    risky_operation()
except Exception as e:
    # 1. 获取完整堆栈字符串
    stack = traceback.format_exc()
    
    # 2. 记录到日志
    logger.error("操作失败: %s\n%s", e, stack)
    
    # 3. 同时发送告警（邮件/钉钉等）
    send_alert(f"系统异常: {e}")
```

## 快速对照表

| 场景                | 用法                                 |
| ------------------- | ------------------------------------ |
| 打印异常到控制台    | `traceback.print_exc()`              |
| 获取异常字符串      | `traceback.format_exc()`             |
| 打印当前调用栈      | `traceback.print_stack()`            |
| 记录异常+堆栈到日志 | `logger.exception("msg")`            |
| 普通错误日志带堆栈  | `logger.error("msg", exc_info=True)` |
| 仅记录错误信息      | `logger.error("msg")`                |

## 生产环境建议配置

```python
import logging
import logging.handlers
import os

# 自动按天轮转日志
handler = logging.handlers.TimedRotatingFileHandler(
    'app.log',
    when='midnight',      # 每天零点切割
    interval=1,
    backupCount=7,        # 保留7天
    encoding='utf-8'
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(filename)s:%(lineno)d | %(message)s',
    handlers=[handler, logging.StreamHandler()]
)
```







