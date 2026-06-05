import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HomeCommandCenter } from './HomeCommandCenter'
import type { DocSource, KnowledgeCatalog, SearchResult } from '../types'

const sources: DocSource[] = [
  {
    id: 'workspace',
    name: 'Axi Workspace',
    description: 'Workspace registry',
    path: '/workspace',
    enabled: true,
    type: 'local',
    kind: 'workspace-registry',
    adapter: 'workspace',
  },
  {
    id: 'axi-skills',
    name: 'Axi Skills',
    description: 'Shared skill library',
    path: '/skills',
    enabled: true,
    type: 'local',
    kind: 'skill-library',
    adapter: 'skills',
  },
]

const catalog: KnowledgeCatalog = {
  sourceId: 'workspace',
  totalDocs: 2,
  totalTags: 0,
  generatedAt: '2026-06-05T00:00:00.000Z',
  topTags: [],
  recentDocs: [
    {
      sourceId: 'workspace',
      path: 'projects/alpha.md',
      name: 'alpha',
      title: 'Alpha Project',
      description: 'Project overview',
      docType: 'project',
      tags: [],
      categories: ['guide'],
      techStack: [],
    },
  ],
  sections: [
    {
      key: 'guide',
      title: '指南',
      description: '核心文档阅读路径',
      count: 2,
      items: [
        {
          sourceId: 'workspace',
          path: 'projects/alpha.md',
          name: 'alpha',
          title: 'Alpha Project',
          description: 'Project overview',
          docType: 'project',
          tags: [],
          categories: ['guide'],
          techStack: [],
        },
      ],
    },
  ],
}

const skillsCatalog: KnowledgeCatalog = {
  ...catalog,
  sourceId: 'axi-skills',
  recentDocs: [
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
  ],
}

