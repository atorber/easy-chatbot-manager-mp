// page/addressBook/index.js
import CustomPage from '../base/CustomPage'

const db = wx.cloud.database({
  env: 'release-j16sy'
})
CustomPage({
  onShareAppMessage() {
    return {
      title: 'index-list',
      path: 'page/weui/example/index-list/index-list'
    }
  },
  onLoad(options) {
    this.getCitys()
  },

  getCitys() {
    const mapCity = db.collection('bot')
    const _this = this

    mapCity.doc('ledongmao').get({
      success(re) {
        console.debug(re)
        _this.setData({
          bot: re.data
        })
        let cities = [{
          pinyin: ['da', 'shi'],
          fullname: '大师'
        }, {
          pinyin: ['da', 'ge'],
          fullname: '大哥'
        }, {
          pinyin: ['lu', 'ge'],
          fullname: '鲁超'
        }, {
          pinyin: ['chao', 'ge'],
          fullname: '超哥'
        }, {
          pinyin: ['lu', 'yuchao'],
          fullname: 'luyuchao'
        }]
        console.debug(cities)
        cities = re.data.contactList
        console.debug(cities)

        // 按拼音排序
        cities.sort((c1, c2) => {
          // console.debug(c1)
          if (c1.payload.province) {
            const pinyin1 = c1.payload.weixin
            const pinyin2 = c2.payload.weixin
            console.debug(pinyin1.localeCompare(pinyin2))
            return pinyin1.localeCompare(pinyin2)
          } else {
            return true
          }
        })
        console.debug(cities)
        // 添加首字母
        const map = new Map()
        console.debug(map)
        for (const city of cities) {
          // console.debug(city)
          const alpha = city.payload.weixin.charAt(0).toUpperCase()
          if (!map.has(alpha)) map.set(alpha, [])
          map.get(alpha).push({
            name: city.payload.name
          })
        }

        const keys = []
        for (const key of map.keys()) {
          keys.push(key)
        }
        keys.sort()

        const list = []
        for (const key of keys) {
          list.push({
            alpha: key,
            subItems: map.get(key)
          })
        }

        _this.setData({
          list
        })
      },
      fail(err) {
        console.error(err)
      }
    })
  }

})