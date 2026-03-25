import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import fs from 'fs'
const fsp = fs.promises
import path from 'path'
import http from 'http'
import crypto from 'crypto'
import { URL } from 'url'
import { IncomingMessage, ServerResponse } from 'http'
import Anthropic from '@anthropic-ai/sdk'

// ─── 加载环境变量 ────────────────────────────────────────────────────────────

const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    const k = key?.trim()
    const v = valueParts?.join('=').trim().replace(/^["']|["']$/g, '')
    if (k && v && !k.startsWith('#') && !process.env[k]) {
      process.env[k] = v
    }
  })
}

// ─── Blinko API 代理 ───────────────────────────────────────────────────────────

interface BlinkoNote {
  id: number
  content: string
  type: 0 | 1
  tags?: string[]
  files?: unknown[]
  createdAt: string
  updatedAt: string
}

interface BlinkoFileItem {
  id: string
  name: string
  path: string
  relativePath: string
  type: 'file' | 'directory'
  extension: string
  lastModified: string
  sourceId: string
  tags?: string[]
  blinkoData?: BlinkoNote
}

function blinkoRequest<T>(
  urlPath: string,
  method: string,
  body?: unknown,
  apiToken?: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const sourceUrl = docSources.find(s => s.id === 'blinko')?.apiUrl || process.env.BLINKO_URL || 'http://localhost:1111'
    const url = new URL(urlPath, sourceUrl)
    const postData = body ? JSON.stringify(body) : undefined
    const options: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port || '1111',
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
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

async function handleBlinkoApi(_req: IncomingMessage, res: ServerResponse, url: URL) {
  const apiToken = process.env.BLINKO_TOKEN
    || docSources.find(s => s.id === 'blinko')?.apiToken
    || ''
  const apiPath = url.pathname.slice(5) // 去掉 /api/
  // action 保留用于未来扩展

  try {
    let result: unknown

    if (apiPath === 'scan') {
      // 获取笔记列表
      result = await blinkoRequest<BlinkoNote[] | { message: string }>(
        '/api/v1/note/list',
        'POST',
        { page: 1, size: 200, orderBy: 'desc', type: -1, isRecycle: false },
        apiToken
      )

      if (!Array.isArray(result)) {
        // 返回错误信息给前端
        const items: BlinkoFileItem[] = [{
          id: 'blinko:auth-required',
          name: '需要配置 Blinko API Token',
          path: 'auth-required',
          relativePath: 'auth-required',
          type: 'file',
          extension: '.md',
          lastModified: new Date().toISOString(),
          sourceId: 'blinko',
        }]
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(items))
        return
      }

      const items: BlinkoFileItem[] = (result as BlinkoNote[]).map((note: BlinkoNote) => ({
        id: `blinko:${note.id}`,
        name: note.content.split('\n')[0].slice(0, 60) || `Blinko #${note.id}`,
        path: String(note.id),
        relativePath: String(note.id),
        type: 'file' as const,
        extension: '.md',
        lastModified: note.updatedAt || note.createdAt,
        sourceId: 'blinko',
        tags: note.tags,
        blinkoData: note,
      }))

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(items))
      return
    }

    if (apiPath === 'file') {
      // 获取笔记内容
      const noteId = url.searchParams.get('path') || ''
      if (noteId === 'auth-required') {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('# Blinko — 需要 API Token\n\n请在 .env 文件中配置 BLINKO_TOKEN')
        return
      }

      const detail = await blinkoRequest<{ content?: string }>(
        '/api/v1/note/detail',
        'POST',
        { id: parseInt(noteId, 10) },
        apiToken
      )

      const content = (detail as { content?: string }).content || '# 笔记内容为空'
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end(content)
      return
    }

    if (apiPath === 'tags') {
      // Blinko 标签从笔记中提取
      const notes = await blinkoRequest<BlinkoNote[]>(
        '/api/v1/note/list',
        'POST',
        { page: 1, size: 200, orderBy: 'desc', type: -1, isRecycle: false },
        apiToken
      )

      if (!Array.isArray(notes)) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify([]))
        return
      }

      const tagCounts = new Map<string, number>()
      for (const note of notes) {
        if (note.tags) {
          for (const tag of note.tags) {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
          }
        }
      }

      const tags = Array.from(tagCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(tags))
      return
    }

    // 未知端点
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Unknown Blinko API endpoint' }))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('Blinko API error:', e)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: msg }))
  }
}

interface DocSource {
  id: string
  name: string
  path: string
  enabled: boolean
  description?: string
  type?: 'local' | 'api'
  apiUrl?: string
  apiToken?: string
  icon?: string
}

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
    // 优先级：BLINKO_TOKEN 环境变量 > 空字符串（Blinko 关闭认证时）
    apiToken: process.env.BLINKO_TOKEN || '',
    icon: 'blinko',
  },
]

// ─── 安全限制 ─────────────────────────────────────────────────────────────────

const excludePatterns = ['.git', 'node_modules', '.obsidian', '.trash']
const supportedExtensions = ['.md', '.markdown']

function isExcluded(name: string): boolean {
  return excludePatterns.some((p) => name === p || name.startsWith('.'))
}

function isSupported(filename: string): boolean {
  const ext = filename.toLowerCase()
  return supportedExtensions.some((e) => ext.endsWith(e))
}

function resolveSource(sourceId: string): DocSource | null {
  return docSources.find((s) => s.id === sourceId && s.enabled) ?? null
}

// ─── 核心操作 ─────────────────────────────────────────────────────────────────

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

