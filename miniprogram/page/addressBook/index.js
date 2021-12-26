// page/addressBook/index.js
import CustomPage from '../base/CustomPage'
import Pinyin from '..//../util/pinyin'

let header = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer uskv0Tuj5MxADtcsI1C0Vkh'
}

wx.request({
  method: 'GET',
  url: 'https://api.vika.cn/fusion/v1/datasheets/dst6tnv0XEY6znlSCq/records?viewId=viwgL24ijcyXX&fieldKey=name',
  header,
  success: res => {
    console.debug(res)
  },
  fail: err => {
    console.error(err)
  }
})

wx.request({
  method: 'POST',
  url: 'https://api.vika.cn/fusion/v1/datasheets/dst6tnv0XEY6znlSCq/records?viewId=viwgL24ijcyXX&fieldKey=name',
  header,
  data: {
    "records": [
      {
        "fields": {
          "ID": "1",
          "名称": "大客户",
          "成员": "[\"123\"]",
          "数量": 1
        }
      }
    ],
    "fieldKey": "name"
  },
  success: res => {
    console.debug(res)
  },
  fail: err => {
    console.error(err)
  }
})

wx.request({
  method: 'PUT',
  url: 'https://api.vika.cn/fusion/v1/datasheets/dst6tnv0XEY6znlSCq/records?viewId=viwgL24ijcyXX&fieldKey=name',
  header,
  data: {
    "records": [
      {
        "recordId": "recmmeFaVKZab",
        "fields": {
          "ID": "1",
          "名称": "大客户",
          "成员": "[\"123\"]",
          "数量": new Date().getTime()
        }
      }
    ],
    "fieldKey": "name"
  },
  success: res => {
    console.debug(res)
  },
  fail: err => {
    console.error(err)
  }
})

