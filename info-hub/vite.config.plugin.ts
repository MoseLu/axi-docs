import type { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Anthropic from '@anthropic-ai/sdk'
import {
  getGlobalKnowledgeGraph,
  getKnowledgeCatalog,
  getKnowledgeGraph,
  getKnowledgeTags,
  listKnowledgeSources,
  readKnowledgeFile,
  scanKnowledgeSource,
  searchKnowledge,
} from './src/lib/knowledgeBase'

const API_PREFIXES = ['/docs/api', '/api']

function matchesApiPath(pathname: string, suffix: string): boolean {
  return API_PREFIXES.some((prefix) => pathname === `${prefix}${suffix}`)
}

async function analyzeDocument(content: string, fileName: string) {
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

    const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
    const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    return JSON.parse(clean)
  } catch (error) {
    return {
      summary: '',
      keyPoints: [],
      concepts: [],
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

function sendJson(res: NodeJS.WritableStream & { setHeader: (name: string, value: string) => void; end: (content?: string) => void }, payload: unknown) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(JSON.stringify(payload))
}

async function buildFileInfo(sourceId: string, filePath: string) {
  const source = listKnowledgeSources().find((item) => item.id === sourceId && item.type === 'local')
  if (!source) return null
  const fullPath = path.join(source.path, filePath)
  if (!fs.existsSync(fullPath)) return null

  const raw = await fs.promises.readFile(fullPath, 'utf-8')
  const parsed = matter(raw)
  const stat = await fs.promises.stat(fullPath)
  return {
    id: `${sourceId}:${filePath}`,
    name: path.basename(filePath),
    path: fullPath,
    relativePath: filePath,
    type: 'file',
    extension: path.extname(filePath),
    lastModified: stat.mtime.toISOString(),
    sourceId,
    tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : [],
    frontmatter: parsed.data,
  }
}

export function localDocsPlugin(): Plugin {
  return {
    name: 'vite-plugin-local-docs',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void (async () => {
          const url = new URL(req.url || '/', 'http://localhost')
          const pathname = url.pathname

          if (matchesApiPath(pathname, '/sources')) {
            sendJson(res, listKnowledgeSources().map((source) => ({
              id: source.id,
              name: source.name,
              description: source.description,
              type: source.type,
              enabled: source.enabled,
              icon: source.icon,
            })))
            return
          }

          if (matchesApiPath(pathname, '/scan')) {
            const sourceId = url.searchParams.get('source') || 'obsidian'
            const dirPath = url.searchParams.get('path') || undefined
            const filterTag = url.searchParams.get('tag')
            sendJson(res, await scanKnowledgeSource(sourceId, dirPath, filterTag))
            return
          }

          if (matchesApiPath(pathname, '/file')) {
            const sourceId = url.searchParams.get('source') || 'obsidian'
            const filePath = url.searchParams.get('path') || ''
            const content = await readKnowledgeFile(sourceId, filePath)
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.setHeader('Access-Control-Allow-Origin', '*')
            if (content === null) {
              res.statusCode = 404
              res.end('File not found')
              return
            }
            res.end(content)
            return
          }

          if (matchesApiPath(pathname, '/tags')) {
            const sourceId = url.searchParams.get('source') || 'obsidian'
            sendJson(res, await getKnowledgeTags(sourceId))
            return
          }

          if (matchesApiPath(pathname, '/search')) {
            const sourceId = url.searchParams.get('source') || 'obsidian'
            const query = url.searchParams.get('query') || url.searchParams.get('q') || ''
            const filterTag = url.searchParams.get('tag')
            if (!query.trim()) {
              sendJson(res, [])
              return
            }
            sendJson(res, await searchKnowledge(sourceId, query, filterTag))
            return
          }

          if (matchesApiPath(pathname, '/graph')) {
            const sourceId = url.searchParams.get('source') || 'obsidian'
            const filePath = url.searchParams.get('path') || ''
            if (!filePath) {
              res.statusCode = 400
              sendJson(res, { error: 'path required' })
              return
            }
            sendJson(res, await getKnowledgeGraph(sourceId, filePath))
            return
          }

          if (matchesApiPath(pathname, '/global-graph')) {
            const sourceId = url.searchParams.get('source') || 'obsidian'
            sendJson(res, await getGlobalKnowledgeGraph(sourceId))
            return
          }

          if (matchesApiPath(pathname, '/catalog')) {
            const sourceId = url.searchParams.get('source') || 'obsidian'
            sendJson(res, await getKnowledgeCatalog(sourceId))
            return
          }

          if (matchesApiPath(pathname, '/ai/analyze')) {
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Access-Control-Allow-Origin', '*')
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
              res.end()
              return
            }
            let body = ''
            req.on('data', (chunk) => { body += chunk })
            req.on('end', async () => {
              try {
                const { content, fileName } = JSON.parse(body)
                res.end(JSON.stringify(await analyzeDocument(content || '', fileName || '')))
              } catch (error) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }))
              }
            })
            return
          }

          if (matchesApiPath(pathname, '/file-info')) {
            const sourceId = url.searchParams.get('source') || 'obsidian'
            const filePath = url.searchParams.get('path') || ''
            const info = await buildFileInfo(sourceId, filePath)
            if (!info) {
              res.statusCode = 404
              sendJson(res, { error: 'File not found' })
              return
            }
            sendJson(res, info)
            return
          }

          next()
        })().catch((error) => {
          res.statusCode = 500
          sendJson(res, { error: error instanceof Error ? error.message : String(error) })
        })
      })
    },
  }
}
