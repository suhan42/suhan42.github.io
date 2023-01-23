## 什么是Git

Git是分布式版本控制系统，那么它就没有中央服务器的，每个人的电脑就是一个完整的版本库，这样，工作的时候就不需要联网了，因为版本都是在自己的电脑上。既然每个人的电脑都有一个完整的版本库，那多个人如何协作呢？比如说自己在电脑上改了文件A，其他人也在电脑上改了文件A，这时，你们两之间只需把各自的修改推送给对方，就可以互相看到对方的修改了。



## 工作原理

![work](..\images\git\work.png)

![git1](..\images\git\git1.jpg)



## 常用操作



| 命令             | 说明                                     |
| ---------------- | ---------------------------------------- |
| git init         | 初始化仓库                               |
| git clone        | 拷贝一份远程仓库，也就是下载一个项目。   |
|                  |                                          |
| git add          | 添加文件到暂存区                         |
| git status       | 查看仓库当前的状态，显示有变更的文件。   |
| git diff         | 比较文件的不同，即暂存区和工作区的差异。 |
| git commit       | 提交暂存区到本地仓库。                   |
| git reset        | 回退版本。                               |
| git rm           | 删除工作区文件。                         |
| git mv           | 移动或重命名工作区文件。                 |
|                  |                                          |
| git log          | 查看历史提交记录                         |
| git blame <file> | 以列表形式查看指定文件的历史修改记录     |
|                  |                                          |
| git remote       | 远程仓库操作                             |
| git fetch        | 从远程获取代码库                         |
| git pull         | 下载远程代码并合并                       |
| git push         | 上传远程代码并合并                       |



## Git使用

### 登录

打开`git bash`之后，输入：

```shell
git config --global user.email "你的邮箱"
git config --global user.name "你的名字"
```

（注意`"`前面是有空格的，没有提示信息表示成功）
输入完后再接着执行

![user](..\images\git\user.png)

注意`git config --globa`l参数，有了这个参数，表示你这台机器上所有的Git仓库都会使用这个配置，当然你也可以对某个仓库指定的不同的用户名和邮箱，根据个人情况设置。

```shell
git config --global user.name
```

设置仓库局部用户名和邮箱

```bash
#one 仓库
git config user.name "one_name";
git config user.email "one_email"
#two 仓库
git config user.name "two_name";
git config user.email "two_email"
```

查看信息

```bash
git config -l  #查看所有配置
git config --system --list #查看系统配置
git config --global --list #查看用户（全局）配置
```

即可成功!



### 远程仓库

先注册github账号，由于你的本地Git仓库和github仓库之间的传输是通过SSH加密的，所以需要一点设置：

1. 创建SSH Key。在用户主目录下，看看有没有`.ssh`目录，如果有，再看看这个目录下有没有`id_rsa`和`id_rsa.pub`这两个文件。
   1. 如果有的话，直接跳过此如下命令。
   2. 如果没有的话，打开cmd命令行，输入如下命令：

```shell
ssh-keygen -t rsa -C "youremail@example.com"
```

![sshGet](..\images/git\ssh.png)

```shell
Enter file in which to save the key (C:\Users\cenha/.ssh/id_rsa): #设置密钥的文件名，不设置默认下面的名字

Enter passphrase (empty for no passphrase): #设置密钥的密码，直接回车为不设置

Enter same passphrase again: #再输入一遍密码，未设置密码直接回车
```

这两步演示的时候是直接按的回车，
而如果这里是空的话，确实之后就不需要输入密码了。
passphrase这个并非是gitlab的密码，而是git的安全口令
我觉得这个口令更多的是为了保证每次使用git的时候更安全，所以自然就需要每次输入
那么如果你使用的时候不想输入passphrase的话，则不需要设置安全口令。



（你自己的邮箱地址，推荐和注册github的邮箱保持一致）, 我本地已经有了这些文件，如下所示：

![](..\images\git\sshId.png)

