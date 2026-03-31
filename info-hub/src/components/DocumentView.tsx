import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Components } from 'react-markdown'
import { DocumentIcon, ClockIcon } from './Icons'
import { KnowledgePanel } from './KnowledgePanel'
import { DocSource, SelectedFile, Frontmatter } from '../types'

interface DocumentViewProps {
  content: string | null
  fileName: string
  loading: boolean
  selectedFile: SelectedFile | null
  source?: DocSource
  onWikiLink: (noteName: string) => void
  onTagSelect?: (tag: string) => void
  showKnowledgePanel?: boolean
  variant?: 'page' | 'panel'
}

// Decode JSON-encoded content strings
function preprocessContent(raw: string): string {
  if (!raw) return raw
  const s = raw.trim()
  if (s.startsWith('"') && s.endsWith('"')) {
    try {
      const decoded = JSON.parse(s)
      if (typeof decoded === 'string') return decoded
    } catch {
      return s.slice(1, -1)
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\\\/g, '\\')
    }
  }
  return raw
}

// Parse YAML frontmatter
function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  if (!content.startsWith('---')) return { frontmatter: {}, body: content }
  const end = content.indexOf('\n---', 3)
  if (end === -1) return { frontmatter: {}, body: content }
  const yaml = content.slice(4, end)
  const body = content.slice(end + 4).trimStart()
  const frontmatter: Frontmatter = {}
  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const raw = line.slice(colonIdx + 1).trim()
    if (raw.startsWith('[') && raw.endsWith(']')) {
      frontmatter[key] = raw.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
    } else {
      frontmatter[key] = raw.replace(/^["']|["']$/g, '')
    }
  }
  return { frontmatter, body }
}