async function scanDir(sourceId: string, dirPath?: string): Promise<FileItem[]> {
  const source = resolveSource(sourceId)
  if (!source) return []

  const basePath = dirPath ? path.join(source.path, dirPath) : source.path
  const items: FileItem[] = []
  try {
    const entries = await fsp.readdir(basePath, { withFileTypes: true })
    for (const entry of entries) {
      if (isExcluded(entry.name)) continue
      const fullPath = path.join(basePath, entry.name)
      const relativePath = dirPath ? path.join(dirPath, entry.name) : entry.name

      try {
        const stat = await fsp.stat(fullPath)
        if (entry.isDirectory()) {
          items.push({
            id: `${sourceId}:${relativePath}`,
            name: entry.name,
            path: fullPath,
            relativePath,
            type: 'directory',
            extension: '',
            lastModified: stat.mtime.toISOString(),
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
            lastModified: stat.mtime.toISOString(),
            sourceId,
          })
        }
      } catch { /* skip inaccessible entries */ }
    }
  } catch {
    /* directory unreadable or not found */
  }

  return items.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

async function readFile(sourceId: string, filePath: string): Promise<string | null> {
  if (filePath.includes('..') || path.isAbsolute(filePath)) return null
  const source = resolveSource(sourceId)
  if (!source) return null
  const fullPath = path.join(source.path, filePath)
  const rel = path.relative(source.path, fullPath)
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null
  // 仅允许 Markdown 文件
  const ext = path.extname(fullPath).toLowerCase()
  if (ext !== '.md' && ext !== '.markdown') return null
  try {
    return await fsp.readFile(fullPath, 'utf-8')
  } catch {
    return null
  }
}

async function writeFile(
  sourceId: string,
  filePath: string,
  content: string,
): Promise<{ success: boolean; path: string; error?: string }> {
  const source = resolveSource(sourceId)
  if (!source) return { success: false, path: '', error: `未知文档源: ${sourceId}` }

  const sourcePath = path.normalize(source.path)
  const fullPath = path.normalize(path.join(sourcePath, filePath))
  // path.relative returns e.g. "../../../etc/passwd" for traversal attempts
  const rel = path.relative(sourcePath, fullPath)
  if (rel.startsWith('..') || path.isAbsolute(rel) || filePath.includes('..')) {
    return { success: false, path: fullPath, error: '禁止路径穿越' }
  }

  if (!isSupported(filePath)) {
    return {
      success: false,
      path: fullPath,
      error: `不支持的文件类型，仅允许: ${supportedExtensions.join(', ')}`,
    }
  }

  try {
    const dir = path.dirname(fullPath)
    await fsp.mkdir(dir, { recursive: true })
    await fsp.writeFile(fullPath, content, 'utf-8')
    return { success: true, path: fullPath }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return { success: false, path: fullPath, error: msg }
  }
}

// Filename-only search (shallow, fast)
async function searchFiles(
  sourceId: string,
  query: string,
  dirPath?: string,
): Promise<FileItem[]> {
  const all = await scanDir(sourceId, dirPath)
  const q = query.toLowerCase()

  const results: FileItem[] = []
  const dirs: string[] = []

  for (const item of all) {
    if (item.type === 'directory') {
      dirs.push(item.relativePath)
    } else if (item.name.toLowerCase().includes(q)) {
      results.push(item)
    }
  }

  for (const sub of dirs) {
    results.push(...(await searchFiles(sourceId, query, sub)))
  }

  return results
}

// 从 markdown 文件中提取所有标签（#tag-name 格式）
function extractTagsFromContent(content: string): string[] {
  const tagRegex = /#([\p{L}\p{N}_-]+)/gu
  const tags = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = tagRegex.exec(content)) !== null) {
    tags.add(match[1].toLowerCase())
  }

  return Array.from(tags)
}

interface TagInfo {
  name: string
  count: number
}

// 获取某个源下所有文件的标签
async function getAllTags(sourceId: string): Promise<TagInfo[]> {
  const source = resolveSource(sourceId)
  if (!source) return []

  const tagCounts = new Map<string, number>()

  try {
    const scanResults = await scanDir(sourceId)
    const mdFiles = scanResults.filter(item => item.type === 'file' && item.extension === '.md')

    for (const file of mdFiles) {
      const content = await readFile(sourceId, file.relativePath)
      if (content) {
        const tags = extractTagsFromContent(content)
        for (const tag of tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
        }
      }
    }
  } catch (error) {
    console.error('Error extracting tags:', error)
  }

  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// Full-text search across all files
async function searchFullText(
  sourceId: string,
  query: string,
): Promise<Array<{ path: string; name: string; snippet: string; score: number }>> {
  const source = resolveSource(sourceId)
  if (!source) return []

  const results: Array<{ path: string; name: string; snippet: string; score: number }> = []
  const lowerQuery = query.toLowerCase().slice(0, 100) // guard against absurdly long queries

  async function walk(dir: string) {
    let entries: fs.Dirent[]
    try { entries = await fsp.readdir(dir, { withFileTypes: true }) } catch { return }

    for (const entry of entries) {
      if (isExcluded(entry.name)) continue
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && isSupported(entry.name)) {
        try {
          const content = await fsp.readFile(fullPath, 'utf-8')
          const relativePath = path.relative(source!.path, fullPath).replace(/\\/g, '/')
          const lowerContent = content.toLowerCase()
          const lowerName = entry.name.toLowerCase()

          if (!lowerContent.includes(lowerQuery) && !lowerName.includes(lowerQuery)) continue

          const matchIdx = lowerContent.indexOf(lowerQuery)
          let snippet = ''
          if (matchIdx !== -1) {
            const start = Math.max(0, matchIdx - 60)
            const end = Math.min(content.length, matchIdx + query.length + 100)
            snippet = (start > 0 ? '…' : '') + content.slice(start, end).replace(/\n+/g, ' ') + (end < content.length ? '…' : '')
          }

          const nameScore = lowerName.includes(lowerQuery) ? 10 : 0
          // Use split instead of regex to avoid ReDoS
          const freq = lowerContent.split(lowerQuery).length - 1

          results.push({ path: relativePath, name: entry.name, snippet, score: nameScore + freq })
        } catch { /* skip */ }
      }
    }
  }

  await walk(source.path)
  return results.sort((a, b) => b.score - a.score).slice(0, 20)
}

