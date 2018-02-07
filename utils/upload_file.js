var app = getApp()
var base = require('base.js')
function qiniuUpload(path, callback) {
  var callbackFunc = callback;


  //服务器请求token

  base.getJson('Common/qiniuToken', null, function (data) {
    console.log(data)

    //开始上传
    wx.uploadFile({
      url: 'https://upload.qbox.me', //仅为示例，非真实的接口地址
      filePath: path,
      name: 'file',
      formData: {
        'token': data.upToken
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          var data = res.data
          //do something
          callbackFunc(data);
        } else {
          wx.showToast({
            title: "上传失败",
            icon: 'loading',
            duration: 2000
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  })
}



module.exports = {
  qiniuUpload: qiniuUpload
}