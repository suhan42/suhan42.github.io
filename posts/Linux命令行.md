# shell

shell是运行在终端中的文本互动程序，bash（GNU Bourne-Again Shell）是最常用的一种shell。是当前大多数Linux发行版的默认Shell。

其他的shell还有：sh、bash、ksh、rsh、csh等。Ubuntu系统常用的是bash

而bash的全名是Bourne Again Shell。最开始在Unix系统中流行的是sh，而bash作为sh的改进版本，提供了更加丰富的功能。一般来说，都推荐使用bash作为默认的Shell。



### 基本操作

查询ip(win) 找VM虚拟网卡

```shell
ipconfig
```

查询ip(Linux)

```shell
ifconfig
```

ens33的inet后面是IP地址

桥接模式：虚拟机和win内网公用一个网络、局域网
NAT:虚拟机和win主机公用一个网络、使用虚拟网卡
仅主机：和桥接类似，虚拟机无法上网

```shell
ping www.x.com
```

查看x的源码

```shell
curl http://www.x.com
```

| 命令            | 解释                                    |
| :-------------- | --------------------------------------- |
| reboot / init 6 | 重启                                    |
| poweroff        | 关机                                    |
| clear           | 清空                                    |
| who             | 查看谁在线                              |
| passwd root     | 改密码                                  |
| pwd             | 返回当前路径（Print Working Directory） |



### sudo权限管理机制

sudo是一种权限管理机制，依赖于/etc/sudoers，其定义了授权给哪个用户可以以管理员的身份能够执行什么样的管理命令；

格式：`sudo -u USERNAME COMMAND`

默认情况下，系统只有root用户可以执行sudo命令。需要root用户通过使用visudo命令编辑sudo的配置文件/etc/sudoers，才可以授权其他普通用户执行sudo命令。

```bash
sudo su (root)  #切换root
```

**sudo的运行有这样一个流程：**

1).当用户运行sudo时，系统于/etc/sudoers文件里查找该用户是否有运行sudo的权限；

2).若用户具有可运行sudo的权限。那么让用户输入用户自己的password，注意这里输入的是用户自己的password。

3).假设password正确。变開始进行sudo后面的命令，root运行sudo是不须要输入password的，切换到的身份与运行者身份同样的时候。也不须要输入password。



### su切换账户

switch user

su是最简单的身份切换名，用su我们能够进行不论什么用户的切换，一般都是su – username，然后输入password就ok了，可是root用su切换到其它身份的时候是不须要输入password的。

格式为两种：

>  su -l USERNAME（-l为login，即登陆的简写）
>
> su USERNAME 



```shell
su suhan  #换成suhan
```



如果不指定USERNAME（用户名），默认即为root，所以切换到root的身份的命令即为：su -root或su -，su root 或su。

su USERNAME，与su – USERNAME的不同之处如下：

- su – USERNAME切换用户后，同时切换到新用户的工作环境中。
- su USERNAME切换用户后，不改变原用户的工作目录，及其他环境变量目录。

**设置初始su密码**

```bash
sudo passwd 用户名
```





### man(用户手册)

(Manual)

man pwd						就是获得pwd这个命令的命令手册
man -h 							help



### echo(回声)

```shell
echo hello world
```



### cd(换地方)

(Change Directory)

| 命令         | 解释           |
| ------------ | -------------- |
| cd /         | 进入系统根目录 |
| cd ..        | 向上一层       |
| cd ~/Desktop | 桌面           |



### ls(看)

(List Directory Contens)

| 命令              | 解释                                                       |
| ----------------- | ---------------------------------------------------------- |
| ls                | 查看当前文件夹目录全部文件                                 |
| ls -l             | 列表显示（list mode）                                      |
| ls -l -a = ls -la | 文件的各种信息和全部权限（list + all files）（包括隐藏的） |
| ls -lh            | (list + human readable size)                               |

CentOS还可以使用命令

