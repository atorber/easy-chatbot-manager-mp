// page/index/index.js
import CustomPage from '../base/CustomPage'

const base64 = require('../images/base64')

var {
  Client,
  Message
} = require('../../util/paho-mqtt')

const IoTCoreId = 'alvxdkj'
const DeviceKey = 'mpclient'
const DeviceSecret = 'sIQmoZzHwRYLfEUL'

const userName = IoTCoreId + '/' + DeviceKey
const password = DeviceSecret
const clientid = DeviceKey
const host = `${IoTCoreId}.iot.gz.baidubce.com`
const events_topic = `$iot/7813159edb154cb1a5c7cca80b82509f/events`
const msg_topic = `$iot/7813159edb154cb1a5c7cca80b82509f/msg`

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latestMsg: {
      "1": {
        name: '大师',
        text: '在吗',
        image: '',
        ts: 0
      },

      "2": {
        name: '超哥',
        text: '在吗在啊在啊',
        image: '',
        ts: 0
      }
    }
  },
  toHome(e) {
    console.debug(e)
    wx.navigateTo({
      url: '/page/weui/example/emoji/emoji',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    this.setData({
      icon20: base64.icon20,
      icon60: base64.icon60
    })
    this.doConnect()
    wx.getStorage({
      key: 'latestMsg',
      success(res) {
        console.log(res.data)
        that.setData({
          latestMsg: res.data
        })
      }
    })
  },

  doConnect: function () {
    var that = this;

    if (that.data.client && that.data.client.isConnected()) {
      wx.showToast({
        title: '不要重复连接'
      })
      return
    } else {
      that.setData({
        is_connect: false
      })
    }

    var useSSL = true
    var cleanSession = false
    var keepAliveInterval = 60
    var timeout = 30
    var port = 443
    var reconnect = false

    if (!(host && clientid && password && userName && port)) {
      wx.showToast({
        title: '有必填项为空',
      })
      return
    }

    var client = new Client(host, port, clientid);

    var connect_info = {
      timeout,
      userName,
      password,
      keepAliveInterval,
      cleanSession,
      useSSL,
      reconnect,
      onSuccess: function () {
        console.debug('success')
        wx.showToast({
          title: '连接成功'
        })
        that.setData({
          is_connect: true
        })

        that.data.client = client
        that.setOnMessageArrived(that.getmsg)
        that.setOnConnectionLost(that.connectionLost)

        client.onMessageArrived = function (msg) {
          if (typeof that.data.onMessageArrived === 'function') {
            return that.data.onMessageArrived(msg)
          }
        }

        client.onConnectionLost = function (responseObject) {
          if (typeof that.data.onConnectionLost === 'function') {
            return that.data.onConnectionLost(responseObject)
          }
          if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
          }
        }

        that.doSubscribe(events_topic)


      },
      onFailure: err => {
        console.debug('fail', err)
        wx.showToast({
          title: '连接失败'
        })
      }
    }

    client.connect(connect_info);
  },
  dodisConnect: function (e) {

    var that = this
    that.setData({
      connect_info: ''
    })
    console.debug(that.data.client)
    that.data.client.disconnect()

  },
  subscribe: function (filter, subscribeOptions) {
    // 订阅
    var that = this
    var client = that.data.client;

    if (client && client.isConnected()) {
      wx.showToast({
        title: '订阅成功'
      })
      return client.subscribe(filter, subscribeOptions);
    } else {
      wx.showToast({
        title: '订阅失败',
        icon: 'warn',
        duration: 2000
      })
    }


  },
  unsubscribe: function (filter) {
    // 订阅
    var that = this
    var client = that.data.client;
    if (client && client.isConnected()) {
      wx.showToast({
        title: '取消订阅成功'
      })
      return client.unsubscribe(filter);
    } else {
      wx.showToast({
        title: '取消失败',
        icon: 'warn',
        duration: 2000
      })
    }

  },
  publish: function (topic, json_message, qos = 0, retained = false) {
    // 发布
    var client = this.data.client;
    if (client && client.isConnected()) {
      var payload = json_message
      var message = new Message(json_message);
      message.destinationName = topic;
      message.qos = qos;
      message.retained = retained;
      var time_text = new Date().toUTCString()
      var sub_msg = this.data.sub_msg ? time_text + ':' + '\npub\n' + topic + '\n' + JSON.stringify(payload) + '\n\n' + this.data.sub_msg : time_text + ':' + '\npub\n' + topic + '\n' + JSON.stringify(payload)
      if (sub_msg.length > 1024 * 16) {
        sub_msg = sub_msg.substring(0, 1024 * 1)
        console.debug('减小了...', sub_msg.length)

      } else {
        console.debug('继续...', sub_msg.length)
      }
      this.setData({
        sub_msg
      })

      // wx.showToast({
      //   title: '发布成功'
      // })
      this.setData({
        pubing: true
      }, res => {
        this.setData({
          pubing: false
        })
      })
      return client.send(message);
    }
    wx.showToast({
      title: '发送失败',
      icon: 'success',
      duration: 2000
    })
  },
  setOnMessageArrived: function (onMessageArrived) {
    if (typeof onMessageArrived === 'function') {
      this.data.onMessageArrived = onMessageArrived
    }
  },
  setOnConnectionLost: function (onConnectionLost) {
    var that = this
    if (typeof onConnectionLost === 'function') {
      this.data.onConnectionLost = onConnectionLost

    }
  },
  connectionLost(e) {
    var that = this
    console.debug('失去连接', e)
    wx.closeSocket()
    that.setData({
      is_connect: false
    })

  },
  getmsg(e) {
    console.debug('订阅到消息', e)
    var that = this
    var time_text = new Date().toUTCString()
    let latestMsg = that.data.latestMsg
    let payload = JSON.parse(e.payloadString)
    let msg = payload.events.message
    latestMsg[msg.room.id || msg.talker.id] = msg
    // latestMsg[msg.room.id || msg.talker.id].text = msg.text.slice(0, 18)
    this.setData({
      latestMsg
    })
    wx.setStorage({
      key: "latestMsg",
      data: latestMsg
    })
  },
  doSubscribe: function (topic) {
    var that = this
    this.subscribe(topic, {
      qos: 0
    })
  },
  doPublish: function () {
    var that = this
    var topic = msg_topic
    var reported = {}
    reported.userInfo = this.data.userInfo
    reported[this.data.systemInfo.platform] = this.data.systemInfo

    reported.latitude_bd = this.data.location.latitude
    reported.longitude_bd = this.data.location.longitude

    reported.latitude = this.data.latitude
    reported.longitude = this.data.longitude

    reported.location = this.data.location

    var payload = {
      "requestId": new Date().getTime(),
      "reported": reported
    }
    payload = JSON.stringify(payload)
    console.debug(payload)

    this.publish(topic, payload, 0, false)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})