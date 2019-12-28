const calendar = require('../../js/calendar.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lunarDate: '2020-01-01',
    solarDate: '2020-01-25',
    dateinfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.solar2lunar(this.data.solarDate, true)
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

  solar2lunar: function(date, flag) {
    let [y, m, d] = date.split('-')
    let dateInfo, solarDate, lunarDate
    if (flag) {
      dateInfo = calendar.solar2lunar(y, m, d)
    } else {
      dateInfo = calendar.lunar2solar(y, m, d)
    }
    this.setData({
      lunarDate: dateInfo.lunarDate,
      solarDate: dateInfo.date,
      dateInfo: dateInfo
    })
    console.log(dateInfo)
  },

  solarDateChange: function(e) {
    this.solar2lunar(e.detail.value, true)
  },

  lunarDateChange: function (e) {
    this.solar2lunar(e.detail.value, false)
  }
})