// Build markdown frontmatter
function buildFrontmatter(meta: Record<string, unknown>): string {
  if (Object.keys(meta).length === 0) return ''
  const lines = ['---']
  for (const [k, v] of Object.entries(meta)) {
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.map(String).join(', ')}]`)
    } else {
      lines.push(`${k}: ${v}`)
    }
  }
  lines.push('---', '')
  return lines.join('\n')
}

// ─── Knowledge Graph ──────────────────────────────────────────────────────────

interface GraphNode {
  id: string
  label: string
  kind: 'current' | 'note' | 'tag'
  x: number
  y: number
  vx: number
  vy: number
}

interface GraphEdge {
  source: string
  target: string
  kind: 'wikilink' | 'tag'
}

async function buildGraphData(sourceId: string, currentRelativePath: string): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  const source = resolveSource(sourceId)
  if (!source || source.type !== 'local') return { nodes: [], edges: [] }

  const nameToPath: Record<string, string> = {}
  async function indexFiles(dir: string) {
    let entries: fs.Dirent[]
    try { entries = await fsp.readdir(dir, { withFileTypes: true }) } catch { return }
    for (const entry of entries) {
      if (isExcluded(entry.name)) continue
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await indexFiles(fullPath)
      } else if (entry.isFile() && isSupported(entry.name)) {
        const rel = path.relative(source!.path, fullPath).replace(/\\/g, '/')
        const stem = entry.name.replace(/\.(md|markdown)$/i, '')
        nameToPath[stem.toLowerCase()] = rel
      }
    }
  }
  await indexFiles(source.path)

  const nodesMap = new Map<string, GraphNode>()
  const edges: GraphEdge[] = []

  const addNode = (id: string, label: string, kind: GraphNode['kind']) => {
    if (!nodesMap.has(id)) {
      nodesMap.set(id, { id, label, kind, x: 0, y: 0, vx: 0, vy: 0 })
    }
  }

  const currentStem = path.basename(currentRelativePath).replace(/\.(md|markdown)$/i, '')
  addNode(currentRelativePath, currentStem, 'current')

  const currentFullPath = path.join(source.path, currentRelativePath)
  let currentContent: string
  try {
    currentContent = await fsp.readFile(currentFullPath, 'utf-8')
  } catch {
    return { nodes: [...nodesMap.values()], edges }
  }

  const wikilinkRegex = /\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g
  let match: RegExpExecArray | null
  while ((match = wikilinkRegex.exec(currentContent)) !== null) {
    const linkName = match[1].trim()
    const resolved = nameToPath[linkName.toLowerCase()]
    if (resolved && resolved !== currentRelativePath) {
      addNode(resolved, linkName, 'note')
      edges.push({ source: currentRelativePath, target: resolved, kind: 'wikilink' })
    }
  }

  const currentTags = extractTagsFromContent(currentContent)
  for (const tag of currentTags) {
    const tagId = '#' + tag
    addNode(tagId, tag, 'tag')
    edges.push({ source: currentRelativePath, target: tagId, kind: 'tag' })
  }

  async function findBacklinks(dir: string) {
    let entries: fs.Dirent[]
    try { entries = await fsp.readdir(dir, { withFileTypes: true }) } catch { return }
    for (const entry of entries) {
      if (isExcluded(entry.name)) continue
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await findBacklinks(fullPath)
      } else if (entry.isFile() && isSupported(entry.name)) {
        const rel = path.relative(source!.path, fullPath).replace(/\\/g, '/')
        if (rel === currentRelativePath) continue
        try {
          const content = await fsp.readFile(fullPath, 'utf-8')
          const re = /\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g
          let m: RegExpExecArray | null
          while ((m = re.exec(content)) !== null) {
            const resolved = nameToPath[m[1].trim().toLowerCase()]
            if (resolved === currentRelativePath) {
              const stem = entry.name.replace(/\.(md|markdown)$/i, '')
              addNode(rel, stem, 'note')
              edges.push({ source: rel, target: currentRelativePath, kind: 'wikilink' })
              break
            }
          }
        } catch { /* skip */ }
      }
    }
  }
  await findBacklinks(source.path)

  return { nodes: [...nodesMap.values()], edges }
}

// ─── AI Analysis ──────────────────────────────────────────────────────────────

async function analyzeDocumentContent(content: string, fileName: string): Promise<{
  summary: string
  keyPoints: string[]
  concepts: Array<{ term: string; definition: string }>
  error?: string
}> {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      ...(process.env.ANTHROPIC_BASE_URL ? { baseURL: process.env.ANTHROPIC_BASE_URL } : {}),
    })

    const truncated = content.slice(0, 8000)
    const response = await anthropic.messages.create({
      model: process.env.AI_MODEL || 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Analyze this document and return JSON only, no prose.

Document: "${fileName}"

${truncated}

Return exactly:
{
  "summary": "2-3 sentence summary",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "concepts": [
    { "term": "concept name", "definition": "brief explanation" }
  ]
}`,
      }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    return JSON.parse(clean)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { summary: '', keyPoints: [], concepts: [], error: msg }
  }
}

// ─── 工具定义 ─────────────────────────────────────────────────────────────────

