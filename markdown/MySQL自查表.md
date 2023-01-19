目录

[TOC]

结构化查询语言SQL（Structured Query Language）

核心SQL的四个组成部分：

1. 数据定义语言（或DDL）
2. 数据操纵语言（或DML）
3. 数据控制语言（或DCL）
4. 嵌入式SQL语言的使用规则




目前主要使用两种框架方式：

- LAMP
- WAMP



MySQL中不分大小写



## 安装

检查安装
rpm -qa | grep mysql



linux管理命令

```
systemcrl (start/restart/stop) mysql.service

service mysqld start 			
systemcrl start mysql.service  			开启MySQL服务
（只要没有错误信息就表示已经正常启动了）
systemcrl stop mysql.service			关闭MySQL服务
systemctl restart mysql.servic			重启MySQL服务 
service mysqld status 					查看服务状态

systemcrl enable mysql.service 			设置开机自启动(一般默认都开着)
```





Windows
管理员身份启动cmd

```
C:\WINDOWS\system32> net start mysql57 			启动
C:\WINDOWS\system32> net stop mysql57 			关闭
```



------

SQL语句：

登录mysql

```sql
mysql -p
```

登录mysql的root

```sql
mysql -u root -p
```

退出

```sql
mysql> ctrl+c
mysql> exit
```





使用

```sql
use mysql;
```

设置/重置MySQL登录密码

```sql
set password = password('我是密码');
```

新刷系统权限

```sql
flush privileges;
```


查看所有编码字符

```sql
show variables like "%character%";
```



### 字符集

 **一般选择utf8.下面介绍一下utf8与utfmb4的区别。**

 utf8mb4兼容utf8，且比utf8能表示更多的字符。至于什么时候用，看你的做什么项目了，到 http://blog.csdn.net/leelyliu/article/details/52879685 看unicode编码区从1 ～ 126就属于传统utf8区，当然utf8mb4也兼容这个区，126行以下就是utf8mb4扩充区，什么时候你需要存储那些字符，你才用utf8mb4,否则只是浪费空间。

### 排序说明

排序一般分为两种： utf_bin和utf_general_ci

 bin 是二进制, a 和 A 会别区别对待.

 例如你运行:

 SELECT * FROM table WHERE txt = 'a'

 那么在utf8_bin中你就找不到 txt = 'A' 的那一行, 而 utf8_general_ci 则可以.

-  **utf8_general_ci** 不区分大小写，这个你在注册用户名和邮箱的时候就要使用。
-  **utf8_general_cs** 区分大小写，如果用户名和邮箱用这个 就会照成不良后果
-  **utf8_bin**：字符串每个字符串用二进制数据编译存储。 区分大小写，而且可以存二进制的内容

 **utf8_unicode_ci**和utf8_general_ci对中、英文来说没有实质的差别。

 utf8_general_ci校对速度快，但准确度稍差。 （准确度够用，一般建库选择这个）

 utf8_unicode_ci准确度高，但校对速度稍慢。










----------------------------------------
## 语言

1. 数据库
2. 表
3. 字段(列)
4. 数据(约束)







`[]`可省略

`{|}`左右任意选择

`db_name`库名称

`tbl_name`表名称

`col_name`字段，数据列名列表

`expr`常量、变量、表达式

`select_expr`要查询的内容

------

### DATABASE

#### 查看所有库

- `like`关键字用于匹配名称
- `where`关键字用于指定查找范围条件

```sql
SHOW DATABASES [LIKE 'pattern'|WHERE expr];
```

#### 新建数据库

- `if not exists`表示查看是否已存在，避免出现创建已存在的数据库时出现的错误

```sql
create database 数据库名称;
CREATE SCHEMA 库名称;

CREATE {DATABASE|SCHEMA} [IF NOT EXISTS] db_name
```

#### 修改数据库

```sql
ALTER DATABASE 库名称;
```

#### 删除数据库

- `IF EXISTS`判断是否存在，避免出现删除不存在的数据库时出现的错误

```sql
drop database [IF EXISTS] 数据库名称;
```

#### 连接数据库

```sql
use 数据库名称;
```

查看当前数据库信息

