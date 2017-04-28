// pages/me/me.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    carNumber: null,
    userListInfo: [
      {
        icon: '../../image/iconfont-dingdan.png',
        text: '我的车牌号',
        isunread: false,
        unreadNum: 2
      },
      {
        icon: '../../image/iconfont-card.png',
        text: '优惠券',
        isunread: true,
        unreadNum: 2
      },
      // {
      //   icon: '../../image/iconfont-icontuan.png',
      //   text: '我的拼团',
      //   isunread: true,
      //   unreadNum: 1
      // },
      {
        icon: '../../image/iconfont-shouhuodizhi.png',
        text: '停车记录'
      },
      // {
      //   icon: '../../image/iconfont-kefu.png',
      //   text: '联系客服'
      // },
      {
        icon: '../../image/iconfont-help.png',
        text: '常见问题'
      }
    ]
  },
  onShow: function () {

    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    that.getDefaultCarNo(function (res) {
      that.setData({ carNumber: res[0].Address })
    })
  },
  navi0: function () {
    console.log("first clidk")
    wx.navigateTo({
      url: '../carNoMgr/carNoMgr',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  navi3: function () {
    wx.navigateTo({
      url: '../logs/logs',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  navi1: function () {
    wx.navigateTo({
      url: '../onsale/onsale',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  navi5: function () {
    wx.navigateTo({
      url: '../help/help',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  // 查询默认车牌号
  getDefaultCarNo: function (cb) {
    wx.request({
      url: 'http://localhost:8080/TingChe/servlet/GetCarNo',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        return typeof cb == "function" && cb(res.data)
      }
    })
  }
})