import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import http from 'http'

interface FileItem {
  id: string
  name: string
  path: string
  relativePath: string
  type: 'file' | 'directory'
  extension: string
  lastModified: string
  sourceId: string
}

interface BlinkoNote {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  tags?: string[]
  files?: any[]
}

interface DocSource {
  id: string
  name: string
  path: string
  enabled: boolean
  type: 'local' | 'api'
  apiUrl?: string
}

// 文档源配置
const docSources: DocSource[] = [
  {
    id: 'obsidian',
    name: 'Obsidian 知识库',
    path: 'F:/docs/obsidian/',
    enabled: true,
    type: 'local',
  },
  {
    id: 'blinko',
    name: 'Blinko 闪念笔记',
    path: '',
    enabled: true,
    type: 'api',
    apiUrl: 'http://localhost:1111',
  },
]

// 需要排除的文件夹
const excludePatterns = ['.git', 'node_modules', '.obsidian', '.trash']

// 支持的文件扩展名
const supportedExtensions = ['.md', '.markdown']

function isExcluded(name: string): boolean {
  return excludePatterns.some(pattern => name === pattern || name.startsWith('.'))
}

function isSupported(filename: string): boolean {
  const ext = filename.toLowerCase()
  return supportedExtensions.some(e => ext.endsWith(e))
}

function scanDirectory(sourceId: string, dirPath?: string): FileItem[] {
  const source = docSources.find(s => s.id === sourceId)
  if (!source) return []

  const basePath = dirPath ? path.join(source.path, dirPath) : source.path

  if (!fs.existsSync(basePath)) {
    return []
  }

  const items: FileItem[] = []

  try {
    const entries = fs.readdirSync(basePath, { withFileTypes: true })

    for (const entry of entries) {
      if (isExcluded(entry.name)) continue

      const fullPath = path.join(basePath, entry.name)
      const relativePath = dirPath ? path.join(dirPath, entry.name) : entry.name

      if (entry.isDirectory()) {
        items.push({
          id: `${sourceId}:${relativePath}`,
          name: entry.name,
          path: fullPath,
          relativePath,
          type: 'directory',
          extension: '',
          lastModified: fs.statSync(fullPath).mtime.toISOString(),
          sourceId,
        })
      } else if (entry.isFile() && isSupported(entry.name)) {
        items.push({
          id: `${sourceId}:${relativePath}`,
          name: entry.name,
          path: fullPath,
          relativePath,
          type: 'file',
          extension: path.extname(entry.name),
          lastModified: fs.statSync(fullPath).mtime.toISOString(),
          sourceId,
        })
      }
    }
  } catch (error) {
    console.error('Error scanning directory:', error)
  }

  return items.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

// Scan Blinko notes via MCP server
async function scanBlinkoNotes(): Promise<FileItem[]> {
  // For now, return empty array - Blinko notes will be displayed differently
  // since they require authentication
  return new Promise((resolve) => {
    // Try to fetch notes without auth first
    const postData = JSON.stringify({
      page: 1,
      size: 100,
      orderBy: 'desc',
      type: -1,
      isRecycle: false,
    })

    const options = {
      hostname: 'localhost',
      port: 1111,
      path: '/api/v1/note/list',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          if (result.message === 'Unauthorized' || !Array.isArray(result)) {
            // Return demo/placeholder notes if auth fails
            resolve([{
              id: 'blinko:auth-required',
              name: '需要认证才能查看 Blinko 笔记',
              path: 'auth-required',
              relativePath: 'auth-required',
              type: 'file' as const,
              extension: '.md',
              lastModified: new Date().toISOString(),
              sourceId: 'blinko',
            }])
            return
          }
          const notes = result || []
          const items: FileItem[] = notes.map((note: any) => ({
            id: `blinko:${note.id}`,
            name: note.content.slice(0, 50) + (note.content.length > 50 ? '...' : ''),
            path: String(note.id),
            relativePath: String(note.id),
            type: 'file' as const,
            extension: '.md',
            lastModified: note.updatedAt || note.createdAt,
            sourceId: 'blinko',
          }))
          resolve(items)
        } catch (e) {
          console.error('Error parsing Blinko response:', e)
          resolve([])
        }
      })
    })

    req.on('error', (e) => {
      console.error('Error fetching Blinko notes:', e)
      resolve([{
        id: 'blinko:error',
        name: '无法连接到 Blinko 服务，请确保 Blinko 正在运行',
        path: 'error',
        relativePath: 'error',
        type: 'file' as const,
        extension: '.md',
        lastModified: new Date().toISOString(),
        sourceId: 'blinko',
      }])
    })
    req.write(postData)
    req.end()
  })
}

