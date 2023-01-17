/*==================================
交互&分页准备
===================================*/

let newMain = document.querySelector('.new-main');//新闻容器
let pagination =  document.querySelector('.pagination');//分页容器
let pageCount = Math.ceil(newsData.length/5); //根据数据的长度计算总共几页
let newsDataRender = [];//每页要显示的数据
let p = 1;//根据p值显示每页的数据





//渲染页面函数
let render = ()=>{
  newMain.innerHTML = ' ';
  newsDataRender = newsData.slice((p-1)*5,5*p); //每页要显示的数据,一页显示5条
  newsDataRender.forEach((item,index)=>{

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
 });
};
//初始化页面
render();






//渲染分页
for(let i = 1;i<=pageCount;i++){
  pagination.innerHTML +=`<a>${i}</a>`;
}
pagination.innerHTML +=`<span class="skip">跳转至 <input type="text"> </span>页`;//获取页数
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






  //获取跳转input框
let skipInput = document.querySelector('.skip input');
//触发enter键实现跳转到输入页
skipInput.onkeydown = function (ev) {
if(ev.keyCode==13 && skipInput.value != '') {//移除每个页数按钮的activefor(let j=0;j<asAll.length;j++){
            asAll[j].classList.remove('active');
        }
p  = ev.target.value;
//给当前的页数按钮添加上active        asAll[p-1].classList.add('active');
        if( p>asAll.length){
            return;
        }//重新渲染页面render();
    }






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

