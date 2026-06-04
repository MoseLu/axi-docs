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

  return (
    <PageShell className="command-center__home-shell axi-hub-home" compact>
      <section className="axi-hub-home__dashboard">
        <div className="axi-hub-home__hero-copy">
          <span className="command-center__eyebrow">Axi Knowledge Hub</span>
          <h1>工作区文档、技能库和 Agent 参考入口</h1>
          <p>
            统一索引 workspace 项目、Axi Skills、Obsidian 与 Blinko，让人能快速浏览，让 agent 能通过 MCP 精准读取。
          </p>
        </div>

        <div className="axi-hub-home__metrics">
          <div>
            <span>文档库</span>
            <strong>{sources.length}</strong>
          </div>
          <div>
            <span>工作区项目</span>
            <strong>{projectCount}</strong>
          </div>
          <div>
            <span>当前目录文档</span>
            <strong>{catalog?.totalDocs || 0}</strong>
          </div>
        </div>

        <div className="axi-hub-home__sources">
          {sources.map((item) => (
            <button
              key={item.id}
              className={`axi-hub-home__source-card${item.id === source.id ? ' active' : ''}`}
              onClick={() => {
                const firstDoc = item.id === source.id
                  ? catalog?.recentDocs[0]
                  : null
                if (firstDoc) {
                  onOpenItem(firstDoc.sourceId, firstDoc.path)
                } else {
                  onSourceSelect(item.id)
                }
              }}
              type="button"
            >
              <span>{item.kind || item.adapter || item.type}</span>
              <strong>{item.name}</strong>
              <small>{item.description || item.id}</small>
            </button>
          ))}
        </div>

        <div className="axi-hub-home__quick-panels">
          <RailPanel className="axi-hub-home__panel" tone="secondary">
            <span className="command-center__eyebrow">Workspace</span>
            <h2>近期项目入口</h2>
            <div className="axi-hub-home__list">
              {recentProjects.length > 0 ? recentProjects.map((item) => (
                <button key={`${item.sourceId}:${item.path}`} onClick={() => onOpenItem(item.sourceId, item.path)} type="button">
                  <strong>{item.title}</strong>
                  <span>{item.description || item.path}</span>
                </button>
              )) : <p>workspace catalog 正在生成或暂无项目数据。</p>}
            </div>
          </RailPanel>

          <RailPanel className="axi-hub-home__panel" tone="secondary">
            <span className="command-center__eyebrow">Agent</span>
            <h2>Axi Skills 子库</h2>
            <p>{skillSource?.description || '共享技能库 source 尚未可用。'}</p>
            {skillSource && (
              <button className="axi-hub-home__open-skill" onClick={() => onOpenItem('axi-skills', 'docs/SKILL_INDEX.md')} type="button">
                打开技能索引
              </button>
            )}
          </RailPanel>
        </div>
      </section>

      <RailPanel className="command-center__graph-shell command-center__graph-shell--home axi-hub-home__graph" tone="primary">
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
    </PageShell>
  )
}
