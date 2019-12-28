const calendar = require('../../js/calendar.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lunarDate: '2020-01-01',
    lunarInfo: {},
    yangDate: '2020-01-25',
    yangInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let [lunarY, lunarM, lunarD] = this.data.lunarDate.split('-')
    let lunarInfo = calendar.lunar2solar(lunarY, lunarM, lunarD)
    let [yangY, yangM, yangD] = this.data.yangDate.split('-')
    let yangInfo = calendar.solar2lunar(yangY, yangM, yangD)
    console.log(lunarInfo, yangInfo)
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

  }
})