```sql
status

Connection id:          11
Current database:       user_0518
Current user:           root@localhost
SSL:                    Cipher in use is ECDHE-RSA-AES128-GCM-SHA256
Using delimiter:        ;
Server version:         5.7.30-log MySQL Community Server (GPL)
Protocol version:       10
Connection:             localhost via TCP/IP
Server characterset:    latin1
Db     characterset:    latin1
Client characterset:    gbk
Conn.  characterset:    gbk
TCP port:               3306
Uptime:                 47 min 55 sec

1.当前链接的id号
2.当前选择的使用的数据库
3.当前链接的登录用户
4.是否使用SSL
5.行终结符是分号
6.当前mysql服务器的版本号
7.协议版本
8.使用的链接类型
9.服务器使用的字符类型
10.数据库使用的字符类型
11.客户端使用的字符类型
12.链接使用的字符类型
13.链接端口号
14.时间
```







------

### TABLE



| 类型              | 描述                                  |
| :---------------: | :-----------------------------------:|
| CHAR(固定长度)     | 表示字符串类型, 数字                  |
| VARCHAR(变长长度)  | 可以存放数字，字母                    |
| INT(长度)          | 整型                                 |
| FLOAT/DOUBLE      | 浮点类型                             |
| BOOL				|布尔型							 |
| DATE              | 表示日期类型(不包含时分秒)           |
| DATETIME          | 时间戳：表示时间类型(包含时分秒)      |
| TIME				| 时间型							|
| TEXT              | 放大文本字符串                     |
| BLOB              | 用于存放二进制文件,例如图片,电影,音乐 |

char与varchar后面接的数据大小为存储的**字符数**，而不是字节数。

char定义的是固定长度，长度范围为**0-255**，存储时，如果字符数没有达到定义的位数，会在后面用空格补全存入数据库中。

varchar是变长长度，长度范围为**0-65535**，存储时，如果字符没有达到定义的位数，也不会在后面补空格。



创建表的操作属于**DDL(数据库定义语言)**操作，所以是由命名要求的，对于表名称以及列名称的定义要求如下：

1. 必须字母开头
2. 长度为1~30个字符
3. 对于同一用户不能用相同的表名称
4. 不能使用保留字



#### 创建表

（表创建定义+表选项+分区选项...）

```sql
create table 表名称(
	字段名称 数据类型 [DEFAULT 默认值],
	字段名称 数据类型 [DEFAULT 默认值],
	其他字段...,
    [表级完整性约束条件]
)[engine=引擎类型];


创建表例子：
mysql> create table user_1(
    -> id int AUTO_INCREMENT PRIMARY KEY,
    -> name varchar(10) NOT NULL,
    -> sex char(5) DEFAULT 0,
    -> age int,
    -> )
    -> ;
```

- `TEMPORARY`关键字表示该语句创建的是**临时表**，默认是**持久表**

- `AUTO_INCREMENT`关键字可以为表中的**int**（整型）列设置**自增**属性。每个表只能有一个自增列，并且它必须被**索引**

- `DEFAULT`关键字可以给列设置**默认值**

- `NOT NULL`关键字表示列不允许为空值，默认为`NULL`，表示可以为空

- `PRIMARY KEY`关键字设置表的**主键**，主键必须唯一，必须是NOT NULL，如果有多个主键，则用都逗号隔开。

  ```sql
  PRIMARY KEY(id)
  PRIMARY KEY(id, id2)
  ```
  
  



#### 查看库所有表

```sql
SHOW [FULL] TABLE [FROM 库名称] [LIKE 'pattern'|WHERE expr];
```

#### 删除表

```sql
drop table 表名;
```

#### 查看表信息

```sql
SHOW [FULL] COLUMNS {FROM|IN} 表名 [{FROM|IN} 数据库名] [LIKE 'pattern'|WHERE expr];

或者简写：
{DESCRIBE|desc} 表名称;
```

#### 重命名表

```sql
rename table 旧表名 to 新表名;

alter table 旧表名 rename [to] 新的表名;
```





#### 修改表字段（列）

##### 表中添加字段ADD

```sql
alter table 操作的表名 
add [column] 字段名称 字段类型 [NOT NULL] [default 默认内容][添加位置（after 后者字段）];
```

- 添加位置那里，`AFTER`则会添加到后者字段的后面，还可以使用`first`添加到表的第一列，否则则默认添加到**末尾**。




##### 修改字段名CHANGE

```sql
alter table 表名字 
change [column] 字段原名 字段新名 字段类型 [NOT NULL][DEFAULT],
change 字段原名2 字段新名2 字段类型2;
```

可以同时修改多个字段，只需要用逗号隔开



##### 修改默认值ALTER

```sql
alter table 表 ALTER [COLUMN] 字段名 SET DEFAULT 默认值;
```



