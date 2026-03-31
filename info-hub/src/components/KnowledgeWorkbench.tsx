import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  getKnowledgeCategoryLabel,
  getKnowledgeCategoryMeta,
  getKnowledgeCategoryQueryHints,
  KNOWLEDGE_CATEGORY_ORDER,
  normalizeKnowledgeCategoryKey,
} from '../config/knowledgeRules'
import {
  DocSource,
  KnowledgeCatalog,
  KnowledgeCatalogItem,
  SearchResult,
  SelectedFile,
} from '../types'
import { HomeCommandCenter, QuickKnowledgeItemLike } from './HomeCommandCenter'
import { KnowledgeExplorer } from './KnowledgeExplorer'
import { ResultsEvidenceSection } from './ResultsEvidenceSection'

type ExplorerView = 'tree' | 'path' | 'islands'

interface KnowledgeWorkbenchProps {
  source: DocSource
  catalog: KnowledgeCatalog | null
  catalogLoading: boolean
  catalogError: string | null
  searchQuery: string
  searchResults: SearchResult[] | null
  searching: boolean
  selectedFile: SelectedFile | null
  fileContent: string | null
  fileName: string
  fileLoading: boolean
  activeTag: string | null
  pageMode: 'home' | 'explorer'
  onOpenItem: (sourceId: string, path: string) => void
  onTagSelect: (tag: string | null) => void
  onSearch: (query: string) => void
  onWikiLink: (noteName: string) => void
  onNavigateHome: () => void
  onNavigateExplorer: () => void
  onClearSelectedFile: () => void
}

function summarizeCategories(results: SearchResult[]) {
  const counts = new Map<string, number>()
  for (const result of results) {
    const category = normalizeKnowledgeCategoryKey(result.categories?.[0] || 'resources') || 'resources'
    counts.set(category, (counts.get(category) || 0) + 1)
  }
  return KNOWLEDGE_CATEGORY_ORDER
    .map((key) => ({ key, count: counts.get(key) || 0 }))
    .filter((entry) => entry.count > 0)
}

function buildPromptDeck(catalog: KnowledgeCatalog | null, activeCategory: string | null) {
  if (activeCategory) {
    return getKnowledgeCategoryQueryHints(activeCategory).slice(0, 5)
  }

  const prompts = new Set<string>()
  for (const key of KNOWLEDGE_CATEGORY_ORDER.slice(0, 5)) {
    for (const hint of getKnowledgeCategoryQueryHints(key)) {
      prompts.add(hint)
      if (prompts.size >= 6) return [...prompts]
    }
  }

  for (const tag of catalog?.topTags.slice(0, 4) || []) {
    prompts.add(tag.name)
    if (prompts.size >= 6) break
  }

  return [...prompts]
}

function normalizeExplorerView(value: string | null): ExplorerView {
  if (value === 'path' || value === 'islands') return value
  return 'tree'
}

