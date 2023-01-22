/*==================================
3. 根据生成的home_data.json目录页数据，在home页面进行交互&分页
===================================*/

// window.onload = function(){
//   var fs = require("fs");
//   let newsData = fs.readFileSync('./home_data.json', 'utf-8');

//   console.log(newsData);
// }








let newsData = 


[
  {
    "title": "c自查表",
    "tag": "null",
    "time": "Sun Jan 22 2023 20:59:41",
    "summary": "看c++　std::string 的源码，发现有#pragma GCC system_header这个，不知道什么意思，去google了一下，发现意思如下，以后自己代码中还是不要用这个．",
    "url": "./_htmls/c自查表.html"
  },
  {
    "title": "Linux命令行",
    "tag": "null",
    "time": "Sun Jan 22 2023 20:59:42",
    "summary": "shell是运行在终端中的文本互动程序，bash（GNU Bourne-Again Shell）是最常用的一种shell。是当前大多数Linux发行版的默认Shell。",
    "url": "./_htmls/Linux命令行.html"
  },
  {
    "title": "marked造轮子",
    "tag": "null",
    "time": "Sun Jan 22 2023 21:21:18",
    "summary": "hexo固然好用，但是在使用的过程总还是有一些问题，比如",
    "url": "./_htmls/marked造轮子.html"
  },
  {
    "title": "MySQL自查表",
    "tag": "null",
    "time": "Sun Jan 22 2023 20:59:43",
    "summary": "目录",
    "url": "./_htmls/MySQL自查表.html"
  },
  {
    "title": "vi、vim",
    "tag": "null",
    "time": "Sun Jan 22 2023 20:59:43",
    "summary": "vi和vim都是Linux中的编辑器，不同的是vim比较高级，可以视为vi的升级版本。vi使用于文本编辑，但是vim更适用于coding",
    "url": "./_htmls/vi、vim.html"
  },
  {
    "title": "《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理]",
    "tag": "null",
    "time": "Sun Jan 22 2023 20:59:43",
    "summary": "我这篇通关推荐顺序的宗旨是让玩家的体验更好。对于《白色相簿2》，不看剧透玩起来的感觉要比看剧透好非常多！所以在不透剧的前提下，通过这篇文章科普一些信息，并且提高游戏体验",
    "url": "./_htmls/《白色相簿2》[通关推荐顺序]和[官方剧情资源全整理].html",
    "imgsrc": "./images/冬馬かずさ.jpg"
  },
  {
    "title": "静态博客框架之Hexo & Jekyll",
    "tag": "null",
    "time": "Sun Jan 22 2023 21:21:19",
    "summary": "之所以接触到Hexo以及Jekyll框架是因为之前一直有在写些博客，比如通过<strong>Github Pages</strong>直接写的HTML静态博客，但这种博客维护起来相当麻烦，有如下一些问题：",
    "url": "./_htmls/静态博客框架之Hexo & Jekyll.html"
  }
]















let old_data = [
  {
    title: "关于css中box的使用",
    tag: "it",
    time: "4-12-2022",
    url: "./_views/box.html",
    summary: "这篇不是markdown笔记，是直接写的html网页，所以建议同时观看html源码，可以更好的学习理解。",
    
  },
];
//在末尾加上old_data
newsData = newsData.concat(old_data);

// num = {};
// fruits.push(num);


let top_data = 
{
  title: "新年快乐！！！",
  tag: "happy",
  time: "1-22-2023",
  url: "./_views/fireworks.html",
  summary: "新年快乐，兔年大吉。恭喜发财，万事如意！",
  
};





// 根据时间进行排序
function sortTime(a,b){
  return Date.parse(b.time)-Date.parse(a.time)
}
newsData.sort(sortTime);


// 设置顶置文件
newsData.unshift(top_data)



let newMain = document.querySelector('.main-content');//新闻容器
let pagination =  document.querySelector('.pagination');//分页容器
let pageCount = Math.ceil(newsData.length/5); //根据数据的长度计算总共几页
let newsDataRender = [];//每页要显示的数据
let p = 1;//根据p值显示每页的数据


//渲染页面函数
let render = ()=>{
  newMain.innerHTML = ' ';
  newsDataRender = newsData.slice((p-1)*5,5*p); //每页要显示的数据,一页显示5条
  newsDataRender.forEach((item,index)=>{

    // 判断是否有img图片资源
    if(item.hasOwnProperty("imgsrc")){
      // 构建html
      newMain.innerHTML +=
      `<div class="d-md-flex post-entry-2 small-img">
        <a href="${item.url}" class="me-4">
          <img src="${item.imgsrc}" alt="${item.title}" class="img-fluid">
        </a>
        <div>
          <div class="post-meta">
            <span class="date">${item.tag}</span><span class="mx-1">&bullet;</span>
            <span>${item.time}</span>
          </div>
          <a href="${item.url}">
            <h4>${item.title}</h4>
            <p>${item.summary}</p>
          </a>
        </div>
      </div>`;
    } 
    else {
      // 构建html
      newMain.innerHTML +=
      `<div class="d-md-flex post-entry-2 small-img">
        <div>
          <div class="post-meta">
            <span class="date">${item.tag}</span><span class="mx-1">&bullet;</span>
            <span>${item.time}</span>
          </div>
          <a href="${item.url}">
            <h4>${item.title}</h4>
            <p>${item.summary}</p>
          </a>
        </div>
      </div>`;
    }
  

});
};
//初始化页面
render();






//渲染分页
for(let i = 1;i<=pageCount;i++){
  pagination.innerHTML +=`<a>${i}</a>`;
}
// pagination.innerHTML +=`<span class="skip">跳转至 <input type="text"> </span>页`;//获取页数
let asAll = pagination.querySelectorAll('a');
//页面刚进来时第一页高亮
asAll[p-1].classList.add('active');





//遍历总页数
asAll.forEach((item,index)=>{
  //点击页数
  item.onclick = function () {
    for(let j=0;j<asAll.length;j++){
      asAll[j].classList.remove('active');
    }
    this.classList.add('active');
    p=index+1; //点击页数，改变p的值，以改变这个页面要显示的数据，达到分页的效果
    render(); //重新渲染页面
  }
});






//   //获取跳转input框

// let skipInput = document.querySelector('.skip input');
// //触发enter键实现跳转到输入页
// skipInput.onkeydown = function (ev) {
//   if(ev.keyCode==13 && skipInput.value != '') {//移除每个页数按钮的activefor(let j=0;j<asAll.length;j++){
//       asAll[j].classList.remove('active');
//   }
//   p  = ev.target.value;
//   //给当前的页数按钮添加上active        asAll[p-1].classList.add('active');
//   if( p>asAll.length){
//       return;
//   }//重新渲染页面render();
// }






//点击上一页下一页，改变高亮
let changePageClass = ()=>{
  for(let j=0;j<asAll.length;j++){
      asAll[j].classList.remove('active');
  }
  asAll[p-1].classList.add('active');
};

//上一页
let prev = document.querySelector('.prev');
prev.onclick = function (e) {
      if(p<=1){
          console.log(p);
          return;
      }else{
          p=p-1;
          changePageClass();
          render();
      }
};
//下一页
let next = document.querySelector('.next');
next.onclick = function () {
  if(p>=asAll.length){
      return;
  }
  p=p+1;
  changePageClass();
  render();
}



