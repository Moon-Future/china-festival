// miniprogram/pages/addFestival/addFestival.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    festival: '',
    date: '2020-01-01',
    remark: '',
    bgsrc: '',
    colors: ['#ffffff', '#222831', '#fcbad3', '#00adb5', '#b83b5e', '#ff2e63', '#3f72af', '#ff9a00', '#ca82f8'],
    colorActive: 0,
    canvasData: {},
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
    this.canvasData()
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
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        self.setData({
          bgsrc: tempFilePaths[0]
        })
        self.canvasData()
      }
    })
  },

  canvasData: function(flag = false) {
    let data = this.data,
      color = data.colors[data.colorActive]
    if (data.bgsrc) {
      let canvasData = {
        background: data.bgsrc,
        width: data.width + 'px',
        height: data.height + 'px',
        views: []
      }
      if (!flag) {
        canvasData.views = [{
          type: 'text',
          text: '2019 年 12 月 25 号',
          css: {
            left: '0px',
            top: '50px',
            color: color,
            width: data.width + 'px',
            textAlign: 'center',
            fontSize: '40rpx'
          }
        }, {
          type: 'text',
          text: '春节',
          css: {
            left: '0px',
            top: '200px',
            color: color,
            width: data.width + 'px',
            textAlign: 'center',
            fontSize: '120rpx'
          }
        }, {
          type: 'text',
          text: '07 18 18 18',
          css: {
            left: '0px',
            top: '400px',
            color: color,
            width: data.width + 'px',
            textAlign: 'center',
            fontSize: '60rpx'
          }
        }]
      }
      this.setData({
        imgShow: true,
        canvasData,
        submit: flag
      })
    } else {
      this.setData({
        imgShow: false,
        submit: flag
      })
      this.submit()
    }
  },

  delImg: function() {
    this.setData({
      imgShow: false,
      bgsrc: ''
    })
  },

  onImgOK: function(e) {
    let data = this.data
    if (!data.submit) {
      return
    }
    this.setData({
      bgsrc: e.detail.path
    })
    this.submit()
  },

  submitClick: function() {
    let data = this.data
    if (data.festival == '') {
      wx.showToast({
        title: '请填写节日名称',
        icon: 'none'
      })
      return
    }
    this.canvasData(true)
  },

  submit: function() {
    let data = this.data
    let subData = {
      festival: data.festival,
      date: data.date,
      remark: data.remark,
      color: data.colors[data.colorActive],
      background: data.bgsrc
    }
    wx.cloud.callFunction({
      name: 'addFestival',
      data: subData
    }).then(res => {
      if (res.result.status == 1) {
        wx.showToast({
          title: res.result.message,
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(err => {

    })
  }
})