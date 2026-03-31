import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { BlinkoView } from './components/BlinkoView'
import { DocumentView } from './components/DocumentView'
import { ErrorBoundary } from './components/ErrorBoundary'
import { KnowledgeWorkbench } from './components/KnowledgeWorkbench'
import { API_BASE } from './constants'
import { DocSource, KnowledgeCatalog, SearchResult, SelectedFile } from './types'

type PageMode = 'home' | 'explorer'
type ParamUpdates = Record<string, string | null | undefined>

function HubPage({ pageMode }: { pageMode: PageMode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sources, setSources] = useState<DocSource[]>([])
  const [activeSource, setActiveSource] = useState(searchParams.get('source') || 'obsidian')
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(() => {
    const docPath = searchParams.get('doc')
    return docPath ? { sourceId: searchParams.get('source') || 'obsidian', path: docPath } : null
  })
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(searchParams.get('tag'))
  const [searching, setSearching] = useState(false)
  const [catalog, setCatalog] = useState<KnowledgeCatalog | null>(null)
  const [catalogLoading, setCatalogLoading] = useState(false)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const searchAbortRef = useRef<AbortController | null>(null)

  const syncParams = useCallback((updates: ParamUpdates, replace = true) => {
    const next = new URLSearchParams(location.search)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })
    setSearchParams(next, { replace })
  }, [location.search, setSearchParams])

  const navigateWithParams = useCallback((pathname: string, updates?: ParamUpdates) => {
    const next = new URLSearchParams(location.search)
    Object.entries(updates || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })
    const search = next.toString()
    navigate({
      pathname,
      search: search ? `?${search}` : '',
    })
  }, [location.search, navigate])

  const fetchSources = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/sources`)
      if (!response.ok) return
      const data = await response.json() as DocSource[]
      setSources((current) => {
        if (
          current.length === data.length
          && current.every((source, index) => {
            const next = data[index]
            return source.id === next.id
              && source.name === next.name
              && source.enabled === next.enabled
              && source.type === next.type
              && source.icon === next.icon
          })
        ) {
          return current
        }
        return data
      })
      if (data.length === 0) return

      const fallbackSource = data.find((source) => source.id === activeSource) || data[0]
      if (!data.find((source) => source.id === activeSource)) {
        setActiveSource(fallbackSource.id)
        syncParams({ source: fallbackSource.id }, true)
      }
    } catch (error) {
      console.error('Failed to fetch sources:', error)
    }
  }, [activeSource, syncParams])

  const loadFile = useCallback(async (sourceId: string, filePath: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      const response = await fetch(
        `${API_BASE}/file?source=${sourceId}&path=${encodeURIComponent(filePath)}`,
        { signal: controller.signal },
      )
      if (controller.signal.aborted) return
      if (response.ok) {
        const content = await response.text()
        setFileContent(content)
        setFileName(filePath.split('/').pop()?.replace(/\.md$/, '') || 'Untitled')
      } else {
        setFileContent('# 文件加载失败\n\n无法加载该文件内容。')
        setFileName('Error')
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      setFileContent('# 加载错误\n\n网络请求失败。')
      setFileName('Error')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  const loadCatalog = useCallback(async (sourceId: string) => {
    setCatalogLoading(true)
    setCatalogError(null)
    try {
      const response = await fetch(`${API_BASE}/catalog?source=${sourceId}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json() as KnowledgeCatalog
      setCatalog(data)
    } catch (error) {
      setCatalog(null)
      setCatalogError(error instanceof Error ? error.message : '目录加载失败')
    } finally {
      setCatalogLoading(false)
    }
  }, [])

  const runSearch = useCallback(async (query: string) => {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) {
      setSearchResults(null)
      setSearching(false)
      return
    }

    searchAbortRef.current?.abort()
    const controller = new AbortController()
    searchAbortRef.current = controller

    setSearching(true)
    try {
      const params = new URLSearchParams({ q: normalizedQuery, source: activeSource })
      if (activeTag) params.set('tag', activeTag)
      const response = await fetch(`${API_BASE}/search?${params}`, { signal: controller.signal })
      if (!response.ok || controller.signal.aborted) return
      const results = await response.json() as SearchResult[]
      setSearchResults(results)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      if (!controller.signal.aborted) {
        setSearching(false)
      }
    }
  }, [activeSource, activeTag])

  useEffect(() => {
    void fetchSources()
  }, [fetchSources])

  useEffect(() => {
    const sourceFromUrl = searchParams.get('source') || activeSource
    const queryFromUrl = searchParams.get('q') || ''
    const tagFromUrl = searchParams.get('tag')
    const docFromUrl = searchParams.get('doc')
    const normalizedSelectedFile = docFromUrl
      ? { sourceId: sourceFromUrl, path: docFromUrl }
      : null

    if (sourceFromUrl !== activeSource) setActiveSource(sourceFromUrl)
    if (queryFromUrl !== searchQuery) setSearchQuery(queryFromUrl)
    if ((tagFromUrl || null) !== activeTag) setActiveTag(tagFromUrl)

    const currentDoc = selectedFile ? `${selectedFile.sourceId}:${selectedFile.path}` : null
    const nextDoc = normalizedSelectedFile ? `${normalizedSelectedFile.sourceId}:${normalizedSelectedFile.path}` : null
    if (currentDoc !== nextDoc) {
      setSelectedFile(normalizedSelectedFile)
    }
  }, [activeSource, activeTag, searchParams, searchQuery, selectedFile])

  useEffect(() => {
    if (!selectedFile) {
      abortRef.current?.abort()
      setFileContent(null)
      setFileName('')
      setLoading(false)
      return
    }
    void loadFile(selectedFile.sourceId, selectedFile.path)
  }, [loadFile, selectedFile?.path, selectedFile?.sourceId])

  useEffect(() => {
    if (activeSource === 'blinko') {
      setCatalog(null)
      setCatalogError(null)
      setCatalogLoading(false)
      return
    }
    void loadCatalog(activeSource)
  }, [activeSource, loadCatalog, refreshKey])

  useEffect(() => {
    void runSearch(searchQuery)
  }, [activeSource, activeTag, refreshKey, runSearch, searchQuery])

  const handleFileSelect = useCallback((sourceId: string, path: string) => {
    setSelectedFile({ sourceId, path })
    if (sourceId !== activeSource) {
      setActiveSource(sourceId)
    }
    syncParams({
      source: sourceId,
      doc: path,
    }, false)
  }, [activeSource, syncParams])

  const handleClearSelectedFile = useCallback(() => {
    setSelectedFile(null)
    setFileContent(null)
    setFileName('')
    syncParams({
      doc: null,
      node: null,
      branch: new URLSearchParams(location.search).get('branch'),
    }, false)
  }, [location.search, syncParams])

  const handleSourceChange = useCallback((sourceId: string) => {
    setActiveSource(sourceId)
    setSelectedFile(null)
    setFileContent(null)
    setFileName('')
    setSearchResults(null)
    setSearchQuery('')
    setActiveTag(null)
    setCatalog(null)
    setCatalogError(null)

    syncParams({
      source: sourceId,
      q: null,
      tag: null,
      doc: null,
      branch: null,
      node: null,
      view: pageMode === 'explorer' ? 'tree' : new URLSearchParams(location.search).get('view'),
    }, false)

    if (pageMode === 'explorer' && sourceId === 'blinko') {
      navigateWithParams('/home', {
        source: sourceId,
        view: null,
        branch: null,
        node: null,
      })
    }
  }, [location.search, navigateWithParams, pageMode, syncParams])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setSelectedFile(null)
    setFileContent(null)
    setFileName('')
    syncParams({
      q: query.trim() ? query : null,
      doc: null,
      node: null,
    }, false)
  }, [syncParams])

  const handleRefresh = useCallback(() => {
    setRefreshKey((current) => current + 1)
    void fetchSources()
  }, [fetchSources])

  const handleTagSelect = useCallback((tag: string | null) => {
    setActiveTag(tag)
    setSelectedFile(null)
    setFileContent(null)
    setFileName('')
    syncParams({
      tag,
      doc: null,
      node: null,
    }, false)
  }, [syncParams])

  const handleWikiLink = useCallback((noteName: string) => {
    handleSearch(noteName)
  }, [handleSearch])

  const handleNavigateHome = useCallback(() => {
    navigateWithParams('/home', {
      view: null,
      branch: null,
      node: null,
    })
  }, [navigateWithParams])

  const handleNavigateExplorer = useCallback(() => {
    const currentSource = sources.find((source) => source.id === activeSource)
    if (currentSource?.type !== 'local') return
    navigateWithParams('/explorer', {
      view: new URLSearchParams(location.search).get('view') || 'tree',
    })
  }, [activeSource, location.search, navigateWithParams, sources])

  const currentSource = sources.find((source) => source.id === activeSource)
  const isBlinkoFeed = activeSource === 'blinko' && !selectedFile
  const showExplorerUnavailable = pageMode === 'explorer' && currentSource?.type !== 'local'

  return (
    <div className={`app-layout app-layout--${pageMode}`}>
      <Header
        activeSourceName={currentSource?.name || activeSource}
        onNavigateExplorer={handleNavigateExplorer}
        onNavigateHome={handleNavigateHome}
        onRefresh={handleRefresh}
        onSearch={handleSearch}
        pageMode={pageMode}
        searchQuery={searchQuery}
        searching={searching}
      />
      <div className="app-body">
        <Sidebar
          activeSource={activeSource}
          activeTag={activeTag}
          onFileSelect={handleFileSelect}
          onSourceChange={handleSourceChange}
          onTagSelect={handleTagSelect}
          refreshKey={refreshKey}
          selectedFile={selectedFile}
          sources={sources}
        />
        <main className={`app-main app-main--${pageMode}`}>
          <ErrorBoundary>
            {isBlinkoFeed ? (
              <BlinkoView onNoteSelect={handleFileSelect} refreshKey={refreshKey} />
            ) : showExplorerUnavailable ? (
              <div className="workspace-empty-state">
                <div className="workspace-empty-state__eyebrow">Knowledge Explorer</div>
                <h2>当前数据源暂不支持图谱探索</h2>
                <p>图谱探索仅对本地知识库开放。你可以切回 Obsidian，或者先在 Blinko 中浏览与整理闪念。</p>
                <button className="workspace-empty-state__action" onClick={handleNavigateHome}>
                  返回指挥中心
                </button>
              </div>
            ) : activeSource === 'blinko' ? (
              <DocumentView
                content={fileContent}
                fileName={fileName}
                loading={loading}
                onTagSelect={handleTagSelect}
                onWikiLink={handleWikiLink}
                selectedFile={selectedFile}
                showKnowledgePanel={false}
                source={currentSource}
              />
            ) : currentSource ? (
              <KnowledgeWorkbench
                activeTag={activeTag}
                catalog={catalog}
                catalogError={catalogError}
                catalogLoading={catalogLoading}
                fileContent={fileContent}
                fileLoading={loading}
                fileName={fileName}
                onClearSelectedFile={handleClearSelectedFile}
                onNavigateExplorer={handleNavigateExplorer}
                onNavigateHome={handleNavigateHome}
                onOpenItem={handleFileSelect}
                onSearch={handleSearch}
                onTagSelect={handleTagSelect}
                onWikiLink={handleWikiLink}
                pageMode={pageMode}
                searchQuery={searchQuery}
                searchResults={searchResults}
                searching={searching}
                selectedFile={selectedFile}
                source={currentSource}
              />
            ) : (
              <div className="loading"><div className="spinner" /></div>
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HubPage pageMode="home" />} />
      <Route path="/explorer" element={<HubPage pageMode="explorer" />} />
    </Routes>
  )
}

export default App
