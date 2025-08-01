import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'

// 引入主CSS文件，包含所有主题样式
import './styles/index.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // 可以在这里注册全局组件
  },
  // 客户端主题初始化
  setup() {
    // 在客户端执行主题初始化
    if (typeof document !== 'undefined') {
      import('./client').then(({ setupTheme }) => {
        const cleanup = setupTheme()
        
        // 在页面卸载时清理
        if (typeof window !== 'undefined') {
          window.addEventListener('beforeunload', cleanup)
        }
      })
    }
  }
} satisfies Theme 