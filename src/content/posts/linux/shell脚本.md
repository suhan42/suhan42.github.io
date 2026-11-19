---
title: Shell 脚本
date: 2026-11-18
slug: shell-script
category: it
subcategory: linux
tags:
  - linux
summary: 整理 shell 与 bash 基础、脚本文件结构、变量、引用和流程控制等语法。
status: published
templateEngineOverride: md
---

# shell与bash

常见的 shell 解释器有 sh、bash 这两种，其他的 ksh、csh 和 zsh 等是不常见的。Mac OS 中默认安装了以上所有类型，Windows 需要自行安装，Linux 更不用说了。就像上面说的，只要一门语言有解释器，就可以作为 shell 使用。比如 Java 有第三方解释器 Jshell，PHP 有 PHP Shell。如果你用过 windows，那你对 cmd 这个词一定不陌生，它是 windows shell，官方名称叫做 command interpreter。

## Bash脚本基础

BASH = GNU Bourne-Again Shell,BASH 是 GNU 组织开发和推广的一个项目。
Bash脚本类似批处理,简单来讲就是把许多的指令集合在一起,并提供循环、条件、判断等重要功能,语法简单实用,用以编写程序,大大简化管理员的操作,并可以完成图形工具所无法实现的功能。

# shell脚本文件

1.创建包含bash命令的文本文件。

```bash
touch test.sh
```

文件的第一行应为:

```bash
#!/bin/bash
```

2.使文件可执行(使用chmod +x scripts)

3.将文件放置在用户的$PATH的目录中

~/bin – 用于用户的私有程序
/usr/local/bin – 本地开发、系统上的其他人使用的脚本
/usr/local/sbin - 本地开发、由root使用的脚本

直接运行脚本和使用source命令运行脚本是不同的!

#### 修改文件权限

```bash
chmod +x test.sh
```

#### 运行

```shell
./test.sh

bash test.sh
```



### 引用和转义

#### 弱引用” ”

将字符串放置在双引号中，保留字符串中所有字符的文字值，

$、`、\和 ! 字符除外

```bash
#显示date字符
anna@Ubuntu-virtual-machine:~$ echo "date"
date

anna@Ubuntu-virtual-machine:~$ echo "`date`"
2022年 09月 16日 星期五 11:13:00 CST
```

#### 强引用' '

将字符串放置在单引号中，保留字符串中所有字符的文字值，同时禁用所有扩展

```bash
#显示`date`字符，这里' '由于强引所以仅为字符
anna@Ubuntu-virtual-machine:~$ echo '`date`'
`date`
```

#### 转义\

非引用的\是转义字符。它保留了下一个字符的文字值。

```bash
#没有转义的
anna@Ubuntu-virtual-machine:~$ echo `date`
2022年 09月 16日 星期五 11:13:44 CST

#转义后的
anna@Ubuntu-virtual-machine:~$ echo \`date\`
`date`
```



### 变量

shell变量用于为稍后在脚本中使用的名称指定值,并且仅限于shell命令行或从中声明变量的脚本。

**定义的变量一般为大写字母。**

若要定义或指定值:
FRUIT=apple

若要参考或使用变量:
$FRUIT
${FRUIT}

```bash
anna@Ubuntu-virtual-machine:~$ TIME=`date`
anna@Ubuntu-virtual-machine:~$ echo $TIME
2022年 09月 16日 星期五 11:17:07 CST

anna@Ubuntu-virtual-machine:~$ echo "the time is ${TIME}"
the time is 2022年 09月 16日 星期五 11:17:07 CST
```

#### readonly只读变量

使用 **readonly** 命令可以将变量定义为只读变量，只读变量的值不能被改变。

```shell
#!/bin/bash
myUrl="http://xxx/shell/"
readonly myUrl
```

#### unset删除变量

使用 **unset** 命令可以删除变量。语法：

```shell
unset variable_name
```

