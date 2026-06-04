const MARKDOWN_EXTENSION_REGEX = /\.(md|markdown)$/i
const DATE_TITLE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/
const MAX_DESCRIPTION_LENGTH = 160
const BRANCH_LABELS = new Map([
  ['10-Concepts', '概念'],
  ['20-Projects', '项目'],
  ['30-Areas', '领域'],
  ['40-Resources', '资源'],
  ['_agent', '智能体入口'],
  ['_daily', '每日记录'],
  ['_moc', '主题地图'],
  ['software', '软件'],
  ['personal', '个人'],
  ['workflow', '工作流'],
  ['tools', '工具'],
  ['ADR', '架构决策'],
  ['axi-docs', '文档中心'],
  ['ielts-vocab', '雅思词汇'],
])
const TITLE_OVERRIDES = new Map([
  ['axi docs', 'Axi 文档站'],
  ['axi image preview', 'Axi 图片预览'],
  ['axi local registry', 'Axi 本地注册表'],
  ['axi notify mobile', 'Axi 移动通知'],
  ['axi proxy companion', 'Axi 代理助手'],
  ['axi skills', 'Axi 技能库'],
  ['axi skills index', 'Axi 技能索引'],
  ['axi tauri starter', 'Axi Tauri 启动模板'],
  ['axi ui', 'Axi 界面组件'],
  ['axi video downloader', 'Axi 视频下载器'],
  ['axi workspace index', 'Axi 工作区索引'],
  ['workspace project catalog', '工作区项目目录'],
  ['current context', '当前上下文'],
  ['vault index for agent', '智能体知识库索引'],
  ['deep init pro', '深度初始化专业技能'],
])
const TOKEN_LABELS = new Map([
  ['agent', '智能体'],
  ['agents', '智能体'],
  ['architecture', '架构'],
  ['catalog', '目录'],
  ['center', '中心'],
  ['code', '代码'],
  ['component', '组件'],
  ['components', '组件'],
  ['concept', '概念'],
  ['context', '上下文'],
  ['current', '当前'],
  ['daily', '每日'],
  ['deep', '深度'],
  ['design', '设计'],
  ['docs', '文档站'],
  ['document', '文档'],
  ['download', '下载'],
  ['downloader', '下载器'],
  ['flow', '流程'],
  ['graph', '图谱'],
  ['governance', '治理'],
  ['guide', '指南'],
  ['image', '图片'],
  ['index', '索引'],
  ['init', '初始化'],
  ['knowledge', '知识'],
  ['library', '库'],
  ['local', '本地'],
  ['map', '地图'],
  ['mobile', '移动端'],
  ['notify', '通知'],
  ['overview', '总览'],
  ['platform', '平台'],
  ['preview', '预览'],
  ['pro', '专业版'],
  ['project', '项目'],
  ['projects', '项目'],
  ['proxy', '代理'],
  ['registry', '注册表'],
  ['skill', '技能'],
  ['skills', '技能库'],
  ['starter', '启动模板'],
  ['status', '状态'],
  ['system', '系统'],
  ['tauri', 'Tauri'],
  ['ui', '界面'],
  ['video', '视频'],
  ['workspace', '工作区'],
])
const DOC_TYPE_LABELS = new Map([
  ['component', '组件文档'],
  ['concept', '概念文档'],
  ['index', '索引文档'],
  ['note', '知识笔记'],
  ['project', '项目文档'],
  ['skill', '技能文档'],
  ['troubleshooting', '排障文档'],
])

