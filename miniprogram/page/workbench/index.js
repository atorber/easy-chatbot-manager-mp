// page/workbench/index.js
import CustomPage from '../base/CustomPage'

const {GRID_DEMO_URL} = getApp().globalData
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: [
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: '打卡'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: '审批'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: '汇报'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: '会议室'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: '公告'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: '客户群'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: '日程'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: '会议'
      },
      {
        imgUrl: app.globalData.iconTabbar,
        url: GRID_DEMO_URL,
        text: '直播'
      }
    ]
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