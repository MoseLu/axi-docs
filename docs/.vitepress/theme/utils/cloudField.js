// 云朵类
class Cloud {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.x = this.getRandomFloat(-200, canvas.width + 200)
    this.y = this.getRandomFloat(50, canvas.height * 0.8) // 扩展到屏幕高度的80%
    this.size = this.getRandomFloat(30, 80)
    this.opacity = this.getRandomFloat(0.3, 0.8)
    this.speed = this.getRandomFloat(0.2, 0.8)
    this.driftSpeed = this.getRandomFloat(0.1, 0.3)
    this.driftPhase = this.getRandomFloat(0, Math.PI * 2)
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
    const colors = ['#ffffff', '#f8f9fa', '#e9ecef', '#f1f3f4', '#fafbfc', '#f5f5f5']
    const randomIndex = Math.floor(this.getRandomFloat(0, colors.length))
    return colors[randomIndex]
  }

  update() {
    // 云朵缓慢移动
    this.x += this.speed
    
    // 云朵轻微上下飘动
    this.driftPhase += this.driftSpeed
    this.y += Math.sin(this.driftPhase) * 0.5

    // 如果云朵移出屏幕，重新从左侧开始
    if (this.x > this.canvas.width + 200) {
      this.x = -200
      this.y = this.getRandomFloat(50, this.canvas.height * 0.8) // 扩展到屏幕高度的80%
    }
  }

  draw() {
    this.ctx.save()
    this.ctx.globalAlpha = this.opacity
    
    // 绘制云朵形状
    this.drawCloud(this.x, this.y, this.size)
    
    this.ctx.restore()
  }

  drawCloud(x, y, size) {
    this.ctx.fillStyle = this.color
    
    // 绘制多个圆形组成云朵形状
    const circles = [
      { x: 0, y: 0, r: size * 0.6 },
      { x: size * 0.4, y: -size * 0.2, r: size * 0.5 },
      { x: size * 0.7, y: 0, r: size * 0.4 },
      { x: size * 0.3, y: size * 0.3, r: size * 0.4 },
      { x: -size * 0.3, y: size * 0.2, r: size * 0.4 },
      { x: -size * 0.2, y: -size * 0.1, r: size * 0.3 }
    ]

    circles.forEach(circle => {
      this.ctx.beginPath()
      this.ctx.arc(x + circle.x, y + circle.y, circle.r, 0, Math.PI * 2)
      this.ctx.fill()
    })
  }
}

