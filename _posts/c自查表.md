## 头文件

### #pragma GCC system_header

看c++　std::string 的源码，发现有#pragma GCC system_header这个，不知道什么意思，去google了一下，发现意思如下，以后自己代码中还是不要用这个．

从#pragma [GCC](https://so.csdn.net/so/search?q=GCC&spm=1001.2101.3001.7020) system_header直到文件结束之间的代码会被[编译器](https://so.csdn.net/so/search?q=编译器&spm=1001.2101.3001.7020)视为系统头文件之中的代码. 系统头文件中的代码往往不能完全遵循C标准, 所以头文件之中的警告信息往往不显示. (除非用 #warning显式指明).

### #define宏

当我们对程序文件进行编译时，可能会对.h文件重复编译

例如：

当a.cpp中include了b.h和c.h，而b.h和c.h都include了d.h，这时会导致d.h头文件在编译的过程中要被编译两次。

为了减少编译次数，提高代码编译效率，我们需要使用#ifndef宏定义命令把头文件内容包起来，这样就能解决这个问题。

#### 1.宏#define4

宏（Macro），是一种批量处理的称谓。

宏定义将一个标识符定义为一个字符串，源程序中的该标识符均以指定的字符串来代替。预处理命令后通常不加分号。这并不是说所有的预处理命令后都不能有分号出现。由于宏定义只是用宏名对一个字符串进行简单的替换，因此如果在宏定义命令后加了分号，将会连同分号一起进行置换。

宏定义的功能是在编译预处理时，对程序中所有出现的“宏名”都用宏定义中的字符串去代换，这称为“宏代换”或“宏展开”。

#### 2.宏的定义格式

```c
#define <宏名>（<参数表>） <宏体>
```

<宏名>是一个标识符，<参数表>中的参数可以是一个，也可以是多个，视具体情况而定，当有多个参数的时候，每个参数之间用逗号分隔。<宏体>是被替换用的字符串，宏体中的字符串是由参数表中的各个参数组成的表达式。

```c
#include <stdio.h>
#define ABC 2
#define SUB(a,b) a-b
#define CBA "风雨\
同舟"

//如果写不完可以使用“\”来换行
//“\”后直接按回车键换行，不能含有包括空格在内的任何字符，否则是错误的宏定义形式。
int main()
{
    printf("%d\n", ABC);    //输出为2，所有出现的ABC都用2代替
    int result = SUB(2, 3); //所有出现的SUB(2, 3)都被替换为：result = 2 - 3;
    printf("%d\n", result);
    printf("%s\n", CBA);    //输出为风雨同舟
    return 0;
}
```

在使用宏定义时应注意的是：

（1）带参数的宏定义的<宏体>应写在一行上，如果需要写在多行上时，在每行结束时，使用续行符"\"结束，并在该符号后按下回车键，最后一行除外。

（2）在书写带参数的宏定义时，<宏名>与左括号之间不能出现空格，否则空格右边的部分都作为宏体。

```c
#define ADD (x,y) x+y
将会把"（x,y）x+y"的一个整体作为被定义的字符串。
```

（3）定义带参数的宏时，宏体中与参数名相同的字符串适当地加上圆括号是十分重要的，这样能够避免可能产生的错误

（4）定义带参数的宏后，使用时最好避免使用表达式传参。

宏函数和自定义函数相比，效率更高但是安全性低且会使编译生成的目标文件变大；宏函数没有分配和释放栈帧、传参、传返回值等一系列工作，适合那些简短并且频繁调用的函数，但是对于递归则不推荐使用宏

#### 3.删除宏#undef

（1）删除宏的作用
#undef：取消已定义的宏

#define定义预处理器标识符，将保持已定义状态且在作用域内，直到程序结束或者使用#undef 指令取消定义。

（2）删除宏的使用

```c
#include <stdio.h>
int main(void)
{
#define A 200
    printf("A= %d\n", A);   //输出结果为A=200
#undef A
#define A 300
    printf("A= %d\n", A);   //输出结果为A=300
    return 0;
}
```

## 泛型

很遗憾，C语言本身不支持真正意义上的泛型编程，但是却在一定程度上可以“实现泛型编程”。

### _Generic关键字

_Generic是C11的关键字，通过该关键字可以有一个泛型表达式：

```c
_Generic((value). int:"int", float:"float",char*:"char*",default:"other type")
```

什么意思呢？如果value是int类型，那么表达式的值就是“int”，其他的以此类推。看起来是不是和switch语句有点类似呢？

根据这个示例，我们来实现一个功能，打印变量或常量到底是什么类型：

```c
#include <stdio.h>
#define TYPE(v) _Generic((v), \
    int:"int", \
    char:"char", \
    float:"float", \
    double:"double", \
    char*:"char*", \
    default:"other type")

int main(void)
{
    printf("1 + 2 type: %s\n",TYPE(1 + 2));
    printf("1/3 type: %s\n",TYPE(1/3));
    printf("2/3 type: %s\n",TYPE((float)2/3));
    printf("xxx type: %s\n",TYPE("xxx"));
    return 0;
}
```

这里为了方便使用，我们通过define关键字，将泛型表达式简化。

运行结果：

```c
1 + 2 type: int
1/3 type: int
2/3 type: float               
xxx type: char*
```

可以看到通过TYPE就可以获得表达式的结果类型

## 预处理命令

```c
#include<stdio.h> //预处理命令<头文件> 头文件包含命令
#define max 100 //定义标识符 定义宏
typedef int MyInt;  //定义数据类型

#undef //取消已经定义的宏

#if //如果条件为真，就编译下面的代码
#ifdef //如果宏已经定义，就编译下面的代码
#ifndef //如果宏未定义，就编译下面的代码
#elif //如果#if条件不为真，当前条件为真，就编译下面的代码
#endif //结束一个#if...#else条件编译块


template <class T>
```

### #include

\#include的用法有两种，尖括号<>和双引号""

第一种----**尖括号**

```
#include <stdio.h>
```

第二种----**双引号**

```
#include "stdio.h"
```

使用尖括号和双引号的区别在于头文件的搜索路径

**尖括号**：编译器会到系统路径下查找头文件

**双引号**：编译器会先在当前目录下查找头文件，如果没有找到，再到系统路径下查找

注意事项：

1. 一个 #include 命令只能包含一个头文件

2. 同一个头文件可以被多次引入，多次引入的效果和一次引入的效果相同，因为头文件在代码层面有防止重复引入的机制

3. 头文件包含允许嵌套

### #define

格式：#define 标识符 字符串

\#define作用域都是从定义开始直到整个文件结尾（这一点和typedef就区别很大）

- #define（宏定义）----由预处理器来处理

不管是在某个函数内，还是在所有函数之外，作用域都是从定义开始直到整个文件结尾（不管是typedef还是define，其作用域都不会扩展到别的文件，即使是同一个程序的不同文件，也不能互相使用）

这里说下题外话#define叫宏定义，但是在笔者的认识里对声明和定义的理解是：声明不分配内存，定义才分配内存，所以#define虽然名字里面有“定义”两个字，但并不占存储空间（为什么不叫宏声明···）

- typedef----在编译阶段由编译器处理

如果放在所有函数之外，它的作用域就是从**它定义开始直到文件尾**

如果放在某个函数内，它的作用域就是从**它定义开始直到该函数结尾**

总结：#define和声明、定义都不同，宏定义不占内存空间，因为宏在预处理阶段就会被替换掉，到了编译的阶段是没有宏存在的，它在预编译阶段就被处理了。

### #undef 

上文提到#define的作用域是从它声明开始到文件结尾，#undef就是取消之前的宏定义（也就是#define的标识符）。

格式：#undef 标识符（注意：如果标识符当前没有被定义成一个宏名称，那么就会**忽略**该指令）。

### #if（条件编译）

\#if的使用和if else的使用非常相似，一般使用格式如下

> #if 整型常量表达式1
>   程序段1
> #elif 整型常量表达式2
>   程序段2
> #else
>   程序段3
> #endif

执行起来就是，如果整形常量表达式为真，则执行程序段1，否则继续往后判断依次类推（注意是整形常量表达式），最后#endif是#if的结束标志。

```c
#include "stdio.h"

#define MAX 10
int main()
{
    printf("MAX = %d\n", MAX);

#if    MAX == 10
    printf("MAX已被定义\n");
#else
    printf("MAX未被定义\n");
    #undef MAX
    #define    MAX 20
#endif
    printf("MAX = %d\n", MAX);
    return 0;
}
```



### #ifdef

\#ifdef的作用是判断某个宏是否定义，如果该宏已经定义则执行后面的代码，一般使用格式如下

> #ifdef  宏名
>   程序段1
> \#else
>   程序段2
> \#endif

它的意思是，如果该宏已被定义过，则对**程序段1**进行编译，否则对**程序段2**进行编译（这个和上面的#if一样最后都需要#endif），上述格式也可以不用#else，这一点上和if else相同。

