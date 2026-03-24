import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import http from 'http'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileItem {
  id: string
  name: string
  path: string
  relativePath: string
  type: 'file' | 'directory'
  extension: string
  lastModified: string
  sourceId: string
  tags?: string[]
}

interface DocSource {
  id: string
  name: string
  description?: string
  path: string
  enabled: boolean
  type: 'local' | 'api'
  apiUrl?: string
  apiToken?: string
  icon?: 'obsidian' | 'blinko' | 'folder'
}

interface BlinkoNote {
  id: number
  content: string
  type: 0 | 1
  tags?: string[]
  files?: unknown[]
  createdAt: string
  updatedAt: string
}

interface SearchResult {
  sourceId: string
  path: string
  name: string
  type: 'file' | 'blinko'
  snippet: string
  matches: Array<{ line: number; text: string; highlight: [number, number][] }>
  score: number
  tags?: string[]
}

// ─── Document Source Configuration ───────────────────────────────────────────
// Configure these to match your actual paths.

const docSources: DocSource[] = [
  {
    id: 'obsidian',
    name: 'Obsidian 知识库',
    description: '本地 Obsidian Vault',
    path: process.env.OBSIDIAN_PATH || 'F:/docs/obsidian/',
    enabled: true,
    type: 'local',
    icon: 'obsidian',
  },
  {
    id: 'blinko',
    name: 'Blinko 闪念',
    description: '闪念笔记 & 灵感捕捉',
    path: '',
    enabled: true,
    type: 'api',
    apiUrl: process.env.BLINKO_URL || 'http://localhost:1111',
    apiToken: process.env.BLINKO_TOKEN || '',
    icon: 'blinko',
  },
]

// ─── Filters ──────────────────────────────────────────────────────────────────

const excludePatterns = ['.git', 'node_modules', '.obsidian', '.trash', '.DS_Store']
const supportedExtensions = ['.md', '.markdown']

function isExcluded(name: string): boolean {
  return excludePatterns.some(p => name === p || name.startsWith('.'))
}

function isSupported(filename: string): boolean {
  const lower = filename.toLowerCase()
  return supportedExtensions.some(e => lower.endsWith(e))
}

// ─── Frontmatter / Tags ───────────────────────────────────────────────────────

function parseFrontmatterTags(content: string): string[] {
  if (!content.startsWith('---')) return []
  const end = content.indexOf('\n---', 3)
  if (end === -1) return []
  const yaml = content.slice(4, end)
  const tags: string[] = []

  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    if (key !== 'tags') continue
    const raw = line.slice(colonIdx + 1).trim()

    if (raw.startsWith('[') && raw.endsWith(']')) {
      // Inline array: tags: [a, b, c]
      tags.push(...raw.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean))
    } else if (raw) {
      // Single tag: tags: foo
      tags.push(raw.replace(/^["']|["']$/g, ''))
    }
  }

  // Also parse YAML list format:
  // tags:
  //   - foo
  //   - bar
  let inTagsSection = false
  for (const line of yaml.split('\n')) {
    if (/^tags\s*:/.test(line)) {
      inTagsSection = true
      continue
    }
    if (inTagsSection) {
      const listMatch = line.match(/^\s+-\s+(.+)/)
      if (listMatch) {
        tags.push(listMatch[1].trim().replace(/^["']|["']$/g, ''))
      } else if (line.match(/^\S/)) {
        // New key, end of tags section
        inTagsSection = false
      }
    }
  }

  return [...new Set(tags)]
}

// Also parse inline #tags from content body
function parseInlineTags(content: string): string[] {
  // Strip frontmatter
  let body = content
  if (content.startsWith('---')) {
    const end = content.indexOf('\n---', 3)
    if (end !== -1) body = content.slice(end + 4)
  }
  const matches = body.match(/#([\w\u4e00-\u9fa5/]+)/g) || []
  return [...new Set(matches.map(t => t.slice(1)))]
}

function extractTags(content: string): string[] {
  const fm = parseFrontmatterTags(content)
  const inline = parseInlineTags(content)
  return [...new Set([...fm, ...inline])]
}

// ─── File System Operations ───────────────────────────────────────────────────

function scanDirectory(sourceId: string, dirPath?: string, filterTag?: string): FileItem[] {
  const source = docSources.find(s => s.id === sourceId && s.type === 'local')
  if (!source) return []

  const basePath = dirPath ? path.join(source.path, dirPath) : source.path
  if (!fs.existsSync(basePath)) return []

  const items: FileItem[] = []

  try {
    const entries = fs.readdirSync(basePath, { withFileTypes: true })

    for (const entry of entries) {
      if (isExcluded(entry.name)) continue

      const fullPath = path.join(basePath, entry.name)
      const relativePath = dirPath ? path.join(dirPath, entry.name).replace(/\\/g, '/') : entry.name

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
        let tags: string[] = []
        if (filterTag !== undefined) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8')
            tags = extractTags(content)
            if (filterTag && !tags.includes(filterTag)) continue
          } catch { /* skip */ }
        }
        items.push({
          id: `${sourceId}:${relativePath}`,
          name: entry.name,
          path: fullPath,
          relativePath,
          type: 'file',
          extension: path.extname(entry.name),
          lastModified: fs.statSync(fullPath).mtime.toISOString(),
          sourceId,
          tags: tags.length ? tags : undefined,
        })
      }
    }
  } catch (error) {
    console.error('Error scanning directory:', error)
  }

  return items.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name, 'zh')
  })
}

