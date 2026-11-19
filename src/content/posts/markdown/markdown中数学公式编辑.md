---
title: Markdown 中数学公式编辑
date: 2026-11-18
slug: markdown-math
category: it
subcategory: markdown
tags:
  - markdown
summary: 整理 Markdown/LaTeX 数学公式的行内与块级写法、希腊字母、上下标和括号等语法。
status: published
---

# markdown中数学公式编辑

markdown中**数学公式**的编辑其实和LaTeX中一样，所以这篇文章既可以作为markdown中数学公式的编辑的入门，也可以作为LaTeX的入门。



一般公式分为两种形式，可以理解为一种特殊的代码块，

- 行内公式：`$ \Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,. $`
- 块公式（行间公式）：`$$\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.$$`

$$
\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.
$$

行公式，是在代码块的基础上前面加上`$`，后面加上`$`组成的。而块公式则是 输入`$$`和`$$`在公式前后。

对应的代码块为：

```ruby
$ \Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,. $
$$\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.$$
```

## 希腊字母

|  名称   | 大写 |  code   |   小写   |   code   |
| :-----: | :--: | :-----: | :------: | :------: |
|  alpha  |  A   |    A    |    α     |  \alpha  |
|  beta   |  B   |    B    |    β     |  \beta   |
|  gamma  |  Γ   | \Gamma  |    γ     |  \gamma  |
|  delta  |  Δ   | \Delta  |    δ     |  \delta  |
| epsilon |  E   |    E    |    ϵ     | \epsilon |
|  zeta   |  Z   |    Z    |    ζ     |  \zeta   |
|   eta   |  H   |    H    |    η     |   \eta   |
|  theta  |  Θ   | \Theta  |    θ     |  \theta  |
|  iota   |  I   |    I    |    ι     |  \iota   |
|  kappa  |  K   |    K    |    κ     |  \kappa  |
| lambda  |  Λ   | \Lambda |    λ     | \lambda  |
|   mu    |  M   |    M    |    μ     |   \mu    |
|   nu    |  N   |    N    |    ν     |   \nu    |
|   xi    |  Ξ   |   \Xi   |    ξ     |   \xi    |
| omicron |  O   |    O    |    ο     | \omicron |
|   pi    |  Π   |   \Pi   |    π     |   \pi    |
|   rho   |  P   |    P    |    ρ     |   \rho   |
|  sigma  |  Σ   | \Sigma  |    σ     |  \sigma  |
|   tau   |  T   |    T    |    τ     |   \tau   |
| upsilon |  Υ   |    υ    | \upsilon |          |
|   phi   |  Φ   |  \Phi   |   ϕ、φ   |   \phi   |
|   chi   |  X   |    X    |    χ     |   \chi   |
|   psi   |  Ψ   |  \Psi   |    ψ     |   \psi   |
|  omega  |  Ω   | \Omega  |    ω     |  \omega  |

## 上标与下标

上标和下标分别使用`^` 与`_` ，例如`$x_i^2$`表示的是：
$$
x_i^2
$$
默认情况下，上、下标符号仅仅对下一个组起作用。一个组即单个字符或者使用`{..}` 包裹起来的内容。如果使用`$10^10$` 表示的是：
$$
10^10
$$
而`$10^{10}$` 才是：
$$
10^{10}
$$
同时，大括号还能消除二义性，如`x^5^6` 将得到一个错误，必须使用大括号来界定^的结合性，如`${x^5}^6$` ：
$$
{x^5}^6
$$

## 括号

**后面书写公式，为了方便不在添加`$`。**

### 小括号与方括号

使用原始的`( )` ，`[ ]` 即可，如`(2+3)[4+4]` ：
$$
(2+3)[4+4]
$$
使用`\left`(或`\right`)使符号大小与邻近的公式相适应（该语句适用于所有括号类型），如`\left(\frac{x}{y}\right)` ：
$$
\left( \frac{x}{y} \right)
$$

### 大括号

