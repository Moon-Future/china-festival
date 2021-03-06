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
    const id = event.id
    if (event.del) {
      await festivalCollection.where({
        _id: id
      }).remove()
      return {
        status: 1,
        message: '删除成功'
      }
    } else {
      if (event.festival != '') {
        await cloud.openapi.security.msgSecCheck({
          content: event.festival
        })
      }
      if (event.remark != '') {
        await cloud.openapi.security.msgSecCheck({
          content: event.remark
        })
      }
      const data = {
        festival: event.festival.substr(0, 20),
        year: event.date.split('-')[0],
        month: event.date.split('-')[1],
        day: event.date.split('-')[2],
        lunar: false,
        background: [event.background],
        color: event.color,
        remark: event.remark.substr(0, 100),
        user: openid
      }
      if (id) {
        await festivalCollection.where({
          _id: id
        }).update({
          data: data
        })
      } else {
        await festivalCollection.add({
          data: data
        })
      }
      return {
        status: 1,
        message: '添加成功'
      }
    }
  } catch(e) {
    if (e.errCode === 87014) {
      return {
        status: 0,
        message: '内容含有违法违规内容'
      }
    }
    return {
      status: 0,
      message: '提交失败，请重试'
    }
  }
}