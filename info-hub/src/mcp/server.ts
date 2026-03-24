import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import fs from 'fs'
import path from 'path'
import http from 'http'
import { URL } from 'url'

// ─── 文档源配置 ───────────────────────────────────────────────────────────────

interface DocSource {
  id: string
  name: string
  path: string
  enabled: boolean
}

const docSources: DocSource[] = [
  {
    id: 'obsidian',
    name: 'Obsidian 知识库',
    path: 'F:/docs/obsidian/',
    enabled: true,
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

function scanDir(sourceId: string, dirPath?: string): FileItem[] {
  const source = resolveSource(sourceId)
  if (!source) return []

  const basePath = dirPath ? path.join(source.path, dirPath) : source.path
  if (!fs.existsSync(basePath)) return []

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
  } catch {
    /* ignore */
  }

  return items.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

function readFile(sourceId: string, filePath: string): string | null {
  const source = resolveSource(sourceId)
  if (!source) return null
  const fullPath = path.join(source.path, filePath)
  if (!fs.existsSync(fullPath)) return null
  try {
    return fs.readFileSync(fullPath, 'utf-8')
  } catch {
    return null
  }
}

function writeFile(
  sourceId: string,
  filePath: string,
  content: string,
): { success: boolean; path: string; error?: string } {
  const source = resolveSource(sourceId)
  if (!source) return { success: false, path: '', error: `未知文档源: ${sourceId}` }

  const fullPath = path.normalize(path.join(source.path, filePath))
  if (!fullPath.startsWith(path.normalize(source.path))) {
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
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(fullPath, content, 'utf-8')
    return { success: true, path: fullPath }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return { success: false, path: fullPath, error: msg }
  }
}

function searchFiles(
  sourceId: string,
  query: string,
  dirPath?: string,
): FileItem[] {
  const all = scanDir(sourceId, dirPath)
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
    results.push(...searchFiles(sourceId, query, sub))
  }

  return results
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
      description: '在 Obsidian 知识库中按文件名搜索文件',
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
          const result = writeFile(source, filePath, content)
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

// 简单的 token 认证中间件
const AUTH_TOKEN = process.env.MCP_AUTH_TOKEN || 'info-hub-dev-token'

function authMiddleware(req: http.IncomingMessage): boolean {
  // Bearer token: Authorization: Bearer <token>
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7) === AUTH_TOKEN
  }
  // Query param: ?token=xxx
  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  return url.searchParams.get('token') === AUTH_TOKEN
}

async function startHttpServer(port: number) {
  const server = createServer()

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

      let body = ''
      for await (const chunk of req) {
        body += chunk
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
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
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
      if (!authMiddleware(req)) {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Unauthorized' }))
        return
      }

      const apiPath = pathname.slice(5) // 去掉 /api/（pathname 以 / 开头）
      const source = url.searchParams.get('source') || 'obsidian'
      const filePath = url.searchParams.get('path') || ''

      try {
        let result: string | null = null
        let statusCode = 200

        switch (apiPath) {
          case 'scan': {
            const items = scanDir(source, filePath || undefined)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(items))
            return
          }
          case 'read': {
            if (!filePath) throw new Error('path 参数必填')
            result = readFile(source, filePath)
            if (result === null) {
              statusCode = 404
              result = `文件不存在: ${filePath}`
            }
            break
          }
          case 'write': {
            if (!filePath) throw new Error('path 参数必填')
            let body2 = ''
            for await (const chunk of req) {
              body2 += chunk
            }
            const payload = JSON.parse(body2)
            const writeResult = writeFile(source, filePath, payload.content || '')
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
            const items = searchFiles(source, query, filePath || undefined)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(items))
            return
          }
          default:
            statusCode = 404
            result = `未知端点: ${apiPath}`
        }

        res.writeHead(statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        })
        res.end(JSON.stringify(result))
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        res.writeHead(400, { 'Content-Type': 'application/json' })
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
      if (fs.existsSync(staticPath)) {
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] })
        res.end(fs.readFileSync(staticPath))
        return
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  })

  httpServer.listen(port, '0.0.0.0', () => {
    console.error(`[info-hub-mcp] HTTP 服务已启动: http://0.0.0.0:${port}`)
    console.error(`[info-hub-mcp] 健康检查: http://0.0.0.0:${port}/health`)
    console.error(`[info-hub-mcp] MCP JSON-RPC: http://0.0.0.0:${port}/mcp?token=${AUTH_TOKEN}`)
    console.error(`[info-hub-mcp] REST API:     http://0.0.0.0:${port}/api/scan?token=${AUTH_TOKEN}`)
  })

  return httpServer
}

// 手动处理工具调用（HTTP 模式下绕过 MCP SDK 的 transport）
async function handleToolCall(name: string, args: Record<string, unknown>) {
  switch (name) {
    case 'obsidian_scan': {
      const source = (args.source as string) || 'obsidian'
      const dirPath = args.path as string | undefined
      return { content: [{ type: 'text', text: JSON.stringify(scanDir(source, dirPath), null, 2) }] }
    }
    case 'obsidian_read': {
      const source = (args.source as string) || 'obsidian'
      const filePath = args.path as string
      if (!filePath) return { content: [{ type: 'text', text: '错误: path 参数必填' }], isError: true }
      const content = readFile(source, filePath)
      if (content === null) return { content: [{ type: 'text', text: `文件不存在: ${filePath}` }], isError: true }
      return { content: [{ type: 'text', text: content }] }
    }
    case 'obsidian_write': {
      const source = (args.source as string) || 'obsidian'
      const filePath = args.path as string
      const content = args.content as string
      if (!filePath || content === undefined) return { content: [{ type: 'text', text: '错误: path 和 content 参数必填' }], isError: true }
      const result = writeFile(source, filePath, content)
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
      return { content: [{ type: 'text', text: JSON.stringify(searchFiles(source, query, dirPath), null, 2) }] }
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
  <strong>认证方式：</strong>所有需要认证的请求都需要带上 <code>?token=你的MCP_AUTH_TOKEN</code> 查询参数，或 <code>Authorization: Bearer 你的MCP_AUTH_TOKEN</code> 请求头。
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
<pre>curl "http://localhost:3010/api/scan?token=info-hub-dev-token"

curl "http://localhost:3010/api/read?source=obsidian&path=inbox/test.md&token=info-hub-dev-token"

curl -X POST "http://localhost:3010/api/write?source=obsidian&path=inbox/test.md&token=info-hub-dev-token" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"# Hello\\n\\nworld"}'</pre>

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
