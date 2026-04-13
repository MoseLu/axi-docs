// ─── Source Types ──────────────────────────────────────────────────────────────

export interface DocSource {
  id: string
  name: string
  description?: string
  path: string
  enabled: boolean
  type: 'local' | 'api'
  apiUrl?: string
  apiToken?: string
  icon?: 'obsidian' | 'blinko' | 'folder'
}

// ─── File / Document Types ────────────────────────────────────────────────────

export interface Frontmatter {
  id?: string
  title?: string
  tags?: string[]
  category?: string
  categories?: string[] | string
  date?: string
  updated?: string
  created?: string
  modified?: string
  description?: string
  aliases?: string[]
  type?: string
  status?: string
  tech?: string
  version?: string
  domain?: string
  problem?: string
  graphTitle?: string
  graphTags?: string[] | string
  ['graph-title']?: string
  ['graph-tags']?: string[] | string
  section?: string[] | string
  sections?: string[] | string
  knowledgeSection?: string[] | string
  knowledgeSections?: string[] | string
  ['tech-stack']?: string[] | string
  ['project-status']?: string
  [key: string]: unknown
}

export interface FileItem {
  id: string
  name: string
  path: string
  relativePath: string
  type: 'file' | 'directory'
  extension: string
  lastModified: string
  sourceId: string
  tags?: string[]
  rawTags?: string[]
  graphTitle?: string
  frontmatter?: Frontmatter
}

// Legacy aliases (keep existing component compatibility)
export type DocFile = {
  id: string
  name: string
  path: string
  relativePath: string
  content: string
  extension: string
  lastModified: Date
  sourceId: string
  tags?: string[]
  frontmatter?: Frontmatter
}

export interface DocFolder {
  id: string
  name: string
  path: string
  relativePath: string
  children: (DocFolder | DocFile)[]
  sourceId: string
}

export interface DocTree {
  roots: (DocFolder | DocFile)[]
}

// ─── Blinko Types ─────────────────────────────────────────────────────────────

export interface BlinkoNote {
  id: number
  content: string
  type: 0 | 1  // 0 = flash note, 1 = long note
  tags?: string[]
  files?: BlinkoAttachment[]
  createdAt: string
  updatedAt: string
  isShare?: boolean
  sharePassword?: string
}

export interface BlinkoAttachment {
  id: number
  name: string
  path: string
  size: number
  type: string
}

// ─── Search Types ─────────────────────────────────────────────────────────────

export interface SearchResult {
  sourceId: string
  path: string
  name: string
  type: 'file' | 'blinko'
  snippet: string
  matches: SearchMatch[]
  score: number
  tags?: string[]
  rawTags?: string[]
  title?: string
  rawTitle?: string
  description?: string
  docType?: string
  categories?: string[]
  matchedBy?: string[]
}

export interface SearchMatch {
  line: number
  text: string
  highlight: [number, number][]
}

// ─── Table of Contents ────────────────────────────────────────────────────────

export interface TocHeading {
  level: 1 | 2 | 3 | 4 | 5 | 6
  text: string
  id: string
}

// ─── Knowledge Graph Types ────────────────────────────────────────────────────

export type GraphNodeKind = 'current' | 'note' | 'tag'

export interface GraphNode {
  id: string
  label: string
  kind: GraphNodeKind
  x: number
  y: number
  vx: number
  vy: number
}

export interface GraphEdge {
  source: string
  target: string
  kind: 'wikilink' | 'tag'
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  orphanNodes?: GraphNode[]
}

export interface KnowledgeCatalogItem {
  sourceId: string
  path: string
  name: string
  title: string
  rawTitle?: string
  description?: string
  docType?: string
  status?: string
  tags: string[]
  rawTags?: string[]
  categories: string[]
  techStack: string[]
  updated?: string
  graphTitle?: string
}

export interface KnowledgeCatalogSection {
  key: string
  title: string
  description: string
  count: number
  items: KnowledgeCatalogItem[]
}

export interface KnowledgeCatalog {
  sourceId: string
  totalDocs: number
  totalTags: number
  generatedAt: string
  topTags: Array<{ name: string; count: number }>
  recentDocs: KnowledgeCatalogItem[]
  sections: KnowledgeCatalogSection[]
}

export interface KnowledgeGraphSnapshotNode {
  id: string
  label: string
  kind: 'current' | 'note' | 'tag'
  path?: string
  tags?: string[]
}

export interface KnowledgeGraphSnapshotEdge {
  source: string
  target: string
  kind: 'wikilink' | 'tag'
}

export interface KnowledgeGraphSnapshot {
  nodes: KnowledgeGraphSnapshotNode[]
  edges: KnowledgeGraphSnapshotEdge[]
  orphanNodes?: KnowledgeGraphSnapshotNode[]
}

export interface StaticKnowledgeDocument extends KnowledgeCatalogItem {
  content: string
  frontmatter: Frontmatter
  aliases: string[]
  sourceTags?: string[]
}

export interface StaticKnowledgeManifest {
  version: number
  generatedAt: string
  defaultSourceId: string | null
  sources: DocSource[]
}

export interface StaticKnowledgeSourceBundle {
  version: number
  generatedAt: string
  source: DocSource
  catalog: KnowledgeCatalog
  tags: Array<{ name: string; count: number }>
  documents: StaticKnowledgeDocument[]
  directoryIndex: Record<string, FileItem[]>
  globalGraph: KnowledgeGraphSnapshot
}

// ─── AI Analysis Types ────────────────────────────────────────────────────────

export interface AiConcept {
  term: string
  definition: string
}

export interface AiAnalysis {
  summary: string
  keyPoints: string[]
  concepts: AiConcept[]
  error?: string
}

// ─── Knowledge Panel ──────────────────────────────────────────────────────────

export type KnowledgePanelTab = 'graph' | 'toc' | 'ai'

// ─── App State ────────────────────────────────────────────────────────────────

export interface SelectedFile {
  sourceId: string
  path: string
}

export interface AppState {
  selectedFile: SelectedFile | null
  searchQuery: string
  activeTag: string | null
  activeSource: string
}
