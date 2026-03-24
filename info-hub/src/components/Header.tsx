import { useState, useRef, useEffect } from 'react'
import { RefreshIcon, BookIcon, SearchIcon } from './Icons'

interface HeaderProps {
  onRefresh: () => void
  searchQuery: string
  onSearch: (query: string) => void
  searching: boolean
}

export function Header({ onRefresh, searchQuery, onSearch, searching }: HeaderProps) {
  const [inputValue, setInputValue] = useState(searchQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  const handleInput = (value: string) => {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(value)
    }, 300)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      onSearch(inputValue)
    }
    if (e.key === 'Escape') {
      setInputValue('')
      onSearch('')
    }
  }

  return (
    <header className="app-header">
      <div className="app-logo">
        <BookIcon />
        <span>Info Hub</span>
      </div>

      <div className="header-search">
        <span className="search-icon-wrap" data-testid="search-icon-wrap">
          {searching ? (
            <span className="search-spinner" />
          ) : (
            <SearchIcon />
          )}
        </span>
        <input
          className="header-search-input"
          type="text"
          placeholder="搜索文档... (支持全文搜索)"
          value={inputValue}
          onChange={e => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {inputValue && (
          <button
            className="search-clear-btn"
            onClick={() => { setInputValue(''); onSearch('') }}
            title="清除搜索"
          >
            ×
          </button>
        )}
      </div>

      <button className="refresh-btn" onClick={onRefresh} title="刷新">
        <RefreshIcon />
        <span>刷新</span>
      </button>
    </header>
  )
}
