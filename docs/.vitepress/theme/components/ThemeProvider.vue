<template>
  <div :class="themeClass" :data-theme="currentTheme" :data-hydrated="isClient">
    <slot />
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { computed, watch, onMounted, nextTick, ref } from 'vue'

// 使用 VitePress 的 useData 钩子获取主题状态
const { isDark } = useData()

// 客户端状态标记
const isClient = ref(false)

// 当前主题状态
const currentTheme = computed(() => {
  return isDark.value ? 'dark' : 'light'
})

// 根据主题动态设置CSS类
const themeClass = computed(() => {
  // 在服务端渲染时，使用默认主题避免水合不匹配
  if (!isClient.value) {
    return 'cloud-theme' // 默认使用浅色主题
  }
  return isDark.value ? 'starry-theme' : 'cloud-theme'
})

// 应用主题类名的函数
const applyThemeClass = () => {
  if (typeof document !== 'undefined') {
    const html = document.documentElement
    const body = document.body
    const currentThemeClass = isDark.value ? 'starry-theme' : 'cloud-theme'
    
    // 移除所有可能的主题类
    html.classList.remove('starry-theme', 'cloud-theme')
    body.classList.remove('starry-theme', 'cloud-theme')
    
    // 添加当前主题类
    html.classList.add(currentThemeClass)
    body.classList.add(currentThemeClass)
    
    // 设置data属性用于调试
    html.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    html.setAttribute('data-hydrated', 'true')
    
    // 特别处理深色主题的初始化
    if (isDark.value) {
      // 确保深色主题的样式立即生效
      html.classList.add('dark')
      // 强制重新计算样式
      html.style.display = 'none'
      html.offsetHeight // 触发重排
      html.style.display = ''
    }
  }
}

// 在组件挂载时标记为客户端
onMounted(() => {
  isClient.value = true
  
  // 确保在客户端渲染完成后应用主题
  nextTick(() => {
    applyThemeClass()
  })
  
  // 延迟确保DOM完全渲染
  setTimeout(() => {
    applyThemeClass()
  }, 0)
  
  // 再次延迟确保所有组件都已挂载
  setTimeout(() => {
    applyThemeClass()
  }, 100)
  
  // 特别处理深色主题的延迟初始化
  if (isDark.value) {
    setTimeout(() => {
      applyThemeClass()
    }, 200)
  }
})

// 监听主题变化 - 只在客户端执行
watch(isDark, (newValue, oldValue) => {
  if (isClient.value) {
    // 立即应用新主题
    nextTick(() => {
      applyThemeClass()
    })
    
    // 特别处理深色主题切换
    if (newValue && !oldValue) {
      // 从浅色切换到深色
      setTimeout(() => {
        applyThemeClass()
      }, 50)
    } else if (!newValue && oldValue) {
      // 从深色切换到浅色
      setTimeout(() => {
        applyThemeClass()
      }, 50)
    }
  }
}, { immediate: false }) // 不在immediate时执行，避免SSR问题

// 监听VitePress的内置主题切换 - 只在客户端执行
if (typeof document !== 'undefined') {
  watch(() => document.documentElement.classList.contains('dark'), (isDarkMode) => {
    if (isClient.value) {
      nextTick(() => {
        applyThemeClass()
      })
      
      // 特别处理深色主题切换
      if (isDarkMode) {
        setTimeout(() => {
          applyThemeClass()
        }, 50)
      }
    }
  }, { immediate: false })
}
</script>

<style scoped>
/* 星空主题样式 */
.starry-theme {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.starry-theme .VPNav {
  background: rgba(15, 15, 35, 0.6) !important;
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(79, 195, 247, 0.2) !important;
  border-right: 1px solid rgba(79, 195, 247, 0.2) !important;
}

.starry-theme .VPNavBar {
  background: transparent !important;
  border-bottom: none !important;
}

/* 统一导航栏背景色，消除色差 */
.starry-theme .VPNavBar.has-sidebar .content-body {
  background: transparent !important;
  backdrop-filter: none !important;
  border-bottom: none !important;
}

.starry-theme .VPSidebar {
  background: rgba(15, 15, 35, 0.5) !important;
  backdrop-filter: blur(15px);
  border-right: 1px solid rgba(79, 195, 247, 0.2);
}

/* 恢复aside-curtain元素，显示分割线 */
.starry-theme .aside-curtain {
  background: rgba(79, 195, 247, 0.2) !important;
  opacity: 1 !important;
  display: block !important;
}

.starry-theme .VPContent,
.starry-theme .VPDoc,
.starry-theme .VPContentDoc,
.starry-theme .content,
.starry-theme .container,
.starry-theme .vp-doc,
.starry-theme .vp-doc .content,
.starry-theme .vp-doc .content-container,
.starry-theme .vp-doc .content-body {
  background: transparent !important;
}

.starry-theme .vp-doc a {
  color: #81d4fa !important;
  text-shadow: 0 0 3px rgba(129, 212, 250, 0.3);
}

.starry-theme .vp-doc a:hover {
  color: #4fc3f7 !important;
  text-shadow: 0 0 8px rgba(79, 195, 247, 0.5);
}

/* 蓝天白云主题样式 */
.cloud-theme {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.cloud-theme .VPNav {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(15px);
  border-bottom: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.3) !important;
}

.cloud-theme .VPNavBar {
  background: transparent !important;
  border-bottom: none !important;
}

/* 统一导航栏背景色，消除色差 */
.cloud-theme .VPNavBar.has-sidebar .content-body {
  background: transparent !important;
  backdrop-filter: none !important;
  border-bottom: none !important;
}

.cloud-theme .VPSidebar {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(15px);
  border-right: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 2px 0 4px rgba(255, 255, 255, 0.3) !important;
}

/* 隐藏多余的aside-curtain元素 */
.cloud-theme .aside-curtain {
  display: none !important;
}

.cloud-theme .VPContent,
.cloud-theme .VPDoc,
.cloud-theme .VPContentDoc,
.cloud-theme .content,
.cloud-theme .container,
.cloud-theme .vp-doc,
.cloud-theme .vp-doc .content,
.cloud-theme .vp-doc .content-container,
.cloud-theme .vp-doc .content-body {
  background: transparent !important;
}

.cloud-theme .vp-doc a {
  color: #3b82f6 !important;
  text-shadow: 0 0 3px rgba(59, 130, 246, 0.3);
}

.cloud-theme .vp-doc a:hover {
  color: #1d4ed8 !important;
  text-shadow: 0 0 8px rgba(29, 78, 216, 0.5);
}
</style> 