function getToolSchemas() {
  return [
    {
      name: 'obsidian_scan',
      description: '扫描 Obsidian 知识库的目录，返回文件/文件夹列表',
      inputSchema: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: '文档源 ID，默认 obsidian',
            default: 'obsidian',
          },
          path: {
            type: 'string',
            description: '子目录路径，不填则为根目录',
          },
        },
      },
    },
    {
      name: 'obsidian_read',
      description: '读取 Obsidian 知识库中的文件内容',
      inputSchema: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: '文档源 ID，默认 obsidian',
            default: 'obsidian',
          },
          path: {
            type: 'string',
            description: '文件相对路径（必填），如 notes/test.md',
          },
        },
        required: ['path'],
      },
    },
    {
      name: 'obsidian_write',
      description:
        '向 Obsidian 知识库写入（新建或覆盖）Markdown 文件，支持路径穿越检查',
      inputSchema: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: '文档源 ID，默认 obsidian',
            default: 'obsidian',
          },
          path: {
            type: 'string',
            description:
              '文件相对路径（必填），如 daily/2026-03-24.md，自动创建父目录',
          },
          content: {
            type: 'string',
            description: '文件内容（必填），Markdown 格式',
          },
        },
        required: ['path', 'content'],
      },
    },
    {
      name: 'obsidian_list',
      description: '列出所有已配置的文档源',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'obsidian_search',
      description: '在 Obsidian 知识库中按文件名搜索文件（快速）',
      inputSchema: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: '文档源 ID，默认 obsidian',
            default: 'obsidian',
          },
          query: {
            type: 'string',
            description: '搜索关键词（必填）',
          },
          path: {
            type: 'string',
            description: '在指定子目录中搜索',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'obsidian_fulltext_search',
      description: '对 Obsidian 知识库进行全文搜索，返回包含关键词的文档片段（比 obsidian_search 慢但更准确）',
      inputSchema: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: '文档源 ID，默认 obsidian',
            default: 'obsidian',
          },
          query: {
            type: 'string',
            description: '搜索关键词（必填）',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'obsidian_write_note',
      description: '向知识库写入带有 frontmatter 元数据的 Markdown 笔记。如果文件已存在会覆盖。自动生成 YAML frontmatter（date/tags/title）。',
      inputSchema: {
        type: 'object',
        properties: {
          source: {
            type: 'string',
            description: '文档源 ID，默认 obsidian',
            default: 'obsidian',
          },
          path: {
            type: 'string',
            description: '文件相对路径（必填），如 daily/2026-03-24.md，会自动创建父目录',
          },
          content: {
            type: 'string',
            description: '笔记正文内容（Markdown，不含 frontmatter，必填）',
          },
          title: {
            type: 'string',
            description: '笔记标题（可选，写入 frontmatter）',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: '标签列表（可选，写入 frontmatter）',
          },
          date: {
            type: 'string',
            description: '创建日期（可选，默认今天，格式 YYYY-MM-DD）',
          },
        },
        required: ['path', 'content'],
      },
    },
    // ── Blinko 工具 ──────────────────────────────────────────────────────────────
    {
      name: 'blinko_list_notes',
      description: '列出 Blinko 闪念笔记（最近的笔记列表）',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: '返回数量上限（默认 50，最大 200）',
            default: 50,
          },
        },
      },
    },
    {
      name: 'blinko_read_note',
      description: '读取 Blinko 笔记内容（通过笔记 ID）',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'number',
            description: '笔记 ID（必填）',
          },
        },
        required: ['noteId'],
      },
    },
    {
      name: 'blinko_write_note',
      description: '向 Blinko 创建或更新笔记内容',
      inputSchema: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            description: '笔记内容（必填），支持 Markdown',
          },
          noteId: {
            type: 'number',
            description: '笔记 ID（可选，不填则创建新笔记）',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: '标签列表（可选，自动识别 #标签 格式）',
          },
        },
        required: ['content'],
      },
    },
    {
      name: 'blinko_search',
      description: '在 Blinko 笔记中全文搜索',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '搜索关键词（必填）',
          },
        },
        required: ['query'],
      },
    },
  ]
}

// ─── Server 工厂 ────────────────────────────────────────────────────────────────

export function createServer() {
  const server = new Server(
    { name: 'info-hub-mcp', version: '1.0.0' },
    { capabilities: { tools: {} } },
  )

  server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: getToolSchemas(),
  }))

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params
    try {
      switch (name) {
        case 'obsidian_scan': {
          const source = (args?.source as string) || 'obsidian'
          const dirPath = args?.path as string | undefined
          return {
            content: [{ type: 'text', text: JSON.stringify(scanDir(source, dirPath), null, 2) }],
          }
        }

        case 'obsidian_read': {
          const source = (args?.source as string) || 'obsidian'
          const filePath = args?.path as string
          if (!filePath) {
            return { content: [{ type: 'text', text: '错误: path 参数必填' }], isError: true }
          }
          const content = readFile(source, filePath)
          if (content === null) {
            return { content: [{ type: 'text', text: `文件不存在: ${filePath}` }], isError: true }
          }
          return { content: [{ type: 'text', text: content }] }
        }

        case 'obsidian_write': {
          const source = (args?.source as string) || 'obsidian'
          const filePath = args?.path as string
          const content = args?.content as string
          if (!filePath || content === undefined) {
            return {
              content: [{ type: 'text', text: '错误: path 和 content 参数必填' }],
              isError: true,
            }
          }
          const result = await writeFile(source, filePath, content)
          if (result.success) {
            return {
              content: [{ type: 'text', text: `✓ 文件已保存: ${result.path}` }],
            }
          }
          return { content: [{ type: 'text', text: `✗ 保存失败: ${result.error}` }], isError: true }
        }

        case 'obsidian_list': {
          return {
            content: [
              { type: 'text', text: JSON.stringify(docSources.filter((s) => s.enabled), null, 2) },
            ],
          }
        }

        case 'obsidian_search': {
          const source = (args?.source as string) || 'obsidian'
          const query = args?.query as string
          const dirPath = args?.path as string | undefined
          if (!query) {
            return { content: [{ type: 'text', text: '错误: query 参数必填' }], isError: true }
          }
          return {
            content: [{ type: 'text', text: JSON.stringify(searchFiles(source, query, dirPath), null, 2) }],
          }
        }

        case 'obsidian_fulltext_search': {
          const source = (args?.source as string) || 'obsidian'
          const query = args?.query as string
          if (!query) {
            return { content: [{ type: 'text', text: '错误: query 参数必填' }], isError: true }
          }
          const results = searchFullText(source, query)
          return {
            content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
          }
        }

        case 'obsidian_write_note': {
          const source = (args?.source as string) || 'obsidian'
          const filePath = args?.path as string
          const body = args?.content as string
          if (!filePath || body === undefined) {
            return { content: [{ type: 'text', text: '错误: path 和 content 参数必填' }], isError: true }
          }
          const meta: Record<string, unknown> = {
            date: (args?.date as string) || new Date().toISOString().slice(0, 10),
          }
          if (args?.title) meta.title = args.title as string
          if (args?.tags && Array.isArray(args.tags)) meta.tags = args.tags
          const fullContent = buildFrontmatter(meta) + body
          const result = await writeFile(source, filePath, fullContent)
          if (result.success) {
            return { content: [{ type: 'text', text: `✓ 笔记已保存: ${result.path}` }] }
          }
          return { content: [{ type: 'text', text: `✗ 保存失败: ${result.error}` }], isError: true }
        }

        default:
          return { content: [{ type: 'text', text: `未知工具: ${name}` }], isError: true }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      return { content: [{ type: 'text', text: `错误: ${msg}` }], isError: true }
    }
  })

  return server
}

