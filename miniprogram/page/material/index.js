// page/material/index.js
let header = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer uskv0Tuj5MxADtcsI1C0Vkh'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: {
      "1": {
        name: '待办事项清单.docx',
        text: '群聊:超哥和他的小伙伴',
        image: '',
        ts: 0
      },

      "2": {
        name: '快速了解云文档.pdf',
        text: '会话:超哥',
        image: '',
        ts: 0
      }
    }
  },
  toPub(e) {
    console.debug(e)
    let msg = JSON.parse(e.currentTarget.dataset.msg.fields.message)
    console.debug(msg)
  },
  getList() {
    wx.request({
      method: 'GET',
      url: 'https://api.vika.cn/fusion/v1/datasheets/dstvpDQSp1KXGaWWUr/records?viewId=viwvyJeaL1Hpu&fieldKey=name',
      header,
      success: res => {
        console.debug(res.data)
        this.setData({
          list: res.data.data.records
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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