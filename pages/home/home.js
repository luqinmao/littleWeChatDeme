var base = require('../../utils/base.js')
var app = getApp()
var page = 0

Page({
  data: {
    list: {},
  },
  onReady: function () {

    this.loadData()
  },
  //下拉刷新
  onPullDownRefresh: function () {

    this.loadData()

  },
  //上拉加载更多
  onReachBottom: function () {
       this.loadData(1)
  },
  loadData(status) {
    if (status) {
      page++
    } else {
      page = 1
    }

    var that = this
    base.getJson('http://wanandroid.com/article/list/' +page+'/json','GET', null, function (data) {
      console.log('h', data)
      that.setData({
        list: data.datas
      })
    })

  },
  //跳转事件处理函数
  toDetalView: function (event) {
    wx.navigateTo({
      url: '../home/articleDetail'
    });
  },
 
  //设置分享
  onShareAppMessage: function () {
    return {
      title: '每日最新舞蹈视频尽在酱游舞蹈',
      desc: '每日最新舞蹈视频',
      path: '/pages/home/home'
    }
  }
})