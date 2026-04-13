import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { pageCopy } from '../config/pageCopy'
import {
  formatKnowledgeBranchPath,
  formatKnowledgeItemTitle,
  formatKnowledgeTagLabel,
} from '../lib/knowledgeFormatter'
import { buildCategoryRoute } from '../lib/routes'
import type { DocSource, KnowledgeCatalog, KnowledgeCatalogSection, SelectedFile } from '../types'
import { CompactEmptyState, MetricPill, PageShell, RailPanel, SectionHeader, SegmentedTabs } from './CockpitPrimitives'
import { DocumentView } from './DocumentView'
import { FileIcon, FolderIcon, LinkIcon, SearchIcon, TagIcon } from './Icons'

const GlobalGraph = lazy(async () => {
  const module = await import('./GlobalGraph')
  return { default: module.GlobalGraph }
})

type CategoryExplorerView = 'tree' | 'path' | 'islands'

interface CategoryGraphPageProps {
  source: DocSource
  catalog: KnowledgeCatalog | null
  categorySection: KnowledgeCatalogSection | null
  selectedFile: SelectedFile | null
  fileContent: string | null
  fileName: string
  fileLoading: boolean
  searchQuery: string
  activeTag: string | null
  selectedBranch: string | null
  selectedNodeId: string | null
  view: CategoryExplorerView
  onNavigateHome: () => void
  onSelectCategoryRoute: (route: string) => void
  onViewChange: (view: CategoryExplorerView) => void
  onBranchChange: (branch: string | null) => void
  onNodeChange: (node: string | null) => void
  onPreviewItem: (sourceId: string, path: string) => void
  onOpenItem: (sourceId: string, path: string) => void
  onTagSelect: (tag: string | null) => void
  onWikiLink: (noteName: string) => void
}

function resolveGraphMode(view: CategoryExplorerView) {
  if (view === 'islands') return 'orphan'
  if (view === 'path') return 'focus'
  return 'tree'
}

function documentTitle(item: { title?: string | null; name?: string | null; path?: string | null }) {
  return formatKnowledgeItemTitle(item)
}