// ─── HTTP/SSE 传输（远程访问）────────────────────────────────────────────────

// ─── Token 管理 ──────────────────────────────────────────────────────────────

const TOKEN_FILE = path.resolve(process.cwd(), '.info-hub-token')

function loadOrCreateToken(): string {
  // 1. 优先使用环境变量
  if (process.env.MCP_AUTH_TOKEN) return process.env.MCP_AUTH_TOKEN

  // 2. 从持久化文件读取
  if (fs.existsSync(TOKEN_FILE)) {
    const saved = fs.readFileSync(TOKEN_FILE, 'utf-8').trim()
    if (saved.length >= 32) return saved
  }

  // 3. 首次运行：生成强随机 token 并持久化
  const newToken = crypto.randomBytes(32).toString('hex')
  fs.writeFileSync(TOKEN_FILE, newToken, { mode: 0o600 }) // 仅 owner 可读
  console.error('[info-hub-mcp] 首次运行，已生成访问 token 并保存至:', TOKEN_FILE)
  return newToken
}

const AUTH_TOKEN = loadOrCreateToken()

// ─── 请求安全常量 ──────────────────────────────────────────────────────────

const MAX_BODY_SIZE = 10 * 1024 * 1024 // 10 MB

const ALLOWED_ORIGINS: string[] = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o: string) => o.trim())
  : []

function getAllowedOrigin(requestOrigin: string | undefined): string {
  if (!requestOrigin) return ALLOWED_ORIGINS[0] || ''
  if (ALLOWED_ORIGINS.includes(requestOrigin)) return requestOrigin
  // 开发模式：若未配置允许域名则允许所有（便于本地调试）
  if (ALLOWED_ORIGINS.length === 0) return requestOrigin
  return ALLOWED_ORIGINS[0] || ''
}

async function readBody(req: http.IncomingMessage): Promise<string> {
  let body = ''
  let size = 0
  for await (const chunk of req) {
    const bytes = chunk as { length: number }
    size += bytes.length
    if (size > MAX_BODY_SIZE) {
      throw Object.assign(new Error('Payload Too Large'), { statusCode: 413 })
    }
    body += chunk
  }
  return body
}

// ─── 暴力破解保护（速率限制）────────────────────────────────────────────────

const authFailures = new Map<string, { count: number; until: number }>()
const MAX_FAILURES = 10        // 10 次失败
const LOCKOUT_MS = 5 * 60_000 // 锁定 5 分钟

function getClientIp(req: http.IncomingMessage): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim()
    || req.socket.remoteAddress
    || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const rec = authFailures.get(ip)
  if (!rec) return false
  if (Date.now() < rec.until) return true
  authFailures.delete(ip)
  return false
}

function recordAuthFailure(ip: string): void {
  const rec = authFailures.get(ip) || { count: 0, until: 0 }
  rec.count++
  if (rec.count >= MAX_FAILURES) {
    rec.until = Date.now() + LOCKOUT_MS
    console.error(`[info-hub-mcp] IP ${ip} 认证失败 ${rec.count} 次，锁定 5 分钟`)
  }
  authFailures.set(ip, rec)
}

function recordAuthSuccess(ip: string): void {
  authFailures.delete(ip)
}

// ─── 认证中间件 ───────────────────────────────────────────────────────────────

function authMiddleware(req: http.IncomingMessage): boolean {
  const ip = getClientIp(req)
  if (isRateLimited(ip)) return false

  const authHeader = req.headers.authorization
  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : url.searchParams.get('token') ?? ''

  const ok = crypto.timingSafeEqual(
    Buffer.from(token.padEnd(64)),
    Buffer.from(AUTH_TOKEN.padEnd(64)),
  ) && token.length === AUTH_TOKEN.length

  if (ok) { recordAuthSuccess(ip) } else { recordAuthFailure(ip) }
  return ok
}

