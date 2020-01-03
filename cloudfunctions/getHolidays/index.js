// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const holidaysCollection = db.collection('holidays')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { year } = event
    const result = await holidaysCollection.where({ year }).get()
    return result.data
  } catch (e) {
    return {
      status: 0,
      message: '获取失败'
    }
  }
}