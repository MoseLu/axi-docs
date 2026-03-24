import { useState, useEffect } from 'react'
import { FolderIcon, FileIcon, ChevronIcon } from './Icons'

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

interface FileTreeProps {
  sourceId: string
  onFileSelect: (sourceId: string, path: string) => void
  selectedFile: { sourceId: string; path: string } | null
}

const API_BASE = '/docs/api'

export function FileTree({ sourceId, onFileSelect, selectedFile }: FileTreeProps) {
  const [items, setItems] = useState<FileItem[]>([])
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())
  const [childrenCache, setChildrenCache] = useState<Record<string, FileItem[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRootItems()
  }, [sourceId])

  const loadRootItems = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/scan?source=${sourceId}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Failed to load root items:', error)
    }
    setLoading(false)
  }

  const loadChildren = async (dirPath: string) => {
    if (childrenCache[dirPath]) return childrenCache[dirPath]

    try {
      const response = await fetch(
        `${API_BASE}/scan?source=${sourceId}&path=${encodeURIComponent(dirPath)}`
      )
      if (response.ok) {
        const data = await response.json()
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

  const renderItem = (item: FileItem, depth: number = 0) => {
    const isExpanded = expandedDirs.has(item.relativePath)
    const isSelected = selectedFile?.path === item.relativePath
    const children = childrenCache[item.relativePath] || []

    return (
      <div key={item.id}>
        <div
          className={`tree-item ${isSelected ? 'active' : ''}`}
          style={{ paddingLeft: `${16 + depth * 16}px` }}
          onClick={() => {
            if (item.type === 'directory') {
              toggleDir(item)
            } else {
              onFileSelect(sourceId, item.relativePath)
            }
          }}
        >
          {item.type === 'directory' ? (
            <ChevronIcon expanded={isExpanded} />
          ) : (
            <span style={{ width: 16 }} />
          )}
          <span className="tree-item-icon">
            {item.type === 'directory' ? <FolderIcon /> : <FileIcon />}
          </span>
          <span className="tree-item-name">{item.name}</span>
        </div>
        {item.type === 'directory' && isExpanded && (
          <div className="tree-item-children">
            {children.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-text">暂无文档</span>
      </div>
    )
  }

  return <div>{items.map(item => renderItem(item))}</div>
}
