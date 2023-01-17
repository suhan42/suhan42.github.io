/*============================================================
fs获取文件夹文件信息及内容
=============================================================*/

var fs = require("fs");

var main = []

//读取html
var path = './html';

fs.readdir(path, 'utf-8', function(err, files){
  if (err) throw err;

  //遍历文件
  files.forEach(file_name =>{
    fs.stat(path+'/'+file_name, function(err, stat){
      if (err) throw err;

      if(stat.isFile()){

        //去掉后缀获取文章标题
        var title = file_name.substring(0, file_name.lastIndexOf("."));
        var tag = 'acg';
        var time = stat.mtime.toString(); //修改时间
        time = time.substring(0, time.lastIndexOf("GMT"));

        // 由于readFile是异步读取文件，所以就相当于读取三个文件并打印的操作在同时进行，受延迟等影响，每次执行打印的顺序不固定。而readFileSync()是同步读取，所以按照顺序读取并打印a.txt、b.txt、c.txt，上一个文件未读取时不会读取下一个文件，所有这里使用readFileSync()
        var summary = fs.readFileSync(path+'/'+file_name, 'utf-8').toString();
        summary = summary.substring(summary.indexOf("<p>")+3, summary.indexOf("</p>"))
        
        
        console.log(title);
        console.log(summary);
      }

    })
  })
})


