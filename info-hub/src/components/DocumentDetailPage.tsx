import { buildCategoryRoute } from '../lib/routes'
import { pageCopy } from '../config/pageCopy'
import type { DocSource, KnowledgeCatalogItem, SelectedFile } from '../types'
import { CompactEmptyState, MetricPill, PageShell, RailPanel, SectionHeader } from './CockpitPrimitives'
import { ClockIcon, FileIcon, FolderIcon, SearchIcon, TagIcon } from './Icons'
import { DocumentView } from './DocumentView'
import { TableOfContents } from './TableOfContents'

interface DocumentDetailPageProps {
  source: DocSource
  selectedFile: SelectedFile
  selectedCatalogItem: KnowledgeCatalogItem | null
  fileContent: string | null
  fileName: string
  fileLoading: boolean
  categoryKey: string
  categoryTitle: string
  categoryDescription: string
  documentSiblings: KnowledgeCatalogItem[]
  relatedItems: KnowledgeCatalogItem[]
  onReturnToGraph: (route: string, sourceId: string, path: string) => void
  onOpenItem: (sourceId: string, path: string) => void
  onOpenSearch: (query: string) => void
  onTagSelect: (tag: string | null) => void
  onWikiLink: (noteName: string) => void
}

function documentTitle(title: string) {
  return title.replace(/\.md$/i, '')
}

