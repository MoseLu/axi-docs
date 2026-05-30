import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  classifyKnowledgeCategories,
  getKnowledgeCategoryMeta,
  getKnowledgeCategoryQueryHints,
  KNOWLEDGE_CATEGORY_ORDER,
} from '../config/knowledgeRules'
import { normalizeStringArray, runKnowledgeIntake } from './knowledgeIntake'
import {
  DocSource,
  FileItem,
  Frontmatter,
  GraphData,
  KnowledgeCatalog,
  KnowledgeCatalogItem,
  SearchResult,
  StaticKnowledgeDocument,
} from '../types'

const DEFAULT_OBSIDIAN_PATH = 'F:/docs/obsidian/'
const DEFAULT_BLINKO_URL = 'http://localhost:1111'
const SUPPORTED_EXTENSIONS = new Set(['.md', '.markdown'])
const EXCLUDED_NAMES = new Set(['.git', 'node_modules', '.obsidian', '.trash', '.DS_Store'])
const INLINE_TAG_REGEX = /(^|\s)#([\p{L}\p{N}_/-]+)/gu
const WIKILINK_REGEX = /\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g

type SourceMap = Map<string, DocSource>

type ParsedDocument = KnowledgeCatalogItem & {
  raw: string
  body: string
  frontmatter: Frontmatter
  aliases: string[]
  sourceTags: string[]
  intakeIssues: string[]
}

type IndexedLocalFile = {
  relativePath: string
  fullPath: string
  mtimeMs: number
  document: ParsedDocument
}

type LocalSourceIndex = {
  sourceId: string
  rootPath: string
  builtAt: string
  files: Map<string, IndexedLocalFile>
  documents: ParsedDocument[]
  rejected: Array<{ path: string; issues: string[] }>
  tags: Array<{ name: string; count: number }>
  byPath: Map<string, ParsedDocument>
  byStem: Map<string, ParsedDocument>
}

type LocalFileEntry = {
  relativePath: string
  fullPath: string
  stat: fs.Stats
}

const localSourceIndexCache = new Map<string, LocalSourceIndex>()

function parseExtraSources(): DocSource[] {
  const raw = process.env.AXI_DOCS_EXTRA_SOURCES_JSON?.trim()
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed
      .flatMap((entry) => {
        if (!entry || typeof entry !== 'object') return []

        const source = entry as Record<string, unknown>
        const id = typeof source.id === 'string' ? source.id.trim() : ''
        const name = typeof source.name === 'string' ? source.name.trim() : ''
        const type = source.type === 'api' ? 'api' : source.type === 'local' ? 'local' : null
        if (!id || !name || !type) return []

        const normalized: DocSource = {
          id,
          name,
          description: typeof source.description === 'string' ? source.description : undefined,
          path: typeof source.path === 'string' ? source.path : '',
          enabled: source.enabled !== false,
          type,
          apiUrl: typeof source.apiUrl === 'string' ? source.apiUrl : undefined,
          apiToken: typeof source.apiToken === 'string' ? source.apiToken : undefined,
          icon: source.icon === 'obsidian' || source.icon === 'blinko' || source.icon === 'folder'
            ? source.icon
            : 'folder',
        }

        if (normalized.type === 'local' && !normalized.path.trim()) return []
        if (normalized.type === 'api' && !normalized.apiUrl?.trim()) return []
        return [normalized]
      })
  } catch {
    return []
  }
}

function isSupportedFile(filename: string): boolean {
  return SUPPORTED_EXTENSIONS.has(path.extname(filename).toLowerCase())
}

function isExcludedName(name: string): boolean {
  return EXCLUDED_NAMES.has(name) || name.startsWith('.')
}

function normalizeSlashes(inputPath: string): string {
  return inputPath.replace(/\\/g, '/')
}

function normalizeDate(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString()
  return undefined
}

function parseLooseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  if (!raw.startsWith('---')) {
    return { data: {}, content: raw }
  }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, content: raw }
  }

  const yaml = raw.slice(4, end)
  const content = raw.slice(end + 4).trimStart()
  const data: Frontmatter = {}

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) continue

    const key = trimmed.slice(0, colonIndex).trim()
    const value = trimmed.slice(colonIndex + 1).trim()

    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((entry) => entry.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
      continue
    }

    data[key] = value.replace(/^["']|["']$/g, '')
  }

  return { data, content }
}

function parseMarkdownDocument(raw: string): { data: Frontmatter; content: string } {
  try {
    return matter(raw)
  } catch {
    return parseLooseFrontmatter(raw)
  }
}