// 流云类
class FlowingCloud {
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
    const colors = ['#ffffff', '#f8f9fa', '#e9ecef', '#f1f3f4', '#fafbfc']
    const randomIndex = Math.floor(this.getRandomFloat(0, colors.length))
    return colors[randomIndex]
  }

  reset() {
    // 随机选择起点位置：左上、右上、左中、右中、左下、右下
    const startPositions = [
      { x: this.getRandomFloat(-300, -100), y: this.getRandomFloat(50, 150) }, // 左上
      { x: this.getRandomFloat(this.canvas.width + 100, this.canvas.width + 300), y: this.getRandomFloat(50, 150) }, // 右上
      { x: this.getRandomFloat(-300, -100), y: this.getRandomFloat(150, this.canvas.height * 0.6) }, // 左中
      { x: this.getRandomFloat(this.canvas.width + 100, this.canvas.width + 300), y: this.getRandomFloat(150, this.canvas.height * 0.6) }, // 右中
      { x: this.getRandomFloat(-300, -100), y: this.getRandomFloat(this.canvas.height * 0.6, this.canvas.height * 0.8) }, // 左下
      { x: this.getRandomFloat(this.canvas.width + 100, this.canvas.width + 300), y: this.getRandomFloat(this.canvas.height * 0.6, this.canvas.height * 0.8) } // 右下
    ]
    
    const startPos = startPositions[Math.floor(this.getRandomFloat(0, startPositions.length))]
    this.x = startPos.x
    this.y = startPos.y
    
    // 根据起点位置计算合适的角度
    if (this.x < 0) {
      // 从左边开始，向右飞行
      this.angle = this.getRandomFloat(-15, 15)
    } else {
      // 从右边开始，向左飞行
      this.angle = this.getRandomFloat(165, 195)
    }
    
    this.length = this.getRandomFloat(100, 300) // 流云长度
    this.speed = this.getRandomFloat(1, 3) // 速度
    this.opacity = this.getRandomFloat(0.4, 0.8) // 随机透明度
    this.active = true
    this.color = this.getRandomColor() // 随机颜色
    this.size = this.getRandomFloat(20, 60) // 云朵大小
    this.driftSpeed = this.getRandomFloat(0.02, 0.05) // 飘动速度
    this.driftPhase = this.getRandomFloat(0, Math.PI * 2) // 飘动相位
  }

  update() {
    if (!this.active) return

    // 更新飘动效果
    this.driftPhase += this.driftSpeed
    this.opacity = 0.4 + 0.4 * Math.sin(this.driftPhase)

    this.x += Math.cos(this.angle * Math.PI / 180) * this.speed
    this.y += Math.sin(this.angle * Math.PI / 180) * this.speed

    // 检查是否超出屏幕边界
    if (this.y > this.canvas.height + 200 || 
        this.x > this.canvas.width + 300 || 
        this.x < -300 || 
        this.y < -200) {
      this.active = false
    }
  }

  draw() {
    if (!this.active) return

    this.ctx.save()
    
    // 绘制流云 - 多个小云朵组成
    this.ctx.globalAlpha = this.opacity
    this.ctx.fillStyle = this.color
    
    const cloudCount = Math.floor(this.length / 50)
    for (let i = 0; i < cloudCount; i++) {
      const cloudX = this.x - i * 50 * Math.cos(this.angle * Math.PI / 180)
      const cloudY = this.y - i * 50 * Math.sin(this.angle * Math.PI / 180)
      const cloudSize = this.size * (1 - i / cloudCount) * 0.8
      
      this.drawCloud(cloudX, cloudY, cloudSize)
    }

    this.ctx.restore()
  }

  drawCloud(x, y, size) {
    // 绘制云朵形状
    const circles = [
      { x: 0, y: 0, r: size * 0.6 },
      { x: size * 0.4, y: -size * 0.2, r: size * 0.5 },
      { x: size * 0.7, y: 0, r: size * 0.4 },
      { x: size * 0.3, y: size * 0.3, r: size * 0.4 },
      { x: -size * 0.3, y: size * 0.2, r: size * 0.4 },
      { x: -size * 0.2, y: -size * 0.1, r: size * 0.3 }
    ]

    circles.forEach(circle => {
      this.ctx.beginPath()
      this.ctx.arc(x + circle.x, y + circle.y, circle.r, 0, Math.PI * 2)
      this.ctx.fill()
    })
  }
}

// 蓝天白云管理器
class CloudField {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.clouds = []
    this.flowingClouds = []
    this.lastFlowingCloudTime = 0
    this.flowingCloudInterval = this.getRandomFloat(3000, 8000) // 3-8秒随机间隔
    this.maxFlowingClouds = 5 // 最大流云数量

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
    // 创建20个云朵
    for (let i = 0; i < 20; i++) {
      this.clouds.push(new Cloud(this.canvas))
    }

    // 创建5个流云
    for (let i = 0; i < this.maxFlowingClouds; i++) {
      this.flowingClouds.push(new FlowingCloud(this.canvas))
    }
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  update() {
    const now = Date.now()

    // 更新云朵
    this.clouds.forEach(cloud => cloud.update())

    // 更新流云
    this.flowingClouds.forEach(flowingCloud => {
      flowingCloud.update()
      if (!flowingCloud.active && now - this.lastFlowingCloudTime > this.flowingCloudInterval) {
        flowingCloud.reset()
        this.lastFlowingCloudTime = now
        // 重新生成随机间隔
        this.flowingCloudInterval = this.getRandomFloat(3000, 8000)
      }
    })
  }

  draw() {
    // 清除画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制云朵
    this.clouds.forEach(cloud => cloud.draw())

    // 绘制流云
    this.flowingClouds.forEach(flowingCloud => flowingCloud.draw())
  }

  animate() {
    this.update()
    this.draw()
    return requestAnimationFrame(() => this.animate())
  }
}

export { CloudField } 