```c
#include <stdio.h>

#define MAX 10
int main()
{
#ifdef MAX
    printf("MAX已被定义\n");
#else
    printf("MAX未被定义\n");
    #undef MAX
    #define    MAX 20
#endif
    printf("MAX = %d\n", MAX);
    return 0;
}
```



### #ifndef

\#ifndef恰好和#ifdef相反

> #ifndef 宏名
>   程序段1 
> \#else 
>   程序段2 
> \#endif

如果该宏未被定义，则对“程序段1”进行编译，否则对“程序段2”进行编译



### #elif

\#elif相当于if else语句中的else if()语句，需要注意的是该语句是#elif，而不是#elseif



### defined函数

defined函数的作用是判断某个宏是否被定义,若该宏被定义则返回**1**，否则返回**0**，该函数经常与#if #elif #else配合使用，一般使用格式为：

**defined 宏名**

**或**

**defined (宏名)----（个人建议，还是加上括号比较好）**

上文提到有#ifdef、#ifndef来判断宏名是否被定义，乍一看defined有点多余，其实不然，#ifdef和#ifndef仅能一次判断一个宏名，而defined能做到一次判断多个宏名

```c
#include <stdio.h>

#define MAX 10
#define MIN 2
#define AVE 6
int main()
{
#if defined (MAX) && defined (MIN) && defined (AVE)
    printf("三个宏已全部定义\n");
#elif MAX==10
    printf("三个宏未全部定义\n");
#endif

    return 0;
}
```



## struct结构体

```c
struct
{     
	long int id;     
	int age;     
	char name[8]; 
}stu1;//结构体全局变量

struct student //结构体
{     
	long int id;     
	int age;     
	char name[8]; 
}stu1;//全局变量

//结构体别名
typedef struct student
{
	long int id;
	int age;
	char name[8]; 
}stu;
stu stu1;
```

变量

```c
struct student stu1; //stu stu1;
stu1.id=1;
printf("%d\n",stu1.id);

stu *stu1=(stu*)malloc(sizeof(stu));
stu1->id=1;
printf("%d\n",stu1->id);
//即
(*stu1).id=1;
printf("%d\n",(*stu1).id);


```



## union共同体

设有字符型变量c、整型变量j，若这二个变量在使用过程中互斥，即当用到c时，一定不用j，当用j时，一定不用c，则无需为二个变量分配不同的存储空间，而可使二个变量共同使用一个存储空间，如图8.1所示。具有这种存储特性的变量称为共同体类型的变量。要定义共同体类型变量，必须先定义共同体类型。共同体类型的定义方法与结构体类型的定义方法类似，只要用关键字union 代替struct即可。

```c
#include<stdio.h>

union data
{
    char c;
    int i;
};

int main(){
    data d;
    d.i=65;
    printf("%c\n",d.c);
    return 0;
}
```

特点：

1. 同一共同体内的成员共用一个存储区，存储区的大小=成员占用字节长度最大值。
2. 在任一时刻，在一个共同体变量中，只有一个成员起作用。
3. 共同体类型中的成员类型可为任意已定义的数据类型。

由于共同体变量在程序设计中已很少用

## enum枚举

枚举是 C 语言中的一种基本数据类型，它可以让数据更简洁，更易读。

比如：一星期有 7 天，如果不用枚举，我们需要使用 #define 来为每个整数定义一个别名：

```c
#define MON  1 
#define TUE  2 
#define WED  3 
#define THU  4 
#define FRI  5 
#define SAT  6 
#define SUN  7
```

这个看起来代码量就比较多，接下来我们看看使用枚举的方式：

```c
enum DAY
{
      MON=1, TUE, WED, THU, FRI, SAT, SUN
};
//我们在这个实例中把第一个枚举成员的值定义为 1，第二个就为 2，以此类推
```

**注意：**第一个枚举成员的默认值为整型的 0，后续没有指定值的枚举元素，其值为前一元素加 1。

```c
enum season {spring, summer=3, autumn, winter};
//也就说 spring 的值为 0，summer 的值为 3，autumn 的值为 4，winter 的值为 5
```

3种同结构体一样的定义方式

```c
//1.先定义枚举类型，再定义枚举变量
enum DAY
{
      MON=1, TUE, WED, THU, FRI, SAT, SUN
};
enum DAY day;

//2、定义枚举类型的同时定义枚举变量

enum DAY
{
      MON=1, TUE, WED, THU, FRI, SAT, SUN
} day;

//3、省略枚举名称，直接定义枚举变量(一次性)
enum
{
      MON=1, TUE, WED, THU, FRI, SAT, SUN
} day;
```

例子：

枚举类型是被当做 int 或者 unsigned int 类型来处理的

```c
#include <stdio.h>
 
enum DAY
{
	MON=1, TUE, WED, THU, FRI, SAT, SUN
};
 
int main()
{
    enum DAY day;
    day = WED;
    printf("%d",day);
    return 0;
}
```

> 3

枚举类型不连续，这种枚举无法遍历。

判断：

```c
#include <stdio.h>
 
enum DAY{
    MON=1, TUE, WED, THU, FRI, SAT, SUN
};
 
int main()
{
    enum DAY day;
    printf("输入1-7：");
    scanf("%u",&day);

    //用if判断
    if(day==MON){
        printf("if的1");
    }

    //用switch判断
    switch(day){
        case MON:
            printf("一");
            break;
        case TUE:
            printf("二");
            break;
        case WED:
            printf("三");
            break;
        case THU:
            printf("四");
            break;
        case FRI:
            printf("五");
            break;
        case SAT:
            printf("六");
            break;
        case SUN:
            printf("日");
            break;
        default:
            printf("no");
            break;
    }
    printf("\n");
    
    return 0;
}
```



## system

```c++
#include <stdlib.h>

system("pause");用来暂停黑窗口
Sleep(500);延迟操作
system("cls");清屏
用 system("color 0A"); 
```



## switch

可以嵌套

```c
#include<stdio.h>
int main()
{
    int m=7, n=2;
    switch (n)
    {
        case 1:
            printf("one\n");
        case 2:
            switch(m>n)
                {
                    case true:
                        printf("two point one\n");
                        break;
                    case false:
                        printf("two point two\n");
                        break;
                }
        case 3:
            printf("three\n");
            break;
        default:
            printf("gg\n");
            break;
    }
    printf("m=%d,n=%d\n",m,n);
    return 0;
}
```

>two point one
>three
>m=7,n=2

## 进制、数据类型

|              | 关键字  | 格式说明符                                               | 内存占用 | 取值范围               | 使用场景                        |
| ------------ | ------- | -------------------------------------------------------- | -------- | ---------------------- | ------------------------------- |
| 字节型       | byte    | 标准C没有这个类型，byte表示一个字节,对应C的unsigned char | 1个字节  | -128~127               | 存储字节数据（不常用）          |
| 短整型       | short   | %hd、%hu、%ho、%hx、%#hx                                 | 2个字节  | -32768~32767           | 兼容性考虑（不常用）            |
| 整型         | int     | %d,%u,%o,%x,%#x                                          | 4个字节  | -2的31次方~2的31次方-1 | 存储普通整型（常用）            |
| 长整型       | long    | %ld（同理有uox）                                         | 8个字节  | -2的63次方~2的63次方-1 | 存储长整型（常用）              |
| 单精度浮点数 | float   | %f、%e、%a                                               | 4个字节  | 1.4013E-45~3.4028E+38  | 存储浮点数（不常用）            |
| 双精度浮点数 | double  | %lf、%le、%la                                            | 8个字节  | 4.9E-324~1.7977E+308   | 存储双精度浮点数（常用）        |
| 字符型       | char    | %c                                                       | 2个字节  | 0-65535                | 存储一个字符（常用）            |
| 布尔类型     | boolean |                                                          | 1个字节  | true，false            | 存储逻辑变量true、false（常用） |

%d(十进制)，

%u（无符号十进制），

%o(八进制输出格式)，

%x(十六进制)。

前面加#显示进制

```c
%#o,10 - 0xA

//无符号
unsigned int a; //无符号整型%u
```

### 进制转换itoa()

```c
#include <stdlib.h>
```

**函数原型**： char *itoa(int i,char *s,int radix);

**功能**：用于把整数转换成字符串

**参数**：int i 为要转换为字符的数字

​     char *s 为转换后的指向字符串的指针

​     int radix 为转换数字的进制数

**返回值**：返回指向转换后的字符串指针

```c
#include<stdio.h>
#include <stdlib.h>

int main(){
    char s[12]; //自定义二进制数的位数，输出位数是实际所需位数
    int num=12;
    itoa(num,s,2);//转成字符串，基数为2
    printf("二进制：%s\n",s);
	return 0;
}

二进制：1100
```

### 科学计数法

**科学记数法**是以简洁的方式书写冗长数字的有用速记法。虽然科学记数法一开始可能看起来很陌生，但了解科学记数法将帮助您了解浮点数的工作原理。