async function startHttpServer(port: number) {
  createServer()

  const mimeTypes: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
  }

  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`)
    const pathname = url.pathname

    // ── MCP 协议端点 ────────────────────────────────────────────────────────

    if (pathname === '/mcp' || pathname === '/mcp/') {
      // 认证检查
      if (!authMiddleware(req)) {
        res.writeHead(401, {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Bearer realm="info-hub-mcp"',
        })
        res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32001, message: 'Unauthorized' }, id: null }))
        return
      }

      const body = await readBody(req)

      const origin = getAllowedOrigin(req.headers.origin)
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      })

      try {
        const request = JSON.parse(body)
        const id = request.id

        if (request.method === 'initialize') {
          const response = {
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: { tools: {} },
              serverInfo: { name: 'info-hub-mcp', version: '1.0.0' },
            },
          }
          res.end(JSON.stringify(response))
        } else if (request.method === 'tools/list') {
          const tools = getToolSchemas()
          const response = { jsonrpc: '2.0', id, result: { tools } }
          res.end(JSON.stringify(response))
        } else if (request.method === 'tools/call') {
          // 手动处理 tools/call，因为 MCP SDK 的 HTTP 传输需要额外依赖
          const { name, arguments: args } = request.params
          const result = await handleToolCall(name, args || {})
          const response = { jsonrpc: '2.0', id, result }
          res.end(JSON.stringify(response))
        } else {
          res.end(JSON.stringify({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } }))
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        res.end(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32603, message: `Internal error: ${msg}` } }))
      }
      return
    }

    // ── CORS 预检 ──────────────────────────────────────────────────────────

    if (req.method === 'OPTIONS') {
      const origin = getAllowedOrigin(req.headers.origin)
      res.writeHead(204, {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      })
      res.end()
      return
    }

    // ── 健康检查 + 工具列表（无需认证，方便检测服务状态）─────────────────────

    if (pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'ok', tools: getToolSchemas().map((t) => t.name) }))
      return
    }

    // ── API 代理（便捷 HTTP API，无需 JSON-RPC，远程访问友好）────────────────

    if (pathname.startsWith('/api/')) {
      // Blinko API 代理
      if (url.searchParams.get('source') === 'blinko') {
        handleBlinkoApi(req, res, url)
        return
      }

      // 本地源 API - 无需认证（内部服务，通过 Nginx/IP 白名单保护）

      const apiPath = pathname.slice(5) // 去掉 /api/（pathname 以 / 开头）
      const source = url.searchParams.get('source') || 'obsidian'
      const filePath = url.searchParams.get('path') || ''

      try {
        let result: string | null = null
        let statusCode = 200

        switch (apiPath) {
          case 'file': // 别名：read
          case 'read': {
            if (!filePath) throw new Error('path 参数必填')
            result = await readFile(source, filePath)
            if (result === null) {
              statusCode = 404
              result = `文件不存在：${filePath}`
            }
            break
          }
          case 'scan': {
            const items = await scanDir(source, filePath || undefined)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(items))
            return
          }
          case 'write': {
            if (!filePath) throw new Error('path 参数必填')
            const payload = JSON.parse(await readBody(req))
            const writeResult = await writeFile(source, filePath, payload.content || '')
            if (!writeResult.success) {
              statusCode = 400
              result = writeResult.error || '写入失败'
            } else {
              result = JSON.stringify({ success: true, path: writeResult.path })
            }
            break
          }
          case 'sources': {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(docSources.filter((s) => s.enabled)))
            return
          }
          case 'search': {
            const query = url.searchParams.get('query')
            if (!query) throw new Error('query 参数必填')
            const items = await searchFiles(source, query, filePath || undefined)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(items))
            return
          }
          case 'fulltext_search': {
            const query = url.searchParams.get('query')
            if (!query) throw new Error('query 参数必填')
            const items = await searchFullText(source, query)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(items))
            return
          }
          case 'tags': {
            const tags = await getAllTags(source)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(tags))
            return
          }
          case 'graph': {
            if (!filePath) throw new Error('path 参数必填')
            const graphData = await buildGraphData(source, filePath)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(graphData))
            return
          }
          case 'ai/analyze': {
            const payload = JSON.parse(await readBody(req))
            const aiResult = await analyzeDocumentContent(payload.content || '', payload.fileName || '')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(aiResult))
            return
          }
          default:
            statusCode = 404
            result = `未知端点: ${apiPath}`
        }

        const origin = getAllowedOrigin(req.headers.origin)
        res.writeHead(statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Max-Age': '86400',
        })
        res.end(JSON.stringify(result))
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        const code = (e as { statusCode?: number }).statusCode ?? 400
        res.writeHead(code, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: msg }))
      }
      return
    }

    // ── 静态首页 ────────────────────────────────────────────────────────────

    if (pathname === '/' || pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(HOME_PAGE)
      return
    }

    // 静态资源
    const ext = path.extname(pathname)
    if (ext && mimeTypes[ext]) {
      const staticPath = path.join(process.cwd(), pathname)
      try {
        const staticContent = await fsp.readFile(staticPath)
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] })
        res.end(staticContent)
        return
      } catch {
        // file not found, fall through to 404
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  })

  // BIND_ADDRESS 可绑定到指定网卡，例如 Tailscale IP (100.x.x.x) 或仅本机 (127.0.0.1)
  const bindAddress = process.env.BIND_ADDRESS || '0.0.0.0'
  httpServer.listen(port, bindAddress, () => {
    console.error(`[info-hub-mcp] HTTP 服务已启动: http://${bindAddress}:${port}`)
    console.error(`[info-hub-mcp] 健康检查: http://${bindAddress}:${port}/health`)
    console.error(`[info-hub-mcp] 访问 token: ${AUTH_TOKEN}`)
    console.error(`[info-hub-mcp] MCP JSON-RPC: http://${bindAddress}:${port}/mcp`)
    console.error(`[info-hub-mcp] REST API:     http://${bindAddress}:${port}/api/scan`)
  })

  return httpServer
}