function readFileContent(sourceId: string, filePath: string): string | null {
  const source = docSources.find(s => s.id === sourceId && s.type === 'local')
  if (!source) return null
  const fullPath = path.join(source.path, filePath)
  if (!fs.existsSync(fullPath)) return null
  try {
    return fs.readFileSync(fullPath, 'utf-8')
  } catch {
    return null
  }
}

// Full-text search across all markdown files in a source
function searchInSource(sourceId: string, query: string, filterTag?: string): SearchResult[] {
  const source = docSources.find(s => s.id === sourceId && s.type === 'local')
  if (!source) return []

  const results: SearchResult[] = []
  const lowerQuery = query.toLowerCase()

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return
    let entries: fs.Dirent[]
    try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }

    for (const entry of entries) {
      if (isExcluded(entry.name)) continue
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.isFile() && isSupported(entry.name)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8')
          const tags = extractTags(content)
          if (filterTag && !tags.includes(filterTag)) continue

          const relativePath = path.relative(source.path, fullPath).replace(/\\/g, '/')
          const lowerContent = content.toLowerCase()
          const lowerName = entry.name.toLowerCase()

          if (!lowerContent.includes(lowerQuery) && !lowerName.includes(lowerQuery)) continue

          // Find snippet around first match
          const matchIdx = lowerContent.indexOf(lowerQuery)
          let snippet = ''
          if (matchIdx !== -1) {
            const start = Math.max(0, matchIdx - 80)
            const end = Math.min(content.length, matchIdx + query.length + 120)
            snippet = (start > 0 ? '…' : '') + content.slice(start, end).replace(/\n+/g, ' ') + (end < content.length ? '…' : '')
          }

          // Score: name match scores higher
          const nameScore = lowerName.includes(lowerQuery) ? 10 : 0
          const contentScore = (lowerContent.split(lowerQuery).length - 1)

          results.push({
            sourceId,
            path: relativePath,
            name: entry.name,
            type: 'file',
            snippet,
            matches: [],
            score: nameScore + contentScore,
            tags: tags.length ? tags : undefined,
          })
        } catch { /* skip */ }
      }
    }
  }

  walk(source.path)
  return results.sort((a, b) => b.score - a.score).slice(0, 30)
}

// ─── Blinko API ───────────────────────────────────────────────────────────────

