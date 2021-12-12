// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
const encode = require('nodejs-base64-encode');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

function guid() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function unique(arr, isroom) {
  let map = {}
  let newarr = []
  for (let i = 0, len = arr.length; i < len; i++) {
    if (!isroom && !map[arr[i].id]) {
      map[arr[i].id] = arr[i]._payload
      newarr.push(arr[i])
    }
    if (isroom && !map[arr[i].id]) {
      map[arr[i].id] = arr[i]._payload
      newarr.push(arr[i])
    }
  }
  return [map, newarr];
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.info(event)
  let {
    action,
    body,
    httpMethod,
    path,
    pathParameters,
    queryString,
    queryStringParameters,
    requestContext,
    bot,
    messagePayload
  } = event
  // if (body && typeof body === 'string') {
  //   body = JSON.parse(body)
  // }

  if (body && typeof body === 'string') {
    //判断是否为base64转码过的字符串
    try {
      body = Buffer.from(body, 'base64').toString()
      // console.info(body)
      body = JSON.parse(body)
      if (body.rulechainId) {
        pathParameters.token = body.source.topic.split("/")[2]
        body = Buffer.from(body.message, 'base64').toString()
        body = JSON.parse(body)
        // console.info(body)
      }
    } catch (err) {
      console.error(err)
      body = JSON.parse(body)
    }
  }

  if (action == 'create') {
    const bot_token = guid()
    const server_token = guid()
    let opts = {}
    opts.method = 'POST'
    opts.uri = '/v1/iotcore/awgnfty/device/new'
    opts.params = {}
    opts.body = {
      name: bot_token,
      templateId: 'tswnutx5',
      authType: 'SIGNATURE',
      desc: ''
    }
    opts.headers = {
      Host: 'iot.baidubce.com'
    }
    const mqtt_res = await cloud.callFunction({
      name: 'callBaiduCloudApi',
      data: {
        opts
      }
    })
    console.debug(mqtt_res)
    if (mqtt_res.result && mqtt_res.result.data) {
      let mqtt = mqtt_res.result.data
      let bot_res = await db.collection('bot')
        .add({
          data: {
            _openid: wxContext.OPENID,
            bot_token,
            server_token,
            wechaty_token: '',
            mqtt,
            created: new Date().getTime()
          }
        })

      return {
        event,
        data: bot_res,
        msg: 'success'
      }
    } else {
      return {
        event,
        data: mqtt_res,
        msg: 'fail'
      }
    }



  } else if (httpMethod == 'GET' && queryString && queryString.code) {
    // let opt = {
    //   method: 'POST',
    //   url: 'https://easyiot.bceidaas.com/app/oauth/7dbccaeb419244f1a45d275506a62bc7/auth',
    //   body: {
    //     username,
    //     password
    //   },
    //   json: true,
    //   encoding: null
    // }

    let opt = {
      method: 'POST',
      uri: 'https://easyiot.bceidaas.com/app/oauth/7dbccaeb419244f1a45d275506a62bc7/token',
      headers: {
        authorization: "Basic " + encode.encode('904b239405bf4f54ace7e99160f03591:f5f509944fc949c593fad663b709a3ba', 'base64')
      },
      form: {
        code: queryString.code,
        // client_id: '904b239405bf4f54ace7e99160f03591',
        // client_secret: 'f5f509944fc949c593fad663b709a3ba',
        grant_type: "authorization_code",
        redirect_uri: 'https://push.vlist.cc/bot/1234',
        scope: "*",
      },
      json: true
    }
    console.info('请求鉴权接口================', opt)
    let res = await rp(opt)
    console.info('返回================', res)

    let opt_user = {
      method: 'GET',
      uri: 'https://idaas.baidubce.com/v1/project/easyiot/user/info',
      headers: {
        authorization: "Bearer " + res.id_token
      },
      // qs: {
      //   access_token: res.id_token,
      //   projectId: "cccf94a7ebe74819885c5312fa269cbe"
      // },
      json: true
    }
    console.info('请求鉴权接口================', opt_user)
    let res_user = await rp(opt_user)
    console.info('返回================', res_user)

    return res_user
  } else if (httpMethod == 'GET' && pathParameters && pathParameters.token) {
    let bot_res = await db.collection('bot').where({
      bot_token: pathParameters.token
    }).get()
    if (bot_res.data.length && bot_res.data[0].mqtt) {
      let mqtt = bot_res.data[0].mqtt
      return {
        bot_token: mqtt.name,
        mqtt: {
          username: `awgnfty/${mqtt.name}`,
          password: mqtt.secretKey,
          clientid: mqtt.name,
          host: 'awgnfty.iot.gz.baidubce.com'
        }
      }
    } else {
      return {
        code: 400,
        msg: '无效的token'
      }
    }

  } else if (httpMethod == 'GET') {
    let secret = "afcce39b89fe1d6327f7d1ec7783fe48e25cc110291a929a43fc982c2db5d6fe"
    let res = {
      "isBase64Encoded": false,
      "statusCode": 200,
      "headers": {
        "Content-Type": "text/plain"
      },
      "body": secret
    }
    return res
  } else if (httpMethod == 'POST' && body.topic) {
    await db.collection('log').add({
      data: body
    })
    let bot_token = body.topic
    body = JSON.parse(JSON.stringify(body.payload))
    let bot_res = await db.collection('bot').where({
      bot_token
    }).get()
    if (bot_res.data.length) {
      let bot = JSON.parse(JSON.stringify(bot_res.data[0]))

      if (body && body.properties) {
        let properties = body.properties
        let contactList = []
        let roomList = []

        if (properties.contactList && properties.contactList.length > 0) {
          let uniqueContact = unique(contactList.concat(properties.contactList), false)
          bot.contactList = uniqueContact[1]
          bot.contact = uniqueContact[0]
        }
        if (properties.roomList && properties.roomList.length > 0) {
          let uniqueRoom = unique(roomList.concat(properties.roomList), true)
          bot.roomList = uniqueRoom[1]
          bot.room = uniqueRoom[0]
        }
        if (properties.userSelf && properties.userSelf.id) {
          bot.userSelf = properties.userSelf
        }
        if (properties.lastUpdate) {
          bot.lastUpdate = properties.lastUpdate
        }
        if (properties.timeHms) {
          bot.timeHms = properties.timeHms
        }
        delete bot._id
        console.info(bot)
        let update_bot = await db.collection('bot').doc(bot_res.data[0]._id).update({
          data: bot
        })
        return {
          code: 200,
          data: update_bot,
          msg: 'update bot success'
        }
      } else {
        return {
          code: 400,
          msg: 'body is not existential'
        }
      }

    } else {
      return {
        code: 400,
        msg: '无效的token'
      }
    }

  } else {
    return {
      event,
      unionid: wxContext.UNIONID,
      msg: 'action is not existential'
    }
  }


}