let CreateImg = function(opts) {
  let { wx, canvasID, familyStr, familyNum, canvasBg } = opts
  this.opts = {
    wx, canvasID, familyStr, familyNum, canvasBg
  }
  this.init()
};

CreateImg.prototype = {
  init() {
    this.ctx = this.opts.wx.createCanvasContext(this.opts.canvasID)
  },
  updOpts(opts) {
    for (let key in opts) {
      this.opts[key] = opts
    }
  },
  rpxToPx(rpx) {
    return rpx / 750 * this.opts.wx.getSystemInfoSync().windowWidth
  },
  clientRect: function (query) {
    let self = this
    return new Promise(function (resolve, reject) {
      self.opts.wx.createSelectorQuery().selectAll(query).boundingClientRect(function (rects) {
        resolve(rects)
      }).exec()
    })
  },
  saveShare: async function() {
    let self = this
    await self.drawCard()
    self.createImgFile()
  },
  drawCard: async function() {
    let self = this
    return new Promise(async function(resolve) {
      self.opts.wx.showToast({
        icon: 'loading'
      })
      let wrapper = (await self.clientRect('.countdown-card'))[0]
      let rects = await self.clientRect('.canvas-item')
      let { width, height } = wrapper
      self.ctx.clearRect(0, 0, width, height)
      await self.drawImg(wrapper)
      // self.drawLine({ x: 0, y: 0 }, { x: width, y: 0 })
      // self.drawLine({ x: width, y: 0 }, { x: width, y: height })
      // self.drawLine({ x: width, y: height }, { x: 0, y: height })
      // self.drawLine({ x: 0, y: height }, { x: 0, y: 0 })
      for (let i = 0, len = rects.length; i < len; i++) {
        let rect = rects[i]
        self.drawText(rect, wrapper)
      }
      self.ctx.draw(true, function() {
        resolve(true)
      })
    })
  },
  drawImg(wrapper) {
    let self = this
    return new Promise(function (resolve, reject) {
      self.opts.wx.getImageInfo({
        src: self.opts.canvasBg,
        success: function(res) {
          self.ctx.drawImage(res.path, 0, 0, wrapper.width, wrapper.height)
          self.ctx.draw(true, function() {
            resolve(true)
          })
        }
      })
    })
  },
  drawText(rect, wrapper) {
    let size = 40, family = 'QcKaiTi'
    if (rect.dataset.num) {
      size = 60
      family = 'Number'
    }
    if (rect.dataset.size) {
      size = rect.dataset.size
    }
    this.ctx.font = `${this.rpxToPx(size)}px ${family}`
    this.ctx.fillText(rect.dataset.str, rect.left - wrapper.left, rect.top - wrapper.top)
  },
  drawLine: function(start, end) {
    this.ctx.moveTo(start.x, start.y)
    this.ctx.lineTo(end.x, end.y)
    this.ctx.stroke()
    this.ctx.draw(true)
  },
  createImgFile: function() {
    let self = this
    self.opts.wx.canvasToTempFilePath({
      canvasId: this.opts.canvasID,
      success(res) {
        self.saveImg(res.tempFilePath)
      }
    })
  },
  saveImg: function (tempFilePath) {
    let self = this
    self.opts.wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success(res) {
        self.opts.wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
};

module.exports = CreateImg;