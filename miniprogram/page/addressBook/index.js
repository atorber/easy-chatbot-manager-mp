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
    const mapCity = db.collection('contact')
    const _this = this

    mapCity.doc('6af880a55eb9574b008b').get({
      success(re) {
        console.debug(re)
        let cities = re.data
        cities = [{
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
        // 按拼音排序
        cities.sort((c1, c2) => {
          console.debug(c1)
          const pinyin1 = c1.pinyin.join('')
          const pinyin2 = c2.pinyin.join('')
          console.debug(pinyin1.localeCompare(pinyin2))
          return pinyin1.localeCompare(pinyin2)
        })
        console.debug(cities)
        // 添加首字母
        const map = new Map()
        console.debug(map)
        for (const city of cities) {
          console.debug(city)
          const alpha = city.pinyin[0].charAt(0).toUpperCase()
          if (!map.has(alpha)) map.set(alpha, [])
          map.get(alpha).push({
            name: city.fullname
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