注意：

- e前面：必须有数。可以是整数，也可以是小数

```c
.2 就是 0.2
-.2 == -0.2
```



- e后面
  1. 可为0，就是没有幂，即10^0=1
  2. 必须有数（整数）
  3. 不可以有小数  3e1.2



```c
42030
    小数点左滑 4 个空格：(+)4.2030e(+)4		//省略+
    修剪尾随零：4.203e4（4 个有效数字）
-120
    -1.2e2
    
0.012
    1.2e-2
```

有效数字（'e'之前的部分）中的数字称为**有效数字**。有效位数定义了数字的**精度**。有效数字中的数字越多，数字就越精确。



## 转义字符

| 转义字符 | 意义                                | ASCII码值（十进制） |
| -------- | ----------------------------------- | ------------------- |
| \a       | 响铃(BEL)                           | 007                 |
| \b       | 退格(BS) ，将当前位置移到前一列     | 008                 |
| \f       | 换页(FF)，将当前位置移到下页开头    | 012                 |
| \n       | 换行(LF) ，将当前位置移到下一行开头 | 010                 |
| \r       | 回车(CR) ，将当前位置移到本行开头   | 013                 |
| \t       | 水平制表(HT) （横向跳格）           | 009                 |
| \v       | 垂直制表(VT)                        | 011                 |
| `\'`     | 单引号                              | 039                 |
| `\"`     | 双引号                              | 034                 |
| `\\`     | 反斜杠                              | 092                 |
| `\?`     | 问号                                |                     |

## 运算符

**单目运算符**：是指运算所需变量为一个的运算符，即在运算当中只有一个操作数，又叫一元运算符。

**双目运算符**：运算所需变量为两个的运算符，或者要求运算对象的个数是2的运算符。

**三目运算符：？**

```c
c = a>b?a:b
```

 判断a是否大于b，如果a大于b 则把a的值赋给c。如果a小于b 则把b的值赋给c

result = **a>b**? "**x**"  :"y" ;

解读： 判断a是否大于b，如果a大于b 则把x的值赋给result，如果a小于b 则把y的值赋给result

我还有进阶版

result=a>b?"x":(a>c?"y":"z");

解读： 判断a是否大于b，如果a大于b 则把x的值赋给result，如果a小于b 那么在a大于b 的前提下进行判断a是否大于c

如果a大于c 那么把y的值赋给result，如果a小于c那么把z的值赋给result

### 逻辑运算

- 单目
  - !：逻辑非
- 双目
  - &&：逻辑与
  - ||：逻辑或



### 位运算

| 符号 | 描述 | 运算规则                                                     |
| :--- | :--- | :----------------------------------------------------------- |
| &    | 与   | 两个位都为1时，结果才为1                                     |
| \|   | 或   | 两个位都为0时，结果才为0                                     |
| ^    | 异或 | 两个位相同为0，相异为1                                       |
| ~    | 取反 | 0变1，1变0                                                   |
| <<   | 左移 | 各二进位全部左移若干位，高位丢弃，低位补0                    |
| >>   | 右移 | 各二进位全部右移若干位，对无符号数，高位补0，有符号数，各编译器处理方法不一样，有的补符号位（算术右移），有的补0（逻辑右移） |

#### 移位运算

按二进制形式把所有的数字向左移动对应的位数，高位移出(舍弃)，低位的空位补零。

需要移位的数字 << 移位的次数

例如：3 << 2，则是将数字3左移2位

```c
<<即Lsh
int a = 2<<0; //a=2
a = 2<<1; //a=2*2=4
a = 2<<2; //a=2*2^2=8
a = 2<<3; //a=2*2^3=2*8=16
...
>>即Rsh
int b = 32>>0; //b=32
b = 32>>1; //b=16,因为2*16=32
b = 32>>2; //b=8,4*8=32
b = 32>>3; //b=4,8*4=32
```



### 模%、除/运算

有一个数abcd

abcd%10 = d

abcd/10 = 123



abcd%100 = cd

abcd/100 = 12





### 运算符优先级

**算数 > 关系 > 逻辑 > 赋值**

单目运算（++ -- + -） 优先于 双目运算（* / % 大于 + -）

- a++：a参加表达式，之后再+1
- ++a：先+1，之后再参加表达式



| 优先级 | 运算符                                                       | 结合律   |
| ------ | ------------------------------------------------------------ | -------- |
| 1      | 后缀运算符：[]   ()   ·   ->   ++   --(类型名称){列表}       | 从左到右 |
| 2      | 单目运算符：++   --   !   ~   +   -   *   &   sizeof()       | 从右到左 |
| 3      | 类型转换运算符：(类型名称)                                   | 从右到左 |
| 4      | 乘除法运算符：*   /   %                                      | 从左到右 |
| 5      | 加减法运算符：+   -                                          | 从左到右 |
| 6      | 移位运算符：<<   >>                                          | 从左到右 |
| 7      | **关系**运算符：<<=   >>=                                    | 从左到右 |
| 8      | 相等运算符：==   !=                                          | 从左到右 |
| 9      | 位运算符 AND：&                                              | 从左到右 |
| 10     | 位运算符 XOR：^                                              | 从左到右 |
| 11     | 位运算符 OR：\|                                              | 从左到右 |
| 12     | 逻辑运算符 AND：&&                                           | 从左到右 |
| 13     | **逻辑**运算符 OR：\|\|                                      | 从左到右 |
| 14     | 条件运算符：?:                                               | 从右到左 |
| 15     | 赋值运算符：    =     +=     -=    *=    /=    %=    &=    ^=    \|=     <<=    >>= | 从右到左 |
| 16     | 逗号运算符：，                                               | 从左到右 |

## sizeof()

sizeof是运算符而不是函数，它是一个编译时运算符，用于判断变量或数据类型的**字节**大小。返回值类型是size_t（long long unsigned int），这是一个typedef定义的一个无符号整型的别名。运算对象是类型说明符时，必须加上括号。

sizeof 运算符可用于获取类、结构、共用体和其他用户自定义数据类型的大小。

```c
int main()
{
	printf("%d\n",(int)sizeof(char *));
	printf("%d\n",(int)sizeof(int));
	printf("%d\n",(int)sizeof(int *));
	printf("%d\n",(int)sizeof(double *));
	printf("%d\n",(int)sizeof(float *));
	return 0;
}
```

指针都显示**8**位

## typeid()！！！！！！

c++里面的，c没有

```c
#include <typeinfo>

int a = 1;
const char *datatype = typeid( a ).name();
printf("%s\n",datatype);


char _dataType[10];
strcpy(_dataType, typeid(_arr).name());
```

返回数据类型

## math.h

**math.h** 头文件定义了各种数学函数和一个宏。在这个库中所有可用的功能都带有一个 **double** 类型的参数，且都返回 **double** 类型的结果。

### 库宏

下面是这个库中定义的唯一的一个宏：

| 序号 | 宏 & 描述                                                    |
| :--- | :----------------------------------------------------------- |
| 1    | **HUGE_VAL** 当函数的结果不可以表示为浮点数时。如果是因为结果的幅度太大以致于无法表示，则函数会设置 errno 为 ERANGE 来表示范围错误，并返回一个由宏 HUGE_VAL 或者它的否定（- HUGE_VAL）命名的一个特定的很大的值。如果结果的幅度太小，则会返回零值。在这种情况下，error 可能会被设置为 ERANGE，也有可能不会被设置为 ERANGE。 |

### 库函数

下面列出了头文件 math.h 中定义的函数：

