// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

function httpRequest(url) {
  return new Promise(function(resolve, reject) {
    request({
      url: url,
      method: 'get'
    }, function (error, response, body) {
      resolve(JSON.parse(body))
    })
  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return {
    openid: wxContext.OPENID
  }
}