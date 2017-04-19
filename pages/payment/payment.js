// pages/payment/payment.js
var app = getApp();
Page({
  data:{
     carNumber:'苏A·W526Z',
     parkTime:'1:25:38',
     parkLocation:'万达广场',
     fee:'5.5',
     circleWidth:0,
     circleHeight:0,
     userInfo: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })

wx.request({
      url:'http://localhost:8080/TingChe/servlet/Park',
      data:{
        carNumber:'苏A·W526Z'
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          parkTime:res.data
        })
      }
    })
    
  },
  onReady:function(){
    // 页面渲染完成
    
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})


