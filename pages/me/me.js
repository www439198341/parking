// pages/me/me.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto1: '车牌管理',
    motto2: '停车记录',
    motto3: '停车券',
    motto4: '帮助',
    userInfo: {},
    carNumber:'苏A·W526Z'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  carNoMgr : function(){
    wx.navigateTo({
      url: '../carNoMgr/carNoMgr',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  logs:function(){
    wx.navigateTo({
      url: '../logs/logs',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  onsale:function(){
    wx.navigateTo({
      url: '../onsale/onsale',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  help:function(){
    wx.navigateTo({
      url: '../help/help',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  }
})