describe('HomeCommandCenter', () => {
  it('renders a VitePress-like docs home instead of a marketing hero', () => {
    render(
      <HomeCommandCenter
        activeTag={null}
        catalog={catalog}
        graphFocusPath={null}
        onClearSelectedFile={vi.fn()}
        onOpenExplorer={vi.fn()}
        onOpenItem={vi.fn()}
        onTagSelect={vi.fn()}
        searchQuery=""
        selectedFile={null}
        source={sources[0]}
        sources={sources}
      />,
    )

    expect(screen.getByRole('heading', { name: '快速开始', level: 1 })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'React 体系的专业文档站' })).not.toBeInTheDocument()
    expect(within(screen.getByLabelText('侧边栏导航')).getByRole('link', { name: '快速开始' })).toHaveAttribute('href', '/zh/guide/getting-started')
    expect(within(screen.getByLabelText('侧边栏导航')).getByRole('link', { name: '什么是 Axi Docs？' })).toHaveAttribute('href', '/zh/guide/what-is-axi-docs')
    expect(within(screen.getByLabelText('页面导航')).getByRole('link', { name: '快速开始' })).toBeInTheDocument()
    expect(within(document.querySelector('#getting-started') as HTMLElement).queryByText('Axi Workspace')).not.toBeInTheDocument()
    expect(screen.getByText('未锁定来源')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '文档结构' })).toBeInTheDocument()
    expect(screen.queryByText('PROJECTS')).not.toBeInTheDocument()
  })

  it('renders a nav-level skills document set with its own sidebar pages', () => {
    const onOpenItem = vi.fn()
    render(
      <HomeCommandCenter
        activeSourceId="axi-skills"
        activeTag={null}
        catalog={skillsCatalog}
        docSet="skills"
        graphFocusPath={null}
        onClearSelectedFile={vi.fn()}
        onOpenExplorer={vi.fn()}
        onOpenItem={onOpenItem}
        onTagSelect={vi.fn()}
        searchQuery=""
        selectedFile={null}
        source={sources[1]}
        sources={sources}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Axi Skills', level: 1 })).toBeInTheDocument()
    expect(within(screen.getByLabelText('侧边栏导航')).getByRole('button', { name: 'Frontend' })).toBeInTheDocument()
    const frontendSection = screen.getByLabelText('Frontend')
    expect(within(frontendSection).getByRole('button', { name: 'Frontend Dev' })).toHaveAttribute('title', 'Frontend workflow skill')
    expect(within(frontendSection).queryByText('Frontend workflow skill')).not.toBeInTheDocument()
    expect(within(screen.getByLabelText('侧边栏导航')).queryByRole('link', { name: '快速开始' })).not.toBeInTheDocument()
    fireEvent.click(within(frontendSection).getByRole('button', { name: 'Frontend Dev' }))
    expect(onOpenItem).toHaveBeenCalledWith('axi-skills', 'skills/frontend-dev/SKILL.md')
    expect(screen.getByText('当前来源')).toBeInTheDocument()
  })

  it('renders localized English guide navigation', () => {
    render(
      <HomeCommandCenter
        activeTag={null}
        catalog={catalog}
        graphFocusPath={null}
        guideLocale="en"
        onClearSelectedFile={vi.fn()}
        onOpenExplorer={vi.fn()}
        onOpenItem={vi.fn()}
        onTagSelect={vi.fn()}
        searchQuery=""
        selectedFile={null}
        source={sources[0]}
        sources={sources}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Getting Started', level: 1 })).toBeInTheDocument()
    expect(within(screen.getByLabelText('侧边栏导航')).getByRole('link', { name: 'Getting Started' })).toHaveAttribute('href', '/en/guide/getting-started')
    expect(within(screen.getByLabelText('侧边栏导航')).getByRole('link', { name: 'What is Axi Docs?' })).toHaveAttribute('href', '/en/guide/what-is-axi-docs')
    expect(screen.getByRole('heading', { name: 'File Structure' })).toBeInTheDocument()
  })

  it('renders localized English search copy', () => {
    render(
      <HomeCommandCenter
        activeTag={null}
        catalog={catalog}
        graphFocusPath={null}
        guideLocale="en"
        guidePageId="search"
        onClearSelectedFile={vi.fn()}
        onOpenExplorer={vi.fn()}
        onOpenItem={vi.fn()}
        onTagSelect={vi.fn()}
        searchQuery="AXI"
        searchResults={[]}
        selectedFile={null}
        source={sources[0]}
        sources={sources}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Matches for "AXI"' })).toBeInTheDocument()
    expect(screen.getByText('No matching documents found. Try another keyword or continue from a recommended reading path.')).toBeInTheDocument()
  })

  it('collapses and expands sidebar groups for real', () => {
    render(
      <HomeCommandCenter
        activeTag={null}
        catalog={catalog}
        graphFocusPath={null}
        onClearSelectedFile={vi.fn()}
        onOpenExplorer={vi.fn()}
        onOpenItem={vi.fn()}
        onTagSelect={vi.fn()}
        searchQuery=""
        selectedFile={null}
        source={sources[0]}
        sources={sources}
      />,
    )

    const intro = screen.getByRole('button', { name: '简介' })
    fireEvent.click(intro)

    expect(intro).toHaveAttribute('aria-expanded', 'false')
    expect(within(screen.getByLabelText('指南')).queryByRole('link', { name: '快速开始' })).not.toBeInTheDocument()

    fireEvent.click(intro)

    expect(intro).toHaveAttribute('aria-expanded', 'true')
    expect(within(screen.getByLabelText('指南')).getByRole('link', { name: '快速开始' })).toBeInTheDocument()
  })

  it('shows inline search results as a document section', () => {
    const onOpenItem = vi.fn()
    const searchResults: SearchResult[] = [
      {
        sourceId: 'workspace',
        path: 'projects/axi-docs.md',
        name: 'axi-docs',
        type: 'file',
        title: 'Axi Docs',
        description: 'React 文档站项目说明',
        snippet: 'React 文档站项目说明',
        matches: [],
        score: 1,
        docType: 'project',
        tags: [],
        categories: ['guide'],
        matchedBy: ['title'],
      },
    ]

    render(
      <HomeCommandCenter
        activeTag={null}
        catalog={catalog}
        graphFocusPath={null}
        onClearSelectedFile={vi.fn()}
        onOpenExplorer={vi.fn()}
        onOpenItem={onOpenItem}
        guidePageId="search"
        onTagSelect={vi.fn()}
        searchQuery="AXI"
        searchResults={searchResults}
        selectedFile={null}
        source={sources[0]}
        sources={sources}
      />,
    )

    expect(screen.getByRole('heading', { name: '“AXI” 的匹配文档' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Axi Docs/i }))

    expect(onOpenItem).toHaveBeenCalledWith('workspace', 'projects/axi-docs.md')
  })
})
