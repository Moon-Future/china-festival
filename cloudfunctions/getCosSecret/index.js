// 云函数入口文件
const cloud = require('wx-server-sdk')
const { tencentSecret } = require('./secret.js')
// 临时密钥服务例子
var STS = require('qcloud-cos-sts');

// 配置参数
var config = {
  secretId: tencentSecret.SecretId,
  secretKey: tencentSecret.SecretKey,
  proxy: '',
  durationSeconds: 1800,
  bucket: tencentSecret.Bucket,
  region: tencentSecret.Region,
  allowPrefix: 'countdown/*',
  // 简单上传和分片，需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/14048
  allowActions: [
    'name/cos:PostObject',
  ],
};

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return new Promise((resolve, reject) => {
    // 在 3 秒后返回结果给调用方（小程序 / 其他云函数）
    getCosSecret(resolve, reject)
  })
}


// 格式一：临时密钥接口
function getCosSecret(resolve, reject) {

  // 获取临时密钥
  var LongBucketName = config.bucket;
  var ShortBucketName = LongBucketName.split('-')[0] + '-' + LongBucketName.split('-')[1];
  var AppId = LongBucketName.split('-')[2];
  var policy = {
    'version': '2.0',
    'statement': [{
      'action': config.allowActions,
      'effect': 'allow',
      'principal': { 'qcs': ['*'] },
      'resource': [
        // 'qcs::cos:ap-guangzhou:uid/' + AppId + ':prefix//' + AppId + '/' + ShortBucketName + '/' + config.allowPrefix,
        'qcs::cos:' + config.region + ':uid/' + AppId + ':prefix//' + AppId + '/' + ShortBucketName + '/' + config.allowPrefix,
      ],
    }],
  };
  var startTime = Math.round(Date.now() / 1000);
  STS.getCredential({
    secretId: config.secretId,
    secretKey: config.secretKey,
    proxy: config.proxy,
    durationSeconds: config.durationSeconds,
    policy: policy,
    region: config.region
  }, function (err, tempKeys) {
    var result = JSON.stringify(err || tempKeys) || '';
    result.startTime = startTime;
    resolve(result);
  });
}