##### 修改字段类型MODIFY

只能修改字段类型，通过`FIRST`和`AFTER`在表中的位置，不能修改字段名

```sql
alter table 表 modify [COLUMN] 字段名 字段类型 FIRST;
```



##### 删除字段

```sql
alter table 表名 drop [COLUMN] 字段名;
```







------

### 数据更新

#### 插入数据INSERT

- `IDENTITY`属性的，系统会自动生成序列号值来唯一标识
- `DEFAULT`默认属性，可以填**DEFAULT**来设置为默认值
- `AUTO_INCREMENT`自增属性的，在insert语句中最后只会引用0，所以可以直接填**0**

```sql
insert [into] 表(列1,列2) {values|value} ('内容','内容');
例子：
insert into user_1(id,name) values(1,'admin');

如果插入所有数据，可以不指定插入的字段名：但是带有字段名更加安全。
insert into user_1 values(0,'admin',1,DEFAULT);
```

插入部分列值数据：

```sql
INSERT 表 SET 列="内容";
```

插入子查询数据

```sql
INSERT 表 select ...
```



#### 修改数据UPDATE

```SQL
update 表 set 列名1='内容', 行名2='内容' [where 条件][order by...][limit...];
例子：
update user_1 set name='user' where id=1;
```



#### 删除数据DELETE

delete删除的是表内的数据，不是关于表的定义

```SQL
delete from 表 [where 条件][order by...][limit...];
例子：
delete from user_1 where id=0010;

清空表：
delete from user_1;
```







------

### 数据查询SELECT

#### 关系运算

传统集合运算：

1. 并union（∪）
2. 差difference（-）
3. 交intersection（∩）
4. 笛卡尔积Cartesian product（×）

专门关系运算符：

字段=关系名

1. **选择select**

$$
σ_{条件}(表)
$$

2. **投影projection**

$$
π_{字段}(表)
$$

3. **连接join**

$$
R>_{iθj}<S=σ_{iθj}(R×S)
$$

- R、S代表两个字段
- i、j代表两个字段第i列和第j列的属性
- θ代表运算符
- ×笛卡尔积

4. **除division**

$$
R÷S
$$

---



select可以进行各种运算，例如执行下面的语句：

```sql
select 1+1;
```

会返回数值**2**





必须按照下面的顺序：

```sql
SELECT [ALL|distinct|distinctrow] 字段名 FROM 表名
[WHERE 条件]
[group by ]
[having]
[order by]
[limint]
```

- `distinct`和`distinctrow`是同义词，用于消除查询结果集中的**重复**的数据，没有指定这些选项则默认为`ALL`



#### 所有数据

使用`*`通配符

```sql
select * from 表名;
```

#### 投影

显示**部分**数据

```sql
select 字段名 from 表名;
例子：
select id, name from user_1;
```

#### 别名

在打出e.后会自动出现后面的英文字段名，方便。

```sql
select 别名.字段 [AS] 列别名, 别名.字段 [AS] 列别名 from 表 别名;
例子：
select e.sex, e.name from vipUser e;
select e.sex as'性别', e.name '名字' from user_1 e;
```

数据别名

```sql
select e.sex 
case when e.sex='0' then '女'
else '男'
end [as] '性别' from user_1 e;
```

连接显示：

```sql
select concat("内容1:", 字段, "内容2:", 字段) as '别名' from 表;
例子：
select concat("内容1:", name, "内容2:", job) as '工作信息' from user_1;

则显示：
内容1:name内容2:job
```

#### 限定查询WHERE

##### 比较运算

| 比较运算符 |      说明       |
| :--------: | :-------------: |
|     =      |      等于       |
|   <>、!=   |     不等于      |
|     <      |      小于       |
|     <=     |    小于等于     |
|     >      |      大于       |
|     >=     |    大于等于     |
|    <=>     | 不会返回unknown |

```sql
select * from 表 where 条件;

select * from emp where sal>=2000 and sal<=8000;
select * from emp where sal <> '2000';				-- 这里<>是!=的意思
```

1. between...and...

仅限于数值、日期、时间

```sql
SELECT * FROM emp WHERE sal BETWEEN 2000 AND 8000;
```

2. IN

```SQL
select * from emp where sal in(2000,8000);
select * from emp where sal=2000 or sal=8000;
```
3. NULL

