// 引入模块
const COS = require('cos-nodejs-sdk-v5')
const secret = require('./secret.js')
const request = require('request')
const fs = require('fs')

// 创建实例
const cos = new COS({
  SecretId: secret.SecretId,
  SecretKey: secret.SecretKey
});


// const cosUpload = function (fileName, filePath) {
//   // 分片上传
//   return new Promise((resolve, reject) => {
//     cos.sliceUploadFile({
//       Bucket: secret.Bucket,
//       Region: 'ap-chengdu',
//       Key: 'countdown/' + fileName,
//       FilePath: filePath
//     }, function (err, data) {
//       console.log('filePath', filePath)
//       console.log('err', err)
//       resolve(data);
//     });
//   })
// }

// const cos = new COS({
//   getAuthorization: function(options, callbacl) {
//     request({
//       url: '../server/sts.php',
//       data: {
//         // 可从 options 取需要的参数
//       }
//     }, function (err, response, body) {
//       try {
//         let data = JSON.parse(body);
//         let credentials = data.credentials;
//       } catch (e) { }
//       callback({
//         TmpSecretId: credentials.tmpSecretId,        // 临时密钥的 tmpSecretId
//         TmpSecretKey: credentials.tmpSecretKey,      // 临时密钥的 tmpSecretKey
//         XCosSecurityToken: credentials.sessionToken, // 临时密钥的 sessionToken
//         ExpiredTime: data.expiredTime,               // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
//       })
//     })
//   }
// })

const cosUpload = function (fileName, filePath) {
  console.log(fileName, filePath)
  return new Promise((resolve, reject) => {
    cos.postObject({
      Bucket: secret.Bucket,
      Region: secret.Region,
      Key: 'countdown/' + fileName,
      FilePath: filePath,
      // StorageClass: 'STANDARD',
      // Body: fs.createReadStream(filePath), // 上传文件对象
      onProgress: function(info) {
        console.log(JSON.stringify(info))
      }
    }, function(err, data) {
      console.log(err, data)
      resolve(data)
    })
  })
}

module.exports = cosUpload