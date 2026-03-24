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
  title?: string
  tags?: string[]
  category?: string
  date?: string
  updated?: string
  description?: string
  aliases?: string[]
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
