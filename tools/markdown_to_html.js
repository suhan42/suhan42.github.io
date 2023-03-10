/*======================================================================================================================
1. markdown转html，并且渲染html界面
使用 fs 同步
未使用 _文件夹
======================================================================================================================== */
var marked = require('marked');
var fs = require("fs"); //读取md文件内容
const highlight = require('highlight.js');

// console.log(marked.parse('I am using __markdown__.'));

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




/*================================
markdown文件转换为html
================================= */
//读取md
var path = './markdown';

fs.readdir(path, 'utf-8', function(err, files){
  if (err) throw err;
  //获取每一个文件名字
  files.forEach(function(file_name){
    fs.stat(path+'/'+file_name, function(err, stat){
      if (err) throw err;

      if(stat.isFile()){

        fs.readFile(path+'/'+file_name, 'utf-8', function (err, data){
          if(err) throw err;
          var lexed = marked.lexer(data);
          var html = marked.parser(lexed);
        
          //去掉后缀获取文章标题
          var title = file_name.substring(0, file_name.lastIndexOf("."));
          var tag = 'null';
          var time = stat.mtime.toString(); //修改时间
          time = time.substring(0, time.lastIndexOf(" GMT"));




          // 构建 header 和 footer
          var fsFooter = require("fs");

          var header = 
          `<!DOCTYPE html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
              <title>${title}</title>
            
              <base target="_blank">
            
            
              <!-- Favicons -->
              <link href="../images/suhan.png" rel="icon">
            
              <!-- bootstrap css files -->
              <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
              <link href="../vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
              <!-- hc-mobile-nav css files -->
              <link rel="stylesheet" href="../vendor/hc-mobile-nav/hc-mobile-nav.css">
            
              <!-- Template Main CSS Files -->
              <link href="../css/variables.css" rel="stylesheet">
              <link href="../css/main.css" rel="stylesheet">
              
              <link href="../css/me.css" rel="stylesheet">
              <link href="../node_modules/highlight.js/styles/github.css" rel="stylesheet">
            </head>
            
            
            <body>
              <!-- ======= Header ======= -->
              <header id="header" class="header d-flex align-items-center fixed-top">
                <div class="container-fluid container-xl d-flex align-items-center justify-content-between">
                  <a href="../index.html" target="_self" class="logo d-flex align-items-center">
                    <img src="../images/suhan.png" alt="">
                    <h2>Suhan</h2>
                  </a>
            
                  <nav id="navbar" class="main-nav navbar">
                    <ul>
                      <li><a href="../index.html" target="_self">Home</a></li>
                      <li><a href="#" target="_self">IT</a></li>
                      <li class="dropdown"><a href="#" target="_self"><span>ACGN</span><i class="nav-down bi bi-chevron-down dropdown-indicator"></i></a>
                        <ul>
                          <li><a href="#" target="_self">A - Animation</a></li>
                          <li><a href="#" target="_self">C - Comic</a></li>
                          <li><a href="#" target="_self">G - Game</a></li>
                          <li><a href="#" target="_self">N - Novel</a></li>
                        </ul>
                      </li>
                      <li><a href="../view/about.html" target="_self">About</a></li>
                    </ul>
                  </nav><!-- end navbar -->
            
                  <div class="position-relative">
                    <a href="#" class="mx-2"><span class="bi-twitter"></span></a>
                    <a href="#" class="mx-2"><span class="bi-instagram"></span></a>
                    <a href="#" class="mx-2 js-search-open" target="_self"><span class="bi-search"></span></a>
                    
                    <a class="toggle"><span class="bi-list" target="_self"></span></a>
            
                    <!-- ======= Search Form ======= -->
                    <div class="search-form-wrap js-search-form-wrap">
                      <form action="" class="search-form">
                        <span class="icon bi-search"></span>
                        <input type="text" placeholder="Search" class="form-control">
                        <button class="btn js-search-close"><span class="bi-x"></span></button>
                      </form>
                    </div><!-- End Search Form -->
                  </div>
            
                </div>
              </header>
            
              <!-- ======= Main ======= -->
              <main id="main">
                <!-- ======= main body ======= -->
                <section>
                  <div class="container">
                    <div class="row">
                      <div class="col-md-12">
            
                        <h3 class="category-title">${title}</h3><hr>
            
                        <div class="d-md-flex post-entry-1">
                          <div>
                            <div class="post-meta">
                              <span class="date">${tag}</span> <span class="mx-1">&bullet;</span>
                              <span>${time}</span>
                            </div>`;

        
          var footer = fsFooter.readFileSync('./view/footer.html', 'utf-8').toString();

          //判断文件是否存在
          fs.access('./html/'+title+'.html', fs.constants.F_OK, (err) => { 
            if(err) {
              //不存在，则创建文件，并写入html
              writeNewFile(title, header, html, footer);
            }else {
              console.log('-'+title+'.html 存在于当前目录中');
              //文件存在，则比对文件内容，判断是否需要重写
              fs.readFile('./html/'+title+'.html', 'utf-8', function (err, data){
                if(err) throw err;
                if(data != header+html+footer){
                  console.log(' - '+title+' 文件已修改');
                  writeNewFile(title, header, html, footer);
                }
              })
            }
          });

          
        });


        // 创建文件，并写入html
        function writeNewFile(title, header, html, footer){
          fs.writeFile('./html/'+title+'.html', header+html+footer, function(err) {
            if(err) throw err;
            console.log('==='+title+'  数据写入成功！===');
          });
        }
        
      }
    })
  })
})