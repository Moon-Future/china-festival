// components/month/month.js
const calendar = require('../../js/calendar.js');
const app = getApp()
let startX = 0
let startY = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    year: 2019,
    month: 12,
    day: 1,
    week: 0,
    now: true,
    festival: '',
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
    dateInfo: {},
    date: '',
    infoMap: {},
    animals: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
    animalsImg: {
      '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit', '龙': 'Dragon', '蛇': 'Snake',
      '马': 'Horse', '羊': 'Goat', '猴': 'Monkey', '鸡': 'Rooster', '狗': 'Dog', '猪': 'Pig'
    }
  },

  lifetimes: {
    attached() {
      let date = new Date();
      let y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate();
      this.initCalendar(y, m, d);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initCalendar(y, m, d) {
      let date = new Date(y + '-' + m + '-' + d);
      let w = date.getDay();
      let dateInfo = calendar.solar2lunar(y, m, d);
      let today = new Date();
      let now = today.getFullYear() === y && (today.getMonth() + 1) === m && today.getDate() === d ? true : false;
      this.setData({
        year: y,
        month: m,
        day: d,
        week: w,
        dateInfo: dateInfo,
        now
      })
      let maxDay = new Date(y, m, 0).getDate(),
        weekStart = new Date(y, m - 1, 1).getDay(),
        prevEnd = new Date(y, m - 1, 0).getDate(),
        days = [], arr = [], dayStart = 0,
        len = Math.ceil(maxDay / 7),
        year, month, next = null, obj = {}, info = {};
      for (let i = 0; i <= len; i++) {
        if (next) {
          break;
        }
        arr = [];
        if (i === 0) {
          let prevLen = weekStart === 0 ? 7 : weekStart
          for (let j = prevLen - 1; j >= 0; j--) {
            year = m === 1 ? y - 1 : y;
            month = m === 1 ? 12 : m - 1;
            info = calendar.solar2lunar(year, month, prevEnd - j);
            arr.push({
              year,
              month,
              day: prevEnd - j,
              lunar: info.IDayCn,
              lunarY: info.lYear,
              lunarM: info.lMonth,
              lunarD: info.lDay,
              week: info.nWeek === 7 ? 0 : info.nWeek,
              prev: true
            })
          }
        }
        for (let j = arr.length; j < 7; j++) {
          dayStart += 1;
          if (dayStart > maxDay) {
            dayStart = 1;
            next = true;
          }
          year = m === 12 && next ? y + 1 : y;
          month = m === 12 && next ? 1 : (next ? m + 1 : m);
          info = calendar.solar2lunar(year, month, dayStart);
          obj = {
            year,
            month,
            day: dayStart,
            lunar: info.IDayCn,
            lunarY: info.lYear,
            lunarM: info.lMonth,
            lunarD: info.lDay,
            week: info.nWeek === 7 ? 0 : info.nWeek
          };
          next ? obj.next = true : false;
          if (month === m && dayStart === d) {
            obj.active = true;
          }
          arr.push(obj);
        }
        days.push(arr);
      }
      this.setData({
        days: days
      });
      this.getFestival();
    },
    selectDay(e) {
      let info = e.currentTarget.dataset.info;
      let days = this.data.days;
      app.globalData.date = {
        year: info.year,
        month: info.month,
        day: info.day
      }
      if (info.year !== this.data.year || info.month !== this.data.month) {
        this.initCalendar(info.year, info.month, info.day);
      } else {
        for (let i = 0, len = days.length; i < len; i++) {
          var arr = days[i];
          for (let j = 0; j < arr.length; j++) {
            let item = arr[j];
            if (item.year === info.year && item.month === info.month && item.day === info.day) {
              item.active = true;
            } else {
              delete item.active;
            }
          }
        }
        let now = new Date();
        this.setData({
          days,
          year: info.year,
          month: info.month,
          day: info.day,
          week: info.week,
          festival: info.festival || info.lunarFestival || '',
          now: info.year == now.getFullYear() && info.month === now.getMonth() + 1 && info.day === now.getDate() ? true : false,
          dateInfo: calendar.solar2lunar(info.year, info.month, info.day),
          date: info.year + '-' + info.month + '-' + info.day
        });
      }
    },
    getFestival() {
      const self = this;
      const days = this.data.days;
      let month = [], lunarMonth = [];
      let now = new Date();
      let infoMap = {};
      for (let i = 0, len = days.length; i < len; i++) {
        var arr = days[i];
        for (let j = 0; j < arr.length; j++) {
          let item = arr[j];
          if (month.indexOf(item.year + '-' + item.month) === -1) {
            month.push(item.year + '-' + item.month);
          }
          if (lunarMonth.indexOf(item.lunarY + '-' + item.lunarM) === -1) {
            lunarMonth.push(item.lunarY + '-' + item.lunarM);
          }
        }
      }
      wx.showLoading({
        mask: true
      })
      wx.cloud.callFunction({
        name: 'getFestival',
        data: {
          month,
          lunarMonth
        }
      }).then(res => {
        wx.hideLoading()
        let { festival, lunarFestival } = res.result;
        for (let i = 0, len = days.length; i < len; i++) {
          var arr = days[i];
          for (let j = 0; j < arr.length; j++) {
            let item = arr[j];
            if (festival[item.month + '-' + item.day]) {
              item.festival = festival[item.month + '-' + item.day].festival;
            }
            if (lunarFestival[item.month + '-' + item.day]) {
              item.lunarFestival = lunarFestival[item.month + '-' + item.day].festival;
            }
            infoMap[item.year + '-' + item.month + '-' + item.day] = item;
          }
        }
        self.setData({
          days: days,
          infoMap: infoMap
        });
      }).catch(err => {
        wx.showToast({
          title: '网络拥堵，请稍后重试',
          duration: 100,
          mask: true
        })
      })
      app.globalData.date = {
        year: this.data.year,
        month: this.data.month,
        day: this.data.day
      }
    },
    bindDateChange(e) {
      let [year, month, day] = e.detail.value.split('-');
      this.setData({
        date: e.detail.value
      })
      this.selectDay({
        currentTarget: {
          dataset: {
            info: Number(year) === this.data.year && Number(month) === this.data.month ? this.data.infoMap[e.detail.value] : { year: Number(year), month: Number(month), day: Number(day)}
          }
        }
      })
    },
    backToday() {
      if (this.data.now) {
        return;
      }
      let today = new Date();
      this.bindDateChange({
        detail: {
          value: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        }
      })
    },
    gotoCountdown() {
      let data = this.data;
      wx.navigateTo({
        url: '/pages/countdown/countdown?year=' + data.year + '&month=' + data.month + '&day=' + data.day
      });
    },
    goadd(e) {
      let userInfo = e.detail.userInfo
      let data = this.data;
      if (userInfo) {
        wx.cloud.callFunction({
          name: 'getUserInfo',
          data: {}
        }).then(res => {
          userInfo.openid = res.result.openid
          app.globalData.userInfo = userInfo
          wx.navigateTo({
            url: '/pages/addFestival/addFestival?date=' + data.year + '-' + data.month + '-' + data.day
          });
        }).catch(err => {

        })
      }
    },
    touchStart(e) {
      startX = e.touches[0].pageX
      startY = e.touches[0].pageY
    },
    touchEnd(e) {
      let endX = e.changedTouches[0].pageX
      let endY = e.changedTouches[0].pageY
      let diffx = endX - startX
      let { year, month, day } = this.data
      if (diffx > 50 && Math.abs(startY - endY) < 50) {
        if (month == 1) {
          month = 12
          year -= 1
        } else {
          month -= 1
        }
        day = 1
        this.bindDateChange({
          detail: {
            value: year + '-' + month + '-' + day
          }
        });
      } else if (diffx < -50 && Math.abs(endY - startY) < 50) {
        if (month == 12) {
          month = 1
          year += 1
        } else {
          month += 1
        }
        day = 1
        this.bindDateChange({
          detail: {
            value: year + '-' + month + '-' + day
          }
        });
      }
    }
  }
})