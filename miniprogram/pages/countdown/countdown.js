// miniprogram/pages/countdown/countdown.js
const calendar = require('../../js/calendar.js')
const app = getApp()
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: '2020-01-01',
    pickerDate: '',
    bgUrl: 'https://chinafestival-1255423800.cos.ap-guangzhou.myqcloud.com/countdown/',
    background: '',
    bgDefault: 'default.jpg',
    color: '',
    colorDefault: '#fff',
    loading: false,
    past: false,
    sadday: false,
    textMap: {
      str1: { text: '距离' },
      yearNum: { text: '', type: 'num', fontSize: '60rpx' },
      monthNum: { text: '', type: 'num', fontSize: '60rpx' },
      dayNum: { text: '', type: 'num', fontSize: '60rpx' },
      year: { text: '年' },
      month: { text: '月' },
      day: { text: '日' },
      lunar: { text: '', center: true },
      festival: { text: '', center: true, fontSize: '120rpx' },
      str2: { text: '还有', center: true },
      str3: { text: '已过去', center: true },
      restDay: { text: '天' },
      restHour: { text: '小时' },
      restMins: { text: '分钟' },
      restSec: { text: '秒' },
      restDayNum: { text: '00', type: 'num', fontSize: '110rpx' },
      restHourNum: { text: '00', type: 'num', fontSize: '90rpx' },
      restMinsNum: { text: '00', type: 'num', fontSize: '90rpx' },
      restSecNum: { text: '00', type: 'num', fontSize: '90rpx' },
    },
    numberFlag: true,
    canvasData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    if (!options.year) {
      options = app.globalData.date || {year: 2020, month: 1, day: 1}
    }
    let { year, month, day, id } = options;
    this.setData({
      'textMap.yearNum.text': year,
      'textMap.monthNum.text': month,
      'textMap.dayNum.text': day,
      query: wx.createSelectorQuery(),
      id,
    })
    this.getFestival(year, month, day);
    // wx.loadFontFace({
    //   family: 'QcKaiTi',
    //   source: 'url("https://chinafestival-1255423800.cos.ap-guangzhou.myqcloud.com/font/QcKaiTi.ttf")',
    //   success: function() {
    //     self.setData({
    //       loading: false
    //     })
    //   }
    // })
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
    clearInterval(timer);
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

  countdown: function() {
    const self = this;
    clearInterval(timer);
    let oneSec = 1000,
      oneMins = 60 * oneSec,
      oneHour = 60 * oneMins,
      oneDay = 24 * oneHour;
    let date = this.data.date;
    let textMap = this.data.textMap
    let dateStamp = new Date(textMap.yearNum.text + '-' + textMap.monthNum.text + '-' + textMap.dayNum.text).getTime();
    let today = new Date(), now = today.getTime();
    this.setData({
      past: Date.now() - dateStamp > 0 ? true : false,
      today: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    });
    timer = setInterval(function () {
      let now = Date.now(),
        diff = Math.abs(dateStamp - now),
        day = Math.floor(diff / oneDay),
        hour = Math.floor(diff % oneDay / oneHour),
        mins = Math.floor(diff % oneDay % oneHour / oneMins),
        sec = Math.floor(diff % oneDay % oneHour % oneMins / oneSec);
      day = (day + '').length === 1 ? '0' + day : day;
      hour = (hour + '').length === 1 ? '0' + hour : hour;
      mins = (mins + '').length === 1 ? '0' + mins : mins;
      sec = (sec + '').length === 1 ? '0' + sec : sec;
      self.setData({
        'textMap.restDayNum.text': day,
        'textMap.restHourNum.text': hour,
        'textMap.restMinsNum.text': mins,
        'textMap.restSecNum.text': sec
      });
    }, 1000);
  },

  getFestival: function (y, m, d) {
    const self = this;
    let dateInfo = calendar.solar2lunar(y, m, d);
    this.setData({
      loading: true
    })
    wx.showLoading({
      mask: true
    })
    wx.cloud.callFunction({
      name: 'getFestival',
      data: {
        sun: { month: Number(m), day: Number(d) },
        lunar: { month: dateInfo.lMonth, day: dateInfo.lDay },
        one: true,
        id: self.data.id
      }
    }).then(res => {
      let result = res.result;
      let data = self.data;
      wx.hideLoading()
      self.setData({
        'textMap.yearNum.text': y,
        'textMap.monthNum.text': m,
        'textMap.dayNum.text': d,
        'textMap.festival.text': result.festival || '',
        'textMap.lunar.text': dateInfo.IMonthCn + dateInfo.IDayCn,
        sadday: result.sadday || false,
        pickerDate: y + '-' + m + 'd',
        loading: false,
        background: data.bgUrl + (result.background && result.background[0] || data.bgDefault),
        color: result.color || data.colorDefault
      })
      self.countdown();
    }).catch(err => {
      wx.hideToast();
      wx.showToast({
        title: '网络拥堵，请稍后重试',
        duration: 100
      })
      self.setData({
        loading: false
      })
    })
  },
  bindDateChange: function(e) {
    let [year, month, day] = e.detail.value.split('-');
    this.getFestival(year, month, day);
  },
  clientRect: function (query) {
    return new Promise(function (resolve, reject) {
      wx.createSelectorQuery().selectAll(query).boundingClientRect(function (rects) {
        resolve(rects)
      }).exec()
    })
  },
  share: async function() {
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    this.setData({
      numberFlag: false
    })
    let self = this
    let textMap = this.data.textMap
    let wrapper = (await this.clientRect('.countdown-card'))[0]
    let rects = await this.clientRect('.canvas-item')
    let codeWidth = 150, codeHeight = 258 / 515 * codeWidth
    this.setData({
      numberFlag: true
    })
    let canvasData = {
      width: wrapper.width + 'px',
      height: wrapper.height + codeHeight + 'px',
      borderRadius: '20rpx',
      views: [{
        type: 'image',
        url: this.data.background,
        css: {
          width: wrapper.width + 'px',
          height: wrapper.height + 'px',
          left: '0px',
          top: '0px',
        }
      }, {
        type: 'image',
        url: '/images/pcode.jpg',
        mode: 'aspectFill',
        css: {
          width: codeWidth + 'px',
          // height: codeWidth + 'px',
          left: wrapper.width / 2 - codeWidth / 2 + 'px',
          top: wrapper.height + 'px',
        }
      }]
    }
    let views = []
    for (let i = 0, len = rects.length; i < len; i++) {
      let rect = rects[i]
      let key = rect.dataset.key
      views.push({
        type: 'text',
        text: (textMap[key].text || '') + '',
        css: {
          left: (textMap[key].center ? 0 : (rect.left - wrapper.left) ) + 'px',
          top: rect.top - wrapper.top + 'px',
          color: this.data.color || '#fff',
          width: wrapper.width + 'px',
          textAlign: textMap[key].center ? 'center' : 'initial',
          fontSize: textMap[key].fontSize || '40rpx',
          fontFamily: textMap[key].type === 'num' ? 'Number' : 'QcKaiTi'
        }
      })
    }
    canvasData.views = canvasData.views.concat(views)
    self.setData({
      canvasData
    })
  },
  onImgOK: function(res) {
    wx.saveImageToPhotosAlbum({
      filePath: res.detail.path,
      success(res) {
        wx.hideLoading()
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})