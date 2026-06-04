import { DocSource, KnowledgeCatalog, SelectedFile } from '../types'
import { PageShell, RailPanel } from './CockpitPrimitives'
import { HeroKnowledgeScene } from './HeroKnowledgeScene'

export interface QuickKnowledgeItemLike {
  sourceId: string
  path: string
  name: string
  title?: string
  graphTitle?: string
  description?: string
}

interface HomeCommandCenterProps {
  source: DocSource
  sources: DocSource[]
  catalog: KnowledgeCatalog | null
  searchQuery: string
  activeTag: string | null
  selectedFile: SelectedFile | null
  onOpenExplorer: () => void
  onTagSelect: (tag: string | null) => void
  onOpenItem: (sourceId: string, path: string) => void
  onSourceSelect: (sourceId: string) => void
  onClearSelectedFile: () => void
  graphFocusPath?: string | null
}

export function HomeCommandCenter({
  source,
  sources,
  catalog,
  searchQuery,
  selectedFile,
  onTagSelect,
  onOpenExplorer,
  onOpenItem,
  onSourceSelect,
  graphFocusPath,
}: HomeCommandCenterProps) {
  const graphMode = selectedFile ? 'focus' : searchQuery.trim() ? 'global' : 'tree'
  const projectCount = catalog?.sections
    .flatMap((section) => section.items)
    .filter((item) => item.docType === 'project').length || 0
  const recentProjects = catalog?.recentDocs.filter((item) => item.docType === 'project').slice(0, 5) || []
  const skillSource = sources.find((item) => item.id === 'axi-skills')
  const sourceLabel = source.kind === 'workspace-registry'
    ? 'Workspace'
    : source.kind === 'skill-library'
      ? 'Skills'
      : source.name
  const metrics = [
    { label: 'Sources', value: sources.length, helper: '已接入文档库' },
    { label: 'Projects', value: projectCount, helper: '工作区项目' },
    { label: 'Documents', value: catalog?.totalDocs || 0, helper: sourceLabel },
  ]

  return (
    <PageShell className="command-center__home-shell axi-hub-home" compact>
      <section className="axi-hub-home__main">
        <div className="axi-hub-home__hero-copy">
          <span className="axi-hub-home__eyebrow">Axi Knowledge Hub</span>
          <h1>工作区文档、技能库和 Agent 参考入口</h1>
          <p>
            统一索引 workspace 项目、Axi Skills、Obsidian 与 Blinko。给人看是文档门户，给 agent 用是可检索、可读取的 MCP 知识源。
          </p>
          <div className="axi-hub-home__hero-actions">
            <button className="axi-hub-home__primary-action" onClick={onOpenExplorer} type="button">
              浏览当前文档库
            </button>
            {skillSource && (
              <button className="axi-hub-home__ghost-action" onClick={() => onOpenItem('axi-skills', 'docs/SKILL_INDEX.md')} type="button">
                打开技能目录
              </button>
            )}
          </div>
        </div>

        <div className="axi-hub-home__metrics">
          {metrics.map((metric) => (
            <div key={metric.label} className="axi-hub-home__metric-card">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.helper}</small>
            </div>
          ))}
        </div>

        <section className="axi-hub-home__library-panel">
          <div className="axi-hub-home__section-heading">
            <span>Libraries</span>
            <strong>文档库入口</strong>
          </div>
          <div className="axi-hub-home__sources">
            {sources.map((item) => (
              <button
                key={item.id}
                className={`axi-hub-home__source-card${item.id === source.id ? ' active' : ''}`}
                onClick={() => onSourceSelect(item.id)}
                type="button"
              >
                <span className="axi-hub-home__source-kind">{item.kind || item.adapter || item.type}</span>
                <strong>{item.name}</strong>
                <small>{item.description || item.id}</small>
              </button>
            ))}
          </div>
        </section>
      </section>

      <aside className="axi-hub-home__side">
        <RailPanel className="axi-hub-home__panel" tone="secondary">
          <div className="axi-hub-home__section-heading">
            <span>Workspace</span>
            <h2>近期项目入口</h2>
          </div>
          <div className="axi-hub-home__list">
            {recentProjects.length > 0 ? recentProjects.map((item) => (
              <button key={`${item.sourceId}:${item.path}`} onClick={() => onOpenItem(item.sourceId, item.path)} type="button">
                <strong>{item.title}</strong>
                <span>{item.description || item.path}</span>
              </button>
            )) : <p>workspace catalog 正在生成或暂无项目数据。</p>}
          </div>
        </RailPanel>

        <RailPanel className="axi-hub-home__panel axi-hub-home__panel--skill" tone="secondary">
          <div className="axi-hub-home__section-heading">
            <span>Agent</span>
            <h2>Axi Skills 子库</h2>
          </div>
          <p>{skillSource?.description || '共享技能库 source 尚未可用。'}</p>
          {skillSource && (
            <button className="axi-hub-home__open-skill" onClick={() => onOpenItem('axi-skills', 'docs/SKILL_INDEX.md')} type="button">
              打开技能索引
            </button>
          )}
        </RailPanel>

        <RailPanel className="axi-hub-home__graph-card" tone="ghost">
          <div className="axi-hub-home__section-heading">
            <span>Map</span>
            <h2>知识图谱</h2>
          </div>
          <div className="command-center__graph">
            <HeroKnowledgeScene
              focusPath={graphFocusPath}
              mode={graphMode}
              onNavigate={(path) => onOpenItem(source.id, path)}
              onTagSelect={onTagSelect}
              sourceId={source.id}
            />
          </div>
        </RailPanel>
      </aside>
    </PageShell>
  )
}
