<template>
  <div :class="themeClass" :data-theme="currentTheme" :data-hydrated="isClient">
    <!-- 星空背景 - 仅在暗色主题时显示 -->
    <StarryBackground v-if="isClient && isDark" />
    
    <!-- 蓝天白云背景 - 仅在亮色主题时显示 -->
    <CloudBackground v-if="isClient && !isDark" />
    
    <!-- 使用VitePress默认主题的Layout -->
    <DefaultTheme.Layout />
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { computed, ref, onMounted, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import StarryBackground from './components/StarryBackground.vue'
import CloudBackground from './components/CloudBackground.vue'

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

// 在组件挂载时标记为客户端
onMounted(() => {
  isClient.value = true
  
  // 特别处理深色主题的初始化
  if (isDark.value) {
    // 确保深色主题的样式立即生效
    nextTick(() => {
      const html = document.documentElement
      html.classList.add('dark')
      html.setAttribute('data-hydrated', 'true')
    })
  }
})
</script>

<style>
/* 星空主题样式 */
.starry-theme {
  min-height: 100vh;
  position: relative;
  /* 移除 overflow-x: hidden，避免滚动问题 */
  /* overflow-x: hidden; */
}

.starry-theme .VPNav {
  background: rgba(15, 15, 35, 0.6) !important;
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(79, 195, 247, 0.2) !important;
}

.starry-theme .VPNavBar {
  background: transparent !important;
  border-bottom: none !important;
}

.starry-theme .VPNavBar.has-sidebar .content-body {
  background: transparent !important;
  backdrop-filter: none !important;
  border-bottom: none !important;
}

/* 星空主题导航栏菜单链接样式 */
.starry-theme .VPNavBarMenuLink {
  color: #ffffff !important;
  transition: all 0.3s ease;
  opacity: 0.9;
  border: none !important;
  background: transparent !important;
  outline: none !important;
  box-shadow: none !important;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
}

.starry-theme .VPNavBarMenuLink:hover {
  color: #81d4fa !important;
  text-shadow: 0 0 8px rgba(129, 212, 250, 0.6);
  background: transparent !important;
  opacity: 1;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.starry-theme .VPNavBarMenuLink.active {
  color: #81d4fa !important;
  text-shadow: 0 0 8px rgba(129, 212, 250, 0.6);
  opacity: 1;
  border: none !important;
  background: transparent !important;
  outline: none !important;
  box-shadow: none !important;
}

.starry-theme .VPSidebar {
  background: rgba(15, 15, 35, 0.5) !important;
  backdrop-filter: blur(15px);
  border-right: 1px solid rgba(79, 195, 247, 0.2);
}

.starry-theme .aside-curtain {
  display: none !important;
}

/* 为curtain元素添加分隔线样式，参考侧边栏的分隔线 */
.starry-theme .curtain {
  border-right: 1px solid rgba(79, 195, 247, 0.2) !important;
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

.starry-theme .vp-doc h1,
.starry-theme .vp-doc h2,
.starry-theme .vp-doc h3,
.starry-theme .vp-doc h4,
.starry-theme .vp-doc h5,
.starry-theme .vp-doc h6 {
  color: #4fc3f7 !important;
  text-shadow: 0 0 5px rgba(79, 195, 247, 0.3);
}

.starry-theme .vp-doc h1 {
  color: #4fc3f7 !important;
  text-shadow: 0 0 5px rgba(79, 195, 247, 0.3);
  border-bottom: 1px solid rgba(79, 195, 247, 0.4) !important;
  padding-bottom: 0.5rem !important;
  margin-bottom: 1rem !important;
  margin-top: 1rem !important;
}

.starry-theme .vp-doc h2 {
  color: #4fc3f7 !important;
  text-shadow: 0 0 5px rgba(79, 195, 247, 0.3);
  margin-bottom: 1rem !important;
  border-top: none !important;
  padding-top: 0 !important;
  margin-top: 0 !important;
  border-bottom: 1px solid rgba(79, 195, 247, 0.4) !important;
  padding-bottom: 0.5rem !important;
}

.starry-theme .vp-doc hr {
  border: none !important;
  height: 1px !important;
  background: linear-gradient(90deg, transparent, rgba(79, 195, 247, 0.6), transparent) !important;
  margin: 2rem 0 !important;
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
  border-bottom: 2px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.3) !important;
}

.cloud-theme .VPNavBar {
  background: transparent !important;
  border-bottom: none !important;
}

.cloud-theme .VPNavBar.has-sidebar .content-body {
  background: transparent !important;
  backdrop-filter: none !important;
  border-bottom: none !important;
}

/* 蓝天白云主题导航栏菜单链接样式 */
.cloud-theme .VPNavBarMenuLink {
  color: #35a3f7 !important;
  transition: all 0.3s ease;
  border: none !important;
  background: transparent !important;
  outline: none !important;
  box-shadow: none !important;
  text-shadow: 0 0 3px rgba(53, 163, 247, 0.3);
}

.cloud-theme .VPNavBarMenuLink:hover {
  color: #1976d2 !important;
  text-shadow: 0 0 8px rgba(25, 118, 210, 0.5);
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.cloud-theme .VPNavBarMenuLink.active {
  color: #1976d2 !important;
  text-shadow: 0 0 8px rgba(25, 118, 210, 0.5);
  border: none !important;
  background: transparent !important;
  outline: none !important;
  box-shadow: none !important;
}

.cloud-theme .VPSidebar {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(15px);
  border-right: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 2px 0 4px rgba(255, 255, 255, 0.3) !important;
}

.cloud-theme .aside-curtain {
  display: none !important;
}

/* 为curtain元素添加分隔线样式，参考侧边栏的分隔线 */
.cloud-theme .curtain {
  border-right: 2px solid rgba(255, 255, 255, 0.8) !important;
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

.cloud-theme .vp-doc h1,
.cloud-theme .vp-doc h2,
.cloud-theme .vp-doc h3,
.cloud-theme .vp-doc h4,
.cloud-theme .vp-doc h5,
.cloud-theme .vp-doc h6 {
  color: #35a3f7 !important;
  text-shadow: 
    -1px -1px 0 rgba(255, 255, 255, 0.8),
    1px -1px 0 rgba(255, 255, 255, 0.8),
    -1px 1px 0 rgba(255, 255, 255, 0.8),
    1px 1px 0 rgba(255, 255, 255, 0.8),
    0 0 5px rgba(53, 163, 247, 0.3);
}

.cloud-theme .vp-doc h1 {
  color: #35a3f7 !important;
  text-shadow: 
    -1px -1px 0 rgba(255, 255, 255, 0.9),
    1px -1px 0 rgba(255, 255, 255, 0.9),
    -1px 1px 0 rgba(255, 255, 255, 0.9),
    1px 1px 0 rgba(255, 255, 255, 0.9),
    0 0 5px rgba(53, 163, 247, 0.3);
  border-bottom: 1px solid rgba(53, 163, 247, 0.4) !important;
  padding-bottom: 0.5rem !important;
  margin-bottom: 1rem !important;
  margin-top: 1rem !important;
}

.cloud-theme .vp-doc h2 {
  color: #35a3f7 !important;
  text-shadow: 
    -1px -1px 0 rgba(255, 255, 255, 0.9),
    1px -1px 0 rgba(255, 255, 255, 0.9),
    -1px 1px 0 rgba(255, 255, 255, 0.9),
    1px 1px 0 rgba(255, 255, 255, 0.9),
    0 0 5px rgba(53, 163, 247, 0.3);
  margin-bottom: 1rem !important;
  border-top: none !important;
  padding-top: 0 !important;
  margin-top: 0 !important;
  border-bottom: 1px solid rgba(53, 163, 247, 0.4) !important;
  padding-bottom: 0.5rem !important;
}

.cloud-theme .vp-doc hr {
  border: none !important;
  height: 2px !important;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 1), transparent) !important;
  margin: 2rem 0 !important;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5) !important;
}
</style> 