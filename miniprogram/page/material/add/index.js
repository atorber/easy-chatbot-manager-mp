// page/material/add/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,

    radioItems: [
      {name: '文本', value: '0', checked: true},
      {name: '图片', value: '1'},
      {name: '文件', value: '2'}
    ],
    checkboxItems: [
      {name: 'standard is dealt for u.', value: '0', checked: true},
      {name: 'standard is dealicient for u.', value: '1'}
    ],
    items: [
      {name: 'USA', value: '美国'},
      {name: 'CHN', value: '中国', checked: 'true'},
      {name: 'BRA', value: '巴西'},
      {name: 'JPN', value: '日本'},
      {name: 'ENG', value: '英国'},
      {name: 'TUR', value: '法国'},
    ],

    date: '2016-09-01',
    time: '12:01',

    countryCodes: ['+86', '+80', '+84', '+87'],
    countryCodeIndex: 0,

    countries: ['中国', '美国', '英国'],
    countryIndex: 0,

    accounts: ['文本', '图片', '文件'],
    accountIndex: 0,

    isAgree: false,
    formData: {

    },
    rules: [{
      name: 'radio',
      rules: {required: false, message: '单选列表是必选项'},
    }, {
      name: 'checkbox',
      rules: {required: true, message: '多选列表是必选项'},
    }, {
      name: 'name',
      rules: {required: true, message: '请输入姓名'},
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
      rules: {
        validator(rule, value, param, modeels) {
          if (!value || value.length !== 18) {
            return 'idcard格式不正确'
          }
        }
      },
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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