```SQL
select * from emp where sal not in(2000);			-- 不是2000的其他数据
select * from emp where comm is not null;			-- comm不是空
select * from emp where comm is null;				-- comm是空
```

##### 模糊查询

```sql
select * from 表 where 字段 like 'm%';					-- 以 s 开头的
select * from emp where job like '_m%';				  -- 第二的字母是m
select * from emp where job like '%m%';				  -- 包含 m 的
select * from emp where job not like 'm%';			  -- 不是m开头的
```

##### 子查询

子查询就是指在一个完整的查询语句中，嵌套若干个不同功能的小查询，从而完成一个复杂的查询。把一个查询的结果当成另一个查询的条件。

#### 分组查询GROUP BY

将结果集的数据行根据选择列的值进行逻辑分组，汇总表内容的子集，即实现对每个组的的聚合计算。

```SQL
SELECT 1,2 count<*> as '总数' FROM 表 group by {col_name|expr|position} [ASC|DESC], ...[WITH ROLLUP];
例子：
SELECT 1,2 count<id> as '总数' FROM 表 group by 1,2;
```

- `ASC`表示**升序**分组，默认是升序
- `DESC`表示**降序**分组
- `with rollup`指定在结果集中不仅包含分组后的数据行，还包含汇总行，以及所有分组的整体汇总行

#### 过滤分组HAVING

```sql
SELECT 1,2 FROM 表 GROUP BY 1,2 HAVING 条件;
```

#### 排序ORDER BY

```SQL
select * from 表 order by 字段;							-- 由小到大排序
select * from 表 order by 字段 desc;						-- 由大到小排序
例子：
SELECT * FROM 表 ORDER BY 字段1 EDSC, 字段2 DESC;
```

#### 分页LIMIT

当select返回的结果集中行数有很多时，使用`limit`来限制用户对结果数据的浏览和操纵

- `offset`偏移量：从第几行开始显示（从0开始） 

数量：显示几行

```sql
LIMIT {[offset,]行数|行数 OFFSET 从第几行-1}

SELECT * 1,2 FROM 表 ORDER BY 1 LIMIT 4,3;				-- 从第5行开始输出3行
SELECT * 1,2 FROM 表 ORDER BY 1 LIMIT 3 OFFSET 4;
```

#### 多表查询

##### 交叉连接

会产生**笛卡尔积**效应：

如果表1有100条数据，表2有100条数据，那么结果集就有100*100=10000条

```sql
select * from 表1,表2;
select * from 表1 cross join 表2;
```

##### 内连接

添加表与表之间的**关联条件**，消除笛卡尔积效应：

```sql
select * from 表1 e, 表2 d where e.字段1 = d.字段1;
SELECT * FROM table1 e inner join table2 d on e.字段 = d.字段;
```

内连接是系统默认的表连接，所以在from字句中可以省略`inner`只用`join`就可以

1. 等值连接

在`ON`字句中的连接条件使用运算符`=`

2. 非等值连接（不等连接）

在`ON`字句中的连接条件使用运算符`=`之外的比较运算符

3. 自链接

```sql
select e.1, e.2, e.3, m.1, m.2 from 表1 e, 表1 m where e.3 = m.2;
```

##### 外连接

连接的两张表分为基表、参考表

1. 左链接

以左边的数据为主（基表），右边数据（参考表）的如果匹配到了就显示，没有匹配到就用空值代替

```sql
select e.1, e.2, d.1, d.2 from emp1 e left [OUTER] join emp2 d on e.3 = d.3;
```

2. 右链接

以右面的数据为主（基表）

```sql
select e.1, e.2, d.1, d.2 from emp1 e right [OUTER] join emp2 d on e.3 = d.3;
```

#### 结果集合并

```sql
select * from 表;
union							-- 两个查询显示在一个结果里面,重复不显示
select * from 表;
```

```sql
select * from dept;
union ALL						-- 返回查询结果的全部内容,重复数据也会显示
select * from dept;
```

#### 计算列值-函数

```sql
select id+1000 FROM user_1;
```


