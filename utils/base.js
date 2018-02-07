

//用户信息
var app = getApp()
function getData() {
  var memberData = wx.getStorageSync('memberData')
    var arr = {
        memberId: memberData.id,
        memberData: memberData
    }
    return arr
}


        
function timeago(time) {
	//JavaScript函数：
	var minute = 1000 * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var halfamonth = day * 15;
	var month = day * 30;

	var dateTimeStamp = Date.parse(time.replace(/-/gi, "/"))
	var now = new Date().getTime();
	var diffValue = now - dateTimeStamp;
	if (diffValue < 0) {
		//若日期不符则弹出窗口告之
		//alert("结束日期不能小于开始日期！");
	}
	var monthC = diffValue / month;
	var weekC = diffValue / (7 * day);
	var dayC = diffValue / day;
	var hourC = diffValue / hour;
	var minC = diffValue / minute;
	var ct = this.formatTime(time)

		if (monthC >= 1) {
			result = ct
		} else if (weekC >= 1) {
			result = ct
		} else if (dayC >= 1) {
			result = parseInt(dayC) + "天前";
		} else if (hourC >= 1) {
			result = parseInt(hourC) + "小时前";
		} else if (minC >= 1) {
			result = parseInt(minC) + "分钟前";
		} else {
			result = "刚刚";
		}

	
	return result;
}

function getTimeDay(date) {
    if (date) {
        var EndTime = new Date(date);
        //截止时间 前端路上 http://www.51xuediannao.com/qd63/

        var NowTime = new Date();
        var t = EndTime.getTime() - NowTime.getTime();


        var d = Math.floor(t / 1000 / 60 / 60 / 24) + 1;
        if (d < 0) {
            d = 0
        }
        return d;
    } else {
        return 0;
    }
}

//时间比较格式化
function toDate(str) {
    var sd = str.split("-");
    console.log(sd)
    return new Date(sd[0], parseInt(sd[1]), parseInt(sd[2]));
}

function toTime(str) {
    var sd = str.split("-");
    console.log(sd)
    return new Date(sd[0], parseInt(sd[1]), parseInt(sd[2]));
}


var dateToTime = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};

//文件缓存
function imgCache(url) {
    var url_local = wx.getStorageSync('img_' + url)
    if (!url_local) {
        wx.downloadFile({
            url: url,
            success: function (res) {
                var tempFilePath = res.tempFilePath
                wx.saveFile({
                    tempFilePath: tempFilePath,
                    success: function (res) {
                        wx.setStorageSync('img_' + url, res.savedFilePath)
                    }
                })
            }
        })
        // console.log(1)
        return url
    } else {
        //  console.log(2+url_local)
        return url_local
    }
}

//时间格式优化
function formatTime(date, index) {
    var s = date.split(' ')
    if (index) {
        return s[1]
    } else {
        return s[0]
    }
}


//显示loading
function showLoading(title){
    wx.showLoading({
        title:title,
        mask:true
    })
}

//网络请求封装
function getJson(url,method, post_data, callback ) {
    wx.request({
      url: url,
      data: post_data,
      method: method,
      dataType: 'JSON',
      header: {
        // 'Authorization': wx.getStorageSync('authorization'),
        // 'content-type': 'application/json',
        // 'Accept': 'application/vnd.jamyo.jamyoLiteV1+json'
      },
      success: function (data) {
        // console.log(url + ':' + JSON.stringify(data))
        if (typeof data.data == 'string') {
          var res = JSON.parse(data.data.replace(/(^\s+)|(\s+$)/g, ""))
        } else {
          var res = data.data
        }


        if (res.errorCode == 0) {
          // if (url =="Member/login"){
          //   wx.setStorageSync('authorization', data.header.Authorization[0])
          // }
          callback(res.data)
        } else {
          // console.log(url + '状态码：' + res.status)

          console.log(url + '状态码错误：' + JSON.stringify(data))
          wx.showToast({
            title: res.message,
            image: '../../image/warning.png',
            duration: 1500
          })
        }
      },
      fail: function (data) {
        console.log(url + '失败:' + JSON.stringify(data))
      }
    })
  
}

//发送模版消息
function sendTempMsg(openid, tempid, page, form_id, data) {
    console.log(openid)
    console.log(tempid)
    console.log(page)
    console.log(form_id)
    console.log(data)
    //服务器请求token
    wx.request({
        url: 'https://jamyo.jamyooo.com/Lite/Common/access_token/',
        data: {
            member_id: wx.getStorageSync('member_id'),
            token: wx.getStorageSync('token'),
        },
        header: app.header_url,
        success: function (res) {
            console.log(data)
            //发送消息
            wx.request({
                url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + res.data.data,
                data: {
                    touser: openid,
                    template_id: tempid,
                    page: page,
                    form_id: form_id,
                    data: data,
                    emphasis_keyword: "keyword1.DATA"
                },
                header: app.header_url,
                method: 'POST',
                success: function (res) {
                    console.log(res)
                }
            })
        }
    })


}

//两个json合并
function jsonCombine(jsonObject1, jsonObject2) {
    var resultJsonObject = {};

    for (var attr in jsonObject1) {
        resultJsonObject[attr] = jsonObject1[attr];
    }

    for (var attr in jsonObject2) {
        resultJsonObject[attr] = jsonObject2[attr];
    }

    return resultJsonObject
}

module.exports = {
    getMemberData: getData,
    imgCache: imgCache,
    formatTime: formatTime,
    toDate: toDate,
    dateToTime: dateToTime,
    sendTempMsg: sendTempMsg,
    getTimeDay: getTimeDay,
    getJson: getJson,
    showLoading:showLoading,
    timeago:timeago
}