变量被删除后不能再次使用。unset 命令不能删除只读变量。

```shell
#!/bin/sh
myUrl="http://xxx/shell/"
unset myUrl
echo $myUrl
```

#### 输出字符大小（长度）

变量前加 #

```shell
your_name="www.baidu.com"
echo ${#your_name}
```

#### expr寻找字符

```shell
a="adsadadasdasd"
echo `expr index "$a" d`
```

返回 a 中包含 d 中任意字符的**第一个**位置。

第一个位置出现的是d，所以一定是2

#### 返回部分长度串内容

```shell
your_name="www.baidu.com"
echo ${your_name:4:5}
```

这里`:4:5`表示从第4个字符开始，输出5个



### **算术运算符**

算术运算符指的是可以在程序中实现加、减、乘、除等数学运算的运算符。

++ 增量后
– 减量后
\- 减法
\+ 加法
** 幂运算
\* 乘法
/ 除法
% 余数
+= 加等
-= 减等

```bash
anna@Ubuntu-virtual-machine:~$ let A=1+2
anna@Ubuntu-virtual-machine:~$ echo $A
3

anna@Ubuntu-virtual-machine:~$ let A=2**2  #2^2
anna@Ubuntu-virtual-machine:~$ echo $A
4
```

### sh计算命令

用$[]表示数学运算
用expr表示数学运算
用let指示数学运算
用(())表示数学运算。bash内建功能,效率高

```bash
anna@Ubuntu-virtual-machine:~$ echo $[2+4]
6
anna@Ubuntu-virtual-machine:~$ echo `expr 2+4`
2+4
anna@Ubuntu-virtual-machine:~$ let A=2+4
anna@Ubuntu-virtual-machine:~$ echo $A
6
```

sh脚本中：

1

```shell
#!/bin/bash
a=10
b=20
c=`expr ${a} + ${b}`
echo "$c"
```

2

```shell
#!/bin/bash
c=$[ `expr 10 + 20` ]
echo "$c"
```

3

```shell
#!/bin/bash
c=$[ 10 + 20 ]		#var3=$[ $var1*$var2 ]
echo "$c"

sum=$[$num + $sum]
```

4

```shell
#!/bin/bash
sum=0
for j in 1 2 3 4 5 6 7 8 9 10
do
	let sum+=j
done
echo $sum
```

5

```shell
#!/bin/bash
sum=0

for((i=1;i<11;i++));
do
	sum=$((i+sum))
done

echo $sum
```



### 字符串运算符

- = ：判断字符串相等
- != ：判断字符串不相等
- -z：判断字符串长度为0
- -n ：判断字符串长度不为0
- $ ：判断字符串不为空

```shell
#!/bin/bash

a="abc"
b="efg"

if [ $a = $b ]
then
	echo "$a = $b : a 等于 b"
else
	echo "$a = $b : a 不等于 b"
fi

if [ $a != $b ]
then
	echo "$a != $b : a 不等于 b"
else
	echo "$a != $b : a 等于 b"
fi

if [ -z $a ]
then
	echo "-z $a : a的长度为0 "
else
	echo "-z $a : a的长度不为0"
fi

if [ -n $a ]
then
	echo "-n $a : a的长度不为0"
else
	echo "-n $a : a的长度为0"
fi

if [ $a ]
then
	echo "$a ：字符串不为空 "
else
	echo "$a : 字符串为空"
fi
```



### 读取

#### read

从标准输入中读取数据并赋值给变量。如果没有进行重定向，默认就是从键盘读取用户输入的数据；如果进行了重定向，那么可以从文件中读取数据。

