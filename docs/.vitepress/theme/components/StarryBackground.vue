<template>
  <div class="starry-background">
    <canvas ref="starCanvas" class="star-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { StarField } from '../utils/starField.js'

const starCanvas = ref(null)
let animationId = null
let starField = null

onMounted(() => {
  if (starCanvas.value) {
    const canvas = starCanvas.value
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    starField = new StarField(canvas)
    animationId = starField.animate()

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      if (starField) {
        starField.resize()
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
.starry-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #0f0f23 25%, #1a1a3a 50%, #2d1b69 75%, #16213e 100%);
  z-index: -1;
}

.star-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style> 