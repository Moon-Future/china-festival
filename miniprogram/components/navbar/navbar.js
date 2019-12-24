// components/navbar/navbar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menuList: [
      { name: '日历', icon: 'icon-rili', url: '/pages/calendar/calendar' },
      { name: '倒计时', icon: 'icon-loudou', url: '/pages/countdown/countdown' },
      { name: '节日', icon: 'icon-user', url: '/pages/user/user' },
      { name: '我的', icon: 'icon-user', url: '/pages/user/user', userInfo: true }
    ],
    index: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateTo(e) {
      let index = e.currentTarget.dataset.index
      let data = this.data.menuList[index]
      this.setData({
        index
      })
      if (!data.userInfo) {
        wx.navigateTo({
          url: this.data.menuList[index].url,
        })
      }
    },

    getUserInfo(e) {
      let userInfo = e.detail.userInfo
      if (userInfo) {
        app.globalData.userInfo = userInfo
        wx.navigateTo({
          url: this.data.menuList[this.data.index].url,
        })
      }
    }
  }
})