| 选项         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| -a array     | 把读取的数据赋值给数组 array，从下标 0 开始。                |
| -d delimiter | 用字符串 delimiter 指定读取结束的位置，而不是一个换行符（读取到的数据不包括 delimiter）。 |
| -e           | 在获取用户输入的时候，对功能键进行编码转换，不会直接显式功能键对应的字符。 |
| -n num       | 读取 num 个字符，而不是整行字符。                            |
| -p prompt    | 显示提示信息，提示内容为 prompt。                            |
| -r           | 原样读取（Raw mode），不把反斜杠字符解释为转义字符。         |
| -s           | 静默模式（Silent mode），不会在屏幕上显示输入的字符。当输入密码和其它确认信息的时候，这是很有必要的。 |
| -t seconds   | 设置超时时间，单位为秒。如果用户没有在指定时间内输入完成，那么 read 将会返回一个非 0 的退出状态，表示读取失败。 |
| -u fd        | 使用文件描述符 fd 作为输入源，而不是标准输入，类似于重定向。 |

case:

```shell
#!/bin/bash

echo "请输入网址"
read url
ping $url
```

#### printf

```shell
#!/bin/bash

printf "%10s %8s %4s\n" 姓名 性别 年龄
printf "%10s %8s %4.2f\n" 刘德华 男 56
printf "%10s %8s %4.2f\n" 周润发 男 90
printf "%10s %8s %4.2f\n" 赵本山 男 70
```



### 数组

```shell
#!/bin/bash

#定义数组
arr=(1 2 3 4 5)

name=lisi

echo $arr

echo "第一个元素${arr[0]}"
echo "第二个元素${arr[1]}"

echo "数组的元素为：${arr[*]}"
echo "数组的元素为：${arr[@]}"

echo "${#name}"
echo "数组的长度为：${#arr[*]}"

#关联性

declare -A site #site=(["baidu"]="www.baidu.com" ["google"]="www.google.com" ["taobao"]="www.taobao.com")
site["baidu"]="www.baidu.com"

echo "${site["baidu"]}"
```

#### 拼接字符串

```shell
#!/bin/bash
list="alibaba tengxun baidu"

list=$list" google" #在后面加上google

for state in $list
do
	echo $state
done
```



### IFS

1. IFS的默认值为：空白（包括：空格，tab, 和新行)，将其ASSII码用十六进制打印出来就是：20 09 0a。
2. IFS对空格的空白的处理和其他字符不一样，左右两边的纯空白会被忽略，多个连续的空白被当成一个IFS处理。

```shell
#!/bin/sh

IFS='|'
text='a a a a|b b b b|c c c c'
for i in $text;do echo $i;done

>
a a a a
b b b b
c c c c
```

从文件中获取

```shell
#!/bin/bash
# 读取文件中的字段
file="t.txt"

IFS=';'

for state in $(cat $file)
do
	echo $state
done

>
123


222
333
```

t.txt

```
123;;
222
333
```



### test

文件类型判断

| 选 项       | 作 用                                      |
| ----------- | ------------------------------------------ |
| -b filename | 判断文件是否存在，并且是否为块设备文件。   |
| -c filename | 判断文件是否存在，并且是否为字符设备文件。 |
| -d filename | 判断文件是否存在，并且是否为目录文件。     |
| -e filename | 判断文件是否存在。                         |
| -f filename | 判断文件是否存在，井且是否为普通文件。     |
| -L filename | 判断文件是否存在，并且是否为符号链接文件。 |
| -p filename | 判断文件是否存在，并且是否为管道文件。     |
| -s filename | 判断文件是否存在，并且是否为非空。         |
| -S filename | 判断该文件是否存在，并且是否为套接字文件。 |

文件权限判断 

| 选 项       | 作 用                                        |
| ----------- | -------------------------------------------- |
| -r filename | 判断文件是否存在，并且是否拥有读权限。       |
| -w filename | 判断文件是否存在，并且是否拥有写权限。       |
| -x filename | 判断文件是否存在，并且是否拥有执行权限。     |
| -u filename | 判断文件是否存在，并且是否拥有 SUID 权限。   |
| -g filename | 判断文件是否存在，并且是否拥有 SGID 权限。   |
| -k filename | 判断该文件是否存在，并且是否拥有 SBIT 权限。 |

