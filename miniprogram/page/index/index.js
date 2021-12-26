// page/index/index.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

const util = require('../../util/util')
const tobase64 = require('../../util/base64')
// 加密
console.log(util.Encrypt('123456'))
// 5A09AE89579945B7AB80A9DC08F66FAA
// 解密
console.log(util.Decrypt('5A09AE89579945B7AB80A9DC08F66FAA'))
// 123456

let header = {}

wx.request({
  method: 'GET',
  url: 'https://api.airtable.com/v0/applclZm5iXmTphEu/ChatRecord',
  header: {
    'Authorization': 'Bearer keypHmMOxLky9wU8T',
    'X-Airtable-Client-Secret': 'foo-123123'
  },
  success: res => {
    console.debug('airtable==============', res)
  },
  fail: err => {
    console.error(err)
  }
})

var protobuf = require('../../weichatPb/protobuf.js');
app.globalData._protobuf = protobuf;

var messageConfig = require('./message');
var MessageRoot = protobuf.Root.fromJSON(messageConfig);
var MessageMessage = MessageRoot.lookupType("Message");

function test1() {
  let properties = {
    "sn": "ABC0000001",
    "firmware_version": 1.2,
    "location": { "latitude": 80.001, "longitude": 120.1 },
  }
  let cur_time = new Date().getTime()
  properties = JSON.stringify(properties)
  var payload = {
    "reqId": 'xxxxxxxxxxx',
    "method": "thing.property.post",
    "version": "1.0",
    "timestamp": String(cur_time),
    "timeHms": "2021-12-1",
    "properties": properties
  }
  console.debug(payload)
  var message = MessageMessage.create(payload);
  var buffer = MessageMessage.encode(message).finish();
  console.log("buffer", buffer);

  // buffer = util.Encrypt(buffer)
  // buffer = util.Decrypt(buffer)
  // console.log(buffer)

  var deMessage = MessageMessage.decode(buffer);
  deMessage.properties = JSON.parse(deMessage.properties)
  deMessage.timestamp = Number(deMessage.timestamp)
  console.log("deMessage", deMessage);
}

test1()

var {
  Client,
  Message
} = require('../../util/paho-mqtt')

// const IoTCoreId = 'alvxdkj'
let DeviceKey = 'mpclient'
// const DeviceSecret = 'sIQmoZzHwRYLfEUL'

