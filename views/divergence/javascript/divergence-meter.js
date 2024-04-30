$(function() {
	
	window.sessionStorage["hex"] = 24;
	// window.sessionStorage["hex"] = 12;

	days();
	setInterval("days()", 100000);
	setInterval("ElyPsyCongroo()", 500);
	

	//时间设置 or 初始化
	$('#myDiv').click(function(){
		hex = window.sessionStorage.getItem("hex");
		hex = hex == 24 ? 12 : 24;
		window.sessionStorage["hex"] = hex;
	});
})



function days() {
	var date1 = new Date();
	var date2 = new Date("2025-6-30");
	
	loadImages(sources, function(images){	
		$('#days div').each(function(i){
			var timeStr = daysBetweenDates(date1, date2);

			if(timeStr[i] == 0){
				$(this).css("background-image", "url(" + sources.zero + ")");
			}else if(timeStr[i] == 1){
				$(this).css("background-image", "url(" + sources.one + ")");
			}else if(timeStr[i] == 2){
				$(this).css("background-image", "url(" + sources.two + ")");
			}else if(timeStr[i] == 3){
				$(this).css("background-image", "url(" + sources.three + ")");
			}else if(timeStr[i] == 4){
				$(this).css("background-image", "url(" + sources.four + ")");
			}else if(timeStr[i] == 5){
				$(this).css("background-image", "url(" + sources.five + ")");
			}else if(timeStr[i] == 6){
				$(this).css("background-image", "url(" + sources.six + ")");
			}else if(timeStr[i] == 7){
				$(this).css("background-image", "url(" + sources.seven + ")");
			}else if(timeStr[i] == 8){
				$(this).css("background-image", "url(" + sources.eight + ")");
			}else if(timeStr[i] == 9){
				$(this).css("background-image", "url(" + sources.nine + ")");
			}			
		});
	});
}
function daysBetweenDates(date1, date2) {  
	// 计算两个日期之间的毫秒数差  
	const diffInMs = Math.abs(date2 - date1);  
	
	// 将毫秒数差转换成天数  
	const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
	// console.log(diffInDays-1);  //输出的是数字

	const dayStr = (diffInDays-1).toString();
	const arr = dayStr.match(/\d/g).map(Number);
	console.log(arr);		//输出数组

	return arr;
}






var sources = {
	dotl : "image/dotl.jpg",
	dotr : "image/dotr.jpg",
	zero : "image/0.jpg",
	one : "image/1.jpg",
	two : "image/2.jpg",
	three : "image/3.jpg",
	four : "image/4.jpg",
	five : "image/5.jpg",
	six : "image/6.jpg",
	seven : "image/7.jpg",
	eight : "image/8.jpg",
	nine : "image/9.jpg"
};
function ElyPsyCongroo() {
	
	loadImages(sources, function(images){
		$('#myDiv div').each(function(i){
			var timeStr = timeLast(window.sessionStorage.getItem("hex"));

			if(timeStr[i] == 0){
				$(this).css("background-image", "url(" + sources.zero + ")");
			}else if(timeStr[i] == 1){
				$(this).css("background-image", "url(" + sources.one + ")");
			}else if(timeStr[i] == 2){
				$(this).css("background-image", "url(" + sources.two + ")");
			}else if(timeStr[i] == 3){
				$(this).css("background-image", "url(" + sources.three + ")");
			}else if(timeStr[i] == 4){
				$(this).css("background-image", "url(" + sources.four + ")");
			}else if(timeStr[i] == 5){
				$(this).css("background-image", "url(" + sources.five + ")");
			}else if(timeStr[i] == 6){
				$(this).css("background-image", "url(" + sources.six + ")");
			}else if(timeStr[i] == 7){
				$(this).css("background-image", "url(" + sources.seven + ")");
			}else if(timeStr[i] == 8){
				$(this).css("background-image", "url(" + sources.eight + ")");
			}else if(timeStr[i] == 9){
				$(this).css("background-image", "url(" + sources.nine + ")");
			}else if(timeStr[i] == ":"){
				if(isLeftOrRight(timeStr[7])) {
					$(this).css("background-image", "url("+ sources.dotl +")");
				} else {
					$(this).css("background-image", "url("+ sources.dotr +")");
				}
			}				
		});
	});
}

function isLeftOrRight(second){
	if(second % 2 == 0) {
		return true;
	}
	else {
		return false;
	}
}
	
function loadImages(sources, callback){
    var count = 0,
        images ={},
        imgNum = 12;
	
    for(src in sources){
        images[src] = new Image();
        images[src].onload = function(){
            if(++count >= imgNum){
                callback(images);
            }
        }
        images[src].src = sources[src];
    }
}

// 正计时时间
function time(hex) {
    var date = new Date();
	var timeStr;
	
	if (hex == 12) {
		var timeStr12=date.toLocaleTimeString().split(":");
		var hour = timeStr12[0].replace(/[\u4e00-\u9fa5]/g,"");
		timeStr = (hour >= 10 ? hour : "0" + hour) + ":" + timeStr12[1] + ":" + timeStr12[2];
	}else if (hex == 24) {
		var timeStr24=date.toLocaleTimeString('chinese', { hour12: false }).split(":");
		timeStr = (timeStr24[0] == 24 ? "00" : timeStr24[0]) + ":" + timeStr24[1] + ":" + timeStr24[2];
	}
	// console.log(timeStr);
    return timeStr;
}

// 只有24
// 一天的剩余时间
function timeLast(hex) {
	let now = new Date();  
	
	// 设置今天结束的时间（即明天的开始时间，0点0分0秒）  
	let endOfDay = new Date();  
	endOfDay.setDate(now.getDate() + 1);  
	endOfDay.setHours(0);  
	endOfDay.setMinutes(0);  
	endOfDay.setSeconds(0);
	endOfDay.setMilliseconds(0);  
	
	// 计算剩余时间（毫秒）  
	let remainingMilliseconds = endOfDay - now;  
	
	// 转换剩余时间为小时、分钟和秒
	let remainingHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));  
	let remainingMinutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));  
	let remainingSeconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);  
	
	var timeLastStr = (remainingHours >= 10 ? remainingHours : "0" + remainingHours) + ":" + (remainingMinutes >= 10 ? remainingMinutes : "0" + remainingMinutes) + ":" + (remainingSeconds >= 10 ? remainingSeconds : "0" + remainingSeconds);


	// return {  
	// 	hours: remainingHours,  
	// 	minutes: remainingMinutes,  
	// 	seconds: remainingSeconds  
	// };  
	  
	// console.log(timeLastStr);
    return timeLastStr;
}
