// page/addressBook/index.js
import CustomPage from '../base/CustomPage'
import Pinyin from '..//../util/pinyin'


const db = wx.cloud.database({
  env: 'release-j16sy'
})
CustomPage({
  data: {
    activeTab: 0,
    tabs: [
      {
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
        title: '全部',
        title2: '微信小程序直播',
        img: 'http://mmbiz.qpic.cn/sz_mmbiz_png/GEWVeJPFkSHALb0g5rCc4Jf5IqDfdwhWJ43I1IvriaV5uFr9fLAuv3uxHR7DQstbIxhNXFoQEcxGzWwzQUDBd6Q/0?wx_fmt=png',
        desc: '微信小程序直播系列课程持续更新中，帮助大家更好地理解、应用微信小程序直播功能。',
      }
    ]
  },
  onTabClick(e) {
    let that = this
    const index = e.detail.index
    if(index==1){
      this.setData({
        roomlist: that.pinyinSort(that.data.bot.roomList)
      })
    }
    if(index==2){
      this.setData({
        alllist: that.pinyinSort(that.data.bot.roomList.concat(that.data.bot.contactList))
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
      var ken = Pinyin.getSpell(name[bukn]._payload.alias || name[bukn]._payload.name|| name[bukn]._payload.topic || name[bukn]._payload.id, function (charactor, spell) {
        console.log(charactor, spell);
        return spell[1];
      });
      o.name = name[bukn]._payload.alias || name[bukn]._payload.name|| name[bukn]._payload.topic || name[bukn]._payload.id
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
    const mapCity = db.collection('bot')
    const _this = this

    mapCity.doc('0448022461b60c2f01ef65ee4b45e607').get({
      success(re) {
        console.debug(re)
        _this.setData({
          bot: re.data
        })
        let cities = re.data.contactList || []
        console.debug(cities)
        let namelist = _this.pinyinSort(cities)
        _this.setData({
          namelist
        })
      },
      fail(err) {
        console.error(err)
      }
    })
  }

})