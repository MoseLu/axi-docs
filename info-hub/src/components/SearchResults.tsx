import { SearchResult } from '../types'
import { FileIcon, TagIcon } from './Icons'

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  onFileSelect: (sourceId: string, path: string) => void
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="search-highlight">{part}</mark>
      : part
  )
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function sourceLabel(sourceId: string): string {
  if (sourceId === 'obsidian') return 'Obsidian'
  if (sourceId === 'blinko') return 'Blinko'
  return sourceId
}

export function SearchResults({ results, query, onFileSelect }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="search-results-wrap">
        <div className="search-results-header">
          <span className="search-results-title">搜索结果</span>
          <span className="search-results-count">未找到 "{query}" 相关文档</span>
        </div>
        <div className="empty-state" style={{ flex: 1 }}>
          <FileIcon />
          <p className="empty-state-text">没有匹配的文档</p>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            尝试使用不同的关键词
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="search-results-wrap">
      <div className="search-results-header">
        <span className="search-results-title">搜索结果</span>
        <span className="search-results-count">找到 {results.length} 个结果 · "{query}"</span>
      </div>
      <div className="search-results-list">
        {results.map((result, i) => (
          <article
            key={i}
            className="search-result-item"
            onClick={() => onFileSelect(result.sourceId, result.path)}
          >
            <div className="search-result-header">
              <span className="search-result-icon"><FileIcon /></span>
              <span className="search-result-name">
                {highlightText(result.name.replace(/\.md$/, ''), query)}
              </span>
              <span className="search-result-source">{sourceLabel(result.sourceId)}</span>
            </div>
            <div className="search-result-path">{result.path}</div>
            {result.snippet && (
              <div className="search-result-snippet">
                {highlightText(result.snippet, query)}
              </div>
            )}
            {result.tags && result.tags.length > 0 && (
              <div className="search-result-tags">
                <TagIcon />
                {result.tags.map(tag => (
                  <span key={tag} className="tag tag--small">#{tag}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
