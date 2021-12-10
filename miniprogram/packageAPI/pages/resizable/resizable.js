// miniprogram/packageAPI/pages/resizable/resizable.js
Page({
  onShareAppMessage() {
    return {
      title: '屏幕旋转',
      path: 'package/API/pages/resizable/resizable'
    }
  },
  data: {
    status: 'lock',
  },
  handleStatusChange(e) {
    this.setData({
      status: e.currentTarget.dataset.status,
    })
  }
})