// 手动处理工具调用（HTTP 模式下绕过 MCP SDK 的 transport）
async function handleToolCall(name: string, args: Record<string, unknown>) {
  switch (name) {
    case 'obsidian_scan': {
      const source = (args.source as string) || 'obsidian'
      const dirPath = args.path as string | undefined
      return { content: [{ type: 'text', text: JSON.stringify(await scanDir(source, dirPath), null, 2) }] }
    }
    case 'obsidian_read': {
      const source = (args.source as string) || 'obsidian'
      const filePath = args.path as string
      if (!filePath) return { content: [{ type: 'text', text: '错误: path 参数必填' }], isError: true }
      const content = await readFile(source, filePath)
      if (content === null) return { content: [{ type: 'text', text: `文件不存在: ${filePath}` }], isError: true }
      return { content: [{ type: 'text', text: content }] }
    }
    case 'obsidian_write': {
      const source = (args.source as string) || 'obsidian'
      const filePath = args.path as string
      const content = args.content as string
      if (!filePath || content === undefined) return { content: [{ type: 'text', text: '错误: path 和 content 参数必填' }], isError: true }
      const result = await writeFile(source, filePath, content)
      if (result.success) return { content: [{ type: 'text', text: `✓ 文件已保存: ${result.path}` }] }
      return { content: [{ type: 'text', text: `✗ 保存失败: ${result.error}` }], isError: true }
    }
    case 'obsidian_list': {
      return { content: [{ type: 'text', text: JSON.stringify(docSources.filter((s) => s.enabled), null, 2) }] }
    }
    case 'obsidian_search': {
      const source = (args.source as string) || 'obsidian'
      const query = args.query as string
      const dirPath = args.path as string | undefined
      if (!query) return { content: [{ type: 'text', text: '错误: query 参数必填' }], isError: true }
      return { content: [{ type: 'text', text: JSON.stringify(await searchFiles(source, query, dirPath), null, 2) }] }
    }
    case 'obsidian_fulltext_search': {
      const source = (args.source as string) || 'obsidian'
      const query = args.query as string
      if (!query) return { content: [{ type: 'text', text: '错误: query 参数必填' }], isError: true }
      return { content: [{ type: 'text', text: JSON.stringify(await searchFullText(source, query), null, 2) }] }
    }
    case 'obsidian_write_note': {
      const source = (args.source as string) || 'obsidian'
      const filePath = args.path as string
      const body = args.content as string
      if (!filePath || body === undefined) return { content: [{ type: 'text', text: '错误: path 和 content 参数必填' }], isError: true }
      const meta: Record<string, unknown> = { date: (args.date as string) || new Date().toISOString().slice(0, 10) }
      if (args.title) meta.title = args.title as string
      if (args.tags && Array.isArray(args.tags)) meta.tags = args.tags
      const fullContent = buildFrontmatter(meta) + body
      const result = await writeFile(source, filePath, fullContent)
      if (result.success) return { content: [{ type: 'text', text: `✓ 笔记已保存: ${result.path}` }] }
      return { content: [{ type: 'text', text: `✗ 保存失败: ${result.error}` }], isError: true }
    }
    // ── Blinko 工具 ───────────────────────────────────────────────────────────
    case 'blinko_list_notes': {
      const limit = Math.min(Number(args.limit) || 50, 200)
      const apiToken = process.env.BLINKO_TOKEN || docSources.find(s => s.id === 'blinko')?.apiToken || ''
      if (!apiToken) {
        return { content: [{ type: 'text', text: '错误: 未配置 BLINKO_TOKEN，请在 .env 中配置' }], isError: true }
      }
      const notes = await blinkoRequest<BlinkoNote[]>(
        '/api/v1/note/list',
        'POST',
        { page: 1, size: limit, orderBy: 'desc', type: -1, isRecycle: false },
        apiToken
      )
      if (!Array.isArray(notes)) {
        return { content: [{ type: 'text', text: `Blinko API 错误: ${JSON.stringify(notes)}` }], isError: true }
      }
      const preview = notes.map(n => ({
        id: n.id,
        content: n.content?.slice(0, 100) || '(empty)',
        tags: n.tags,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      }))
      return { content: [{ type: 'text', text: JSON.stringify(preview, null, 2) }] }
    }
    case 'blinko_read_note': {
      const noteId = Number(args.noteId)
      if (!noteId) return { content: [{ type: 'text', text: '错误: noteId 参数必填' }], isError: true }
      const apiToken = process.env.BLINKO_TOKEN || docSources.find(s => s.id === 'blinko')?.apiToken || ''
      if (!apiToken) {
        return { content: [{ type: 'text', text: '错误: 未配置 BLINKO_TOKEN，请在 .env 中配置' }], isError: true }
      }
      const detail = await blinkoRequest<{ content?: string; contentText?: string }>(
        '/api/v1/note/detail',
        'POST',
        { id: noteId },
        apiToken
      )
      const content = detail?.content || detail?.contentText || ''
      if (!content) return { content: [{ type: 'text', text: `笔记 ${noteId} 为空或不存在` }], isError: true }
      return { content: [{ type: 'text', text: content }] }
    }
    case 'blinko_write_note': {
      const content = args.content as string
      const noteId = args.noteId !== undefined ? Number(args.noteId) : undefined
      const apiToken = process.env.BLINKO_TOKEN || docSources.find(s => s.id === 'blinko')?.apiToken || ''
      if (!apiToken) {
        return { content: [{ type: 'text', text: '错误: 未配置 BLINKO_TOKEN，请在 .env 中配置' }], isError: true }
      }
      if (!content) return { content: [{ type: 'text', text: '错误: content 参数必填' }], isError: true }
      const result = await blinkoRequest<{ id?: number; error?: string }>(
        '/api/v1/note/upsert',
        'POST',
        { content, ...(noteId ? { id: noteId } : {}), type: -1 },
        apiToken
      )
      if (result.error || !result.id) {
        return { content: [{ type: 'text', text: `写入失败: ${result.error || JSON.stringify(result)}` }], isError: true }
      }
      return { content: [{ type: 'text', text: `✓ 笔记已保存，ID: ${result.id}` }] }
    }
    case 'blinko_search': {
      const query = args.query as string
      if (!query) return { content: [{ type: 'text', text: '错误: query 参数必填' }], isError: true }
      const apiToken = process.env.BLINKO_TOKEN || docSources.find(s => s.id === 'blinko')?.apiToken || ''
      if (!apiToken) {
        return { content: [{ type: 'text', text: '错误: 未配置 BLINKO_TOKEN，请在 .env 中配置' }], isError: true }
      }
      // 先获取所有笔记，再在本地过滤（Blinko API 没有独立的搜索端点）
      const allNotes = await blinkoRequest<BlinkoNote[]>(
        '/api/v1/note/list',
        'POST',
        { page: 1, size: 200, orderBy: 'desc', type: -1, isRecycle: false },
        apiToken
      )
      if (!Array.isArray(allNotes)) {
        return { content: [{ type: 'text', text: `Blinko API 错误: ${JSON.stringify(allNotes)}` }], isError: true }
      }
      const q = query.toLowerCase()
      const matches = allNotes.filter(n => n.content?.toLowerCase().includes(q))
      const preview = matches.slice(0, 20).map(n => ({
        id: n.id,
        content: n.content?.slice(0, 150) || '(empty)',
        tags: n.tags,
      }))
      return { content: [{ type: 'text', text: JSON.stringify({ count: matches.length, results: preview }, null, 2) }] }
    }
    default:
      return { content: [{ type: 'text', text: `未知工具: ${name}` }], isError: true }
  }
}

