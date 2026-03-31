import { useState, useEffect } from 'react'
import { FileTree } from './FileTree'
import { DocSource, SelectedFile } from '../types'
import { ObsidianIcon, BlinkoIcon, FolderIcon, TagIcon, FileIcon } from './Icons'
import { API_BASE } from '../constants'

interface SidebarProps {
  sources: DocSource[]
  activeSource: string
  onSourceChange: (id: string) => void
  onFileSelect: (sourceId: string, path: string) => void
  refreshKey: number
  selectedFile: SelectedFile | null
  activeTag: string | null
  onTagSelect: (tag: string | null) => void
}

function SourceIcon({ icon }: { icon?: string }) {
  if (icon === 'obsidian') return <span className="source-icon source-icon--obsidian"><ObsidianIcon /></span>
  if (icon === 'blinko') return <span className="source-icon source-icon--blinko"><BlinkoIcon /></span>
  return <span className="source-icon"><FolderIcon /></span>
}

export function Sidebar({
  sources,
  activeSource,
  onSourceChange,
  onFileSelect,
  refreshKey,
  selectedFile,
  activeTag,
  onTagSelect,
}: SidebarProps) {
  const [tags, setTags] = useState<{ name: string; count: number }[]>([])
  const [showTree, setShowTree] = useState(false) // 文件树默认折叠

  useEffect(() => {
    if (activeSource !== 'blinko') {
      loadTags(activeSource)
    } else {
      setTags([])
    }
  }, [activeSource, refreshKey])

  const loadTags = async (sourceId: string) => {
    try {
      const response = await fetch(`${API_BASE}/tags?source=${sourceId}`)
      if (response.ok) {
        const data = await response.json()
        setTags(data)
      }
    } catch {
      setTags([])
    }
  }

  const currentSource = sources.find(s => s.id === activeSource)

  return (
    <aside className="app-sidebar">
      {/* Source Tabs */}
      <div className="sidebar-sources">
        {sources.filter(s => s.enabled).map(source => (
          <button
            key={source.id}
            className={`source-tab ${activeSource === source.id ? 'active' : ''}`}
            onClick={() => onSourceChange(source.id)}
            title={source.name}
          >
            <SourceIcon icon={source.icon} />
            <span className="source-tab-name">{source.name}</span>
          </button>
        ))}
      </div>

      {/* Source Info */}
      {currentSource && (
        <div className="sidebar-source-info">
          <span className="sidebar-source-label">{currentSource.name}</span>
          {currentSource.description && (
            <span className="sidebar-source-desc">{currentSource.description}</span>
          )}
        </div>
      )}

      {/* Tag Cloud — Primary Navigation (always visible for Obsidian) */}
      {activeSource !== 'blinko' && tags.length > 0 && (
        <div className="sidebar-tags" style={{ flexShrink: 0 }}>
          <div className="sidebar-section-toggle">
            <TagIcon />
            <span>技能标签</span>
            <span className="tag-count-badge">{tags.length}</span>
          </div>
          <div className="tag-cloud">
            <button
              className={`tag ${activeTag === null ? 'tag--active' : ''}`}
              onClick={() => onTagSelect(null)}
            >全部</button>
            {tags.map(tag => (
              <button
                key={tag.name}
                className={`tag ${activeTag === tag.name ? 'tag--active' : ''}`}
                onClick={() => onTagSelect(activeTag === tag.name ? null : tag.name)}
                title={`${tag.count} 篇文档`}
              >
                #{tag.name}
                <span className="tag-count">{tag.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File Tree — Secondary, Collapsible */}
      {activeSource !== 'blinko' && (
        <div style={{ flexShrink: 0 }}>
          <button
            className="sidebar-section-toggle"
            onClick={() => setShowTree(v => !v)}
            style={{ cursor: 'pointer' }}
          >
            <FileIcon />
            <span>文件</span>
            <span style={{
              marginLeft: 'auto', fontSize: 10,
              transform: showTree ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              color: 'var(--color-text-subtle)',
            }}>
              ▶
            </span>
          </button>
          {showTree && (
            <div className="sidebar-tree">
              <FileTree
                key={`${activeSource}-${refreshKey}-${activeTag}`}
                sourceId={activeSource}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
                filterTag={activeTag}
              />
            </div>
          )}
        </div>
      )}

      {/* Blinko hint */}
      {activeSource === 'blinko' && (
        <div className="sidebar-blinko-hint">
          <BlinkoIcon />
          <span>Blinko 闪念以卡片形式显示在右侧</span>
        </div>
      )}
    </aside>
  )
}
