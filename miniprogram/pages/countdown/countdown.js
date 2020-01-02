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
    color: '#ffffff',
    oriColor: '#ffffff',
    colorDefault: '#ffffff',
    loading: false,
    past: false,
    sadday: false,
    remark: '',
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
      str2: { text: '还有' },
      str3: { text: '已去' },
      restDay: { text: '天' },
      restHour: { text: '小时' },
      restMins: { text: '分钟' },
      restSec: { text: '秒' },
      restDayNum: { text: '00', type: 'num', fontSize: '110rpx', left: '50', top: '20' },
      restHourNum: { text: '00', type: 'num', fontSize: '90rpx' },
      restMinsNum: { text: '00', type: 'num', fontSize: '90rpx' },
      restSecNum: { text: '00', type: 'num', fontSize: '90rpx' },
    },
    numberFlag: true,
    canvasData: {},
    dialogButton: [
      { text: '保存图片' }
    ],
    dialogShow: false,
    widthPixels: 300,
    cpShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const self = this;
    if (!options.year) {
      options = app.globalData.date || {year: '2020', month: '01', day: '01'}
    }
    let { year, month, day, id } = options;
    this.setData({
      'textMap.yearNum.text': year,
      'textMap.monthNum.text': self.doubleStr(month),
      'textMap.dayNum.text': self.doubleStr(day),
      query: wx.createSelectorQuery(),
      id: id || ''
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
    let wrapper = (await this.clientRect('.countdown-card'))[0]
    this.setData({
      canvasHeight: wrapper.height * 0.9 + 30
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

  doubleStr: function(val) {
    val = (val + '').length == 1 ? ('0' + val) : val;
    return val
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
      today: today.getFullYear() + '-' + self.doubleStr((today.getMonth() + 1)) + '-' + self.doubleStr(today.getDate())
    });
    timer = setInterval(function () {
      let now = Date.now(),
        diff = Math.abs(dateStamp - now),
        day = Math.floor(diff / oneDay),
        hour = Math.floor(diff % oneDay / oneHour),
        mins = Math.floor(diff % oneDay % oneHour / oneMins),
        sec = Math.floor(diff % oneDay % oneHour % oneMins / oneSec);
      self.setData({
        'textMap.restDayNum.text': self.doubleStr(day),
        'textMap.restHourNum.text': self.doubleStr(hour),
        'textMap.restMinsNum.text': self.doubleStr(mins),
        'textMap.restSecNum.text': self.doubleStr(sec)
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
        'textMap.monthNum.text': self.doubleStr(m),
        'textMap.dayNum.text': self.doubleStr(d),
        'textMap.festival.text': result.festival || dateInfo.Term || '',
        'textMap.lunar.text': dateInfo.IMonthCn + dateInfo.IDayCn,
        sadday: result.sadday || false,
        pickerDate: y + '-' + m + '-' + d,
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
  rpxToPx(rpx) {
    return rpx / 750 * wx.getSystemInfoSync().windowWidth
  },
  share: async function() {
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    this.setData({
      numberFlag: false,
      dialogShow: true
    })
    let self = this
    let textMap = this.data.textMap
    let wrapper = (await this.clientRect('.countdown-card'))[0]
    let rects = await this.clientRect('.canvas-item')
    let codeWidth = 50, codeHeight = 240 / 240 * codeWidth
    this.setData({
      numberFlag: true,
      widthPixels: wrapper.width * 0.9
    })
    let canvasData = {
      width: wrapper.width + 'px',
      height: wrapper.height + codeHeight - 20 + 'px',
      borderRadius: '20rpx',
      views: [
        {
        type: 'image',
        url: this.data.background,
        css: {
          width: wrapper.width + 'px',
          height: wrapper.height + codeHeight - 20 + 'px',
          left: '0px',
          top: '0px',
          borderRadius: '20rpx',
        }
      }, 
      {
        type: 'image',
        url: '/images/ecode.png',
        mode: 'aspectFill',
        css: {
          width: codeWidth + 'px',
          left: wrapper.width - codeWidth + 'px',
          top: wrapper.height - 20 + 'px',
          borderRadius: '0 0 20rpx 0',
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
          left: (textMap[key].center ? 0 : (rect.left - wrapper.left + self.rpxToPx(textMap[key].left || 0)) ) + 'px',
          top: rect.top - wrapper.top + self.rpxToPx(textMap[key].top || 0) + 'px',
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
    wx.hideLoading()
    this.setData({
      saveFile: res.detail.path,
    })
  },
  saveImg: function() {
    const self = this
    const data = this.data
    wx.showLoading({
      mask: true,
    })
    wx.saveImageToPhotosAlbum({
      filePath: data.saveFile,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        self.setData({
          dialogShow: false
        })
      }
    })
  },
  cancelImg: function() {
    this.setData({
      dialogShow: false
    })
  },
  showCp: function() {
    this.setData({
      cpShow: true
    })
  },
  selectColor: function(res) {
    this.setData({
      color: res.detail.color
    })
  },
  okColor: function (res) {
    this.setData({
      color: res.detail.color,
      oriColor: res.detail.oriColor,
      cpShow: false
    })
  }
})