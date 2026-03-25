import { useCallback, useState, useEffect } from 'react'
import ForceGraph2D from 'react-force-graph-2d'

interface GlobalGraphNode {
  id: string
  label: string
  kind: 'note' | 'tag'
  path?: string
  tags?: string[]
  val?: number
}

interface GlobalGraphEdge {
  source: string
  target: string
  kind: 'wikilink' | 'tag'
}

interface GlobalGraphProps {
  width: number
  height: number
  onNavigate?: (path: string) => void
  onTagSelect?: (tag: string) => void
}

// Format label for display: strip extension, replace separators with spaces
function formatLabel(name: string): string {
  return name
    .replace(/\.(md|markdown)$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
}

const NODE_COLORS: Record<string, string> = {
  note: '#6366f1',
  tag: '#10b981',
}

export function GlobalGraph({ width, height, onNavigate, onTagSelect }: GlobalGraphProps) {
  const [graphData, setGraphData] = useState<{ nodes: GlobalGraphNode[]; links: GlobalGraphEdge[] }>({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/global-graph?source=obsidian`)
      .then(r => r.json())
      .then((data: { nodes: GlobalGraphNode[]; edges: GlobalGraphEdge[] }) => {
        setGraphData({
          nodes: (data.nodes || []).map((n: GlobalGraphNode) => ({
            ...n,
            val: n.kind === 'note' ? 3 : 1,  // size weight
          })),
          links: (data.edges || []).map((e: GlobalGraphEdge) => ({ ...e })),
        })
      })
      .catch(() => setGraphData({ nodes: [], links: [] }))
      .finally(() => setLoading(false))
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeClick = useCallback((node: any) => {
    const n = node as GlobalGraphNode
    if (n.kind === 'note') {
      onNavigate?.(n.path || n.id)
    } else {
      onTagSelect?.(n.label)
    }
  }, [onNavigate, onTagSelect])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', gap: 8 }}>
        <div className="spinner" style={{ width: 20, height: 20 }} />
        加载全局图谱...
      </div>
    )
  }

  if (graphData.nodes.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height, color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
        暂无图谱数据
      </div>
    )
  }

  return (
    <div style={{ width, height, position: 'relative' }}>
      <ForceGraph2D
        width={width}
        height={height}
        graphData={graphData}
        nodeId="id"
        nodeLabel={(node: unknown) => {
          const n = node as GlobalGraphNode
          return `<div style="font-family:'PingFang SC','Microsoft YaHei',sans-serif;font-size:12px;padding:4px 8px;background:#1e1e2e;color:#cdd6f4;border-radius:4px;max-width:200px">
            <b style="color:${NODE_COLORS[n.kind] || '#fff'}">${n.kind === 'tag' ? '#' : ''}${formatLabel(n.label)}</b>
            ${n.path ? `<div style="font-size:10px;color:#888;margin-top:2px">${n.path}</div>` : ''}
          </div>`
        }}
        nodeColor={(node: unknown) => {
          const n = node as GlobalGraphNode
          return NODE_COLORS[n.kind || 'note'] || '#6366f1'
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onNodeClick={handleNodeClick as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onNodeHover={(node: unknown) => {
          document.body.style.cursor = node ? 'pointer' : 'default'
        }}
        linkColor={(link: unknown) => {
          const l = link as GlobalGraphEdge
          return l.kind === 'tag' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.15)'
        }}
        linkWidth={1}
        cooldownTicks={100}
        d3VelocityDecay={0.3}
        enableNodeDrag={true}
        backgroundColor="transparent"
        nodeRelSize={6}
      />
      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 8, left: 8,
        display: 'flex', gap: 12,
        fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.6)',
        pointerEvents: 'none',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: NODE_COLORS.note, display: 'inline-block' }} />
          文档
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: NODE_COLORS.tag, display: 'inline-block' }} />
          标签
        </span>
      </div>
    </div>
  )
}
