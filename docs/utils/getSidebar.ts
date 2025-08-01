// utils/getSidebar.ts
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const contentDir = path.resolve(__dirname, '../content')
const categoryOrderFile = path.resolve(__dirname, '../content/_category-order.md')

// 读取分类排序配置
function getCategoryOrder(): Record<string, number> {
    if (!fs.existsSync(categoryOrderFile)) {
        return {}
    }
    
    try {
        const content = fs.readFileSync(categoryOrderFile, 'utf-8')
        const { data } = matter(content)
        return data.categoryOrder || {}
    } catch (error) {
        console.warn('读取分类排序配置失败:', error)
        return {}
    }
}

// 仅在配置文件不存在时生成分类排序配置文件
function generateCategoryOrderFile(categories: string[]) {
    if (fs.existsSync(categoryOrderFile)) {
        return
    }
    // 过滤掉 _config 分类
    const validCategories = categories.filter(cat => cat !== '_config')
    // 默认顺序
    let maxOrder = 0
    const categoryOrder: Record<string, number> = {}
    validCategories.forEach(category => {
        maxOrder++
        categoryOrder[category] = maxOrder
    })
    // 生成配置文件内容
    const configContent = `---
title: 分类排序配置
category: _config
order: 1
categoryOrder:
${Object.entries(categoryOrder)
    .sort(([,a], [,b]) => a - b)
    .map(([category, order]) => `  ${category}: ${order}`)
    .join('\n')}
---

# 分类排序配置

此文件由系统自动生成，用于控制文档分类的显示顺序。

## 当前分类排序

${Object.entries(categoryOrder)
    .sort(([,a], [,b]) => a - b)
    .map(([category, order]) => `- **${category}**: ${order}`)
    .join('\n')}

## 修改排序

直接修改上方的 \`categoryOrder\` 配置即可调整分类显示顺序。

数字越小排序越靠前。
`
    fs.writeFileSync(categoryOrderFile, configContent)
}

function getSidebar() {
    if (!fs.existsSync(contentDir)) {
        return []
    }

    const files = fs.readdirSync(contentDir)
        .filter(f => f.endsWith('.md'))
        .map(file => {
            const filePath = path.join(contentDir, file)
            const content = fs.readFileSync(filePath, 'utf-8')
            const { data } = matter(content)
            // 读取文件创建时间（若平台不精确可用 mtime）
            const stat = fs.statSync(filePath)
            const createdAt = stat.birthtimeMs || stat.mtimeMs
            return {
                title: data.title || file.replace('.md', ''),
                category: data.category || '未分类',
                order: data.order ?? null,      // null 表示没有指定
                createdAt,
                link: `/content/${file.replace('.md', '')}`
            }
        })

    // 获取所有分类，排除 _config
    const categories = [...new Set(files.map(f => f.category).filter(cat => cat !== '_config'))]
    // 仅在配置文件不存在时生成
    generateCategoryOrderFile(categories)
    // 读取分类排序配置
    const categoryOrder = getCategoryOrder()
    // 按 category 分组，排除 _config 分类
    const grouped = files
        .filter(item => item.category !== '_config')
        .reduce((acc, item) => {
            if (!acc[item.category]) acc[item.category] = []
            acc[item.category].push(item)
            return acc
        }, {} as Record<string, typeof files>)
    // 生成 sidebar 数组，包含分类排序
    const sidebarItems = Object.entries(grouped).map(([category, items]) => {
        return {
            text: category,
            categoryOrder: categoryOrder[category] || 999,
            collapsed: false, // 默认展开
            items: items
                .sort((a, b) =>
                    a.order !== null && b.order !== null
                        ? a.order - b.order
                        : b.createdAt - a.createdAt
                )
                .map(({ title, link }) => ({ text: title, link }))
        }
    })
    // 按分类排序值排序
    return sidebarItems.sort((a, b) => a.categoryOrder - b.categoryOrder)
}

export default getSidebar