| ll          | 查看全部文件 |
| ----------- | ------------ |
| lshw -short |              |



### cat(打印文件内容)

(Concatenate and print files)

```bash
cat [-AbeEnstTuv] [--help] [--version] fileName
```

参数说明：

- **-n 或 --number**：由 1 开始对所有输出的行数编号。
- **-b 或 --number-nonblank**：和 -n 相似，只不过对于空白行不编号。
- **-s 或 --squeeze-blank**：当遇到有连续两行以上的空白行，就代换为一行的空白行。
- **-v 或 --show-nonprinting**：使用 ^ 和 M- 符号，除了 LFD 和 TAB 之外。
- **-E 或 --show-ends** : 在每行结束处显示 $。
- **-T 或 --show-tabs**: 将 TAB 字符显示为 ^I。
- **-A, --show-all**：等价于 -vET。
- **-e：**等价于"-vE"选项；
- **-t：**等价于"-vT"选项；

| 命令         | 解释                  |
| ------------ | --------------------- |
| cat a.txt    | 打印a.txt文件全部内容 |
| cat -n a.txt | -n显示行号            |

#### head头和tail尾

| 命令            | 解释                                           |
| --------------- | ---------------------------------------------- |
| head a.txt      | 显示a.txt文件前10行                            |
| tail a.txt      | 倒着输出所有内容（还是全部）                   |
| tail -n 5 a.txt | -n行数（这里是打印最后5行）                    |
| tail -f a.txt   | -f会一直（动态）观察文件，一旦有变化会打印出来 |

交互浏览

```shell
vim a.txt
```

```shell
less a.txt
```

#### more查看大文件

space翻页，q退出

```shell
more a.txt
```

#### nl最后一行

| 命令         | 解释                                   |
| ------------ | -------------------------------------- |
| nl a.txt     | 从最后一行开始展示(显示行号)           |
| nl -ba a.txt | 全部都显示行号(包括空行)               |
| nl -bt a.txt | 空行不显示出行号(默认都有这个，默认值) |



#### grep(内容查找)

```shell
cat a.txt | grep 内容
```

#### wc(单词统计)

(Word, line and byte count)

```shell
cat a.txt | wc 			行数 单词 字节
cat a.txt | wc -l 		行数
```



### echo重定向

**改变输入输出设备**

将hello添加到hello.txt文件里面

```shell
echo hello > hello.txt
```

添加到下面一行

```shell
echo hello >> hello.txt
```

打印出来

```shell
cat < hello.txt
```



### grep管道

**将前一个命令的标准输出作为下一个程序的标准输出**

```shell
man less | grep sim
```





### chmod(更改文件权限)

(Change Mode)

| 命令               | 解释                            |
| ------------------ | ------------------------------- |
| chmod +x (文件名)  | 增加可执行权限（还可以换成+w +r |
| chmod -x (文件名)  | 移除可执行权限（还可以换成-w -r |
| chmod 740 (文件名) | 把权限设置成740                 |

owner：**7=1+2+4= 可执行x + 可写w + 可读r**
group：4=4= 可读
others：0 = 没有权限

常见：
644: -rw-r--r--
740: -rwxr-----
755: -rwxr-xr-x
777: -rwxrwxrwx



### touch/mkdir创建

```
touch [-acfm][-d<日期时间>][-r<参考文件或目录>] [-t<日期时间>][--help][--version][文件或目录…]
```

参数说明：

- a 改变档案的读取时间记录。
- m 改变档案的修改时间记录。
- c 假如目的档案不存在，不会建立新的档案。与 --no-create 的效果一样。
- f 不使用，是为了与其他 unix 系统的相容性而保留。
- r 使用参考档的时间记录，与 --file 的效果一样。
- d 设定时间与日期，可以使用各种不同的格式。
- t 设定档案的时间记录，格式与 date 指令相同。
- --no-create 不会建立新档案。
- --help 列出指令格式。
- --version 列出版本讯息。

