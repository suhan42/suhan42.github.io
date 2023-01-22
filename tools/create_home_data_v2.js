/*================================
2. markdown转html，转换好了之后，统计html文件数量，生成目录数据
使用 fs 异步
未使用 _文件夹
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
console.log("写入成功！")
