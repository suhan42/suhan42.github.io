// 使用单标志法进行进程的互斥
var turn = true;
while(turn != false){
  turn = markdown_to_html();
  console.log("===========");
}
while(turn != true){
  turn = create_home_data();
}









/** 
 * @file markdown_to_html
 * @brief 1. markdown转html，并且渲染html界面
 * @date 1.21.2023
 * @param file_name name of markdown file
 * @author suhan
 */
function markdown_to_html() {
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

  let files = fs.readdirSync(path, 'utf-8');
  //获取每一个文件名字
  files.forEach(file_name =>{

    var file = fs.statSync(path+'/'+file_name);

    if(file.isFile()){

      var markdown = fs.readFileSync(path+'/'+file_name, 'utf-8').toString();

      // marked 关键转换
      var lexed = marked.lexer(markdown);
      var html = marked.parser(lexed);
    
      //去掉后缀获取文章标题
      var title = file_name.substring(0, file_name.lastIndexOf("."));
      var tag = 'null';
      var time = file.mtime.toString(); //修改时间
      time = time.substring(0, time.lastIndexOf(" GMT"));



      // 构建 header 和 footer
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

      var fsFooter = require("fs");
      var footer = fsFooter.readFileSync('./view/footer.html', 'utf-8').toString();

      //判断文件是否存在
      try {
        fs.accessSync('./html/'+title+'.html', fs.constants.F_OK)

        // 文件存在
        console.log('-'+title+'.html 存在于当前目录中');
        // 文件存在，则比对文件内容，判断是否需要重写
        var old_file = fs.readFileSync('./html/'+title+'.html', 'utf-8')
        if(old_file != header+html+footer){
          console.log(' - '+title+' 文件已修改');
          writeNewFile(title, header, html, footer);
        }
      }
      catch {
        // 文件不存在
        writeNewFile(title, header, html, footer);
      }
    }     
  })

  // 创建文件，并写入html
  function writeNewFile(title, header, html, footer){
    fs.writeFileSync('./html/'+title+'.html', header+html+footer)
    console.log('==='+title+'  数据写入成功！===');
  }
  
  // 互斥锁
  return false;
}







/** 
 * @file create_home_data
 * @brief 2. markdown转html转换好了之后，统计html文件数量，生成home目录数据，保存到home_data.json
 * @date 1.21.2023
 * @param file_name name of html file
 * @author suhan
 */
function create_home_data() {

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
  // 二维数组 转换为 string
  var home_data_string = JSON.stringify(home_data, null, 2)

  // 生成home页面目录数据
  var fs2 = require("fs");
  fs2.writeFileSync('./home_data.json', home_data_string);
  console.log("home_data 写入成功！")

  // 互斥锁
  return true;
}


