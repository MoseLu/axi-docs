import { useEffect, useRef, useState } from 'react'
import { pageCopy } from '../config/pageCopy'
import { formatKnowledgeItemTitle, formatKnowledgeTagLabel } from '../lib/knowledgeFormatter'
import { DocSource, KnowledgeCatalog, SelectedFile } from '../types'
import { CompactEmptyState, MetricPill, PageShell, RailPanel, SectionHeader } from './CockpitPrimitives'
import { FileIcon, SearchIcon, TagIcon } from './Icons'
import { HeroKnowledgeScene } from './HeroKnowledgeScene'

export interface QuickKnowledgeItemLike {
  sourceId: string
  path: string
  name: string
  title?: string
  graphTitle?: string
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
  quickOpenItems,
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
  const hasSpotlightCards = spotlightCards.length > 0

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
    <PageShell className="command-center command-center--cockpit">
      <aside className="command-center__left">
        <RailPanel className="command-center__copy" tone="primary">
          <SectionHeader
            actions={(
              <div className="command-center__actions">
                <button
                  className="command-center__action command-center__action--primary"
                  onClick={onOpenExplorer}
                  type="button"
                >
                  {pageCopy.home.actionPrimary}
                </button>
                {selectedFile && (
                  <button
                    className="command-center__action"
                    onClick={() => onOpenItem(selectedFile.sourceId, selectedFile.path)}
                    type="button"
                  >
                    {pageCopy.home.actionSecondary}
                  </button>
                )}
              </div>
            )}
            description={pageCopy.home.description}
            eyebrow={source.name || pageCopy.home.eyebrow}
            title={<h1>{pageCopy.home.title}</h1>}
          />

          {(searchQuery.trim() || activeTag || selectedFile) && (
            <div className="command-center__states">
              {searchQuery.trim() && (
                <span className="command-center__state-pill">
                  <SearchIcon />
                  <span>当前检索 “{searchQuery}”</span>
                </span>
              )}
              {activeTag && (
                <button className="command-center__state-pill" onClick={onTagClear} type="button">
                  <TagIcon />
                  <span>标签过滤 #{formatKnowledgeTagLabel(activeTag)}</span>
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
        </RailPanel>

        <RailPanel className="command-search" tone="secondary">
          <SectionHeader
            compact
            description="用一句问题、一个模块名或一个标签，直接缩小答案范围。"
            eyebrow={pageCopy.home.commandLabel}
            title={<strong>把问题送进知识库</strong>}
          />
          <div className="command-search__field">
            <SearchIcon />
            <input
              id="command-search"
              aria-label="搜索知识库指令栏"
              placeholder={pageCopy.home.commandPlaceholder}
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
        </RailPanel>

        <div className="command-center__metrics">
          <MetricPill accent="blue" label={pageCopy.home.metrics[0]} value={catalog?.totalDocs || 0} />
          <MetricPill accent="teal" label={pageCopy.home.metrics[1]} value={catalog?.sections.length || 0} />
          <MetricPill accent="amber" label={pageCopy.home.metrics[2]} value={catalog?.topTags.length || 0} />
        </div>

        <RailPanel className="command-center__quickstrip" tone="ghost">
          <SectionHeader
            compact
            eyebrow="快速入口"
            meta={<span>{quickOpenItems.length} 条</span>}
            title={<strong>最近可直接打开的知识节点</strong>}
          />
          {quickOpenItems.length > 0 ? (
            <div className="command-center__quicklist">
              {quickOpenItems.slice(0, 4).map((item) => (
                <button
                  key={`${item.sourceId}:${item.path}`}
                  className="command-center__quickitem"
                  onClick={() => onOpenItem(item.sourceId, item.path)}
                  type="button"
                >
                  <div>
                    <strong>{formatKnowledgeItemTitle(item)}</strong>
                    <span>{item.path}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <CompactEmptyState
              title="还没有快速入口"
              description="加载到目录后，这里会显示最近最值得直接进入的文档。"
            />
          )}
        </RailPanel>
      </aside>

      <div className={`command-center__right${hasSpotlightCards ? '' : ' command-center__right--full'}`}>
        <div className="command-center__graph-shell">
          <SectionHeader
            className="command-center__graph-header"
            compact
            description={pageCopy.home.stageHint}
            eyebrow={pageCopy.home.stageLabel}
            meta={<span>{searchQuery.trim() ? '搜索联动中' : '关系总览'}</span>}
            title={<strong>知识关系主舞台</strong>}
          />
          <div className="command-center__graph">
            <HeroKnowledgeScene
              focusPath={graphFocusPath}
              mode={graphMode}
              onNavigate={(path) => onOpenItem(source.id, path)}
              onTagSelect={(tag) => onTagSelect(tag)}
              sourceId={source.id}
            />
            <div className="command-center__scrim" />
          </div>
        </div>

        {hasSpotlightCards && (
          <aside className="command-center__aside" aria-label="知识情报摘要">
            <div className="command-center__intel">
              {spotlightCards.map((card) => (
                <MetricPill
                  key={card.key}
                  accent="blue"
                  label={card.title}
                  subtle={card.description}
                  value={card.count}
                />
              ))}
            </div>
          </aside>
        )}
      </div>
    </PageShell>
  )
}
