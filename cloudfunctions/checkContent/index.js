// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: Buffer.from(event.buffer)
      }
    })
    return {
      status: 1,
      message: '图片合规'
    }
  } catch (e) {
    if (e.errCode === 87014) {
      return {
        status: 0,
        message: '图片含有违法违规内容'
      }
    }
  }
}