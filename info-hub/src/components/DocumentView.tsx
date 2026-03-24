import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { DocumentIcon } from './Icons'

interface DocumentViewProps {
  content: string | null
  fileName: string
  loading: boolean
  selectedFile: { sourceId: string; path: string } | null
}

export function DocumentView({ content, fileName, loading, selectedFile }: DocumentViewProps) {
  if (!selectedFile) {
    return (
      <div className="app-content">
        <div className="empty-state">
          <DocumentIcon />
          <span className="empty-state-text">从左侧选择一个文档开始阅读</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="app-content">
        <div className="loading">
          <div className="spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="app-content">
      <div className="doc-header">
        <h1 className="doc-title">{fileName}</h1>
        <div className="doc-meta">
          <span>来源: {selectedFile.sourceId}</span>
          <span>路径: {selectedFile.path}</span>
        </div>
      </div>
      <div className="doc-body">
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || ''}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