export function CategoryGraphPage({
  source,
  catalog,
  categorySection,
  selectedFile,
  fileContent,
  fileName,
  fileLoading,
  searchQuery,
  activeTag,
  selectedBranch,
  selectedNodeId,
  view,
  onNavigateHome,
  onSelectCategoryRoute,
  onViewChange,
  onBranchChange,
  onNodeChange,
  onPreviewItem,
  onOpenItem,
  onTagSelect,
  onWikiLink,
}: CategoryGraphPageProps) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const [viewport, setViewport] = useState({ width: 1280, height: 900 })
  const [asideTab, setAsideTab] = useState<'preview' | 'reading'>('preview')

  useEffect(() => {
    if (!stageRef.current) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      setViewport({
        width: Math.max(Math.round(entry.contentRect.width), 320),
        height: Math.max(Math.round(entry.contentRect.height), 480),
      })
    })
    observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [])

  const categoryTags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of categorySection?.items || []) {
      for (const tag of item.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1)
      }
    }

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, 'zh-CN'))
      .slice(0, 8)
  }, [categorySection?.items])

  const selectedCatalogItem = useMemo(
    () => categorySection?.items.find((item) => item.path === selectedFile?.path) || categorySection?.items[0] || null,
    [categorySection?.items, selectedFile?.path],
  )

  useEffect(() => {
    if (selectedFile) {
      setAsideTab('preview')
    }
  }, [selectedFile?.path])

  return (
    <PageShell className="category-graph-page" compact>
      <div className="category-graph-page__header">
        <div className="category-graph-page__breadcrumbs">
          <button className="category-graph-page__crumb" onClick={onNavigateHome} type="button">
            知识总览
          </button>
          <span>/</span>
          <span className="category-graph-page__crumb category-graph-page__crumb--current">
            {categorySection?.title || '分类图谱'}
          </span>
        </div>

        <div className="category-graph-page__toolbar">
          <SegmentedTabs
            className="category-graph-page__views"
            items={[
              { value: 'tree', label: '树构' },
              { value: 'path', label: '路径' },
              { value: 'islands', label: '孤岛' },
            ]}
            onChange={onViewChange}
            value={view}
          />

          {(searchQuery.trim() || activeTag || selectedBranch) && (
            <div className="category-graph-page__states">
              {searchQuery.trim() && (
                <span className="category-graph-page__state">
                  <SearchIcon />
                  <span>{searchQuery}</span>
                </span>
              )}
              {activeTag && (
                <button className="category-graph-page__state" onClick={() => onTagSelect(null)} type="button">
                  #{formatKnowledgeTagLabel(activeTag)}
                </button>
              )}
              {selectedBranch && <span className="category-graph-page__state">分支 {formatKnowledgeBranchPath(selectedBranch)}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="category-graph-page__layout">
        <aside className="category-graph-page__sidebar">
          <RailPanel className="category-graph-page__panel category-graph-page__panel--summary" tone="primary">
            <SectionHeader
              description={categorySection?.description || pageCopy.category.fallbackDescription}
              eyebrow={source.name}
              title={<h1>{categorySection?.title || pageCopy.category.fallbackTitle}</h1>}
            />
            <div className="category-graph-page__metrics">
              <MetricPill accent="blue" label="文档数" value={categorySection?.count || 0} />
              <MetricPill accent="teal" label="高频标签" value={categoryTags.length} />
            </div>
          </RailPanel>

          <RailPanel className="category-graph-page__panel category-graph-page__panel--scroll" tone="secondary">
            <SectionHeader
              compact
              eyebrow={pageCopy.category.railTitle}
              meta={<span>{catalog?.sections.length || 0} 个分类</span>}
              title={<strong>快速切换分类</strong>}
              description={pageCopy.category.railDescription}
            />
            <div className="category-graph-page__section-list">
              {(catalog?.sections || []).map((section) => (
                <button
                  key={section.key}
                  className={`category-graph-page__section-item${section.key === categorySection?.key ? ' active' : ''}`}
                  onClick={() => onSelectCategoryRoute(buildCategoryRoute(section.key))}
                  type="button"
                >
                  <div>
                    <strong>{section.title}</strong>
                    <span>{section.description}</span>
                  </div>
                  <small>{section.count}</small>
                </button>
              ))}
            </div>
          </RailPanel>

          <RailPanel className="category-graph-page__panel category-graph-page__panel--scroll" tone="ghost">
            <SectionHeader
              compact
              eyebrow="核心入口"
              meta={<span>{Math.min(categorySection?.items.length || 0, 8)} 条</span>}
              title={<strong>文档入口与高频标签</strong>}
            />
            <div className="category-graph-page__document-list">
              {(categorySection?.items.slice(0, 8) || []).map((item) => (
                <button
                  key={`${item.sourceId}:${item.path}`}
                  className={`category-graph-page__document-link${selectedFile?.path === item.path ? ' active' : ''}`}
                  onClick={() => {
                    onNodeChange(item.path)
                    onPreviewItem(item.sourceId, item.path)
                  }}
                  onDoubleClick={() => onOpenItem(item.sourceId, item.path)}
                  type="button"
                >
                  <FileIcon />
                  <div>
                    <strong>{documentTitle(item)}</strong>
                    <span>{item.path}</span>
                  </div>
                </button>
              ))}
            </div>
            {categoryTags.length > 0 && (
              <div className="category-graph-page__tag-list">
                {categoryTags.map((tag) => (
                  <button key={tag.name} className="category-graph-page__tag" onClick={() => onTagSelect(tag.name)} type="button">
                    #{formatKnowledgeTagLabel(tag.name)}
                    <small>{tag.count}</small>
                  </button>
                ))}
              </div>
            )}
          </RailPanel>
        </aside>

        <RailPanel className="category-graph-page__graph-panel" tone="primary">
          <SectionHeader
            className="category-graph-page__graph-header"
            compact
            description="单击节点更新右侧预览，双击进入完整文档；树构模式下可继续沿分支深入。"
            eyebrow="图谱舞台"
            meta={<span>{view === 'tree' ? '树构主视图' : view === 'path' ? '路径聚焦' : '孤岛巡检'}</span>}
            title={<strong>{categorySection?.title || pageCopy.category.fallbackTitle}</strong>}
          />

          <div className="category-graph-page__graph-stage" ref={stageRef}>
            <Suspense
              fallback={(
                <div className="hero-knowledge-scene__fallback">
                  <div className="spinner" />
                  <span>正在加载分类图谱...</span>
                </div>
              )}
            >
              <GlobalGraph
                focusPath={selectedFile?.path || categorySection?.items[0]?.path || null}
                chrome="cockpit"
                height={viewport.height}
                layout="dock"
                mode={resolveGraphMode(view)}
                onBranchChange={onBranchChange}
                onNavigate={(path) => onOpenItem(source.id, path)}
                onNodeSelect={onNodeChange}
                onNotePreview={(path) => onPreviewItem(source.id, path)}
                onTagSelect={(tag) => onTagSelect(tag)}
                selectedBranch={selectedBranch}
                selectedNodeId={selectedNodeId}
                sourceId={source.id}
                filterPaths={categorySection?.items.map((item) => item.path)}
                width={viewport.width}
              />
            </Suspense>
          </div>
        </RailPanel>

        <aside className="category-graph-page__preview">
          <RailPanel className="category-graph-page__panel category-graph-page__panel--intel" tone="secondary">
            <SectionHeader
              compact
              eyebrow={pageCopy.category.nodeIntel}
              meta={selectedCatalogItem?.docType || '等待选择'}
              title={<strong>{selectedCatalogItem ? documentTitle(selectedCatalogItem) : '先选择一个节点'}</strong>}
              actions={selectedFile ? (
                <button className="category-graph-page__inline-action" onClick={() => onOpenItem(selectedFile.sourceId, selectedFile.path)} type="button">
                  打开详情
                </button>
              ) : null}
            />
            {selectedCatalogItem ? (
              <div className="category-graph-page__intel-stack">
                <p className="category-graph-page__intel-description">
                  {selectedCatalogItem.description || '当前节点会在这里展示摘要、标签和所属路径。'}
                </p>
                <div className="category-graph-page__metrics">
                  <MetricPill accent="blue" label="所属分类" value={categorySection?.title || '-'} />
                  <MetricPill accent="teal" label="标签数" value={selectedCatalogItem.tags.length} />
                  <MetricPill accent="amber" label="技术栈" value={selectedCatalogItem.techStack.length} />
                </div>
                <div className="category-graph-page__intel-path">
                  <FileIcon />
                  <span>{selectedCatalogItem.path}</span>
                </div>
                {selectedCatalogItem.tags.length > 0 && (
                  <div className="category-graph-page__tag-list">
                    {selectedCatalogItem.tags.slice(0, 8).map((tag) => (
                      <button key={tag} className="category-graph-page__tag" onClick={() => onTagSelect(tag)} type="button">
                        <TagIcon />
                        <span>{formatKnowledgeTagLabel(tag)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <CompactEmptyState
                icon={<LinkIcon />}
                title="还没有选中文档"
                description="单击图谱节点或左侧入口，即可在这里查看节点情报。"
              />
            )}
          </RailPanel>

          <RailPanel className="category-graph-page__panel category-graph-page__panel--preview" tone="primary">
            <SectionHeader
              compact
              actions={(
                <SegmentedTabs
                  items={[
                    { value: 'preview', label: pageCopy.category.previewTab },
                    { value: 'reading', label: pageCopy.category.readingTab },
                  ]}
                  onChange={setAsideTab}
                  value={asideTab}
                />
              )}
              eyebrow="阅读区"
              title={<strong>{asideTab === 'preview' ? pageCopy.category.previewTab : pageCopy.category.readingTab}</strong>}
            />

            {asideTab === 'preview' ? (
              selectedFile ? (
                <div className="category-graph-page__preview-document">
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
                  className="category-graph-page__preview-empty"
                  icon={<LinkIcon />}
                  title="还没有选中文档"
                  description="单击图谱节点或左侧入口，即可在这里固定预览原文。"
                />
              )
            ) : (
              <div className="category-graph-page__document-list">
                {(categorySection?.items.slice(0, 6) || []).map((item) => (
                  <button
                    key={`${item.sourceId}:${item.path}:recommend`}
                    className="category-graph-page__document-link"
                    onClick={() => onOpenItem(item.sourceId, item.path)}
                    type="button"
                  >
                    <FolderIcon />
                    <div>
                      <strong>{documentTitle(item)}</strong>
                      <span>{item.path}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </RailPanel>
        </aside>
      </div>
    </PageShell>
  )
}