function extractInlineTags(markdown: string): string[] {
  const body = markdown.startsWith('---')
    ? markdown.replace(/^---\n[\s\S]*?\n---\n?/, '')
    : markdown
  const tags = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = INLINE_TAG_REGEX.exec(body)) !== null) {
    const tag = match[2].trim().toLowerCase()
    if (tag && !tag.endsWith('.md')) {
      tags.add(tag)
    }
  }

  return [...tags]
}

function extractRawTitle(frontmatter: Frontmatter, body: string, fallbackName: string): string {
  if (typeof frontmatter.title === 'string' && frontmatter.title.trim()) {
    return frontmatter.title.trim()
  }
  const firstAlias = normalizeStringArray(frontmatter.aliases)[0]
  if (firstAlias) return firstAlias
  const headingMatch = body.match(/^#\s+(.+)$/m)
  if (headingMatch?.[1]) {
    return headingMatch[1].trim().replace(/\*\*|__|\*|_|`/g, '')
  }
  return fallbackName
}

function extractDescription(frontmatter: Frontmatter, body: string): string | undefined {
  if (typeof frontmatter.description === 'string' && frontmatter.description.trim()) {
    return frontmatter.description.trim()
  }
  const plain = body
    .replace(/^#.+$/gm, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, '$2$1')
    .replace(/[#>*`_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!plain) return undefined
  return plain.slice(0, 140)
}

function extractTechStack(frontmatter: Frontmatter, tags: string[]): string[] {
  const techValues = [
    ...normalizeStringArray(frontmatter.tech),
    ...normalizeStringArray(frontmatter['tech-stack']),
  ]
  return [...new Set([...techValues, ...tags.filter((tag) => /^(react|vue|next|node|express|nestjs|postgresql|postgres|mysql|redis|vite|tailwind|typescript|javascript|go|java|python|prisma)$/i.test(tag))])]
}

function createSourceMap(): SourceMap {
  const sources: DocSource[] = [
    {
      id: 'obsidian',
      name: 'Obsidian 知识库',
      description: '长期沉淀的结构化知识与项目文档',
      path: process.env.OBSIDIAN_PATH || DEFAULT_OBSIDIAN_PATH,
      enabled: true,
      type: 'local',
      icon: 'obsidian',
    },
    {
      id: 'blinko',
      name: 'Blinko 闪念',
      description: '短期灵感、碎片记录与快速捕捉',
      path: '',
      enabled: true,
      type: 'api',
      apiUrl: process.env.BLINKO_URL || DEFAULT_BLINKO_URL,
      apiToken: process.env.BLINKO_TOKEN || '',
      icon: 'blinko',
    },
    ...parseExtraSources(),
  ]
  const deduped = new Map<string, DocSource>()
  for (const source of sources) {
    if (!source.enabled) continue
    deduped.set(source.id, source)
  }
  return deduped
}

export function listKnowledgeSources(): DocSource[] {
  return [...createSourceMap().values()]
}

function getSource(sourceId: string): DocSource | null {
  return createSourceMap().get(sourceId) ?? null
}

function resolveLocalPath(source: DocSource, relativePath = ''): string | null {
  if (source.type !== 'local') return null
  if (relativePath.includes('..')) return null
  const sourceRoot = path.normalize(source.path)
  const fullPath = path.normalize(path.join(sourceRoot, relativePath))
  const rel = path.relative(sourceRoot, fullPath)
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null
  return fullPath
}

async function parseLocalDocumentFromFile(
  source: DocSource,
  relativePath: string,
  fullPath: string,
  stat: fs.Stats,
): Promise<ParsedDocument | null> {
  if (!fs.existsSync(fullPath)) return null

  const raw = await fs.promises.readFile(fullPath, 'utf-8')
  const parsed = parseMarkdownDocument(raw)
  const frontmatter = parsed.data as Frontmatter
  const body = parsed.content
  const fileName = path.basename(relativePath).replace(/\.(md|markdown)$/i, '')
  const sourceTags = [...new Set([...normalizeStringArray(frontmatter.tags), ...extractInlineTags(raw)])]
  const aliases = normalizeStringArray(frontmatter.aliases)
  const rawTitle = extractRawTitle(frontmatter, body, fileName)
  const intake = runKnowledgeIntake({ ...frontmatter, tags: sourceTags })
  if (!intake.accepted || !intake.graphTitle) {
    return null
  }
  const techStack = extractTechStack(frontmatter, sourceTags)
  const item: ParsedDocument = {
    sourceId: source.id,
    path: normalizeSlashes(relativePath),
    name: fileName,
    title: intake.graphTitle,
    rawTitle,
    description: extractDescription(frontmatter, body),
    docType: typeof frontmatter.type === 'string' ? frontmatter.type : undefined,
    status: typeof frontmatter.status === 'string' ? frontmatter.status : undefined,
    tags: intake.graphTags,
    rawTags: sourceTags,
    categories: [],
    techStack,
    updated: normalizeDate(frontmatter.modified) || normalizeDate(frontmatter.updated) || stat.mtime.toISOString(),
    graphTitle: intake.graphTitle,
    raw,
    body,
    frontmatter,
    aliases: [...new Set([rawTitle, intake.graphTitle, ...aliases].filter(Boolean))],
    sourceTags,
    intakeIssues: intake.issues.map((issue) => issue.message),
  }
  item.categories = classifyKnowledgeCategories({
    ...item,
    title: rawTitle,
    tags: sourceTags,
  })
  return item
}

async function collectLocalMarkdownFiles(sourceRoot: string): Promise<LocalFileEntry[]> {
  const files: LocalFileEntry[] = []

  async function walk(dirPath: string, relativeDir = ''): Promise<void> {
    let entries: fs.Dirent[]
    try {
      entries = await fs.promises.readdir(dirPath, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      if (isExcludedName(entry.name)) continue
      const fullPath = path.join(dirPath, entry.name)
      const nextRelative = normalizeSlashes(relativeDir ? path.join(relativeDir, entry.name) : entry.name)

      if (entry.isDirectory()) {
        if (entry.name === '_assets' || entry.name === '_templates') continue
        await walk(fullPath, nextRelative)
        continue
      }

      if (!entry.isFile() || !isSupportedFile(entry.name)) continue
      const stat = await fs.promises.stat(fullPath)
      files.push({
        relativePath: nextRelative,
        fullPath,
        stat,
      })
    }
  }

  await walk(sourceRoot)
  return files.sort((left, right) => left.relativePath.localeCompare(right.relativePath, 'zh-CN'))
}

function buildLocalSourceIndex(
  source: DocSource,
  rootPath: string,
  files: Map<string, IndexedLocalFile>,
  documents: ParsedDocument[],
  rejected: Array<{ path: string; issues: string[] }>,
): LocalSourceIndex {
  const byPath = new Map<string, ParsedDocument>()
  const byStem = new Map<string, ParsedDocument>()
  const tagCounts = new Map<string, number>()

  for (const document of documents) {
    byPath.set(document.path, document)
    for (const stem of [document.name, document.rawTitle || '', document.title, ...document.aliases]) {
      const normalizedStem = stem.trim().toLowerCase()
      if (normalizedStem) {
        byStem.set(normalizedStem, document)
      }
    }
    for (const tag of document.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    }
  }

  const tags = [...tagCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, 'zh-CN'))

  return {
    sourceId: source.id,
    rootPath,
    builtAt: new Date().toISOString(),
    files,
    documents,
    rejected,
    tags,
    byPath,
    byStem,
  }
}

async function getLocalSourceIndex(source: DocSource): Promise<LocalSourceIndex> {
  const rootPath = path.normalize(source.path)
  const cachedIndex = localSourceIndexCache.get(source.id)
  const previousFiles = cachedIndex && cachedIndex.rootPath === rootPath
    ? cachedIndex.files
    : new Map<string, IndexedLocalFile>()

  const currentFiles = await collectLocalMarkdownFiles(rootPath)
  const nextFiles = new Map<string, IndexedLocalFile>()
  const documents: ParsedDocument[] = []
  const rejected: Array<{ path: string; issues: string[] }> = []

  for (const file of currentFiles) {
    const cachedFile = previousFiles.get(file.relativePath)
    let indexedFile = cachedFile

    if (!cachedFile || cachedFile.fullPath !== file.fullPath || cachedFile.mtimeMs !== file.stat.mtimeMs) {
      const raw = await fs.promises.readFile(file.fullPath, 'utf-8')
      const parsed = parseMarkdownDocument(raw)
      const frontmatter = parsed.data as Frontmatter
      const sourceTags = [...new Set([...normalizeStringArray(frontmatter.tags), ...extractInlineTags(raw)])]
      const intake = runKnowledgeIntake({ ...frontmatter, tags: sourceTags })
      if (!intake.accepted) {
        rejected.push({
          path: file.relativePath,
          issues: intake.issues.map((issue) => issue.message),
        })
        continue
      }
      const document = await parseLocalDocumentFromFile(source, file.relativePath, file.fullPath, file.stat)
      if (!document) {
        rejected.push({
          path: file.relativePath,
          issues: ['IQC 未通过，文档未入库。'],
        })
        continue
      }
      indexedFile = {
        relativePath: file.relativePath,
        fullPath: file.fullPath,
        mtimeMs: file.stat.mtimeMs,
        document,
      }
    }

    if (!indexedFile) continue
    nextFiles.set(file.relativePath, indexedFile)
    documents.push(indexedFile.document)
  }

  documents.sort((left, right) => left.path.localeCompare(right.path, 'zh-CN'))

  const index = buildLocalSourceIndex(source, rootPath, nextFiles, documents, rejected)
  localSourceIndexCache.set(source.id, index)
  return index
}

function invalidateLocalSourceIndex(sourceId: string, relativePath?: string): void {
  if (!relativePath) {
    localSourceIndexCache.delete(sourceId)
    return
  }

  const cachedIndex = localSourceIndexCache.get(sourceId)
  if (!cachedIndex) return
  cachedIndex.files.delete(normalizeSlashes(relativePath))
}

export function __clearKnowledgeBaseCacheForTests(): void {
  localSourceIndexCache.clear()
}

function createSnippet(body: string, query: string): string {
  if (!body.trim()) return ''
  const normalizedBody = body.replace(/\s+/g, ' ')
  const lowerBody = normalizedBody.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerBody.indexOf(lowerQuery)
  if (index === -1) return normalizedBody.slice(0, 160)
  const start = Math.max(0, index - 70)
  const end = Math.min(normalizedBody.length, index + query.length + 110)
  return `${start > 0 ? '…' : ''}${normalizedBody.slice(start, end)}${end < normalizedBody.length ? '…' : ''}`
}

function matchesQuery(text: string, tokens: string[]): boolean {
  const lower = text.toLowerCase()
  return tokens.every((token) => lower.includes(token))
}

async function blinkoRequest<T>(source: DocSource, urlPath: string, method: string, body?: unknown): Promise<T> {
  const baseUrl = source.apiUrl || DEFAULT_BLINKO_URL
  const url = new URL(urlPath, baseUrl)
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(source.apiToken ? { Authorization: `Bearer ${source.apiToken}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
  const text = await response.text()
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(`Invalid JSON from Blinko: ${text.slice(0, 160)}`)
  }
}

type BlinkoNote = {
  id: number
  content: string
  type: 0 | 1
  tags?: string[]
  createdAt: string
  updatedAt: string
}

async function listBlinkoNotes(source: DocSource): Promise<BlinkoNote[]> {
  const result = await blinkoRequest<BlinkoNote[] | { message?: string }>(
    source,
    '/api/v1/note/list',
    'POST',
    { page: 1, size: 200, orderBy: 'desc', type: -1, isRecycle: false },
  )
  return Array.isArray(result) ? result : []
}

export async function scanKnowledgeSource(sourceId: string, dirPath?: string, filterTag?: string | null) {
  const source = getSource(sourceId)
  if (!source) return []

  if (source.type === 'api') {
    const notes = await listBlinkoNotes(source)
    return notes
      .filter((note) => !filterTag || (note.tags || []).includes(filterTag))
      .map((note) => ({
        id: `${source.id}:${note.id}`,
        name: note.content.split('\n')[0].slice(0, 60) || `Blinko #${note.id}`,
        path: String(note.id),
        relativePath: String(note.id),
        type: 'file' as const,
        extension: '.md',
        lastModified: note.updatedAt || note.createdAt,
        sourceId: source.id,
        tags: note.tags || [],
        blinkoData: note,
      }))
  }

  const basePath = resolveLocalPath(source, dirPath || '')
  if (!basePath || !fs.existsSync(basePath)) return []

  const index = await getLocalSourceIndex(source)

  let entries: fs.Dirent[]
  try {
    entries = await fs.promises.readdir(basePath, { withFileTypes: true })
  } catch {
    return []
  }

  const items = await Promise.all(entries.map(async (entry) => {
    if (isExcludedName(entry.name)) return null
    const fullPath = path.join(basePath, entry.name)
    const relativePath = normalizeSlashes(dirPath ? path.join(dirPath, entry.name) : entry.name)
    const stat = await fs.promises.stat(fullPath)

    if (entry.isDirectory()) {
      return {
        id: `${source.id}:${relativePath}`,
        name: entry.name,
        path: fullPath,
        relativePath,
        type: 'directory' as const,
        extension: '',
        lastModified: stat.mtime.toISOString(),
        sourceId: source.id,
      }
    }

    if (!entry.isFile() || !isSupportedFile(entry.name)) return null
    const parsed = index.byPath.get(relativePath)
    if (!parsed) return null
    if (filterTag && !parsed.tags.includes(filterTag)) return null
    return {
      id: `${source.id}:${relativePath}`,
      name: entry.name,
      path: fullPath,
      relativePath,
      type: 'file' as const,
      extension: path.extname(entry.name),
      lastModified: parsed.updated || stat.mtime.toISOString(),
      sourceId: source.id,
      tags: parsed.tags,
      rawTags: parsed.rawTags,
      graphTitle: parsed.graphTitle,
      frontmatter: parsed.frontmatter,
    }
  }))

  return items
    .filter(Boolean)
    .sort((left, right) => {
      if (left!.type !== right!.type) return left!.type === 'directory' ? -1 : 1
      return left!.name.localeCompare(right!.name, 'zh-CN')
    })
}

