// utils/getSidebar.ts
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const contentDir = path.resolve(__dirname, '../content')

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

    // 按 category 分组
    const grouped = files.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = []
        acc[item.category].push(item)
        return acc
    }, {} as Record<string, typeof files>)

    // 排序：有 order 按 order 升序；没有则按 createdAt 倒序（最近在前）
    return Object.entries(grouped).map(([category, items]) => ({
        text: category,
        items: items
            .sort((a, b) =>
                a.order !== null && b.order !== null
                    ? a.order - b.order
                    : b.createdAt - a.createdAt
            )
            .map(({ title, link }) => ({ text: title, link }))
    }))
}

export default getSidebar