const db = wx.cloud.database({
  env: 'release-j16sy'
})
CustomPage({
  data: {
    namelist: [{
      alpha: 'C',
      subItems: [{
        name: '超哥',
        pinyin: 'chaoge',
        member: {}
      }]
    }, {
      alpha: 'C',
      subItems: [{
        name: '大师',
        pinyin: 'dashi',
        member: {}
      }]
    }, {
      alpha: 'Z',
      subItems: [{
        name: '张三',
        pinyin: 'zhangsan',
        member: {}
      }]
    },],
    bot: {
      contactList: [],
      concat: {},
      roomlist: [{
        id: '123',
        _payload: {
          topic: 'UI交流群'
        }
      }]
    },
    alllist: [{
      alpha: 'A',
      subItems: [{
        name: '张三',
        pinyin: 'zhangsan',
        member: {}
      }]
    }, {
      alpha: 'U',
      subItems: [{
        name: 'UI交流群',
        pinyin: 'ui',
        member: {}
      }]
    }],
    activeTab: 0,
    tabs: [
      {
        title: '全部',
        title2: '微信小程序直播',
        img: 'http://mmbiz.qpic.cn/sz_mmbiz_png/GEWVeJPFkSHALb0g5rCc4Jf5IqDfdwhWJ43I1IvriaV5uFr9fLAuv3uxHR7DQstbIxhNXFoQEcxGzWwzQUDBd6Q/0?wx_fmt=png',
        desc: '微信小程序直播系列课程持续更新中，帮助大家更好地理解、应用微信小程序直播功能。',
      }, {
        title: '联系人',
        title2: '小程序开发进阶',
        img: 'http://mmbiz.qpic.cn/sz_mmbiz_jpg/GEWVeJPFkSEV5QjxLDJaL6ibHLSZ02TIcve0ocPXrdTVqGGbqAmh5Mw9V7504dlEiatSvnyibibHCrVQO2GEYsJicPA/0?wx_fmt=jpeg',
        desc: '本视频系列课程，由腾讯课堂NEXT学院与微信团队联合出品，通过实战案例，深入浅出地进行讲解。',
      },
      {
        title: '群组',
        title2: '微信小程序直播',
        img: 'http://mmbiz.qpic.cn/sz_mmbiz_png/GEWVeJPFkSHALb0g5rCc4Jf5IqDfdwhWJ43I1IvriaV5uFr9fLAuv3uxHR7DQstbIxhNXFoQEcxGzWwzQUDBd6Q/0?wx_fmt=png',
        desc: '微信小程序直播系列课程持续更新中，帮助大家更好地理解、应用微信小程序直播功能。',
      },
      {
        title: '+分组',
        title2: '微信小程序直播',
        img: 'http://mmbiz.qpic.cn/sz_mmbiz_png/GEWVeJPFkSHALb0g5rCc4Jf5IqDfdwhWJ43I1IvriaV5uFr9fLAuv3uxHR7DQstbIxhNXFoQEcxGzWwzQUDBd6Q/0?wx_fmt=png',
        desc: '微信小程序直播系列课程持续更新中，帮助大家更好地理解、应用微信小程序直播功能。',
      }
    ]
  },
  onTabClick(e) {
    let that = this
    const index = e.detail.index
    let roomList = that.data.bot.roomList || []
    if (index == 2) {
      this.setData({
        roomlist: that.pinyinSort(roomList)
      })
    }
    if (index == 0) {
      this.setData({
        alllist: that.pinyinSort(roomList.concat(that.data.bot.contactList || []))
      })
    }
    this.setData({
      activeTab: index
    })
  },
  onShareAppMessage() {
    return {
      title: 'index-list',
      path: 'page/weui/example/index-list/index-list'
    }
  },
  onLoad(options) {
    this.getCitys()
  },
  pinyinSort(name) {
    var pinyinArray = new Array()
    for (var bukn = 0; bukn < name.length; bukn++) {
      var o = new Object()
      var ken = Pinyin.getSpell(name[bukn]._payload.alias || name[bukn]._payload.name || name[bukn]._payload.topic || name[bukn]._payload.id, function (charactor, spell) {
        console.log(charactor, spell);
        return spell[1];
      });
      o.name = name[bukn]._payload.alias || name[bukn]._payload.name || name[bukn]._payload.topic || name[bukn]._payload.id
      o.pinyin = ken.split(',').join('')
      o.member = name[bukn]
      pinyinArray.push(o)
    }
    console.log("pinyinArray")
    console.log(pinyinArray)
    // pinyinArray = pinyinArray.sort(compare("pinyin"))
    let map = {
      alpha: '',
      subItems: []
    }
    pinyinArray.forEach((item, index) => {
      if (!map[item.pinyin[0].toUpperCase()]) {
        map[item.pinyin[0].toUpperCase()] = {
          alpha: item.pinyin[0].toUpperCase(),
          subItems: []
        }
      }
      map[item.pinyin[0].toUpperCase()].subItems.push({
        name: item.name,
        pinyin: item.pinyin,
        member: item.member
      })
    })
    console.log("map")
    console.log(map)
    var turn = new Array()
    var letters = "*ABCDEFGHIJKLNMOPQRSTUVWXYZ".split('');
    for (var i = 1; i < letters.length; i++) {
      if (map[letters[i]]) {
        var obj = new Object()
        //自己改改命名改成自己需要的
        obj.alpha = letters[i]
        obj.subItems = map[letters[i]].subItems
        turn.push(obj)
      }
    }
    console.log("trun")
    console.log(turn)
    return turn;
  },
  getCitys() {
    const that = this

    wx.getStorage({
      key: 'bot',
      success(res) {
        console.log(res.data)
        that.setData({
          bot: res.data
        })
        let contactList = res.data.contactList || []
        let roomList = that.data.bot.roomList || []
        console.debug(contactList)
        that.setData({
          namelist: that.pinyinSort(contactList),
          alllist: that.pinyinSort(roomList.concat(contactList))
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  }

})