export async function readKnowledgeFile(sourceId: string, filePath: string): Promise<string | null> {
  const source = getSource(sourceId)
  if (!source) return null

  if (source.type === 'api') {
    if (!filePath) return null
    const detail = await blinkoRequest<{ content?: string; contentText?: string }>(
      source,
      '/api/v1/note/detail',
      'POST',
      { id: Number(filePath) },
    )
    return detail.content || detail.contentText || null
  }

  const fullPath = resolveLocalPath(source, filePath)
  if (!fullPath || !fs.existsSync(fullPath) || !isSupportedFile(fullPath)) return null
  try {
    const index = await getLocalSourceIndex(source)
    if (!index.byPath.has(normalizeSlashes(filePath))) return null
    return await fs.promises.readFile(fullPath, 'utf-8')
  } catch {
    return null
  }
}

export async function writeKnowledgeFile(sourceId: string, filePath: string, content: string) {
  const source = getSource(sourceId)
  if (!source) return { success: false, path: '', error: `未知文档源: ${sourceId}` }
  if (source.type !== 'local') return { success: false, path: '', error: '当前文档源不支持写入' }
  if (!isSupportedFile(filePath)) {
    return { success: false, path: filePath, error: '仅支持写入 Markdown 文件' }
  }

  const fullPath = resolveLocalPath(source, filePath)
  if (!fullPath) {
    return { success: false, path: filePath, error: '禁止路径穿越' }
  }

  try {
    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.promises.writeFile(fullPath, content, 'utf-8')
    invalidateLocalSourceIndex(source.id, filePath)
    return { success: true, path: fullPath }
  } catch (error) {
    return {
      success: false,
      path: fullPath,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function getKnowledgeTags(sourceId: string): Promise<Array<{ name: string; count: number }>> {
  const source = getSource(sourceId)
  if (!source) return []

  if (source.type === 'api') {
    const notes = await listBlinkoNotes(source)
    const counts = new Map<string, number>()
    for (const note of notes) {
      for (const tag of note.tags || []) {
        counts.set(tag, (counts.get(tag) || 0) + 1)
      }
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((left, right) => right.count - left.count)
  }

  const index = await getLocalSourceIndex(source)
  return index.tags
}

export async function searchKnowledge(sourceId: string, query: string, filterTag?: string | null): Promise<SearchResult[]> {
  const source = getSource(sourceId)
  const normalizedQuery = query.trim().toLowerCase()
  if (!source || !normalizedQuery) return []

  if (source.type === 'api') {
    const notes = await listBlinkoNotes(source)
    return notes
      .filter((note) => note.content.toLowerCase().includes(normalizedQuery))
      .filter((note) => !filterTag || (note.tags || []).includes(filterTag))
      .slice(0, 30)
      .map((note) => ({
        sourceId: source.id,
        path: String(note.id),
        name: note.content.split('\n')[0].slice(0, 60) || `Blinko #${note.id}`,
        title: note.content.split('\n')[0].slice(0, 60) || `Blinko #${note.id}`,
        type: 'blinko',
        snippet: createSnippet(note.content, query),
        matches: [],
        score: 10,
        tags: note.tags || [],
        docType: note.type === 0 ? 'flash-note' : 'note',
        categories: ['resources'],
        matchedBy: ['content'],
      }))
  }

  const index = await getLocalSourceIndex(source)
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean).slice(0, 8)
  const results: SearchResult[] = []

  for (const document of index.documents) {
    if (filterTag && !document.tags.includes(filterTag)) continue

    const matchedBy: string[] = []
    let score = 0
    const pathLower = document.path.toLowerCase()
    const titleLower = document.title.toLowerCase()
    const rawTitleLower = (document.rawTitle || '').toLowerCase()
    const descriptionLower = (document.description || '').toLowerCase()
    const bodyLower = document.body.toLowerCase()

    if (matchesQuery(titleLower, queryTokens)) {
      matchedBy.push('title')
      score += 20
    }
    if (rawTitleLower && matchesQuery(rawTitleLower, queryTokens)) {
      matchedBy.push('raw-title')
      score += 10
    }
    if (matchesQuery(pathLower, queryTokens)) {
      matchedBy.push('path')
      score += 12
    }
    if (document.tags.some((tag) => matchesQuery(tag.toLowerCase(), queryTokens))) {
      matchedBy.push('tags')
      score += 10
    }
    if (document.sourceTags.some((tag) => matchesQuery(tag.toLowerCase(), queryTokens))) {
      matchedBy.push('raw-tags')
      score += 8
    }
    if (document.aliases.some((alias) => matchesQuery(alias.toLowerCase(), queryTokens))) {
      matchedBy.push('aliases')
      score += 8
    }
    if (document.categories.some((category) => getKnowledgeCategoryQueryHints(category).some((hint) => normalizedQuery.includes(hint.toLowerCase())))) {
      matchedBy.push('category')
      score += 9
    }
    if (matchesQuery(descriptionLower, queryTokens)) {
      matchedBy.push('description')
      score += 5
    }
    if (matchesQuery(bodyLower, queryTokens)) {
      matchedBy.push('content')
      score += 6
    }

    if (matchedBy.length === 0) continue

    const contentFrequency = bodyLower.split(normalizedQuery).length - 1
    score += Math.min(contentFrequency, 8)

    results.push({
      sourceId: source.id,
      path: document.path,
      name: document.name,
      title: document.title,
      rawTitle: document.rawTitle,
      description: document.description,
      type: 'file',
      snippet: createSnippet(document.body, query),
      matches: [],
      score,
      tags: document.tags,
      rawTags: document.sourceTags,
      docType: document.docType,
      categories: document.categories,
      matchedBy,
    })
  }

  return results.sort((left, right) => right.score - left.score).slice(0, 30)
}

function sortCatalogItems(items: KnowledgeCatalogItem[]): KnowledgeCatalogItem[] {
  return [...items].sort((left, right) => {
    const leftDate = Date.parse(left.updated || '')
    const rightDate = Date.parse(right.updated || '')
    if (!Number.isNaN(leftDate) && !Number.isNaN(rightDate) && rightDate !== leftDate) {
      return rightDate - leftDate
    }
    return left.title.localeCompare(right.title, 'zh-CN')
  })
}

export async function getKnowledgeCatalog(sourceId: string): Promise<KnowledgeCatalog> {
  const source = getSource(sourceId)
  if (!source) {
    return {
      sourceId,
      totalDocs: 0,
      totalTags: 0,
      generatedAt: new Date().toISOString(),
      topTags: [],
      recentDocs: [],
      sections: [],
    }
  }

  if (source.type === 'api') {
    const notes = await listBlinkoNotes(source)
    const items: KnowledgeCatalogItem[] = notes.map((note) => ({
      sourceId: source.id,
      path: String(note.id),
      name: `Blinko #${note.id}`,
      title: note.content.split('\n')[0].slice(0, 60) || `Blinko #${note.id}`,
      description: note.content.replace(/\s+/g, ' ').slice(0, 120),
      docType: note.type === 0 ? 'flash-note' : 'note',
      tags: note.tags || [],
      categories: ['resources'],
      techStack: [],
      updated: note.updatedAt || note.createdAt,
    }))
    return {
      sourceId: source.id,
      totalDocs: items.length,
      totalTags: new Set(items.flatMap((item) => item.tags)).size,
      generatedAt: new Date().toISOString(),
      topTags: await getKnowledgeTags(source.id),
      recentDocs: sortCatalogItems(items).slice(0, 8),
      sections: [
        {
          key: 'resources',
          title: 'Blinko 快速记录',
          description: '近期闪念和碎片内容，适合先做模糊回忆检索。',
          count: items.length,
          items: sortCatalogItems(items),
        },
      ],
    }
  }

  const index = await getLocalSourceIndex(source)
  const sections = KNOWLEDGE_CATEGORY_ORDER
    .map((key) => {
      const items = sortCatalogItems(index.documents.filter((document) => document.categories.includes(key)))
      if (items.length === 0) return null
      const meta = getKnowledgeCategoryMeta(key)
      return {
        key,
        title: meta.title,
        description: meta.description,
        count: items.length,
        items,
      }
    })
    .filter(Boolean) as KnowledgeCatalog['sections']

  return {
    sourceId: source.id,
    totalDocs: index.documents.length,
    totalTags: index.tags.length,
    generatedAt: index.builtAt,
    topTags: index.tags.slice(0, 20),
    recentDocs: sortCatalogItems(index.documents).slice(0, 8),
    sections,
  }
}

export async function getKnowledgeDocuments(sourceId: string): Promise<StaticKnowledgeDocument[]> {
  const source = getSource(sourceId)
  if (!source || source.type !== 'local') return []

  const index = await getLocalSourceIndex(source)
  return index.documents.map((document) => ({
    sourceId: document.sourceId,
    path: document.path,
    name: document.name,
    title: document.title,
    rawTitle: document.rawTitle,
    description: document.description,
    docType: document.docType,
    status: document.status,
    tags: [...document.tags],
    rawTags: [...document.sourceTags],
    categories: [...document.categories],
    techStack: [...document.techStack],
    updated: document.updated,
    graphTitle: document.graphTitle,
    content: document.raw,
    frontmatter: document.frontmatter,
    aliases: [...document.aliases],
    sourceTags: [...document.sourceTags],
  }))
}

export async function getKnowledgeDirectoryIndex(sourceId: string): Promise<Record<string, FileItem[]>> {
  const source = getSource(sourceId)
  if (!source || source.type !== 'local') return {}

  const index = await getLocalSourceIndex(source)
  const directoryChildren = new Map<string, FileItem[]>()
  const knownDirectories = new Set<string>([''])

  const ensureDirectory = (directoryPath: string) => {
    if (!directoryChildren.has(directoryPath)) {
      directoryChildren.set(directoryPath, [])
    }
    knownDirectories.add(directoryPath)
  }

  ensureDirectory('')

  for (const document of index.documents) {
    const segments = document.path.split('/').filter(Boolean)
    let currentDirectory = ''

    for (const [segmentIndex, segment] of segments.slice(0, -1).entries()) {
      const nextDirectory = currentDirectory ? `${currentDirectory}/${segment}` : segment
      ensureDirectory(nextDirectory)

      const parentChildren = directoryChildren.get(currentDirectory) || []
      const directoryId = `${source.id}:${nextDirectory}`
      if (!parentChildren.some((item) => item.id === directoryId)) {
        parentChildren.push({
          id: directoryId,
          name: segment,
          path: nextDirectory,
          relativePath: nextDirectory,
          type: 'directory',
          extension: '',
          lastModified: document.updated || index.builtAt,
          sourceId: source.id,
        })
        directoryChildren.set(currentDirectory, parentChildren)
      }

      currentDirectory = nextDirectory
      if (segmentIndex === segments.length - 2) {
        ensureDirectory(currentDirectory)
      }
    }

    const parentDirectory = segments.slice(0, -1).join('/')
    const parentChildren = directoryChildren.get(parentDirectory) || []
    const fileId = `${source.id}:${document.path}`
    if (!parentChildren.some((item) => item.id === fileId)) {
      parentChildren.push({
        id: fileId,
        name: `${document.name}.md`,
        path: document.path,
        relativePath: document.path,
        type: 'file',
        extension: path.extname(document.path) || '.md',
        lastModified: document.updated || index.builtAt,
        sourceId: source.id,
        tags: [...document.tags],
        rawTags: [...document.sourceTags],
        graphTitle: document.graphTitle,
        frontmatter: document.frontmatter,
      })
      directoryChildren.set(parentDirectory, parentChildren)
    }
  }

  for (const directoryPath of knownDirectories) {
    const sorted = (directoryChildren.get(directoryPath) || [])
      .slice()
      .sort((left, right) => {
        if (left.type !== right.type) return left.type === 'directory' ? -1 : 1
        return left.name.localeCompare(right.name, 'zh-CN')
      })
    directoryChildren.set(directoryPath, sorted)
  }

  return Object.fromEntries(directoryChildren.entries())
}

export function buildFrontmatter(meta: Record<string, unknown>): string {
  if (Object.keys(meta).length === 0) return ''
  const lines = ['---']
  for (const [key, value] of Object.entries(meta)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((entry) => String(entry)).join(', ')}]`)
      continue
    }
    lines.push(`${key}: ${String(value)}`)
  }
  lines.push('---', '')
  return lines.join('\n')
}

export async function getKnowledgeGraph(sourceId: string, currentRelativePath: string): Promise<GraphData> {
  const source = getSource(sourceId)
  if (!source || source.type !== 'local') return { nodes: [], edges: [] }
  const index = await getLocalSourceIndex(source)
  const current = index.byPath.get(normalizeSlashes(currentRelativePath))
  if (!current) return { nodes: [], edges: [] }

  const nodes = new Map<string, GraphData['nodes'][number]>()
  const edges: GraphData['edges'] = []

  const addNode = (id: string, label: string, kind: 'current' | 'note' | 'tag') => {
    if (!nodes.has(id)) {
      nodes.set(id, { id, label, kind, x: 0, y: 0, vx: 0, vy: 0 })
    }
  }

  addNode(current.path, current.title, 'current')

  const outgoing = new Set<string>()
  let match: RegExpExecArray | null
  WIKILINK_REGEX.lastIndex = 0
  while ((match = WIKILINK_REGEX.exec(current.body)) !== null) {
    const target = index.byStem.get(match[1].trim().toLowerCase())
    if (!target || target.path === current.path) continue
    outgoing.add(target.path)
    addNode(target.path, target.title, 'note')
    edges.push({ source: current.path, target: target.path, kind: 'wikilink' })
  }

  for (const tag of current.tags) {
    const tagId = `#${tag}`
    addNode(tagId, tag, 'tag')
    edges.push({ source: current.path, target: tagId, kind: 'tag' })
  }

  for (const document of index.documents) {
    if (document.path === current.path || outgoing.has(document.path)) continue
    WIKILINK_REGEX.lastIndex = 0
    while ((match = WIKILINK_REGEX.exec(document.body)) !== null) {
      const target = index.byStem.get(match[1].trim().toLowerCase())
      if (target?.path === current.path) {
        addNode(document.path, document.title, 'note')
        edges.push({ source: document.path, target: current.path, kind: 'wikilink' })
        break
      }
    }
  }

  return { nodes: [...nodes.values()], edges }
}

export async function getGlobalKnowledgeGraph(sourceId: string): Promise<{
  nodes: Array<{ id: string; label: string; kind: 'note' | 'tag'; path?: string; tags?: string[] }>
  edges: Array<{ source: string; target: string; kind: 'wikilink' | 'tag' }>
  orphanNodes: Array<{ id: string; label: string; kind: 'note'; path?: string; tags?: string[] }>
}> {
  const source = getSource(sourceId)
  if (!source || source.type !== 'local') return { nodes: [], edges: [], orphanNodes: [] }

  const index = await getLocalSourceIndex(source)
  const edges: Array<{ source: string; target: string; kind: 'wikilink' | 'tag' }> = []
  const connected = new Set<string>()
  const tagCounts = new Map<string, number>()

  for (const document of index.documents) {
    WIKILINK_REGEX.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = WIKILINK_REGEX.exec(document.body)) !== null) {
      const target = index.byStem.get(match[1].trim().toLowerCase())
      if (!target || target.path === document.path) continue
      edges.push({ source: document.path, target: target.path, kind: 'wikilink' })
      connected.add(document.path)
      connected.add(target.path)
    }

    for (const tag of document.tags) {
      const tagId = `#${tag}`
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      edges.push({ source: document.path, target: tagId, kind: 'tag' })
      connected.add(document.path)
    }
  }

  const nodes: Array<{ id: string; label: string; kind: 'note' | 'tag'; path?: string; tags?: string[] }> = index.documents
    .filter((document) => connected.has(document.path))
    .map((document) => ({
      id: document.path,
      label: document.title,
      kind: 'note' as const,
      path: document.path,
      tags: document.tags,
    }))

  const orphanNodes = index.documents
    .filter((document) => !connected.has(document.path))
    .map((document) => ({
      id: document.path,
      label: document.title,
      kind: 'note' as const,
      path: document.path,
      tags: document.tags,
    }))

  for (const [tag, count] of tagCounts.entries()) {
    if (count < 2) continue
    nodes.push({ id: `#${tag}`, label: tag, kind: 'tag', tags: [] })
  }

  return { nodes, edges, orphanNodes }
}
