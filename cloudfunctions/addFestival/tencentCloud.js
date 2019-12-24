// 引入模块
const COS = require('cos-nodejs-sdk-v5')
const secret = require('./secret.js')

// 创建实例
const cos = new COS({
  SecretId: secret.SecretId,
  SecretKey: secret.SecretKey
});


const cosUpload = function (fileName, filePath) {
  // 分片上传
  return new Promise((resolve, reject) => {
    cos.sliceUploadFile({
      Bucket: secret.Bucket,
      Region: 'ap-chengdu',
      Key: 'countdown/' + fileName,
      FilePath: filePath
    }, function (err, data) {
      console.log('filePath', filePath)
      console.log('err', err)
      resolve(data);
    });
  })
}

module.exports = cosUpload