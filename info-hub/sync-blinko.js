/**
 * Blinko 笔记同步服务
 *
 * 功能：
 * 1. 从 Blinko API 获取笔记列表
 * 2. 将笔记转换为 Markdown 格式
 * 3. 同步到 info-hub 的 blinko-notes 目录
 *
 * 使用方式：
 * - 手动：node sync-blinko.js
 * - 定时：配置 Windows 任务计划程序
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const BLINKO_API_URL = process.env.BLINKO_API_URL || 'http://localhost:1111/api'
const SYNC_DIR = path.join(__dirname, 'blinko-notes')
const BLINKO_TOKEN = process.env.BLINKO_TOKEN || ''

// 确保同步目录存在
if (!fs.existsSync(SYNC_DIR)) {
  fs.mkdirSync(SYNC_DIR, { recursive: true })
  console.log(`[info] 创建同步目录：${SYNC_DIR}`)
}

/**
 * 从 Blinko API 获取笔记
 */
async function fetchNotes() {
  try {
    const response = await fetch(`${BLINKO_API_URL}/notes`, {
      headers: {
        'Authorization': BLINKO_TOKEN ? `Bearer ${BLINKO_TOKEN}` : '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Blinko API 返回 ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`[info] 获取到 ${data.length || 0} 条笔记`)
    return data || []
  } catch (error) {
    console.error('[error] 获取笔记失败:', error.message)
    return []
  }
}

/**
 * 将 Blinko 笔记转换为 Markdown 格式
 */
function noteToMarkdown(note) {
  let md = `---\n`
  md += `title: "${note.title || '无标题'}"\n`
  md += `created: ${note.createdAt || new Date().toISOString()}\n`
  md += `updated: ${note.updatedAt || new Date().toISOString()}\n`
  md += `tags: [${note.tags?.map(t => t.name || t).join(', ') || ''}]\n`
  md += `source: Blinko\n`
  md += `url: ${note.url || ''}\n`
  md += `---\n\n`

  md += `# ${note.title || '无标题'}\n\n`
  md += `${note.content || ''}\n`

  // 添加附件链接
  if (note.attachments && note.attachments.length > 0) {
    md += `\n## 附件\n\n`
    for (const attachment of note.attachments) {
      md += `- [${attachment.name}](${attachment.url})\n`
    }
  }

  // 添加评论
  if (note.comments && note.comments.length > 0) {
    md += `\n## 评论\n\n`
    for (const comment of note.comments) {
      md += `- **${comment.author}**: ${comment.content}\n`
    }
  }

  return md
}

/**
 * 同步笔记到本地目录
 */
async function syncNotes() {
  console.log('[info] 开始同步 Blinko 笔记...')

  const notes = await fetchNotes()
  if (notes.length === 0) {
    console.log('[info] 没有需要同步的笔记')
    return
  }

  let syncedCount = 0
  for (const note of notes) {
    try {
      // 生成安全的文件名
      const filename = `${note.id || Date.now()}-${(note.title || 'untitled').replace(/[/\\:*?"<>|]/g, '_')}.md`
      const filePath = path.join(SYNC_DIR, filename)

      // 检查是否需要更新
      if (fs.existsSync(filePath)) {
        const existingContent = fs.readFileSync(filePath, 'utf-8')
        const newContent = noteToMarkdown(note)
        if (existingContent === newContent) {
          continue // 内容未变化，跳过
        }
      }

      // 写入文件
      const content = noteToMarkdown(note)
      fs.writeFileSync(filePath, content, 'utf-8')
      console.log(`[sync] ${note.title || '无标题'}`)
      syncedCount++
    } catch (error) {
      console.error(`[error] 同步笔记 "${note.title}" 失败:`, error.message)
    }
  }

  console.log(`[info] 同步完成：${syncedCount} 条笔记`)
}

// 导出函数以便测试
export { fetchNotes, noteToMarkdown, syncNotes }

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === __filename

async function main() {
  try {
    await syncNotes()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[fatal] 同步失败:', message)
    if (!fs.existsSync(SYNC_DIR)) {
      fs.mkdirSync(SYNC_DIR, { recursive: true })
      console.log('[info] 已创建空白的 blinko-notes 目录')
    }
    process.exit(0)
  }
}

if (isDirectExecution) {
  void main()
}
