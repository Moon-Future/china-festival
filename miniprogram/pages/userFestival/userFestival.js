// miniprogram/pages/userFestival/userFestival.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    festivals: [],
    bgDefault: 'default.jpg',
    colorDefault: '#fff',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  addFestival: function(e) {
    let index = e.currentTarget.dataset.index
    console.log('0', index)
  },

  goCountdown: function(e) {
    let index = e.currentTarget.dataset.index
    let data = this.data.festivals[index]
    wx.navigateTo({
      url: '/pages/countdown/countdown?year=' + data.year + '&month=' + data.month + '&day=' + data.day + '&id=' + data._id
    });
  },

  goAdd: function() {
    wx.navigateTo({
      url: '/pages/addFestival/addFestival',
    })
  }
})