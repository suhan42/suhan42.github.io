// Divergence Meter 交互：预加载辉光管图片，更新目标日期计数和今日剩余时间。
var sources = {
  dotl: "/assets/custom/divergence-meter/image/dotl.jpg",
  dotr: "/assets/custom/divergence-meter/image/dotr.jpg",
  zero: "/assets/custom/divergence-meter/image/0.jpg",
  one: "/assets/custom/divergence-meter/image/1.jpg",
  two: "/assets/custom/divergence-meter/image/2.jpg",
  three: "/assets/custom/divergence-meter/image/3.jpg",
  four: "/assets/custom/divergence-meter/image/4.jpg",
  five: "/assets/custom/divergence-meter/image/5.jpg",
  six: "/assets/custom/divergence-meter/image/6.jpg",
  seven: "/assets/custom/divergence-meter/image/7.jpg",
  eight: "/assets/custom/divergence-meter/image/8.jpg",
  nine: "/assets/custom/divergence-meter/image/9.jpg"
};

var digitSources = [
  sources.zero,
  sources.one,
  sources.two,
  sources.three,
  sources.four,
  sources.five,
  sources.six,
  sources.seven,
  sources.eight,
  sources.nine
];

$(function () {
  preloadSources();
  fitMeter();
  days();

  window.setInterval(days, 100000);
  window.setInterval(ElyPsyCongroo, 500);
  window.addEventListener("resize", fitMeter);
});

// 预加载全部辉光管图片，避免每次刷新数字时重复创建 Image 对象。
function preloadSources() {
  for (var key in sources) {
    var image = new Image();
    image.src = sources[key];
  }
}

// 根据视口宽度缩放 10 位时间面板，移动端不再被裁掉。
function fitMeter() {
  var isNarrow = window.innerWidth <= 520;
  var baseWidth = isNarrow ? 520 : 1040;
  var available = Math.min(window.innerWidth - 32, baseWidth);
  var scale = available / baseWidth;
  if (isNarrow) scale = Math.min(0.62, scale);
  scale = Math.max(0.24, scale);
  document.documentElement.style.setProperty("--meter-scale", scale.toFixed(4));
}

// 更新目标日期计数；目标日期已经过去时显示“已过去”，不把时间差误写成“还有”。
function days() {
  var now = new Date();
  var target = new Date("2025-06-30T00:00:00");
  var diff = target - now;
  var isFuture = diff >= 0;
  var diffInDays = isFuture
    ? Math.ceil(diff / (1000 * 60 * 60 * 24))
    : Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
  var title = document.getElementById("divergence-title");

  if (title) {
    title.textContent = "距离2025-6-30" + (isFuture ? "还有" : "已过去");
  }

  var dayStr = String(Math.max(0, diffInDays)).padStart(3, "0").slice(-3);
  setDayBackgrounds(dayStr.split("").map(Number));
}

function setDayBackgrounds(digits) {
  $("#days div").each(function (index) {
    var source = digitSources[digits[index]];
    $(this).css("background-image", source ? 'url("' + source + '")' : "none");
  });
}

// 更新 10 位时间面板；冒号位置根据秒数奇偶切换圆点方向。
function ElyPsyCongroo() {
  var timeStr = timeLast();

  $("#myDiv div").each(function (index) {
    var value = timeStr[index];

    if (value === ":") {
      var source = isLeftOrRight(timeStr[7]) ? sources.dotl : sources.dotr;
      $(this).css("background-image", 'url("' + source + '")');
    } else if (value !== undefined) {
      var digitSource = digitSources[Number(value)];
      $(this).css("background-image", digitSource ? 'url("' + digitSource + '")' : "none");
    } else {
      $(this).css("background-image", "none");
    }
  });
}

function isLeftOrRight(second) {
  return second % 2 === 0;
}

// 计算今天剩余时间，保留两位小时、分钟和秒。
function timeLast() {
  var now = new Date();
  var endOfDay = new Date();
  endOfDay.setDate(now.getDate() + 1);
  endOfDay.setHours(0);
  endOfDay.setMinutes(0);
  endOfDay.setSeconds(0);
  endOfDay.setMilliseconds(0);

  var remainingMilliseconds = endOfDay - now;
  var remainingHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
  var remainingMinutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  var remainingSeconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);

  return (remainingHours >= 10 ? remainingHours : "0" + remainingHours) + ":" +
    (remainingMinutes >= 10 ? remainingMinutes : "0" + remainingMinutes) + ":" +
    (remainingSeconds >= 10 ? remainingSeconds : "0" + remainingSeconds);
}
