// json数组
let result=[
  {yime:11,name:'中国银行'},
  {yime:3,name:'北京银行'},
  {yime:2,name:'河北银行'},
  {yime:10,name:'保定银行'},
  {yime:7,name:'涞水银行'}
]



// 从小到大 升序排序
function sortIdAsc(a,b){
return a.yime-b.yime  
}


result.sort(sortIdAsc);
console.log(result); 
