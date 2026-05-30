const MARKDOWN_EXTENSION_REGEX = /\.(md|markdown)$/i
const DATE_TITLE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/
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

export function formatKnowledgeDocumentTitle(
  titleOrName: string,
  path?: string | null,
  graphTitle?: string | null,
): string {
  const explicitGraphTitle = normalizeText(graphTitle)
  if (explicitGraphTitle) return explicitGraphTitle

  const normalizedTitle = normalizeText(titleOrName)
  if (normalizedTitle) {
    const datedTitle = formatDateTitle(normalizedTitle)
    if (datedTitle) return datedTitle
    return stripMarkdownExtension(normalizedTitle)
  }

  const normalizedPath = normalizeText(path)
  if (normalizedPath) {
    const datedTitle = formatDateTitle(normalizedPath.split('/').pop() || normalizedPath)
    if (datedTitle) return datedTitle
    return stripMarkdownExtension(normalizedPath.split('/').pop() || normalizedPath)
  }

  return ''
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
