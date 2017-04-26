// pages/payment/payment.js
var app = getApp();
Page({
  data:{
     carNumber:'苏A·W526Z',
     parkTime:null,
     parkLocation:null,
     fee:null  ,
     circleWidth:0,
     circleHeight:0,
     userInfo: {},
     parkStatus:null
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
    var that = this
    
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      console.log(userInfo)
      console.log(app.globalData.openid)
      that.login(userInfo,function(res){
        // TODO 处理登录后的返回数据
        console.log(res)
        if(res==100){
          wx.navigateTo({
            url: '../carNoMgr/carNoMgr'
          })
        }else if(res==200){
          that.setData({parkStatus:2})
        }else{
          that.setData({parkStatus:3})
        }
        
      })
    })

    this.getParkInfo(that.data.carNumber,function(data){
        //console.log(data)

        that.setData({
          carNumber:data.carNumber,
          parkTime:data.parkTime,
          parkLocation:data.parkLocation,
          fee:data.fee
        })
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  getParkInfo : function(carNumber, cb){
    // 获取停车信息的方法
    wx.request({
      url:'http://feigebbm.tk:8080/TingChe/servlet/Park',
      data:{
        carNumber:carNumber
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
      url: 'http://feigebbm.tk:8080/TingChe/servlet/FirstPay',
      data: {
        carNumber:e.target.dataset.no
      },
      success: function(res){
        // success
        wx.redirectTo({
          url: '../countdown/countdown',
        })
      }
    })
  },
  login: function(userInfo,cb){
    wx.request({
        url: 'http://localhost:8080/TingChe/servlet/Login',
        data: {
          openid:app.globalData.openid,
          city:userInfo.city,
          country:userInfo.country,
          gender : userInfo.gender,
          language :userInfo.language,
          nickname : userInfo.nickname,
          province : userInfo.province
        },
        success: function(res){
          return typeof cb == "function" && cb(res.data)
        }
      })
  }
})


