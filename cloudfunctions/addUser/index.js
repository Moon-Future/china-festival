// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const userCollection = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await userCollection.where({
      openid: event.openid
    }).get()
    if (result.data.length !== 0) {
      return {
        status: 1,
        message: '用户已存在'
      }
    } else {
      await userCollection.add({
        data: event
      })
      return {
        status: 1,
        message: '用户添加成功'
      }
    }
  } catch(e) {
    return {
      status: 0,
      message: '用户添加失败'
    }
  }
}