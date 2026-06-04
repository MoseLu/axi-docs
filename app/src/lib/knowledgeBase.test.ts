import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, describe, expect, it } from 'vitest'
import { classifyKnowledgeCategories } from '../config/knowledgeRules'
import { getDocumentSourceRegistry, validateDocumentSourceRegistry } from '../config/documentSources'
import {
  __clearKnowledgeBaseCacheForTests,
  getProjectSummary,
  getKnowledgeCatalog,
  listKnowledgeSources,
  readKnowledgeFile,
  searchKnowledge,
  searchKnowledgeAll,
} from './knowledgeBase'

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
  const originalExtraSources = process.env.AXI_DOCS_EXTRA_SOURCES_JSON
  const originalAxiSkillsPath = process.env.AXI_SKILLS_PATH
  const originalWorkspaceGovernancePath = process.env.AXI_WORKSPACE_GOVERNANCE_PATH
  let tempDir = ''

  afterEach(async () => {
    __clearKnowledgeBaseCacheForTests()
    if (originalObsidianPath === undefined) {
      delete process.env.OBSIDIAN_PATH
    } else {
      process.env.OBSIDIAN_PATH = originalObsidianPath
    }
    if (originalExtraSources === undefined) {
      delete process.env.AXI_DOCS_EXTRA_SOURCES_JSON
    } else {
      process.env.AXI_DOCS_EXTRA_SOURCES_JSON = originalExtraSources
    }
    if (originalAxiSkillsPath === undefined) {
      delete process.env.AXI_SKILLS_PATH
    } else {
      process.env.AXI_SKILLS_PATH = originalAxiSkillsPath
    }
    if (originalWorkspaceGovernancePath === undefined) {
      delete process.env.AXI_WORKSPACE_GOVERNANCE_PATH
    } else {
      process.env.AXI_WORKSPACE_GOVERNANCE_PATH = originalWorkspaceGovernancePath
    }
    if (tempDir) {
      await fs.promises.rm(tempDir, { recursive: true, force: true })
      tempDir = ''
    }
  })

  it('reindexes changed markdown files when the file timestamp changes', async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'axi-docs-kb-'))
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
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'axi-docs-kb-fallback-'))
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
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'axi-docs-kb-iqc-'))
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

  it('supports extra local sources from AXI_DOCS_EXTRA_SOURCES_JSON', async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'axi-docs-kb-extra-'))
    const extraDir = path.join(tempDir, 'hermes-system')
    await fs.promises.mkdir(extraDir, { recursive: true })

    process.env.OBSIDIAN_PATH = path.join(tempDir, 'primary')
    process.env.AXI_DOCS_EXTRA_SOURCES_JSON = JSON.stringify([
      {
        id: 'hermes-system',
        name: 'Hermes System',
        path: extraDir,
        type: 'local',
        enabled: true,
      },
    ])

    await fs.promises.mkdir(process.env.OBSIDIAN_PATH, { recursive: true })
    const sources = listKnowledgeSources()
    const hermesSource = sources.find((source) => source.id === 'hermes-system')
    expect(hermesSource).toBeDefined()
    expect(hermesSource?.path).toBe(extraDir)
    expect(hermesSource?.type).toBe('local')
  })

  it('validates the document source registry shape', () => {
    const registry = getDocumentSourceRegistry()
    expect(validateDocumentSourceRegistry(registry)).toEqual([])
    expect(validateDocumentSourceRegistry([
      { id: 'dup', adapter: 'markdown', enabled: true },
      { id: 'dup', adapter: 'skills', enabled: true },
      { id: 'bad', adapter: 'unknown' as never, enabled: true },
    ])).toContain('duplicate source id: dup')
  })

  it('indexes Axi Skills SKILL.md files without Obsidian frontmatter', async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'axi-docs-skills-'))
    const skillDir = path.join(tempDir, 'skills', 'deep-init-pro')
    await fs.promises.mkdir(skillDir, { recursive: true })
    process.env.AXI_SKILLS_PATH = tempDir

    await fs.promises.writeFile(path.join(skillDir, 'SKILL.md'), [
      '---',
      'name: deep-init-pro',
      'description: Generate layered project docs for agents.',
      '---',
      '# Deep Init Pro',
      '',
      'Use this to create PARADIGM and ARCHITECTURE docs.',
    ].join('\n'), 'utf-8')

    const catalog = await getKnowledgeCatalog('axi-skills')
    expect(catalog.totalDocs).toBe(1)
    expect(catalog.sections.some((section) => section.key === 'standards')).toBe(true)

    const results = await searchKnowledge('axi-skills', 'deep-init-pro')
    expect(results[0]?.path).toBe('skills/deep-init-pro/SKILL.md')

    const allResults = await searchKnowledgeAll('deep-init-pro')
    expect(allResults.some((result) => result.sourceId === 'axi-skills')).toBe(true)

    const raw = await readKnowledgeFile('axi-skills', 'skills/deep-init-pro/SKILL.md')
    expect(raw).toContain('name: deep-init-pro')
  })

  it('handles missing skill descriptions and nested skill paths', async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'axi-docs-skills-nested-'))
    const nestedSkillDir = path.join(tempDir, 'skills', 'vendor', 'nested-skill')
    await fs.promises.mkdir(nestedSkillDir, { recursive: true })
    process.env.AXI_SKILLS_PATH = tempDir

    await fs.promises.writeFile(path.join(nestedSkillDir, 'SKILL.md'), [
      '---',
      'name: nested-skill',
      '---',
      '# Nested Skill',
      '',
      'A nested skill entrypoint.',
    ].join('\n'), 'utf-8')

    const results = await searchKnowledge('axi-skills', 'nested skill')
    expect(results.some((result) => result.path === 'skills/vendor/nested-skill/SKILL.md')).toBe(true)
    expect(results[0]?.description).toBeTruthy()
  })

  it('indexes workspace project status from WORKSPACE_INDEX.md', async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'axi-docs-workspace-'))
    const workspaceRoot = tempDir
    const governanceRoot = path.join(workspaceRoot, 'infra', 'axi-workspace-governance')
    await fs.promises.mkdir(path.join(governanceRoot, 'docs'), { recursive: true })
    process.env.AXI_WORKSPACE_GOVERNANCE_PATH = governanceRoot

    await fs.promises.writeFile(path.join(workspaceRoot, 'WORKSPACE_INDEX.md'), [
      '# Workspace Index',
      '',
      '| Project | Path | Purpose | Stack | Status | Authoritative docs | Common verification | Notes |',
      '| --- | --- | --- | --- | --- | --- | --- | --- |',
      '| Axi Docs | `/workspace/projects/axi-docs` | Documentation hub | React, TypeScript | active | `TODO.md` | `pnpm --dir app verify` | Canonical docs project |',
    ].join('\n'), 'utf-8')

    await fs.promises.writeFile(path.join(governanceRoot, 'docs', 'project-catalog.md'), '# Catalog\n', 'utf-8')

    const catalog = await getKnowledgeCatalog('workspace')
    expect(catalog.totalDocs).toBeGreaterThanOrEqual(2)
    expect(catalog.sections.some((section) => section.key === 'projects')).toBe(true)

    const summary = await getProjectSummary('axi-docs')
    expect(summary?.title).toBe('Axi Docs')
    expect(summary?.description).toContain('Documentation hub')
  })
})
