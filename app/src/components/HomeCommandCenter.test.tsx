import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HomeCommandCenter } from './HomeCommandCenter'
import type { DocSource, KnowledgeCatalog } from '../types'

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
      items: [],
    },
  ],
}

describe('HomeCommandCenter', () => {
  it('renders a docs-first landing page with guide navigation', () => {
    render(
      <HomeCommandCenter
        activeTag={null}
        catalog={catalog}
        graphFocusPath={null}
        onClearSelectedFile={vi.fn()}
        onOpenExplorer={vi.fn()}
        onOpenItem={vi.fn()}
        onSourceSelect={vi.fn()}
        onTagSelect={vi.fn()}
        searchQuery=""
        selectedFile={null}
        source={sources[0]}
        sources={sources}
      />,
    )

    const docsNav = screen.getByLabelText('文档导航')

    expect(screen.getByRole('heading', { name: 'React 体系的专业文档站' })).toBeInTheDocument()
    expect(within(docsNav).getByRole('link', { name: '快速开始' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '推荐阅读路径' })).toBeInTheDocument()
    expect(screen.queryByText('PROJECTS')).not.toBeInTheDocument()
  })

  it('keeps source selection actionable from the docs sidebar', () => {
    const onSourceSelect = vi.fn()
    render(
      <HomeCommandCenter
        activeTag={null}
        catalog={catalog}
        graphFocusPath={null}
        onClearSelectedFile={vi.fn()}
        onOpenExplorer={vi.fn()}
        onOpenItem={vi.fn()}
        onSourceSelect={onSourceSelect}
        onTagSelect={vi.fn()}
        searchQuery=""
        selectedFile={null}
        source={sources[0]}
        sources={sources}
      />,
    )

    fireEvent.click(within(screen.getByLabelText('文档导航')).getByRole('button', { name: /Axi Skills/i }))

    expect(onSourceSelect).toHaveBeenCalledWith('axi-skills')
  })
})
