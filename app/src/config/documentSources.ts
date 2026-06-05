import path from 'path'
import type { DocSource, DocumentSourceConfig } from '../types'

const DEFAULT_OBSIDIAN_PATH = 'F:/docs/obsidian/'
const DEFAULT_BLINKO_URL = 'http://localhost:1111'

function resolveWorkspacePath(...segments: string[]): string {
  return path.resolve(process.cwd(), '../../..', ...segments)
}

function existingOrFallback(primary: string, fallback: string): string {
  return primary || fallback
}

export function getDocumentSourceRegistry(): DocumentSourceConfig[] {
  const axiSkillsPath = existingOrFallback(
    process.env.AXI_SKILLS_PATH || '',
    resolveWorkspacePath('shared', 'axi-skills'),
  )
  const workspaceGovernancePath = existingOrFallback(
    process.env.AXI_WORKSPACE_GOVERNANCE_PATH || '',
    resolveWorkspacePath('infra', 'axi-workspace-governance'),
  )
  const dbskillPath = existingOrFallback(
    process.env.DBSKILL_PATH || '',
    resolveWorkspacePath('shared', 'dbskill'),
  )

  return [
    {
      id: 'workspace',
      name: 'Axi Workspace',
      description: 'Axi 工作区项目索引、治理目录和 Agent 入口。',
      path: workspaceGovernancePath,
      enabled: true,
      type: 'local',
      kind: 'workspace-registry',
      adapter: 'workspace',
      audience: ['agent', 'human'],
      readOnly: true,
      icon: 'folder',
    },
    {
      id: 'axi-skills',
      name: 'Axi Skills',
      description: 'Axi agents 共享技能库，索引 skills/**/SKILL.md。',
      path: axiSkillsPath,
      enabled: true,
      type: 'local',
      kind: 'skill-library',
      adapter: 'skills',
      audience: ['agent', 'human'],
      readOnly: true,
      organizationHint: 'skill-families',
      icon: 'folder',
    },
    {
      id: 'dbskill',
      name: 'dbskill',
      description: 'dontbesilent 最新 dbskill 工具箱，按 dbs 诊断、内容工程、决策、学习和状态管理组织。',
      path: dbskillPath,
      enabled: process.env.DBSKILL_CONTENT_ASSETS_ENABLED !== 'false',
      type: 'local',
      kind: 'skill-library',
      adapter: 'skills',
      audience: ['agent', 'human'],
      readOnly: true,
      includeSkillAssets: true,
      includeSupportDocs: true,
      organizationHint: 'dbskill',
      icon: 'folder',
    },
    {
      id: 'obsidian',
      name: 'Obsidian 知识库',
      description: '长期沉淀的结构化知识与项目文档。',
      path: process.env.OBSIDIAN_PATH || DEFAULT_OBSIDIAN_PATH,
      enabled: true,
      type: 'local',
      kind: 'markdown-vault',
      adapter: 'markdown',
      audience: ['agent', 'human'],
      readOnly: false,
      icon: 'obsidian',
    },
    {
      id: 'blinko',
      name: 'Blinko 闪念',
      description: '短期灵感、碎片记录与快速捕捉。',
      path: '',
      enabled: true,
      type: 'api',
      kind: 'api-notes',
      adapter: 'api',
      audience: ['agent', 'human'],
      readOnly: false,
      apiUrl: process.env.BLINKO_URL || DEFAULT_BLINKO_URL,
      apiToken: process.env.BLINKO_TOKEN || '',
      icon: 'blinko',
    },
  ]
}

export function validateDocumentSourceRegistry(sources: Pick<DocSource, 'id' | 'adapter' | 'enabled'>[]): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const validAdapters = new Set(['markdown', 'skills', 'workspace', 'api'])

  for (const source of sources) {
    if (!source.id.trim()) errors.push('source id is required')
    if (ids.has(source.id)) errors.push(`duplicate source id: ${source.id}`)
    ids.add(source.id)
    if (source.adapter && !validAdapters.has(source.adapter)) {
      errors.push(`invalid adapter for ${source.id}: ${source.adapter}`)
    }
  }

  if (!sources.some((source) => source.enabled)) {
    errors.push('at least one source must be enabled')
  }

  return errors
}
