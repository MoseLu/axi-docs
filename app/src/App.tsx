import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Header } from './components/Header'
import { CategoryGraphPage } from './components/CategoryGraphPage'
import { DocumentDetailPage } from './components/DocumentDetailPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { KnowledgeWorkbench } from './components/KnowledgeWorkbench'
import type { GuidePageId } from './components/HomeCommandCenter'
import { NotFoundPage } from './components/NotFoundPage'
import { KNOWLEDGE_CATEGORY_ORDER, getKnowledgeCategoryMeta, normalizeKnowledgeCategoryKey } from './config/knowledgeRules'
import {
  getKnowledgeCatalog as loadKnowledgeCatalog,
  listKnowledgeSources as loadKnowledgeSources,
  readKnowledgeFile as loadKnowledgeFileContent,
  searchKnowledgeAll as searchKnowledgeDocuments,
} from './lib/knowledgeClient'
import {
  buildCategoryRoute,
  buildDocumentRoute,
  decodeDocumentId,
  decodeDocumentRoute,
  encodeDocumentId,
  normalizeCategoryRoute,
} from './lib/routes'
import { DocSource, KnowledgeCatalog, KnowledgeCatalogItem, SearchResult, SearchSuggestion, SelectedFile } from './types'

type PageMode = 'home' | 'category' | 'document'
type ParamUpdates = Record<string, string | null | undefined>
const GUIDE_PAGE_IDS = new Set<GuidePageId>(['what-is-axi-docs', 'getting-started', 'search', 'next-steps'])
const DEFAULT_GUIDE_ROUTE = '/zh/guide/getting-started'
const GUIDE_SEARCH_ROUTE = '/zh/guide/search'
const LEGACY_GUIDE_HASH_ROUTES: Record<string, string> = {
  '#what-is-axi-docs': '/zh/guide/what-is-axi-docs',
  '#quick-start': DEFAULT_GUIDE_ROUTE,
  '#getting-started': DEFAULT_GUIDE_ROUTE,
  '#search-results': GUIDE_SEARCH_ROUTE,
  '#next-steps': '/zh/guide/next-steps',
}

function flattenCatalogItems(catalog: KnowledgeCatalog | null): KnowledgeCatalogItem[] {
  if (!catalog) return []
  return catalog.sections.flatMap((section) => section.items)
}

