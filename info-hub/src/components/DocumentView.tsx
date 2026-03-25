import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'
import { DocumentIcon, TagIcon, ClockIcon } from './Icons'
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
}

// Parse YAML frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  if (!content.startsWith('---')) {
    return { frontmatter: {}, body: content }
  }
  const end = content.indexOf('\n---', 3)
  if (end === -1) {
    return { frontmatter: {}, body: content }
  }
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

// Replace [[WikiLinks]] with clickable spans
// function processWikiLinks(content: string, onClick: (name: string) => void): string {
//   return content  // We handle this in the custom renderer below
// }

export function DocumentView({
  content,
  fileName,
  loading,
  selectedFile,
  source,
  onWikiLink,
  onTagSelect,
}: DocumentViewProps) {
  const { frontmatter, body } = useMemo(() => {
    if (!content) return { frontmatter: {}, body: '' }
    return parseFrontmatter(content)
  }, [content])

  // Custom components for react-markdown
  const components: Components = useMemo(() => ({
    // Render paragraphs with wikilink support
    p({ children }) {
      return <p>{processChildren(children, onWikiLink)}</p>
    },
    li({ children }) {
      return <li>{processChildren(children, onWikiLink)}</li>
    },
    // Syntax-highlighted code blocks
    code({ className, children }) {
      const isBlock = className?.startsWith('language-')
      const lang = className?.replace('language-', '') || ''
      if (!isBlock) {
        return <code className="inline-code">{children}</code>
      }
      return (
        <div className="code-block">
          {lang && <div className="code-lang">{lang}</div>}
          <pre><code>{children}</code></pre>
        </div>
      )
    },
    // Heading with anchor IDs
    h1: ({ children }) => <h1 id={headingId(children)}>{children}</h1>,
    h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
    h3: ({ children }) => <h3 id={headingId(children)}>{children}</h3>,
    h4: ({ children }) => <h4 id={headingId(children)}>{children}</h4>,
  }), [onWikiLink])

  if (!selectedFile) {
    return (
      <div className="app-content">
        <div className="empty-state">
          <DocumentIcon />
          <div>
            <p className="empty-state-text">从左侧选择一个文档开始阅读</p>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-3)' }}>
              支持 Obsidian 双向链接 · 标签筛选 · 全文搜索
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
  const tags: string[] = Array.isArray(frontmatter.tags) ? frontmatter.tags as string[] : []
  const date = (frontmatter.date || frontmatter.updated) as string | undefined
  const description = frontmatter.description as string | undefined
  const docType = frontmatter.type as string | undefined
  const weather = frontmatter.weather as string | undefined
  const mood = frontmatter.mood as string | undefined
  const isDaily = docType === 'daily'

  return (
    <div className="doc-layout">
      <div className="app-content">
        {/* Document Header */}
        <div className="doc-header">
          {/* Breadcrumb */}
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
          </div>

          {description && <p className="doc-description">{description}</p>}

          <div className="doc-meta">
            {date && (
              <span className="doc-meta-item">
                <ClockIcon />
                {new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            {weather && (
              <span className="doc-meta-item">
                <span className="doc-meta-icon">☁</span>
                {weather}
              </span>
            )}
            {mood && (
              <span className="doc-meta-item">
                <span className="doc-meta-icon">◉</span>
                {mood}
              </span>
            )}
            {tags.length > 0 && (
              <span className="doc-meta-item doc-meta-tags">
                <TagIcon />
                {tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </span>
            )}
          </div>
        </div>

        {/* Document Body */}
        <div className="doc-body">
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {body}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Knowledge Panel */}
      {selectedFile && (
        <KnowledgePanel
          content={body || null}
          selectedFile={selectedFile}
          source={source}
          onNavigate={onWikiLink}
          onTagSelect={onTagSelect}
        />
      )}
    </div>
  )
}

function headingId(children: React.ReactNode): string {
  const text = String(children)
  return text.toLowerCase().replace(/[^\w\u4e00-\u9fa5\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

// Process children and convert [[WikiLinks]] to clickable elements
function processChildren(children: React.ReactNode, onWikiLink: (name: string) => void): React.ReactNode {
  if (typeof children === 'string') {
    return renderWikiLinks(children, onWikiLink)
  }
  if (Array.isArray(children)) {
    return children.map((child, i) => {
      if (typeof child === 'string') {
        return <span key={i}>{renderWikiLinks(child, onWikiLink)}</span>
      }
      return child
    })
  }
  return children
}

function renderWikiLinks(text: string, onWikiLink: (name: string) => void): React.ReactNode {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = wikiLinkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const [linkText, displayText] = match[1].split('|')
    parts.push(
      <button
        key={match.index}
        className="wiki-link"
        onClick={() => onWikiLink(linkText.trim())}
        title={`跳转到: ${linkText.trim()}`}
      >
        [[{displayText || linkText}]]
      </button>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts
}
