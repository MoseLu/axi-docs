import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { buildDocumentRoute } from './lib/routes'
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

function LocationProbe() {
  const location = useLocation()
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>
}

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

const skillsSource: DocSource = {
  id: 'axi-skills',
  name: 'Axi Skills',
  description: 'Shared skill library',
  path: '/skills',
  enabled: true,
  type: 'local',
  kind: 'skill-library',
  adapter: 'skills',
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

const skillsCatalog: KnowledgeCatalog = {
  ...catalog,
  sourceId: 'axi-skills',
  sections: [
    {
      key: 'frontend',
      title: 'Frontend',
      description: '前端技能',
      count: 1,
      items: [
        {
          sourceId: 'axi-skills',
          path: 'skills/frontend-dev/SKILL.md',
          name: 'frontend-dev',
          title: 'Frontend Dev',
          description: 'Frontend workflow skill',
          docType: 'skill',
          tags: [],
          categories: ['frontend'],
          techStack: [],
        },
      ],
    },
    {
      key: 'workflow',
      title: 'Workflow',
      description: '流程技能',
      count: 2,
      items: [
        {
          sourceId: 'axi-skills',
          path: 'skills/frontend-dev/SKILL.md',
          name: 'frontend-dev',
          title: 'Frontend Dev',
          description: 'Frontend workflow skill',
          docType: 'skill',
          tags: [],
          categories: ['frontend'],
          techStack: [],
        },
        {
          sourceId: 'axi-skills',
          path: 'skills/workflow/SKILL.md',
          name: 'workflow',
          title: 'Workflow Skill',
          description: 'Workflow automation skill',
          docType: 'skill',
          tags: [],
          categories: ['workflow'],
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

  it('redirects the root to the default localized guide document', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source])
    mocks.getKnowledgeCatalog.mockResolvedValue(catalog)
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: '快速开始', level: 1 })
    expect(screen.getAllByRole('link', { name: '快速开始' })[0]).toHaveAttribute('href', '/zh/guide/getting-started')
  })

  it('does not map old guide hashes to new guide document routes', async () => {
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

    await screen.findByRole('heading', { name: '快速开始', level: 1 })
    expect(screen.queryByRole('heading', { name: '什么是 Axi Docs？', level: 1 })).not.toBeInTheDocument()
  })

  it('renders the English guide under the locale-prefixed route', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source])
    mocks.getKnowledgeCatalog.mockResolvedValue(catalog)
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/en/guide/getting-started']}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: 'Getting Started', level: 1 })

    expect(screen.getAllByRole('link', { name: 'Getting Started' })[0]).toHaveAttribute('href', '/en/guide/getting-started')
    expect(screen.getAllByRole('link', { name: 'What is Axi Docs?' })[0]).toHaveAttribute('href', '/en/guide/what-is-axi-docs')
  })

  it('renders skills as a locale-prefixed document set with its own sidebar', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source, skillsSource])
    mocks.getKnowledgeCatalog.mockImplementation(async (sourceId: string) => (
      sourceId === 'axi-skills' ? skillsCatalog : catalog
    ))
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/zh/skills']}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: 'Axi Skills', level: 1 })

    expect(mocks.getKnowledgeCatalog).toHaveBeenCalledWith('axi-skills')
    expect(screen.getByRole('link', { name: '技能库' })).toHaveAttribute('href', '/zh/skills')
    expect(screen.getByRole('link', { name: '技能库' })).toHaveClass('active')
    const sidebar = screen.getByLabelText('侧边栏导航')
    expect(await within(sidebar).findByText('Frontend')).toBeInTheDocument()
    expect(await within(sidebar).findByRole('button', { name: 'Frontend Dev' })).toBeInTheDocument()
    expect(within(sidebar).queryByText('Frontend workflow skill')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '快速开始' })).not.toBeInTheDocument()
  })

  it('opens skills documents through canonical document routes', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source, skillsSource])
    mocks.getKnowledgeCatalog.mockImplementation(async (sourceId: string) => (
      sourceId === 'axi-skills' ? skillsCatalog : catalog
    ))
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue('# Frontend Dev\n\nSkill body.')

    render(
      <MemoryRouter initialEntries={['/zh/skills']}>
        <App />
        <LocationProbe />
      </MemoryRouter>,
    )

    fireEvent.click(await screen.findByRole('button', { name: 'Frontend Dev' }))

    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/docs/axi-skills/skills/frontend-dev/SKILL'))
    expect(screen.getByRole('link', { name: '指南' })).not.toHaveClass('active')
    expect(screen.getByRole('link', { name: '技能库' })).toHaveClass('active')
    expect(screen.getByLabelText('Frontend')).toBeInTheDocument()
    expect(screen.getByLabelText('Workflow')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Frontend Dev 文档' })).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Frontend Dev 文档' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Workflow技能' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Workflow技能' }))

    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/docs/axi-skills/skills/workflow/SKILL'))
    expect(screen.getByLabelText('Frontend')).toBeInTheDocument()
    expect(screen.getByLabelText('Workflow')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Frontend Dev 文档' })).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Workflow技能' })).toHaveClass('active')
    expect(screen.queryByLabelText('相关推荐')).not.toBeInTheDocument()
    expect(mocks.readKnowledgeFile).toHaveBeenCalledWith('axi-skills', 'skills/frontend-dev/SKILL.md')
    expect(mocks.readKnowledgeFile).toHaveBeenCalledWith('axi-skills', 'skills/workflow/SKILL.md')
  })

  it('strips legacy preview query parameters from document-set routes', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source, skillsSource])
    mocks.getKnowledgeCatalog.mockImplementation(async (sourceId: string) => (
      sourceId === 'axi-skills' ? skillsCatalog : catalog
    ))
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/zh/skills?source=axi-skills&doc=legacy']}>
        <App />
        <LocationProbe />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: 'Axi Skills', level: 1 })
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/zh/skills'))
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

  it('returns 404 for legacy encoded document routes instead of redirecting them', async () => {
    mocks.listKnowledgeSources.mockResolvedValue([source])
    mocks.getKnowledgeCatalog.mockResolvedValue(catalog)
    mocks.getKnowledgeSearchSuggestions.mockResolvedValue([])
    mocks.searchKnowledgeAll.mockResolvedValue([])
    mocks.readKnowledgeFile.mockResolvedValue('# Workspace Relationship Graph\n\nLegacy link body.')

    render(
      <MemoryRouter initialEntries={['/doc/workspace:projects/workspace-relationship-graph.md']}>
        <App />
      </MemoryRouter>,
    )

    await screen.findByRole('heading', { name: '页面不存在' })
    expect(mocks.readKnowledgeFile).not.toHaveBeenCalled()
  })
})
