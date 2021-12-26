// page/addressBook/index.js
import CustomPage from '../base/CustomPage'
import Pinyin from '..//../util/pinyin'
import { filename } from '../../weichatPb/src/parse'
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

// const db = wx.cloud.database({
//   env: 'release-j16sy'
// })
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
      }, {
        title: '联系人',
      },
      {
        title: '群组',
      }
    ]
  },
  getGroup() {
    let header = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.data.secret.vika.token}`
    }

    wx.request({
      method: 'GET',
      url: `https://api.vika.cn/fusion/v1/datasheets/${this.data.vika.sysTables.group}/records?fieldKey=name`,
      header,
      success: res => {
        console.debug(res)
        let records = res.data.data.records
        console.debug(records)
        let tabs = this.data.tabs
        records.forEach(record => {
          record.fields.recordId = record.recordId
          record.fields.members = JSON.parse(record.fields.members)
          tabs.push(record.fields)
        })
        this.setData({
          tabs
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  updateGroup(fields, recordId) {
    // record = {
    //   "recordId": "recmmeFaVKZab",
    //   "fields": {
    //     "ID": "1",
    //     "名称": "大客户",
    //     "成员": "[\"123\"]",
    //     "数量": new Date().getTime()
    //   }
    // }
    let header = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.data.secret.vika.token}`
    }
    wx.request({
      method: 'PUT',
      url: `https://api.vika.cn/fusion/v1/datasheets/${this.data.vika.sysTables.group}/records?fieldKey=name`,
      header,
      data: {
        "records": [
          {
            "recordId": recordId,
            "fields": fields
          },
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
  },
  addGroup(fields) {
    // record = {
    //   "fields": {
    //     "ID": "1",
    //     "名称": "大客户",
    //     "成员": "[\"123\"]",
    //     "数量": 1
    //   }
    // }
    let header = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.data.secret.vika.token}`
    }
    wx.request({
      method: 'POST',
      url: `https://api.vika.cn/fusion/v1/datasheets/${this.data.vika.sysTables.group}/records?fieldKey=name`,
      header,
      data: {
        "records": [
          {
            "fields": fields
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
  },
  onTabClick(e) {
    let that = this
    const index = e.detail.index
    let members = that.data.tabs[index].members || []
    this.setData({
      list: that.pinyinSort(members),
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
    this.setData({
      secret: app.globalData.secret,
      vika: app.globalData.vika
    }, res => {
      this.getGroup()
      this.getCitys()
    })
  },
  pinyinSort(name) {
    var pinyinArray = new Array()
    for (var bukn = 0; bukn < name.length; bukn++) {
      var o = new Object()
      var ken = Pinyin.getSpell(name[bukn]._payload.alias || name[bukn]._payload.name || name[bukn]._payload.topic || name[bukn]._payload.id, function (charactor, spell) {
        // console.log(charactor, spell);
        return spell[1];
      });
      o.name = name[bukn]._payload.alias || name[bukn]._payload.name || name[bukn]._payload.topic || name[bukn]._payload.id
      o.pinyin = ken.split(',').join('')
      o.member = name[bukn]
      pinyinArray.push(o)
    }
    // console.log("pinyinArray")
    // console.log(pinyinArray)
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
    // console.log("map")
    // console.log(map)
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
    // console.log("trun")
    // console.log(turn)
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
        let alllist = roomList.concat(contactList)
        // console.debug(JSON.stringify(contactList))
        let tabs = that.data.tabs
        tabs[0].members = alllist
        tabs[1].members = contactList
        tabs[2].members = roomList

        that.setData({
          // namelist: that.pinyinSort(contactList),
          list: that.pinyinSort(alllist)
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  }

})