文件比较

| 选 项                   | 作 用                                                        |
| ----------------------- | ------------------------------------------------------------ |
| filename1 -nt filename2 | 判断 filename1 的修改时间是否比 filename2 的新。             |
| filename -ot filename2  | 判断 filename1 的修改时间是否比 filename2 的旧。             |
| filename1 -ef filename2 | 判断 filename1 是否和 filename2 的 inode 号一致，可以理解为两个文件是否为同一个文件。这个判断用于判断硬链接是很好的方法 |

### sh条件测试参数

| 参数 | 说明           |
| :--- | :------------- |
| -eq  | 等于则为真     |
| -ne  | 不等于则为真   |
| -gt  | 大于则为真     |
| -ge  | 大于等于则为真 |
| -lt  | 小于则为真     |
| -le  | 小于等于则为真 |

test测试、检查某个条件是否成立，包含数值、字符和文件

```shell
#!/bin/bash

num1=100
num2=100
if test $[num1] -eq $[num2]
then
	echo "两个数相等！"
else
	echo "两个数不相等"
fi

if [ $[num1] == $[num2] ]
then
        echo "两个数相等！"
else
        echo "两个数不相等"
fi

result=$[num1+num2]
echo "$result"

str1="baidu"
str2="google"

if test $str1 = $str2
then
	echo "两个字符串相等"
else
	echo "两个字符串不等"
fi
```

-e 判断文件是否存在。

```shell
#!/bin/bash

cd /bin

if test -e ./bash
then
	echo "文件已存在"
else
	echo "文件不存在"
fi
```

#### -o表示 或or

-a表示 并且and

```shell
#!/bin/bash

cd /bin
if test -e ./notFile -o -e ./bash
then
	echo "至少一个文件存在"
else
	echo "两个文件都存在"
fi
```

-gt：大于则为真

-lt：小于则为真

```shell
#!/bin/bash

a=10
b=20

if [ $a == $b ]
then
	echo "a等于b"
elif [ $a -gt $b ]
then
	echo "a大于b"
elif [ $a -lt $b ]
then
	echo "a小于b"
else
	echo "没有意义"
fi
```

另一种判断大小

```shell
#!/bin/bash

a=10
b=20

if (( $a == $b ))
then
	echo "a等于b"
elif (( $a > $b ))
then
	echo "a大于b"
elif (( $a < $b ))
then
	echo "a小于b"
else
	echo "没有符合条件"
fi
```

### if

```shell
if [ command ];then
     符合该条件执行的语句
elif [ command ];then
     符合该条件执行的语句
else
     符合该条件执行的语句
fi
```

例子

```shell
#!/bin/bash
#输入学生成绩，根据成绩判断输出五级制成绩（优、良、中、差、不及格）

while :
do
	echo "请输入学生成绩"
	read grade
	grade=$((10#$grade))	#转换为10进制，比如前面有0：09
	if test $grade -ge 90;then	
		echo "优秀"
	elif (($grade >= 80));then
		echo "良好"
	elif (($grade >= 70));then
		echo "中等"
	elif (($grade >= 60));then
		echo "差"
	else
		echo "不及格"
	fi
	echo "-----"
done
```



### for

也是用分号隔离

> for 变量名 in 列表值
> do
> 操作
> done

```bash
#每0.5s输出echo一次
anna@Ubuntu-virtual-machine:~$ for TEST in anna1 anna2 anna3;do echo $TEST;sleep 0.5;done

anna1
anna2
anna3
```

常见括号式

```bash
anna@Ubuntu-virtual-machine:~$ for ((i=1;i<5;i++));
do echo $i;
done

1
2
3
4
```

另一种打印形式

```bash
anna@Ubuntu-virtual-machine:~/Desktop$ for NN in {1..5};
do echo $NN;
done

1
2
3
4
5
```

#### sh脚本中的for

#### in

