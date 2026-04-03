import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, describe, expect, it } from 'vitest'
import { classifyKnowledgeCategories } from '../config/knowledgeRules'
import { __clearKnowledgeBaseCacheForTests, getKnowledgeCatalog, searchKnowledge } from './knowledgeBase'

describe('knowledge classification rules', () => {
  it('prefers explicit frontmatter categories over heuristics', () => {
    const categories = classifyKnowledgeCategories({
      path: 'notes/button.md',
      title: 'Button Design System',
      description: 'React component usage guide',
      docType: 'component',
      tags: ['react', 'design-system'],
      techStack: ['react', 'typescript'],
      frontmatter: {
        category: 'frontend,components',
      },
    })

    expect(categories).toEqual(['frontend', 'components'])
  })

  it('can derive categories from tags and path conventions', () => {
    const categories = classifyKnowledgeCategories({
      path: 'frontend/components/button.md',
      title: 'Button',
      description: 'Reusable UI component',
      docType: 'component',
      tags: ['react', 'component'],
      techStack: ['react'],
      frontmatter: {},
    })

    expect(categories).toContain('frontend')
    expect(categories).toContain('components')
  })
})

describe('knowledge base local index', () => {
  const originalObsidianPath = process.env.OBSIDIAN_PATH
  let tempDir = ''

  afterEach(async () => {
    __clearKnowledgeBaseCacheForTests()
    if (originalObsidianPath === undefined) {
      delete process.env.OBSIDIAN_PATH
    } else {
      process.env.OBSIDIAN_PATH = originalObsidianPath
    }
    if (tempDir) {
      await fs.promises.rm(tempDir, { recursive: true, force: true })
      tempDir = ''
    }
  })

  it('reindexes changed markdown files when the file timestamp changes', async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'info-hub-kb-'))
    process.env.OBSIDIAN_PATH = tempDir

    const filePath = path.join(tempDir, 'playbook.md')

    await fs.promises.writeFile(filePath, [
      '---',
      'id: concept-button-playbook',
      'title: Button Playbook',
      'tags: [react, component]',
      'type: component',
      'status: draft',
      'created: 2026-03-25',
      'modified: 2026-03-25',
      'graph-title: 按钮手册',
      'graph-tags: [前端, 组件]',
      '---',
      '# Button Playbook',
      '',
      'Initial design system note',
    ].join('\n'), 'utf-8')

    const initialResults = await searchKnowledge('obsidian', 'button')
    expect(initialResults.some((result) => result.path === 'playbook.md')).toBe(true)

    const initialCatalog = await getKnowledgeCatalog('obsidian')
    expect(initialCatalog.sections.some((section) => section.key === 'components')).toBe(true)

    await new Promise(resolve => setTimeout(resolve, 30))

    await fs.promises.writeFile(filePath, [
      '---',
      'id: solution-cache-recovery-playbook',
      'title: Cache Recovery Playbook',
      'category: solutions',
      'tags: [incident, fix]',
      'type: troubleshooting',
      'status: evergreen',
      'created: 2026-03-25',
      'modified: 2026-03-26',
      'graph-title: 缓存恢复手册',
      'graph-tags: [排障, 缓存]',
      '---',
      '# Cache Recovery Playbook',
      '',
      'How to fix cache invalidation issues fast',
    ].join('\n'), 'utf-8')

    const updatedResults = await searchKnowledge('obsidian', 'cache invalidation')
    expect(updatedResults.some((result) => result.path === 'playbook.md')).toBe(true)

    const updatedCatalog = await getKnowledgeCatalog('obsidian')
    const solutionsSection = updatedCatalog.sections.find((section) => section.key === 'solutions')
    expect(solutionsSection?.items.some((item) => item.path === 'playbook.md')).toBe(true)
  })

  it('admits documents with standard frontmatter even when graph metadata is omitted', async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'info-hub-kb-fallback-'))
    process.env.OBSIDIAN_PATH = tempDir

    await fs.promises.writeFile(path.join(tempDir, 'context.md'), [
      '---',
      'id: agent-context',
      'title: Current Context',
      'tags: [vault, context, current]',
      'type: concept',
      'status: evergreen',
      'created: 2026-03-25',
      'modified: 2026-03-25',
      '---',
      '# Current Context',
      '',
      'This note should still be indexed without explicit graph metadata.',
    ].join('\n'), 'utf-8')

    const catalog = await getKnowledgeCatalog('obsidian')
    expect(catalog.totalDocs).toBe(1)
    expect(catalog.recentDocs[0]?.title).toBe('Current Context')
    expect(catalog.recentDocs[0]?.tags).toEqual(['vault', 'context', 'current'])

    const searchResults = await searchKnowledge('obsidian', 'current context')
    expect(searchResults.some((result) => result.path === 'context.md')).toBe(true)
  })

  it('blocks documents from the library when IQC metadata is missing', async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'info-hub-kb-iqc-'))
    process.env.OBSIDIAN_PATH = tempDir

    await fs.promises.writeFile(path.join(tempDir, 'invalid.md'), [
      '# Missing Frontmatter',
      '',
      'This note should never enter the knowledge library.',
    ].join('\n'), 'utf-8')

    const catalog = await getKnowledgeCatalog('obsidian')
    expect(catalog.totalDocs).toBe(0)

    const searchResults = await searchKnowledge('obsidian', 'missing')
    expect(searchResults).toHaveLength(0)
  })
})
