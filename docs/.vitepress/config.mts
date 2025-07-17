import { defineConfig } from 'vitepress'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import getSidebar from "../utils/getSidebar";

// 兼容 ESM 的 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    title: "拜里斯车间管理系统",
    description: "BTC ShopFlow Project Docs",
    themeConfig: {
        logo: '/favicon.ico',
        nav: [
            { text: '首页', link: '/' },
            { text: '指南', link: '/guide/' },
        ],
        sidebar: getSidebar(),
        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
    }
})
