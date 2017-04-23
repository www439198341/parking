// pages/addresslist/addresslist.js
var svc = require("../../utils/services.js")
Page({
  data:{
    isEdit:false,
    addressList:[{"Address":"苏A·W526Z"},{"Address":"京A·12345"},{"Address":"沪C·88888"}],
    editIndex:0,
    delBtnWidth:150//删除按钮宽度单位（rpx）
  },
  onLoad:function(options){
    var that = this
    svc.getUserAddress(function (res) {
      that.setData({
        addressList : res
      })
    });
  },
  onShow:function(){
    var that = this
    var list = that.data.addressList;
    wx.getStorage({
      key: 'newAddress',
      success: function(res) {
       var item = {
          Contact:res.data.Contact,
          Mobile:res.data.Mobile,
          Address:res.data.Address
        }
        list.push(item)

        that.setData({
          addressList:list
        })

        wx.removeStorage({
          key: 'newAddress'
        })
      } 
    })

    wx.getStorage({
      key: 'editAddress',
      success: function(res) {
        var data = res.data || []
        var address = that.data.addressList[that.data.editIndex]
        if (data.length != 0) {
          address.Contact = data.Contact
          address.Mobile = data.Mobile
          address.Address = data.Address
        }
        var addressList = that.data.addressList;
        addressList[that.data.editIndex] = address;
        that.setData({
          addressList:addressList
        })

        wx.removeStorage({
          key: 'editAddress'
        })
      } 
    })
  },
  //添加新地址
  addAddress:function(e){
    wx.navigateTo({
      url: '/pages/addressadd/addressadd?action=add'
    })
  },
  //修改地址
  editAddress:function(e){
    var that = this
    that.data.editIndex = e.currentTarget.dataset.index;
    wx.setStorage({
      key: 'editAddress',
      data: that.data.addressList[that.data.editIndex]
    })

    wx.navigateTo({
      url: '/pages/addressadd/addressadd?action=edit'
    })
  },
  //选择本次使用的地址
  selUseAddress:function(e){
    var that = this
    var index = e.currentTarget.dataset.index;
    wx.setStorage({
      key: 'selAddress',
      data: that.data.addressList[index]
    })

    wx.navigateBack({
      url: '/pages/checkexternal/checkexternal'
    })
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
       addressList:list
      });
    
  }

})