for 变量名 in 列表;do 语句块 done

```shell
#!/bin/bash
for var in 1 2 3 4 5 6 7 8 9 10
do
	echo "数值是：$var"
done
```

也可以输出字符串

```shell
#!/bin/bash
for str in This is a string
do
	echo $str
done

>
This
is
a
string
```

#### (( ))

```shell
#!/bin/bash
sum=0

for((i=1;i<11;i++));
do
	sum=$((i+sum))
done

echo $sum

>
55
```

#### seq

`seq` 仅适用于数字。字母不行。

1、默认从1开始，这里到5

```shell
#!/bini/bash
for i in `seq 5`
do
	echo $i
done

>
1
2
3
4
5
```

2、可以指定起始位置、增量步幅。

假设你要列出 3 的倍数。指定起点（在此示例中为第一个 3 ），增量（第二个 3）和终点（9）。

```shell
#!/bini/bash
for i in `seq 3 3 9`
do
	echo $i
done

>
3
6
9
```

你可以选择使用负增量（即减量）将数字从大变小。

```shell
#!/bini/bash
for i in `seq 12 -3 3`
do
	echo $i
done

>
12
9
6
3
```

#### 处理引用

1. 利用反斜杠进行转义 `\'`
2. 或双引号进行操作

```shell
#!/bin/bash

for test in I don\'t know if "this'll" work
do
	echo "word：$test"
done

>
word：I
word：don't
word：know
word：if
word：this'll
word：work
```

#### 嵌套

```shell
#!/bin/bash
for (( a=1; a<=3;a++ ))
do
	echo "外层循环：$a"
	for (( b=1;b<=3; b++ ))
	do
		echo "-内层循环：$b"
	done
done

>
外层循环：1
-内层循环：1
-内层循环：2
-内层循环：3
外层循环：2
-内层循环：1
-内层循环：2
-内层循环：3
外层循环：3
-内层循环：1
-内层循环：2
-内层循环：3
```



### while

```shell
#!/bini/bash
i=1
while(( $i <= 5 ))
do
	echo "True $i"
	let "i++"
done
echo "false $i"

>
True 1
True 2
True 3
True 4
True 5
false 6
```

用读取read执行循环:

```shell
#!/bin/bash
echo "按下<CTRL-D>退出"
echo -n "输入你喜欢的网站："

while read url
do
	echo "$url是一个不错的网站"
done
```



### until

until条件为真时退出循环，为假时，进行循环

```shell
#!/bin/bash

a=0

until [ ! $a -lt 10 ]
do
	echo $a
	a=`expr $a + 1`
done
```

### case

```shell
#!/bin/bash
echo "输入1到4之间的数字"
read num

case $num in
	1) echo "你选择了1"
		;;
	2) echo "你选择了2"
		;;
	3) echo "你选择了3"
		;;
	4) echo "你选择了4"
		;;
	*) echo "你没有输入1-4之间的数字"
		;;
esac

>
输入1到4之间的数字
2
你选择了2
```

支持字符串判断

```shell
#!/bin/bash
url="baidu"

case "$url" in
	"baidu") echo "百度"
		;;
	"google") echo "谷歌"
		;;
esac

>
百度
```



### 文件操作

获取Desktop目录下的所有文件，进行判断

```shell
#!/bin/bash
for file in /root/Desktop/*
do
	if [ -d "$file" ]
	then
		echo "$file 是一个目录"
	elif [ -f "$file" ]
	then
		echo "$file 是一个文件"
	fi
done
```

#### 文件运算符

- -r : 文件可读
- -w : 文件可写
- -x : 文件可执行
- -f : 文件是一个普通文件
- -d : 文件是一个目录
- -s : 文件不为空
- -e : 文件存在