由于大括号`{}` 被用于分组，因此需要使用`\{`和`\}`表示大括号，也可以使用`\lbrace` 和`\rbrace`来表示。如`\{a*b\}:a∗b` 或`\lbrace a*b\rbrace:a*b` 表示：
$$
\{ a*b \} : a∗b \\
\lbrace a*b \rbrace : a*b
$$

### 尖括号

区分于小于号和大于号，使用`\langle` 和`\rangle` 表示左尖括号和右尖括号。如`\langle x \rangle` 表示：
$$
\langle x \rangle
$$

### 上取整

使用`\lceil` 和 `\rceil` 表示。 如，`\lceil x \rceil`：
$$
\lceil x \rceil
$$

### 下取整

使用`\lfloor` 和 `\rfloor` 表示。如，`\lfloor x \rfloor`：
$$
\lfloor x \rfloor
$$

大括号：

```
\left\lfloor 
\frac{x}{y}
\right\rfloor
```

$$
\left\lfloor 
\frac{x}{y}+1 
\right\rfloor
$$



## 求和与积分

### 求和

`\sum` 用来表示求和符号，其下标表示求和下限，上标表示上限。
`\sum_1^n`表示：
$$
\sum_1^n
$$
`\sum_{r=1}^n`表示：
$$
\sum_{r=1}^n
$$

在行中可以添加`\displaystyle`，进行展示，看起来更好看

```
$\displaystyle \sum_{i=1}^{n} TD(v_i) = 2e$
```

$$
\displaystyle \sum_{i=1}^{n} TD(v_i) = 2e
$$



### 积分

`\int` 用来表示积分符号，同样地，其上下标表示积分的上下限。如，`\int_{r=1}^\infty`：
$$
\int_{r=1}^\infty
$$
多重积分同样使用int ，通过`i`的数量表示积分导数：
`\iint`：
$$
\iint
$$
`\iiint`：
$$
\iiint
$$
`\iiiint`：
$$
\iiiint
$$

### 连乘

`\prod {a+b}`，输出：
$$
\prod {a+b}
$$
`\prod_{i=1}^{K}`，输出：
$$
\prod_{i=1}^{K}
$$

### 其他

与此类似的符号还有：
$$
\prod \\
\bigcup \\
\bigcap \\
arg\,\max_{c_k} \\
arg\,\min_{c_k} \\
\mathop {argmin}_{c_k} \\
\mathop {argmax}_{c_k} \\
\max_{c_k} \\
\min_{c_k}
$$

## 分式与根式

### 分式

第一种，使用`\frac ab`，`\frac`作用于其后的两个组`a` ，`b` ，结果为：
$$
\frac ab
$$
如果你的分子或分母不是单个字符，请使用`{..}`来分组，比如`\frac {a+c+1}{b+c+2}`表示：
$$
\frac {a+c+1}{b+c+2}
$$
第二种，使用`\over`来分隔一个组的前后两部分，如`{a+1\over b+1}`：
$$
{a+1\over b+1}
$$

### 连分数

书写连分数表达式时，请使用`\cfrac`代替`\frac`或者`\over`两者效果对比如下：
`\frac` 表示如下：
$$
x=a_0 + \frac {1^2}{a_1 + \frac {2^2}{a_2 + \frac {3^2}{a_3 + \frac {4^2}{a_4 + ...}}}}
$$
`\cfrac`表示如下：
$$
x=a_0 + \cfrac {1^2}{a_1 + \cfrac {2^2}{a_2 + \cfrac {3^2}{a_3 + \cfrac {4^2}{a_4 + ...}}}}
$$

### 根式

根式使用`\sqrt` 来表示。
如开4次方：`\sqrt[4]{\frac xy}` ：
$$
\sqrt[4]{\frac xy}
$$
开平方：`\sqrt {a+b}`：
$$
\sqrt {a+b}
$$

## 多行表达式

### 分类表达式

定义函数的时候经常需要分情况给出表达式，使用`\begin{cases}…\end{cases}` 。其中：

