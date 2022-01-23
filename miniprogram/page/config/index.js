// page/config/index.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    secret: {
      "mqtt": {
        "DeviceKey": "机器人ID",
        "password": "MQTT密码",
        "username": "MQTT用户名"
      },
      "vika": {
        "token": "维格表token"
      }
    }
  },
  getSecret(openid) {
    db.collection('secret').doc(openid).get().then(res => {
      let secret = res.data
      delete secret._id
      delete secret._openid
      this.setData({
        secret: JSON.stringify(secret)
      })
    }).catch(err => {
      this.setData({
        secret: JSON.stringify({})
      })
    })
  },
  saveConfig(e) {
    console.debug(e)
    let value = e.detail.value
    try {
      let secret = JSON.parse(value.secret)
      console.debug(secret)
      if (Object.keys(secret).length > 0) {
        db.collection('secret').doc(this.data.user.openid).set({
          data: secret
        }).then(res => {
          wx.showToast({
            title: '保存成功',
          })
        }).catch(err => {
          console.error(err)
          wx.showToast({
            title: '保存失败',
          })
        })
      } else {
        wx.showToast({
          title: '不能为空',
        })
      }

    } catch (err) {
      wx.showToast({
        title: '输入不是JSON',
      })
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          that.getSecret(user.openid)
        })
      },
      fail: console.error
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})