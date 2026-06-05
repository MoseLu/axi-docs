import { useState } from 'react'
import { DocSource, KnowledgeCatalog, SearchResult, SelectedFile } from '../types'
import { PageShell } from './CockpitPrimitives'

type SidebarSectionId = 'intro' | 'sources' | 'routes'
export type GuideLocale = 'zh' | 'en'
export type GuidePageId = 'what-is-axi-docs' | 'getting-started' | 'search' | 'next-steps'

const guideLabels: Record<GuideLocale, Record<GuidePageId, string>> = {
  zh: {
    'what-is-axi-docs': '什么是 Axi Docs？',
    'getting-started': '快速开始',
    search: '搜索结果',
    'next-steps': '下一步',
  },
  en: {
    'what-is-axi-docs': 'What is Axi Docs?',
    'getting-started': 'Getting Started',
    search: 'Search Results',
    'next-steps': 'Next Steps',
  },
}

const guidePageOrder: GuidePageId[] = ['what-is-axi-docs', 'getting-started', 'search', 'next-steps']

function buildGuideHref(locale: GuideLocale, pageId: GuidePageId) {
  return `/${locale}/guide/${pageId}`
}

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
  activeSourceId?: string | null
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
  guideLocale?: GuideLocale
  guidePageId?: GuidePageId
}

