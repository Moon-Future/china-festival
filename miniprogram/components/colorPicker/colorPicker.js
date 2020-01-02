// components/colorPicker/colorPicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    color: {
      type: String,
      value: '#ffffff'
    },
    oriColor: {
      type: String,
      value: '#ffffff'
    },
    cpShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    colors: ['#ffffff', '#222831', '#fcbad3', '#00adb5', '#b83b5e', '#ff2e63', '#3f72af', '#ff9a00', '#ca82f8'],
    colorActive: 0
  },

  lifetimes: {
    attached: async function () {
      let self = this
      wx.cloud.callFunction({
        name: 'getColors'
      }).then(res => {
        if (res.result.status != 0) {
          self.setData({
            colors: res.result
          })
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectColor(e) {
      let index = e.currentTarget.dataset.index
      this.setData({
        colorActive: index
      })
      this.triggerEvent('selectColor', {
        color: this.data.colors[index]
      })
    },
    cancel() {
      this.triggerEvent('okColor', {
        color: this.data.oriColor,
        oriColor: this.data.oriColor
      })
      this.setData({
        colorActive: this.data.colors.indexOf(this.data.oriColor)
      })
    },
    ok() {
      this.triggerEvent('okColor', {
        color: this.data.colors[this.data.colorActive],
        oriColor: this.data.colors[this.data.colorActive]
      })
    }
  }
})
