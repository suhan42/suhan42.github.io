var fs = require("fs");

//读取html
var path = './html';

fs.readdir(path, 'utf-8', function(err, files){
  if (err) throw err;
  //获取每一个文件名字
  files.forEach(function(file_name){
    fs.stat(path+'/'+file_name, function(err, stat){
      if (err) throw err;

      if(stat.isFile()){

        //去掉后缀获取文章标题
        var title = file_name.substring(0, file_name.lastIndexOf("."));
        var tag = 'acg';
        var time = stat.mtime.toString(); //修改时间
        time = time.substring(0, time.lastIndexOf("GMT"));
        var p_data;

        fs.readFile(path+'/'+file_name, 'utf-8', function (err, data){
          if(err) throw err;
          p_data = data.substring(data.indexOf("<p>")+3, data.indexOf("</p>"));
          

          
          console.log(p_data)
        });
          


        

      }
    })
  })
})