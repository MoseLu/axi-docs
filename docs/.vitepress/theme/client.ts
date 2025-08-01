// 客户端主题初始化脚本
export function initTheme() {
  if (typeof document === 'undefined') return

  // 获取当前主题状态
  const isDark = document.documentElement.classList.contains('dark')
  const currentTheme = isDark ? 'starry-theme' : 'cloud-theme'

  // 移除所有可能的主题类
  document.documentElement.classList.remove('starry-theme', 'cloud-theme')
  document.body.classList.remove('starry-theme', 'cloud-theme')

  // 添加当前主题类
  document.documentElement.classList.add(currentTheme)
  document.body.classList.add(currentTheme)

  // 设置data属性用于调试
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  document.documentElement.setAttribute('data-hydrated', 'true')

  // 特别处理深色主题
  if (isDark) {
    // 确保深色主题的样式立即生效
    document.documentElement.classList.add('dark')
    
    // 强制重新计算样式
    const html = document.documentElement
    html.style.display = 'none'
    html.offsetHeight // 触发重排
    html.style.display = ''
    
    // 确保深色主题的透明度正确
    const starryTheme = document.querySelector('.starry-theme')
    if (starryTheme) {
      (starryTheme as HTMLElement).style.opacity = '1'
    }
  }
}

// 监听主题变化
export function watchThemeChange() {
  if (typeof document === 'undefined') return

  // 创建MutationObserver来监听class变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target as HTMLElement
        if (target === document.documentElement) {
          // 延迟执行以确保DOM更新完成
          setTimeout(() => {
            initTheme()
          }, 0)
          
          // 特别处理深色主题切换
          if (target.classList.contains('dark')) {
            setTimeout(() => {
              initTheme()
            }, 50)
          }
        }
      }
    })
  })

  // 开始监听
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  return observer
}

// 初始化主题系统
export function setupTheme() {
  // 立即初始化
  initTheme()

  // 监听变化
  const observer = watchThemeChange()

  // 特别处理深色主题的延迟初始化
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    setTimeout(() => {
      initTheme()
    }, 100)
    
    setTimeout(() => {
      initTheme()
    }, 200)
  }

  // 返回清理函数
  return () => {
    if (observer) {
      observer.disconnect()
    }
  }
} 