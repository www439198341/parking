function apicall(path, args, callback, errcallback, timeoutcallback) {
    var app = getApp()
    var url = "https://www.yqt360.com/elect/" + path
    var params = { request: args }
    params.Token = app.globalData.token
    params.timestamp = Math.floor(Date.now() / 1000)
    wx.showToast({ icon: "loading" })
    wx.request({
        url: url,
        data: params,
        method: 'POST',
        success: function (res) {
            // if (res.data.errcode == 0) {
            //     callback(res.data.data)
            // } else if (res.data.errcode == 400) {
            //     wx.showModal({
            //         content: "会话超时，请重新登录",
            //         confirmText: "好的",
            //         showCancel: false,
            //         complete: function () {
            //             login(timeoutcallback)
            //         }
            //     })
            // }
            // else {
            //     if (errcallback != null && typeof (errcallback) === 'function') {
            //         errcallback(res)
            //     } else {
            //         wx.showModal({
            //             content: res.data.errmsg,
            //             confirmText: "知道了",
            //             showCancel: false
            //         })
            //     }

            // }
        },
        fail: function (res) {
            console.log(res)
            wx.showModal({
                title: "网络错误",
                content: "您的网络不给力，请稍后再试！",
                confirmText: "好的",
                showCancel: false
            })
        },
        complete: function () { wx.hideToast() }
    })
}

function login(callback) {
    //调用登录接口
    wx.login({
        success: function (res) {
            var app = getApp()
            wx.request({
                url: "https://www.yqt360.com/elect/login?code=" + res.code,
                success: function (result) {
                    // var data = result.data.data
                    // app.globalData.token = data.token
                    // wx.getUserInfo({
                    //     success: function (info) {
                    //         app.globalData.userInfo = info.userInfo
                    //         var arg = {
                    //             signature: info.signature,
                    //             encryptedData: info.encryptedData,
                    //             iv: info.iv
                    //         }
                    //         getUserInfo(arg, function (data) {
                    //             app.globalData.userInfo.Name = data.Name
                    //             app.globalData.userInfo.Mobile = data.Mobile
                    //             wx.setStorage({ key: 'globaldata', data: app.globalData })
                    //         })
                    //     }
                    // })
                    // if (callback != null && typeof (callback) === 'function') {
                    //     callback()
                    // } else {
                    //     wx.switchTab({ url: 'pages/index/index' })
                    // }

                }
            })
        }
    })
}

function checkSession(token) {
    wx.request({
        url: 'https://www.yqt360.com/elect/checksession?token=' + token,
        method: 'GET',
        success: function (res) {
            var result = res.data
            if (result.errcode == 0) {
                if (result.data.isTimeout) {
                    login()
                }
            } else {
                login()
            }
        },
        fail: function () {
            login()
        }
    })
}

function getUserInfo(req, callback) {
    apicall("userinfo", req, callback)
}
//获取下单页面配置信息
function getOrderConfig(callback) {
    apicall("order/config", {}, callback)
}
//获取用户订单
function fetchOrder(minid, status, fn) {
    apicall("order/fetch", { MinID: minid, Status: status }, fn)
}
//保存订单草稿
function saveOrder(order, fn) {
    apicall("order/save", order, fn)
}
//加载订单草稿
function loadDraft(orderid, fn) {
    apicall("order/loaddraft", {OrderID:orderid}, fn)
}
//订单信息确认
function checkOrder(serialno, fn) {
    apicall("order/check", { SerialNo: serialno }, fn)
}
//下单
function placeOrder(order, fn) {
    apicall("order/place", order, fn)
}
//获取待支付订单
function pendingPayOrder(fn) {
    apicall("order/pendingpay", {}, fn)
}
//获取订单支付信息
function paymentInfo(orderid, fn) {
    apicall("order/payindex", { OrderID: orderid }, fn)
}
//支付订单
function pay(orderid, formid, callback) {
    apicall("order/pay", { OrderID: orderid, FormID: formid }, callback)
}
//选择收货支付
function payOnReceipt(orderid, fn) {
    apicall("order/payonreceipt", { OrderID: orderid }, fn)
}
//签收
function signoff(orderid, fn) {
    apicall("order/signoff", { OrderID: orderid }, fn)
}
//取消订单
function cancelOrder(orderid, fn) {
    apicall("order/cancel", { OrderID: orderid }, fn)
}
//订单详情
function orderDetail(orderid, fn, errfn) {
    apicall("order/detail", { OrderID: orderid }, fn, errfn)
}

