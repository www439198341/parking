// pages/payment/payment.js
var app = getApp();
Page({
  data:{
    openid:null,
    carNumber:null,
    parkTime:null,
    parkLocation:null,
    fee:null  ,
    circleWidth:0,
    circleHeight:0,
    userInfo: {},
    parkStatus:null,
    loginStatus:null
  },
  
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      userInfo:app.globalData.userInfo,
      openid:app.globalData.openid
    })
  },
  onReady:function(){
    // 页面渲染完成 
  },
  onShow:function(){
    // 页面显示
    var that = this
    app.login(app.globalData.userInfo,function(res){
      // 处理登录后的返回数据
      //console.log(res)
      if(res=="100"){
        wx.navigateTo({
          url: '../carNoMgr/carNoMgr'
        })
      }else if(res=="200"){
        that.setData({parkStatus:2})
      }else if(res=="300"){
        // 用openid查询停车信息
        that.getParkInfo(that.data.openid,function(data){
            that.setData({
              carNumber:data.carNumber,
              parkTime:data.parkTime,
              parkLocation:data.parkLocation,
              fee:data.fee
            })
        })
      }else if(res=="400"){
        wx.navigateTo({
          url: '../countdown/countdown?from=login'
        })
      }
    })
    
    
    
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  getParkInfo : function(openid, cb){
    // 获取停车信息的方法
    wx.request({
      url:'http://localhost:8080/TingChe/servlet/Park',
      data:{
        openid:openid
      },
      success: function(res) {
        cb(res.data)
      }
    })
  },
  pay : function(e){
    // TODO 微信支付相关问题
    

    //console.log(e)
    wx.request({
      url: 'http://localhost:8080/TingChe/servlet/FirstPay',
      data: {
        carNumber:e.target.dataset.no
      },
      success: function(res){
        // success
        // TODO 调试用。后期需要修改成redirectTo
        wx.navigateTo({
          url: '../countdown/countdown?from=pay',
        })
      }
    })
  }
})


