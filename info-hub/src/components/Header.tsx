import { useEffect, useRef, useState } from 'react'
import { pageCopy } from '../config/pageCopy'
import { BookIcon, RefreshIcon, SearchIcon } from './Icons'

interface HeaderProps {
  contextLabel?: string
  activeSourceName?: string
  onNavigateCategory?: () => void
  onNavigateExplorer?: () => void
  onNavigateHome: () => void
  onNavigateSearch?: () => void
  onRefresh: () => void
  onSearch: (query: string) => void
  pageMode: 'home' | 'category' | 'search' | 'document' | 'explorer'
  searchQuery: string
  searching: boolean
}

export function Header({
  contextLabel,
  activeSourceName,
  onNavigateCategory,
  onNavigateExplorer,
  onNavigateHome,
  onNavigateSearch,
  onRefresh,
  onSearch,
  pageMode,
  searchQuery,
  searching,
}: HeaderProps) {
  const [inputValue, setInputValue] = useState(searchQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resolvedContextLabel = contextLabel || activeSourceName || pageCopy.header.defaultContext
  const resolvedNavigateCategory = onNavigateCategory || onNavigateExplorer || (() => undefined)
  const resolvedNavigateSearch = onNavigateSearch || (() => undefined)
  const showsSearchInput = pageMode === 'search' || pageMode === 'explorer'

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

  const focusCommandSearch = () => {
    const heroInput = document.getElementById('command-search') as HTMLInputElement | null
    if (heroInput) {
      heroInput.focus()
      heroInput.select()
      return
    }
    const explorerInput = document.getElementById('header-search-input') as HTMLInputElement | null
    explorerInput?.focus()
  }

  return (
    <header className="app-header app-header--command">
      <div className="app-logo">
        <BookIcon />
        <div className="app-logo__copy">
          <span>{pageCopy.header.brandPrimary}</span>
          <small>{pageCopy.header.brandSecondary}</small>
        </div>
      </div>

      <div className="header-nav">
        <button
          className={`header-nav__button${pageMode === 'home' ? ' active' : ''}`}
          onClick={onNavigateHome}
          aria-label="打开知识总览"
        >
          首页
        </button>
        <button
          className={`header-nav__button${pageMode === 'category' || pageMode === 'explorer' ? ' active' : ''}`}
          onClick={resolvedNavigateCategory}
          aria-label="打开分类图谱"
        >
          分类图谱
        </button>
        <button
          className={`header-nav__button${pageMode === 'search' ? ' active' : ''}`}
          onClick={resolvedNavigateSearch}
          aria-label="打开全局搜索"
        >
          搜索
        </button>
        <span className="header-source-pill" aria-label={`当前上下文 ${resolvedContextLabel}`}>
          {resolvedContextLabel}
        </span>
      </div>

      <div className="header-actions">
        {showsSearchInput ? (
          <label className="header-search header-search--explorer" htmlFor="header-search-input">
          <span className="search-icon-wrap" data-testid="search-icon-wrap">
            {searching ? (
              <span className="search-spinner" />
              ) : (
                <SearchIcon />
              )}
            </span>
            <input
              id="header-search-input"
              aria-label="搜索知识库"
              className="header-search-input"
              type="text"
              placeholder={pageCopy.header.searchPlaceholder}
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
            {inputValue && (
              <button
                aria-label="清除搜索"
                className="search-clear-btn"
                onClick={() => {
                  setInputValue('')
                  commitSearch('')
                }}
                type="button"
              >
                ×
              </button>
            )}
          </label>
        ) : (
          <button
            className="header-command-launcher"
            onClick={pageMode === 'home' ? focusCommandSearch : resolvedNavigateSearch}
            aria-label={pageMode === 'home' ? '聚焦首页搜索指令栏' : '打开全局搜索页'}
          >
            <SearchIcon />
            <span>{searchQuery ? `继续搜索 “${searchQuery}”` : pageCopy.header.commandSearchIdle}</span>
          </button>
        )}

        <button
          aria-label="刷新内容"
          className="refresh-btn"
          onClick={onRefresh}
          title="刷新"
          type="button"
        >
          <RefreshIcon />
          <span>刷新</span>
        </button>
      </div>
    </header>
  )
}