| 函数名称   | 描述                          | 函数类型 |
| ------------- | ------------------------- | -------- |
| COUNT(*列)    | 求出全部的记录数（项数），返回int类型的整数 | 统计函数 |
| SUM(列)       | 求出总和（表达式中所有值的和）      | 列=字段  |
| AVG(列)       | 平均值                    |          |
| MAX(列)       | 最大值                     |          |
| MIN(列)        | 最小值                    |          |
| STD或stddev | 返回给定表达式中的所有值的**标准值** | |
| variance | 返回给定表达式中的所有值的**方差** | |
| group_concat | 返回由属于一组的列值连接而成的结果 | |
| BIT_AND | 逻辑或 | |
| BIT_OR | 逻辑与 | |
| BIT_XOR | 逻辑异或 | |
| ADDDATE(日期，数字)  | 制定的日期加上指定的天数，求出新的日期  | 日期函数 |
| LAST_DAY(日期)   | 求出指定日期的最后一天      |          |
| now()         | 获取当前时间                |          |
| ROUND(数字，保留位数)   | 对小数进行四舍五入，可以指定保留的位数，如果不指定则表示将小数点之后的数字全部进行四舍五入如 | 数值函数 |
| MOD(数字，数字)    | 取模                   |          |
| UPPER(列，字符串)   | 将字符串的内容全部转为大写  | 字符函数 |
| LOWER(列，字符串)     | 将字符串的内容全部转为小写     |          |
| LENGTH(列，字符串)     | 求出字符串的长度        |          |
| SUBSTR(列，字符串，起始索引,长度) | 截取字符串     |          |
| REPLACE(列，字符串)  | 字符串替换              |          |
| TRIM(列，字符串)     | 去掉左右空格             |          |
| INSTR(列，字符串,要查找的字符串)  | 查找字符串中某个字符的索引，如果匹配到就返回索引，匹配不到就返回0 |          |

例如获取当前系统的时间：

```sql
select now() '时间' from 表 where empno=7369;
```







---

### 约束

三种：

1. 实体完整性约束
2. 参照完整性约束
3. 用户定义完整性约束



主键

```sql
create table user_1(
    id int primary key auto_increment,     	-- primary key主键约束，表示一个唯一的标识，auto_increment表示数据自增
    name varchar(20) not null,				-- 非空约束，此字段的内容不允许为null
    email varchar(50) unique, 				-- 唯一约束，此列的内容不允许出现重复
    sex char(4),
    phone varchar(20)
);
```

有`auto_increment`的数据不输入也会自增填入数据,必须是int类型,只能有一个和`primary key`搭配

复合主键，在最后加上主键的定义

```sql
primary key(id1, id2)
```

外键

```sql
foreign key (这个表里的字段名) references 关联表 (关联表的字段) [on delete restrict|cascade|set null|no action]
```

- `on delete restrict`因为子表中有引用，则父表不能删除
- `on update cascade`更新后，级联更新
- `on update set null`若父表更新，则子表内容变为空
- `on delete no action`不允许有动作，与RESTRICT同义

```sql
create table worker(
	id  int primary key auto_increment,
	name varchar(30),
	user_id int references work_1,
);

或者：
foreign key (user_id) references work_1 (id) -- 外键约束，我们实际上使用的是上面一行（实际开发用的少）
```

命名约束
```sql
constraint 约束名字 foreign key (这个表里的字段名) references 关联表 (关联表的字段)
```

删加

```sql
alter table 表 add constraint 约束名 (字段名)			-- 添加约束
alter table 表 add constraint unique (phone)			-- 给phone添加唯一约束

alter table 表 drop index 字段						   -- 删除唯一约束
```

MySQL中约束:	

| 语言        | 名称           | 描述                                                     |
| ----------- | -------------- | -------------------------------------------------------- |
| not null    | 非空约束(nk)   | 如果使用非空约束,在此字段的内容不允许为null              |
| unique      | 唯一约束(uk)   | 此列的内容不允许出现重复                                 |
| primary key | 主键约束(pk)   | 表示一个唯一的标识,一般都是自动递增,不能为空             |
|             | 主外键约束(fk) | 是在两种表上建立关联约束，加入关联约束后两张表就产生关系 |





---

### 视图

随着数据变化的虚拟表：视图是存储在数据字典里的一条select语句

视图的**优点**： 

1. **集中分散数据**：可以**有选择性**的选取数据库里的部分
2. **简化查询语句**：可以把复杂的查询变的简单
3. **重用SQL语句**：视图不包含数据，可以便捷的重复使用
4. **保护数据安全**：只授予用户使用视图的**权限** 
5. **共享所需数据**：数据具有独立性（存一次），试图可从多个表检索数据
6. **更改数据格式**：可以重新格式化检索出的数据，输出到其他应用程序之中



**创建**

```sql
CREATE VIEW 视图名称 AS 子查询 [with check option]
CREATE VIEW 视图名称 AS 子查询 with [cascaded|local] check option
```