**touch(创建文件)**

```shell
touch first.cpp
```

**mkdir(创建文件夹)**

mkdir [-p] dirName

- -p 确保目录名称存在，不存在的就建一个。

```shell
mkdir -p 文件夹/子文件夹
```



### mv移动

(Move)

```bash
mv [options] source dest
#or
mv [options] source... directory
```

参数说明：

- -a：此选项通常在复制目录时使用，它保留链接、文件属性，并复制目录下的所有内容。其作用等于dpR参数组合。
- -d：复制时保留链接。这里所说的链接相当于 Windows 系统中的快捷方式。
- -f：覆盖已经存在的目标文件而不给出提示。
- -i：与 **-f** 选项相反，在覆盖目标文件之前给出提示，要求用户确认是否覆盖，回答 **y** 时目标文件将被覆盖。
- -p：除复制文件的内容外，还把修改时间和访问权限也复制到新文件中。
- -r：若给出的源文件是一个目录文件，此时将复制该目录下所有的子目录和文件。
- -l：不复制文件，只是生成链接文件。

重命名

```shell
mv h.txt hello.txt
```

移动文件、文件夹（这里是文件夹）

```shell
mv 四六级 大学/英语/
```



### cp复制文件

(Copy)

```bash
cp [options] source dest
#or
cp [options] source... directory
```

参数说明：

- -a：此选项通常在复制目录时使用，它保留链接、文件属性，并复制目录下的所有内容。其作用等于dpR参数组合。
- -d：复制时保留链接。这里所说的链接相当于 Windows 系统中的快捷方式。
- -f：覆盖已经存在的目标文件而不给出提示。
- -i：与 **-f** 选项相反，在覆盖目标文件之前给出提示，要求用户确认是否覆盖，回答 **y** 时目标文件将被覆盖。
- -p：除复制文件的内容外，还把修改时间和访问权限也复制到新文件中。
- -r：若给出的源文件是一个目录文件，此时将复制该目录下所有的子目录和文件。
- -l：不复制文件，只是生成链接文件。

复制单个文件

```shell
cp a.txt a_copy.txt
```

复制文件夹

```shell
cp -r dir1 dir2
```



### rm删除文件

(Remove)

没有回收站！！！

```bash
rm [options] name...
```

- -i 删除前逐一询问确认。
- -f 即使原档案属性设为唯读，亦直接删除，无需逐一确认。
- -r 将目录及以下之档案亦逐一删除。
  - -rf 强制删除文件夹