export function HomeCommandCenter({
  source,
  sources,
  activeSourceId = null,
  catalog,
  searchResults,
  searching = false,
  searchQuery,
  onOpenExplorer,
  onOpenItem,
  onSourceSelect,
  guideLocale = 'zh',
  guidePageId = 'getting-started',
}: HomeCommandCenterProps) {
  const recentProjects = catalog?.recentDocs.filter((item) => item.docType === 'project').slice(0, 5) || []
  const skillSource = sources.find((item) => item.id === 'axi-skills')
  const primarySections = catalog?.sections.slice(0, 4) || []
  const featuredDocs = catalog?.recentDocs.slice(0, 4) || []
  const explicitSource = activeSourceId ? sources.find((item) => item.id === activeSourceId) || null : null
  const currentSourceName = explicitSource?.name || source.name || '当前文档库'
  const normalizedSearchQuery = searchQuery.trim()
  const visibleSearchResults = (searchResults || []).slice(0, 8)
  const isGuidePage = (pageId: GuidePageId) => guidePageId === pageId
  const labels = guideLabels[guideLocale]
  const guideTitle = labels[guidePageId] || labels['getting-started']
  const [openSections, setOpenSections] = useState<Record<SidebarSectionId, boolean>>({
    intro: true,
    sources: true,
    routes: true,
  })
  const toggleSection = (sectionId: SidebarSectionId) => {
    setOpenSections((current) => ({ ...current, [sectionId]: !current[sectionId] }))
  }

  return (
    <PageShell className="axi-docs-home" compact>
      <aside className="axi-docs-home__sidebar" aria-label="侧边栏导航">
        <nav className="axi-docs-home__sidebar-section" aria-label="简介">
          <button aria-expanded={openSections.intro} className="axi-docs-home__sidebar-toggle" onClick={() => toggleSection('intro')} type="button">
            <span>简介</span>
            <span aria-hidden="true" className="axi-docs-home__sidebar-caret">⌄</span>
          </button>
          {openSections.intro && (
            <div className="axi-docs-home__sidebar-items">
              {guidePageOrder.map((pageId) => (
                <a
                  key={pageId}
                  className={`axi-docs-home__nav-link${pageId === guidePageId ? ' active' : ''}`}
                  href={buildGuideHref(guideLocale, pageId)}
                >
                  {labels[pageId]}
                </a>
              ))}
            </div>
          )}
        </nav>

        <nav className="axi-docs-home__sidebar-section" aria-label="文档库">
          <button aria-expanded={openSections.sources} className="axi-docs-home__sidebar-toggle" onClick={() => toggleSection('sources')} type="button">
            <span>文档库</span>
            <span aria-hidden="true" className="axi-docs-home__sidebar-caret">⌄</span>
          </button>
          {openSections.sources && (
            <div className="axi-docs-home__sidebar-items">
              {sources.map((item) => (
                <button
                  key={item.id}
                  className={`axi-docs-home__source-link${item.id === activeSourceId ? ' active' : ''}`}
                  onClick={() => onSourceSelect(item.id)}
                  type="button"
                >
                  <span>{item.name}</span>
                  <small>{item.kind || item.adapter || item.type}</small>
                </button>
              ))}
            </div>
          )}
        </nav>

        <nav className="axi-docs-home__sidebar-section" aria-label="推荐路径">
          <button aria-expanded={openSections.routes} className="axi-docs-home__sidebar-toggle" onClick={() => toggleSection('routes')} type="button">
            <span>推荐路径</span>
            <span aria-hidden="true" className="axi-docs-home__sidebar-caret">⌄</span>
          </button>
          {openSections.routes && (
            <div className="axi-docs-home__sidebar-items">
              {primarySections.length > 0 ? primarySections.map((section) => (
                <button key={section.key} className="axi-docs-home__nav-card" onClick={onOpenExplorer} type="button">
                  <span>{section.title}</span>
                  <small>{section.count} 篇文档</small>
                </button>
              )) : (
                <button className="axi-docs-home__nav-card" onClick={onOpenExplorer} type="button">
                  <span>浏览当前文档库</span>
                  <small>{currentSourceName}</small>
                </button>
              )}
            </div>
          )}
        </nav>
      </aside>

      <main className="axi-docs-home__content">
        <article className="axi-docs-home__doc" id="overview">
          <h1>{guideTitle}</h1>

          {isGuidePage('what-is-axi-docs') && (
            <section className="axi-docs-home__section" id="what-is-axi-docs">
              <h2>{labels['what-is-axi-docs']}</h2>
              {guideLocale === 'zh' ? (
                <p>
                  Axi Docs 是一个基于 React 的专业文档站，把 workspace 文档、Axi Skills 和长期知识库整理成统一入口。
                  它的首要目标是让人可以像阅读 VitePress 文档一样浏览内容，同时保留搜索、知识图谱和 Agent 调用能力。
                </p>
              ) : (
                <p>
                  Axi Docs is a React-based documentation site that organizes workspace docs,
                  Axi Skills, and long-running knowledge sources into one reading surface.
                  It follows the VitePress document model while keeping search, graph, and Agent access available.
                </p>
              )}
            </section>
          )}

          {isGuidePage('getting-started') && (
            <section className="axi-docs-home__section" id="getting-started">
            <h2>{labels['getting-started']}</h2>
            {guideLocale === 'zh' ? (
              <p>
                Axi Docs 的默认入口是指南页，不等同于某一个文档来源。先按左侧目录理解文档站结构，
                再通过顶部搜索、文档库目录或右侧来源卡片进入具体 workspace、skills 和知识库内容。
              </p>
            ) : (
              <p>
                The default Axi Docs entry is a guide page, not a single knowledge source.
                Start with the sidebar structure, then use search, source navigation, or the right rail
                to open workspace, skills, and knowledge-base documents.
              </p>
            )}
            <div className="axi-docs-home__package-tabs" aria-label="运行命令">
              <span className="active">pnpm</span>
              <span>npm</span>
              <span>yarn</span>
              <span>bun</span>
            </div>
            <div className="axi-docs-home__code-card">
              <code>$ pnpm dev</code>
            </div>
            <div className="axi-docs-home__callout">
              <strong>{guideLocale === 'zh' ? '注意' : 'Note'}</strong>
              <p>
                {guideLocale === 'zh'
                  ? '首页不再作为营销页使用。默认阅读路径应保持为文档结构：左侧目录、中央正文、右侧页面导航。'
                  : 'The default route is a document page. Keep the reading path structured as sidebar, document body, and page outline.'}
              </p>
            </div>
            </section>
          )}

          {isGuidePage('getting-started') && (
            <section className="axi-docs-home__section" id="file-structure">
              <h2>{guideLocale === 'zh' ? '文档结构' : 'File Structure'}</h2>
              {guideLocale === 'zh' ? (
                <>
                  <p>文档站当前把内容分成三类入口：</p>
                  <ul>
                    <li><strong>文档库</strong>：workspace、skills、Obsidian 等来源的真实文档。</li>
                    <li><strong>阅读路径</strong>：按分类、项目知识、架构决策和编码规范组织的导航。</li>
                    <li><strong>搜索结果</strong>：从标题、中文描述、路径、标签和正文中映射出的候选文档。</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>The docs surface has three primary entry types:</p>
                  <ul>
                    <li><strong>Sources</strong>: real documents from workspace, skills, and vaults.</li>
                    <li><strong>Reading paths</strong>: navigation grouped by category, project knowledge, architecture decisions, and coding standards.</li>
                    <li><strong>Search results</strong>: candidates matched from titles, descriptions, paths, tags, and body content.</li>
                  </ul>
                </>
              )}
            </section>
          )}

          {isGuidePage('search') && (
            <section className="axi-docs-home__section" id="search-results" aria-live="polite">
            <h2>{normalizedSearchQuery
              ? (guideLocale === 'zh' ? `“${normalizedSearchQuery}” 的匹配文档` : `Matches for "${normalizedSearchQuery}"`)
              : (guideLocale === 'zh' ? '搜索文档' : 'Search Docs')}</h2>
            {normalizedSearchQuery ? (
              searching ? (
                <div className="axi-docs-home__code-card">
                  <p>{guideLocale === 'zh' ? '正在检索文档库...' : 'Searching documentation sources...'}</p>
                </div>
              ) : visibleSearchResults.length > 0 ? (
                <div className="axi-docs-home__result-list">
                  {visibleSearchResults.map((item) => (
                    <button key={`${item.sourceId}:${item.path}`} onClick={() => onOpenItem(item.sourceId, item.path)} type="button">
                      <strong>{item.title || item.name}</strong>
                      <span>{item.description || item.snippet || item.path}</span>
                      <small>{item.path}</small>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="axi-docs-home__code-card">
                  <p>{guideLocale === 'zh'
                    ? '没有找到匹配文档。换一个关键词，或从下方推荐阅读路径继续浏览。'
                    : 'No matching documents found. Try another keyword or continue from a recommended reading path.'}</p>
                </div>
              )
            ) : (
              <p>
                {guideLocale === 'zh' ? '按 ' : 'Press '}
                <kbd>⌘K</kbd>
                {guideLocale === 'zh'
                  ? ' 或点击顶部搜索框，输入标题、中文描述、路径或标签即可搜索。'
                  : ' or click the top search field, then search by title, description, path, or tag.'}
              </p>
            )}
            </section>
          )}

          {isGuidePage('next-steps') && (
            <section className="axi-docs-home__section" id="next-steps">
            <h2>{labels['next-steps']}</h2>
            <ul>
              <li>
                {guideLocale === 'zh' ? '需要按目录阅读时，点击' : 'To read by directory, open '}
                {' '}
                <button className="axi-docs-home__inline-action" onClick={onOpenExplorer} type="button">
                  {guideLocale === 'zh' ? '打开文档库目录' : 'the document library'}
                </button>
                {guideLocale === 'zh' ? '。' : '.'}
              </li>
              {skillSource && (
                <li>
                  {guideLocale === 'zh' ? '需要查看 Agent 工作流时，打开' : 'To inspect Agent workflows, open '}
                  {' '}
                  <button className="axi-docs-home__inline-action" onClick={() => onOpenItem('axi-skills', 'docs/SKILL_INDEX.md')} type="button">
                    {guideLocale === 'zh' ? 'Axi Skills 索引' : 'the Axi Skills index'}
                  </button>
                  {guideLocale === 'zh' ? '。' : '.'}
                </li>
              )}
              {featuredDocs.length > 0 && (
                <li>
                  {guideLocale === 'zh' ? '最近更新包括 ' : 'Recent updates include '}
                  {featuredDocs.slice(0, 3).map((item) => item.title).join(guideLocale === 'zh' ? '、' : ', ')}
                  {guideLocale === 'zh' ? '。' : '.'}
                </li>
              )}
            </ul>
            </section>
          )}

          {isGuidePage('next-steps') && featuredDocs.length > 0 && (
            <section className="axi-docs-home__section" id="recent-docs">
              <h2>{guideLocale === 'zh' ? '最近更新' : 'Recent Updates'}</h2>
              <div className="axi-docs-home__result-list">
                {featuredDocs.map((item) => (
                  <button key={`${item.sourceId}:${item.path}`} onClick={() => onOpenItem(item.sourceId, item.path)} type="button">
                    <strong>{item.title}</strong>
                    <span>{item.description || item.path}</span>
                    <small>{item.path}</small>
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="axi-docs-home__footer-nav" aria-label="分页器">
            <button onClick={onOpenExplorer} type="button">
              <span>下一页</span>
              <strong>{guideLocale === 'zh' ? '文档库目录' : 'Document Library'}</strong>
            </button>
          </div>
        </article>
      </main>

      <aside className="axi-docs-home__outline" aria-label="页面导航">
        <div className="axi-docs-home__outline-card">
          <span className="axi-docs-home__nav-label">页面导航</span>
          {isGuidePage('what-is-axi-docs') && <a href="#what-is-axi-docs">{labels['what-is-axi-docs']}</a>}
          {isGuidePage('getting-started') && <a href="#getting-started">{labels['getting-started']}</a>}
          {isGuidePage('getting-started') && <a href="#file-structure">{guideLocale === 'zh' ? '文档结构' : 'File Structure'}</a>}
          {isGuidePage('search') && <a href="#search-results">{guideLocale === 'zh' ? '搜索文档' : 'Search Docs'}</a>}
          {isGuidePage('next-steps') && <a href="#next-steps">{labels['next-steps']}</a>}
          {isGuidePage('next-steps') && featuredDocs.length > 0 && <a href="#recent-docs">{guideLocale === 'zh' ? '最近更新' : 'Recent Updates'}</a>}
        </div>

        <div className="axi-docs-home__outline-card" id="sources">
          <span className="axi-docs-home__nav-label">{explicitSource ? '当前来源' : '文档来源'}</span>
          <strong>{explicitSource ? currentSourceName : '未锁定来源'}</strong>
          <p>
            {explicitSource
              ? explicitSource.description || '当前文档库已经接入 Axi Docs。'
              : '指南页默认不激活具体文档库。选择左侧来源后，才进入对应的 workspace、skills 或知识库。'}
          </p>
          {explicitSource && recentProjects.length > 0 && <small>{recentProjects.length} 个近期项目入口</small>}
        </div>
      </aside>
    </PageShell>
  )
}