- 加上`with check option`可以后续对视图数据进行修改
- `CASCADED`为默认选型，他会对所有的视图进行检查
- `LOCAL`则使CHECK OPTION 只对定义的视图进行检查

**修改**

```sql
create or replace view 视图名称 as 查询语句 [with check option];
或者
alter view 视图名称  as 查询语句 [with check option];
```

**查看定义**

```sql
show create view 视图名字;
或者
desc 试图名字;
```

**查看**

```sql
SELECT * FROM VIEW 视图名称;
```

**数据更新**

插入INSERT

修改UPDATE

删除DELETE

**删除**

```sql
drop view [if exists] 视图名;
```

- `IF EXISTS`可以防止因为删除不存在的视图时而出现的问题



### 索引

给字段添加索引是为了提高查询效率，但不是所有的字段都可以添加索引，创建索引有以下特点
创建建索引列的特点：

1. 在经常需要搜索的列上，可以加快搜索的速度
2.  在作为主键的列上，强制该列的唯一性和组织表中数据的排列结构
3. 在经常用在连接的列上，这些列主要是一些外键，可以加快连接的速度； 
4. 在经常需要排序的列上创建索引，因为索引已经排序，这样查询可以利用索引的排序，加快排序查询时间

```sql
alter table 表名 add index 索引名(该表中的某字段);		添加索引
alter table emp add index sal_index(sal);

alter table 表名 drop index 索引名;					删除索引
alter table emp drop index sal_index;
```



### 触发器

每个表的一个时刻下每一个事件仅有一个触发器

```sql
CREATE TRIGGER trigger_name 
trigger_time 
trigger_event ON tbl_name
FOR EACH ROW
trigger_stmt  
```

trigger_name：标识触发器名称，用户自行指定
trigger_time：标识触发时机，取值为**BEFORE**或**AFTER**
trigger_event：标识触发事件，取值为INSERT、UPDATE 或 DELETE
tbl_name：标识建立触发器的表名，即在哪张表上建立触发器
trigger_stmt：触发器程序体，可以是一句SQL语句，或者用 BEGIN 和 END 包含的多条语句。



列：创建两种表t1,t2两种表中都有id,name字段，新加t1表记录后自动添加t2

```sql
CREATE TRIGGER triggen_1
after
insert ON t1
FOR EACH ROW
insert into t2(name) values(new.name);
```

- NEW是新值，OLD是旧值
  INSERT只有NEW
  UPDATE有NEW和OLD
  DELETE只有OLD

注意：一般情况下，Mysql默认是以;号作为结束执行语句。在创建触发器过程中需要用到;号。为了解决这个问题，可以用到delimiter语句。例如`delimiter //`，可以将结束符号变成//，创建完触发器后再执行`delimiter ;`将结束符号改回成`;`号。

查看

```sql
show TRIGGERS
```

删除

```sql
DROP TRIGGER 触发器的名字
```





### 备份与恢复

导出一整个数据库：

```cmd
C:\WINDOWS\system32> mysqldump -u 用户名 -p 数据库名 > 导出的文件名
C:\WINDOWS\system32> mysqldump -u root -p user > c:\java\demo.sql
```

导出一张表：

```cmd
C:\WINDOWS\system32> mysqldump -u 用户名 -p 数据库名 表名称 > 导出的文件名
C:\WINDOWS\system32> mysqldump -u root -p user user_1 > c:\java\demo.sql
```

恢复：
数据的回复必须要先登录,登录成功后新建一个数据库,进入到指定的数据库中执行如下命令

```cmd
mysql> Source 脚本目录(给决定路径)
mysql> Source C:\java\demo.sql
```





### Linux防火墙修改

```shell
vim /usr/lib/firewalld/services/ssh.xml
 <port protocol="tcp" port="3306"/>
systemctl restart firewalld
```





### 其他机器连接本地的MySQL

```shell
mysql> GRANT ALL PRIVILEGES ON *.* TO root@"%" IDENTIFIED BY "root" with grant option;
```

`.`就是所有





### Linux禁止更新（推荐设置）

我们在安装之后，为了能够正常运行，我们会禁止MySQL进行更新。因为在yum更新了MySQL之后，MySQL会自动重启，这对于我们上线部署项目来说是没有必要的，所以我们可以屏蔽更新。

vim /etc/yum.conf
exclude=mysql-community-client,mysql-community-common,mysql-community-libs,mysql-community-server

