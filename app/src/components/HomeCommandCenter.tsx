import { useMemo, useState } from 'react'
import { DocSource, KnowledgeCatalog, SearchResult, SelectedFile } from '../types'
import { PageShell } from './CockpitPrimitives'

type SidebarSectionId = string
export type DocSetId = 'guide' | 'skills' | 'workspace'
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
  onClearSelectedFile: () => void
  graphFocusPath?: string | null
  docSet?: DocSetId
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
  selectedFile,
  onOpenExplorer,
  onOpenItem,
  docSet = 'guide',
  guideLocale = 'zh',
  guidePageId = 'getting-started',
}: HomeCommandCenterProps) {
  const isGuideDocSet = docSet === 'guide'
  const isSkillsDocSet = docSet === 'skills'
  const recentProjects = catalog?.recentDocs.filter((item) => item.docType === 'project').slice(0, 5) || []
  const skillSource = sources.find((item) => item.id === 'axi-skills')
  const dbskillSource = sources.find((item) => item.id === 'dbskill')
  const primarySections = useMemo(() => {
    const seen = new Set<string>()
    const sectionLimit = isSkillsDocSet ? 12 : 4

    return (catalog?.sections.slice(0, sectionLimit) || [])
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const key = `${item.sourceId}:${item.path}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        }),
      }))
      .filter((section) => section.items.length > 0)
  }, [catalog?.sections, isSkillsDocSet])
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
  })
  const toggleSection = (sectionId: SidebarSectionId) => {
    setOpenSections((current) => ({ ...current, [sectionId]: !current[sectionId] }))
  }
  const isSectionOpen = (sectionId: SidebarSectionId) => openSections[sectionId] ?? true

  const renderCatalogSidebarSection = (section: NonNullable<KnowledgeCatalog['sections']>[number]) => {
    const sectionId = `catalog:${section.key}`
    const open = isSectionOpen(sectionId)
    const itemLimit = isSkillsDocSet ? 24 : 12

    return (
      <nav key={section.key} className="axi-docs-home__sidebar-section" aria-label={section.title}>
        <button aria-expanded={open} className="axi-docs-home__sidebar-toggle" onClick={() => toggleSection(sectionId)} type="button">
          <span>{section.title}</span>
          {isSkillsDocSet && <small>{section.count}</small>}
          <span aria-hidden="true" className="axi-docs-home__sidebar-caret">⌄</span>
        </button>
        {open && (
          <div className="axi-docs-home__sidebar-items">
            {section.items.slice(0, itemLimit).map((item) => (
              <button
                key={`${item.sourceId}:${item.path}`}
                className={`axi-docs-home__sidebar-link${item.sourceId === activeSourceId && item.path === selectedFile?.path ? ' active' : ''}`}
                onClick={() => onOpenItem(item.sourceId, item.path)}
                title={item.description || item.path}
                type="button"
              >
                {item.title || item.name}
              </button>
            ))}
            {section.items.length > itemLimit && (
              <button className="axi-docs-home__nav-card" onClick={onOpenExplorer} type="button">
                <span>{guideLocale === 'zh' ? '查看本组全部技能' : 'Browse This Group'}</span>
                <small>{section.items.length - itemLimit} {guideLocale === 'zh' ? '个技能未在侧栏展开' : 'more skills hidden in the sidebar'}</small>
              </button>
            )}
            {section.items.length === 0 && (
              <button className="axi-docs-home__nav-card" onClick={onOpenExplorer} type="button">
                <span>{guideLocale === 'zh' ? '浏览目录' : 'Browse Directory'}</span>
                <small>{section.description}</small>
              </button>
            )}
          </div>
        )}
      </nav>
    )
  }

  return (
    <PageShell className="axi-docs-home" compact>
      <aside className="axi-docs-home__sidebar" aria-label="侧边栏导航">
        {isGuideDocSet ? (
          <nav className="axi-docs-home__sidebar-section" aria-label="指南">
            <button aria-expanded={isSectionOpen('intro')} className="axi-docs-home__sidebar-toggle" onClick={() => toggleSection('intro')} type="button">
              <span>简介</span>
              <span aria-hidden="true" className="axi-docs-home__sidebar-caret">⌄</span>
            </button>
            {isSectionOpen('intro') && (
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
        ) : (
          <>
            {primarySections.map(renderCatalogSidebarSection)}
            {primarySections.length === 0 && (
              <nav className="axi-docs-home__sidebar-section" aria-label={currentSourceName}>
                <button aria-expanded={isSectionOpen('catalog:fallback')} className="axi-docs-home__sidebar-toggle" onClick={() => toggleSection('catalog:fallback')} type="button">
                  <span>{currentSourceName}</span>
                  <span aria-hidden="true" className="axi-docs-home__sidebar-caret">⌄</span>
                </button>
                {isSectionOpen('catalog:fallback') && (
                  <div className="axi-docs-home__sidebar-items">
                    <button className="axi-docs-home__nav-card" onClick={onOpenExplorer} type="button">
                      <span>{guideLocale === 'zh' ? '浏览当前文档集' : 'Browse Current Docs'}</span>
                      <small>{source.description || currentSourceName}</small>
                    </button>
                  </div>
                )}
              </nav>
            )}
          </>
        )}
      </aside>

      <main className="axi-docs-home__content">
        <article className="axi-docs-home__doc" id="overview">
          <h1>{isGuideDocSet ? guideTitle : currentSourceName}</h1>

          {!isGuideDocSet && (
            <section className="axi-docs-home__section" id="doc-set-overview">
              <h2>{guideLocale === 'zh' ? '文档集概览' : 'Docs Overview'}</h2>
              <p>{source.description || (guideLocale === 'zh' ? '当前顶级导航对应的文档集。左侧显示该文档集内部目录。' : 'This top-level navigation item maps to the document set shown in the left sidebar.')}</p>
              {isSkillsDocSet && catalog && (
                <div className="axi-docs-home__stats-grid" aria-label="技能库统计">
                  <div>
                    <strong>{catalog.totalDocs}</strong>
                    <span>{guideLocale === 'zh' ? '个已索引条目' : 'indexed entries'}</span>
                  </div>
                  <div>
                    <strong>{catalog.sections.length}</strong>
                    <span>{guideLocale === 'zh' ? '个能力分组' : 'capability groups'}</span>
                  </div>
                  <div>
                    <strong>{dbskillSource ? 'dbskill' : 'family'}</strong>
                    <span>{guideLocale === 'zh' ? '组织方式' : 'organization'}</span>
                  </div>
                </div>
              )}
              {isSkillsDocSet && dbskillSource && (
                <div className="axi-docs-home__callout">
                  <strong>{guideLocale === 'zh' ? '组织基线' : 'Organization baseline'}</strong>
                  <p>
                    {guideLocale === 'zh'
                      ? '技能库保留 Axi Skills 的 700+ 实际技能入口，同时按最新 dbskill 的工具箱思路拆成能力分组；dbskill 自身也作为独立来源接入，可通过全局搜索检索 dbs 方法、知识包和内容工程模板。'
                      : 'The Skills collection keeps the 700+ Axi Skills entries while grouping them with the latest dbskill toolbox model. dbskill is also connected as a standalone source for DBS methods, knowledge packs, and content-engineering templates.'}
                  </p>
                </div>
              )}
              {primarySections.length > 0 && (
                <div className="axi-docs-home__result-list">
                  {primarySections.map((section) => (
                    <button key={section.key} onClick={onOpenExplorer} type="button">
                      <strong>{section.title}</strong>
                      <span>{section.description}</span>
                      <small>{section.count} {guideLocale === 'zh' ? '篇文档' : 'docs'}</small>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {isGuideDocSet && isGuidePage('what-is-axi-docs') && (
            <section className="axi-docs-home__section" id="what-is-axi-docs">
              <h2>{labels['what-is-axi-docs']}</h2>
              {guideLocale === 'zh' ? (
                <p>
                  Axi Docs 是一个基于 React 的专业文档站，把 workspace 文档、长期知识库和顶级技能库整理成统一入口。
                  它的首要目标是让人可以像阅读 VitePress 文档一样浏览内容，同时保留搜索、知识图谱和 Agent 调用能力。
                </p>
              ) : (
                <p>
                  Axi Docs is a React-based documentation site that organizes workspace docs,
                  long-running knowledge sources, and a top-level skills library into one reading surface.
                  It follows the VitePress document model while keeping search, graph, and Agent access available.
                </p>
              )}
            </section>
          )}

          {isGuideDocSet && isGuidePage('getting-started') && (
            <section className="axi-docs-home__section" id="getting-started">
            <h2>{labels['getting-started']}</h2>
            {guideLocale === 'zh' ? (
              <p>
                Axi Docs 的默认入口是指南页，不等同于某一个文档来源。顶部导航选择文档集，
                左侧目录展示当前文档集内部页面，再通过顶部搜索或正文入口进入具体内容。
              </p>
            ) : (
              <p>
                The default Axi Docs entry is a guide page, not a single knowledge source.
                Top navigation selects a document set. The left sidebar then shows pages inside that current set,
                while search and document links open the concrete content.
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

          {isGuideDocSet && isGuidePage('getting-started') && (
            <section className="axi-docs-home__section" id="file-structure">
              <h2>{guideLocale === 'zh' ? '文档结构' : 'File Structure'}</h2>
              {guideLocale === 'zh' ? (
                <>
                  <p>文档站当前把内容分成三类入口：</p>
                  <ul>
                    <li><strong>顶级导航</strong>：指南、技能库、工作区等文档集入口。</li>
                    <li><strong>侧边栏</strong>：当前文档集内部的章节和页面。</li>
                    <li><strong>搜索结果</strong>：从标题、中文描述、路径、标签和正文中映射出的候选文档。</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>The docs surface has three primary entry types:</p>
                  <ul>
                    <li><strong>Top navigation</strong>: document sets such as Guide, Skills, and Workspace.</li>
                    <li><strong>Sidebar</strong>: sections and pages inside the current document set.</li>
                    <li><strong>Search results</strong>: candidates matched from titles, descriptions, paths, tags, and body content.</li>
                  </ul>
                </>
              )}
            </section>
          )}

          {isGuideDocSet && isGuidePage('search') && (
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

          {isGuideDocSet && isGuidePage('next-steps') && (
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
                  <a className="axi-docs-home__inline-action" href={`/${guideLocale}/skills`}>
                    {guideLocale === 'zh' ? 'Axi Skills 索引' : 'the Axi Skills index'}
                  </a>
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

          {isGuideDocSet && isGuidePage('next-steps') && featuredDocs.length > 0 && (
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

          {!isGuideDocSet && featuredDocs.length > 0 && (
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

          {isGuideDocSet && (
            <div className="axi-docs-home__footer-nav" aria-label="分页器">
            <button onClick={onOpenExplorer} type="button">
              <span>下一页</span>
              <strong>{guideLocale === 'zh' ? '文档库目录' : 'Document Library'}</strong>
            </button>
            </div>
          )}
        </article>
      </main>

      <aside className="axi-docs-home__outline" aria-label="页面导航">
        <div className="axi-docs-home__outline-card">
          <span className="axi-docs-home__nav-label">页面导航</span>
          {!isGuideDocSet && <a href="#doc-set-overview">{guideLocale === 'zh' ? '文档集概览' : 'Docs Overview'}</a>}
          {!isGuideDocSet && featuredDocs.length > 0 && <a href="#recent-docs">{guideLocale === 'zh' ? '最近更新' : 'Recent Updates'}</a>}
          {isGuideDocSet && isGuidePage('what-is-axi-docs') && <a href="#what-is-axi-docs">{labels['what-is-axi-docs']}</a>}
          {isGuideDocSet && isGuidePage('getting-started') && <a href="#getting-started">{labels['getting-started']}</a>}
          {isGuideDocSet && isGuidePage('getting-started') && <a href="#file-structure">{guideLocale === 'zh' ? '文档结构' : 'File Structure'}</a>}
          {isGuideDocSet && isGuidePage('search') && <a href="#search-results">{guideLocale === 'zh' ? '搜索文档' : 'Search Docs'}</a>}
          {isGuideDocSet && isGuidePage('next-steps') && <a href="#next-steps">{labels['next-steps']}</a>}
          {isGuideDocSet && isGuidePage('next-steps') && featuredDocs.length > 0 && <a href="#recent-docs">{guideLocale === 'zh' ? '最近更新' : 'Recent Updates'}</a>}
        </div>

        <div className="axi-docs-home__outline-card" id="sources">
          <span className="axi-docs-home__nav-label">{explicitSource ? '当前来源' : '文档来源'}</span>
          <strong>{explicitSource ? currentSourceName : '未锁定来源'}</strong>
          <p>
            {explicitSource
              ? explicitSource.description || '当前文档集已经接入 Axi Docs。'
              : '指南页默认不激活具体文档集。顶部导航选择文档集后，左侧显示该文档集目录。'}
          </p>
          {explicitSource && recentProjects.length > 0 && <small>{recentProjects.length} 个近期项目入口</small>}
        </div>
      </aside>
    </PageShell>
  )
}
