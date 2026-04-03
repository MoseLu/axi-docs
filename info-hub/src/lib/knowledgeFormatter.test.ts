import { describe, expect, it } from 'vitest'
import {
  formatKnowledgeBranchLabel,
  formatKnowledgeBranchPath,
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

  it('keeps branch and tag labels metadata-driven', () => {
    expect(formatKnowledgeTagLabel('#前端')).toBe('前端')
    expect(formatKnowledgeBranchLabel('2026')).toBe('2026年')
    expect(formatKnowledgeBranchPath('20-Projects/info-hub/ADR')).toBe('项目 / 文档中心 / 架构决策')
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
