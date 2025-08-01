<template>
  <div class="cloud-background">
    <canvas ref="cloudCanvas" class="cloud-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CloudField } from '../utils/cloudField.js'

const cloudCanvas = ref(null)
let animationId = null
let cloudField = null

onMounted(() => {
  if (cloudCanvas.value) {
    const canvas = cloudCanvas.value
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    cloudField = new CloudField(canvas)
    animationId = cloudField.animate()

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      if (cloudField) {
        cloudField.resize()
      }
    })
  }
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.cloud-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: linear-gradient(135deg, #87ceeb 0%, #98d8e8 25%, #b0e0e6 50%, #87cefa 75%, #87ceeb 100%);
  z-index: -1;
  overflow: hidden;
}

.cloud-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}
</style> 