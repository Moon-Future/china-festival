// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const festivalCollection = db.collection('festival')

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.user || event.id) {
    try {
      let festivalResult
      if (event.user) {
        const wxContext = cloud.getWXContext()
        const openid = wxContext.OPENID
        festivalResult = await festivalCollection.where({
          user: openid
        }).get()
        return festivalResult.data
      } else {
        festivalResult = await festivalCollection.where({
          _id: event.id
        }).get()
        return festivalResult.data[0]
      }
    } catch(e) {
      return { status: 0, message: '请先登录' }
    }
  } else {
    if (event.all) { // 获取全部节日 缓存到前端
      const result = await festivalCollection.where({
        user: _.eq(null)
      }).get()
      return {
        festivals: result.data
      }
    } else if (!event.one) { //  日历
      let { month, lunarMonth } = event
      let conditionArr = [], conditionLunarArr = []
      month.forEach(item => {
        conditionArr.push({
          month: Number(item.split('-')[1]),
          lunar: false
        })
      })
      lunarMonth.forEach(item => {
        conditionLunarArr.push({
          month: Number(item.split('-')[1]),
          lunar: true
        })
      })
      let festivalResult = await festivalCollection.where(_.or(conditionArr)).get()
      let lunarFestivalResult = await festivalCollection.where(_.or(conditionLunarArr)).get()
      let festival = {}, lunarFestival = {}
      festivalResult.data.forEach(item => {
        festival[item.month + '-' + item.day] = item;
      })
      lunarFestivalResult.data.forEach(item => {
        lunarFestival[item.month + '-' + item.day] = item;
      })
      return {
        festival,
        lunarFestival
      }
    } else { // 倒计时
      let { sun, lunar, id } = event
      if (id) {
        let result = await festivalCollection.where({
          _id: id
        }).get()
        return result.data[0] || {}
      }
      let result = await festivalCollection.where(_.or([
        {
          month: sun.month,
          day: sun.day,
          lunar: false
        },
        {
          month: lunar.month,
          day: lunar.day,
          lunar: true
        }
      ])).get()
      let data = result.data[result.data.length - 1] || {}
      return data
    }
  }
}