function stripMarkdownExtension(value: string): string {
  return value.replace(MARKDOWN_EXTENSION_REGEX, '').trim()
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function hasChinese(value: string): boolean {
  return /[\u4e00-\u9fff]/.test(value)
}

function formatDateTitle(value: string): string | null {
  const match = stripMarkdownExtension(value).match(DATE_TITLE_REGEX)
  if (!match) return null
  const [, year, month, day] = match
  return `${year}年${Number(month)}月${Number(day)}日`
}

function truncateText(value: string, maxLength = MAX_DESCRIPTION_LENGTH): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`
}

function titleKey(value: string): string {
  return stripMarkdownExtension(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_/-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function tokenizeTitle(value: string): string[] {
  return stripMarkdownExtension(value)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_/-]+/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

function formatToken(token: string): string {
  const normalized = token.toLowerCase()
  if (TOKEN_LABELS.has(normalized)) return TOKEN_LABELS.get(normalized) || token
  if (/^axi$/i.test(token)) return 'Axi'
  if (/^[A-Z]{2,}$/.test(token)) return token
  if (/^\d+$/.test(token)) return token
  return token
}

function titleCandidateFromPath(pathValue?: string | null): string {
  const normalizedPath = normalizeText(pathValue)
  if (!normalizedPath) return ''
  const basename = normalizedPath.split('/').filter(Boolean).pop() || normalizedPath
  return stripMarkdownExtension(basename)
}

function formatChineseTitleCandidate(value: string): string {
  const normalized = stripMarkdownExtension(value)
  if (!normalized) return ''

  const datedTitle = formatDateTitle(normalized)
  if (datedTitle) return datedTitle

  const override = TITLE_OVERRIDES.get(titleKey(normalized))
  if (override) return override

  if (hasChinese(normalized)) return normalized

  const tokens = tokenizeTitle(normalized)
  const formatted = tokens.map(formatToken)
  if (formatted.some((token) => hasChinese(token))) return formatted.join('')

  return `${normalized} 文档`
}

export function formatKnowledgeDocumentTitle(
  titleOrName: string,
  path?: string | null,
  graphTitle?: string | null,
): string {
  const explicitGraphTitle = normalizeText(graphTitle)
  if (explicitGraphTitle) {
    return formatChineseTitleCandidate(explicitGraphTitle)
  }

  const normalizedTitle = normalizeText(titleOrName)
  if (normalizedTitle) {
    return formatChineseTitleCandidate(normalizedTitle)
  }

  const pathTitle = titleCandidateFromPath(path)
  if (pathTitle) return formatChineseTitleCandidate(pathTitle)

  return ''
}

export function formatKnowledgeDocumentDescription(item: {
  title?: string | null
  name?: string | null
  path?: string | null
  rawTitle?: string | null
  description?: string | null
  docType?: string | null
  sourceId?: string | null
}): string {
  const description = normalizeText(item.description)
  if (description && hasChinese(description)) return truncateText(description)

  const title = formatKnowledgeDocumentTitle(
    item.title || item.rawTitle || item.name || '',
    item.path,
    item.title || undefined,
  ) || formatKnowledgeDocumentTitle(item.rawTitle || item.name || '', item.path)
  const docType = normalizeText(item.docType)
  const docTypeLabel = DOC_TYPE_LABELS.get(docType.toLowerCase()) || '知识文档'
  const sourceLabel = item.sourceId === 'workspace'
    ? '工作区'
    : item.sourceId === 'axi-skills'
      ? '技能库'
      : '知识库'
  return truncateText([
    `${sourceLabel}中的${docTypeLabel}，用于说明「${title || '未命名文档'}」的背景、用途与关联上下文。`,
  ].filter(Boolean).join(' '))
}

export function formatKnowledgeItemTitle(item: {
  title?: string | null
  name?: string | null
  path?: string | null
  graphTitle?: string | null
}): string {
  return formatKnowledgeDocumentTitle(item.title || item.name || '', item.path, item.graphTitle)
}

export function formatKnowledgeTagLabel(tag: string): string {
  return normalizeText(tag).replace(/^#/, '')
}

export function formatKnowledgeBranchLabel(segment: string): string {
  const normalized = stripMarkdownExtension(segment)
  if (/^\d{4}$/.test(normalized)) return `${normalized}年`
  if (BRANCH_LABELS.has(normalized)) return BRANCH_LABELS.get(normalized) || normalized
  return normalized
}

export function formatKnowledgeBranchPath(pathValue: string): string {
  return pathValue
    .split('/')
    .filter(Boolean)
    .map((segment) => formatKnowledgeBranchLabel(segment))
    .join(' / ')
}

export function formatKnowledgeNodeLabel(node: {
  id?: string
  label: string
  kind?: 'current' | 'note' | 'tag' | 'branch'
  path?: string
  graphTitle?: string
}): string {
  if (node.kind === 'tag') {
    return formatKnowledgeTagLabel(node.label || node.id || '')
  }

  if (node.kind === 'branch') {
    return formatKnowledgeBranchLabel(node.label || node.path || node.id || '')
  }

  return formatKnowledgeDocumentTitle(node.label || node.id || '', node.path || node.id || '', node.graphTitle)
}

export function isChineseKnowledgeLabel(value: string): boolean {
  return hasChinese(value)
}
