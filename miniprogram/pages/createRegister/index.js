// miniprogram/pages/createRegister/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree:true,
    formData: {

    },
    rules: [{
        name: 'radio',
        rules: {required: true, message: '单选列表是必选项'},
    }, {
        name: 'checkbox',
        rules: {required: true, message: '多选列表是必选项'},
    }, {
        name: 'qq',
        rules: {required: true, message: 'qq必填'},
    }, {
        name: 'mobile',
        rules: [{required: true, message: 'mobile必填'}, {mobile: true, message: 'mobile格式不对'}],
    }, {
        name: 'vcode',
        rules: {required: true, message: '验证码必填'},
    }, {
        name: 'idcard',
        rules: {required: true, message: 'idcard必填'},
    }]
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const info = e.detail.value


  },
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.debug(options)
    this.setData({
      curId: options.id
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