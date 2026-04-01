import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { pageCopy } from '../config/pageCopy'
import { buildCategoryRoute } from '../lib/routes'
import type { DocSource, KnowledgeCatalog, SearchResult, SelectedFile } from '../types'
import { CompactEmptyState, PageShell, RailPanel, SectionHeader, SegmentedTabs } from './CockpitPrimitives'
import { DocumentView } from './DocumentView'
import { FileIcon, FolderIcon, SearchIcon } from './Icons'

type SearchTab = 'all' | 'nodes' | 'docs'

interface SearchPageProps {
  source: DocSource
  catalog: KnowledgeCatalog | null
  searchQuery: string
  searching: boolean
  searchResults: SearchResult[]
  activeCategory: string | null
  onSetActiveCategory: (category: string | null) => void
  selectedFile: SelectedFile | null
  fileContent: string | null
  fileName: string
  fileLoading: boolean
  onNavigateHome: () => void
  onSearch: (query: string) => void
  onPreviewItem: (sourceId: string, path: string) => void
  onOpenItem: (sourceId: string, path: string) => void
  onOpenGraphRoute: (route: string, sourceId: string, path: string) => void
  onTagSelect: (tag: string | null) => void
  onWikiLink: (noteName: string) => void
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightText(text: string, query: string): ReactNode {
  if (!query.trim()) return text
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'))
  return parts.map((part, index) => (
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={`${part}-${index}`} className="search-page__highlight">{part}</mark>
      : <span key={`${part}-${index}`}>{part}</span>
  ))
}

function resultKind(result: SearchResult): 'node' | 'doc' {
  return result.matchedBy?.some((entry) => entry === 'content' || entry === 'description')
    ? 'doc'
    : 'node'
}

function summarizeResultType(result: SearchResult) {
  return resultKind(result) === 'doc' ? '文档内容' : '图谱节点'
}

export function SearchPage({
  source,
  catalog,
  searchQuery,
  searching,
  searchResults,
  activeCategory,
  onSetActiveCategory,
  selectedFile,
  fileContent,
  fileName,
  fileLoading,
  onNavigateHome,
  onSearch,
  onPreviewItem,
  onOpenItem,
  onOpenGraphRoute,
  onTagSelect,
  onWikiLink,
}: SearchPageProps) {
  const [activeTab, setActiveTab] = useState<SearchTab>('all')
  const [visibleCount, setVisibleCount] = useState(20)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const categoryFilteredResults = useMemo(() => (
    activeCategory
      ? searchResults.filter((result) => result.categories?.includes(activeCategory))
      : searchResults
  ), [activeCategory, searchResults])

  const nodeResults = useMemo(
    () => categoryFilteredResults.filter((result) => resultKind(result) === 'node'),
    [categoryFilteredResults],
  )
  const documentResults = useMemo(
    () => categoryFilteredResults.filter((result) => resultKind(result) === 'doc'),
    [categoryFilteredResults],
  )
  const visibleResults = useMemo(() => {
    const base = activeTab === 'nodes'
      ? nodeResults
      : activeTab === 'docs'
        ? documentResults
        : categoryFilteredResults
    return base.slice(0, visibleCount)
  }, [activeTab, categoryFilteredResults, documentResults, nodeResults, visibleCount])

  useEffect(() => {
    setVisibleCount(20)
  }, [activeCategory, activeTab, searchQuery])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return

      const currentTotal = activeTab === 'nodes'
        ? nodeResults.length
        : activeTab === 'docs'
          ? documentResults.length
          : categoryFilteredResults.length

      setVisibleCount((current) => Math.min(current + 20, currentTotal))
    }, { rootMargin: '200px' })

    observer.observe(node)
    return () => observer.disconnect()
  }, [activeTab, categoryFilteredResults.length, documentResults.length, nodeResults.length])

  return (
    <PageShell className="search-page" compact>
      <div className="search-page__workbenchbar">
        <SectionHeader
          actions={(
            <div className="search-page__hero-actions">
              <button className="search-page__hero-button search-page__hero-button--primary" onClick={onNavigateHome} type="button">
                返回首页
              </button>
              <button className="search-page__hero-button" onClick={() => onSearch(searchQuery)} type="button">
                重新检索
              </button>
            </div>
          )}
          description={pageCopy.search.description}
          eyebrow={source.name}
          meta={<span>{searching ? '搜索中...' : `结果 ${categoryFilteredResults.length} 条`}</span>}
          title={<h1>{pageCopy.search.title}</h1>}
        />
        <div className="search-page__workbench-controls">
          <SegmentedTabs
            items={[
              { value: 'all', label: '全部结果', badge: categoryFilteredResults.length },
              { value: 'nodes', label: '图谱节点', badge: nodeResults.length },
              { value: 'docs', label: '文档内容', badge: documentResults.length },
            ]}
            onChange={setActiveTab}
            value={activeTab}
          />
        </div>
      </div>

      <div className="search-page__filters">
        <button
          className={`search-page__filter${activeCategory === null ? ' active' : ''}`}
          onClick={() => onSetActiveCategory(null)}
          type="button"
        >
          全部分类
        </button>
        {(catalog?.sections || []).map((section) => (
          <button
            key={section.key}
            className={`search-page__filter${activeCategory === section.key ? ' active' : ''}`}
            onClick={() => onSetActiveCategory(activeCategory === section.key ? null : section.key)}
            type="button"
          >
            {section.title}
            <small>{searchResults.filter((result) => result.categories?.includes(section.key)).length}</small>
          </button>
        ))}
      </div>

      <div className="search-page__layout">
        <RailPanel className="search-page__results" tone="secondary">
          <SectionHeader
            compact
            eyebrow="检索结果"
            meta={<span>{searching ? '搜索中...' : `已显示 ${visibleResults.length} / ${activeTab === 'nodes' ? nodeResults.length : activeTab === 'docs' ? documentResults.length : categoryFilteredResults.length}`}</span>}
            title={<strong>{searchQuery.trim() || pageCopy.search.queryIdle}</strong>}
            description={searchQuery.trim() ? '标题、正文、路径与标签命中会统一回收到这里。' : '支持检索文档标题、路径、标签、分类提示和正文内容。'}
          />

          {searchQuery.trim() === '' ? (
            <CompactEmptyState
              className="search-page__empty"
              icon={<SearchIcon />}
              title="等待输入关键词"
              description="支持检索文档标题、路径、标签、分类提示和正文内容。"
            />
          ) : visibleResults.length === 0 ? (
            <CompactEmptyState
              className="search-page__empty"
              icon={<FolderIcon />}
              title="没有匹配结果"
              description="换一个关键词，或者切换上方分类与结果类型继续缩小范围。"
            />
          ) : (
            <div className="search-page__result-list">
              {visibleResults.map((result) => {
                const primaryCategory = result.categories?.[0]
                return (
                  <article
                    key={`${result.sourceId}:${result.path}`}
                    className={`search-page__result-card${selectedFile?.path === result.path ? ' active' : ''}`}
                    onClick={() => onPreviewItem(result.sourceId, result.path)}
                  >
                    <div className="search-page__result-topline">
                      <span>{summarizeResultType(result)}</span>
                      <span>{result.docType || 'note'}</span>
                    </div>
                    <h2>{highlightText(result.title || result.name, searchQuery)}</h2>
                    <p>{highlightText(result.snippet || result.description || result.path, searchQuery)}</p>
                    <div className="search-page__result-meta">
                      <span>{result.path}</span>
                      {primaryCategory && <span>{primaryCategory}</span>}
                      {result.matchedBy?.length ? <span>命中 {result.matchedBy.join(' / ')}</span> : null}
                    </div>

                    <div className="search-page__result-actions">
                      <button
                        className="search-page__result-button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onPreviewItem(result.sourceId, result.path)
                        }}
                        type="button"
                      >
                        预览证据
                      </button>
                      {primaryCategory && (
                        <button
                          className="search-page__result-button"
                          onClick={(event) => {
                            event.stopPropagation()
                            onOpenGraphRoute(buildCategoryRoute(primaryCategory), result.sourceId, result.path)
                          }}
                          type="button"
                        >
                          进入图谱
                        </button>
                      )}
                      <button
                        className="search-page__result-button search-page__result-button--primary"
                        onClick={(event) => {
                          event.stopPropagation()
                          onOpenItem(result.sourceId, result.path)
                        }}
                        type="button"
                      >
                        打开文档
                      </button>
                    </div>

                    {result.tags && result.tags.length > 0 && (
                      <div className="search-page__tag-row">
                        {result.tags.slice(0, 6).map((tag) => (
                          <button
                            key={`${result.path}:${tag}`}
                            className="search-page__tag"
                            onClick={(event) => {
                              event.stopPropagation()
                              onTagSelect(tag)
                            }}
                            type="button"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </article>
                )
              })}
              <div ref={sentinelRef} />
            </div>
          )}
        </RailPanel>

        <aside className="search-page__preview">
          <RailPanel className="search-page__preview-card" tone="primary">
            <SectionHeader
              compact
              actions={selectedFile ? (
                <button className="search-page__result-button search-page__result-button--primary" onClick={() => onOpenItem(selectedFile.sourceId, selectedFile.path)} type="button">
                  打开详情
                </button>
              ) : null}
              eyebrow="证据抽屉"
              title={<strong>{selectedFile ? '原文证据' : '等待预览'}</strong>}
              description={selectedFile ? '预览区会保留当前原文，方便在结果之间快速比对。' : '点击左侧结果即可把原文固定到这里。'}
            />

            {selectedFile ? (
              <div className="search-page__preview-document">
                <DocumentView
                  content={fileContent}
                  fileName={fileName}
                  loading={fileLoading}
                  onTagSelect={onTagSelect}
                  onWikiLink={onWikiLink}
                  selectedFile={selectedFile}
                  showKnowledgePanel={false}
                  source={source}
                  variant="panel"
                />
              </div>
            ) : (
              <CompactEmptyState
                className="search-page__empty search-page__empty--preview"
                icon={<FileIcon />}
                title="点击左侧结果即可固定预览"
                description="预览区会保留原文内容，方便你在不同结果之间快速比对证据。"
              />
            )}
          </RailPanel>
        </aside>
      </div>
    </PageShell>
  )
}
