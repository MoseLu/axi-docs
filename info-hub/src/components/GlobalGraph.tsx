import { useCallback, useState, useEffect } from 'react'
import ForceGraph2D from 'react-force-graph-2d'

interface GlobalGraphNode {
  id: string
  label: string
  kind: 'note' | 'tag'
  path?: string
  tags?: string[]
  x?: number
  y?: number
}

interface GlobalGraphEdge {
  source: string | object
  target: string | object
  kind: 'wikilink' | 'tag'
}

interface GlobalGraphProps {
  width: number
  height: number
  onNavigate?: (path: string) => void
  onTagSelect?: (tag: string) => void
}

// Format label: strip extension, replace separators with spaces
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

interface GraphData {
  nodes: GlobalGraphNode[]
  links: GlobalGraphEdge[]
}


export function GlobalGraph({ width, height, onNavigate, onTagSelect }: GlobalGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<GlobalGraphNode | null>(null)
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/global-graph?source=obsidian`)
      .then(r => r.json())
      .then((data: { nodes: GlobalGraphNode[]; edges: GlobalGraphEdge[] }) => {
        setGraphData({
          nodes: data.nodes || [],
          links: (data.edges || []).map(e => ({ ...e })),
        })
      })
      .catch(() => setGraphData({ nodes: [], links: [] }))
      .finally(() => setLoading(false))
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node as GlobalGraphNode
    const isTag = n.kind === 'tag'
    const isHov = hoveredNode?.id === n.id
    const label = formatLabel(n.label)
    const r = isTag ? 4 : 7

    if (isHov) {
      ctx.beginPath()
      ctx.arc(n.x!, n.y!, r + 5, 0, 2 * Math.PI)
      ctx.fillStyle = isTag ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)'
      ctx.fill()
    }

    ctx.beginPath()
    ctx.arc(n.x!, n.y!, r, 0, 2 * Math.PI)
    ctx.fillStyle = NODE_COLORS[n.kind] + (isHov ? '' : 'bb')
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx.lineWidth = 1.5 / globalScale
    ctx.stroke()

    if (globalScale > 0.6 || isHov) {
      const fontSize = Math.max(9, 11 / globalScale)
      ctx.font = `${isHov ? 'bold ' : ''}${fontSize}px "PingFang SC","Microsoft YaHei","Helvetica Neue",sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = isHov ? '#fff' : isTag ? 'rgba(16,185,129,0.8)' : 'rgba(220,220,255,0.85)'
      ctx.fillText(label, n.x!, n.y! + r + 2)
    }
  }, [hoveredNode])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeClick = useCallback((node: any) => {
    const n = node as GlobalGraphNode
    if (n.kind === 'note') {
      onNavigate?.(n.path || n.id)
    } else {
      onTagSelect?.(n.label)
    }
  }, [onNavigate, onTagSelect])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node ? (node as GlobalGraphNode) : null)
    document.body.style.cursor = node ? 'pointer' : 'default'
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodePointerPaint = useCallback((node: any, ctx: CanvasRenderingContext2D) => {
    const n = node as GlobalGraphNode
    const r = n.kind === 'tag' ? 4 : 7
    ctx.beginPath()
    ctx.arc(n.x!, n.y!, r + 5, 0, 2 * Math.PI)
    ctx.fillStyle = 'rgba(0,0,0,0.01)'
    ctx.fill()
  }, [])

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodeCanvasObject={drawNode as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodePointerAreaPaint={nodePointerPaint as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onNodeClick={handleNodeClick as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onNodeHover={handleNodeHover as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        linkColor={(link: any) => {
          const l = link as GlobalGraphEdge
          return l.kind === 'tag' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.15)'
        }}
        linkWidth={1}
        cooldownTicks={100}
        d3VelocityDecay={0.3}
        enableNodeDrag={true}
        backgroundColor="transparent"
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