function HubPage({ pageMode }: { pageMode: PageMode }) {
  const params = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const routeCategory = useMemo(
    () => (pageMode === 'category' ? normalizeCategoryRoute(params.categoryId, params.subId) : null),
    [pageMode, params.categoryId, params.subId],
  )
  const routeDocument = useMemo(
    () => (pageMode === 'document' ? decodeDocumentRoute(params.sourceId, params['*']) : null),
    [pageMode, params],
  )
  const docParam = searchParams.get('doc') || ''
  const previewDocument = useMemo(
    () => (pageMode === 'document' ? routeDocument : decodeDocumentId(docParam)),
    [docParam, pageMode, routeDocument],
  )
  const urlSearchQuery = searchParams.get('q') || searchParams.get('keyword') || ''
  const guidePageId = pageMode === 'home' && params.guideId && GUIDE_PAGE_IDS.has(params.guideId as GuidePageId)
    ? params.guideId as GuidePageId
    : 'getting-started'

  const [sources, setSources] = useState<DocSource[]>([])
  const [activeSource, setActiveSource] = useState(searchParams.get('source') || routeDocument?.sourceId || 'workspace')
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(() => (pageMode === 'document' ? null : previewDocument))
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery)
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(searchParams.get('tag'))
  const [searching, setSearching] = useState(false)
  const [catalog, setCatalog] = useState<KnowledgeCatalog | null>(null)
  const [catalogLoading, setCatalogLoading] = useState(false)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const searchAbortRef = useRef<AbortController | null>(null)

  const effectiveSelectedFile = pageMode === 'document' ? routeDocument : selectedFile
  const currentSource = useMemo(
    () => sources.find((source) => source.id === activeSource) || null,
    [activeSource, sources],
  )
  const primaryWorkspaceSource = useMemo(
    () => sources.find((source) => source.enabled && source.type === 'local')
      || sources.find((source) => source.enabled)
      || null,
    [sources],
  )
  const workspaceSource = useMemo(() => {
    if (pageMode === 'document') return currentSource || primaryWorkspaceSource
    return currentSource?.type === 'local' ? currentSource : primaryWorkspaceSource
  }, [currentSource, pageMode, primaryWorkspaceSource])

  const syncParams = useCallback((updates: ParamUpdates, replace = true) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })
    setSearchParams(next, { replace })
  }, [searchParams, setSearchParams])

  const buildLocation = useCallback((pathname: string, updates?: ParamUpdates) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })
    const search = next.toString()
    return {
      pathname,
      search: search ? `?${search}` : '',
    }
  }, [searchParams])

  const buildHref = useCallback((pathname: string, updates?: ParamUpdates) => {
    const location = buildLocation(pathname, updates)
    return `${location.pathname}${location.search}`
  }, [buildLocation])

  const navigateWithParams = useCallback((pathname: string, updates?: ParamUpdates, replace = false) => {
    navigate(buildLocation(pathname, updates), { replace })
  }, [buildLocation, navigate])

  const fetchSources = useCallback(async () => {
    try {
      const data = await loadKnowledgeSources()
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

      const preferredSource = routeDocument?.sourceId || activeSource
      const fallbackSource = data.find((source) => source.id === preferredSource) || data[0]
      if (!data.find((source) => source.id === preferredSource)) {
        setActiveSource(fallbackSource.id)
        syncParams({ source: fallbackSource.id }, true)
      }
    } catch (error) {
      console.error('Failed to fetch sources:', error)
    }
  }, [activeSource, routeDocument?.sourceId, syncParams])

  const loadFile = useCallback(async (sourceId: string, filePath: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    try {
      if (controller.signal.aborted) return
      const content = await loadKnowledgeFileContent(sourceId, filePath)
      if (controller.signal.aborted) return
      if (content !== null) {
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
      const data = await loadKnowledgeCatalog(sourceId)
      if (!data) {
        throw new Error('目录加载失败')
      }
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
      const results = await searchKnowledgeDocuments(normalizedQuery)
      if (controller.signal.aborted) return
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
  }, [])

  useEffect(() => {
    void fetchSources()
  }, [fetchSources])

  useEffect(() => {
    if (urlSearchQuery !== searchQuery) setSearchQuery(urlSearchQuery)
    if ((searchParams.get('tag') || null) !== activeTag) setActiveTag(searchParams.get('tag'))
    if (previewDocument?.sourceId && previewDocument.sourceId !== activeSource) {
      setActiveSource(previewDocument.sourceId)
    } else {
      const sourceFromUrl = searchParams.get('source')
      if (sourceFromUrl && sourceFromUrl !== activeSource) {
        setActiveSource(sourceFromUrl)
      }
    }

    if (pageMode !== 'document') {
      const currentDoc = selectedFile ? `${selectedFile.sourceId}:${selectedFile.path}` : null
      const nextDoc = previewDocument ? `${previewDocument.sourceId}:${previewDocument.path}` : null
      if (currentDoc !== nextDoc) {
        setSelectedFile(previewDocument)
      }
    }
  }, [activeSource, activeTag, pageMode, previewDocument, searchParams, searchQuery, selectedFile, urlSearchQuery])

  useEffect(() => {
    if (!effectiveSelectedFile) {
      abortRef.current?.abort()
      setFileContent(null)
      setFileName('')
      setLoading(false)
      return
    }
    void loadFile(effectiveSelectedFile.sourceId, effectiveSelectedFile.path)
  }, [effectiveSelectedFile, loadFile])

  useEffect(() => {
    const catalogSourceId = pageMode === 'document'
      ? routeDocument?.sourceId || activeSource
      : workspaceSource?.id
    if (!catalogSourceId || catalogSourceId === 'blinko') {
      setCatalog(null)
      setCatalogError(null)
      setCatalogLoading(false)
      return
    }
    void loadCatalog(catalogSourceId)
  }, [activeSource, loadCatalog, pageMode, routeDocument?.sourceId, workspaceSource?.id])

  useEffect(() => {
    if (pageMode === 'document') return
    void runSearch(searchQuery)
  }, [pageMode, runSearch, searchQuery])

  const catalogItems = useMemo(() => flattenCatalogItems(catalog), [catalog])
  const selectedCatalogItem = useMemo(
    () => effectiveSelectedFile
      ? catalogItems.find((item) => item.sourceId === effectiveSelectedFile.sourceId && item.path === effectiveSelectedFile.path) || null
      : null,
    [catalogItems, effectiveSelectedFile],
  )
  const defaultCategoryKey = useMemo(() => {
    const explicitCategory = routeCategory
      || normalizeKnowledgeCategoryKey(selectedCatalogItem?.categories?.[0] || '')
      || normalizeKnowledgeCategoryKey(catalog?.sections[0]?.key || '')
    return explicitCategory || KNOWLEDGE_CATEGORY_ORDER[0]
  }, [catalog?.sections, routeCategory, selectedCatalogItem?.categories])
  const categorySection = useMemo(
    () => routeCategory ? catalog?.sections.find((section) => section.key === routeCategory) || null : null,
    [catalog?.sections, routeCategory],
  )
  const relatedItems = useMemo(() => {
    if (!selectedCatalogItem) return []
    const primaryCategory = normalizeKnowledgeCategoryKey(selectedCatalogItem.categories[0] || '')
    if (!primaryCategory) return []
    return catalogItems
      .filter((item) => item.path !== selectedCatalogItem.path && item.categories.includes(primaryCategory))
      .slice(0, 8)
  }, [catalogItems, selectedCatalogItem])
  const documentSiblings = useMemo(() => {
    const primaryCategory = normalizeKnowledgeCategoryKey(selectedCatalogItem?.categories[0] || '')
    if (!primaryCategory) return []
    return catalog?.sections.find((section) => section.key === primaryCategory)?.items.slice(0, 10) || []
  }, [catalog?.sections, selectedCatalogItem?.categories])
  const handleNavigateHome = useCallback(() => {
    navigateWithParams(DEFAULT_GUIDE_ROUTE, {
      q: null,
      keyword: null,
      tag: null,
      doc: null,
      branch: null,
      node: null,
      view: null,
    })
  }, [navigateWithParams])

  const handleNavigateCategory = useCallback(() => {
    const targetSource = workspaceSource?.id || 'obsidian'
    navigateWithParams(
      buildCategoryRoute(defaultCategoryKey),
      {
        source: targetSource,
        q: null,
        keyword: null,
        tag: null,
        doc: null,
        branch: null,
        node: null,
        view: 'tree',
      },
    )
  }, [defaultCategoryKey, navigateWithParams, workspaceSource?.id])

  const handleSelectSource = useCallback((sourceId: string) => {
    if (sourceId !== activeSource) {
      setActiveSource(sourceId)
    }
    setSelectedFile(null)
    setFileContent(null)
    setFileName('')
    syncParams({
      source: sourceId,
      doc: null,
      tag: null,
      branch: null,
      node: null,
    }, false)
  }, [activeSource, syncParams])

  const handleOpenPreview = useCallback((sourceId: string, path: string) => {
    const nextFile = { sourceId, path }
    setSelectedFile(nextFile)
    if (sourceId !== activeSource) {
      setActiveSource(sourceId)
    }
    if (pageMode !== 'document') {
      syncParams({
        source: sourceId,
        doc: encodeDocumentId(nextFile),
      }, false)
    }
  }, [activeSource, pageMode, syncParams])

  const handleOpenDocument = useCallback((sourceId: string, path: string) => {
    navigateWithParams(
      buildDocumentRoute({ sourceId, path }),
      {
        source: sourceId,
        doc: null,
        branch: null,
        node: null,
        view: null,
      },
    )
  }, [navigateWithParams])

  const handlePreviewCategoryItem = useCallback((sourceId: string, path: string) => {
    const nextFile = { sourceId, path }
    setSelectedFile(nextFile)
    if (sourceId !== activeSource) {
      setActiveSource(sourceId)
    }
    syncParams({
      source: sourceId,
      doc: encodeDocumentId(nextFile),
      node: path,
    }, false)
  }, [activeSource, syncParams])

  const handleClearSelectedFile = useCallback(() => {
    setSelectedFile(null)
    setFileContent(null)
    setFileName('')
    if (pageMode === 'document') return
    syncParams({
      doc: null,
      node: null,
      branch: searchParams.get('branch'),
    }, false)
  }, [pageMode, searchParams, syncParams])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setSelectedFile(null)
    setFileContent(null)
    setFileName('')

    syncParams({
      q: query.trim() ? query : null,
      keyword: null,
      doc: null,
      node: null,
    }, false)
  }, [syncParams])

  const handleSearchSubmit = useCallback((query: string) => {
    const normalizedQuery = query.trim()
    setActiveTag(null)
    setSearchQuery(normalizedQuery)
    setSelectedFile(null)
    setFileContent(null)
    setFileName('')

    navigateWithParams(GUIDE_SEARCH_ROUTE, {
      q: normalizedQuery || null,
      keyword: null,
      tag: null,
      doc: null,
      branch: null,
      node: null,
      view: null,
    })
  }, [navigateWithParams])

  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.kind === 'document' && suggestion.sourceId && suggestion.path) {
      handleOpenDocument(suggestion.sourceId, suggestion.path)
      return
    }
    handleSearchSubmit(suggestion.query)
  }, [handleOpenDocument, handleSearchSubmit])

  const handleTagSelect = useCallback((tag: string | null) => {
    setActiveTag(tag)
    setSelectedFile(null)
    setFileContent(null)
    setFileName('')
    if (pageMode === 'document') return
    syncParams({
      tag,
      doc: null,
      node: null,
    }, false)
  }, [pageMode, syncParams])

  const handleWikiLink = useCallback((noteName: string) => {
    if (pageMode === 'document') {
      navigateWithParams(GUIDE_SEARCH_ROUTE, {
        q: noteName,
        keyword: null,
        source: activeSource,
        doc: null,
      })
      return
    }
    handleSearch(noteName)
  }, [activeSource, handleSearch, navigateWithParams, pageMode])

  const invalidCategoryRoute = pageMode === 'category' && !routeCategory
  const documentCategoryKey = normalizeKnowledgeCategoryKey(selectedCatalogItem?.categories[0] || '')
  const documentCategoryMeta = documentCategoryKey ? getKnowledgeCategoryMeta(documentCategoryKey) : null
  const categoryTargetSource = workspaceSource?.id || 'obsidian'
  const homeHref = useMemo(() => buildHref(DEFAULT_GUIDE_ROUTE, {
    q: null,
    keyword: null,
    tag: null,
    doc: null,
    branch: null,
    node: null,
    view: null,
  }), [buildHref])
  const categoryHref = useMemo(() => buildHref(
    buildCategoryRoute(defaultCategoryKey),
    {
      source: categoryTargetSource,
      q: null,
      keyword: null,
      tag: null,
      doc: null,
      branch: null,
      node: null,
      view: 'tree',
    },
  ), [buildHref, categoryTargetSource, defaultCategoryKey])
  const getDocumentHref = useCallback((sourceId: string, path: string) => buildDocumentRoute({ sourceId, path }), [])
  const getCategoryHref = useCallback((route: string) => buildHref(route, {
    source: categoryTargetSource,
    doc: null,
    node: null,
    branch: null,
    view: 'tree',
  }), [buildHref, categoryTargetSource])
  const documentGraphHref = useMemo(() => {
    if (!effectiveSelectedFile) return categoryHref

    return buildHref(
      buildCategoryRoute(documentCategoryKey || defaultCategoryKey),
      {
        source: effectiveSelectedFile.sourceId,
        doc: encodeDocumentId(effectiveSelectedFile),
        node: effectiveSelectedFile.path,
        branch: null,
        view: 'tree',
      },
    )
  }, [buildHref, categoryHref, defaultCategoryKey, documentCategoryKey, effectiveSelectedFile])

  const handleSkipToMain = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const main = document.getElementById('app-main-content')
    if (!main) return
    main.focus()
    main.scrollIntoView({ block: 'start' })
  }, [])

  return (
    <div className={`app-layout app-layout--${pageMode}`}>
      <a className="skip-link" href="#app-main-content" onClick={handleSkipToMain}>
        跳到主内容
      </a>
      <Header
        onSearchChange={handleSearch}
        onSearchSubmit={handleSearchSubmit}
        onSuggestionSelect={handleSuggestionSelect}
        pageMode={pageMode}
        searchQuery={searchQuery}
        searching={searching}
      />
      <div className="app-body">
        <main className={`app-main app-main--${pageMode}`} id="app-main-content" tabIndex={-1}>
          <ErrorBoundary>
            {invalidCategoryRoute ? (
              <div className="workspace-empty-state">
                <div className="workspace-empty-state__eyebrow">Category Route</div>
                <h2>当前分类路由不存在</h2>
                <p>请返回首页重新选择知识分类，或检查链接中的分类标识是否正确。</p>
                <button className="workspace-empty-state__action" onClick={handleNavigateHome}>
                  返回首页
                </button>
              </div>
            ) : pageMode === 'document' ? (
              effectiveSelectedFile ? (
                <DocumentDetailPage
                  categoryDescription={documentCategoryMeta?.description || '当前文档所属分类的上下文与延伸阅读。'}
                  categoryTitle={documentCategoryMeta?.title || '相关知识点'}
                  documentSiblings={documentSiblings}
                  fileContent={fileContent}
                  fileLoading={loading}
                  fileName={fileName}
                  graphHref={documentGraphHref}
                  onTagSelect={handleTagSelect}
                  onWikiLink={handleWikiLink}
                  relatedItems={relatedItems}
                  selectedCatalogItem={selectedCatalogItem}
                  selectedFile={effectiveSelectedFile}
                  source={currentSource || { id: effectiveSelectedFile.sourceId, name: effectiveSelectedFile.sourceId, path: '', enabled: true, type: 'local' }}
                />
              ) : (
                <NotFoundPage
                  description="当前文档链接无法解析到有效内容。你可以返回首页重新打开文档，或通过顶部搜索重新定位知识点。"
                  onPrimaryAction={handleNavigateHome}
                  onSecondaryAction={handleNavigateCategory}
                  title="文档不存在或链接已失效"
                />
              )
            ) : pageMode === 'category' ? (
              workspaceSource ? (
                <CategoryGraphPage
                  activeTag={activeTag}
                  catalog={catalog}
                  categorySection={categorySection}
                  fileContent={fileContent}
                  fileLoading={loading}
                  fileName={fileName}
                  getCategoryHref={getCategoryHref}
                  getDocumentHref={getDocumentHref}
                  homeHref={homeHref}
                  onBranchChange={(branch) => syncParams({ view: searchParams.get('view') || 'tree', branch, node: searchParams.get('node') }, false)}
                  onNodeChange={(node) => syncParams({ view: searchParams.get('view') || 'tree', branch: searchParams.get('branch'), node }, false)}
                  onOpenItem={handleOpenDocument}
                  onPreviewItem={handlePreviewCategoryItem}
                  onTagSelect={handleTagSelect}
                  onViewChange={(view) => syncParams({ view, branch: searchParams.get('branch'), node: searchParams.get('node') }, false)}
                  onWikiLink={handleWikiLink}
                  searchQuery={searchQuery}
                  selectedBranch={searchParams.get('branch')}
                  selectedFile={selectedFile}
                  selectedNodeId={searchParams.get('node')}
                  source={workspaceSource}
                  view={((searchParams.get('view') === 'path' || searchParams.get('view') === 'islands')
                    ? searchParams.get('view')
                    : 'tree') as 'tree' | 'path' | 'islands'}
                />
              ) : (
                <div className="loading"><div className="spinner" /></div>
              )
            ) : workspaceSource ? (
              <KnowledgeWorkbench
                activeTag={activeTag}
                activeSourceId={searchParams.get('source')}
                catalog={catalog}
                catalogError={catalogError}
                catalogLoading={catalogLoading}
                fileContent={fileContent}
                fileLoading={loading}
                fileName={fileName}
                onClearSelectedFile={handleClearSelectedFile}
                onNavigateExplorer={handleNavigateCategory}
                onNavigateHome={handleNavigateHome}
                onOpenItem={handleOpenPreview}
                onSearch={handleSearch}
                onSourceSelect={handleSelectSource}
                onTagSelect={handleTagSelect}
                onWikiLink={handleWikiLink}
                pageMode="home"
                guidePageId={guidePageId}
                searchQuery={searchQuery}
                searchResults={searchResults}
                searching={searching}
                selectedFile={selectedFile}
                source={workspaceSource}
                sources={sources}
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

function RouteFallback() {
  const navigate = useNavigate()

  return (
    <div className="standalone-route">
      <NotFoundPage
        description="当前页面路径没有匹配到任何文档页面。请返回首页重新定位内容。"
        onPrimaryAction={() => navigate('/')}
        onSecondaryAction={() => navigate('/')}
        title="页面不存在"
      />
    </div>
  )
}

function LegacySearchRedirect() {
  const [searchParams] = useSearchParams()
  const next = new URLSearchParams()
  const query = searchParams.get('keyword') || searchParams.get('q') || ''
  const source = searchParams.get('source') || ''

  if (query) next.set('q', query)
  if (source) next.set('source', source)

  return <Navigate replace to={{ pathname: GUIDE_SEARCH_ROUTE, search: next.toString() ? `?${next}` : '' }} />
}

function RootGuideRedirect() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const legacyHashRoute = LEGACY_GUIDE_HASH_ROUTES[location.hash]
  const targetPath = legacyHashRoute || (searchParams.has('q') || searchParams.has('keyword')
    ? GUIDE_SEARCH_ROUTE
    : DEFAULT_GUIDE_ROUTE)

  return (
    <Navigate
      replace
      to={{
        pathname: targetPath,
        search: location.search,
        hash: legacyHashRoute ? '' : location.hash,
      }}
    />
  )
}

function LegacyDocumentRedirect() {
  const navigate = useNavigate()
  const params = useParams()
  const routeDocument = useMemo(() => decodeDocumentId(params.docId || ''), [params.docId])

  if (!routeDocument) {
    return (
      <div className="standalone-route">
        <NotFoundPage
          description="当前旧版文档链接无法解析。请返回首页重新打开文档，或通过顶部搜索重新定位知识点。"
          onPrimaryAction={() => navigate('/')}
          onSecondaryAction={() => navigate('/')}
          title="文档不存在或链接已失效"
        />
      </div>
    )
  }

  return <Navigate replace to={buildDocumentRoute(routeDocument)} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootGuideRedirect />} />
      <Route path="/zh/guide/:guideId" element={<HubPage pageMode="home" />} />
      <Route path="/nodes/:categoryId" element={<HubPage pageMode="category" />} />
      <Route path="/nodes/:categoryId/sub/:subId" element={<HubPage pageMode="category" />} />
      <Route path="/docs/:sourceId/*" element={<HubPage pageMode="document" />} />
      <Route path="/doc/:docId" element={<LegacyDocumentRedirect />} />
      <Route path="/search" element={<LegacySearchRedirect />} />
      <Route path="*" element={<RouteFallback />} />
    </Routes>
  )
}

export default App
