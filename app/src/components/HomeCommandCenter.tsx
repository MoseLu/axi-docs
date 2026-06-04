import { DocSource, KnowledgeCatalog, SearchResult, SelectedFile } from '../types'
import { PageShell } from './CockpitPrimitives'

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
  searchResults?: SearchResult[] | null
  searching?: boolean
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
  searchResults,
  searching = false,
  searchQuery,
  onOpenExplorer,
  onOpenItem,
  onSourceSelect,
}: HomeCommandCenterProps) {
  const recentProjects = catalog?.recentDocs.filter((item) => item.docType === 'project').slice(0, 5) || []
  const skillSource = sources.find((item) => item.id === 'axi-skills')
  const primarySections = catalog?.sections.slice(0, 4) || []
  const featuredDocs = catalog?.recentDocs.slice(0, 4) || []
  const currentSourceName = source.name || '当前文档库'
  const normalizedSearchQuery = searchQuery.trim()
  const visibleSearchResults = (searchResults || []).slice(0, 8)

  return (
    <PageShell className="axi-docs-home" compact>
      <main className="axi-docs-home__content" id="overview">
        <section className="axi-docs-home__hero">
          <span className="axi-docs-home__eyebrow">Axi Docs</span>
          <h1>React 体系的专业文档站</h1>
          <p>
            把 workspace 文档、Axi Skills 和长期知识库整理成可阅读、可搜索、可被 agent 调用的统一文档站。
            首页优先服务阅读路径，知识图谱和多源检索作为进阶能力进入。
          </p>
          <div className="axi-docs-home__actions">
            <button className="axi-docs-home__primary-action" onClick={onOpenExplorer} type="button">
              开始阅读 {currentSourceName}
            </button>
            {skillSource && (
              <button className="axi-docs-home__secondary-action" onClick={() => onOpenItem('axi-skills', 'docs/SKILL_INDEX.md')} type="button">
                查看 Axi Skills
              </button>
            )}
          </div>
        </section>

        <section className="axi-docs-home__feature-grid" aria-label="核心能力">
          <article>
            <span>01</span>
            <h2>Docs-first 阅读流</h2>
            <p>清晰标题、稳定导航、正文优先布局和页内目录，让文档站先像文档站。</p>
          </article>
          <article>
            <span>02</span>
            <h2>多源知识入口</h2>
            <p>保留 workspace、skills、Obsidian 等来源，但把它们组织成可浏览的文档库。</p>
          </article>
          <article>
            <span>03</span>
            <h2>Agent-ready</h2>
            <p>MCP 读取、搜索和项目摘要继续服务 agent，不挤占人的阅读主路径。</p>
          </article>
        </section>

        <section className="axi-docs-home__section" id="quick-start">
          <div className="axi-docs-home__section-heading">
            <span>Quick Start</span>
            <h2>从当前文档库开始</h2>
          </div>
          <div className="axi-docs-home__code-card">
            <code>pnpm dev</code>
            <p>本地启动 React 文档站，使用顶部搜索、推荐阅读路径或右侧来源入口进入具体文档。</p>
          </div>
        </section>

        {normalizedSearchQuery && (
          <section className="axi-docs-home__section axi-docs-home__section--search-results" aria-live="polite">
            <div className="axi-docs-home__section-heading">
              <span>Search</span>
              <h2>“{normalizedSearchQuery}” 的匹配文档</h2>
            </div>
            {searching ? (
              <div className="axi-docs-home__code-card">
                <p>正在检索文档库...</p>
              </div>
            ) : visibleSearchResults.length > 0 ? (
              <div className="axi-docs-home__recent-list">
                {visibleSearchResults.map((item) => (
                  <button key={`${item.sourceId}:${item.path}`} onClick={() => onOpenItem(item.sourceId, item.path)} type="button">
                    <strong>{item.title || item.name}</strong>
                    <span>{item.description || item.snippet || item.path}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="axi-docs-home__code-card">
                <p>没有找到匹配文档。换一个关键词，或从下方推荐阅读路径继续浏览。</p>
              </div>
            )}
          </section>
        )}

        <section className="axi-docs-home__section" id="guides">
          <div className="axi-docs-home__section-heading">
            <span>Guides</span>
            <h2>推荐阅读路径</h2>
          </div>
          <div className="axi-docs-home__guide-list">
            {primarySections.length > 0 ? primarySections.map((section) => (
              <button
                key={section.key}
                onClick={onOpenExplorer}
                type="button"
              >
                <strong>{section.title}</strong>
                <span>{section.description}</span>
                <small>{section.count} 篇文档</small>
              </button>
            )) : (
              <>
                <button onClick={onOpenExplorer} type="button">
                  <strong>浏览当前文档库</strong>
                  <span>打开目录树、路径视图和知识分类，定位可以继续阅读的文档。</span>
                  <small>{currentSourceName}</small>
                </button>
                {skillSource && (
                  <button onClick={() => onOpenItem('axi-skills', 'docs/SKILL_INDEX.md')} type="button">
                    <strong>Axi Skills 指南</strong>
                    <span>进入技能索引，查看 agent 工作流和可复用操作说明。</span>
                    <small>skill-library</small>
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        {featuredDocs.length > 0 && (
          <section className="axi-docs-home__section">
            <div className="axi-docs-home__section-heading">
              <span>Recent</span>
              <h2>最近更新</h2>
            </div>
            <div className="axi-docs-home__recent-list">
              {featuredDocs.map((item) => (
                <button key={`${item.sourceId}:${item.path}`} onClick={() => onOpenItem(item.sourceId, item.path)} type="button">
                  <strong>{item.title}</strong>
                  <span>{item.description || item.path}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <aside className="axi-docs-home__outline" aria-label="页面导航">
        <div className="axi-docs-home__outline-card">
          <span className="axi-docs-home__nav-label">On this page</span>
          <a href="#overview">总览</a>
          <a href="#quick-start">快速开始</a>
          <a href="#guides">推荐阅读路径</a>
          <a href="#sources">文档库</a>
        </div>

        <div className="axi-docs-home__outline-card" id="sources">
          <span className="axi-docs-home__nav-label">Current source</span>
          <strong>{currentSourceName}</strong>
          <p>{source.description || '当前文档库已经接入 Axi Docs。'}</p>
          {recentProjects.length > 0 && <small>{recentProjects.length} 个近期项目入口</small>}
          <div className="axi-docs-home__source-list">
            {sources.map((item) => (
              <button
                key={item.id}
                className={`axi-docs-home__source-link${item.id === source.id ? ' active' : ''}`}
                onClick={() => onSourceSelect(item.id)}
                type="button"
              >
                <span>{item.name}</span>
                <small>{item.kind || item.adapter || item.type}</small>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </PageShell>
  )
}
