import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { DocSource, SelectedFile, KnowledgePanelTab, GraphData, AiAnalysis } from '../types'
import { TableOfContents } from './TableOfContents'
import { KnowledgeGraph } from './KnowledgeGraph'
import { GlobalGraph } from './GlobalGraph'
import { API_BASE } from '../constants'

interface KnowledgePanelProps {
  content: string | null
  selectedFile: SelectedFile | null
  source?: DocSource
  onNavigate: (path: string) => void
  onTagSelect?: (tag: string) => void
}

const GRAPH_SVG_WIDTH = 284  // approximate panel width minus borders
type GraphMode = 'local' | 'global' | 'orphan'

export function KnowledgePanel({
  content,
  selectedFile,
  source,
  onNavigate,
  onTagSelect,
}: KnowledgePanelProps) {
  const [activeTab, setActiveTab] = useState<KnowledgePanelTab>('toc')
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [graphLoading, setGraphLoading] = useState(false)
  const [graphMode, setGraphMode] = useState<GraphMode>('local')
  const [aiData, setAiData] = useState<AiAnalysis | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [orphanNodes, setOrphanNodes] = useState<{ id: string; label: string; path: string; tags: string[] }[]>([])
  const [orphanLoading, setOrphanLoading] = useState(false)
  const graphContainerRef = useRef<HTMLDivElement>(null)
  const [graphHeight, setGraphHeight] = useState(300)

  // Reset on file change
  useEffect(() => {
    setGraphData(null)
    setAiData(null)
    setActiveTab('toc')
  }, [selectedFile?.path, selectedFile?.sourceId])

  // Measure graph container height
  useEffect(() => {
    if (!graphContainerRef.current) return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setGraphHeight(entry.contentRect.height || 300)
      }
    })
    ro.observe(graphContainerRef.current)
    return () => ro.disconnect()
  }, [])

  const fetchGraphData = useCallback(async () => {
    if (!selectedFile || source?.type !== 'local') return
    setGraphLoading(true)
    try {
      const res = await fetch(
        `${API_BASE}/graph?source=${selectedFile.sourceId}&path=${encodeURIComponent(selectedFile.path)}`
      )
      if (res.ok) {
        const data: GraphData = await res.json()
        setGraphData(data)
      }
    } catch { /* ignore */ } finally {
      setGraphLoading(false)
    }
  }, [selectedFile, source])

  const fetchAiAnalysis = useCallback(async () => {
    if (!content || !selectedFile) return
    setAiLoading(true)
    try {
      const res = await fetch(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          fileName: selectedFile.path.split('/').pop() || selectedFile.path,
        }),
      })
      if (res.ok) {
        const data: AiAnalysis = await res.json()
        setAiData(data)
      }
    } catch { /* ignore */ } finally {
      setAiLoading(false)
    }
  }, [content, selectedFile])

  const handleTabClick = (tab: KnowledgePanelTab) => {
    setActiveTab(tab)
    if (tab === 'graph' && graphMode === 'local' && !graphData && !graphLoading) {
      fetchGraphData()
    }
  }

  const fetchOrphanNodes = useCallback(async () => {
    if (!selectedFile || source?.type !== 'local') return
    setOrphanLoading(true)
    try {
      const res = await fetch(`${API_BASE}/global-graph?source=${selectedFile.sourceId}`)
      if (res.ok) {
        const data = await res.json()
        setOrphanNodes(data.orphanNodes || [])
      }
    } catch { /* ignore */ } finally {
      setOrphanLoading(false)
    }
  }, [selectedFile, source])

  return (
    <aside className="knowledge-panel">
      <div className="kp-tabs">
        <button
          className={`kp-tab${activeTab === 'graph' ? ' active' : ''}`}
          onClick={() => handleTabClick('graph')}
        >
          图谱
        </button>
        <button
          className={`kp-tab${activeTab === 'toc' ? ' active' : ''}`}
          onClick={() => handleTabClick('toc')}
        >
          目录
        </button>
        <button
          className={`kp-tab${activeTab === 'ai' ? ' active' : ''}`}
          onClick={() => handleTabClick('ai')}
        >
          AI洞察
        </button>
      </div>

      <div className="kp-content">
        {activeTab === 'graph' && (
          <div ref={graphContainerRef} className="kp-graph" style={{ flex: 1 }}>
            {source?.type === 'local' && (
              <div className="graph-mode-toggle">
                <button
                  className={`graph-mode-btn${graphMode === 'local' ? ' active' : ''}`}
                  onClick={() => setGraphMode('local')}
                >
                  局部
                </button>
                <button
                  className={`graph-mode-btn${graphMode === 'global' ? ' active' : ''}`}
                  onClick={() => setGraphMode('global')}
                >
                  全局
                </button>
                <button
                  className={`graph-mode-btn${graphMode === 'orphan' ? ' active' : ''}`}
                  onClick={() => {
                    setGraphMode('orphan')
                    if (orphanNodes.length === 0) fetchOrphanNodes()
                  }}
                >
                  孤立 {orphanNodes.length > 0 && <span className="orphan-badge">{orphanNodes.length}</span>}
                </button>
              </div>
            )}

            {graphMode === 'local' && (
              <>
                {graphLoading && (
                  <div className="kp-ai-loading">
                    <div className="spinner" style={{ width: 'var(--icon-size-lg)', height: 'var(--icon-size-lg)' }} />
                    加载图谱...
                  </div>
                )}
                {!graphLoading && graphData && (
                  <KnowledgeGraph
                    data={graphData}
                    width={GRAPH_SVG_WIDTH}
                    height={graphHeight}
                    onNavigate={onNavigate}
                    onTagSelect={onTagSelect}
                  />
                )}
                {!graphLoading && !graphData && (
                  <div style={{ padding: 'var(--spacing-5)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    选择文档后查看关系图谱
                  </div>
                )}
              </>
            )}

            {graphMode === 'global' && source?.type === 'local' && (
              <GlobalGraph
                width={GRAPH_SVG_WIDTH}
                height={graphHeight}
                onNavigate={onNavigate}
                onTagSelect={onTagSelect}
              />
            )}

            {graphMode === 'orphan' && source?.type === 'local' && (
              <div className="orphan-list">
                {orphanLoading ? (
                  <div className="kp-ai-loading">
                    <div className="spinner" style={{ width: 'var(--icon-size-lg)', height: 'var(--icon-size-lg)' }} />
                    分析中...
                  </div>
                ) : orphanNodes.length === 0 ? (
                  <div className="orphan-empty">
                    <div className="orphan-empty-icon">✓</div>
                    <div className="orphan-empty-title">没有孤立文档</div>
                    <div className="orphan-empty-desc">所有文档都已建立连接</div>
                  </div>
                ) : (
                  <>
                    <div className="orphan-hint">
                      以下文档尚未建立链接，是学习的空白区
                    </div>
                    {orphanNodes.map(node => (
                      <button
                        key={node.id}
                        className="orphan-item"
                        onClick={() => onNavigate(node.path || node.id)}
                        title={node.path}
                      >
                        <span className="orphan-label">{node.label}</span>
                        {node.tags?.length > 0 && (
                          <span className="orphan-tags">
                            {node.tags.slice(0, 3).map(t => (
                              <span key={t} className="tag tag--tiny">#{t}</span>
                            ))}
                          </span>
                        )}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'toc' && (
          <div className="kp-toc">
            {content ? <TableOfContents content={content} /> : null}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="kp-ai">
            {!aiData && !aiLoading && (
              <button
                className="kp-analyze-btn"
                onClick={fetchAiAnalysis}
                disabled={!content}
              >
                ✨ 分析文档
              </button>
            )}

            {aiLoading && (
              <div className="kp-ai-loading">
                <div className="spinner" style={{ width: 'var(--icon-size-lg)', height: 'var(--icon-size-lg)' }} />
                AI 分析中...
              </div>
            )}

            {aiData && !aiData.error && (
              <>
                {aiData.summary && (
                  <div>
                    <div className="kp-ai-section-title">摘要</div>
                    <div className="kp-ai-summary markdown-body kp-markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {aiData.summary}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {aiData.keyPoints.length > 0 && (
                  <div>
                    <div className="kp-ai-section-title">要点</div>
                    <ul className="kp-ai-keypoints">
                      {aiData.keyPoints.map((pt: string, i: number) => (
                        <li key={i} className="kp-ai-keypoint">{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiData.concepts.length > 0 && (
                  <div>
                    <div className="kp-ai-section-title">概念</div>
                    <div className="kp-ai-concepts">
                      {aiData.concepts.map((c: { term: string; definition: string }, i: number) => (
                        <div key={i} className="kp-ai-concept-item">
                          <div className="kp-ai-concept-term">{c.term}</div>
                          <div className="kp-ai-concept-def">{c.definition}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="kp-analyze-btn"
                  onClick={() => { setAiData(null); fetchAiAnalysis() }}
                  style={{ marginTop: 'auto' }}
                >
                  重新分析
                </button>
              </>
            )}

            {aiData?.error && (
              <div className="kp-ai-error">分析失败: {aiData.error}</div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
