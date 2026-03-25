import { useState, useEffect } from 'react'
import { FolderIcon, FolderOpenIcon, FileIcon, ChevronIcon } from './Icons'
import { FileItem, SelectedFile } from '../types'
import { API_BASE } from '../constants'

interface FileTreeProps {
  sourceId: string
  onFileSelect: (sourceId: string, path: string) => void
  selectedFile: SelectedFile | null
  filterTag?: string | null
}

export function FileTree({ sourceId, onFileSelect, selectedFile, filterTag }: FileTreeProps) {
  const [items, setItems] = useState<FileItem[]>([])
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [childrenCache, setChildrenCache] = useState<Record<string, FileItem[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRootItems()
    setExpandedDirs(new Set())
    setChildrenCache({})
  }, [sourceId, filterTag])

  const buildUrl = (path?: string) => {
    const params = new URLSearchParams({ source: sourceId })
    if (path) params.set('path', path)
    if (filterTag) params.set('tag', filterTag)
    return `${API_BASE}/scan?${params}`
  }

  const loadRootItems = async () => {
    setLoading(true)
    try {
      const response = await fetch(buildUrl())
      if (response.ok) {
        const data: FileItem[] = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Failed to load root items:', error)
    }
    setLoading(false)
  }

  const loadChildren = async (dirPath: string): Promise<FileItem[]> => {
    if (childrenCache[dirPath]) return childrenCache[dirPath]
    try {
      const response = await fetch(buildUrl(dirPath))
      if (response.ok) {
        const data: FileItem[] = await response.json()
        setChildrenCache(prev => ({ ...prev, [dirPath]: data }))
        return data
      }
    } catch (error) {
      console.error('Failed to load children:', error)
    }
    return []
  }

  const toggleDir = async (item: FileItem) => {
    const newExpanded = new Set(expandedDirs)
    if (expandedDirs.has(item.relativePath)) {
      newExpanded.delete(item.relativePath)
    } else {
      newExpanded.add(item.relativePath)
      await loadChildren(item.relativePath)
    }
    setExpandedDirs(newExpanded)
  }

  const renderItem = (item: FileItem, depth = 0) => {
    const isExpanded = expandedDirs.has(item.relativePath)
    const isSelected = selectedFile?.path === item.relativePath && selectedFile?.sourceId === sourceId
    const children = childrenCache[item.relativePath] || []
    const tags = item.tags || []
    const displayName = item.name.replace(/\.md$/, '')

    return (
      <div key={item.id}>
        <div
          className={`tree-item ${isSelected ? 'active' : ''} ${item.type === 'directory' ? 'tree-item--dir' : ''}`}
          style={{ paddingLeft: `calc(var(--tree-indent-base) + ${depth} * var(--tree-indent-step))` }}
          onClick={() => {
            if (item.type === 'directory') {
              toggleDir(item)
            } else {
              onFileSelect(sourceId, item.relativePath)
            }
          }}
          title={item.relativePath}
        >
          {item.type === 'directory' ? (
            <ChevronIcon expanded={isExpanded} />
          ) : (
            <span style={{ width: 'var(--icon-size-sm)', flexShrink: 0 }} />
          )}
          <span className="tree-item-icon">
            {item.type === 'directory'
              ? (isExpanded ? <FolderOpenIcon /> : <FolderIcon />)
              : <FileIcon />}
          </span>
          <span className="tree-item-name">{displayName}</span>
          {tags.length > 0 && (
            <span className="tree-item-tags">
              {tags.slice(0, 2).map(tag => (
                <span key={tag} className="tag tag--tiny">#{tag}</span>
              ))}
            </span>
          )}
        </div>
        {item.type === 'directory' && isExpanded && children.length > 0 && (
          <div>
            {children.map(child => renderItem(child, depth + 1))}
          </div>
        )}
        {item.type === 'directory' && isExpanded && children.length === 0 && (
          <div
            className="tree-item-empty"
            style={{ paddingLeft: `calc(var(--tree-indent-base) + ${depth + 1} * var(--tree-indent-step) + 2 * var(--icon-size-sm))` }}
          >
            空目录
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>
  }

  if (items.length === 0) {
    return (
      <div className="empty-state" style={{ padding: 'var(--spacing-7) var(--spacing-5)' }}>
        <span className="empty-state-text">
          {filterTag ? `没有带 #${filterTag} 标签的文档` : '暂无文档'}
        </span>
      </div>
    )
  }

  return <div className="file-tree">{items.map(item => renderItem(item))}</div>
}