export function KnowledgeWorkbench({
  source,
  catalog,
  catalogLoading,
  catalogError,
  searchQuery,
  searchResults,
  searching,
  selectedFile,
  fileContent,
  fileName,
  fileLoading,
  activeTag,
  pageMode,
  onOpenItem,
  onTagSelect,
  onSearch,
  onWikiLink,
  onNavigateHome,
  onNavigateExplorer,
  onClearSelectedFile,
}: KnowledgeWorkbenchProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const promptDeck = useMemo(
    () => buildPromptDeck(catalog, activeCategory),
    [catalog, activeCategory],
  )

  const resultCategorySummary = useMemo(
    () => summarizeCategories(searchResults || []),
    [searchResults],
  )

  const filteredResults = useMemo(() => {
    const items = searchResults || []
    if (!activeCategory) return items
    return items.filter((result) => (result.categories || []).includes(activeCategory))
  }, [activeCategory, searchResults])

  const groupedResults = useMemo(() => {
    const groups = new Map<string, SearchResult[]>()
    for (const result of filteredResults) {
      const category = normalizeKnowledgeCategoryKey(result.categories?.[0] || activeCategory || 'resources') || 'resources'
      if (!groups.has(category)) groups.set(category, [])
      groups.get(category)?.push(result)
    }
    return KNOWLEDGE_CATEGORY_ORDER
      .filter((key) => groups.has(key))
      .map((key) => ({
        key,
        label: getKnowledgeCategoryLabel(key),
        meta: getKnowledgeCategoryMeta(key),
        items: groups.get(key) || [],
      }))
  }, [activeCategory, filteredResults])

  const filteredSections = useMemo(() => {
    const sections = catalog?.sections || []
    if (!activeCategory) return sections
    return sections.filter((section) => section.key === activeCategory)
  }, [activeCategory, catalog?.sections])

  const quickOpenItems = useMemo<QuickKnowledgeItemLike[]>(() => {
    if (filteredResults.length > 0) return filteredResults.slice(0, 5)
    if (filteredSections.length > 0) return filteredSections[0].items.slice(0, 5)
    return catalog?.recentDocs.slice(0, 5) || []
  }, [catalog?.recentDocs, filteredResults, filteredSections])

  const spotlightCards = useMemo(() => {
    if (!catalog) return []
    return catalog.sections
      .slice()
      .sort((left, right) => right.count - left.count)
      .slice(0, 3)
      .map((section) => ({
        key: section.key,
        title: section.title,
        description: section.description,
        count: section.count,
      }))
  }, [catalog])

  const graphFocusPath = selectedFile?.path || filteredResults[0]?.path || null
  const explorerView = normalizeExplorerView(searchParams.get('view'))
  const explorerBranch = searchParams.get('branch')
  const explorerNode = searchParams.get('node')

  const updateExplorerParams = (updates: Record<'view' | 'branch' | 'node', string | null | undefined>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key)
      else next.set(key, value)
    })
    setSearchParams(next, { replace: false })
  }

  if (pageMode === 'explorer') {
    return (
      <KnowledgeExplorer
        activeTag={activeTag}
        fileContent={fileContent}
        fileLoading={fileLoading}
        fileName={fileName}
        graphFocusPath={graphFocusPath}
        onBranchChange={(branch) => updateExplorerParams({ view: explorerView, branch, node: explorerNode })}
        onClearSelectedFile={onClearSelectedFile}
        onNavigateHome={onNavigateHome}
        onNodeChange={(node) => updateExplorerParams({ view: explorerView, branch: explorerBranch, node })}
        onOpenItem={onOpenItem}
        onTagSelect={onTagSelect}
        onViewChange={(view) => updateExplorerParams({ view, branch: explorerBranch, node: explorerNode })}
        onWikiLink={onWikiLink}
        quickOpenItems={quickOpenItems}
        searchQuery={searchQuery}
        selectedBranch={explorerBranch}
        selectedFile={selectedFile}
        selectedNodeId={explorerNode}
        source={source}
        view={explorerView}
      />
    )
  }

  return (
    <div className="knowledge-workbench">
      <HomeCommandCenter
        activeTag={activeTag}
        catalog={catalog}
        graphFocusPath={graphFocusPath}
        onOpenExplorer={onNavigateExplorer}
        onOpenItem={onOpenItem}
        onSearch={onSearch}
        onTagSelect={onTagSelect}
        onTagClear={() => onTagSelect(null)}
        promptDeck={promptDeck}
        quickOpenItems={quickOpenItems}
        searchQuery={searchQuery}
        searching={searching}
        selectedFile={selectedFile}
        source={source}
        spotlightCards={spotlightCards}
      />

      <ResultsEvidenceSection
        activeCategory={activeCategory}
        catalog={catalog}
        catalogError={catalogError}
        catalogLoading={catalogLoading}
        fileContent={fileContent}
        fileLoading={fileLoading}
        fileName={fileName}
        filteredResults={filteredResults}
        filteredSections={filteredSections}
        groupedResults={groupedResults}
        onOpenExplorer={onNavigateExplorer}
        onOpenItem={onOpenItem}
        onSearch={onSearch}
        onTagSelect={onTagSelect}
        onWikiLink={onWikiLink}
        quickOpenItems={quickOpenItems}
        resultCategorySummary={resultCategorySummary}
        searchQuery={searchQuery}
        searching={searching}
        selectedFile={selectedFile}
        setActiveCategory={setActiveCategory}
        source={source}
      />
    </div>
  )
}

export type { QuickKnowledgeItemLike as QuickKnowledgeItem }

export function documentTitle(
  result: Pick<SearchResult, 'title' | 'name'> | Pick<KnowledgeCatalogItem, 'title' | 'name'>,
) {
  return (result.title || result.name).replace(/\.md$/i, '')
}