`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉任何人。



2. 登录Gitee，右上角：设置→SSH公钥，输入你的标题和公钥，点击确定。

   （登录github，右上角：设置→settings→SSH and GPR keys→New SSH key，然后输入title，输入上面的公钥id_rsa.pub，然后点击保存。点击 Add Key，你就应该可以看到已经添加的key。）



3. 在git bash中测试ssh（github需要这一步，gitee不需要）

```bash
ssh -T git@github.com
```



### 上传本地仓库

在本地的电脑上新建一个文件夹，在这个文件夹里面右键选择`Git Bash Here`



1. 要添加文件到版本库，首先需要将这个目录变为git可以管理的仓库，在命令框里面输入：

```shell
git init
```

这时会有一个隐藏文件夹`.git`出现



2. 把要上传的项目复制到新建的文件夹里面，将项目上传的本地仓库，输入:

```shell
git add 01.txt
git commit -m "备注"
```

这里以01.txt为例子

`git add`：将文件提交到暂存区

`git commit -m`：将暂存区文件提交到仓库（引号内为注释）

> 在 Linux 系统中，commit 信息使用单引号 `'`，Windows 系统，commit 信息使用双引号 `"`。所以在 git bash 中 **git commit -m '提交说明'** 这样是可以的，在 Windows 命令行中就要使用双引号 **git commit -m "提交说明**。



### 上传远程仓库

```shell
git remote add origin https://...

git push -u origin master
```

`git remote add origin https://...`是将你本地的仓库和github仓库进行关联，关联一次之后无法再次关联，报错：`error: remote origin already exists.`

`-u`是表示第一次上传

![successful](..\images\git\successful.png)



### 分支管理

使用分支意味着你可以从开发主线上分离开来，然后在不影响主线的同时继续工作。

- 创建分支命令：

```shell
git branch (branchname)
```

单单使用`git branch`的时候是列出分支。当你执行 **git init** 的时候，默认情况下 Git 就会为你创建 **master** 分支。

- 切换分支命令

```shell
git checkout (branchname)
```

当你切换分支的时候，Git 会用该分支的最后提交的快照替换你的工作目录的内容， 所以多个分支不需要多个目录。

我们也可以使用`git checkout -b (branchname)`命令来创建新分支并立即切换到该分支下，从而在该分支中操作。

- 合并分支命令

```shell
git merge (branchname)
```

一旦某分支有了独立内容，你终究会希望将它合并回到你的主分支。 你可以使用上面的命令把这个分支合并到master分支。

- 删除分支命令

```shell
git branch -d (branchname)
```

合并并不仅仅是简单的文件添加、移除的操作，Git也会合并修改。我们可以用 git add 要告诉 Git 文件冲突已经解决。

- 查看分支

```bash
git branch -v
```



> 分支切换问题Please commit your changes or stash them before you switch branches.



因为当前的分支dev 最初也是从master 分支上衍生出来的。而此时你要再从该分支上切换到其主分支。那么你需要先把该dev分支上的改动提交后才能切换，但是该dev分支上还没有完成全部的修改，你不想提交。那么此时你就要选择 stash (存放)它们（你在当前分支上改动的却没有提交commit的内容）。
所以第一步，在当前分支上执行 `git stash` 命令。将当前分支存起来

```bash
git stash

#然后再切换分支
git checkout (branchname)
```

这时候再执行 `git status` 命令，显示没有东西需要提交，接着就可以在主分支master上创建并切换到新的分支去修复另一个Bug了。

```bash
git status
git stash list #命令去查看我们“存储”的列表。

#之后
git stash drop #来删除
```





### 查看修改

- 检查该版本库是否有文件未提交：

```shell
git status：检查当前文件状态
```



- 检查文件是否被修改

```shell
git diff 01.txt
```

`git diff`：查看文件修改的内容

`git log`：获得历史修改记录

`git log --pretty=oneline`：使记录只显示主要的内容，一行显示



- 返回版本

```SHELL
cat：查看文件内容

git reset --hard HEAD^：回退到上一个版本

git reflog：获取历史版本号

git reset --hard 版本号：回退到该版本号对应的版本
```

**PS：**如果要回退到上上个版本，可以使用git reset --hard HEAD^^命令，但是这样稍显麻烦，如果回退到100个版本之前，只需要执行这个命令即可：git reset --hard HEAD~100；



### 标签

如果你达到一个重要的阶段，并希望永远记住那个特别的提交快照，你可以使用 git tag 给它打上标签。

比如说，我们想为我们的项目发布一个"1.0"版本。 我们可以用 git tag -a v1.0 命令给最新一次提交打上（HEAD）"v1.0"的标签。

-a 选项意为"创建一个带注解的标签"。 不用 -a 选项也可以执行的，但它不会记录这标签是啥时候打的，谁打的，也不会让你添加个标签的注解。 我推荐一直创建带注解的标签。

```shell
git tag -a v1.0
```

如果我们要查看所有标签可以使用以下命令：

```shell
$ git tag
v0.9
v1.0
```

指定标签信息命令：

```shell
git tag -a <tagname> -m "我是标签"
```

PGP签名标签命令：

```shell
git tag -s <tagname> -m "我是标签"
```