let username = ''
let password = ''
const clientid = "mp_chatbot_" + new Date().getTime()
const host = 'baiduiot.iot.gz.baidubce.com'
var port = 443
let events_topic = `$iot/${DeviceKey}/events`
let msg_topic = `$iot/${DeviceKey}/msg`

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxid: '',
    inter: '',
    latestMsgArr: ['1', '2'],
    latestMsg: {
      "1": {
        name: '大师',
        text: '在吗',
        image: '',
        ts: '21:59',
        count: 0
      },
      "2": {
        name: '超哥',
        text: '在吗在啊在啊',
        image: '',
        ts: '16:45\n昨天',
        count: 5
      }
    }
  },
  toHome(e) {
    console.debug(e)
    let that = this
    let wxid = e.currentTarget.dataset.wxid
    let msg = e.currentTarget.dataset.msg
    that.setData({
      wxid
    })
    wx.navigateTo({
      url: '/page/chat/index?wxid=' + wxid,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log('acceptDataFromOpenedPage', data)
          that.doPublish(data.comment)
        },
        someEvent: function (data) {
          console.log('someEvent', data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { msg, wxid })
        that.eventChannel = res.eventChannel
        // that.startInter()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.debug(res)
        let user = res.result
        that.setData({
          user
        }, res => {

          db.collection('secret')
            .doc(user.openid)
            .get()
            .then(res => {
              console.debug(res)
              let secret = res.data
              username = secret.mqtt.username
              password = secret.mqtt.password
              DeviceKey = secret.mqtt.DeviceKey
              events_topic = `$iot/${DeviceKey}/events`
              msg_topic = `$iot/${DeviceKey}/msg`
              header = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secret.vika.token}`
              }
              app.globalData.secret = secret
              that.setData({
                secret
              })
              if (secret.mqtt) {
                this.doConnect()
              }
            })
            .catch(err => {
              console.error(err)
              wx.showToast({
                title: '请初始化配置',
              })
            })
        })
      },
      fail: console.error
    })
    wx.cloud.callFunction({
      name: 'checkconfig',
      data: {},
      success: res => {
        console.debug(res)
        app.globalData.vika = res.result
        that.setData({
          vika: res.result
        })
      },
      fail: err => {
        console.error(err)
      }
    })
    wx.getStorage({
      key: 'latestMsg',
      success(res) {
        // console.log(res.data)
        that.setData({
          latestMsg: res.data
        })
      }
    })
    wx.getStorage({
      key: 'latestMsgArr',
      success(res) {
        // console.log(res.data)
        that.setData({
          latestMsgArr: res.data
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
    var cleanSession = true
    var keepAliveInterval = 60
    var timeout = 30
    var reconnect = false

    if (!(host && clientid && port)) {
      wx.showToast({
        title: '有必填项为空',
      })
      return
    }

    var client = new Client(host, port, clientid);

    var connect_info = {
      timeout,
      userName: username,
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
        title: '已上线'
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
    try {
      wx.closeSocket()
    } catch (err) {
      console.error(err)
    }
    that.setData({
      is_connect: false
    }, res => {
      that.doConnect()
    })

  },
  /**
 * 启动定时器
 */
  startInter: function () {
    var that = this;
    that.data.inter = setInterval(
      function () {
        // TODO 你需要无限循环执行的任务
        console.log('setInterval 每过500毫秒执行一次任务')
        if (that.eventChannel) {
          that.eventChannel.emit('acceptDataFromOpenerPage', { data: new Date().getTime() })
        }
      }, 3000);
  },

  /**
   * 结束定时器
   */
  endInter: function () {
    var that = this;
    that.clearInterval(that.data.inter)
  },
  getmsg(e) {
    console.debug('订阅到消息', e)
    var that = this
    var time_text = new Date().toUTCString()
    let latestMsg = that.data.latestMsg
    let latestMsgArr = that.data.latestMsgArr || []
    // console.debug(e.payloadBytes)
    let payload = MessageMessage.decode(e.payloadBytes);
    console.debug(payload)
    if (payload.events) {
      payload.events = JSON.parse(payload.events)
    }
    if (payload.properties) {
      payload.properties = JSON.parse(payload.properties)
    }
    payload.timestamp = Number(payload.timestamp)

    // let payload = JSON.parse(e.payloadString)
    if (payload.events && payload.events.message) {
      let msg = payload.events.message
      let timeHms = payload.timeHms
      let reqId = payload.reqId
      let id = msg.room.id || msg.talker.id
      msg.timeHms = timeHms
      latestMsg[id] = msg
      let index = latestMsgArr.indexOf(id)
      if (index != -1) {
        latestMsgArr.splice(index, 1)
      }
      latestMsgArr.unshift(id)
      // latestMsg[msg.room.id || msg.talker.id].text = msg.text.slice(0, 18)
      if (that.eventChannel && id == that.data.wxid) {
        that.eventChannel.emit('acceptDataFromOpenerPage', { msg })
      }
      // wx.request({
      //   method: 'POST',
      //   url: 'https://api.vika.cn/fusion/v1/datasheets/dstsL6DH8BxYP4Fbl4/records?viewId=viwutsKh3DuAd&fieldKey=name',
      //   header,
      //   data: {
      //     "records": [
      //       {
      //         "fields": {
      //           "ID": reqId,
      //           "时间": timeHms,
      //           "来自": msg.talker._payload.name || '我',
      //           "接收": msg.room.id ? msg.room._payload.topic : '单聊',
      //           "内容": msg.text,
      //           "发送者ID": msg.talker.id != 'null' ? msg.talker.id : '--',
      //           "接收方ID": msg.room.id ? msg.room.id : '--',
      //         }
      //       }
      //     ],
      //     "fieldKey": "name"
      //   },
      //   success: res => {
      //     console.debug(res)
      //   },
      //   fail: err => {
      //     console.error(err)
      //   }
      // })
      this.setData({
        latestMsg,
        latestMsgArr
      })
      wx.setStorage({
        key: "latestMsg",
        data: latestMsg
      })
      wx.setStorage({
        key: "latestMsgArr",
        data: latestMsgArr
      })
    }

    if (payload.properties) {
      // if (payload.properties.contactList) {
      //   wx.request({
      //     method: 'PUT',
      //     url: 'https://api.vika.cn/fusion/v1/datasheets/dstpmrfEPXCm7QBj42/records?viewId=viwJGZekJrvch&fieldKey=name',
      //     header,
      //     data: {
      //       "records": [
      //         {
      //           "recordId": "rec622Sw8WWHR",
      //           "fields": {
      //             "key": "contactList",
      //             "value": JSON.stringify(payload.properties.contactList)
      //           }
      //         }
      //       ],
      //       "fieldKey": "name"
      //     },
      //     success: res => {
      //       console.debug(res)
      //     },
      //     fail: err => {
      //       console.error(err)
      //     }
      //   })
      // }
      // if (payload.properties.roomList) {
      //   wx.request({
      //     method: 'PUT',
      //     url: 'https://api.vika.cn/fusion/v1/datasheets/dstpmrfEPXCm7QBj42/records?viewId=viwJGZekJrvch&fieldKey=name',
      //     header,
      //     data: {
      //       "records": [
      //         {
      //           "recordId": "recT6KaumagKP",
      //           "fields": {
      //             "key": "roomList",
      //             "value": JSON.stringify(payload.properties.roomList)
      //           }
      //         }
      //       ],
      //       "fieldKey": "name"
      //     },
      //     success: res => {
      //       console.debug(res)
      //     },
      //     fail: err => {
      //       console.error(err)
      //     }
      //   })
      // }
      // if (payload.properties.lastUpdate) {
      //   wx.request({
      //     method: 'PUT',
      //     url: 'https://api.vika.cn/fusion/v1/datasheets/dstpmrfEPXCm7QBj42/records?viewId=viwJGZekJrvch&fieldKey=name',
      //     header,
      //     data: {
      //       "records": [
      //         {
      //           "recordId": "recxmz38EpnfJ",
      //           "fields": {
      //             "key": "lastUpdate",
      //             "value": JSON.stringify(payload.properties.lastUpdate)
      //           }
      //         }
      //       ],
      //       "fieldKey": "name"
      //     },
      //     success: res => {
      //       console.debug(res)
      //     },
      //     fail: err => {
      //       console.error(err)
      //     }
      //   })
      // }
      // if (payload.properties.timeHms) {
      //   wx.request({
      //     method: 'PUT',
      //     url: 'https://api.vika.cn/fusion/v1/datasheets/dstpmrfEPXCm7QBj42/records?viewId=viwJGZekJrvch&fieldKey=name',
      //     header,
      //     data: {
      //       "records": [
      //         {
      //           "recordId": "rec6hfgl9OK34",
      //           "fields": {
      //             "key": "timeHms",
      //             "value": JSON.stringify(payload.properties.timeHms)
      //           }
      //         }
      //       ],
      //       "fieldKey": "name"
      //     },
      //     success: res => {
      //       console.debug(res)
      //     },
      //     fail: err => {
      //       console.error(err)
      //     }
      //   })
      // }
      // if (payload.properties.userSelf) {
      //   wx.request({
      //     method: 'PUT',
      //     url: 'https://api.vika.cn/fusion/v1/datasheets/dstpmrfEPXCm7QBj42/records?viewId=viwJGZekJrvch&fieldKey=name',
      //     header,
      //     data: {
      //       "records": [
      //         {
      //           "recordId": "recPkJcTqPKB2",
      //           "fields": {
      //             "key": "roomList",
      //             "value": JSON.stringify(payload.properties.userSelf)
      //           }
      //         }
      //       ],
      //       "fieldKey": "name"
      //     },
      //     success: res => {
      //       console.debug(res)
      //     },
      //     fail: err => {
      //       console.error(err)
      //     }
      //   })
      // }
      let bot = {}
      try {
        var old_bot = wx.getStorageSync('bot')
        if (old_bot) {
          bot = old_bot
        }
      } catch (e) {
        // Do something when catch error
      }
      Object.assign(bot, payload.properties);
      wx.setStorage({
        key: "bot",
        data: bot
      })
    }

  },
  doSubscribe: function (topic) {
    var that = this
    this.subscribe(topic, {
      qos: 0
    })
  },
  doPublish: function (text) {
    var that = this
    var topic = msg_topic
    let payload = {
      "reqId": "442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
      "method": "thing.command.invoke",
      "version": "1.0",
      "timestamp": new Date().getTime(),
      "name": "send",
      "params": {
        toContacts: [this.data.wxid,],
        "messageType": "Text",
        messagePayload: text
      }
    }
    console.debug(JSON.stringify(payload))
    // payload = JSON.stringify(payload)
    payload.params = JSON.stringify(payload.params)
    payload.timestamp = String(payload.timestamp)
    var message = MessageMessage.create(payload);
    payload = MessageMessage.encode(message).finish();
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
    this.setData({
      wxid: ''
    })
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