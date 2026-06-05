import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { DocumentDetailPage } from './DocumentDetailPage'
import type { DocSource, KnowledgeCatalogItem, SelectedFile } from '../types'

vi.mock('./DocumentView', () => ({
  DocumentView: () => <article>Document body</article>,
}))

vi.mock('./TableOfContents', () => ({
  TableOfContents: () => <nav>Page toc</nav>,
}))

const source: DocSource = {
  id: 'workspace',
  name: 'Axi Docs',
  description: 'Workspace docs',
  path: '/workspace',
  enabled: true,
  type: 'local',
  kind: 'workspace-registry',
  adapter: 'workspace',
}

const selectedFile: SelectedFile = {
  sourceId: 'workspace',
  path: 'guide/getting-started.md',
}

const siblings: KnowledgeCatalogItem[] = [
  {
    sourceId: 'workspace',
    path: 'guide/what-is-axi-docs.md',
    name: 'what-is-axi-docs',
    title: '什么是 Axi Docs？',
    tags: [],
    categories: ['guide'],
    techStack: [],
  },
  {
    sourceId: 'workspace',
    path: 'guide/getting-started.md',
    name: 'getting-started',
    title: '快速开始',
    tags: [],
    categories: ['guide'],
    techStack: [],
  },
]

const relatedItems: KnowledgeCatalogItem[] = [
  {
    sourceId: 'workspace',
    path: 'guide/search.md',
    name: 'search',
    title: '搜索文档',
    tags: [],
    categories: ['guide'],
    techStack: [],
  },
]

function renderDocumentDetailPage() {
  return render(
    <MemoryRouter>
      <DocumentDetailPage
        categoryDescription="核心阅读路径"
        categoryTitle="简介"
        documentSiblings={siblings}
        fileContent="# 快速开始"
        fileLoading={false}
        fileName="getting-started.md"
        graphHref="/graph"
        onTagSelect={vi.fn()}
        onWikiLink={vi.fn()}
        relatedItems={relatedItems}
        selectedCatalogItem={siblings[1]}
        selectedFile={selectedFile}
        source={source}
      />
    </MemoryRouter>,
  )
}

describe('DocumentDetailPage', () => {
  it('collapses and expands document sidebar sections for real', () => {
    renderDocumentDetailPage()

    const categoryNav = screen.getByLabelText('Axi Docs 文档目录')
    const categoryToggle = within(categoryNav).getByRole('button', { name: /简介/i })
    fireEvent.click(categoryToggle)

    expect(categoryToggle).toHaveAttribute('aria-expanded', 'false')
    expect(within(categoryNav).queryByRole('link', { name: /快速开始/i })).not.toBeInTheDocument()

    fireEvent.click(categoryToggle)

    expect(categoryToggle).toHaveAttribute('aria-expanded', 'true')
    expect(within(categoryNav).getByRole('link', { name: /快速开始/i })).toBeInTheDocument()

    const relatedNav = screen.getByLabelText('相关推荐')
    const relatedToggle = within(relatedNav).getByRole('button', { name: /相关推荐/i })
    fireEvent.click(relatedToggle)

    expect(relatedToggle).toHaveAttribute('aria-expanded', 'false')
    expect(within(relatedNav).queryByRole('link', { name: /搜索文档/i })).not.toBeInTheDocument()
  })

  it('keeps full document-set sidebar sections on document pages', () => {
    render(
      <MemoryRouter>
        <DocumentDetailPage
          categoryDescription="核心阅读路径"
          categoryTitle="简介"
          documentSiblings={siblings}
          fileContent="# 快速开始"
          fileLoading={false}
          fileName="getting-started.md"
          graphHref="/graph"
          onTagSelect={vi.fn()}
          onWikiLink={vi.fn()}
          relatedItems={[]}
          selectedCatalogItem={siblings[1]}
          selectedFile={selectedFile}
          sidebarSections={[
            {
              key: 'guide',
              title: '简介',
              description: '核心文档阅读路径',
              count: 2,
              items: siblings,
            },
            {
              key: 'reference',
              title: '参考',
              description: '参考文档',
              count: 1,
              items: relatedItems,
            },
          ]}
          source={source}
        />
      </MemoryRouter>,
    )

    expect(within(screen.getByLabelText('简介')).getByRole('link', { name: /快速开始/i })).toHaveClass('active')
    expect(within(screen.getByLabelText('参考')).getByRole('link', { name: /搜索文档/i })).toBeInTheDocument()
    expect(screen.queryByLabelText('相关推荐')).not.toBeInTheDocument()
  })

  it('deduplicates repeated documents across document-set sidebar sections', () => {
    render(
      <MemoryRouter>
        <DocumentDetailPage
          categoryDescription="核心阅读路径"
          categoryTitle="简介"
          documentSiblings={siblings}
          fileContent="# 快速开始"
          fileLoading={false}
          fileName="getting-started.md"
          graphHref="/graph"
          onTagSelect={vi.fn()}
          onWikiLink={vi.fn()}
          relatedItems={[]}
          selectedCatalogItem={siblings[1]}
          selectedFile={selectedFile}
          sidebarSections={[
            {
              key: 'guide',
              title: '简介',
              description: '核心文档阅读路径',
              count: 2,
              items: siblings,
            },
            {
              key: 'reference',
              title: '参考',
              description: '参考文档',
              count: 2,
              items: [siblings[1], relatedItems[0]],
            },
          ]}
          source={source}
        />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('link', { name: /快速开始/i })).toHaveLength(1)
    expect(within(screen.getByLabelText('参考')).getByRole('link', { name: /搜索文档/i })).toBeInTheDocument()
  })
})