function blinkoRequest<T>(
  source: DocSource,
  urlPath: string,
  method: string,
  body?: unknown
): Promise<T> {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : undefined
    const url = new URL(urlPath, source.apiUrl)
    const options: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(source.apiToken ? { Authorization: `Bearer ${source.apiToken}` } : {}),
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
      },
    }

    const req = http.request(options, res => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error('Invalid JSON: ' + data.slice(0, 100))) }
      })
    })
    req.on('error', reject)
    if (postData) req.write(postData)
    req.end()
  })
}

async function scanBlinkoNotes(source: DocSource): Promise<FileItem[]> {
  try {
    const result = await blinkoRequest<BlinkoNote[] | { message: string }>(
      source,
      '/api/v1/note/list',
      'POST',
      { page: 1, size: 200, orderBy: 'desc', type: -1, isRecycle: false }
    )

    if (!Array.isArray(result)) {
      // Auth required
      return [{
        id: 'blinko:auth-required',
        name: '需要配置 Blinko API Token',
        path: 'auth-required',
        relativePath: 'auth-required',
        type: 'file',
        extension: '.md',
        lastModified: new Date().toISOString(),
        sourceId: 'blinko',
      }]
    }

    return result.map((note: BlinkoNote) => ({
      id: `blinko:${note.id}`,
      name: note.content.split('\n')[0].slice(0, 60) || `Blinko #${note.id}`,
      path: String(note.id),
      relativePath: String(note.id),
      type: 'file' as const,
      extension: '.md',
      lastModified: note.updatedAt || note.createdAt,
      sourceId: 'blinko',
      tags: note.tags,
      // Attach full note data so BlinkoView can use it without extra fetch
      blinkoData: note,
    } as FileItem & { blinkoData: BlinkoNote }))
  } catch (e) {
    console.error('Error fetching Blinko notes:', e)
    return [{
      id: 'blinko:error',
      name: '无法连接到 Blinko 服务',
      path: 'error',
      relativePath: 'error',
      type: 'file',
      extension: '.md',
      lastModified: new Date().toISOString(),
      sourceId: 'blinko',
    }]
  }
}

async function getBlinkoNoteContent(source: DocSource, noteId: string): Promise<string> {
  if (noteId === 'auth-required') {
    return `# Blinko — 需要 API Token

Blinko 是 Info Hub 的**伴生项目**，提供闪念笔记功能。

## 配置 API Token

在 \`.env\` 文件或环境变量中设置：
\`\`\`
BLINKO_TOKEN=your-token-here
BLINKO_URL=http://localhost:1111
\`\`\`

也可以在 Blinko 设置页面生成 Token。

## Blinko 服务

- 地址：${source.apiUrl}
- API 文档：${source.apiUrl}/api/openapi.json
`
  }

  if (noteId === 'error') {
    return `# 无法连接到 Blinko

确保 Blinko 服务正在运行：

\`\`\`bash
# Docker 方式
docker run -d -p 1111:1111 blinkohq/blinko

# 或开发模式
cd blinko && pnpm dev
\`\`\`

服务地址：${source.apiUrl}
`
  }

  try {
    const result = await blinkoRequest<{ content?: string; type?: number; tags?: string[] }>(
      source,
      '/api/v1/note/detail',
      'POST',
      { id: parseInt(noteId, 10) }
    )
    if (result.content) {
      return result.content
    }
    return `# Blinko Note ${noteId}\n\n笔记内容为空`
  } catch {
    return `# Blinko Note ${noteId}\n\n无法获取笔记内容`
  }
}

// ─── Tag Aggregation ──────────────────────────────────────────────────────────

function getAllTags(sourceId: string): { name: string; count: number }[] {
  const source = docSources.find(s => s.id === sourceId && s.type === 'local')
  if (!source) return []

  const tagCounts: Record<string, number> = {}

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return
    let entries: fs.Dirent[]
    try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const entry of entries) {
      if (isExcluded(entry.name)) continue
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.isFile() && isSupported(entry.name)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8')
          const tags = extractTags(content)
          for (const tag of tags) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
          }
        } catch { /* skip */ }
      }
    }
  }

  walk(source.path)

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// ─── Vite Plugin ─────────────────────────────────────────────────────────────

