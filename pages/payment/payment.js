// pages/payment/payment.js
var app = getApp();
let timer
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
    parkStatus:1,
    loginStatus:null,
    timeout:false
  },
  
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady:function(){
    // 页面渲染完成 
    var that = this
    
  },
  onShow:function(){
    // 页面显示
    console.log("onShow")
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo,
        openid:app.globalData.openid
      })

      if(that.data.userInfo==null || that.data.openid==null){
        console.log(that.data)
        app.getUserInfo(function(){
          //更新数据
          that.setData({
            userInfo:userInfo,
            openid:app.globalData.openid
          })
        })
      }
      // 调用登录请求
      app.login(that.data.userInfo, function(resp){
        // 处理登录后的返回数据
        console.log(resp)
        if(resp=="100"){
          wx.navigateTo({
            url: '/pages/carNoMgr/carNoMgr'
          })
        }else if(resp=="200"){
          that.setData({parkStatus:2})
        }else if(resp=="300"){
          // 用openid查询停车信息
          
          that.getParkInfo(that.data.openid,function(data){
            that.setData({
              parkStatus:3,
              carNumber : data.carNumber,
              parkTime : data.parkTime,
              parkLocation : data.parkLocation,
              fee : data.fee
            })
          })
        }else if(resp=="400"){
          wx.navigateTo({
            url: '/pages/countdown/countdown?from=login'
          })
        }
      })
      
    })
    
    // 设置页面1分钟后超时，需要下拉刷新
    timer=setTimeout(function(){
      that.setData({timeout:true})
    },60000)
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
  },
  // 监听下拉刷新
  onPullDownRefresh: function(){
    
    wx.stopPullDownRefresh()
    // console.log("触发了下拉刷新")
    timer && clearInterval(timer);
    this.setData({timeout:false})
    this.onShow()
  
  }
})


