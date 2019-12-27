// miniprogram/pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    if (!app.globalData.userInfo) {
      wx.getSetting({
        success: async function (res) {
          if (res.authSetting['scope.userInfo']) {
            let info = await self.getUserInfo()
            let { userInfo } = info
            wx.cloud.callFunction({
              name: 'getUserInfo',
              data: {}
            }).then(res => {
              userInfo.openid = res.result.openid
              self.setData({
                userInfo
              })
              app.globalData.userInfo = userInfo
            }).catch(err => {

            })
          }
        }
      })
    } else {
      self.setData({
        userInfo: app.globalData.userInfo
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

  getUserInfo: function() {
    return new Promise(function(resolve, reject) {
      wx.getUserInfo({
        success: function (res) {
          resolve(res)
        }
      })
    })
  },

  getUserUnionId: function (encryptedData, iv, sessionKey) {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        encryptedData,
        iv,
        sessionKey
      }
    }).then(res => {
      console.log('res', res)
    }).catch(err => {

    })
  }
})