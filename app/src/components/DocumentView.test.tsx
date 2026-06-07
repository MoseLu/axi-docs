import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { DocumentView } from './DocumentView'
import type { DocSource, SelectedFile } from '../types'

const skillSource: DocSource = {
  id: 'axi-skills-zh',
  name: 'Axi Skills · 中文镜像',
  description: 'Axi Skills 中文镜像',
  path: '/skills',
  enabled: true,
  type: 'local',
  kind: 'skill-library',
  adapter: 'skills',
  skillRoot: 'skills.zh',
  locale: 'zh',
}

const selectedFile: SelectedFile = {
  sourceId: 'axi-skills-zh',
  path: 'skills.zh/worker/SKILL.md',
}

describe('DocumentView', () => {
  it('keeps skill document headers focused on the title and description', () => {
    const { container } = render(
      <MemoryRouter>
        <DocumentView
          content={`---
title: Worker 协作协议
description: 基于 tmux 的 OMX 团队 worker 协议
type: skill
modified: 2026-06-07
tech: tmux
domain: Agent
---
# Worker 技能

正文内容`}
          fileName="SKILL.md"
          loading={false}
          onWikiLink={vi.fn()}
          selectedFile={selectedFile}
          showKnowledgePanel={false}
          source={skillSource}
        />
      </MemoryRouter>,
    )

    const header = container.querySelector('.doc-header')
    expect(header).not.toBeNull()

    const skillHeader = within(header as HTMLElement)
    expect(skillHeader.getByRole('heading', { name: 'Worker 协作协议' })).toBeInTheDocument()
    expect(skillHeader.getByText('基于 tmux 的 OMX 团队 worker 协议')).toBeInTheDocument()
    expect(skillHeader.queryByText('Axi Skills · 中文镜像')).not.toBeInTheDocument()
    expect(skillHeader.queryByText('skills.zh')).not.toBeInTheDocument()
    expect(skillHeader.queryByText('worker')).not.toBeInTheDocument()
    expect(skillHeader.queryByText('skill')).not.toBeInTheDocument()
    expect(skillHeader.queryByText('2026年6月7日')).not.toBeInTheDocument()
    expect(skillHeader.queryByText('tmux')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Worker 技能' })).toBeInTheDocument()
  })
})
