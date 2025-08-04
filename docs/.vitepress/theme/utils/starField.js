// 星星类
class Star {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.x = this.getRandomFloat(0, canvas.width)
    this.y = this.getRandomFloat(0, canvas.height)
    this.size = this.getRandomFloat(0.5, 2.5)
    this.opacity = this.getRandomFloat(0.2, 1.0)
    this.twinkleSpeed = this.getRandomFloat(0.005, 0.015) // 降低闪烁速度
    this.twinklePhase = this.getRandomFloat(0, Math.PI * 2)
    this.color = this.getRandomColor()
  }

  // 使用crypto.randomBytes生成随机浮点数
  getRandomFloat(min, max) {
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)
    crypto.getRandomValues(new Uint8Array(buffer))
    const randomValue = view.getUint32(0, true) / (0xffffffff + 1)
    return min + randomValue * (max - min)
  }

  getRandomColor() {
    const colors = ['#4fc3f7', '#81c784', '#64b5f6', '#9575cd', '#4dd0e1', '#fff', '#bbdefb', '#e1bee7', '#b3e5fc', '#c8e6c9']
    const randomIndex = Math.floor(this.getRandomFloat(0, colors.length))
    return colors[randomIndex]
  }

  update() {
    this.twinklePhase += this.twinkleSpeed
    this.opacity = 0.2 + 0.8 * Math.sin(this.twinklePhase)
  }

  draw() {
    this.ctx.save()
    this.ctx.globalAlpha = this.opacity
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
  }
}

// 流星类
class Meteor {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.reset()
  }

  getRandomFloat(min, max) {
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)
    crypto.getRandomValues(new Uint8Array(buffer))
    const randomValue = view.getUint32(0, true) / (0xffffffff + 1)
    return min + randomValue * (max - min)
  }

  getRandomColor() {
    const colors = ['#4fc3f7', '#81c784', '#64b5f6', '#9575cd', '#4dd0e1', '#fff', '#bbdefb', '#e1bee7', '#b3e5fc', '#c8e6c9', '#ffb74d', '#ff8a65']
    const randomIndex = Math.floor(this.getRandomFloat(0, colors.length))
    return colors[randomIndex]
  }

  reset() {
    // 随机选择起点位置：左上、右上、左中、右中
    const startPositions = [
      { x: this.getRandomFloat(-100, 0), y: this.getRandomFloat(-100, 0) }, // 左上
      { x: this.getRandomFloat(this.canvas.width, this.canvas.width + 100), y: this.getRandomFloat(-100, 0) }, // 右上
      { x: this.getRandomFloat(-100, 0), y: this.getRandomFloat(0, this.canvas.height / 2) }, // 左中
      { x: this.getRandomFloat(this.canvas.width, this.canvas.width + 100), y: this.getRandomFloat(0, this.canvas.height / 2) } // 右中
    ]
    
    const startPos = startPositions[Math.floor(this.getRandomFloat(0, startPositions.length))]
    this.x = startPos.x
    this.y = startPos.y
    
    // 根据起点位置计算合适的角度
    if (this.x < 0) {
      // 从左边开始，向右下方飞行
      this.angle = this.getRandomFloat(15, 75)
    } else if (this.x > this.canvas.width) {
      // 从右边开始，向左下方飞行
      this.angle = this.getRandomFloat(105, 165)
    } else {
      // 从上方开始，向下飞行
      this.angle = this.getRandomFloat(45, 135)
    }
    
    this.length = this.getRandomFloat(60, 200) // 增加长度范围
    this.speed = this.getRandomFloat(2, 6) // 降低速度范围，减少性能消耗
    this.opacity = this.getRandomFloat(0.6, 1.0) // 随机透明度
    this.active = true
    this.color = this.getRandomColor() // 随机颜色
    this.trailOpacity = this.getRandomFloat(0.3, 0.8) // 尾迹透明度
    this.flickerSpeed = this.getRandomFloat(0.01, 0.03) // 降低闪烁速度
    this.flickerPhase = this.getRandomFloat(0, Math.PI * 2) // 闪烁相位
  }

  update() {
    if (!this.active) return

    // 更新闪烁效果
    this.flickerPhase += this.flickerSpeed
    this.opacity = 0.6 + 0.4 * Math.sin(this.flickerPhase)

    this.x += Math.cos(this.angle * Math.PI / 180) * this.speed
    this.y += Math.sin(this.angle * Math.PI / 180) * this.speed

    // 检查是否超出屏幕边界
    if (this.y > this.canvas.height + 100 || 
        this.x > this.canvas.width + 100 || 
        this.x < -100 || 
        this.y < -100) {
      this.active = false
    }
  }

  draw() {
    if (!this.active) return

    this.ctx.save()
    
    // 绘制流星尾迹 - 恢复原来的简单线条样式
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = 3
    this.ctx.globalAlpha = this.opacity * this.trailOpacity
    this.ctx.beginPath()
    this.ctx.moveTo(this.x, this.y)
    this.ctx.lineTo(this.x - this.length * Math.cos(this.angle * Math.PI / 180), 
                     this.y - this.length * Math.sin(this.angle * Math.PI / 180))
    this.ctx.stroke()

    // 绘制流星头部光点 - 恢复原来的大小
    this.ctx.fillStyle = this.color
    this.ctx.globalAlpha = this.opacity
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
    this.ctx.fill()

    // 绘制发光效果 - 恢复原来的大小
    this.ctx.globalAlpha = this.opacity * 0.3
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, 6, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.restore()
  }
}

