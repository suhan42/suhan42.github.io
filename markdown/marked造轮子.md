# 造轮子

hexo固然好用，但是在使用的过程总还是有一些问题，比如

1. git经常unable to access，push需要借助git desktop才能稳定。(主要原因)
2. hexo虽然有很多主题，也可以设置不被渲染的html，但是你打算使用你自己写的前端。
2. 想搞一搞（bushi

那么你可以看看下面的内容，尝试自己使用marked造一个小轮子（小hexo）

## marked

[marked](https://github.com/markedjs/marked)是一个JavaScript编写的全功能Markdown解析和编译器。目的是快速的编译超大块的Markdown文本而不必担心结果会出乎意料或者花费很长时间。

marked最初是为Node.JS编写，现在已完全兼容客户端浏览器。

新版本号称速度比 C 语言写的 Markdown 转换工具 [Discount](http://www.oschina.net/p/discount) 还要快。

### 使用

安装marked在目标文件夹下

```bash
npm install marked --save
```

### marked参数说明

```
-o, –output [output]: 指定输出文件，默认为当前控制台
-i, –input [input]: 指定输入文件或最后一个参数，默认为当前控制台输入
-t, –tokens: 输出token流代替HTML
–pedantic: 只解析符合markdown.pl定义的，不修正markdown的错误
–gfm: 启动Github样式的Markdown，参考 https://help.github.com/articles/github-flavored-markdown/
–breaks: 支持Github换行符，必须打开gfm选项
–tables: 支持Github表格，必须打开gfm选项
–sanitize: 原始输出，忽略HTML标签
–smart-lists: 优化列表输出
–lang-prefix [prefix]: 设置前置样式
–no-etc: 选择的反正标识
–silent: 不输出错误信息
-h, –help: 帮助信息
```

### API使用

接下来，我通过API来调用marked解析markdown文本。

新建一个脚本文件mark1.js

```javascript
var marked = require('marked');
console.log(marked.parse('I am using __markdown__.'));
```

运行脚本mark1.js。

```
<p>I am using <strong>markdown</strong>.</p>
```



下面再用API读取md1.md的文本，进行解析，然后输出为HTML，新建mark2.js文件。

```javascript
var marked = require('marked');
var fs = require("fs");  //读取md文件内容

// console.log(marked.parse('I am using __markdown__.'));

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  smartLists: true,
  smartypants: false
});

//读取md
fs.readFile('m1.md', 'utf-8', function (err, data) {
  if (err) throw err;
  var lexed = marked.lexer(data);
  var html = marked.parser(lexed);

  //创建文件，并写入html
  fs.writeFile('md1.html', html, function(err) {
    if (err) throw err;
    console.log("数据写入成功！");
  });
});
```

运行之后，就会在该目录下生成一个md1.html文件，其中的内容就是m1.md的内容转码为html后的样子。



### 自定义渲染

自定义渲染选项允许你以自定义的方式渲染内容，并把之前的规则设置覆盖掉。

块级标签支持以下渲染：

- code(string code, string language)
- blockquote(string quote)
- html(string html)
- heading(string text, number level)
- hr()
- list(string body, boolean ordered)
- listitem(string text)
- paragraph(string text)
- table(string header, string body)
- tablerow(string content)
- tablecell(string content, object flags)

行级标签支持以下渲染：

- strong(string text)
- em(string text)
- codespan(string code)
- br()
- del(string text)
- link(string href, string title, string text)
- image(string href, string title, string text)

例如

```javascript
// 添加自定义渲染
var my_renderer = new marked.Renderer()
my_renderer.link = function (href, title, text) {
    return `<a href="${href}" title="${title || text}" target="_blank">${text}</a>`
}

	//表格下面两个返回方式的结果不一样，个人更喜欢后者
my_renderer.table = function (header, body) {
    return '<table class="table table-striped">'+header+body+'</table>'
    //return `<table class="table table-hover table-bordered">${header}${body}</table>`;
}

marked.setOptions({ 
  renderer: my_renderer,	//自定义
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  smartLists: true,
  smartypants: false,
})
```



### 常见问题

> ##### Uncaught TypeError TypeError: marked is not a function
>
> 解决方案：修改使用方法
>
> ```javascript
> console.log(marked('I am using __markdown__.'));
> 
> //改为
> console.log(marked.parse('I am using __markdown__.'));
> ```
>

>##### sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options
>
>解决方案：sanitize被弃用了，在setOptions中删去sanitize设置



中文资料很少，可以看看下面这些。但是下面这些也是之前的文章了，现在marked已经发生了很多变化，所以还是建议看最新的官方文档。当然我这篇也可以满足基本使用了（笑）。

[Marked高效的Markdown解析器_Fens的博客](https://blog.csdn.net/fens/article/details/84634655)

[使用marked解析markdown为html](https://cloud.tencent.com/developer/article/1961057)



## highlight.js

代码高亮的库选用的是highlight.js

```bash
npm install highlight.js --save
```

把highlight加入到js里面

```javascript
const highlight = require('highlight.js')

marked.setOptions({
    highlight: function(code) {
        return highlight.highlightAuto(code).value
    }
})
```

同时，在生成的html中引用highlight中对应的css就可以了。

```html
<link href="node_modules/highlight.js/styles/github.css" rel="stylesheet" type="text/css">
```

再写一个code的css外框

```css
pre {
	background-color: #F6F8FF;
	border-radius: 16px;
	font-size: 16px;
	padding: 29px 22px 22px 22px;
	margin-top: 22px;
	margin-bottom: 22px;
	line-height: 1.2;
	overflow-x: auto;
}
code {
	position: relative;
	background-color: unset !important;
}
```

大功告成



## ★完善网页和渲染

需要添加的功能：

- [x] 加上header与footer进行渲染
- [x] 获取一个文件夹的md文件进行批量转码生成post文章，获取文件名当作title标题完善文章
- [x] 添加文件修改时间
- [x] 对比post内容，不一致再进行html的生成，一致则不需要生成
- [ ] home（index.html）页面根据html文件（即文章）数量和内容，修改home页面的预览。在`home.js`
  使用js读取本地文件并将内容展示到页面
  - 这里的文本预览只能获取html的第一个`<P>`标签。（等待完善）
- [ ] home页面分页

到此为止，就能满足纯文本用户基本使用了，当然我们肯定不能到此为止

- [ ] 图片正确转码
- [ ] post页面文章目录
- [ ] tags标签



这个时候已经可以把markdown转码为html并新建文件进行存储了，而且也有了代码高亮。但是网页只有markdown的内容，并没有header和footer，这不是一个完整的网页。

所以我们这时候就可以设计一个自己想要的完整的网页，并预留出一个post div来存放markdown的内容，实现`hexo generate`把markdown渲染成html的功能。

### 加上header与footer进行渲染

```javascript
var marked = require('marked');
var fs = require("fs"); //读取md文件内容
const highlight = require('highlight.js');

var my_renderer = new marked.Renderer();
my_renderer.table = function (header, body) {
  return `<table class="table table-hover table-bordered">${header}${body}</table>`;
};

marked.setOptions({
  renderer: my_renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  smartLists: true,
  smartypants: false,
  highlight: function(code) {
    return highlight.highlightAuto(code).value;
  },
  
});


//读取md
fs.readFile('README.md', 'utf-8', function (err, data) {
  if (err) throw err;
  var lexed = marked.lexer(data);
  var html = marked.parser(lexed);

  var title = 'test1';

  //前部header网页，这里是示例，大家请自行设计自己喜欢的网页
  var header = '<!DOCTYPE html><head><meta charset="utf-8">'+
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><title>'+
    title+
    '</title><base target="_blank"></head>'+
    '<body><header id="header" class="header d-flex align-items-center fixed-top">...</header><main id="main">';
  
    
    //后面的footer
  var footer = '</main>'+
  '<footer id="footer" class="footer">...</footer>'+
  '</body></html>';


  //创建文件，并写入html
  fs.writeFile('./html/test1.html', header+html+footer, function(err) {
    if (err) throw err;
    console.log("数据写入成功！");
  });
});
```

这样就构建了一个基本的html网页，但是，我们需要批量操作，把一个文件夹里面的所有markdown都转换成html，并且获取文件的名字作为title。

### fs遍历markdown文件

遍历文件夹

```javascript
var path = './markdown';
fs.readdir(path, 'utf-8', function(err, files){
  if (err) throw err;
  files.forEach(function(file_name){
    fs.stat(path+'/'+file_name, (err, stat)=>{
      if(stat.isFile()){
        console.log('文件名:', file_name);
      }else{
        console.log('文件夹名:', file_name);
      }
    })
  })
})
```

通过遍历文件夹获取所有文件，然后遍历文件的内容，进行markdown转换

```javascript
var marked = require('marked');
var fs = require("fs"); //读取md文件内容
const highlight = require('highlight.js');

var my_renderer = new marked.Renderer();
my_renderer.table = function (header, body) {
  return `<table class="table table-hover table-bordered">${header}${body}</table>`;
};

marked.setOptions({
  renderer: my_renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  smartLists: true,
  smartypants: false,
  highlight: function(code) {
    return highlight.highlightAuto(code).value;
  },
  
});


//读取md
//markdown存放位置
var path = './markdown';

fs.readdir(path, 'utf-8', function(err, files){
  if (err) throw err;
  //获取每一个文件名字
  files.forEach(function(file_name){
    fs.stat(path+'/'+file_name, (err, stat)=>{
      if (err) throw err;

      if(stat.isFile()){

        fs.readFile(path+'/'+file_name, 'utf-8', function (err, data) {
          if(err) throw err;
          var lexed = marked.lexer(data);
          var html = marked.parser(lexed);
        
          //去掉后缀获取文章标题
          var title = file_name.substring(0, file_name.lastIndexOf("."));
          var tag = 'acg';
          var time = stat.mtime.toString(); //修改时间
          time = time.substring(0, time.lastIndexOf("GMT"));
        
          var header = 'header内容'+title+'在这里面添加信息，例如时间time和标签tag'+time+tag;
          var footer = 'footer内容’;
        
          //创建文件，并写入html
          fs.writeFile('./html/'+title+'.html', header+html+footer, function(err) {
            if(err) throw err;
            console.log("数据写入成功！");
          });
        });
      }
    })
  })
})
```

### 如果文本没有变化则不需要重新渲染

```javascript
//判断文件是否存在
fs.access('./html/'+title+'.html', fs.constants.F_OK, (err) => { 
    if(err) {
        //不存在，则创建文件，并写入html
        writeNewFile(title, header, html, footer);
    }else {
        console.log('-'+title+'.html存在于当前目录中');
        //文件存在，则比对文件内容，判断是否需要重写
        fs.readFile('./html/'+title+'.html', 'utf-8', function (err, data){
            if(err) throw err;
            if(data != header+html+footer){
                console.log(' - 但是文件已修改');
                writeNewFile(title, header, html, footer);
            }
        })
    }
});
```

### 遍历html文件夹，生成home页面的目录页

1. fs遍历html文件，生成JSON文件

```javascript
/*================================
markdown转html转换好了之后，统计html文件数量，生成目录数据
================================= */
function get_home_data(){
  var fs = require("fs");

  //所有文件要展示在home页面的内容
  let home_data = []

  //读取html
  var path = './html';
  let files = fs.readdirSync(path, 'utf-8');

  //遍历文件
  files.forEach(file_name =>{
    var file = fs.statSync(path+'/'+file_name);
    if(file.isFile()){
      
      var time = file.mtime.toString(); 
      time = time.substring(0, time.lastIndexOf(" GMT"));

      // 由于readFile是异步读取文件，所以就相当于读取三个文件并打印的操作在同时进行，受延迟等影响，每次执行打印的顺序不固定。而readFileSync()是同步读取，所以按照顺序读取并打印a.txt、b.txt、c.txt，上一个文件未读取时不会读取下一个文件，所有这里使用readFileSync()
      var summary = fs.readFileSync(path+'/'+file_name, 'utf-8').toString();
      summary = summary.substring(summary.indexOf("<p>")+3, summary.indexOf("</p>"))
      
      const data = {};
      //去掉后缀获取文章标题
      data.title = file_name.substring(0, file_name.lastIndexOf("."));
      data.tag = 'null';
      data.time = time;
      data.summary = summary;
      data.url = path+'/'+file_name;

      home_data.push(data);
    }
  })
  return home_data;
}


let home_data = get_home_data();
var string_data = JSON.stringify(home_data, null, 2)

// 生成home页面目录数据
var fs2 = require("fs");
fs2.writeFileSync('./home_data.json', string_data);
```

2. 获取生成的json文件，生成目录并分页到home页

这里的内容我感觉没有写好。使用js的XMLHttpRequest或者jQ都一直出错，无法正常拿到json的内容。现在是使用静态文件手动添加的方式，生成数据表。









## code-prettify

[code-prettify](https://github.com/googlearchive/code-prettify)

已经使用了highlight了，等有时间再看看code-prettify。(doge.jpg)

## mathjax

marked + mathjax 实现支持数学公式的 markdown 转 html

