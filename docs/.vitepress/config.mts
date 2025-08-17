import { defineConfig } from 'vitepress'
import getSidebar from "../utils/getSidebar";

// 动态计算 base，便于在本地预览/反向代理/部署路径不同的情况下正确解析静态资源
const normalizeBase = (value: string | undefined): string => {
    const raw = (value ?? '/').trim()
    if (!raw) return '/'
    let v = raw
    if (!v.startsWith('/')) v = '/' + v
    if (!v.endsWith('/')) v = v + '/'
    return v
}
const BASE = normalizeBase(process.env.VITEPRESS_BASE || process.env.BASE || '/')

// 兼容 ESM 的 __dirname

export default defineConfig({
    title: "星际文档系统",
    description: "星际文档系统 - 现代化文档管理平台",
    base: BASE,
    lang: 'zh-CN',
    // 添加head配置，直接引入CSS文件
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['link', { rel: 'apple-touch-icon', href: '/favicon.ico' }]
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
                    svg: '<img src="/cloud.png" alt="Cloud Icon">'
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
                            svg: '<img src="/cloud.png" alt="Cloud Icon">'
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