// 星空管理器
class StarField {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.stars = []
    this.meteors = []
    this.lastMeteorTime = 0
    this.meteorInterval = this.getRandomFloat(3000, 8000) // 3-8秒随机间隔，减少频率
    this.maxMeteors = 5 // 减少最大流星数量
    this.meteorBurstChance = 0.05 // 5%概率产生流星雨爆发，降低概率
    this.lastFrameTime = 0
    this.frameInterval = 1000 / 30 // 限制到30FPS，减少性能消耗

    this.init()
  }

  getRandomFloat(min, max) {
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)
    crypto.getRandomValues(new Uint8Array(buffer))
    const randomValue = view.getUint32(0, true) / (0xffffffff + 1)
    return min + randomValue * (max - min)
  }

  init() {
    // 创建100个星星，减少星星数量
    for (let i = 0; i < 100; i++) {
      this.stars.push(new Star(this.canvas))
    }

    // 创建5个流星，减少初始流星数量
    for (let i = 0; i < this.maxMeteors; i++) {
      this.meteors.push(new Meteor(this.canvas))
    }
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  update() {
    const now = Date.now()

    // 更新星星
    this.stars.forEach(star => star.update())

    // 检查是否触发流星雨爆发
    if (Math.random() < this.meteorBurstChance && now - this.lastMeteorTime > 2000) {
      this.triggerMeteorBurst()
      this.lastMeteorTime = now
    }

    // 更新流星
    this.meteors.forEach(meteor => {
      meteor.update()
      if (!meteor.active && now - this.lastMeteorTime > this.meteorInterval) {
        meteor.reset()
        this.lastMeteorTime = now
        // 重新生成随机间隔
        this.meteorInterval = this.getRandomFloat(3000, 8000)
      }
    })

    // 动态调整流星数量
    this.adjustMeteorCount()
  }

  triggerMeteorBurst() {
    // 流星雨爆发：同时激活多个流星
    const burstCount = Math.floor(this.getRandomFloat(2, 4)) // 减少爆发数量
    let activatedCount = 0
    
    this.meteors.forEach(meteor => {
      if (!meteor.active && activatedCount < burstCount) {
        meteor.reset()
        activatedCount++
      }
    })
  }

  adjustMeteorCount() {
    // 根据屏幕大小动态调整流星数量
    const screenArea = this.canvas.width * this.canvas.height
    const targetMeteors = Math.min(this.maxMeteors, Math.floor(screenArea / 150000)) // 增加面积阈值
    
    // 确保至少有一定数量的流星
    const minMeteors = 3 // 减少最小流星数量
    const maxMeteors = Math.max(minMeteors, targetMeteors)
    
    // 如果流星数量不足，添加新的流星
    while (this.meteors.length < maxMeteors) {
      this.meteors.push(new Meteor(this.canvas))
    }
  }

  draw() {
    // 完全清除画布，不留任何痕迹
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制星星
    this.stars.forEach(star => star.draw())

    // 绘制流星
    this.meteors.forEach(meteor => meteor.draw())
  }

  animate() {
    const now = Date.now()
    
    // 限制帧率到30FPS，减少性能消耗
    if (now - this.lastFrameTime >= this.frameInterval) {
      this.update()
      this.draw()
      this.lastFrameTime = now
    }
    
    return requestAnimationFrame(() => this.animate())
  }
}

export { StarField } 