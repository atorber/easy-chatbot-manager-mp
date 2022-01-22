// 云函数入口文件
const cloud = require('wx-server-sdk')
const mqtt = require('mqtt')
const rp = require('request-promise')
cloud.init()

const db = cloud.database()
const _ = db.command

var host = 'awgnfty.iot.gz.baidubce.com'
var password = ''
var username = 'awgnfty/service_client'
var clientId = 'auto_open' + new Date().getTime()

// 云函数入口函数
exports.main = async (event, context) => {
  console.info(event)
  let {
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
  if (body && typeof body === 'string') {
    body = JSON.parse(body)
  }

  let msg = body || {}
  let token = ''
  const curTime = new Date().getTime()

  if (body && !body.reqId && body.name == 'send' && body.toContacts && body.messagePayload) {
    body = {
      "reqId": "442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
      "method": "thing.command.invoke",
      "version": "1.0",
      "timestamp": curTime,
      "name": "send",
      "params": {
        toContacts: body.toContacts,
        "messageType": "Text",
        messagePayload: body.messagePayload
      }
    }
    let commandInvoke = `thing/wechaty/ledongmao/command/invoke`
    let push_res = JSON.parse(await pubMsg(commandInvoke, msg))
    push_res.info = msg
    return push_res
  }

  if (httpMethod == 'GET' && queryString && queryString.to && queryString.text) {
    msg = {
      "reqId": "442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
      "method": "thing.command.invoke",
      "version": "1.0",
      "timestamp": curTime,
      "name": "send",
      "params": {
        "toContacts": [
          queryString.to,
        ],
        "messageType": "Text",
        "messagePayload": queryString.text
      }
    }
  } else if (pathParameters.token && httpMethod == 'GET' && queryString && queryString.action == 'init') {
    let bot_res = await db.collection('bot').where({
      bot_token: pathParameters.token
    }).get()
    return bot_res
  } else if (httpMethod == 'POST' && body) {
    msg = body
  } else if (!httpMethod && body) {
    msg = body
  } else {
    return {
      err: '请求参数错误'
    }
  }

  if (queryString && queryString.token) {
    let to = queryString.to
    let user_res = await db.collection('user').where({
      token: queryString.token
    }).get()
    if (user_res.data.length > 0) {
      const user = user_res.data[0]
      let commandInvoke = ''
      commandInvoke = `thing/wechaty/ledongmao/command/invoke`
      if (to == user.wxid) {
        let push_res = JSON.parse(await pubMsg(commandInvoke, msg))
        push_res.info = msg
        return push_res
      }
      let rooms_res = await db.collection('room').where({
        ownerid: user.wxid,
        roomid: to
      }).get()

      if (rooms_res.data.length > 0) {
        let push_res = JSON.parse(await pubMsg(commandInvoke, msg))
        push_res.info = msg
        return push_res
      } else {
        return {
          err: '无效的roomid或selfwxid'
        }
      }

    } else {
      return {
        err: '无效的token'
      }
    }
  }

  if (pathParameters && pathParameters.token) {
    token = pathParameters.token
    let bot_res = await db.collection('bot').where({
      server_token: token
    }).get()
    if (bot_res.data.length > 0) {
      const bot = bot_res.data[0]
      let commandInvoke = ''
      if (bot.wxKey) {
        commandInvoke = `thing/wechaty/${bot.wxKey}/command/invoke`
      } else {
        commandInvoke = `thing/chatbot/${bot.bot_token}/command/invoke`
      }

      let push_res = JSON.parse(await pubMsg(commandInvoke, msg))
      push_res.info = msg
      return push_res

    } else {
      return {
        err: '无效的token'
      }
    }

  }

  return {
    err: '请使用有效的token'
  }

}

const pubMsg = async (commandInvoke, msg) => {

  // 获取mqtt请求token
  let opt = {
    method: 'POST',
    url: 'https://awgnfty.iot.gz.baidubce.com/auth',
    body: {
      username,
      password
    },
    json: true,
    encoding: null
  }

  let res = await rp(opt)
  console.debug(res)
  let pub_token = res.token

  // 推送消息
  let url = `https://awgnfty.iot.gz.baidubce.com/pub?topic=${commandInvoke}&qos=0`
  opt = {
    method: 'POST',
    url,
    headers: {
      token: pub_token,
      Accept: 'application/json',
      'Content-Type': 'application/octet-stream'
    },
    body: JSON.stringify(msg)
  }

  console.info(opt)

  let push_res = await rp(opt)

  return push_res
}