function headingId(children: React.ReactNode): string {
  const text = String(children)
  return text.toLowerCase().replace(/[^\w\u4e00-\u9fa5\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

// Extract raw text from React children
function extractText(root: React.ReactNode): string {
  const parts: string[] = []
  const stack: React.ReactNode[] = [root]
  while (stack.length > 0) {
    const node = stack.pop()
    if (typeof node === 'string') parts.push(node)
    else if (typeof node === 'number') parts.push(String(node))
    else if (Array.isArray(node)) { for (let i = node.length - 1; i >= 0; i--) stack.push(node[i]) }
    else if (node && typeof node === 'object' && 'props' in (node as object)) {
      stack.push((node as React.ReactElement).props.children)
    }
  }
  return parts.join('')
}

// Copy button
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text.trim()).catch(() => {
      const ta = document.createElement('textarea')
      ta.value = text.trim()
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button className={`copy-btn${copied ? ' copy-btn--copied' : ''}`} onClick={handleCopy}>
      {copied ? '✓ 已复制' : '复制'}
    </button>
  )
}

// Wiki link renderer
function renderWikiLinks(text: string, onWikiLink: (name: string) => void): React.ReactNode {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = wikiLinkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    const [linkText, displayText] = match[1].split('|')
    parts.push(
      <button
        key={match.index}
        className="wiki-link"
        onClick={() => onWikiLink(linkText.trim())}
        title={`跳转到: ${linkText.trim()}`}
      >
        {displayText || linkText}
      </button>
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts
}

function processChildren(children: React.ReactNode, onWikiLink: (name: string) => void): React.ReactNode {
  if (typeof children === 'string') return renderWikiLinks(children, onWikiLink)
  if (Array.isArray(children)) return children.map((child, i) =>
    typeof child === 'string' ? <span key={i}>{renderWikiLinks(child, onWikiLink)}</span> : child
  )
  return children
}

// Skill badge — rich metadata for MCP/agent use
function SkillBadge({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 980,
      background: 'var(--tag-bg)', color: 'var(--tag-text)',
      border: '1px solid var(--tag-border)',
      fontSize: 'var(--font-size-xs)', fontWeight: 500,
    }}>
      <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>{label}:</span>
      <span>{value}</span>
    </div>
  )
}

export function DocumentView({
  content, fileName, loading, selectedFile, source, onWikiLink, onTagSelect,
  showKnowledgePanel = true,
  variant = 'page',
}: DocumentViewProps) {
  const { frontmatter, body } = useMemo(() => {
    if (!content) return { frontmatter: {}, body: '' }
    return parseFrontmatter(preprocessContent(content))
  }, [content])

  const handleNavigate = (path: string) => onWikiLink(path)

  const components: Components = useMemo(() => ({
    p({ children }) { return <p>{processChildren(children, onWikiLink)}</p> },
    li({ children }) { return <li>{processChildren(children, onWikiLink)}</li> },
    pre({ children }) {
      const codeEl = Array.isArray(children) ? children[0] : children
      const className = (codeEl as React.ReactElement)?.props?.className || ''
      const lang = (className as string).replace('language-', '') || ''
      const rawText = extractText(children)
      return (
        <div className="code-block">
          <div className="code-header">
            {lang && <span className="code-lang">{lang}</span>}
            <CopyButton text={rawText} />
          </div>
          <pre>{children}</pre>
        </div>
      )
    },
    code({ className, children }) {
      const isBlock = className?.startsWith('language-')
      if (isBlock) return <code className={className}>{children}</code>
      return <code className="inline-code">{children}</code>
    },
    h1: ({ children }) => {
      const id = headingId(children)
      return <h1 id={id}><a href={`#${id}`} className="heading-anchor" aria-hidden="true">#</a>{children}</h1>
    },
    h2: ({ children }) => {
      const id = headingId(children)
      return <h2 id={id}><a href={`#${id}`} className="heading-anchor" aria-hidden="true">#</a>{children}</h2>
    },
    h3: ({ children }) => {
      const id = headingId(children)
      return <h3 id={id}><a href={`#${id}`} className="heading-anchor" aria-hidden="true">#</a>{children}</h3>
    },
    h4: ({ children }) => {
      const id = headingId(children)
      return <h4 id={id}><a href={`#${id}`} className="heading-anchor" aria-hidden="true">#</a>{children}</h4>
    },
  }), [onWikiLink])

  if (!selectedFile) {
    return (
      <div className="app-content">
        <div className="empty-state">
          <DocumentIcon />
          <div>
            <p className="empty-state-text">从左侧选择一个文档开始阅读</p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-3)' }}>
              支持标签筛选 · 双向链接 · AI 洞察
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="app-content">
        <div className="loading"><div className="spinner" /></div>
      </div>
    )
  }

  const title = (frontmatter.title as string) || fileName
  const date = (frontmatter.date || frontmatter.updated) as string | undefined
  const description = frontmatter.description as string | undefined
  const docType = frontmatter.type as string | undefined
  // Skill metadata fields (MCP-ready)
  const tech = frontmatter.tech as string | undefined
  const version = frontmatter.version as string | undefined
  const domain = frontmatter.domain as string | undefined
  const problem = frontmatter.problem as string | undefined
  const isDaily = docType === 'daily'

  return (
    <div className={`doc-layout${variant === 'panel' ? ' doc-layout--panel' : ''}`}>
      <div className="app-content">
        {/* Document Header */}
        <div className="doc-header">
          <div className="doc-breadcrumb">
            <span className="breadcrumb-source">{source?.name || selectedFile.sourceId}</span>
            {selectedFile.path.split('/').slice(0, -1).map((part, i) => (
              <span key={i} className="breadcrumb-sep">
                <span className="breadcrumb-chevron">›</span>
                <span className="breadcrumb-part">{part}</span>
              </span>
            ))}
          </div>

          <div className="doc-title-row">
            <h1 className="doc-title">{title}</h1>
            {isDaily && <span className="doc-type-badge">日记</span>}
            {docType && !isDaily && <span className="doc-type-badge">{docType}</span>}
          </div>

          {description && <p className="doc-description">{description}</p>}

          {/* Skill Metadata — Apple badge style */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {domain && <SkillBadge label="领域" value={domain} />}
            {tech && <SkillBadge label="技术" value={tech} />}
            {version && <SkillBadge label="版本" value={version} />}
            {problem && <SkillBadge label="问题" value={problem} />}
            {date && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 980, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                <ClockIcon />
                {new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            )}
          </div>

          {/* Tags — rendered ONLY in body, not duplicated in meta */}
        </div>

        {/* Document Body */}
        <div className="doc-body">
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={components}
            >
              {body}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Knowledge Panel */}
      {selectedFile && showKnowledgePanel && (
        <KnowledgePanel
          content={body || null}
          selectedFile={selectedFile}
          source={source}
          onNavigate={handleNavigate}
          onTagSelect={onTagSelect}
        />
      )}
    </div>
  )
}
