// page/chat/index.js
import CustomPage from '../base/CustomPage'
import { compareVersion } from '../../util/util'

CustomPage({
  onShareAppMessage() {
    return {
      title: 'emoji',
      path: 'page/weui/example/emoji/emoji'
    }
  },
  data: {
    lineHeight: 24,
    functionShow: false,
    emojiShow: false,
    comment: '',
    focus: false,
    cursor: 0,
    _keyboardShow: false,
    emojiSource: 'https://res.wx.qq.com/op_res/eROMsLpnNC10dC40vzF8qviz63ic7ATlbGg20lr5pYykOwHRbLZFUhgg23RtVorX',
    // parsedComment: []
    historyList: [],
    layoutHeight: '0px',
    safeHeight: 0,
    keyboardHeight: 0,
    isIOS: false,
    canIUse: true,
  },

  onLoad(option) {
    console.log(option.query)
    let that = this
    const system = wx.getSystemInfoSync()
    const isIOS = system.platform === 'ios'

    this.safeHeight = (system.screenHeight - system.safeArea.bottom)
    const layoutHeight = wx.getSystemInfoSync().windowHeight - (this.safeHeight / 2)
    this.setData({
      isIOS,
      safeHeight: this.safeHeight,
      layoutHeight,
    })
    const emojiInstance = this.selectComponent('.mp-emoji')
    this.emojiNames = emojiInstance.getEmojiNames()
    this.parseEmoji = emojiInstance.parseEmoji

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', { data: 'test2' });
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log('acceptDataFromOpenerPage 2', data)
      if (data.wxid) {
        let title = data.msg && data.msg.room && data.msg.room.id ? data.msg.room.topic : data.msg.talker.name
        wx.setNavigationBarTitle({
          title,
          success() {
            console.log('setNavigationBarTitle success')
          },
          fail(err) {
            console.log('setNavigationBarTitle fail, err is', err)
          }
        })
        that.setData({
          wx: data
        })
      } else {
        if (data.msg.room.id == that.data.wx.wxid || data.msg.talker.id == that.data.wx.wxid) {
          let historyList = that.data.historyList
          historyList.push(data)
          that.setData({
            historyList
          })
        }

      }

      // that.onsend(data.msg)

    })
  },
  onReady() {
    // 解决基础库小于 2.9.2 的兼容问题
    const { SDKVersion } = wx.getSystemInfoSync()
    if (compareVersion(SDKVersion, '2.9.1') < 0) {
      this.setData({
        canIUse: false,
      })
    }
  },
  onkeyboardHeightChange(e) {
    const { height } = e.detail
    if (height === 0) {
      this.data._keyboardShow = false

      this.setData({
        safeHeight: this.safeHeight,
        keyboardHeight: height
      })
    } else {
      this.data._keyboardShow = true
      this.setData({
        safeHeight: 0,
        functionShow: false,
        emojiShow: false,
        keyboardHeight: height
      })
    }
  },

  hideAllPanel() {
    this.setData({
      functionShow: false,
      emojiShow: false
    })
  },
  showEmoji() {
    this.setData({
      functionShow: false,
      emojiShow: this.data._keyboardShow || !this.data.emojiShow
    })
  },
  showFunction() {
    this.setData({
      functionShow: this.data._keyboardShow || !this.data.functionShow,
      emojiShow: false
    })
  },
  chooseImage() { },
  onFocus() {
    this.data._keyboardShow = true

    this.hideAllPanel()
  },
  onBlur(e) {
    this.data._keyboardShow = false
    this.data.cursor = e.detail.cursor || 0
  },
  onInput(e) {
    const value = e.detail.value
    this.data.comment = value
  },
  onConfirm(e) {
    console.debug(e)
    this.onsend(e)
  },
  insertEmoji(evt) {
    const emotionName = evt.detail.emotionName
    const { cursor, comment } = this.data
    const newComment =
      comment.slice(0, cursor) + emotionName + comment.slice(cursor)
    this.setData({
      comment: newComment,
      cursor: cursor + emotionName.length
    })
  },
  onsend(e) {
    console.debug(e)
    let that = this
    const comment = (e.detail && e.detail.value) || this.data.comment || ''
    let msg = that.data.wx.msg
    msg.content.text = comment

    if (comment) {
      const parsedComment = {
        emoji: this.parseEmoji(comment),
        id: `emoji_${this.data.historyList.length}`,
        msg
      }
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('acceptDataFromOpenedPage', { comment });

      this.setData({
        historyList: [...this.data.historyList, parsedComment],
        comment: '',
        emojiShow: false,
      })
    } else {
      wx.showToast({
        title: '内容为空',
      })
    }
  },
  deleteEmoji() {
    const pos = this.data.cursor
    const comment = this.data.comment
    let result = ''
    let cursor = 0

    let emojiLen = 6
    let startPos = pos - emojiLen
    if (startPos < 0) {
      startPos = 0
      emojiLen = pos
    }
    const str = comment.slice(startPos, pos)
    const matchs = str.match(/\[([\u4e00-\u9fa5\w]+)\]$/g)
    // 删除表情
    if (matchs) {
      const rawName = matchs[0]
      const left = emojiLen - rawName.length
      if (this.emojiNames.indexOf(rawName) >= 0) {
        const replace = str.replace(rawName, '')
        result = comment.slice(0, startPos) + replace + comment.slice(pos)
        cursor = startPos + left
      }
      // 删除字符
    } else {
      let endPos = pos - 1
      if (endPos < 0) endPos = 0
      const prefix = comment.slice(0, endPos)
      const suffix = comment.slice(pos)
      result = prefix + suffix
      cursor = endPos
    }
    this.setData({
      comment: result,
      cursor
    })
  }
})

