// miniprogram/pages/userFestival/userFestival.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    festivals: [
      {
        festival: '婚礼',
        year: 2020,
        month: 1,
        day: 1,
        remark: '欢迎大家哦',
        bgUrl: 'https://china-festival-1255423800.cos.ap-chengdu.myqcloud.com/countdown/',
        background: '',
        color: ''
      },
      {
        festival: '婚礼',
        year: 2020,
        month: 1,
        day: 1,
        remark: '欢迎大家哦',
        bgUrl: 'https://china-festival-1255423800.cos.ap-chengdu.myqcloud.com/countdown/',
        background: '',
        color: ''
      },
      {
        festival: '婚礼',
        year: 2020,
        month: 1,
        day: 1,
        remark: '欢迎大家哦',
        bgUrl: 'https://china-festival-1255423800.cos.ap-chengdu.myqcloud.com/countdown/',
        background: '',
        color: ''
      },
      {
        festival: '婚礼',
        year: 2020,
        month: 1,
        day: 1,
        remark: '欢迎大家哦',
        bgUrl: 'https://china-festival-1255423800.cos.ap-chengdu.myqcloud.com/countdown/',
        background: '',
        color: ''
      },
      {
        festival: '婚礼',
        year: 2020,
        month: 1,
        day: 1,
        remark: '欢迎大家哦',
        bgUrl: 'https://china-festival-1255423800.cos.ap-chengdu.myqcloud.com/countdown/',
        background: '',
        color: ''
      },
      {
        festival: '婚礼',
        year: 2020,
        month: 1,
        day: 1,
        remark: '欢迎大家哦',
        bgUrl: 'https://china-festival-1255423800.cos.ap-chengdu.myqcloud.com/countdown/',
        background: '',
        color: ''
      },
      {
        festival: '婚礼',
        year: 2020,
        month: 1,
        day: 1,
        remark: '欢迎大家哦',
        bgUrl: 'https://china-festival-1255423800.cos.ap-chengdu.myqcloud.com/countdown/',
        background: '',
        color: ''
      },
      {
        festival: '婚礼',
        year: 2020,
        month: 1,
        day: 1,
        remark: '欢迎大家哦',
        bgUrl: 'https://china-festival-1255423800.cos.ap-chengdu.myqcloud.com/countdown/',
        background: '',
        color: ''
      },
      {
        festival: '婚礼',
        year: 2020,
        month: 1,
        day: 1,
        remark: '欢迎大家哦',
        bgUrl: 'https://china-festival-1255423800.cos.ap-chengdu.myqcloud.com/countdown/',
        background: '',
        color: ''
      }
    ],
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

  addFestival: function(e) {
    let index = e.currentTarget.dataset.index
    console.log('0', index)
  },

  goCountdown: function(e) {
    let index = e.currentTarget.dataset.index
    console.log('1', index)
  },

  goAdd: function() {
    wx.navigateTo({
      url: '/pages/addFestival/addFestival',
    })
  }
})