| 命令                 | 解释                          |
| -------------------- | ----------------------------- |
| rm a.txt             | 删除单个文件                  |
| rm a.txt b.txt c.txt | 删除多个文件                  |
| rm ./*.txt           | 当前目录下的所有txt文件       |
| rm -r dir1           | 递归删除dir1和所有子文件/目录 |



### tar/zip压缩解压

tar [选项] 打包文件名 待打包文件

| 选项 | 解释              |
| ---- | ----------------- |
| -c   | 创建一个打包文件  |
| -x   | 解开一个打包文件  |
| -z   | 使用gzip压缩文件  |
| -j   | 使用bzip2压缩文件 |
| -v   | 压缩过程显示文件  |
| -f   | 使用文档名        |

压缩

```shell
tar -zcf demo.tar.gz a.txt b.txt c.txt
```

解压

```shell
tar -zxf demo.tar.gz
```

```shell
zip demo.zip a.txt b.txt 					#压缩
unzip demo.zip 								#解压缩
```



### tree树状图

Linux tree命令用于以树状图列出目录的内容。

执行tree指令，它会列出指定目录下的所有文件，包括子目录里的文件。

```bash
tree [-aACdDfFgilnNpqstux][-I <范本样式>][-P <范本样式>][目录...]
```

参数说明：

- -a 显示所有文件和目录。
- -A 使用ASNI绘图字符显示树状图而非以ASCII字符组合。
- -C 在文件和目录清单加上色彩，便于区分各种类型。
- -d 显示目录名称而非内容。
- -D 列出文件或目录的更改时间。
- -f 在每个文件或目录之前，显示完整的相对路径名称。
- -F 在执行文件，目录，Socket，符号连接，管道名称名称，各自加上"*","/","=","@","|"号。
- -g 列出文件或目录的所属群组名称，没有对应的名称时，则显示群组识别码。
- -i 不以阶梯状列出文件或目录名称。
- -L level 限制目录显示层级。
- -l 如遇到性质为符号连接的目录，直接列出该连接所指向的原始目录。
- -n 不在文件和目录清单加上色彩。
- -N 直接列出文件和目录名称，包括控制字符。
- -p 列出权限标示。
- -P<范本样式> 只显示符合范本样式的文件或目录名称。
- -q 用"?"号取代控制字符，列出文件和目录名称。
- -s 列出文件或目录大小。
- -t 用文件和目录的更改时间排序。
- -u 列出文件或目录的拥有者名称，没有对应的名称时，则显示用户识别码。
- -x 将范围局限在现行的文件系统中，若指定目录下的某些子目录，其存放于另一个文件系统上，则将该子目录予以排除在寻找范围外。



### date显示或设定系统的日期与时间

```bash
date [OPTION]... [+FORMAT]
date [-u] [-d datestr] [-s datestr] [--utc] [--universal] [--date=datestr] [--set=datestr] [--help] [--version] [+FORMAT] [MMDDhhmm[[CC]YY][.ss]]
```

参数：

- **-d, --date=STRING**：通过字符串显示时间格式，字符串不能是'now'。
- **-f, --file=DATEFILE**：类似于--date; 一次从DATEFILE处理一行。
- **-I[FMT], --iso-8601[=FMT]**：按照 ISO 8601 格式输出时间，FMT 可以为'date'(默认)，'hours'，'minutes'，'seconds'，'ns'。 可用于设置日期和时间的精度，例如：2006-08-14T02:34:56-0600。
- **-R, --rfc-2822** ： 按照 RFC 5322 格式输出时间和日期，例如: Mon, 14 Aug 2006 02:34:56 -0600。
- **--rfc-3339=FMT**：按照 RFC 3339 格式输出，FMT 可以为'date', 'seconds','ns'中的一个，可用于设置日期和时间的精度， 例如：2006-08-14 02:34:56-06:00。
- **-r, --reference=FILE**：显示文件的上次修改时间。
- **-s, --set=STRING**：根据字符串设置系统时间。
- **-u, --utc, --universal**：显示或设置协调世界时(UTC)。
- **--help**：显示帮助信息。
- **--version**：输出版本信息。

FORMAT 参数：

在显示方面，使用者可以设定欲显示的格式 ，格式设定为一个加号后接数个标记，其中可用的标记列表如下：

%%   输出字符 %
%a   星期几的缩写 (Sun..Sat)
%A   星期的完整名称(Sunday..Saturday)。 
%b   缩写的月份名称（例如，Jan）
%B   完整的月份名称（例如，January）
%c   本地日期和时间（例如，Thu Mar  3 23:05:25 2005）
%C   世纪，和%Y类似，但是省略后两位（例如，20）
%d   日 (01..31)
%D   日期，等价于%m/%d/%y
%e   一月中的一天，格式使用空格填充，等价于%_d
%F   完整的日期；等价于 %Y-%m-%d
%g   ISO 标准计数周的年份的最后两位数字
%G   ISO 标准计数周的年份，通常只对%V有用
%h   等价于 %b
%H   小时 (00..23)
%I   小时 (01..12)
%j   一年中的第几天 (001..366)
%k   小时，使用空格填充 ( 0..23); 等价于 %_H
%l   小时, 使用空格填充 ( 1..12); 等价于 %_I
%m   月份 (01..12)
%M   分钟 (00..59)
%n   新的一行，换行符
%N   纳秒 (000000000..999999999)
%p   用于表示当地的AM或PM，如果未知则为空白
%P   类似 %p, 但是是小写的
%r   本地的 12 小时制时间(例如 11:11:04 PM)
%R   24 小时制 的小时与分钟; 等价于 %H:%M
%s   自 1970-01-01 00:00:00 UTC 到现在的秒数
%S   秒 (00..60)
%t   插入水平制表符 tab
%T   时间; 等价于 %H:%M:%S
%u   一周中的一天 (1..7); 1 表示星期一
%U   一年中的第几周，周日作为一周的起始 (00..53)
%V   ISO 标准计数周，该方法将周一作为一周的起始 (01..53)
%w   一周中的一天（0..6），0代表星期天
%W   一年中的第几周，周一作为一周的起始（00..53）
%x   本地的日期格式（例如，12/31/99）
%X   本地的日期格式（例如，23:13:48）
%y   年份后两位数字 (00..99)
%Y   年
%z   +hhmm 格式的数值化时区格式（例如，-0400）
%:z  +hh:mm 格式的数值化时区格式（例如，-04:00）
%::z  +hh:mm:ss格式的数值化时区格式（例如，-04:00:00）
%:::z  数值化时区格式，相比上一个格式增加':'以显示必要的精度（例如，-04，+05:30）
%Z  时区缩写 （如 EDT）

显示当前时间

```bash
# date
Tue May 24 09:29:43 CST 2022
# date '+%c' 
Tue 24 May 2022 09:30:03 AM CST
# date '+%D' //显示完整的时间
05/24/22
# date '+%x' //显示数字日期
05/24/2022
# date '+%T' //显示日期，年份用四位数表示
14:09:31
# date '+%X' //显示24小时的格式
09:31:31 AM
```

格式化输出：

```bash
# date +"%Y-%m-%d"
2009-12-07
```

输出昨天日期：

```bash
# date -d "1 day ago" +"%Y-%m-%d"
2012-11-19
```

输出 2 秒后的时间：

```bash
# date -d "2 second" +"%Y-%m-%d %H:%M.%S"
2012-11-20 14:21.31
```



### 查看进程

例如：

```shell
ps -ef|grep ssh
ps -ef|grep tomcat
```

pid查看
netstat -naop|grep pid

例如：

```shell
netstat -naop|grep 8080
```

查看特定用户

```bash
ps -u root  #显示root进程用户信息
```



停止进程(-9表示强制停止)

```shell
kill -9 pid
```



### watch观察

linux系统里有一些日志文件。观察这些日志文件是系统管理员的一个重要任务。你可以很方便地[使用tail命令](http://tuxtweaks.com/2011/02/command-line-basics-head-and-tail/)观察它们。但是如果你想要长时间监视这些文件，每几分钟使用tail检查那些日志文件是一件很乏味的事情。你可以写一个短小的[无限循环的脚本](http://tuxtweaks.com/2012/01/creating-a-terminal-window-clock/)来周期性地检查文件，但其实已经有一个程序可以为你处理这种重复的任务。

Linux中的watch 命令提供了一种方式处理重复的任务。默认watch会每**2**秒重复执行命令。你一定也想到了,watch是一个很好的观察log文件的工具。下面是一个例子。

```bash
watch tail /var/log/syslog
```

想要停止命令的执行,只要使用标准的kill流程, [Ctrl]+C。

```
watch [options] command
```

参数：

-   -b, --beep             如果命令以非零返回值退出的话则发出哔声

-   -c, --color              interpret ANSI color and style sequences

-   -d, --differences   highlight changes between updates

  选项watch 会高亮显示变化的区域。
  而-d=cumulative选项会把变动过的地方(不管最近的那次有没有变动)都高亮显示出来

-   -e, --errexit           exit if command has a non-zero exit

-   -g, --chgexit           exit when output from command changes

-   -n, --interval 秒       seconds to wait between updates

-   -p, --precise          尝试以精确的间隔运行命令

-   -t, --no-title         会关闭watch命令在顶部的时间间隔,命令，当前时间的输出

-   -w, --no-wrap          turn off line wrapping

-   -x, --exec             将命令传给 exec 而非“sh -c”

-  -h, --help     显示此帮助然后离开

-  -v, --version  output version information and exit

watch并不仅限于浏览日志文件。它可以用来重复你给它的任何命令。如果你要[监测CPU的温度](http://tuxtweaks.com/2008/08/how-to-control-fan-speeds-in-ubuntu/),你可以使用watch后跟上**sensord**命令来查看。

```
watch -n 1 sensors
```

e.g.：

```bash
watch -n {运行时间间隔} -d "{运行的指令}"


watch -n 1 netstat -ant       # 命令：每隔一秒高亮显示网络链接数的变化情况
watch -n 1 -d 'pstree|grep http' # 每隔一秒高亮显示http链接数的变化情况。 
				后面接的命令若带有管道符，需要加''将命令区域归整。
				
watch 'netstat -an | grep:21 | \ grep<模拟攻击客户机的IP>| wc -l' # 实时查看模拟攻击客户机建立起来的连接数
watch -d 'ls -l|grep scf'       # 监测当前目录中 scf' 的文件的变化
watch -n 10 'cat /proc/loadavg' # 10秒一次输出系统的平均负载
watch -d 'ls -l | fgrep goface'     # 监测goface的文件
watch -t -differences=cumulative uptime
```







### 防火墙

systemctl status firewalld 				查看防火墙
systemctl start firewalld					开始防火墙
systemctl stop firewalld					关闭防火墙
systemctl restart firewalld				重启防火墙

白名单

```shell
vim /usr/lib/firewalld/services/ssh.xml
```



```xml
  <port protocol="tcp" port="8080"/>
```

systemctl restart firewalld 		重启防火墙









### 这里是搜索 MySQL

find命令查询，速度会慢点
find / -name mysql

whereis命令搜索，速度较快
whereis mysql













### 用户

Linux用户分类
超级用户   root  uid = 0
普通用户         uid = 500~60000
伪用户           udi = 1~499

伪用户不能登录系统，也不会在home下创建相应的文件夹，主要是执行一些系统命令

用户组(便于分配权限)
用户组 可以包含多个 用户
一用户 至少属于一个 用户组

#### group组

```bash
groupadd 组名						#创建用户组
groupmod -n 新组名 旧组名			 #修改用户组名
groupdel 组名						#删除用户组
groups							#查询用户所在的组
```

修改用户所属组

#### user用户

```bash
useradd 用户名					#添加一般用户
useradd -g 用户组 用户名		#添加用户到组
useradd -m aaa				#创建用户名为aaa的用户,添加到home
useradd caojh -u 544		#建立用户且制定ID

usermod -a -G 用户组 用户名

userdel
```

**参数说明**：

- -c<备注> 　加上备注文字。备注文字会保存在passwd的备注栏位中。
- -d<登入目录> 　指定用户登入时的起始目录。
- -D 　变更预设值．
- -e<有效期限> 　指定帐号的有效期限。
- -f<缓冲天数> 　指定在密码过期后多少天即关闭该帐号。
- -g<群组> 　指定用户所属的群组。
- -G<群组> 　指定用户所属的附加群组。
- -m 　在home目录下自动建立用户的登入目录。
- -M 　不要自动建立用户的登入目录。
- -n 　取消建立以用户名称为名的群组．
- -r 　建立系统帐号。
- -s<shell>　 　指定用户登入后所使用的shell。
- -u<uid> 　指定用户ID。

- -a|--append，把用户追加到某些组中，仅与-G选项一起使用
- -G|--groups，把用户追加到某些组中，仅与-a选项一起使用

**创建一个用户步骤**

1. useradd -m aaa

2. sudo passwd aaa

3. sudo vi /etc/sudoers设置给予的权限

   找到user privilege这一行
   通过按i写入如上命令 给aaa分配所有权限

4. 设置命令解释器
   sudo vi /etc/passwd
   将文件拉倒最后修改解释器类型

权限设置
先给root添加sudoers文件的读写权限

```
chmod 777 /etc/sudoers
```

编辑sudoers文件

```
vi /etc/sudoers
```

找到如下一行代码

```
root ALL=(ALL) ALL
```

在下面添加

```
tony ALL=(ALL) ALL
```

共有四种格式的权限

```bash
tony ALL=(ALL) ALL
%tony ALL=(ALL) ALL
tony ALL=(ALL) NOPASSWD: ALL
%tony ALL=(ALL) NOPASSWD: ALL
第一行:允许用户tony执行sudo命令(需要输入密码)
第二行:允许用户组tony里面的用户执行sudo命令(需要输入密码)
第三行:允许用户tony执行sudo命令,并且在执行的时候不输入密码
第四行:允许用户组tony里面的用户执行sudo命令,并且在执行的时候不输入密码
```


编辑完成 按 ESC+:wq！保存退出

最后将root的sudoers文件权限改回来

```bash
chmod 0440 /etc/sudoers 
```

如果该用户账号只显示$

则在root下修改 /etc/passwd

sudo vim /etc/passwd

```
username:X:1000:1000::/home/wr:/bin/sh(这是之前的)

改为了username:X:1000:1000::/home/wr:/bin/bash
```

在该账户名下路径最后的/sh改为/bash



用户相关配置信息

/etc/passwd 			用户信息文件
/etc/shadow 			保存密码信息
/etc/group 				用户组信息
/etc/gshadow 			用户组密码信息



### 查看用户

查看当前用户名称

```bash
whoami
```

Linux 中，使用 w 或 who 命令都可以查看服务器上目前已登录的用户信息，两者的区别在于，w 命令除了能知道目前已登陆的用户信息，还可以知道每个用户执行任务的情况。

```bash
w
who
```



## Linux系统版本信息

几种查看Linux版本信息的方法：

1. uname -a
2. cat /proc/version
3. cat /etc/issue
4. lsb_release -a

详解 lsb_release -a

登录到服务器执行 lsb_release -a ，即可列出所有版本信息，例如：

```bash
[root@3.5.5Biz-46 ~]# lsb_release -a

LSB Version: 1.3

Distributor ID: RedHatEnterpriseAS

Description: Red Hat Enterprise Linux AS release 4 (Nahant Update 1)

Release: 4

Codename: NahantUpdate1

[root@3.5.5Biz-46 ~]#
这个命令适用于所有的linux，包括Redhat、SuSE、Debian等发行版。
```



####  查看redhat的release版本

dhat的release版本#more /etc/redhat-release
Red Hat Enterprise Linux AS release 4 (Nahant Update 4)

\#more /etc/issue
\# more /proc/version

查看CPU信息
\#grep "model name" /proc/cpuinfo
\#more /proc/cpuinfo

查看CPU位数(32 or 64)
\#getconf LONG_BIT

查看内存信息
\#more /proc/meminfo
\#grep MemTotal /proc/meminfo

查看libc、gcc版本
\#ldd /sbin/mii-tool
\#rpm -qa | grep glibc
\#gcc –v

#### 查看Ubuntu版本

方法一

在终端中执行下列指令：
cat /etc/issue
可以查看当前正在运行的 Ubuntu 的版本号。其输出结果类似下面的内容：
Ubuntu 7.04 \n \l

方法二

使用 lsb_release 命令也可以查看 Ubuntu 的版本号，与方法一相比，内容更为详细。执行指令如下：
sudo lsb_release -a

将输出结果：
Distributor ID: Ubuntu
Description: Ubuntu 7.04
Release: 7.04
Codename: feisty

查看freebsd版本
uname -a
