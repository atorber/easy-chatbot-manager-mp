const { Vika } = require("@vikadata/vika");
const vika = new Vika({ token: "uskv0Tuj5MxADtcsI1C0Vkh" });
let spaceId = ''
let sysTables = {}
let botRecords = {}
let secret = {}

async function getAllSpaces() {
    // 获取当前用户的空间站列表
    const spaceListResp = await vika.spaces.list()
    if (spaceListResp.success) {
        console.log(spaceListResp.data.spaces);
        return spaceListResp.data.spaces
    } else {
        console.error(spaceListResp);
        return spaceListResp
    }
}

async function getSpaceId() {
    let spaceList = await getAllSpaces()
    let spaceId = ''
    for (let i in spaceList) {
        if (spaceList[i].name === 'mp-chatbot') {
            spaceId = spaceList[i].id
        }
    }
    return spaceId
}

async function getNodesList() {
    let sysTables = {}
    // 获取指定空间站的一级文件目录
    const nodeListResp = await vika.nodes.list({ spaceId })

    if (nodeListResp.success) {
        // console.log(nodeListResp.data.nodes);
        const nodes = nodeListResp.data.nodes
        nodes.forEach(node => {
            // 当节点是文件夹时，可以执行下列代码获取文件夹下的文件信息
            if (node.type === 'Datasheet' && ['group', 'material', 'bot', 'ChatRecord'].indexOf(node.name) != -1) {
                sysTables[node.name] = node.id
            }
        })
    } else {
        console.error(nodeListResp);
    }
    return sysTables
}

async function getRecordsList() {
    const datasheet = vika.datasheet(sysTables.bot);
    // 分页获取记录，默认返回第一页
    let response = await datasheet.records.query()
    if (response.success) {
        // console.log(response.data.records);
        const records = response.data.records
        records.forEach(record => {
            // 当节点是文件夹时，可以执行下列代码获取文件夹下的文件信息
            if (['contactList', 'lastUpdate', 'timeHms', 'userSelf', 'roomList', 'secret'].indexOf(record.fields.key) != -1) {
                botRecords[record.fields.key] = record.recordId
                if (record.fields.key === 'secret') {
                    secret = JSON.parse(record.fields.value)
                }
            }
        })
    } else {
        console.error(response);
    }
    return botRecords
}

async function addChatRecord(records) {
    const datasheet = vika.datasheet(sysTables.ChatRecord);
    datasheet.records.create(records).then(response => {
        if (response.success) {
            console.log(response.code);
        } else {
            console.error(response);
        }
    });
}

async function updateBot(key, value) {
    const datasheet = vika.datasheet(sysTables.bot);
    datasheet.records.update([
        {
            "recordId": botRecords[key],
            "fields": {
                "key": key,
                "value": value
            }
        }]).then(response => {
            if (response.success) {
                console.log(key, ':', response.code);
            } else {
                console.error(response);
            }
        });
}

async function getSecret(){
    
    return secret
}
async function checkInit() {
    spaceId = await getSpaceId()
    console.debug('mp-chatbot空间ID:', spaceId)

    if (spaceId) {
        sysTables = await getNodesList()
        console.debug('sysTables初始化表:', sysTables)
    } else {
        console.debug('mp-chatbot空间不存在')
    }
    if (Object.keys(sysTables).length == 4) {
        let RecordsList = await getRecordsList()
        console.debug('bot表:', RecordsList)
        if (Object.keys(RecordsList).length == 6) {
            if (secret) {
                console.debug(secret)
                console.debug('配置检查通过')
            } else {
                console.debug('secret未配置')
            }
        } else {
            console.debug('bot表缺失必要记录！！！！！', Object.keys(RecordsList))
        }
    } else {
        console.debug('缺失必须的表！！！！！！', Object.keys(sysTables))
    }
}

checkInit()

module.exports = {
    updateBot,
    addChatRecord,
    getSecret
}