// components/navbar/navbar.js
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
      // { name: '节日', icon: 'icon-user', url: '/pages/user/user' },
      // { name: '我的', icon: 'icon-user', url: '/pages/user/user' }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
