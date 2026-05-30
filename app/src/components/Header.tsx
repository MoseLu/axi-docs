import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getKnowledgeSearchSuggestions } from '../lib/knowledgeClient'
import type { SearchSuggestion } from '../types'
import { pageCopy } from '../config/pageCopy'
import { BookIcon, FileIcon, SearchIcon, TagIcon } from './Icons'

interface HeaderProps {
  homeHref: string
  onSearchChange: (query: string) => void
  onSearchSubmit: (query: string) => void
  onSuggestionSelect: (suggestion: SearchSuggestion) => void
  pageMode: 'home' | 'category' | 'search' | 'document' | 'explorer'
  searchQuery: string
  searching: boolean
}

function SuggestionIcon({ kind }: Pick<SearchSuggestion, 'kind'>) {
  if (kind === 'tag') return <TagIcon />
  return <FileIcon />
}

export function Header({
  homeHref,
  onSearchChange,
  onSearchSubmit,
  onSuggestionSelect,
  pageMode,
  searchQuery,
  searching,
}: HeaderProps) {
  const [inputValue, setInputValue] = useState(searchQuery)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestionDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestionRequestRef = useRef(0)

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (pageMode !== 'search') return undefined
    if (inputValue === searchQuery) return undefined

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      onSearchChange(inputValue)
    }, 220)

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [inputValue, onSearchChange, pageMode, searchQuery])

  useEffect(() => {
    if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current)

    const trimmed = inputValue.trim()
    if (!trimmed) {
      setSuggestions([])
      setSuggestionsOpen(false)
      setActiveIndex(-1)
      return undefined
    }

    const requestId = ++suggestionRequestRef.current
    suggestionDebounceRef.current = setTimeout(async () => {
      const next = await getKnowledgeSearchSuggestions(trimmed)
      if (requestId !== suggestionRequestRef.current) return

      setSuggestions(next)
      setActiveIndex(next.length > 0 ? 0 : -1)
      setSuggestionsOpen(next.length > 0)
    }, 120)

    return () => {
      if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current)
    }
  }, [inputValue])

  const submitSearch = (value: string) => {
    const nextValue = value.trim()
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    setSuggestionsOpen(false)
    setActiveIndex(-1)
    onSearchSubmit(nextValue)
  }

  const clearSearch = () => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current)
    setInputValue('')
    setSuggestions([])
    setSuggestionsOpen(false)
    setActiveIndex(-1)
    if (pageMode === 'search') {
      onSearchChange('')
    }
  }

  const pickSuggestion = (suggestion: SearchSuggestion) => {
    setInputValue(suggestion.query)
    setSuggestionsOpen(false)
    setActiveIndex(-1)
    onSuggestionSelect(suggestion)
  }

  return (
    <header className="app-header app-header--command">
      <Link aria-label="返回首页" className="app-logo" to={homeHref}>
        <BookIcon />
        <div className="app-logo__copy">
          <span>{pageCopy.header.brandPrimary}</span>
          <small>{pageCopy.header.brandSecondary}</small>
        </div>
      </Link>

      <div className="header-actions">
        <div className="header-search header-search--global">
          <label className="header-search__field" htmlFor="header-search-input">
            <span className="search-icon-wrap" data-testid="search-icon-wrap">
              {searching && pageMode === 'search' ? (
                <span className="search-spinner" />
              ) : (
                <SearchIcon />
              )}
            </span>
            <input
              ref={inputRef}
              id="header-search-input"
              aria-autocomplete="list"
              aria-expanded={suggestionsOpen}
              aria-label="全局搜索"
              aria-controls="header-search-suggestions"
              className="header-search-input"
              type="text"
              placeholder={pageCopy.header.searchPlaceholder}
              value={inputValue}
              onBlur={() => {
                window.setTimeout(() => {
                  setSuggestionsOpen(false)
                }, 120)
              }}
              onChange={(event) => setInputValue(event.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setSuggestionsOpen(true)
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' && suggestions.length > 0) {
                  event.preventDefault()
                  setSuggestionsOpen(true)
                  setActiveIndex((current) => {
                    const next = current < 0 ? 0 : current + 1
                    return next >= suggestions.length ? 0 : next
                  })
                }

                if (event.key === 'ArrowUp' && suggestions.length > 0) {
                  event.preventDefault()
                  setSuggestionsOpen(true)
                  setActiveIndex((current) => {
                    if (current <= 0) return suggestions.length - 1
                    return current - 1
                  })
                }

                if (event.key === 'Enter') {
                  event.preventDefault()
                  if (suggestionsOpen && activeIndex >= 0 && suggestions[activeIndex]) {
                    pickSuggestion(suggestions[activeIndex])
                    return
                  }
                  submitSearch(inputValue)
                }

                if (event.key === 'Escape') {
                  event.preventDefault()
                  if (suggestionsOpen) {
                    setSuggestionsOpen(false)
                    return
                  }
                  clearSearch()
                }
              }}
            />
            {inputValue && (
              <button
                aria-label="清除搜索"
                className="search-clear-btn"
                onClick={clearSearch}
                type="button"
              >
                ×
              </button>
            )}
          </label>

          {suggestionsOpen && suggestions.length > 0 && (
            <div className="header-search__panel" id="header-search-suggestions" role="listbox">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.kind}:${suggestion.path || suggestion.label}`}
                  aria-selected={index === activeIndex}
                  className={`header-search__suggestion${index === activeIndex ? ' active' : ''}`}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    pickSuggestion(suggestion)
                  }}
                  role="option"
                  type="button"
                >
                  <span className="header-search__suggestion-icon">
                    <SuggestionIcon kind={suggestion.kind} />
                  </span>
                  <span className="header-search__suggestion-copy">
                    <strong>{suggestion.label}</strong>
                    {suggestion.meta && <small>{suggestion.meta}</small>}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
