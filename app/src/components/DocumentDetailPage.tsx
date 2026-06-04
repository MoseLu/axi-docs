import { Link } from 'react-router-dom'
import { formatDisplayDate } from '../lib/intl'
import {
  formatKnowledgeDocumentTitle,
  formatKnowledgeItemTitle,
  formatKnowledgeTagLabel,
} from '../lib/knowledgeFormatter'
import { buildDocumentRoute, buildSearchRoute } from '../lib/routes'
import type { DocSource, KnowledgeCatalogItem, SelectedFile } from '../types'
import { ClockIcon, FileIcon, SearchIcon } from './Icons'
import { DocumentView } from './DocumentView'
import { TableOfContents } from './TableOfContents'

interface DocumentDetailPageProps {
  source: DocSource
  selectedFile: SelectedFile
  selectedCatalogItem: KnowledgeCatalogItem | null
  fileContent: string | null
  fileName: string
  fileLoading: boolean
  categoryTitle: string
  categoryDescription: string
  documentSiblings: KnowledgeCatalogItem[]
  graphHref: string
  relatedItems: KnowledgeCatalogItem[]
  onTagSelect: (tag: string | null) => void
  onWikiLink: (noteName: string) => void
}

function documentTitle(item: Pick<KnowledgeCatalogItem, 'title' | 'name' | 'path' | 'graphTitle'>) {
  return formatKnowledgeItemTitle(item)
}

export function DocumentDetailPage({
  source,
  selectedFile,
  selectedCatalogItem,
  fileContent,
  fileName,
  fileLoading,
  categoryTitle,
  categoryDescription,
  documentSiblings,
  graphHref,
  relatedItems,
  onTagSelect,
  onWikiLink,
}: DocumentDetailPageProps) {
  const rawTitle = selectedCatalogItem?.rawTitle || fileName || selectedFile.path
  const displayTitle = formatKnowledgeDocumentTitle(
    selectedCatalogItem?.title || rawTitle,
    selectedCatalogItem?.path || selectedFile.path,
    selectedCatalogItem?.graphTitle,
  )
  const tags = selectedCatalogItem?.tags || []
  const updatedLabel = selectedCatalogItem?.updated
    ? formatDisplayDate(selectedCatalogItem.updated)
    : null
  const relatedSearchHref = buildSearchRoute(rawTitle.replace(/\.md$/i, ''), selectedFile.sourceId)

  return (
    <div className="document-detail-page">
      <aside className="document-detail-page__sidebar">
        <div className="document-detail-page__brand">
          <span>{source.kind === 'skill-library' ? 'Skill Library' : 'Document Library'}</span>
          <strong>{source.name}</strong>
          <p>{source.description}</p>
        </div>

        <nav className="document-detail-page__nav" aria-label={`${source.name} 文档目录`}>
          <div className="document-detail-page__nav-heading">
            <span>{categoryTitle}</span>
            <small>{documentSiblings.length}</small>
          </div>
          <div className="document-detail-page__link-list">
            {documentSiblings.map((item) => (
              <Link
                key={`${item.sourceId}:${item.path}`}
                className={`document-detail-page__link${item.path === selectedFile.path ? ' active' : ''}`}
                to={buildDocumentRoute({ sourceId: item.sourceId, path: item.path })}
              >
                <FileIcon />
                <span>{documentTitle(item)}</span>
              </Link>
            ))}
          </div>
        </nav>

        {relatedItems.length > 0 && (
          <nav className="document-detail-page__nav document-detail-page__nav--related" aria-label="相关推荐">
            <div className="document-detail-page__nav-heading">
              <span>相关推荐</span>
              <small>{relatedItems.length}</small>
            </div>
            <div className="document-detail-page__link-list">
              {relatedItems.slice(0, 6).map((item) => (
                <Link
                  key={`${item.sourceId}:${item.path}:related`}
                  className="document-detail-page__link"
                  to={buildDocumentRoute({ sourceId: item.sourceId, path: item.path })}
                >
                  <span>{documentTitle(item)}</span>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </aside>

      <main className="document-detail-page__main">
        <div className="document-detail-page__toolbar">
          <div className="document-detail-page__breadcrumbs">
            <Link to="/">文档库</Link>
            <span>/</span>
            <Link to={graphHref}>{categoryTitle}</Link>
            <span>/</span>
            <strong>{displayTitle}</strong>
          </div>
          <Link className="document-detail-page__search-link" to={relatedSearchHref}>
            <SearchIcon />
            搜索相关内容
          </Link>
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
      </main>

      <aside className="document-detail-page__aside">
        <div className="document-detail-page__toc">
          <strong>页面导航</strong>
          <TableOfContents
            content={fileContent || ''}
            headingRootSelector=".document-detail-page__reader .doc-body"
            scrollContainerSelector=".document-detail-page__reader .app-content"
          />
        </div>

        <div className="document-detail-page__meta">
          <strong>文档信息</strong>
          <p>{categoryDescription}</p>
          {updatedLabel && (
            <span>
              <ClockIcon />
              {updatedLabel}
            </span>
          )}
          {tags.length > 0 && (
            <div className="document-detail-page__tags">
              {tags.slice(0, 8).map((tag) => (
                <button key={tag} onClick={() => onTagSelect(tag)} type="button">
                  #{formatKnowledgeTagLabel(tag)}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