-   使用`\\` 来分类，
-   使用`&` 指示需要对齐的位置，
-   使用`\` +`空格`表示空格。

### 空格

`\quad`：$1\quad 2$.

`\qquad`：$1\qquad 2$



```ruby
$$
f(n)
\begin{cases}
\cfrac n2, &if\ n\ is\ even\\
3n + 1, &if\  n\ is\ odd
\end{cases}
$$
```

$$
f(n)
\begin{cases}
\cfrac n{2}, &if\ n\ is\ even\\
3n + 1, &if\  n\ is\ odd
\end{cases}
$$

```ruby
$$
L(Y,f(X)) =
\begin{cases}
0, & \text{Y = f(X)}  \\
1, & \text{Y $\neq$ f(X)}
\end{cases}
$$
```

$$
L(Y,f(X)) =
\begin{cases}
0, & \text{Y = f(X)}  \\
1, & \text{Y $\neq$ f(X)}
\end{cases}
$$

如果想分类之间的垂直间隔变大，可以使用`\\[2ex]` 代替`\\` 来分隔不同的情况。(`3ex,4ex` 也可以用，`1ex` 相当于原始距离)。如下所示：

```ruby
$$
L(Y,f(X)) =
\begin{cases}
0, & \text{Y = f(X)} \\[5ex]
1, & \text{Y $\neq$ f(X)}
\end{cases}
$$
```

$$
L(Y,f(X)) =
\begin{cases}
0, & \text{Y = f(X)} \\[5ex]
1, & \text{Y $\neq$ f(X)}
\end{cases}
$$

### ★多行表达式

有时候需要将一行公式分多行进行显示。

```ruby
$$
\begin{split} 
a&=b+c-d \\ 
&\quad +e-f\\ 
&=g+h\\ 
& =i
\end{split}
$$
```

$$
\begin{equation}\begin{split} 
a&=b+c-d \\ 
&\quad +e-f\\ 
&=g+h\\ 
& =i 
\end{split}\end{equation}
$$

其中

- `begin{equation}` 表示开始方程，
- `end{equation}` 表示方程结束；
- `begin{split}` 表示开始多行公式，
- `end{split}` 表示结束；
- `\\` 表示回车到下一行，
- `&` 表示对齐的位置。



【注意】在obsidian里面不能识别\作为换行符
$$
\displaylines{
现期平均数 - 基期平均数 = \frac AB - \frac AB × \frac {1+b}{1+a} \\
= \frac AB × \frac {a-b}{1+a}
}
$$


### 方程组

使用`\begin{array}...\end{array}` 与`\left \{` 与`\right.` 配合表示方程组：

```ruby
$$
\left \{ 
\begin{array}{c}
a_1x+b_1y+c_1z=d_1 \\ 
a_2x+b_2y+c_2z=d_2 \\ 
a_3x+b_3y+c_3z=d_3
\end{array}
\right.
$$
```

$$
\left \{ 
\begin{array}{c}
a_1x+b_1y+c_1z=d_1 \\ 
a_2x+b_2y+c_2z=d_2 \\ 
a_3x+b_3y+c_3z=d_3
\end{array}
\right.
$$

注意：通常MathJax通过内部策略自己管理公式内部的空间，因此`a…b` 与`a……b` （`.`表示空格）都会显示为`ab` 。可以通过在`ab` 间加入`\` ,增加些许间隙，`\;` 增加较宽的间隙，`\quad` 与`\qquad` 会增加更大的间隙。

## 特殊函数与==符号==

### 对数

格式：`\log_ax`

效果：log以a为底，以x为真数。

补充1：`\ln x`

效果：log以e为底，以x为真数。

补充2：`\lg x`

效果：log以10位底，以x为真数。

### 三角函数

`\snx`：sin⁡x

`\arctanx`：arctanx

### 比较运算符

| 意义     | 函数 | 符号 |
| -------- | ---- | ---- |
| 小于     | \lt  | <    |
| 大于     | \gt  | >    |
| 小于等于 | \le  | ≤    |
| 大于等于 | \ge  | ≥    |
| 不等于   | \ne  | ≠    |

可以在这些运算符前面加上`\not`，如`\not\lt`：
$$
\not\lt
$$

### 集合关系与运算

| 意义   | 函数        | 符号 |
| ------ | ----------- | ---- |
| 并集   | \cup        | ∪    |
| 交集   | \cap        | ∩    |
| 差集   | \setminus   | \    |
| 子集   | \subset     | ⊂    |
|        | \subseteq   | ⊆    |
|        | \subsetneq  | ⊊    |
| 父集   | \supset     | ⊃    |
| 属于   | \in         | ∈    |
| 不属于 | \notin      | ∉    |
| 空     | \varnothing | ∅    |

### 排列

`\binom{n+1}{2k}`：
$$
\binom{n+1}{2k}
$$
`{n+1 \choose 2k}`：
$$
{n+1 \choose 2k}
$$

### 箭头

| 函数        | 符号 |
| ----------- | ---- |
| \to         | →    |
| \rightarrow | →    |
| \leftarrow  | ←    |
| \Rightarrow | ⇒    |
| \Leftarrow  | ⇐    |
| \mapsto     | ↦    |

### 逻辑运算符

| 函数    | 符号 |
| ------- | ---- |
| \land   | ∧    |
| \lor    | ∨    |
| \lnot   | ¬    |
| \forall | ∀    |
| \exists | ∃    |
| \top    | ⊤    |
| \bot    | ⊥    |
| \vdash  | ⊢    |
| \vDash  | ⊨    |

### 操作符

| 函数    | 符号 |
| ------- | ---- |
| \star   | ⋆    |
| \ast    | ∗    |
| \oplus  | ⊕    |
| \circ   | ∘    |
| \bullet | ∙    |

### 等于

| 函数    | 符号 |
| ------- | ---- |
| \approx | ≈    |
| \sim    | ∼    |
| \cong   | ≅    |
| \equiv  | ≡    |
| \prec   | ≺    |

### 范围

| 函数     | 符号 |
| -------- | ---- |
| \infty   | ∞    |
| \aleph_o | ℵ_o  |
| \nabla   | ∇    |
| \partial | ∂    |
| \Im      | ℑ    |
| \Re      | ℜ    |
| \Delta   | Δ    |

### 模运算

`\pmod` a (mod b)

如 `a \equiv b \pmod n` ：
$$
a \equiv b \pmod n
$$

### 点

`\ldots`：… 

`\cdots`：⋯

`\cdot`：⋅

其区别是点的位置不同，`\ldots`位置稍低，`\cdots`位置居中。
$$
\ldots
\cdots \\
\cdot
$$

## 顶部符号

对于单字符，`\hat x` ：
$$
\hat x
$$
多字符可以使用`\widehat {xy}` ：
$$
\widehat {xy}
$$
类似的还有:

`\overline x` ：
$$
\overline x
$$
矢量`\vec x` ：
$$
\vec x
$$
向量`\overrightarrow {xy}` ：
$$
\overrightarrow {xy}
$$
`\dot x` ：
$$
\dot x
$$
`\ddot x` ：
$$
\ddot x
$$
`\dot {\dot x}` ：
$$
\dot {\dot x}
$$

## 表格

使用`\begin{array}{列样式}…\end{array}` 这样的形式来创建表格，列样式可以是`clr` 表示居中，左，右对齐，还可以使用`|` 表示一条竖线。表格中各行使用`\\` 分隔，各列使用`&` 分隔。使用`\hline` 在本行前加入一条直线。 例如:

```ruby
$$
\begin{array}{c|lcr}
n & \text{Left} & \text{Center} & \text{Right} \\
\hline
1 & 0.24 & 1 & 125 \\
2 & -1 & 189 & -8 \\
3 & -20 & 2000 & 1+10i \\
\end{array}
$$
```

$$
\begin{array}{c|lcr}
n & \text{Left} & \text{Center} & \text{Right} \\
\hline
1 & 0.24 & 1 & 125 \\
2 & -1 & 189 & -8 \\
3 & -20 & 2000 & 1+10i \\
\end{array}
$$

## 矩阵

### 基本

使用`\begin{matrix}…\end{matrix}` 这样的形式来表示矩阵，在`\begin` 与`\end` 之间加入矩阵中的元素即可。矩阵的行之间使用`\\` 分隔，列之间使用`&` 分隔，例如:

```ruby
$$
\begin{matrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{matrix}
$$
```

$$
\begin{matrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{matrix}
$$



### 括号

如果要对矩阵加括号，可以像上文中提到的一样，使用`\left` 与`\right` 配合表示括号符号。也可以使用特殊的`matrix` 。即替换`\begin{matrix}…\end{matrix}` 中`matrix` 为`pmatrix` ，`bmatrix` ，`Bmatrix` ，`vmatrix` , `Vmatrix` 。

pmatrix：

```ruby
\begin{pmatrix}1 & 2 \\ 3 & 4\\ \end{pmatrix}
```


$$
\begin{pmatrix}1 & 2 \\ 3 & 4\\ \end{pmatrix}
$$
bmatrix：

```ruby
\begin{bmatrix}1 & 2 \\ 3 & 4\\ \end{bmatrix}
```

$$
\begin{bmatrix}1 & 2 \\ 3 & 4\\ \end{bmatrix}
$$

Bmatrix：

```ruby
\begin{Bmatrix}1 & 2 \\ 3 & 4\\ \end{Bmatrix}
```

$$
\begin{Bmatrix}1 & 2 \\ 3 & 4\\ \end{Bmatrix}
$$

vmatrix：

```ruby
\begin{vmatrix}1 & 2 \\ 3 & 4\\ \end{vmatrix}
```

$$
\begin{vmatrix}1 & 2 \\ 3 & 4\\ \end{vmatrix}
$$

Vmatrix：

```ruby
\begin{Vmatrix}1 & 2 \\ 3 & 4\\ \end{Vmatrix}
```

$$
\begin{Vmatrix}1 & 2 \\ 3 & 4\\ \end{Vmatrix}
$$

### 元素省略

可以使用`\cdots` ：⋯，`\ddots`：⋱ ，`\vdots`：⋮ 来省略矩阵中的元素，如：

```ruby
$$
\begin{pmatrix}
1&a_1&a_1^2 & \cdots & a_1^n\\
1&a_2&a_2^2 & \cdots & a_2^n\\
        
\vdots&\vdots&\vdots&\ddots&\vdots\\

1&a_m&a_m^2&\cdots&a_m^n\\
\end{pmatrix}
$$
```

$$
\begin{pmatrix}
1&a_1&a_1^2&\cdots&a_1^n\\
1&a_2&a_2^2&\cdots&a_2^n\\
\vdots&\vdots&\vdots&\ddots&\vdots\\
1&a_m&a_m^2&\cdots&a_m^n\\
\end{pmatrix}
$$

### 增广矩阵

增广矩阵需要使用前面的表格中使用到的`\begin{array} ... \end{array}` 来实现。

```swift
$$
\left[  \begin{array}  {c c | c}
      %这里的c表示数组中元素对其方式：c居中、r右对齐、l左对齐，竖线表示2、3列间插入竖线
1 & 2 & 3 \\
\hline 
      %插入横线，如果去掉\hline就是增广矩阵
4 & 5 & 6
\end{array}  \right]
$$
```

$$
\left[  \begin{array}  {c c | c} 
%这里的c表示数组中元素对其方式：c居中、r右对齐、l左对齐，竖线表示2、3列间插入竖线
1 & 2 & 3 \\
\hline
%插入横线，如果去掉\hline就是增广矩阵
4 & 5 & 6
\end{array}  \right]
$$

## 公式标记与引用

使用`\tag{yourtag}` 来标记公式，如果想在之后引用该公式，则还需要加上`\label{yourlabel}` 在`\tag` 之后，如：

```ruby
a = x^2 - y^3 \tag{1}\label{1}
```

$$
a = x^2 - y^3 \tag{1.1}\label{1}
$$

如果不需要被引用，只使用`\tag{yourtag}` ：

```ruby
x+y=z \tag{1.1}
```

$$
x+y=z \tag{1.1}
$$
`\tab{yourtab}` 中的内容用于显示公式后面的标记。公式之间通过`\label{}` 设置的内容来引用。为了引用公式，可以使用`\eqref{yourlabel}` ，如：

```ruby
a + y^3 \stackrel{ \eqref{1} }= x^2
```

$$
a + y^3 \stackrel{ \eqref{1} }= x^2
$$

或者使用`\ref{yourlabel}` 不带括号引用，如：

```ruby
a + y^3 \stackrel{ \ref{1} }= x^2
```

$$
a + y^3 \stackrel{\ref{1}}= x^2
$$

## 字体

### 黑板粗体字

此字体经常用来表示代表实数、整数、有理数、复数的大写字母。

```ruby
\mathbb ABCDEF
```

$$
\mathbb ABCDEF
$$

```ruby
\Bbb ABCDEF
```

$$
\Bbb ABCDEF
$$

### 黑体字

```ruby
\mathbf ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

$$
\mathbf ABCDEFGHIJKLMNOPQRSTUVWXYZ
$$

```ruby
\mathbf abcdefghijklmnopqrstuvwxyz
```

$$
\mathbf abcdefghijklmnopqrstuvwxyz
$$

### 打印机字体

```ruby
\mathtt ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

$$
\mathtt ABCDEFGHIJKLMNOPQRSTUVWXYZ
$$

### 罗马字体

```
\mathrm abcdefghijklmnopqrstuvwxyz
```

$$
\mathrm abcdefghijklmnopqrstuvwxyz
$$

### 手写字体

```
\mathscr abcdefghijklmnopqrstuvwxyz
```

$$
\mathscr abcdefghijklmnopqrstuvwxyz
$$

### Fraktur字母（一种德国字体）

```
\mathfrak ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

$$
\mathfrak ABCDEFGHIJKLMNOPQRSTUVWXYZ
$$

## 颜色

```
\color{颜色}标签
```


$$
\color{black}{text}：t e x t 
\color{black}{text}text\\
\color{gray}{text}：t e x t \color{gray}{text}text\\
\color{silver}{text}：t e x t \color{silver}{text}text\\
\color{white}{text}：t e x t \color{white}{text}text\\
\color{maroon}{text}：t e x t \color{maroon}{text}text\\
\color{red}{text}：t e x t \color{red}{text}text\\
\color{yellow}{text}：t e x t \color{yellow}{text}text\\
\color{lime}{text}：t e x t \color{lime}{text}text\\
\color{olive}{text}：t e x t \color{olive}{text}text\\
\color{green}{text}：t e x t \color{green}{text}text\\
\color{teal}{text}：t e x t \color{teal}{text}text\\
\color{aqua}{text}：t e x t \color{aqua}{text}text\\
\color{blue}{text}：t e x t \color{blue}{text}text\\
\color{navy}{text}：t e x t \color{navy}{text}text\\
\color{purple}{text}：t e x t \color{purple}{text}text\\
{\color{fuchsia}{内}}外\\

\color{fuchsia}{内2}\\外2text
$$

## 参考

[Mathjax公式教程](https://blog.csdn.net/dabokele/article/details/79577072)

[常用数学符号的LaTeX表示方法-CSDN博客](https://blog.csdn.net/lilongsy/article/details/79378620)

拓展

[Beautiful math in all browsers](https://www.mathjax.org/)

[LaTeX公式语法大全](https://en.wikibooks.org/wiki/LaTeX/Mathematics)

[用Markdown写公式 - Zhilong's Blog (cyprestar.com)](https://www.cyprestar.com/2018/02/26/Write-Markdown-with-Formulas/)

