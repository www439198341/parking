//app.js

var svc = require("utils/services.js")
App({
  onLaunch: function () {
    var value = wx.getStorageSync("globaldata")
    if (value && value.token) {
      this.globalData = value
      svc.checkSession(value.token)
    } else {
      svc.login()
    }

    var that = this
    this.getUserInfo(function(res){
      that.globalData.userInfo=res
      
    })
  },
  // 注册登录请求
  login: function(userInfo,cb){
    var that = this
    wx.request({
      url: 'http://localhost:8080/TingChe/servlet/Login',
      data: {
        openid:this.globalData.openid,
        city:userInfo.city,
        country:userInfo.country,
        gender : userInfo.gender,
        language :userInfo.language,
        nickname : userInfo.nickName,
        province : userInfo.province
      },
      success: function(res){
        return typeof cb == "function" && cb(res.data)
      }
    })
  },
  // 获取用户信息请求
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            // 获取用户信息
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            })

            //发起网络请求，获取openid
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid:'wxda0ab9a7ac96de56',
                secret:'0c545d62b17459b6361629e154a70fd3',
                js_code:res.code,
                grant_type:'authorization_code'
              },
              success:function(res){
                // 获取openid
                that.globalData.openid=res.data.openid
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    openid:null,
    carNumber:null,
    token: "",
    newAddress:{},
    addressList:[],
    loginStatus:null
  }
})