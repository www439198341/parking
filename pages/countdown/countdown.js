const util = require('../../utils/util.js')
const defaultLogName = {
  work: '工作'
}

const initDeg = {
  left: 45,
  right: -45,
}

Page({

  data: {
    countTime:'0.50',
    remainTimeText: '',
    timerType: 'work',
    log: {},
    completed: false,
    isRuning: false,
    leftDeg: initDeg.left,
    rightDeg: initDeg.right
  },
  onLoad:function(ops){
    //在触发onload时，判断ops是从哪里跳转过来。
    // 如果是用户主动付款之后过来的，则ops.from=pay，此时应从完整的15min倒计时
    // 如果用户是登陆时直接被跳转至该页面，则ops.from=login，此时应从缓存中加载
    if(ops.from=="pay"){
      // 设置倒计时时间为15min，并且将缓存中completed置为false
      this.setData({countTime:'0.50'})
    }else if(ops.from=="login"){

      // 从缓存中取出completed的取值。这个值的真假，代表了倒计时是否结束，以及视图层应该显示的内容。
      this.setData({completed:wx.getStorageSync("completed")})
      if (this.data.completed) return
      // 获取触发unload时的时间点
      var unloadTime = wx.getStorageSync('unloadTime')
      // 获取触发onshow时，即当前时间点
      var showTime = new Date()
      // 获取触发unload时，记录的剩余倒计时时间
      var remainTimeUnload = wx.getStorageSync('remainTimeUnload')
      //var endTime = new Date("1970/01/01 "+time+":00");
      // 把剩余倒计时时间进行格式转换，字符串--->时间
      var endtime = new Date("1970/01/01 00:" + remainTimeUnload)

      // 计算触发onshow时，即当前剩余倒计时时间，返回时间格式
      var timestamp = new Date(endtime - (showTime - unloadTime))

      console.log("look at me"+timestamp)

      // 把返回的时间格式剩余倒计时，转换为小数格式
      // 获取分钟部分
      console.log(timestamp.getMinutes())
      // 获取秒部分，并转换为2位小数
      console.log((timestamp.getSeconds()/60).toFixed(2).substr(-3))
      // 组合整数部分和小数部分
      var remainTimeFromStorage = timestamp.getMinutes()+(timestamp.getSeconds()/60).toFixed(2).substr(-3)
      this.setData({countTime:remainTimeFromStorage})
    }
    
  },

  onShow: function() {
    if (this.data.isRuning) return
    if (this.data.completed) return
    let workTime = util.formatTime(this.data.countTime, 'mm:ss')
    // 此时的workTime是一个小数，接下来的setData中，remainTimeText需要 mm:ss 的字符串形式。所以需要做转换。
    // 获得workTime的整数部分，这一部分就是分钟数
    var m = workTime.substr(0,2)
    // 获得workTime的小数部分，再乘以0.6得到秒数，再取整，再补0
    var s = util.formatTime((workTime.substr(-2)*0.6).toFixed(0),'ss')
    var text = m +":" + s
    this.setData({
      workTime: workTime,
      remainTimeText: text
    })
    this.startTimer()
  },

  onUnload : function(){
    console.log("onUnload")
    
    try {
      wx.setStorageSync('unloadTime', new Date())
      wx.setStorageSync('remainTimeUnload', this.data.remainTimeText)
      // 把倒计时是否结束的信息写入缓存
      wx.setStorageSync('completed', this.data.completed)
    } catch (e) {  
      console.log(e)  
    }
  },

  startTimer: function(e) {
    
    let startTime = Date.now()
    let isRuning = this.data.isRuning
    let timerType = 'work'
    let showTime = this.data[timerType + 'Time']
    let keepTime = showTime * 60 * 1000
    let logName = this.logName || defaultLogName[timerType]

    if (!isRuning) {
      this.timer = setInterval((function() {
        this.updateTimer()
      }).bind(this), 1000)
    } else {
      this.stopTimer()
    }

    this.setData({
      isRuning: !isRuning,
      completed: false,
      timerType: timerType,
      //remainTimeText: showTime,
      taskName: logName
    })
    
    this.data.log = {
      name: logName,
      startTime: Date.now(),
      keepTime: keepTime,
      endTime: keepTime + startTime,
      type: timerType
    }
  },



  stopTimer: function() {
    // reset circle progress
    this.setData({
      leftDeg: initDeg.left,
      rightDeg: initDeg.right,
      completed: true
    })

    // clear timer
    this.timer && clearInterval(this.timer)
    // 把缓存中completed置为true
    wx.setStorageSync('completed', true)
    
  },

  updateTimer: function() {
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((log.endTime - now) / 1000)
    let H = util.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    let halfTime

    // update text
    if (remainingTime > 0) {
      let remainTimeText = (H === "00" ? "" : (H + ":")) + M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      this.setData({
        completed: true
      })
      this.stopTimer()
      return
    }

    // update circle progress
    halfTime = log.keepTime / 2
    if ((remainingTime * 1000) > halfTime) {
      this.setData({
        leftDeg: initDeg.left - (180 * (now - log.startTime) / halfTime)
      })
    } else {
      this.setData({
        leftDeg: -135
      })
      this.setData({
        rightDeg: initDeg.right - (180 * (now - (log.startTime + halfTime)) / halfTime)
      })
    }
  }
})
