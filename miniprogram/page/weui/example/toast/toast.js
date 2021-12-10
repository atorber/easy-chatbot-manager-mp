Page({
  onShareAppMessage() {
    return {
      title: 'toast',
      path: 'page/weui/example/toast/toast'
    }
  },
  openToast() {
    wx.showToast({
      title: '已完成',
      icon: 'success',
      duration: 3000
    })
  },
  openLoading() {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 3000
    })
  }
})
