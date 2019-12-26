// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const festivalCollection = db.collection('festival')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const result = await festivalCollection.add({
      data: {
        festival: event.festival,
        year: event.date.split('-')[0],
        month: event.date.split('-')[1],
        day: event.date.split('-')[2],
        lunar: false,
        background: [event.background],
        color: event.color,
        remark: event.remark,
        user: openid
      }
    })
    return {
      status: 1,
      message: '添加成功'
    }
  } catch(e) {
    console.log(e)
    return {
      status: 0,
      message: '添加失败，请重试'
    }
  }
}