export function DocumentDetailPage({
  source,
  selectedFile,
  selectedCatalogItem,
  fileContent,
  fileName,
  fileLoading,
  categoryKey,
  categoryTitle,
  categoryDescription,
  documentSiblings,
  relatedItems,
  onReturnToGraph,
  onOpenItem,
  onOpenSearch,
  onTagSelect,
  onWikiLink,
}: DocumentDetailPageProps) {
  const resolvedTitle = selectedCatalogItem?.title || fileName || selectedFile.path
  const resolvedDescription = selectedCatalogItem?.description || pageCopy.document.description
  const resolvedTags = selectedCatalogItem?.tags || []
  const resolvedTechStack = selectedCatalogItem?.techStack || []
  const updatedLabel = selectedCatalogItem?.updated
    ? new Date(selectedCatalogItem.updated).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <PageShell className="document-detail-page" compact>
      <aside className="document-detail-page__sidebar">
        <RailPanel className="document-detail-page__panel document-detail-page__panel--summary" tone="primary">
          <SectionHeader
            description={resolvedDescription}
            eyebrow={source.name}
            title={<h1>{documentTitle(resolvedTitle)}</h1>}
          />
          <div className="document-detail-page__metrics">
            <MetricPill accent="blue" label="当前分类" value={categoryTitle} />
            <MetricPill accent="teal" label="相关节点" value={documentSiblings.length} />
          </div>
        </RailPanel>

        <RailPanel className="document-detail-page__panel" tone="secondary">
          <SectionHeader
            compact
            eyebrow={pageCopy.document.toc}
            meta={<span>跟随阅读</span>}
            title={<strong>目录锚点</strong>}
          />
          <div className="document-detail-page__toc">
            <TableOfContents
              content={fileContent || ''}
              headingRootSelector=".document-detail-page__reader .doc-body"
              scrollContainerSelector=".document-detail-page__reader .app-content"
            />
          </div>
        </RailPanel>

        <RailPanel className="document-detail-page__panel" tone="ghost">
          <SectionHeader
            compact
            eyebrow={pageCopy.document.related}
            meta={<span>{documentSiblings.length} 条</span>}
            title={<strong>相关节点导航</strong>}
          />
          <div className="document-detail-page__link-list">
            {documentSiblings.map((item) => (
              <button
                key={`${item.sourceId}:${item.path}`}
                className={`document-detail-page__link${item.path === selectedFile.path ? ' active' : ''}`}
                onClick={() => onOpenItem(item.sourceId, item.path)}
                type="button"
              >
                <FileIcon />
                <div>
                  <strong>{documentTitle(item.title)}</strong>
                  <span>{item.path}</span>
                </div>
                </button>
              ))}
            </div>
        </RailPanel>
      </aside>

      <section className="document-detail-page__main">
        <div className="document-detail-page__toolbar">
          <div className="document-detail-page__breadcrumbs">
            <button
              className="document-detail-page__crumb"
              onClick={() => onReturnToGraph(buildCategoryRoute(categoryKey), selectedFile.sourceId, selectedFile.path)}
              type="button"
            >
              {categoryTitle}
            </button>
            <span>/</span>
            <span className="document-detail-page__crumb document-detail-page__crumb--current">
              {documentTitle(resolvedTitle)}
            </span>
          </div>

          <div className="document-detail-page__toolbar-actions">
            <button
              className="document-detail-page__action document-detail-page__action--primary"
              onClick={() => onReturnToGraph(buildCategoryRoute(categoryKey), selectedFile.sourceId, selectedFile.path)}
              type="button"
            >
              返回分类图谱
            </button>
            <button
              className="document-detail-page__action"
              onClick={() => onOpenSearch(documentTitle(resolvedTitle))}
              type="button"
            >
              <SearchIcon />
              <span>搜索相似内容</span>
            </button>
          </div>
        </div>

        <div className="document-detail-page__reader">
          <DocumentView
            content={fileContent}
            fileName={fileName}
            loading={fileLoading}
            onTagSelect={onTagSelect}
            onWikiLink={onWikiLink}
            selectedFile={selectedFile}
            showKnowledgePanel={false}
            source={source}
          />
        </div>
      </section>

      <aside className="document-detail-page__aside">
        <RailPanel className="document-detail-page__panel" tone="secondary">
          <SectionHeader
            compact
            eyebrow={pageCopy.document.intelligence}
            meta={<span>Meta</span>}
            title={<strong>文档情报</strong>}
          />
          <div className="document-detail-page__meta-stack">
            <div className="document-detail-page__meta-card">
              <TagIcon />
              <div>
                <strong>{categoryTitle}</strong>
                <span>{categoryDescription}</span>
              </div>
            </div>
            {updatedLabel && (
              <div className="document-detail-page__meta-card">
                <ClockIcon />
                <div>
                  <strong>最近更新</strong>
                  <span>{updatedLabel}</span>
                </div>
              </div>
            )}
            {resolvedTechStack.length > 0 && (
              <div className="document-detail-page__meta-block">
                <span className="document-detail-page__meta-label">技术栈</span>
                <div className="document-detail-page__tag-row">
                  {resolvedTechStack.map((entry) => (
                    <span key={entry} className="document-detail-page__tag">
                      {entry}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {resolvedTags.length > 0 && (
              <div className="document-detail-page__meta-block">
                <span className="document-detail-page__meta-label">标签</span>
                <div className="document-detail-page__tag-row">
                  {resolvedTags.map((tag) => (
                    <button
                      key={tag}
                      className="document-detail-page__tag document-detail-page__tag--interactive"
                      onClick={() => onTagSelect(tag)}
                      type="button"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </RailPanel>

        <RailPanel className="document-detail-page__panel" tone="ghost">
          <SectionHeader
            compact
            eyebrow={pageCopy.document.recommendations}
            meta={<span>{relatedItems.length} 条</span>}
            title={<strong>相关推荐</strong>}
          />
          {relatedItems.length > 0 ? (
            <div className="document-detail-page__link-list">
              {relatedItems.map((item) => (
                <button
                  key={`${item.sourceId}:${item.path}:recommend`}
                  className="document-detail-page__link"
                  onClick={() => onOpenItem(item.sourceId, item.path)}
                  type="button"
                >
                  <FolderIcon />
                  <div>
                    <strong>{documentTitle(item.title)}</strong>
                    <span>{item.path}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <CompactEmptyState
              icon={<FileIcon />}
              title="还没有相关推荐"
              description="随着分类索引完善，这里会补充同类节点与前后置知识点。"
            />
          )}
        </RailPanel>
      </aside>
    </PageShell>
  )
}
