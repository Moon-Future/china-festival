// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const userCollection = db.collection('user')

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.itemShow) {
      const result = await userCollection.where({
        openid: '236338364'
      }).get()
      if (result.data.length !== 0) {
        return { status: 1 }
      } else {
        return { status: 0 }
      }
    }

    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    event.openid = openid
    const result = await userCollection.where({
      openid: event.openid
    }).get()
    console.log(event, result)
    if (result.data.length !== 0) {
      return {
        status: 1,
        message: '用户已存在',
        openid: openid
      }
    } else {
      await userCollection.add({
        data: event
      })
      return {
        status: 1,
        message: '用户添加成功',
        openid: openid
      }
    }
  } catch (e) {
    console.log(e)
    return {
      status: 0,
      message: '用户添加失败'
    }
  }
}