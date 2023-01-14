## GitHub pages

之所以接触到Hexo以及Jekyll框架是因为之前一直有在写些博客，比如通过**Github Pages**直接写的HTML静态博客，但这种博客维护起来相当麻烦，有如下一些问题：

1. 维护繁杂，加一篇日志链接往往需要改动很多HTML页面中的链接。
2. 设计困难，非前端设计人员的通病，往往在界面设计以及效果实现上浪费很多时间。
3. 不支持MD语法，写一篇博客相当于写一个HTML页面，相当累人。

# 静态博客框架

目前有两大静态博客主流框架：[jekyll](http://jekyllcn.com/)和[hexo](https://hexo.io/)。

## 选择Hexo还是Jekyll

于是开始接触比较流行的一些静态博客框架，比较流行的有Jekyll，Hexo，Simple，Octopress，Pelican以及Lo·gecho等等。这些静态程序可以说都有各自的好处，但最后我选择了Hexo来搭建自己的博客，和Jekyll相比，选择Hexo主要原因是：

1. Jeky基于Ruby实现，安装Jeky需要搭建Ruby环境，在Windows搭建Ruby环境并太好弄，而且Jekyll的中文资料比较少。而 Hexo基于NodeJs实现，在Windows上安装NodeJs开发环境简单。
2. 比较直接的另一个原因是在网上查找了很多博客的主题，发现Jekyll官网提供的主题都不怎么好看(可能是个人原因)，而Hexo的主题看的比较顺眼，在hexo界，使用最多的主题就是[Next](http://theme-next.iissnan.com/)。
3. 两者都支持Markdown语法，这点我非常喜欢。

## Hexo博客开发

关于hexo的部署无需多言了，直接看官方文档就可以了，写得很清楚了。

[文档 | Hexo](https://hexo.io/zh-cn/docs/)



#### 检查版本

```bash
node -v
npm -v
git --version
hexo -v
```



### 正常流程

#### 初始化

在本地git库（这个文件夹需要是空文件夹）里面git bash

> 对应官方文档建站
>
> ```bash
> $ hexo init <folder>
> $ cd <folder>
> $ npm install
> ```

```bash
hexo init #初始化hexo
npm install #安装所有依赖

hexo server #静态生成本地界面，可以在本地localhost查看
	hexo s #简写
```

#### 修改配置文件

init之后修改里面的`_config.yml`文件（在文件最后）

```yaml
deploy:
  type: git
  repository: git@github.com:suhan42/suhan42.github.io.git
  #repo: https://github.com/suhan42/suhan42.github.io.git
  branch: main
```

config.yml里的deploy的type要为git，repo中的地址http而不是https。

#### 安装一键部署插件

在git bash中使用

```bash
npm install hexo-deployer-git --save
```

如果上面报错就使用

```bash
cnpm install hexo-deployer-git --save
```

#### 部署到git

```bash
hexo clean #删除之前生成的文件，若未生成过静态文件，可忽略此命令。

hexo generate #生成静态文件
	hexo g

hexo deploy #部署网站，上传到github
	hexo d #简写
```

以上内容可以简单复制

```bash
hexo clean && hexo generate && hexo deploy
```

如果出现`Deploy done`，则说明部署成功了。



这个时候再去git中打开对应的name.github.io就可以看到界面了。



## 一些报错

##### OpenSSL SSL_read: Connection was reset, errno 10054

解决办法：

1. 修改设置，解除SSL验证。打开 命令行工具， 输入：

```bash
git config --global http.sslVerify "false"
```

2. 在项目目录下打开命令行工具，输入`git init`，问题得到有效解决。 

##### 网络问题

github的网络经常会出问题，连接有效性检验：

```bash
# 任选其一即可
ping github.com
ssh -T git@github.com
```

实在不行就翻墙试试



---

推荐使用

Github pages + Hexo + NexT