export function localDocsPlugin(): Plugin {
  return {
    name: 'vite-plugin-local-docs',
    configureServer(server) {

      // GET /api/sources — list all enabled sources
      server.middlewares.use('/api/sources', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end(JSON.stringify(docSources.filter(s => s.enabled).map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          type: s.type,
          enabled: s.enabled,
          icon: s.icon,
        }))))
      })

      // GET /api/scan?source=&path=&tag= — list directory / blinko notes
      server.middlewares.use('/api/scan', async (req, res) => {
        const url = new URL(req.url!, 'http://localhost')
        const sourceId = url.searchParams.get('source') || 'obsidian'
        const dirPath = url.searchParams.get('path') || undefined
        const filterTag = url.searchParams.get('tag') || undefined

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')

        if (sourceId === 'blinko') {
          const source = docSources.find(s => s.id === 'blinko')!
          const items = await scanBlinkoNotes(source)
          res.end(JSON.stringify(items))
          return
        }

        const items = scanDirectory(sourceId, dirPath, filterTag)
        res.end(JSON.stringify(items))
      })

      // GET /api/file?source=&path= — read file content
      server.middlewares.use('/api/file', async (req, res) => {
        const url = new URL(req.url!, 'http://localhost')
        const sourceId = url.searchParams.get('source') || 'obsidian'
        const filePath = url.searchParams.get('path') || ''

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.setHeader('Access-Control-Allow-Origin', '*')

        if (sourceId === 'blinko') {
          const source = docSources.find(s => s.id === 'blinko')!
          const content = await getBlinkoNoteContent(source, filePath)
          res.end(content)
          return
        }

        const content = readFileContent(sourceId, filePath)
        if (content === null) {
          res.statusCode = 404
          res.end('File not found')
        } else {
          res.end(content)
        }
      })

      // GET /api/tags?source= — get all tags with counts
      server.middlewares.use('/api/tags', (req, res) => {
        const url = new URL(req.url!, 'http://localhost')
        const sourceId = url.searchParams.get('source') || 'obsidian'

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end(JSON.stringify(getAllTags(sourceId)))
      })

      // GET /api/search?q=&source=&tag= — full-text search
      server.middlewares.use('/api/search', (req, res) => {
        const url = new URL(req.url!, 'http://localhost')
        const query = url.searchParams.get('q') || ''
        const sourceId = url.searchParams.get('source') || 'obsidian'
        const filterTag = url.searchParams.get('tag') || undefined

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')

        if (!query.trim()) {
          res.end(JSON.stringify([]))
          return
        }

        const results = searchInSource(sourceId, query, filterTag)
        res.end(JSON.stringify(results))
      })

      // GET /api/file-info?source=&path= — file metadata
      server.middlewares.use('/api/file-info', (req, res) => {
        const url = new URL(req.url!, 'http://localhost')
        const sourceId = url.searchParams.get('source') || 'obsidian'
        const filePath = url.searchParams.get('path') || ''
        const source = docSources.find(s => s.id === sourceId && s.type === 'local')

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')

        if (!source) {
          res.statusCode = 404
          res.end('Source not found')
          return
        }

        const fullPath = path.join(source.path, filePath)
        if (!fs.existsSync(fullPath)) {
          res.statusCode = 404
          res.end('File not found')
          return
        }

        try {
          const stats = fs.statSync(fullPath)
          const content = fs.readFileSync(fullPath, 'utf-8')
          const tags = extractTags(content)
          res.end(JSON.stringify({
            id: `${sourceId}:${filePath}`,
            name: path.basename(filePath),
            path: fullPath,
            relativePath: filePath,
            type: 'file',
            extension: path.extname(filePath),
            lastModified: stats.mtime.toISOString(),
            sourceId,
            tags,
          }))
        } catch {
          res.statusCode = 500
          res.end('Error reading file')
        }
      })
    },
  }
}
