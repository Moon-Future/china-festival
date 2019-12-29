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
    weeks: ['一', '二', '三', '四', '五', '六', '日'],
    days: [],
    dateInfo: {},
    date: '',
    infoMap: {},
    animals: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
    animalsImg: {
      '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit', '龙': 'Dragon', '蛇': 'Snake',
      '马': 'Horse', '羊': 'Goat', '猴': 'Monkey', '鸡': 'Rooster', '狗': 'Dog', '猪': 'Pig'
    },
    gzDate: '',
    current: 1,
    oricurrent: 1,
    duration: 500,
    source: true, // swiper source字段
    prevDays: [],
    nextDays: [],
    itemShow: false
  },

  lifetimes: {
    attached: async function() {
      let self = this
      if (!app.globalData.festivals) {
        let { festivals } = await this.getFestivalFromDatabase()
        app.globalData.festivals = festivals
      }
      this.init()
      wx.cloud.callFunction({
        name: 'getUserInfo',
        data: { itemShow: true }
      }).then(res => {
        if (res.result.status == 1) {
          self.setData({
            itemShow: true
          })
        }
      }).catch(err => {

      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init: function(y, m, d) {
      if (!y) {
        let date = new Date();
        y = date.getFullYear()
        m = date.getMonth() + 1
        d = date.getDate()
      }
      let { current, oricurrent, prevDays, days, nextDays } = this.data
      const result = this.initCalendar(y, m, d)
      const prevResult = this.initCalendar(y, m, d, 'prev')
      const nextResult = this.initCalendar(y, m, d, 'next')
      const arr = ['2-0', '1-0', '0-1', '2-1', '1-2', '0-2']
      if (current == oricurrent) {
        // 下拉选择时间，current没变
        switch(current) {
          case 0:
            prevDays = result.days
            days = nextResult.days
            nextDays = prevResult.days
            break;
          case 1:
            prevDays = prevResult.days
            days = result.days
            nextDays = nextResult.days
            break;
          case 2:
            prevDays = result.days
            days = prevResult.days
            nextDays = result.days
            break;
        }
      } else {
        switch (arr.indexOf(oricurrent + '-' + current)) {
          case 0:
          case 1:
            nextDays = prevResult.days
            days = nextResult.days
            break;
          case 2:
          case 3:
            prevDays = prevResult.days
            nextDays = nextResult.days
            break;
          case 4:
          case 5:
            days = prevResult.days
            prevDays = nextResult.days
            break;
        }
      }
      this.setData({
        prevDays, days, nextDays,
        oricurrent: current,
        infoMap: result.infoMap,
        festival: result.festivalValue
      })
    },
    prevMonth: function (y, m, d) {
      let newD = this.data.day, newY, newM
      if (m == 1) {
        newY = y - 1
        newM = 12
      } else {
        newY = y
        newM = m - 1
      }
      newD = Math.min(newD, calendar.solarDays(newY, newM))
      return { y: newY, m: newM, d: newD }
    },
    nextMonth: function(y, m, d) {
      let newD = this.data.day, newY, newM
      if (m == 12) {
        newY = y + 1
        newM = 1
      } else {
        newY = y
        newM = m + 1
      }
      newD = Math.min(newD, calendar.solarDays(newY, newM))
      return { y: newY, m: newM, d: newD }
    },
    // flag 是否计算前后各一月
    initCalendar(y, m, d, flag) {
      let field = 'days'
      if (flag == 'prev') {
        field = 'prevDays'
        let prevResult = this.prevMonth(y, m, d)
        y = prevResult.y
        m = prevResult.m
        d = prevResult.d
      } else if (flag == 'next') {
        field = 'nextDays'
        let nextResult = this.nextMonth(y, m, d)
        y = nextResult.y
        m = nextResult.m
        d = nextResult.d
      }

      let date = new Date(y + '-' + m + '-' + d);
      let w = date.getDay();
      let dateInfo = calendar.solar2lunar(y, m, d);
      let today = new Date();
      let now = today.getFullYear() === y && (today.getMonth() + 1) === m && today.getDate() === d ? true : false;
      if (!flag) {
        this.setData({
          year: y,
          month: m,
          day: d,
          week: w,
          dateInfo: dateInfo,
          now
        })
        app.globalData.date = {
          year: y,
          month: m,
          day: d
        }
      }
      let maxDay = new Date(y, m, 0).getDate(),
        weekStart = new Date(y, m - 1, 1).getDay(),
        prevEnd = new Date(y, m - 1, 0).getDate(),
        days = [], arr = [], dayStart = 0,
        len = Math.ceil(maxDay / 7),
        year, month, next = null, obj = {}, info = {};
      weekStart = weekStart == 0 ? 6 : weekStart - 1;
      for (let i = 0; i <= len; i++) {
        if (next) {
          break;
        }
        arr = [];
        if (i === 0) {
          let prevLen = weekStart === 0 ? 7 : weekStart
          if (prevLen != 7) {
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
                term: info.Term || '',
                week: info.nWeek === 7 ? 0 : info.nWeek,
                prev: true
              })
            }
          }
        }
        for (let j = arr.length; j < 7; j++) {
          dayStart += 1;
          if (dayStart > maxDay) {
            // 如果arr为空，则全为下一个月了
            if (arr.length === 0) {
              break;
            }
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
            term: info.Term || '',
            week: info.nWeek === 7 ? 0 : info.nWeek
          };
          next ? obj.next = true : false;
          // if (month === m && dayStart === d) {
          //   obj.active = true;
          // }
          arr.push(obj);
        }
        days.push(arr);
      }
      return this.getFestival(days)
    },
    selectDay(e) {
      let info = e.currentTarget.dataset.info;
      let current = this.data.current
      let field = current == 1 ? 'days' : (current == 0 ? 'prevDays' : 'nextDays')
      let days = this.data[field]
      app.globalData.date = {
        year: info.year,
        month: info.month,
        day: info.day
      }
      if (info.year !== this.data.year || info.month !== this.data.month) {
        this.init(info.year, info.month, info.day);
      } else {
        // for (let i = 0, len = days.length; i < len; i++) {
        //   var arr = days[i];
        //   for (let j = 0; j < arr.length; j++) {
        //     let item = arr[j];
        //     if (item.year === info.year && item.month === info.month && item.day === info.day) {
        //       item.active = true;
        //     } else {
        //       delete item.active;
        //     }
        //   }
        // }
        let now = new Date();
        this.setData({
          [field]: days,
          year: info.year,
          month: info.month,
          day: info.day,
          week: info.week,
          festival: info.festival || info.lunarFestival || info.term || '',
          now: info.year == now.getFullYear() && info.month === now.getMonth() + 1 && info.day === now.getDate() ? true : false,
          dateInfo: calendar.solar2lunar(info.year, info.month, info.day),
          date: info.year + '-' + info.month + '-' + info.day
        });
      }
    },
    getFestivalFromDatabase: function() {
      wx.showLoading({
        mask: true,
      })
      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'getFestival',
          data: { all: true }
        }).then(res => {
          wx.hideLoading()
          resolve(res.result)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getFestivalFromGlobal: function(params) {
      let { month, lunarMonth } = params
      let festivalResult = [], lunarFestivalResult = []
      let festival = {}, lunarFestival = {}
      let festivals = app.globalData.festivals
      for (let i = 0, len = month.length; i < len; i++) {
        let m = month[i].split('-')[1]
        for (let j = 0; j < festivals.length; j++) {
          let item = festivals[j]
          if (item.month == m && !item.lunar) {
            festivalResult.push(item)
          }
        }
      } 
      for (let i = 0, len = lunarMonth.length; i < len; i++) {
        let m = lunarMonth[i].split('-')[1]
        for (let j = 0; j < festivals.length; j++) {
          let item = festivals[j]
          if (item.month == m && item.lunar) {
            lunarFestivalResult.push(item)
          }
        }
      }
      festivalResult.forEach(item => {
        festival[item.month + '-' + item.day] = item;
      })
      lunarFestivalResult.forEach(item => {
        lunarFestival[item.month + '-' + item.day] = item;
      })
      return {
        festival, lunarFestival
      }
    },
    getFestival(days) {
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
      let { festival, lunarFestival } = this.getFestivalFromGlobal({ month, lunarMonth });
      let data = this.data
      let festivalValue
      for (let i = 0, len = days.length; i < len; i++) {
        var arr = days[i];
        for (let j = 0; j < arr.length; j++) {
          let item = arr[j];
          if (festival[item.month + '-' + item.day]) {
            item.festival = festival[item.month + '-' + item.day].festival;
          }
          if (lunarFestival[item.lunarM + '-' + item.lunarD]) {
            item.lunarFestival = lunarFestival[item.lunarM + '-' + item.lunarD].festival;
          }
          infoMap[item.year + '-' + (item.month < 10 ? '0' + item.month : item.month) + '-' + (item.day < 10 ? '0' + item.day : item.day)] = item;
          if (item.year == data.year && item.month == data.month && item.day == data.day) {
            festivalValue = item.festival || item.lunarFestival || item.term
          }
        }
      }
      return { days, infoMap, festivalValue }
      // this.setData({
      //   days: days
      // })
      // // 当前月
      // if (!flag) {
      //   this.setData({
      //     infoMap: infoMap,
      //     festival: festivalValue
      //   })
      // }

      // wx.showLoading({
      //   mask: true
      // })
      // wx.cloud.callFunction({
      //   name: 'getFestival',
      //   data: {
      //     month,
      //     lunarMonth
      //   }
      // }).then(res => {
      //   let { festival, lunarFestival } = res.result;
      //   let data = self.data
      //   let festivalValue
      //   for (let i = 0, len = days.length; i < len; i++) {
      //     var arr = days[i];
      //     for (let j = 0; j < arr.length; j++) {
      //       let item = arr[j];
      //       if (festival[item.month + '-' + item.day]) {
      //         item.festival = festival[item.month + '-' + item.day].festival;
      //       }
      //       if (lunarFestival[item.lunarM + '-' + item.lunarD]) {
      //         item.lunarFestival = lunarFestival[item.lunarM + '-' + item.lunarD].festival;
      //       }
      //       infoMap[item.year + '-' + item.month + '-' + item.day] = item;
      //       if (item.year == data.year && item.month == data.month && item.day == data.day) {
      //         festivalValue = item.festival || item.lunarFestival || item.term
      //       }
      //     }
      //   }
      //   self.setData({
      //     days: days,
      //     infoMap: infoMap,
      //     festival: festivalValue
      //   });

      //   let y = this.data.year
      //   let m = this.data.month
      //   let d = this.data.day
      //   self.initCalendar(y, m, d, 'prev')
      //   self.initCalendar(y, m, d, 'next')
      //   wx.hideLoading()
      // }).catch(err => {
      //   wx.showToast({
      //     title: '网络拥堵，请稍后重试',
      //     duration: 100,
      //     mask: true
      //   })
      // })
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
          data: userInfo
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
    changeTab(e) {
      this.setData({
        current: e.detail.current
      })
    },
    animationfinish() {
      let { current, oricurrent, year, month, day } = this.data
      if (current == oricurrent) {
        return
      }
      let left = false
      const arr = ['2-0', '1-0', '0-1', '2-1', '1-2', '0-2']
      switch (arr.indexOf(oricurrent + '-' + current)) {
        case 0:
        case 2:
        case 4:
          left = true;
          break;
      }
      if (left) { // 左滑
        let { y, m, d } = this.nextMonth(year, month, day)
        this.init(y, m, d)
      } else { // 右滑
        let { y, m, d } = this.prevMonth(year, month, day)
        this.init(y, m, d);
      }
    }
  }
})