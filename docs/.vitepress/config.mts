import { defineConfig } from 'vitepress'
import getSidebar from "../utils/getSidebar";

// 兼容 ESM 的 __dirname

export default defineConfig({
    title: "拜里斯车间管理系统",
    description: "BTC ShopFlow Project Docs",
    base: '/docs/',
    head: [
        ['link', { rel: 'icon', href: '/docs/favicon.ico' }],
        ['link', { rel: 'apple-touch-icon', href: '/docs/favicon.ico' }],
        ['meta', { name: 'theme-color', content: '#3c8772' }]
    ],
    themeConfig: {
        logo: '/favicon.ico',
        nav: [
            { text: '首页', link: '/' },
            { text: '指南', link: '/guide' },
        ],
        sidebar: getSidebar(),
        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
    }
})