| 序号 | 函数 & 描述                                                  |
| :--- | :----------------------------------------------------------- |
| 1    | [double acos(double x)](https://www.runoob.com/cprogramming/c-function-acos.html) 返回以弧度表示的 x 的反余弦。 |
| 2    | [double asin(double x)](https://www.runoob.com/cprogramming/c-function-asin.html) 返回以弧度表示的 x 的反正弦。 |
| 3    | [double atan(double x)](https://www.runoob.com/cprogramming/c-function-atan.html) 返回以弧度表示的 x 的反正切。 |
| 4    | [double atan2(double y, double x)](https://www.runoob.com/cprogramming/c-function-atan2.html) 返回以弧度表示的 y/x 的反正切。y 和 x 的值的符号决定了正确的象限。 |
| 5    | [double cos(double x)](https://www.runoob.com/cprogramming/c-function-cos.html) 返回弧度角 x 的余弦。 |
| 6    | [double cosh(double x)](https://www.runoob.com/cprogramming/c-function-cosh.html) 返回 x 的双曲余弦。 |
| 7    | [double sin(double x)](https://www.runoob.com/cprogramming/c-function-sin.html) 返回弧度角 x 的正弦。 |
| 8    | [double sinh(double x)](https://www.runoob.com/cprogramming/c-function-sinh.html) 返回 x 的双曲正弦。 |
| 9    | [double tanh(double x)](https://www.runoob.com/cprogramming/c-function-tanh.html) 返回 x 的双曲正切。 |
| 10   | [double exp(double x)](https://www.runoob.com/cprogramming/c-function-exp.html) 返回 e 的 x 次幂的值。 |
| 11   | [double frexp(double x, int *exponent)](https://www.runoob.com/cprogramming/c-function-frexp.html) 把浮点数 x 分解成尾数和指数。返回值是尾数，并将指数存入 exponent 中。所得的值是 x = mantissa * 2 ^ exponent。 |
| 12   | [double ldexp(double x, int exponent)](https://www.runoob.com/cprogramming/c-function-ldexp.html) 返回 x 乘以 2 的 exponent 次幂。 |
| 13   | [double log(double x)](https://www.runoob.com/cprogramming/c-function-log.html) 返回 x 的自然对数（基数为 e 的对数）。 |
| 14   | [double log10(double x)](https://www.runoob.com/cprogramming/c-function-log10.html) 返回 x 的常用对数（基数为 10 的对数）。 |
| 15   | [double modf(double x, double *integer)](https://www.runoob.com/cprogramming/c-function-modf.html) 返回值为小数部分（小数点后的部分），并设置 integer 为整数部分。 |
| 16   | [double pow(double x, double y)](https://www.runoob.com/cprogramming/c-function-pow.html) 返回 x 的 y 次**幂**。 |
| 17   | [double sqrt(double x)](https://www.runoob.com/cprogramming/c-function-sqrt.html) 返回 x 的**平方根**。 |
| 18   | [double ceil(double x)](https://www.runoob.com/cprogramming/c-function-ceil.html) 返回大于或等于 x 的最小的整数值。 |
| 19   | [double fabs(double x)](https://www.runoob.com/cprogramming/c-function-fabs.html) 返回 x 的**绝对值**。 |
| 20   | [double floor(double x)](https://www.runoob.com/cprogramming/c-function-floor.html) 返回小于或等于 x 的最大的整数值。 |
| 21   | [double fmod(double x, double y)](https://www.runoob.com/cprogramming/c-function-fmod.html) 返回 x 除以 y 的余数。 |



## cstring、string.h

**string .h** 头文件定义了一个变量类型、一个宏和各种操作字符数组的函数。

### 库变量

下面是头文件 string.h 中定义的变量类型：

| 序号 | 变量 & 描述                                                  |
| :--- | :----------------------------------------------------------- |
| 1    | **size_t** 这是无符号整数类型，它是 **sizeof** 关键字的结果。 |

### 库宏

下面是头文件 string.h 中定义的宏：

| 序号 | 宏 & 描述                             |
| :--- | :------------------------------------ |
| 1    | **NULL** 这个宏是一个空指针常量的值。 |

### 库函数

下面是头文件 string.h 中定义的函数：

| 序号 | 函数 & 描述                                                  |
| :--- | :----------------------------------------------------------- |
| 1    | [void *memchr(const void *str, int c, size_t n)](https://www.runoob.com/cprogramming/c-function-memchr.html) 在参数 *str* 所指向的字符串的前 n 个字节中搜索第一次出现字符 c（一个无符号字符）的位置。 |
| 2    | [int memcmp(const void *str1, const void *str2, size_t n)](https://www.runoob.com/cprogramming/c-function-memcmp.html) 把 *str1* 和 *str2* 的前 n 个字节进行比较。 |
| 3    | [void *memcpy(void *dest, const void *src, size_t n)](https://www.runoob.com/cprogramming/c-function-memcpy.html) 从 src 复制 n 个字符到 *dest*。 |
| 4    | [void *memmove(void *dest, const void *src, size_t n)](https://www.runoob.com/cprogramming/c-function-memmove.html) 另一个用于从 *src* 复制 n 个字符到 *dest* 的函数。 |
| 5    | [void *memset(void *str, int c, size_t n)](https://www.runoob.com/cprogramming/c-function-memset.html) 复制字符 c（一个无符号字符）到参数 *str* 所指向的字符串的前 n 个字符。 |
| 6    | [char *strcat(char *dest, const char *src)](https://www.runoob.com/cprogramming/c-function-strcat.html) 把 *src* 所指向的字符串追加到 *dest* 所指向的字符串的结尾。 |
| 7    | [char *strncat(char *dest, const char *src, size_t n)](https://www.runoob.com/cprogramming/c-function-strncat.html) 把 *src* 所指向的字符串追加到 *dest* 所指向的字符串的结尾，直到 n 字符长度为止。 |
| 8    | [char *strchr(const char *str, int c)](https://www.runoob.com/cprogramming/c-function-strchr.html) 在参数 *str* 所指向的字符串中搜索第一次出现字符 c（一个无符号字符）的位置。 |
| 9    | [int strcmp(const char *str1, const char *str2)](https://www.runoob.com/cprogramming/c-function-strcmp.html) 把 *str1* 所指向的字符串和 *str2* 所指向的字符串进行比较。 |
| 10   | [int strncmp(const char *str1, const char *str2, size_t n)](https://www.runoob.com/cprogramming/c-function-strncmp.html) 把 *str1* 和 *str2* 进行比较，最多比较前 n 个字节。 |
| 11   | [int strcoll(const char *str1, const char *str2)](https://www.runoob.com/cprogramming/c-function-strcoll.html) 把 *str1* 和 *str2* 进行比较，结果取决于 LC_COLLATE 的位置设置。 |
| 12   | [char *strcpy(char *dest, const char *src)](https://www.runoob.com/cprogramming/c-function-strcpy.html) 把 *src* 所指向的字符串复制到 *dest*。 |
| 13   | [char *strncpy(char *dest, const char *src, size_t n)](https://www.runoob.com/cprogramming/c-function-strncpy.html) 把 *src* 所指向的字符串复制到 *dest*，最多复制 n 个字符。 |
| 14   | [size_t strcspn(const char *str1, const char *str2)](https://www.runoob.com/cprogramming/c-function-strcspn.html) 检索字符串 str1 开头连续有几个字符都不含字符串 str2 中的字符。 |
| 15   | [char *strerror(int errnum)](https://www.runoob.com/cprogramming/c-function-strerror.html) 从内部数组中搜索错误号 errnum，并返回一个指向错误消息字符串的指针。 |
| 16   | [size_t strlen(const char *str)](https://www.runoob.com/cprogramming/c-function-strlen.html) 计算字符串 str 的长度，直到空结束字符，但不包括空结束字符。 |
| 17   | [char *strpbrk(const char *str1, const char *str2)](https://www.runoob.com/cprogramming/c-function-strpbrk.html) 检索字符串 *str1* 中第一个匹配字符串 *str2* 中字符的字符，不包含空结束字符。也就是说，依次检验字符串 str1 中的字符，当被检验字符在字符串 str2 中也包含时，则停止检验，并返回该字符位置。 |
| 18   | [char *strrchr(const char *str, int c)](https://www.runoob.com/cprogramming/c-function-strrchr.html) 在参数 *str* 所指向的字符串中搜索最后一次出现字符 c（一个无符号字符）的位置。 |
| 19   | [size_t strspn(const char *str1, const char *str2)](https://www.runoob.com/cprogramming/c-function-strspn.html) 检索字符串 *str1* 中第一个不在字符串 *str2* 中出现的字符下标。 |
| 20   | [char *strstr(const char *haystack, const char *needle)](https://www.runoob.com/cprogramming/c-function-strstr.html) 在字符串 *haystack* 中查找第一次出现字符串 *needle*（不包含空结束字符）的位置。 |
| 21   | [char *strtok(char *str, const char *delim)](https://www.runoob.com/cprogramming/c-function-strtok.html) 分解字符串 *str* 为一组字符串，*delim* 为分隔符。 |
| 22   | [size_t strxfrm(char *dest, const char *src, size_t n)](https://www.runoob.com/cprogramming/c-function-strxfrm.html) 根据程序当前的区域选项中的 LC_COLLATE 来转换字符串 **src** 的前 **n** 个字符，并把它们放置在字符串 **dest** 中。 |

#### strtok

```c
#include<stdio.h>
#include<string.h>

int main(){
    char str[] = {"There is no char"};
    int num;
    char *token;
   
    /* 获取第一个子字符串 */
    token = strtok(str, " ");

    /* 继续获取其他的子字符串 */
    while( token != NULL ) {
        printf( "%s\n", token );
        num++;
        token = strtok(NULL, " ");
    }
    printf("%d\n",num);
    return(0);
}
```

#### strrchr

char *strrchr(const char *str, char c); 

函数功能：查找一个字符c在另一个[字符串](https://so.csdn.net/so/search?q=字符串&spm=1001.2101.3001.7020)str中末次出现的位置（也就是从str的右侧开始查找字符c首次出现的位置），并返回这个位置的地址。如果未能找到指定字符，那么函数将返回NULL。使用这个地址返回从最后一个字符c到str末尾的字符串。 

```c++
#include <string.h>
#include <stdio.h>
int main(void)
{
    char string[20];
    char *ptr, c = 'r';
    strcpy(string, "There are two rings");
    ptr = strrchr(string, c);
    if (ptr)
        printf("The character %c is at position: %s\n", c, ptr);
    else
        printf("The character was not found\n");
    return 0;
}
```



### char

```c
char ch;
ch = getchar();  //用getchar()输入
putchar(ch);  //输出


const char* cha;
```



### string在c中

c语言中没有string，只能用char[]或者char*来代替

#### 定义

```c
char *str;
scanf("%s",str);
```

程序一直报错，最后查到这两句。

很明显，str是一个char类型的指针，但是我声明完了以后就直接给它赋值。这是不可以的。

必须给他开辟空间，让它知道要把数据存储在哪里。

```c
#include<cstdlib>
char *str= (char*)malloc(sizeof(char));  
scanf("%s",str);
```

程序正常启动。



构造一个字符串

```c
//ans大小为n+1
char * ans = (char *)malloc(sizeof(char) * (n + 1));
//初始化，全赋值为a，结尾为'\0'
memset(ans, 'a', sizeof(char) * n);  
ans[n] = '\0';
```



#### 输入输出

string除了使用scanf()和printf()外，还使用gets()和puts()。

输入还有：

- 一个字符
  - getch()：不显示读入字符
  - getche()：有回显
  - getchar()：回显，而且要使用回车关闭输入（是读取一个字符，包括回车键也会被读成一个字符）

- 字符串：gets()函数 是输入一行字符串，以回车结束，并且回车键会被过滤掉，不会被读到字符串中

getchar()和putchar()

```c
char c;
printf("请输入字符：");
c = getchar();

printf("输入的字符：");
putchar(c);
```

gets()和puts()

```c
#include<cstring>

char str[20];
gets(str);

puts(str);
printf("%s\n",str);
```
#### 串处理函数

| 函数            | 函数 & 目的                                                  |
| :-------------- | :----------------------------------------------------------- |
| strcpy(s1, s2); | 复制字符串 s2 到字符串 s1。                                  |
| strcat(s1, s2); | 连接字符串 s2 到字符串 s1 的末尾。                           |
| strlen(s1);     | 返回字符串 s1 的长度。                                       |
| strcmp(s1, s2); | 如果 s1 和 s2 是相同的，则返回 0；如果 s1<s2 则返回小于 0；如果 s1>s2 则返回大于 0。 |
| strchr(s1, ch); | 返回一个指针，指向字符串 s1 中字符 ch 的第一次出现的位置。   |
| strstr(s1, s2); | 返回一个指针，指向字符串 s1 中字符串 s2 的第一次出现的位置。 |

#### 大小写

strupr(字符串)：大写转换 将字符串中的所有小写字母转换成大写字母

strlwr(字符串)： 小写转换 将字符串中的大写字母转换成小写字母

```c
#include<stdio.h>
#include<string.h>
int main(){
    char c[5]="a2";

    strupr(c);
    puts(c);

    strlwr(c);
    puts(c);
}
```

>A2
>a2

#### char、string转换

只能找其他间接的方法了，这里提供几种：

```c++
//1、构造函数里有个string（size_t,char）
char x = 'a';
string s(1,x);
//2、string初始化没char，但是push_back可以
string s;
s.push_back(x);
//3、string可以由char*初始化
char xx[2] = {x,0};
string s(xx)

    
//strcpy
char string[20];
strcpy(string, "There are two rings");
```



## stdlib.h

### (T *)malloc()

void *malloc( size_t size )

语句给指针变量分配一个整型存储空间。
C语言中定义指针变量后，必须给指针变量进行相应的地址分配，，之后才可以使用指针变量，否则就会出现程序异常。

```c
int *p;	//定义指针变量p，未初始化
```

地址分配的方法通常有两种：
(1)

```c
int x = 5;
p = &x;	//p指向x所在的位置，要注意x和p的数据类型应相同
```

(2)

```c
int *p = (int*)malloc(sizeof(int));	//让系统为p选择一个内存空间。
//因为int大小是4
int *p = (int*)malloc(4);
```

malloc的原型是

```c
void * malloc(int size);	//	void*表示函数返回值为任意类型，size是分配的内存单元字节数
```

当如果不给p分配内存地址，它就会变成“野指针”，进而导致程序崩溃。

#### 数组

p[5]

```c
int *p = (int*)malloc(sizeof(int)*5);	//让系统为p选择一个内存空间。
int *p = (int*)malloc(4*5);
```

#### 二维指针

```c
int a=3;
int *b=&a;
int **c=&b;
//c是一个指针 但它同时指向了一个整形指针类型，所以它也可以说是一个指针的指针。
```

指针数组和二维数组指针的区别

定义时非常相似，只是括号的位置不同：

```c
int *(p1[5]);  //指针数组，可以去掉括号直接写作 int *p1[5];
int (*p2)[5];  //二维数组指针，不能去掉括号
```

指针数组和二维数组指针有着本质上的区别：

**指针数组**是一个数组，只是每个元素保存的都是指针，以上面的 p1 为例，在32位环境下它占用 4×5 = 20 个字节的内存。

**二维数组指针**是一个指针，它指向一个二维数组，以上面的 p2 为例，它占用 4 个字节的内存。



### (T *)calloc()

void *calloc(size_t nitems, size_t size)

分配所需的内存空间，并返回一个指向它的指针。malloc和calloc之间的不同点是，malloc不会设置内存为零，而calloc会设置分配的内存为零（因为calloc在返回在堆区申请的那块动态内存的起始地址之前，会将每个字节都初始化为0）。

```c
int *p = (int*)calloc(1,sizeof(int)); //让系统为p选择一个内存空间

int *p = (int*)malloc(sizeof(int)*5);
//等于
int *p = (int*)calloc(5,sizeof(int));
```



### realloc()

void *realloc(void *ptr, size_t size)

尝试重新调整之前调用malloc或calloc所分配的ptr所指向的内存块的大小。

realloc失败的时候，返回**NULL**

```c
int *p = (int*)malloc(sizeof(int)*10);

//重新分配
*p = (int *)realloc(p, sizeof(int)*15);

//new
int *pnn=(int *)realloc(p, sizeof(int)*15);
```



### free(p)

void free( void *ptr )

函数释放指针*ptr*指向的空间，以供以后使用。指针*ptr* 必须由先前对malloc(),  calloc() realloc()的调用返回

## 循环

```
break
continue
```

空结束

```c
while (*str != '\0'){ }
```



## 颜色代码

### 全局换色

```c++
#include<stdlib.h>
system("color 0A");
```

其中color后面的0是背景色代号，A是前景色代号。各颜色代码如下： 
0=黑色 
1=蓝色 
2=绿色
3=湖蓝色
4=红色
5=紫色
6=黄色 
7=白色 
8=灰色 
9=淡蓝色 
A=淡绿色 
B=淡浅绿色 
C=淡红色 
D=淡紫色 
E=淡黄色 
F=亮白色 

---

### 部分换色

```cpp
#include<Windows.h>
```

wAttributes——字符属性，包括颜色和 DBCS （点击查询DBCS双字节字符）



Attribute	含义	对应数字
FOREGROUND_BLUE	文本颜色包含蓝色。	1
FOREGROUND_GREEN	文本颜色包含绿色。	2
FOREGROUND_RED	文本颜色包含红色。	4
FOREGROUND_INTENSITY	文本颜色增强	8
BACKGROUND_BLUE	背景色包含蓝色。	16
BACKGROUND_GREEN	背景色包含绿色。	32
BACKGROUND_RED	背景色包含红色。	64
BACKGROUND_INTENSITY	背景色增强。	128
COMMON_LVB_LEADING_BYTE	前导字节。	\
COMMON_LVB_TRAILING_BYTE	尾随字节。	\
COMMON_LVB_GRID_HORIZONTAL	顶部水平。	\
COMMON_LVB_GRID_LVERTICAL	左垂直。	\
COMMON_LVB_GRID_RVERTICAL	右垂直。	\
COMMON_LVB_REVERSE_VIDEO	反转前景和背景属性。	\
COMMON_LVB_UNDERSCORE	下划线。	\


前景属性指定文本颜色; 背景属性指定用于填充单元格背景的颜色; 其他属性与 DBCS 一起使用。

应用程序可以将前景常量和背景常量组合起来以实现不同的颜色，这个时候考察的就是绘画能力啦（红色＋绿色= 黄色 ps:可以加高亮哦），使用 | 符号。

例如，以下组合实现：蓝色背景上的亮青色文本。

FOREGROUND_BLUE | FOREGROUND_GREEN | FOREGROUND_INTENSITY | BACKGROUND_BLUE

如果没有指定背景常量，则背景为黑色，如果没有指定前景常量，则文本为黑色。

例如，以下组合实现：白色背景上的黑色文本。 为背景指定了红色、绿色和蓝色，它们组合成白色背景。 没有为前景指定标志颜色，因此它为黑色。

BACKGROUND_BLUE | BACKGROUND_GREEN | BACKGROUND_RED

更多详情见：  控制台屏幕缓冲区

 【注】关于wAttributes 字符属性参数的写法有三种，如下：

```c++
//BACKGROUND代表背景，FOREGROUND代表前景
SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), FOREGROUND_INTENSITY | FOREGROUND_RED | FOREGROUND_GREEN);//设置黄色（红色+绿色）
//十六进制数字
SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 0x04);  //红色
//十进制数字
SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 2);  //绿色
```

常用色：

```c++
SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), FOREGROUND_INTENSITY | FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_BLUE);//设置白色
SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), BACKGROUND_BLUE | FOREGROUND_INTENSITY | FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_BLUE); //设置蓝底白字
```



# Ascii码

| 十进制值                               | 字符                                                         | 解释                                           |
| :------------------------------------- | :----------------------------------------------------------- | :--------------------------------------------- |
| [0](https://ascii.diqibu.com/?a=0)     | [NUT](https://ascii.diqibu.com/?c=0) (null)                  | [空字符](https://ascii.diqibu.com/?c=0)        |
| [1](https://ascii.diqibu.com/?a=1)     | [SOH](https://ascii.diqibu.com/?c=1) (start of headline)     | [标题开始](https://ascii.diqibu.com/?c=1)      |
| [2](https://ascii.diqibu.com/?a=2)     | [STX](https://ascii.diqibu.com/?c=2) (start of text)         | [正文开始](https://ascii.diqibu.com/?c=2)      |
| [3](https://ascii.diqibu.com/?a=3)     | [ETX](https://ascii.diqibu.com/?c=3) (end of text)           | [正文结束](https://ascii.diqibu.com/?c=3)      |
| [4](https://ascii.diqibu.com/?a=4)     | [EOT](https://ascii.diqibu.com/?c=4) (end of transmission)   | [传输结束](https://ascii.diqibu.com/?c=4)      |
| [5](https://ascii.diqibu.com/?a=5)     | [ENQ](https://ascii.diqibu.com/?c=5) (enquiry)               | [请求](https://ascii.diqibu.com/?c=5)          |
| [6](https://ascii.diqibu.com/?a=6)     | [ACK](https://ascii.diqibu.com/?c=6) (acknowledge)           | [收到通知](https://ascii.diqibu.com/?c=6)      |
| [7](https://ascii.diqibu.com/?a=7)     | [BEL](https://ascii.diqibu.com/?c=7) (bell)                  | [响铃](https://ascii.diqibu.com/?c=7)          |
| [8](https://ascii.diqibu.com/?a=8)     | [BS](https://ascii.diqibu.com/?c=8) (backspace)              | [退格](https://ascii.diqibu.com/?c=8)          |
| [9](https://ascii.diqibu.com/?a=9)     | [HT](https://ascii.diqibu.com/?c=9) (horizontal tab)         | [水平制表符](https://ascii.diqibu.com/?c=9)    |
| [10](https://ascii.diqibu.com/?a=10)   | [LF](https://ascii.diqibu.com/?c=10) (NL line feed, new line)**\n** | [换行键](https://ascii.diqibu.com/?c=10)       |
| [11](https://ascii.diqibu.com/?a=11)   | [VT](https://ascii.diqibu.com/?c=11) (vertical tab)          | [垂直制表符](https://ascii.diqibu.com/?c=11)   |
| [12](https://ascii.diqibu.com/?a=12)   | [FF](https://ascii.diqibu.com/?c=12) (NP form feed, new page) | [换页键](https://ascii.diqibu.com/?c=12)       |
| [13](https://ascii.diqibu.com/?a=13)   | [CR](https://ascii.diqibu.com/?c=13) (carriage return)**\r** | [回车键](https://ascii.diqibu.com/?c=13)       |
| [14](https://ascii.diqibu.com/?a=14)   | [SO](https://ascii.diqibu.com/?c=14) (shift out)             | [不用切换](https://ascii.diqibu.com/?c=14)     |
| [15](https://ascii.diqibu.com/?a=15)   | [SI](https://ascii.diqibu.com/?c=15) (shift in)              | [启用切换](https://ascii.diqibu.com/?c=15)     |
| [16](https://ascii.diqibu.com/?a=16)   | [DLE](https://ascii.diqibu.com/?c=16) (data link escape)     | [数据链路转义](https://ascii.diqibu.com/?c=16) |
| [17](https://ascii.diqibu.com/?a=17)   | [DC1](https://ascii.diqibu.com/?c=17) (device control 1)     | [设备控制1](https://ascii.diqibu.com/?c=17)    |
| [18](https://ascii.diqibu.com/?a=18)   | [DC2](https://ascii.diqibu.com/?c=18) (device control 2)     | [设备控制2](https://ascii.diqibu.com/?c=18)    |
| [19](https://ascii.diqibu.com/?a=19)   | [DC3](https://ascii.diqibu.com/?c=19) (device control 3)     | [设备控制3](https://ascii.diqibu.com/?c=19)    |
| [20](https://ascii.diqibu.com/?a=20)   | [DC4](https://ascii.diqibu.com/?c=20) (device control 4)     | [设备控制4](https://ascii.diqibu.com/?c=20)    |
| [21](https://ascii.diqibu.com/?a=21)   | [NAK](https://ascii.diqibu.com/?c=21) (negative acknowledge) | [拒绝接收](https://ascii.diqibu.com/?c=21)     |
| [22](https://ascii.diqibu.com/?a=22)   | [SYN](https://ascii.diqibu.com/?c=22) (synchronous idle)     | [同步空闲](https://ascii.diqibu.com/?c=22)     |
| [23](https://ascii.diqibu.com/?a=23)   | [ETB](https://ascii.diqibu.com/?c=23) (end of trans. block)  | [结束传输块](https://ascii.diqibu.com/?c=23)   |
| [24](https://ascii.diqibu.com/?a=24)   | [CAN](https://ascii.diqibu.com/?c=24) (cancel)               | [取消](https://ascii.diqibu.com/?c=24)         |
| [25](https://ascii.diqibu.com/?a=25)   | [EM](https://ascii.diqibu.com/?c=25) (end of medium)         | [媒介结束](https://ascii.diqibu.com/?c=25)     |
| [26](https://ascii.diqibu.com/?a=26)   | [SUB](https://ascii.diqibu.com/?c=26) (substitute)           | [代替](https://ascii.diqibu.com/?c=26)         |
| [27](https://ascii.diqibu.com/?a=27)   | [ESC](https://ascii.diqibu.com/?c=27) (escape)               | [换码(溢出)](https://ascii.diqibu.com/?c=27)   |
| [28](https://ascii.diqibu.com/?a=28)   | [FS](https://ascii.diqibu.com/?c=28) (file separator)        | [文件分隔符](https://ascii.diqibu.com/?c=28)   |
| [29](https://ascii.diqibu.com/?a=29)   | [GS](https://ascii.diqibu.com/?c=29) (group separator)       | [分组符](https://ascii.diqibu.com/?c=29)       |
| [30](https://ascii.diqibu.com/?a=30)   | [RS](https://ascii.diqibu.com/?c=30) (record separator)      | [记录分隔符](https://ascii.diqibu.com/?c=30)   |
| [31](https://ascii.diqibu.com/?a=31)   | [US](https://ascii.diqibu.com/?c=31) (unit separator)        | [单元分隔符](https://ascii.diqibu.com/?c=31)   |
| [32](https://ascii.diqibu.com/?a=32)   | [(space)](https://ascii.diqibu.com/?c=32) (space)            | [空格](https://ascii.diqibu.com/?c=32)         |
| [33](https://ascii.diqibu.com/?a=33)   | [!](https://ascii.diqibu.com/?c=33)                          | [叹号](https://ascii.diqibu.com/?c=33)         |
| [34](https://ascii.diqibu.com/?a=34)   | ["](https://ascii.diqibu.com/?c=34)                          | [双引号](https://ascii.diqibu.com/?c=34)       |
| [35](https://ascii.diqibu.com/?a=35)   | [#](https://ascii.diqibu.com/?c=35)                          | [井号](https://ascii.diqibu.com/?c=35)         |
| [36](https://ascii.diqibu.com/?a=36)   | [$](https://ascii.diqibu.com/?c=36)                          | [美元符号](https://ascii.diqibu.com/?c=36)     |
| [37](https://ascii.diqibu.com/?a=37)   | [%](https://ascii.diqibu.com/?c=37)                          | [百分号](https://ascii.diqibu.com/?c=37)       |
| [38](https://ascii.diqibu.com/?a=38)   | [&](https://ascii.diqibu.com/?c=38)                          | [和号](https://ascii.diqibu.com/?c=38)         |
| [39](https://ascii.diqibu.com/?a=39)   | ['](https://ascii.diqibu.com/?c=39)                          | [闭单引号](https://ascii.diqibu.com/?c=39)     |
| [40](https://ascii.diqibu.com/?a=40)   | [(](https://ascii.diqibu.com/?c=40)                          | [开括号](https://ascii.diqibu.com/?c=40)       |
| [41](https://ascii.diqibu.com/?a=41)   | [)](https://ascii.diqibu.com/?c=41)                          | [闭括号](https://ascii.diqibu.com/?c=41)       |
| [42](https://ascii.diqibu.com/?a=42)   | [*](https://ascii.diqibu.com/?c=42)                          | [星号](https://ascii.diqibu.com/?c=42)         |
| [43](https://ascii.diqibu.com/?a=43)   | [+](https://ascii.diqibu.com/?c=43)                          | [加号](https://ascii.diqibu.com/?c=43)         |
| [44](https://ascii.diqibu.com/?a=44)   | [,](https://ascii.diqibu.com/?c=44)                          | [逗号](https://ascii.diqibu.com/?c=44)         |
| [45](https://ascii.diqibu.com/?a=45)   | [-](https://ascii.diqibu.com/?c=45)                          | [减号/破折号](https://ascii.diqibu.com/?c=45)  |
| [46](https://ascii.diqibu.com/?a=46)   | [.](https://ascii.diqibu.com/?c=46)                          | [句号/点](https://ascii.diqibu.com/?c=46)      |
| [47](https://ascii.diqibu.com/?a=47)   | [/](https://ascii.diqibu.com/?c=47)                          | [斜杠](https://ascii.diqibu.com/?c=47)         |
| [48](https://ascii.diqibu.com/?a=48)   | [0](https://ascii.diqibu.com/?c=48)                          | [数字0](https://ascii.diqibu.com/?c=48)        |
| [49](https://ascii.diqibu.com/?a=49)   | [1](https://ascii.diqibu.com/?c=49)                          | [数字1](https://ascii.diqibu.com/?c=49)        |
| [50](https://ascii.diqibu.com/?a=50)   | [2](https://ascii.diqibu.com/?c=50)                          | [数字2](https://ascii.diqibu.com/?c=50)        |
| [51](https://ascii.diqibu.com/?a=51)   | [3](https://ascii.diqibu.com/?c=51)                          | [数字3](https://ascii.diqibu.com/?c=51)        |
| [52](https://ascii.diqibu.com/?a=52)   | [4](https://ascii.diqibu.com/?c=52)                          | [数字4](https://ascii.diqibu.com/?c=52)        |
| [53](https://ascii.diqibu.com/?a=53)   | [5](https://ascii.diqibu.com/?c=53)                          | [数字5](https://ascii.diqibu.com/?c=53)        |
| [54](https://ascii.diqibu.com/?a=54)   | [6](https://ascii.diqibu.com/?c=54)                          | [数字6](https://ascii.diqibu.com/?c=54)        |
| [55](https://ascii.diqibu.com/?a=55)   | [7](https://ascii.diqibu.com/?c=55)                          | [数字7](https://ascii.diqibu.com/?c=55)        |
| [56](https://ascii.diqibu.com/?a=56)   | [8](https://ascii.diqibu.com/?c=56)                          | [数字8](https://ascii.diqibu.com/?c=56)        |
| [57](https://ascii.diqibu.com/?a=57)   | [9](https://ascii.diqibu.com/?c=57)                          | [数字9](https://ascii.diqibu.com/?c=57)        |
| [58](https://ascii.diqibu.com/?a=58)   | [:](https://ascii.diqibu.com/?c=58)                          | [冒号](https://ascii.diqibu.com/?c=58)         |
| [59](https://ascii.diqibu.com/?a=59)   | [;](https://ascii.diqibu.com/?c=59)                          | [分号](https://ascii.diqibu.com/?c=59)         |
| [60](https://ascii.diqibu.com/?a=60)   | [<](https://ascii.diqibu.com/?c=60)                          | [小于](https://ascii.diqibu.com/?c=60)         |
| [61](https://ascii.diqibu.com/?a=61)   | [=](https://ascii.diqibu.com/?c=61)                          | [等号](https://ascii.diqibu.com/?c=61)         |
| [62](https://ascii.diqibu.com/?a=62)   | [>](https://ascii.diqibu.com/?c=62)                          | [大于](https://ascii.diqibu.com/?c=62)         |
| [63](https://ascii.diqibu.com/?a=63)   | [?](https://ascii.diqibu.com/?c=63)                          | [问号](https://ascii.diqibu.com/?c=63)         |
| [64](https://ascii.diqibu.com/?a=64)   | [@](https://ascii.diqibu.com/?c=64)                          | [电子邮件符号](https://ascii.diqibu.com/?c=64) |
| [65](https://ascii.diqibu.com/?a=65)   | [A](https://ascii.diqibu.com/?c=65)                          | [大写字母A](https://ascii.diqibu.com/?c=65)    |
| [66](https://ascii.diqibu.com/?a=66)   | [B](https://ascii.diqibu.com/?c=66)                          | [大写字母B](https://ascii.diqibu.com/?c=66)    |
| [67](https://ascii.diqibu.com/?a=67)   | [C](https://ascii.diqibu.com/?c=67)                          | [大写字母C](https://ascii.diqibu.com/?c=67)    |
| [68](https://ascii.diqibu.com/?a=68)   | [D](https://ascii.diqibu.com/?c=68)                          | [大写字母D](https://ascii.diqibu.com/?c=68)    |
| [69](https://ascii.diqibu.com/?a=69)   | [E](https://ascii.diqibu.com/?c=69)                          | [大写字母E](https://ascii.diqibu.com/?c=69)    |
| [70](https://ascii.diqibu.com/?a=70)   | [F](https://ascii.diqibu.com/?c=70)                          | [大写字母F](https://ascii.diqibu.com/?c=70)    |
| [71](https://ascii.diqibu.com/?a=71)   | [G](https://ascii.diqibu.com/?c=71)                          | [大写字母G](https://ascii.diqibu.com/?c=71)    |
| [72](https://ascii.diqibu.com/?a=72)   | [H](https://ascii.diqibu.com/?c=72)                          | [大写字母H](https://ascii.diqibu.com/?c=72)    |
| [73](https://ascii.diqibu.com/?a=73)   | [I](https://ascii.diqibu.com/?c=73)                          | [大写字母I](https://ascii.diqibu.com/?c=73)    |
| [74](https://ascii.diqibu.com/?a=74)   | [J](https://ascii.diqibu.com/?c=74)                          | [大写字母J](https://ascii.diqibu.com/?c=74)    |
| [75](https://ascii.diqibu.com/?a=75)   | [K](https://ascii.diqibu.com/?c=75)                          | [大写字母K](https://ascii.diqibu.com/?c=75)    |
| [76](https://ascii.diqibu.com/?a=76)   | [L](https://ascii.diqibu.com/?c=76)                          | [大写字母L](https://ascii.diqibu.com/?c=76)    |
| [77](https://ascii.diqibu.com/?a=77)   | [M](https://ascii.diqibu.com/?c=77)                          | [大写字母M](https://ascii.diqibu.com/?c=77)    |
| [78](https://ascii.diqibu.com/?a=78)   | [N](https://ascii.diqibu.com/?c=78)                          | [大写字母N](https://ascii.diqibu.com/?c=78)    |
| [79](https://ascii.diqibu.com/?a=79)   | [O](https://ascii.diqibu.com/?c=79)                          | [大写字母O](https://ascii.diqibu.com/?c=79)    |
| [80](https://ascii.diqibu.com/?a=80)   | [P](https://ascii.diqibu.com/?c=80)                          | [大写字母P](https://ascii.diqibu.com/?c=80)    |
| [81](https://ascii.diqibu.com/?a=81)   | [Q](https://ascii.diqibu.com/?c=81)                          | [大写字母Q](https://ascii.diqibu.com/?c=81)    |
| [82](https://ascii.diqibu.com/?a=82)   | [R](https://ascii.diqibu.com/?c=82)                          | [大写字母R](https://ascii.diqibu.com/?c=82)    |
| [83](https://ascii.diqibu.com/?a=83)   | [S](https://ascii.diqibu.com/?c=83)                          | [大写字母S](https://ascii.diqibu.com/?c=83)    |
| [84](https://ascii.diqibu.com/?a=84)   | [T](https://ascii.diqibu.com/?c=84)                          | [大写字母T](https://ascii.diqibu.com/?c=84)    |
| [85](https://ascii.diqibu.com/?a=85)   | [U](https://ascii.diqibu.com/?c=85)                          | [大写字母U](https://ascii.diqibu.com/?c=85)    |
| [86](https://ascii.diqibu.com/?a=86)   | [V](https://ascii.diqibu.com/?c=86)                          | [大写字母V](https://ascii.diqibu.com/?c=86)    |
| [87](https://ascii.diqibu.com/?a=87)   | [W](https://ascii.diqibu.com/?c=87)                          | [大写字母W](https://ascii.diqibu.com/?c=87)    |
| [88](https://ascii.diqibu.com/?a=88)   | [X](https://ascii.diqibu.com/?c=88)                          | [大写字母X](https://ascii.diqibu.com/?c=88)    |
| [89](https://ascii.diqibu.com/?a=89)   | [Y](https://ascii.diqibu.com/?c=89)                          | [大写字母Y](https://ascii.diqibu.com/?c=89)    |
| [90](https://ascii.diqibu.com/?a=90)   | [Z](https://ascii.diqibu.com/?c=90)                          | [大写字母Z](https://ascii.diqibu.com/?c=90)    |
| [91](https://ascii.diqibu.com/?a=91)   | [                                                            | [开方括号](https://ascii.diqibu.com/?c=91)     |
| [92](https://ascii.diqibu.com/?a=92)   | \                                                            | [反斜杠](https://ascii.diqibu.com/?c=92)       |
| [93](https://ascii.diqibu.com/?a=93)   | ]                                                            | [闭方括号](https://ascii.diqibu.com/?c=93)     |
| [94](https://ascii.diqibu.com/?a=94)   | [^](https://ascii.diqibu.com/?c=94)                          | [脱字符](https://ascii.diqibu.com/?c=94)       |
| [95](https://ascii.diqibu.com/?a=95)   | [_](https://ascii.diqibu.com/?c=95)                          | [下划线](https://ascii.diqibu.com/?c=95)       |
| [96](https://ascii.diqibu.com/?a=96)   | [`](https://ascii.diqibu.com/?c=96)                          | [开单引号](https://ascii.diqibu.com/?c=96)     |
| [97](https://ascii.diqibu.com/?a=97)   | [a](https://ascii.diqibu.com/?c=97)                          | [小写字母a](https://ascii.diqibu.com/?c=97)    |
| [98](https://ascii.diqibu.com/?a=98)   | [b](https://ascii.diqibu.com/?c=98)                          | [小写字母b](https://ascii.diqibu.com/?c=98)    |
| [99](https://ascii.diqibu.com/?a=99)   | [c](https://ascii.diqibu.com/?c=99)                          | [小写字母c](https://ascii.diqibu.com/?c=99)    |
| [100](https://ascii.diqibu.com/?a=100) | [d](https://ascii.diqibu.com/?c=100)                         | [小写字母d](https://ascii.diqibu.com/?c=100)   |
| [101](https://ascii.diqibu.com/?a=101) | [e](https://ascii.diqibu.com/?c=101)                         | [小写字母e](https://ascii.diqibu.com/?c=101)   |
| [102](https://ascii.diqibu.com/?a=102) | [f](https://ascii.diqibu.com/?c=102)                         | [小写字母f](https://ascii.diqibu.com/?c=102)   |
| [103](https://ascii.diqibu.com/?a=103) | [g](https://ascii.diqibu.com/?c=103)                         | [小写字母g](https://ascii.diqibu.com/?c=103)   |
| [104](https://ascii.diqibu.com/?a=104) | [h](https://ascii.diqibu.com/?c=104)                         | [小写字母h](https://ascii.diqibu.com/?c=104)   |
| [105](https://ascii.diqibu.com/?a=105) | [i](https://ascii.diqibu.com/?c=105)                         | [小写字母i](https://ascii.diqibu.com/?c=105)   |
| [106](https://ascii.diqibu.com/?a=106) | [j](https://ascii.diqibu.com/?c=106)                         | [小写字母j](https://ascii.diqibu.com/?c=106)   |
| [107](https://ascii.diqibu.com/?a=107) | [k](https://ascii.diqibu.com/?c=107)                         | [小写字母k](https://ascii.diqibu.com/?c=107)   |
| [108](https://ascii.diqibu.com/?a=108) | [l](https://ascii.diqibu.com/?c=108)                         | [小写字母l](https://ascii.diqibu.com/?c=108)   |
| [109](https://ascii.diqibu.com/?a=109) | [m](https://ascii.diqibu.com/?c=109)                         | [小写字母m](https://ascii.diqibu.com/?c=109)   |
| [110](https://ascii.diqibu.com/?a=110) | [n](https://ascii.diqibu.com/?c=110)                         | [小写字母n](https://ascii.diqibu.com/?c=110)   |
| [111](https://ascii.diqibu.com/?a=111) | [o](https://ascii.diqibu.com/?c=111)                         | [小写字母o](https://ascii.diqibu.com/?c=111)   |
| [112](https://ascii.diqibu.com/?a=112) | [p](https://ascii.diqibu.com/?c=112)                         | [小写字母p](https://ascii.diqibu.com/?c=112)   |
| [113](https://ascii.diqibu.com/?a=113) | [q](https://ascii.diqibu.com/?c=113)                         | [小写字母q](https://ascii.diqibu.com/?c=113)   |
| [114](https://ascii.diqibu.com/?a=114) | [r](https://ascii.diqibu.com/?c=114)                         | [小写字母r](https://ascii.diqibu.com/?c=114)   |
| [115](https://ascii.diqibu.com/?a=115) | [s](https://ascii.diqibu.com/?c=115)                         | [小写字母s](https://ascii.diqibu.com/?c=115)   |
| [116](https://ascii.diqibu.com/?a=116) | [t](https://ascii.diqibu.com/?c=116)                         | [小写字母t](https://ascii.diqibu.com/?c=116)   |
| [117](https://ascii.diqibu.com/?a=117) | [u](https://ascii.diqibu.com/?c=117)                         | [小写字母u](https://ascii.diqibu.com/?c=117)   |
| [118](https://ascii.diqibu.com/?a=118) | [v](https://ascii.diqibu.com/?c=118)                         | [小写字母v](https://ascii.diqibu.com/?c=118)   |
| [119](https://ascii.diqibu.com/?a=119) | [w](https://ascii.diqibu.com/?c=119)                         | [小写字母w](https://ascii.diqibu.com/?c=119)   |
| [120](https://ascii.diqibu.com/?a=120) | [x](https://ascii.diqibu.com/?c=120)                         | [小写字母x](https://ascii.diqibu.com/?c=120)   |
| [121](https://ascii.diqibu.com/?a=121) | [y](https://ascii.diqibu.com/?c=121)                         | [小写字母y](https://ascii.diqibu.com/?c=121)   |
| [122](https://ascii.diqibu.com/?a=122) | [z](https://ascii.diqibu.com/?c=122)                         | [小写字母z](https://ascii.diqibu.com/?c=122)   |
| [123](https://ascii.diqibu.com/?a=123) | [{](https://ascii.diqibu.com/?c=123)                         | [开花括号](https://ascii.diqibu.com/?c=123)    |
| [124](https://ascii.diqibu.com/?a=124) | [\|](https://ascii.diqibu.com/?c=124)                        | [垂线](https://ascii.diqibu.com/?c=124)        |
| [125](https://ascii.diqibu.com/?a=125) | [}](https://ascii.diqibu.com/?c=125)                         | [闭花括号](https://ascii.diqibu.com/?c=125)    |
| [126](https://ascii.diqibu.com/?a=126) | [~](https://ascii.diqibu.com/?c=126)                         | [波浪号](https://ascii.diqibu.com/?c=126)      |
| [127](https://ascii.diqibu.com/?a=127) | [DEL](https://ascii.diqibu.com/?c=127) (delete)              | [删除](https://ascii.diqibu.com/?c=127)        |

说明：

ASCII 码使用指定的7 位或8 位二进制数组合来表示128 或256 种可能的字符。标准ASCII 码也叫基础ASCII码，使用7 位二进制数（剩下的1位二进制为0）来表示所有的大写和小写字母，数字0 到9、标点符号， 以及在美式英语中使用的特殊控制字符。其中：

0～31及127(共33个)是控制字符或通信专用字符（其余为可显示字符），如控制符：LF（换行）、CR（回车）、FF（换页）、DEL（删除）、BS（退格)、BEL（响铃）等；通信专用字符：SOH（文头）、EOT（文尾）、ACK（确认）等；ASCII值为8、9、10 和13 分别转换为退格、制表、换行和回车字符。它们并没有特定的图形显示，但会依不同的应用程序，而对文本显示有不同的影响。

32～126(共95个)是字符(32是空格），其中48～57为0到9十个阿拉伯数字。

65～90为26个大写英文字母，97～122号为26个小写英文字母，其余为一些标点符号、运算符号等。



# 其他

### inline void main()与ivoid main()有何区别？

对于main函数，没有任何区别的，因为main函数不能内联。inline只是表示内联的意思，所谓内谓，同宏类似，编译器在编译时会直接将代码内容内联到调用处，目的在于避免一次函数调用，利于提高程序性能。(因为函数调用也是有开销）
