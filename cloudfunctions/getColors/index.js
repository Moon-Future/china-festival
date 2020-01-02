// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const colorsCollection = db.collection('colors')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await colorsCollection.where({}).get()
    const data = []
    result.data.forEach(item => {
      data.push(item.color)
    })
    return data
  } catch(e) {
    return {
      status: 0,
      message: '获取失败'
    }
  }
}