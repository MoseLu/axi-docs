import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { DocumentView } from './components/DocumentView'
import { BlinkoView } from './components/BlinkoView'
import { SearchResults } from './components/SearchResults'
import { DocSource, SelectedFile, SearchResult } from './types'
import { API_BASE } from './constants'

function HomePage() {
  const [sources, setSources] = useState<DocSource[]>([])
  const [activeSource, setActiveSource] = useState<string>('obsidian')
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchSources()
  }, [])

  useEffect(() => {
    if (selectedFile) {
      loadFile(selectedFile.sourceId, selectedFile.path)
    }
  }, [selectedFile])

  const fetchSources = async () => {
    try {
      const response = await fetch(`${API_BASE}/sources`)
      if (response.ok) {
        const data = await response.json()
        setSources(data)
        if (data.length > 0 && !data.find((s: DocSource) => s.id === activeSource)) {
          setActiveSource(data[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch sources:', error)
    }
  }

  const loadFile = async (sourceId: string, filePath: string) => {
    setLoading(true)
    setSearchResults(null)
    try {
      const response = await fetch(
        `${API_BASE}/file?source=${sourceId}&path=${encodeURIComponent(filePath)}`
      )
      if (response.ok) {
        const content = await response.text()
        setFileContent(content)
        setFileName(filePath.split('/').pop()?.replace(/\.md$/, '') || 'Untitled')
      } else {
        setFileContent('# 文件加载失败\n\n无法加载该文件内容。')
        setFileName('Error')
      }
    } catch {
      setFileContent('# 加载错误\n\n网络请求失败。')
      setFileName('Error')
    }
    setLoading(false)
  }

  const handleFileSelect = useCallback((sourceId: string, path: string) => {
    setSelectedFile({ sourceId, path })
    setSearchResults(null)
    setSearchQuery('')
  }, [])

  const handleRefresh = () => {
    setRefreshKey(k => k + 1)
    if (selectedFile) {
      loadFile(selectedFile.sourceId, selectedFile.path)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults(null)
      return
    }
    setSearching(true)
    try {
      const params = new URLSearchParams({ q: query, source: activeSource })
      if (activeTag) params.set('tag', activeTag)
      const response = await fetch(`${API_BASE}/search?${params}`)
      if (response.ok) {
        const results: SearchResult[] = await response.json()
        setSearchResults(results)
        setSelectedFile(null)
      }
    } catch (error) {
      console.error('Search failed:', error)
    }
    setSearching(false)
  }

  const handleTagSelect = (tag: string | null) => {
    setActiveTag(tag)
    setSearchResults(null)
    setSelectedFile(null)
  }

  const handleWikiLink = (noteName: string) => {
    // Try to find the note in current source
    setSearchQuery(noteName)
    handleSearch(noteName)
  }

  const currentSource = sources.find(s => s.id === activeSource)
  const isBlinko = activeSource === 'blinko' && !selectedFile

  return (
    <div className="app-layout">
      <Header
        onRefresh={handleRefresh}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        searching={searching}
      />
      <div className="app-body">
        <Sidebar
          sources={sources}
          activeSource={activeSource}
          onSourceChange={setActiveSource}
          onFileSelect={handleFileSelect}
          refreshKey={refreshKey}
          selectedFile={selectedFile}
          activeTag={activeTag}
          onTagSelect={handleTagSelect}
        />
        <main className="app-main">
          {searchResults !== null ? (
            <SearchResults
              results={searchResults}
              query={searchQuery}
              onFileSelect={handleFileSelect}
            />
          ) : isBlinko ? (
            <BlinkoView onNoteSelect={handleFileSelect} refreshKey={refreshKey} />
          ) : (
            <DocumentView
              content={fileContent}
              fileName={fileName}
              loading={loading}
              selectedFile={selectedFile}
              source={currentSource}
              onWikiLink={handleWikiLink}
            />
          )}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  )
}

export default App