// ─── 启动入口 ─────────────────────────────────────────────────────────────────

const HOME_PAGE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>info-hub MCP</title>
<style>
  body { font-family: system-ui; max-width: 720px; margin: 60px auto; padding: 0 20px; background: #fafafa; }
  h1 { color: #333; }
  h2 { color: #666; margin-top: 2em; }
  code { background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
  pre { background: #222; color: #eee; padding: 20px; border-radius: 8px; overflow-x: auto; }
  .tag { display: inline-block; background: #0070f3; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; margin-left: 8px; }
  .method { color: #79b8ff; }
  .path { color: #9ecbff; }
  .note { background: #fffbea; border: 1px solid #f0db4f; padding: 12px 16px; border-radius: 6px; margin: 20px 0; }
</style>
</head>
<body>
<h1>info-hub MCP Server <span class="tag">HTTP</span></h1>
<p>Obsidian 知识库 MCP 服务（HTTP 传输模式），支持 MCP JSON-RPC 和 REST API 两种调用方式。</p>

<div class="note">
  <strong>认证方式：</strong>所有需要认证的请求需带 <code>Authorization: Bearer &lt;token&gt;</code> 请求头或 <code>?token=...</code> 查询参数。Token 在服务启动日志中显示，或查看 <code>.info-hub-token</code> 文件。
</div>

<h2>可用工具 / REST 端点</h2>
<table style="width:100%;border-collapse:collapse;text-align:left;">
<tr style="border-bottom:1px solid #ddd;"><th style="padding:8px;">方法</th><th style="padding:8px;">路径</th><th style="padding:8px;">说明</th></tr>
<tr style="border-bottom:1px solid #eee;"><td style="padding:8px;"><span class="method">GET</span></td><td style="padding:8px;"><code>/api/scan?source=obsidian&path=&amp;token=...</code></td><td style="padding:8px;">扫描目录</td></tr>
<tr style="border-bottom:1px solid #eee;"><td style="padding:8px;"><span class="method">GET</span></td><td style="padding:8px;"><code>/api/read?source=obsidian&amp;path=&amp;token=...</code></td><td style="padding:8px;">读取文件</td></tr>
<tr style="border-bottom:1px solid #eee;"><td style="padding:8px;"><span class="method">POST</span></td><td style="padding:8px;"><code>/api/write?source=obsidian&amp;path=&amp;token=...</code></td><td style="padding:8px;">写入文件（body: {"content":"..."})</td></tr>
<tr style="border-bottom:1px solid #eee;"><td style="padding:8px;"><span class="method">GET</span></td><td style="padding:8px;"><code>/api/sources?token=...</code></td><td style="padding:8px;">列出文档源</td></tr>
<tr style="border-bottom:1px solid #eee;"><td style="padding:8px;"><span class="method">GET</span></td><td style="padding:8px;"><code>/api/search?source=obsidian&amp;query=&amp;path=&amp;token=...</code></td><td style="padding:8px;">搜索文件</td></tr>
<tr style="border-bottom:1px solid #eee;"><td style="padding:8px;"><span class="method">GET</span></td><td style="padding:8px;"><code>/health</code></td><td style="padding:8px;">健康检查（无需认证）</td></tr>
</table>

<h2>使用示例</h2>
<pre>TOKEN=$(cat .info-hub-token)

curl -H "Authorization: Bearer $TOKEN" "http://localhost:3010/api/scan"

curl -H "Authorization: Bearer $TOKEN" \\
  "http://localhost:3010/api/read?source=obsidian&path=inbox/test.md"

curl -X POST -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"# Hello\\n\\nworld"}' \\
  "http://localhost:3010/api/write?source=obsidian&path=inbox/test.md"</pre>

<h2>Claude Code 远程配置</h2>
<p>在 <code>~/.claude/settings.json</code> 中添加：</p>
<pre>{
  "allowedMcpServers": [{
    "serverName": "info-hub-remote",
    "serverUrl": "http://你的服务器地址:3010/mcp"
  }]
}</pre>
<p>环境变量 <code>MCP_AUTH_TOKEN</code> 设置访问令牌。</p>
</body>
</html>`

async function main() {
  const mode = process.argv[2]

  if (mode === 'http') {
    const port = parseInt(process.env.MCP_HTTP_PORT || '3010', 10)
    await startHttpServer(port)
  } else {
    // 默认 stdio 模式（本地 Claude Code 使用）
    const transport = new StdioServerTransport()
    const server = createServer()
    await server.connect(transport)
    console.error('[info-hub-mcp] 已启动，stdio 模式')
  }
}

main().catch((e) => {
  console.error('[info-hub-mcp] 启动失败:', e)
  process.exit(1)
})
