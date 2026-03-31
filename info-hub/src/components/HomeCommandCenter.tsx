import { useEffect, useRef, useState } from 'react'
import { DocSource, KnowledgeCatalog, SelectedFile } from '../types'
import { FileIcon, SearchIcon, TagIcon } from './Icons'
import { HeroKnowledgeScene } from './HeroKnowledgeScene'

export interface QuickKnowledgeItemLike {
  sourceId: string
  path: string
  name: string
  title?: string
  description?: string
}

interface HomeCommandCenterProps {
  source: DocSource
  catalog: KnowledgeCatalog | null
  searchQuery: string
  searching: boolean
  activeTag: string | null
  selectedFile: SelectedFile | null
  promptDeck: string[]
  spotlightCards: Array<{
    key: string
    title: string
    description: string
    count: number
  }>
  quickOpenItems: QuickKnowledgeItemLike[]
  onSearch: (query: string) => void
  onOpenItem: (sourceId: string, path: string) => void
  onOpenExplorer: () => void
  onTagSelect: (tag: string | null) => void
  onTagClear: () => void
  graphFocusPath?: string | null
}

export function HomeCommandCenter({
  source,
  catalog,
  searchQuery,
  searching,
  activeTag,
  selectedFile,
  promptDeck,
  spotlightCards,
  onSearch,
  onOpenItem,
  onOpenExplorer,
  onTagSelect,
  onTagClear,
  graphFocusPath,
}: HomeCommandCenterProps) {
  const [inputValue, setInputValue] = useState(searchQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const graphMode = selectedFile ? 'focus' : searchQuery.trim() ? 'global' : 'tree'

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  const commitSearch = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    onSearch(value)
  }

  const handleInput = (value: string) => {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(value)
    }, 260)
  }

  return (
    <section className="command-center">
      {/* ── Left panel: copy + search + metrics ── */}
      <div className="command-center__left">
        <div className="command-center__copy">
          <div className="command-center__eyebrow">{source.name}</div>
          <h1>知识指挥中心</h1>
          <p>先搜答案，再沿着 3D 知识树回到上下文和原文证据。</p>

          <div className="command-center__actions">
            <button
              className="command-center__action command-center__action--primary"
              onClick={onOpenExplorer}
              type="button"
            >
              进入图谱探索
            </button>
            {selectedFile && (
              <button
                className="command-center__action"
                onClick={() => onOpenItem(selectedFile.sourceId, selectedFile.path)}
                type="button"
              >
                查看当前证据
              </button>
            )}
          </div>

          {(searchQuery.trim() || activeTag || selectedFile) && (
            <div className="command-center__states">
              {searchQuery.trim() && (
                <span className="command-center__state-pill">
                  <SearchIcon />
                  <span>当前检索 "{searchQuery}"</span>
                </span>
              )}
              {activeTag && (
                <button className="command-center__state-pill" onClick={onTagClear} type="button">
                  <TagIcon />
                  <span>标签过滤 #{activeTag}</span>
                </button>
              )}
              {selectedFile && (
                <span className="command-center__state-pill">
                  <FileIcon />
                  <span>已锁定证据 {selectedFile.path.split('/').pop()}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="command-search">
          <label className="command-search__label" htmlFor="command-search">
            搜索知识库
          </label>
          <div className="command-search__field">
            <SearchIcon />
            <input
              id="command-search"
              aria-label="搜索知识库指令栏"
              placeholder="搜索问题、组件、规范、ADR、排障记录"
              type="text"
              value={inputValue}
              onChange={(event) => handleInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  commitSearch(inputValue)
                }
                if (event.key === 'Escape') {
                  setInputValue('')
                  commitSearch('')
                }
              }}
            />
            {searching && <span className="command-search__spinner" />}
          </div>

          <div className="command-search__prompts">
            {promptDeck.map((prompt) => (
              <button key={prompt} onClick={() => commitSearch(prompt)} type="button">
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="command-center__metrics">
          <div className="command-center__metric">
            <span>知识文档</span>
            <strong>{catalog?.totalDocs || 0}</strong>
          </div>
          <div className="command-center__metric">
            <span>经验分层</span>
            <strong>{catalog?.sections.length || 0}</strong>
          </div>
          <div className="command-center__metric">
            <span>高频标签</span>
            <strong>{catalog?.topTags.length || 0}</strong>
          </div>
        </div>
      </div>

      {/* ── Right panel: 3D graph + intel cards ── */}
      <div className="command-center__right">
        <HeroKnowledgeScene
          focusPath={graphFocusPath}
          mode={graphMode}
          onNavigate={(path) => onOpenItem(source.id, path)}
          onTagSelect={(tag) => onTagSelect(tag)}
          sourceId={source.id}
        />
        <div className="command-center__scrim" />
        <div className="command-center__intel">
          {spotlightCards.map((card) => (
            <div key={card.key} className="command-center__intel-card">
              <span>{card.title}</span>
              <strong>{card.count}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