//获取用户常用地址
function getUserAddress(fn) {
    apicall("address/list", {}, fn)
}
//移除常用地址
function removeAddress(id, fn) {
    apicall("address/remove", { AddressID: id }, fn)
}
//设置默认地址
function setDefaultAddr(id, fn) {
    apicall("address/setdefault", { AddressID: id }, fn)
}

//添加零部件, 参数component： 零部件对象
function addComponent(component, fn) {
    apicall("component/add", component, fn)
}
//修改零部件信息
function updateComponent(component, fn) {
    apicall("component/update", component, fn)
}
//移除零部件对象
function removeComponent(id, fn) {
    apicall("component/remove", { ProductID: id }, fn)
}
//获取零部件详情
function detailComponent(id, fn) {
    apicall("component/detail", { ProductID: id }, fn)
}
//获取用户或所在公司下所有的零部件
function allComponent(fn, timeoutfn) {
    apicall("component/list", {}, fn, null, timeoutfn)
}
function uploadImg(path, fn) {
    wx.uploadFile({
        url: 'https://www.yqt360.com/elect/uploadimg',
        filePath: path,
        name: 'file',
        success: function (res) {
            fn(res.data)
        },
        fail: function (res) {
            console.error(res)
            wx.showModal({
                content: "图片上传失败，请稍后再试",
                confirmText: "知道了",
                showCancel: false
            })
        }
    })
}

function distance(p1, p2, fn) {
    wx.request({
        url: 'https://www.yqt360.com/elect/distance',
        data: { From: p1, To: p2 },
        method: 'POST',
        success: function (res) {
            var data = res.data
            if (data.errcode === 0) {
                fn(data.data)
            } else {
                wx.showModal({
                    title: "网络错误",
                    content: "您的网络不给力，请稍后再试！",
                    confirmText: "好的",
                    showCancel: false
                })
            }
        },
        fail: function () {
            wx.showModal({
                title: "网络错误",
                content: "您的网络不给力，请稍后再试！",
                confirmText: "好的",
                showCancel: false
            })
        }
    })
}

module.exports.rpc = apicall
//登录模块
module.exports.login = login
module.exports.getUserInfo = getUserInfo
module.exports.checkSession = checkSession
//订单模块
module.exports.orderConfig = getOrderConfig
module.exports.fetchOrder = fetchOrder
module.exports.saveOrder = saveOrder
module.exports.loadDraft = loadDraft
module.exports.checkOrder = checkOrder
module.exports.pendingPayOrder = pendingPayOrder
module.exports.placeOrder = placeOrder
module.exports.paymentInfo = paymentInfo
module.exports.pay = pay
module.exports.payOnReceipt = payOnReceipt
module.exports.signoff = signoff
module.exports.cancelOrder = cancelOrder
module.exports.orderDetail = orderDetail
//地址模块
module.exports.getUserAddress = getUserAddress
module.exports.removeAddress = removeAddress
module.exports.setDefaultAddr = setDefaultAddr
//上传图片
module.exports.uploadImg = uploadImg
//计算距离
module.exports.distance = distance
//零部件管理模块
module.exports.addComponent = addComponent
module.exports.updateComponent = updateComponent
module.exports.removeComponent = removeComponent
module.exports.allComponent = allComponent
module.exports.detailComponent = detailComponent