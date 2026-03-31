import { useEffect, useRef, useState } from 'react'
import { BookIcon, RefreshIcon, SearchIcon } from './Icons'

interface HeaderProps {
  activeSourceName: string
  onNavigateExplorer: () => void
  onNavigateHome: () => void
  onRefresh: () => void
  onSearch: (query: string) => void
  pageMode: 'home' | 'explorer'
  searchQuery: string
  searching: boolean
}

export function Header({
  activeSourceName,
  onNavigateExplorer,
  onNavigateHome,
  onRefresh,
  onSearch,
  pageMode,
  searchQuery,
  searching,
}: HeaderProps) {
  const [inputValue, setInputValue] = useState(searchQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
        <span>Info Hub</span>
      </div>

      <div className="header-nav">
        <button
          className={`header-nav__button${pageMode === 'home' ? ' active' : ''}`}
          onClick={onNavigateHome}
          aria-label="打开知识指挥中心"
        >
          指挥中心
        </button>
        <button
          className={`header-nav__button${pageMode === 'explorer' ? ' active' : ''}`}
          onClick={onNavigateExplorer}
          aria-label="打开图谱探索"
        >
          图谱探索
        </button>
        <span className="header-source-pill" aria-label={`当前数据源 ${activeSourceName}`}>
          {activeSourceName}
        </span>
      </div>

      <div className="header-actions">
        {pageMode === 'explorer' ? (
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
              placeholder="搜索路径、标签或文档"
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
            onClick={focusCommandSearch}
            aria-label="聚焦首页搜索指令栏"
          >
            <SearchIcon />
            <span>{searchQuery ? `继续搜索 “${searchQuery}”` : '搜索知识库'}</span>
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
