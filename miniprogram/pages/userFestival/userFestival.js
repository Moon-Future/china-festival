// miniprogram/pages/userFestival/userFestival.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    festivals: [],
    bgDefault: 'default.jpg',
    colorDefault: '#fff',
    colorFlag: false,
    selfClicked: false,
    selfId: '',
    date: '2020-01-01',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    if (options.date) {
      this.setData({
        date: options.date,
        selfClicked: true
      })
    }
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: { itemSelf: true }
    }).then(res => {
      if (res.result.status == 1) {
        self.setData({
          colorFlag: true
        })
      }
    }).catch(err => {

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
    this.getUserFestival()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {
    
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

  getUserFestival: function() {
    wx.showLoading()
    let self = this
    wx.cloud.callFunction({
      name: 'getFestival',
      data: {user: true}
    }).then(res => {
      wx.hideLoading()
      if (res.result.status === 0) {
        wx.showToast({
          title: res.result.message,
        })
        return
      }
      self.setData({
        festivals: res.result
      })
    }).catch(err => {

    })
  },

  updFestival: function(e) {
    let index = e.currentTarget.dataset.index
    let data = this.data.festivals[index]
    const self = this
    this.setData({
      selfId: data._id,
    })
    setTimeout(function() {
      self.setData({
        selfClicked: true
      })
    }, 100)
  },

  goCountdown: function(e) {
    let index = e.currentTarget.dataset.index
    let data = this.data.festivals[index]
    wx.navigateTo({
      url: '/pages/countdown/countdown?year=' + data.year + '&month=' + data.month + '&day=' + data.day + '&id=' + data._id
    });
  },

  selfFes: function() {
    this.setData({
      selfClicked: true
    })
  },

  back: function() {
    this.setData({
      selfClicked: false,
      selfId: '',
      date: '2020-01-01'
    })
    this.getUserFestival()
  }
})