// 云函数入口文件
const cloud = require('wx-server-sdk')
const cosUpload = require('./tencentCloud.js')

cloud.init()
const db = cloud.database()
const _ = db.command
const festivalCollection = db.collection('festival')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const background = event.background
    if (background) {
      const now = Date.now()
      console.log('background', background)
      const uploadResult = await cosUpload(`${openid}-${now}.jpg`, background)
      background = `${openid}-${now}.jpg`
      console.log('uploadResult', uploadResult)
      if (uploadResult.statusCode !== 200) {
        return {
          status: 0,
          message: '上传失败'
        }
      }
    }
    const result = await festivalCollection.add({
      data: {
        festival: event.festival,
        year: event.date.split('-')[0],
        month: event.date.split('-')[1],
        day: event.date.split('-')[2],
        lunar: false,
        background: [background],
        color: event.color,
        user: openid
      }
    })
    return {
      status: 1,
      message: '添加成功'
    }
  } catch(e) {
    return {
      status: 0,
      message: '添加失败，请重试'
    }
  }
}