```shell
#!/bin/bash
#文件运算符

#-r -w -x -f -d -s -e

file="/home/h705/桌面/sh_de/9-20-1.sh"

if [ -r $file ]
then
	echo "文件可读"
else
	echo "文件不可读"
fi

if [ -w $file ]
then
	echo "文件可写"
else
	echo "文件不可写"
fi

if [ -x $file ]
then
	echo "文件可执行"
else
	echo "文件不可执行"
fi

if [ -f $file ]
then
	echo "文件是一个普通文件"
else
	echo "文件不是一个普通文件"
fi

if [ -d $file ]
then
	echo "文件是一个目录"
else
	echo "文件不是一个目录"
fi
#判断文件是否为空，不为空返回true
if [ -s $file ]
then
	echo "文件不为空"
else
	echo "文件为空"
fi

#判断文件存在不存在，存在返回true
if [ -e $file ]
then
	echo "文件存在"
else
	echo "文件不存在"
fi
```



## $转义字符

在linux shell脚本中经常用到字符$，下面是$的一些常见用法

- $#	传给脚本的参数个数
- $0	脚本本身的名字
- $1	传递给该shell脚本的第一个参数
- $2	传递给该shell脚本的第二个参数
- $@	传给脚本的所有参数的列表
- $*	以一个单字符串显示所有向脚本传递的参数，与位置变量不同，参数可超过9个
- $$	脚本运行的当前进程ID号
- $?	显示最后命令的退出状态，0表示没有错误，其他表示有错误



```shell
#!/bin/bash
echo hello $1 !
exit

>
[root@localhost Desktop]# bash test.sh
hello !
[root@localhost Desktop]# bash test.sh 11
hello 11 !
[root@localhost Desktop]# bash test.sh 11 3 
hello 11 !
```

#### $0

```shell
#!/bin/bash
if [ $# -ne 2 ]
then
	echo "提示：$(basename $0) 需要两个参数"
else
	num=$[ $1 * $2 ]
	echo "第一个数是：$1"
	echo "第二个数是：$2"
	echo "乘积是：$num"
fi
exit

>
[root@localhost Desktop]# bash test.sh 2
提示：test.sh 需要两个参数
[root@localhost Desktop]# bash test.sh 2 2
第一个数是：2
第二个数是：2
乘积是：4
```

#### 遍历输入的参数

```shell
#!/bin/bash
echo "使用左移进行遍历"

count=1
while [ -n "$1" ]
do
	echo "#$count = $1"
	let count++
	shift
done

>
[root@localhost Desktop]# bash test.sh m n
使用左移进行遍历
#1 = m
#2 = n
```

#### $@ $*

```shell
#!/bin/bash
echo "变量 \$* 显示的信息是：$*"
count=1
for param in "$*"
do
	echo "使用\$*第#$count = $param"
	let count++
done

echo "---"
echo "变量 \$@ 显示的信息是：$@"
count=1

for param in "$@"
do
	echo "使用\$@第#$count = $param"
	let count++
done
exit

>
[root@localhost Desktop]# bash test.sh a b c
变量 $* 显示的信息是：a b c
使用$*第#1 = a b c
---
变量 $@ 显示的信息是：a b c
使用$@第#1 = a
使用$@第#2 = b
使用$@第#3 = c
```

#### shift

```shell
#!/bin/bash
echo "所有的参数是：$*"
echo "左移2个"
shift 2		#左移
echo $1
exit

>
[root@localhost Desktop]# bash test.sh a b c
所有的参数是：a b c
左移2个
c
```



## CSV

（没弄会

```shell
#!/bin/bash
input="name.csv"

while IFS=',' read -r loginname name
do
	echo "adding $loginname"
	useradd -c "$name" -m $loginname
done < "$input"

```



## 脚本文件

#### break & continue

```shell
#!/bin/bash
while :
do
	echo "请输入1-4之间的数字"
	read num
	case $num in
		1|2|3|4) echo "你输入的数字是：$num!"
			;;
		*) echo "你输入的不是1-4之间的数字"
			#break
			continue
			echo "游戏结束"
			;;
	esac
done
```

