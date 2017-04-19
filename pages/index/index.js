Page({
  data:{
    flag : false,
    codeDis : false,
    phoneCode : "获取验证码",
    telephone : "",
    codePhone : ""
  },
  changeCode () {
      var _this = this
      let telephone = this.data.telephone
      if(telephone.length!= 11 || isNaN(telephone)){
          wx.showToast({
              title: '请输入有效的手机号码',
              icon : "loading"
          })
          setTimeout(function(){
              wx.hideToast()
          },2000)
          return
      }
      this.setData({
          codeDis : true
      })
      //发送短信验证码
      RQ.request({
          url:"******************",
          data :{
              phone : this.data.telephone
          },
          success : function(res){
              let data = res.data
              if(data.respCode != "000"){
                    _this.setData({
                        codeDis : false
                    })
                    wx.showToast({
                        title: data.respMessage,
                        icon : "loading"
                    })
                    setTimeout(function(){
                        wx.hideToast()
                    },2000)
               }else{
                    _this.setData({
                       phoneCode : 60
                    })
                    let time = setInterval(()=>{
                        let phoneCode = _this.data.phoneCode
                        phoneCode --
                        _this.setData({
                            phoneCode : phoneCode
                        })
                        if(phoneCode == 0){
                             clearInterval(time)
                             _this.setData({
                                  phoneCode : "获取验证码",
                                  flag : true
                             })
                        }
                    },1000)
               }
          }
      })


  },
  phoneinput (e) {
      console.log(e)
      let value = e.detail.value
      console.log(value)
      this.setData({
          telephone : value
      })
  },
  codeinput (e) {
      let value = e.detail.value
      console.log(value)
      this.setData({
          codePhone : value
      })
  }
})