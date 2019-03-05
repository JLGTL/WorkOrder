//根据某一天（默认当天,date格式） 获取传到7天日历的日期列表(一。。。。。日)
	export function	getWeekList(date){
			let day = date.getDay() || 7;
			//if(day==7){day = 0}//周日
			let oneDayTime = 24*60*60*1000 ;
			let monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - day + 1);
			let item = [];
			for(let i=0;i<7;i++){
				let newDay = monday.getTime() + i*oneDayTime;
				newDay = new Date(newDay);
				item.push(newDay)
			}
			return item;
		}


/*时间格式化*/

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}/{m}/{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/* 获取当前时间所在月份的第一天和最后一天
 * 传入参数格式:  new Date()   "2018-09-12"   "2018-09-12 00:12:23"    "2018年09月1日"    "2018年09月1日 00:12:23"
 * 返回 ["2018-9-1 00:00:00","2018-9-30 23:59:59"]
 */
export function getMonthStartEndDay(time) {
  let firstPart, year, month, reback = [];
  if (typeof time == 'object') {
    year = time.getFullYear();
    month = time.getMonth() + 1;
		if (month<10){
			month = '0'+month;
		}
  } else {
    if (/\s+/.test(time)) { //有空格
      firstPart = time.split(' ')[0];
      if (/-+/.test(firstPart)) {
        year = firstPart.split('-')[0];
        month = parseInt(firstPart.split('-')[1]);
				if (month<10){
					month = '0'+month;
				}
      } else if (/月/.test(firstPart)) {
        year = firstPart.split('月')[0].split('年')[0];
        month = parseInt(firstPart.split('月')[0].split('年')[1]);
				if (month<10){
					month = '0'+month;
				}
      };
    } else {
      if (/-+/.test(time)) {
        year = time.split('-')[0];
        month = parseInt(time.split('-')[1]);
				if (month<10){
					month = '0'+month;
				}
      } else if (/月/.test(time)) {
        year = time.split('月')[0].split('年')[0];
        month = parseInt(time.split('月')[0].split('年')[1]);
				if (month<10){
					month = '0'+month;
				}
      };
    };
  };

  reback.push(year + '-' + (month) + '-01 00:00:00');//当前月第一天

  if (month == '12') {
    reback.push(year + '-12-31 23:59:59');//当前月最后一天
  } else {
		let str = parseInt(month)+1;
		if (str<10){
			//str = '0'+str;
		}
    reback.push(parseTime(new Date(year + '/' + str + '/01').getTime()-8*60*60*1000 - 1, '{y}-{m}-{d}')+" 23:59:59");
  };
  return reback;
}

/* 将23:34:33转换成秒
 * 传入参数格式: "00:12:23"   "2018-09-12 00:12:23"
*/
export function exchangeToSecond(time) {
  let secondPart = [],
    seconds;
  if (/\s+/.test(time)) {
    //有空格
    secondPart = time.split(" ")[1].split(":");
  } else {
    secondPart = time.split(":");
  };
  return seconds = parseInt(secondPart[0]) * 3600 + parseInt(secondPart[1]) * 60 + parseInt(secondPart[2]);
}

/* 比较时间
 * 传入参数格式: "2018-09-12"   "2018-09-12 00:12:23"
*/
export function compareTime(time1, time2) {
  let startTime = parseTime(time1, '{y}-{m}-{d} {h}:{i}:{s}');
  let endTime = parseTime(time2, '{y}-{m}-{d} {h}:{i}:{s}');
  let seconds = new Date(startTime) - new Date(endTime);
  if (seconds > 0) {
    return 1;
  } else if (seconds == 0) {
    return 0;
  } else if (seconds < 0) {
    return -1;
  };
}

/* 补全单个数据
 * 传入参数格式: "1" ~ "9"
 * 输出:   "01" ~ "09"
*/
export function zeroPadding(val){
  if(parseInt(val)<10){
    return '0'+val;
  }else{
   return val;
 };
}


//如果数字含有小数部分，那么可以将小数部分单独取出
//将小数部分的数字转换为字符串的方法：

var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
    var chnUnitSection = ["","万","亿","万亿","亿亿"];
    var chnUnitChar = ["","十","百","千"];

function numToChn(num){
      var index =  num.toString().indexOf(".");
      if(index != -1){
          var str = num.toString().slice(index);
          var a = "点";
              for(var i=1;i<str.length;i++){
                     a += chnNumChar[parseInt(str[i])];
               }
          return a ;
      }else{
          return ;
      }
}

//定义在每个小节的内部进行转化的方法，其他部分则与小节内部转化方法相同
function sectionToChinese(section){
    var str = '', chnstr = '',zero= false,count=0;   //zero为是否进行补零， 第一次进行取余由于为个位数，默认不补零
    while(section>0){
         var v = section % 10;  //对数字取余10，得到的数即为个位数
         if(v ==0){                    //如果数字为零，则对字符串进行补零
             if(zero){
                 zero = false;        //如果遇到连续多次取余都是0，那么只需补一个零即可
                 chnstr = chnNumChar[v] + chnstr;
             }
         }else{
             zero = true;           //第一次取余之后，如果再次取余为零，则需要补零
             str = chnNumChar[v];
             str += chnUnitChar[count];
             chnstr = str + chnstr;
         }
         count++;
         section = Math.floor(section/10);
    }
    return chnstr;
}



//定义整个数字全部转换的方法，需要依次对数字进行10000为单位的取余，然后分成小节，按小节计算，当每个小节的数不足1000时，则需要进行补零

export function changeNumCap(num){
         var a = numToChn(num);
         num = Math.floor(num);
          var unitPos = 0;
          var strIns = '', chnStr = '';
          var needZero = false;

          if(num === 0){
                return chnNumChar[0];
          }
          while(num > 0){
                var section = num % 10000;
                if(needZero){
                  chnStr = chnNumChar[0] + chnStr;
                }
                strIns = sectionToChinese(section);
                strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
                chnStr = strIns + chnStr;
                needZero = (section < 1000) && (section > 0);
                num = Math.floor(num / 10000);
                unitPos++;
          }

         return chnStr;
}

//除字符串左右兩端的空額
export function stringTrim(str){
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

export function fileResizetoFile(file,quality,fn){
	  filetoDataURL (file,function(dataurl){
		dataURLtoImage(dataurl,function(image){
		  canvasResizetoFile(imagetoCanvas(image),quality,fn);
		})
	  })
	}
	function filetoDataURL(file,fn){
	  var reader = new FileReader();
	  reader.onloadend = function(e){
		fn(e.target.result);
	  };
	  reader.readAsDataURL(file);
	};
	function dataURLtoImage(dataurl,fn){
	  var img = new Image();
	  img.onload = function() {
		fn(img);
	  };
	  img.src = dataurl;
	};
	function canvasResizetoFile(canvas,quality,fn){
	  canvas.toBlob(function(blob) {
		fn(blob);
	  },'image/jpeg',quality);
	};
	function imagetoCanvas(image){
	  var cvs = document.createElement("canvas");
	  var ctx = cvs.getContext('2d');
	  cvs.width = image.width;
	  cvs.height = image.height;
	  ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
	  return cvs ;
	};
// 	//上面是图片的处理  下面就是调用了
// 	//因为我用的bootstrap的插件dropzone.js 所以是在它的添加文件的监听事件上处理的
// 	this.on("addedfile",function(file){//添加一个文件时的监听事件  在这里进行文件压缩
// 		//调用上面的方法
// 		fileResizetoFile(file,0.1,function(res){//第二个参数范围是 0~1 用于调整图片质量
// 			newfile.push(res);//这个newfile是我其他代码里定义的一个数组 把压缩的图片Blob一个个放进去
// 		})
// 	});
