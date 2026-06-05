import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { encodeDocumentId } from './lib/routes'
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
  it('loads a route document once instead of flickering back into loading', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source])
    mocks.getKnowledgeCatalog.mockResolvedValue(catalog)
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue('# Workspace Relationship Graph\n\nStable document body.')

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
    await new Promise((resolve) => window.setTimeout(resolve, 50))

    expect(mocks.readKnowledgeFile).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Stable document body.')).toBeInTheDocument()
  })
})
