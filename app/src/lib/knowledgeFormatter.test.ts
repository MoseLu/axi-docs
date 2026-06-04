import { describe, expect, it } from 'vitest'
import {
  formatKnowledgeBranchLabel,
  formatKnowledgeBranchPath,
  formatKnowledgeDocumentDescription,
  formatKnowledgeDocumentTitle,
  formatKnowledgeItemTitle,
  isChineseKnowledgeLabel,
  formatKnowledgeNodeLabel,
  formatKnowledgeTagLabel,
} from './knowledgeFormatter'

describe('knowledge formatter', () => {
  it('prefers explicit graph titles and keeps filename fallback simple', () => {
    expect(formatKnowledgeDocumentTitle('Vault Index for Agent', '_agent/INDEX.md', '智能体知识库索引')).toBe('智能体知识库索引')
    expect(formatKnowledgeDocumentTitle('2026-03-23', '_daily/2026/2026-03-23.md')).toBe('2026年3月23日')
  })

  it('maps English document names to Chinese display metadata', () => {
    expect(formatKnowledgeDocumentTitle('Axi Image Preview', 'projects/axi-image-preview.md')).toBe('Axi 图片预览')
    expect(formatKnowledgeDocumentTitle('Current Context', '_agent/current-context.md')).toBe('当前上下文')
    expect(formatKnowledgeDocumentTitle('ck', 'skills/ck/SKILL.md')).toBe('ck 文档')
    expect(formatKnowledgeDocumentDescription({
      title: 'Axi Image Preview',
      rawTitle: 'Axi Image Preview',
      path: 'projects/axi-image-preview.md',
      description: 'Generate image preview workflows.',
      docType: 'project',
      sourceId: 'workspace',
    })).toContain('项目文档')
  })

  it('keeps branch and tag labels metadata-driven', () => {
    expect(formatKnowledgeTagLabel('#前端')).toBe('前端')
    expect(formatKnowledgeBranchLabel('2026')).toBe('2026年')
    expect(formatKnowledgeBranchPath('20-Projects/axi-docs/ADR')).toBe('项目 / 文档中心 / 架构决策')
  })

  it('formats generic items and graph nodes with explicit graph titles', () => {
    expect(formatKnowledgeItemTitle({
      title: 'OMC Workflow Skills',
      path: '40-Resources/tools/CLAUDE-CODE-SKILLS-OMC-WORKFLOW.md',
      graphTitle: '工作流技能总表',
    })).toBe('工作流技能总表')

    expect(formatKnowledgeNodeLabel({
      id: '#前端',
      label: '前端',
      kind: 'tag',
    })).toBe('前端')

    expect(formatKnowledgeNodeLabel({
      id: '20-Projects/ielts-vocab/OVERVIEW.md',
      label: 'IELTS Vocabulary App 总览',
      kind: 'note',
      path: '20-Projects/ielts-vocab/OVERVIEW.md',
      graphTitle: '雅思词汇应用总览',
    })).toBe('雅思词汇应用总览')

    expect(isChineseKnowledgeLabel('雅思词汇应用总览')).toBe(true)
  })
})