// Get Blinko note content by ID
async function getBlinkoNoteContent(noteId: string): Promise<string> {
  if (noteId === 'auth-required') {
    return `# Blinko 笔记 - 需要认证

Blinko API 需要身份认证才能访问笔记内容。

## 解决方案

1. 在 Blinko 中获取 API Token
2. 在 Info Hub 中配置 Token
3. 或者通过 MCP 协议访问 Blinko 笔记

## Blinko 服务状态

- 服务地址：http://localhost:1111
- API 文档：http://localhost:1111/api/openapi.json
`
  }
  if (noteId === 'error') {
    return `# Blinko 服务连接失败

无法连接到 Blinko 服务，请确保：

1. Blinko 服务正在运行（端口 1111）
2. 网络连接正常

## 启动 Blinko

\`\`\`bash
cd F:/blinko-src
pnpm dev
\`\`\`
`
  }

  // Fetch note content from Blinko API
  return new Promise((resolve) => {
    const postData = JSON.stringify({ id: parseInt(noteId, 10) })

    const options = {
      hostname: 'localhost',
      port: 1111,
      path: '/api/v1/note/detail',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          if (result.content) {
            resolve(`# Blinko Note\n\n${result.content}`)
          } else {
            resolve(`# Blinko Note ${noteId}\n\n笔记内容为空`)
          }
        } catch (e) {
          console.error('Error parsing Blinko response:', e)
          resolve(`# Blinko Note ${noteId}\n\n解析笔记内容失败`)
        }
      })
    })

    req.on('error', (e) => {
      console.error('Error fetching Blinko note:', e)
      resolve(`# Blinko Note ${noteId}\n\n无法获取笔记内容`)
    })

    req.write(postData)
    req.end()
  })
}

function readFileContent(sourceId: string, filePath: string): string | null {
  const source = docSources.find(s => s.id === sourceId)
  if (!source) return null

  const fullPath = path.join(source.path, filePath)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  try {
    return fs.readFileSync(fullPath, 'utf-8')
  } catch (error) {
    console.error('Error reading file:', error)
    return null
  }
}

function getFileInfo(sourceId: string, filePath: string): FileItem | null {
  const source = docSources.find(s => s.id === sourceId)
  if (!source) return null

  const fullPath = path.join(source.path, filePath)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  try {
    const stats = fs.statSync(fullPath)
    return {
      id: `${sourceId}:${filePath}`,
      name: path.basename(filePath),
      path: fullPath,
      relativePath: filePath,
      type: 'file',
      extension: path.extname(filePath),
      lastModified: stats.mtime.toISOString(),
      sourceId,
    }
  } catch (error) {
    return null
  }
}

export function localDocsPlugin(): Plugin {
  return {
    name: 'vite-plugin-local-docs',
    configureServer(server) {
      server.middlewares.use('/api/scan', async (req, res) => {
        const url = new URL(req.url!, 'http://localhost')
        const sourceId = url.searchParams.get('source') || 'obsidian'
        const dirPath = url.searchParams.get('path') || undefined

        // Handle Blinko API source
        if (sourceId === 'blinko') {
          const items = await scanBlinkoNotes()
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(JSON.stringify(items))
          return
        }

        // Handle local file source
        const items = scanDirectory(sourceId, dirPath)

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end(JSON.stringify(items))
      })

      server.middlewares.use('/api/file', async (req, res) => {
        const url = new URL(req.url!, 'http://localhost')
        const sourceId = url.searchParams.get('source') || 'obsidian'
        const filePath = url.searchParams.get('path') || ''

        // Handle Blinko API source
        if (sourceId === 'blinko') {
          const content = await getBlinkoNoteContent(filePath)
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(content)
          return
        }

        // Handle local file source
        const content = readFileContent(sourceId, filePath)

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader('Access-Control-Allow-Origin', '*')

        if (content === null) {
          res.statusCode = 404
          res.end('File not found')
        } else {
          res.end(content)
        }
      })

      server.middlewares.use('/api/sources', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end(JSON.stringify(docSources))
      })

      server.middlewares.use('/api/file-info', (req, res) => {
        const url = new URL(req.url!, 'http://localhost')
        const sourceId = url.searchParams.get('source') || 'obsidian'
        const filePath = url.searchParams.get('path') || ''

        const info = getFileInfo(sourceId, filePath)

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')

        if (info === null) {
          res.statusCode = 404
          res.end('File not found')
        } else {
          res.end(JSON.stringify(info))
        }
      })
    },
  }
}
