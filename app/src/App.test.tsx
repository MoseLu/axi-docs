import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { buildDocumentRoute, encodeDocumentId } from './lib/routes'
import type { DocSource, KnowledgeCatalog } from './types'

const mocks = vi.hoisted(() => ({
  getKnowledgeCatalog: vi.fn(),
  getKnowledgeSearchSuggestions: vi.fn(),
  listKnowledgeSources: vi.fn(),
  readKnowledgeFile: vi.fn(),
  searchKnowledgeAll: vi.fn(),
}))

vi.mock('./lib/knowledgeClient', () => ({
  getKnowledgeCatalog: mocks.getKnowledgeCatalog,
  getKnowledgeSearchSuggestions: mocks.getKnowledgeSearchSuggestions,
  listKnowledgeSources: mocks.listKnowledgeSources,
  readKnowledgeFile: mocks.readKnowledgeFile,
  searchKnowledgeAll: mocks.searchKnowledgeAll,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

const source: DocSource = {
  id: 'workspace',
  name: 'Axi Workspace',
  description: 'Workspace registry',
  path: '/workspace',
  enabled: true,
  type: 'local',
  kind: 'workspace-registry',
  adapter: 'workspace',
}

const catalog: KnowledgeCatalog = {
  sourceId: 'workspace',
  totalDocs: 1,
  totalTags: 0,
  generatedAt: '2026-06-05T00:00:00.000Z',
  topTags: [],
  recentDocs: [],
  sections: [
    {
      key: 'project',
      title: '项目知识',
      description: '项目文档',
      count: 1,
      items: [
        {
          sourceId: 'workspace',
          path: 'projects/workspace-relationship-graph.md',
          name: 'workspace-relationship-graph',
          title: '工作区Relationship图谱',
          description: '工作区项目关系图',
          docType: 'project',
          tags: [],
          categories: ['project'],
          techStack: [],
        },
      ],
    },
  ],
}

describe('App document route', () => {
  it('renders the guide as a document pathname instead of a hash anchor route', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source])
    mocks.getKnowledgeCatalog.mockResolvedValue(catalog)
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/zh/guide/getting-started']}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: '快速开始', level: 1 })

    expect(screen.getAllByRole('link', { name: '快速开始' })[0]).toHaveAttribute('href', '/zh/guide/getting-started')
    expect(screen.getAllByRole('link', { name: '什么是 Axi Docs？' })[0]).toHaveAttribute('href', '/zh/guide/what-is-axi-docs')
  })

  it('redirects root search URLs into the guide search document', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source])
    mocks.getKnowledgeCatalog.mockResolvedValue(catalog)
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/?q=AXI']}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: '“AXI” 的匹配文档' })
    await waitFor(() => expect(mocks.searchKnowledgeAll).toHaveBeenCalledWith('AXI'))
  })

  it('upgrades old root guide hashes to guide document routes', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source])
    mocks.getKnowledgeCatalog.mockResolvedValue(catalog)
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/#what-is-axi-docs']}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: '什么是 Axi Docs？', level: 1 })
    expect(screen.getAllByRole('link', { name: '什么是 Axi Docs？' })[0]).toHaveAttribute('href', '/zh/guide/what-is-axi-docs')
  })

  it('loads a readable route document once instead of flickering back into loading', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source])
    mocks.getKnowledgeCatalog.mockResolvedValue(catalog)
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue('# Workspace Relationship Graph\n\nStable document body.')

    const route = buildDocumentRoute({
      sourceId: 'workspace',
      path: 'projects/workspace-relationship-graph.md',
    })

    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: /Workspace Relationship Graph/i })
    await waitFor(() => expect(mocks.readKnowledgeFile).toHaveBeenCalledTimes(1))
    await new Promise((resolve) => window.setTimeout(resolve, 50))

    expect(mocks.readKnowledgeFile).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Stable document body.')).toBeInTheDocument()
  })

  it('redirects legacy encoded document routes to the readable document route', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source])
    mocks.getKnowledgeCatalog.mockResolvedValue(catalog)
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue('# Workspace Relationship Graph\n\nLegacy link body.')

    const docId = encodeDocumentId({
      sourceId: 'workspace',
      path: 'projects/workspace-relationship-graph.md',
    })

    render(
      <MemoryRouter initialEntries={[`/doc/${docId}`]}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: /Workspace Relationship Graph/i })
    await waitFor(() => expect(mocks.readKnowledgeFile).toHaveBeenCalledTimes(1))

    expect(screen.queryByText('Legacy link body.')).toBeInTheDocument()
  })
})
