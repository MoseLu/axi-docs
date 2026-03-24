import { useState, useEffect } from 'react'
import { FileTree } from './FileTree'
import { DocSource } from '../types'

interface SidebarProps {
  sources: DocSource[]
  onFileSelect: (sourceId: string, path: string) => void
  refreshKey: number
  selectedFile: { sourceId: string; path: string } | null
}

export function Sidebar({ sources, onFileSelect, refreshKey, selectedFile }: SidebarProps) {
  const [activeSource, setActiveSource] = useState<string>('obsidian')

  useEffect(() => {
    if (sources.length > 0 && !sources.find(s => s.id === activeSource)) {
      setActiveSource(sources[0].id)
    }
  }, [sources])

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">文档</span>
        {sources.length > 1 && (
          <select
            value={activeSource}
            onChange={e => setActiveSource(e.target.value)}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
              fontSize: '12px',
            }}
          >
            {sources.map(source => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="sidebar-tree">
        <FileTree
          key={`${activeSource}-${refreshKey}`}
          sourceId={activeSource}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
      </div>
    </aside>
  )
}
