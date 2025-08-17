import { defineConfig } from 'vitepress'
import getSidebar from "../utils/getSidebar";

// 兼容 ESM 的 __dirname

export default defineConfig({
    title: "星际文档系统",
    description: "星际文档系统 - 现代化文档管理平台",
    base: '/docs/',
    lang: 'zh-CN',
    // 添加head配置，直接引入CSS文件
    head: [
        ['link', { rel: 'icon', href: '/docs/favicon.ico' }],
        ['link', { rel: 'apple-touch-icon', href: '/docs/favicon.ico' }]
    ],
    // 添加appearance配置，确保主题切换正确处理
    appearance: true,
    // 添加主题配置
    themeConfig: {
        logo: '/favicon.ico',
        nav: [
            { text: '首页', link: '/' },
        ],
        sidebar: getSidebar(),
        socialLinks: [
            {
                icon: {
                    svg: '<img src="/docs/cloud.png" alt="Cloud Icon">'
                },
                link: 'https://redamancy.com.cn'
            },
            { icon: 'github', link: 'https://github.com/MoseLu/axi-docs' },
        ],
        docFooter: {
            prev: '上一页',
            next: '下一页'
        },
        returnToTopLabel: '返回顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        outlineTitle: '页面导航',
        // 本地搜索配置
        search: {
            provider: 'local',
            options: {
                locales: {
                    root: {
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档'
                            }
                        }
                    }
                }
            }
        }
    },
    locales: {
        root: {
            label: '中文',
            lang: 'zh-CN',
            themeConfig: {
                nav: [
                    { text: '首页', link: '/' },
                ],
                sidebar: getSidebar(),
                socialLinks: [
                    {
                        icon: {
                            svg: '<img src="/docs/cloud.png" alt="Cloud Icon">'
                        },
                        link: 'https://redamancy.com.cn'
                    },
                    { icon: 'github', link: 'https://github.com/MoseLu/axi-docs' },
                ],
                docFooter: {
                    prev: '上一页',
                    next: '下一页'
                },
                returnToTopLabel: '返回顶部',
                sidebarMenuLabel: '菜单',
                darkModeSwitchLabel: '主题',
                lightModeSwitchTitle: '切换到浅色模式',
                darkModeSwitchTitle: '切换到深色模式',
                outlineTitle: '页面导航',
                // 本地搜索配置
                search: {
                    provider: 'local',
                    options: {
                        locales: {
                            root: {
                                translations: {
                                    button: {
                                        buttonText: '搜索文档',
                                        buttonAriaLabel: '搜索文档'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})
