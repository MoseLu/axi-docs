export interface DocSource {
  id: string
  name: string
  path: string
  enabled: boolean
  type?: 'local' | 'api'
  apiUrl?: string
}

export interface DocFile {
  id: string
  name: string
  path: string
  relativePath: string
  content: string
  extension: string
  lastModified: Date
  sourceId: string
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
