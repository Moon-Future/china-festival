// miniprogram/pages/addFestival/addFestival.js
const app = getApp()
const COS = require('../../js/cos-wx-sdk-v5')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    festival: '',
    date: '2020-01-01',
    remark: '',
    background: '', // 背景图片名称
    bgsrc: '',
    colors: ['#ffffff', '#222831', '#fcbad3', '#00adb5', '#b83b5e', '#ff2e63', '#3f72af', '#ff9a00', '#ca82f8'],
    colorActive: 0,
    bgUrl: 'https://chinafestival-1255423800.cos.ap-guangzhou.myqcloud.com/countdown/',
    canvasData: {},
    widthPixels: 150,
    imgShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const systemInfo = wx.getSystemInfoSync()
    const width = systemInfo.windowWidth * 0.95
    const height = systemInfo.windowHeight - this.rpxToPx(220)
    this.setData({
      width,
      height
    })
    if (options.id) {
      this.getFestival(options.id)
    }
    if (options.date) {
      this.setData({
        date: options.date
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getFestival: function(id) {
    let self = this
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getFestival',
      data: { id }
    }).then(res => {
      wx.hideLoading()
      if (res.result.status == 0) {
        wx.showToast({
          title: res.result.message,
          icon: 'none',
          duration: 2000,
          mask: true
        })
        return
      }
      let data = res.result
      self.setData({
        festival: data.festival,
        date: `${data.year}-${data.month}-${data.day}`,
        remark: data.remark || '',
        colorActive: self.data.colors.indexOf(data.color),
        background: data.background[0],
        id: id
      })
      if (data.background[0]) {
        self.setData({
          oribgsrc: self.data.bgUrl + data.background[0],
          bgsrc: self.data.bgUrl + data.background[0],
          imgShow: true
        })
      }
    }).catch(err => {
      wx.hideLoading()
    })
  },

  formInput: function(e) {
    let field = e.currentTarget.dataset.field
    this.setData({
      [field]: e.detail.value
    })
  },

  bindDateChange: function(e) {
    let date = e.detail.value
    this.setData({
      date
    })
  },

  selectColor: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      colorActive: index
    })
  },

  rpxToPx(rpx) {
    return rpx / 750 * wx.getSystemInfoSync().windowWidth
  },
  
  chooseImage: function() {
    let self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async function(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        self.setData({
          bgsrc: tempFilePaths[0],
          oribgsrc: '',
          imgShow: true
        })
      }
    })
  },

  drawCanvas: function() {
    let data = this.data
    let canvasData = {
      width: data.width + 'px',
      height: data.height + 'px',
      views: [{
        type: 'image',
        url: data.bgsrc,
        css: {
          width: data.width + 'px',
          height: data.height + 'px'
        }
      }]
    }
    this.setData({
      canvasData
    })
  },

  delImg: function() {
    this.setData({
      imgShow: false,
      bgsrc: '',
      oribgsrc: '',
      background: ''
    })
  },

  onImgOK: async function(e) {
    let data = this.data
    if (data.checkImg) {  // 检查图片后，改变像素，重新绘画
      const result = await this.checkImg(e.detail.path)
      if (result.status == 0) {
        return
      }
      this.setData({
        checkImg: false,
        widthPixels: 300
      })
      this.drawCanvas()
    } else {
      this.setData({
        bgsrc: e.detail.path
      })
      this.submit()
    }
  },

  submitClick: function() {
    let data = this.data
    if (data.festival == '') {
      wx.showToast({
        title: '请填写节日名称',
        icon: 'none',
        mask: true
      })
      return
    }
    wx.showLoading({
      title: '正在上传',
      mask: true
    })
    if (data.bgsrc && !data.oribgsrc) {
      this.setData({
        checkImg: true,
        widthPixels: 100
      })
      this.drawCanvas()
    } else {
      this.submit()
    }
  },

  checkImg: function(imgsrc) {
    const data = this.data
    if (data.oribgsrc) {
      return { status: 1 }
    }
    return new Promise((resolve, reject) => {
      //获取 temp临时图片文件的 buffer
      wx.getFileSystemManager().readFile({
        filePath: imgsrc,  //这里做示例，所以就选取第一张图片
        success: buffer => {
          //这里是 云函数调用方法
          wx.cloud.callFunction({
            name: 'checkContent',
            data: {
              buffer: buffer.data
            },
            success(res) {
              if (res.result.status == 0) {
                wx.showToast({
                  title: res.result.message,
                  icon: 'none'
                })
              }
              resolve(res.result)
            }
          })
        },
        error: function (e) {
          reject(e)
        }
      })
    })
  },

  getCosSecret: function() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getCosSecret',
      }).then(res => {
        resolve(JSON.parse(res.result))
      }).catch(err => {
        reject(err)
      })
    })
  },

  getAuthorization: function (options, callback) {
    wx.cloud.callFunction({
      name: 'getCosSecret',
    }).then(res => {
      const data = JSON.parse(res.result)
      const credentials = data.credentials
      callback({
        TmpSecretId: credentials.tmpSecretId,
        TmpSecretKey: credentials.tmpSecretKey,
        XCosSecurityToken: credentials.sessionToken,
        ExpiredTime: data.expiredTime, // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
      })
    }).catch(err => {
      
    })
  },

  uploadFile: function (fileName, filepath, callback) {
    const cos = new COS({
      getAuthorization: this.getAuthorization
    })
    cos.postObject({
      Bucket: 'chinafestival-1255423800',
      Region: 'ap-guangzhou',
      Key: fileName,  //上传COS 的路径 和 文件唯一名
      FilePath: filepath,
      onProgress: function (info) {  //进度的回调函数（进度条）
        // console.log(JSON.stringify(info));
      }
    }, function(err, data) {
      callback(err, data)
    })
  },

  submitData: function(data) {
    wx.cloud.callFunction({
      name: 'addFestival',
      data: data
    }).then(res => {
      if (res.result.status == 1) {
        wx.showToast({
          title: res.result.message,
          duration: 2000,
          mask: true
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none',
          duration: 2000,
          mask: true
        })
      }
    }).catch(err => {

    })
  },

  submit: function() {
    let self = this
    let data = this.data
    let subData = {
      festival: data.festival,
      date: data.date,
      remark: data.remark,
      color: data.colors[data.colorActive],
      background: data.background,
      id: data.id
    }
    if (data.bgsrc && !data.oribgsrc) {
      let fileName = `${app.globalData.userInfo.openid}_${data.festival}_${Date.now()}.jpg`
      this.uploadFile('countdown/' + fileName, data.bgsrc, function(err, data) {
        if (err) {
          wx.showToast({
            title: '图片上传失败，请重试',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else {
          subData.background = fileName
          self.submitData(subData)
        }
      })
    } else {
      this.submitData(subData)
    }
  },

  submitDel: function() {
    const data = this.data
    wx.showModal({
      content: '确认删除？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
          })
          wx.cloud.callFunction({
            name: 'addFestival',
            data: { id: data.id, del: true }
          }).then(res => {
            if (res.result.status == 1) {
              wx.showToast({
                title: res.result.message,
                duration: 2000,
                mask: true
              })
              wx.navigateBack()
            } else {
              wx.showToast({
                title: res.result.message,
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }
          }).catch(err => {

          })
        }
      }
    })
  }
})