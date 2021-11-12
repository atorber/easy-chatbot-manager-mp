const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  let {
    OPENID,
    APPID
  } = cloud.getWXContext()
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": OPENID,
      "page": 'page/page/index',
      "lang": 'zh_CN',
      "data": {
        "time1": {
          "value": '2015年01月05日 12:30'
        },
        "thing2": {
          "value": '测试消息重复提送'
        }
      },
      "templateId": 'VLtZw-mJ4_wBMBDoxSLNGLxaWzu3g0fiM0qkgvbs4cw',
      "miniprogramState": 'developer'
    })
    return result
  } catch (err) {
    return err
  }
}