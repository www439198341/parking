// pages/addresslist/addresslist.js
var svc = require("../../utils/services.js")
var app = getApp();
Page({
  data:{
    whatsBottom:null,//1--添加新车牌；2--确定；3--目前您只能添加3个车牌
    isEdit:[],
    addressList:null,
    editIndex:0,
    delBtnWidth:150//删除按钮宽度单位（rpx）
  },
  onLoad:function(options){
    var that = this
    // TODO 查询后台数据库，获得列表
    that.getCarNo(function(res){
      that.setData({addressList:res})
    })
  },
  onReady:function(){
    var that = this
    // 页面加载完成后，为isEdit数组所有元素初始化赋值false
    var newIsEdit = new Array(that.data.addressList.length);
    for(var i=0;i<newIsEdit.length;i++){
      newIsEdit[i]=false
    }
    that.setData({isEdit:this.data.isEdit.concat(newIsEdit)})
    // 页面加载完成后，判断addressList数组长度，决定whatsBottom取值为1或3
    var numWhatsBottom
    if(that.data.addressList.length==3){
      numWhatsBottom=3
    }else{
      numWhatsBottom=1
    }
    that.setData({whatsBottom:numWhatsBottom})
  },
  // 添加车牌号，输入框输入时，判断输入是否合法，并进行相应逻辑处理
  inputcarno : function(e){
    var that = this
    var no = e.detail.value
    if(e.detail.value.length==7){
      //合法车牌，插入一个点，然后记录
      var a = no.substr(0,2)
      var b = no.substr(2,5)
      no=a+'·'+b
      this.data.addressList.push({"Address":no})
      that.setData({addressList:this.data.addressList})
    }else{
      //非法车牌，提示错误
      wx.showModal({
        title: '提示',
        content: '车牌号不符合要求，请检查后重新输入！',
        showCancel:false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
    
  },
  //添加新地址,// 输入完需要添加的车牌号后，点击最下面确定按钮时
  addAddress:function(e){
    var that = this
    if(that.data.whatsBottom == 1){
      that.setData({whatsBottom:2})
    }else if(that.data.whatsBottom == 2){
      
      if(that.data.addressList.length ==3){
        that.setData({whatsBottom:3})
      }else{
        that.setData({whatsBottom:1})
      }
    }
  },
 
  
  
  // 在修改地址时，绑定当输入框失去焦点时触发的函数，修改数组
  editConfirm:function(e){
    var that = this
    this.data.addressList[e.target.dataset.index].Address=e.detail.value
    that.setData({
      addressList:this.data.addressList
    })
    
  },
  //修改地址
  editAddress:function(e){
    var that = this
    this.data.isEdit[e.currentTarget.dataset.index]=!this.data.isEdit[e.currentTarget.dataset.index]
    that.setData({
      isEdit:this.data.isEdit
    })

  },
  // 设为默认车牌
  setDefaultAddress: function(e){
    this.touchE(e)
    var defaultIndex = e.currentTarget.dataset.index
    var defaultNo = this.data.addressList[defaultIndex]
    // 数组中剔除该元素，然后把该元素设置在首位
    this.data.addressList.splice(defaultIndex,1)
    var newAddress = [defaultNo]
    this.data.addressList = newAddress.concat(this.data.addressList)
    this.setData({addressList:this.data.addressList})
    
  },
  //选择本次使用的地址
  selUseAddress:function(e){
    console.log("look at me")
    console.log(e)
    var that = this
    var index = e.currentTarget.dataset.index;
    
  },
  touchS:function(e){
    console.log("touchS");
    if(e.touches.length==1){
      this.setData({
        //设置触摸起始点水平方向位置
        startX:e.touches[0].clientX
      });
    }
  },
  touchM:function(e){
      console.log("touchM:"+e);
    var that = this
    if(e.touches.length==1){
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = that.data.startX - moveX;
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if(disX == 0 || disX < 0){//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      }else if(disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-"+disX+"px";
        if(disX>=delBtnWidth){
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-"+delBtnWidth+"px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.addressList;
      list[index].txtStyle = txtStyle; 
      //更新列表的状态
      this.setData({
       addressList:list
      });
    }
  },

  touchE:function(e){
      console.log("touchE");
    var that = this
    if(e.changedTouches.length==1){
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth/2 ? "left:-"+delBtnWidth+"px":"left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.addressList;
      list[index].txtStyle = txtStyle; 
      //更新列表的状态
      that.setData({
       addressList:list
      });
    }
  },delItem:function(e){
        var index = e.target.dataset.index;
         var list = this.data.addressList;
         list.splice(index,1);

         this.setData({
       addressList:list,
       whatsBottom:1
      });
    
  },
  onUnload:function () {
    //页面关闭
    // 判断至少存在一个车牌号，否则不允许离开页面
    if(this.data.addressList.length==0){
      wx.showModal({
        title: '提示',
        content: '继续使用前，必须添加一个车牌号',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
             wx.navigateTo({
              url: '../carNoMgr/carNoMgr'
            })
          } 
        }
      })
     
    }
    //TODO 页面关闭，调用方法，向后台同步车牌号数据
    wx.request({
      url: 'http://localhost:8080/TingChe/servlet/UpdateCarNo',
      data: {
        addressList:this.data.addressList,
        openid:app.globalData.openid
      }
    })
  },
  // 查询车牌号信息的方法
  getCarNo :　function(cb){
    wx.request({
      url: 'http://localhost:8080/TingChe/servlet/GetCarNo',
      data: {
        openid:app.globalData.openid
      },
      success: function(res){
        return typeof cb == "function" && cb(res.data)
      }
    })
  }
})
