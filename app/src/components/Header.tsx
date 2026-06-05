import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { getKnowledgeSearchSuggestions } from '../lib/knowledgeClient'
import type { SearchSuggestion } from '../types'
import { pageCopy } from '../config/pageCopy'
import { BookIcon, FileIcon, GitHubIcon, LanguageIcon, SearchIcon, TagIcon, ThemeIcon } from './Icons'

interface HeaderProps {
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
  onSearchChange,
  onSearchSubmit,
  onSuggestionSelect,
  pageMode,
  searchQuery,
  searching,
}: HeaderProps) {
  const location = useLocation()
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => (
    window.localStorage.getItem('axi-docs-theme') === 'light' ? 'light' : 'dark'
  ))
  const [inputValue, setInputValue] = useState(searchQuery)
  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestionDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const themeSwitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestionRequestRef = useRef(0)

  const trimmedInput = inputValue.trim()
  const activeSource = new URLSearchParams(location.search).get('source')
  const currentLocale = location.pathname.startsWith('/en/') ? 'en' : 'zh'
  const guideHref = `/${currentLocale}/guide/getting-started`
  const nextLocale = currentLocale === 'zh' ? 'en' : 'zh'
  const localeHref = /^\/(zh|en)\//u.test(location.pathname)
    ? `${location.pathname.replace(/^\/(zh|en)\//u, `/${nextLocale}/`)}${location.search}`
    : `/${nextLocale}/guide/getting-started`
  const localeLabel = currentLocale === 'zh' ? '简体中文' : 'English'
  const nextLocaleLabel = nextLocale === 'zh' ? '简体中文' : 'English'
  const documentSuggestions = suggestions.filter((suggestion) => suggestion.kind === 'document')
  const tagSuggestions = suggestions.filter((suggestion) => suggestion.kind === 'tag')

  useEffect(() => {
    document.documentElement.dataset.axiDocsTheme = themeMode
    window.localStorage.setItem('axi-docs-theme', themeMode)
  }, [themeMode])

  useEffect(() => () => {
    if (themeSwitchTimerRef.current) clearTimeout(themeSwitchTimerRef.current)
    document.documentElement.classList.remove('axi-theme-switching')
  }, [])

  useEffect(() => {
    if (!searchOpen) setInputValue(searchQuery)
  }, [searchOpen, searchQuery])

  useEffect(() => {
    if (pageMode === 'category') {
      setNavOpen(false)
      document.documentElement.classList.remove('axi-doc-nav-open')
      return undefined
    }

    document.documentElement.classList.toggle('axi-doc-nav-open', navOpen)
    return () => {
      document.documentElement.classList.remove('axi-doc-nav-open')
    }
  }, [navOpen, pageMode])

  useEffect(() => {
    document.documentElement.classList.toggle('axi-search-open', searchOpen)
    return () => {
      document.documentElement.classList.remove('axi-search-open')
    }
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) return undefined

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(focusTimer)
  }, [searchOpen])

  useEffect(() => {
    const handleGlobalSearchShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isEditable = target?.tagName === 'INPUT'
        || target?.tagName === 'TEXTAREA'
        || target?.isContentEditable

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
        return
      }

      if (!isEditable && event.key === '/') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleGlobalSearchShortcut)
    return () => window.removeEventListener('keydown', handleGlobalSearchShortcut)
  }, [])

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

    if (!searchOpen || !trimmedInput) {
      setSuggestions([])
      setActiveIndex(-1)
      return undefined
    }

    const requestId = ++suggestionRequestRef.current
    suggestionDebounceRef.current = setTimeout(async () => {
      const next = await getKnowledgeSearchSuggestions(trimmedInput)
      if (requestId !== suggestionRequestRef.current) return

      setSuggestions(next)
      setActiveIndex(next.length > 0 ? 0 : -1)
    }, 120)

    return () => {
      if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current)
    }
  }, [searchOpen, trimmedInput])

  const closeSearch = () => {
    setSearchOpen(false)
    setSuggestions([])
    setActiveIndex(-1)
  }

  const openSearch = () => {
    setInputValue(searchQuery)
    setSearchOpen(true)
  }

  const toggleThemeMode = () => {
    document.documentElement.classList.add('axi-theme-switching')
    if (themeSwitchTimerRef.current) clearTimeout(themeSwitchTimerRef.current)
    themeSwitchTimerRef.current = setTimeout(() => {
      document.documentElement.classList.remove('axi-theme-switching')
      themeSwitchTimerRef.current = null
    }, 180)
    setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const submitSearch = (value: string) => {
    const nextValue = value.trim()
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    closeSearch()
    onSearchSubmit(nextValue)
  }

  const clearSearch = () => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current)
    setInputValue('')
    setSuggestions([])
    setActiveIndex(-1)
    onSearchChange('')
  }

  const pickSuggestion = (suggestion: SearchSuggestion) => {
    setInputValue(suggestion.query)
    closeSearch()
    onSuggestionSelect(suggestion)
  }

  const renderSuggestion = (suggestion: SearchSuggestion) => {
    const suggestionIndex = suggestions.indexOf(suggestion)
    return (
      <button
        key={`${suggestion.kind}:${suggestion.path || suggestion.label}`}
        aria-selected={suggestionIndex === activeIndex}
        className={`header-search__suggestion${suggestionIndex === activeIndex ? ' active' : ''}`}
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
    )
  }

  const topNavItems = [
    { label: '指南', to: guideHref, active: pageMode === 'document' || (pageMode === 'home' && !activeSource) },
    { label: '技能库', to: '/?source=axi-skills', active: pageMode === 'home' && activeSource === 'axi-skills' },
    { label: '工作区', to: '/?source=workspace', active: pageMode === 'home' && activeSource === 'workspace' },
  ]

  const searchModal = searchOpen ? createPortal(
    <div
      aria-modal="true"
      className="header-search-modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeSearch()
      }}
      role="dialog"
    >
      <div className={`header-search-modal__panel${trimmedInput ? ' header-search-modal__panel--with-results' : ''}`}>
        <div className="header-search-modal__field">
          <SearchIcon />
          <input
            ref={inputRef}
            id="header-search-input"
            aria-autocomplete="list"
            aria-controls="header-search-suggestions"
            aria-expanded={suggestions.length > 0}
            aria-label="搜索文档或标签"
            className="header-search-input"
            placeholder="搜索文档、路径、标签，或直接回车搜索"
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' && suggestions.length > 0) {
                event.preventDefault()
                setActiveIndex((current) => {
                  const next = current < 0 ? 0 : current + 1
                  return next >= suggestions.length ? 0 : next
                })
              }

              if (event.key === 'ArrowUp' && suggestions.length > 0) {
                event.preventDefault()
                setActiveIndex((current) => {
                  if (current <= 0) return suggestions.length - 1
                  return current - 1
                })
              }

              if (event.key === 'Enter') {
                event.preventDefault()
                if (activeIndex >= 0 && suggestions[activeIndex]) {
                  pickSuggestion(suggestions[activeIndex])
                  return
                }
                submitSearch(inputValue)
              }

              if (event.key === 'Escape') {
                event.preventDefault()
                closeSearch()
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
        </div>

        {trimmedInput && (
          <div className="header-search__panel" id="header-search-suggestions" role="listbox">
            <button
              aria-selected={activeIndex === -1}
              className="header-search__suggestion header-search__suggestion--submit"
              onMouseDown={(event) => {
                event.preventDefault()
                submitSearch(inputValue)
              }}
              role="option"
              type="button"
            >
              <span className="header-search__suggestion-icon">
                <SearchIcon />
              </span>
              <span className="header-search__suggestion-copy">
                <strong>搜索全部：{trimmedInput}</strong>
                <small>在首页收起式展示匹配文档</small>
              </span>
            </button>

            {documentSuggestions.length > 0 && (
              <div className="header-search__group">
                <span>文档</span>
                {documentSuggestions.map(renderSuggestion)}
              </div>
            )}

            {tagSuggestions.length > 0 && (
              <div className="header-search__group">
                <span>标签</span>
                {tagSuggestions.map(renderSuggestion)}
              </div>
            )}
          </div>
        )}

        <div className="header-search-modal__footer">
          <div className="header-search-modal__keys">
            <span><kbd>↑</kbd><kbd>↓</kbd> 导航</span>
            <span><kbd>Enter</kbd> 选择</span>
            <span><kbd>Esc</kbd> 关闭</span>
          </div>
          <span className="header-search-modal__brand">由 Axi Knowledge 提供</span>
        </div>
      </div>
    </div>,
    document.body,
  ) : null

  return (
    <header className="app-header app-header--command">
      <Link aria-label="返回首页" className="app-logo" to={guideHref}>
        <BookIcon />
        <div className="app-logo__copy">
          <span>{pageCopy.header.brandPrimary}</span>
        </div>
      </Link>

      <div className="header-actions">
        <div className="header-search header-search--global">
          <button
            aria-keyshortcuts="Meta+K Control+K"
            aria-label="全局搜索"
            className="header-search__trigger"
            onClick={openSearch}
            type="button"
          >
            <span className="search-icon-wrap" data-testid="search-icon-wrap">
              {searching ? (
                <span className="search-spinner" />
              ) : (
                <SearchIcon />
              )}
            </span>
            <span className="header-search__trigger-text">{pageCopy.header.searchLabel}</span>
            <kbd>⌘K</kbd>
          </button>
        </div>

        {pageMode !== 'category' && (
          <>
            <nav aria-label="顶部导航" className="header-vp-nav">
              {topNavItems.map((item) => (
                <Link
                  key={item.label}
                  className={`header-vp-nav__link${item.active ? ' active' : ''}`}
                  onClick={() => setNavOpen(false)}
                  to={item.to}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="header-vp-tools" aria-label="站点工具">
              <Link
                aria-label={`切换语言到${nextLocaleLabel}`}
                className="header-vp-tool header-vp-tool--locale"
                title={`切换语言到${nextLocaleLabel}`}
                to={localeHref}
              >
                <LanguageIcon />
                <span>{localeLabel}</span>
                <span aria-hidden="true" className="header-vp-tool__caret">⌄</span>
              </Link>
              <span className="header-vp-separator" aria-hidden="true" />
              <button
                aria-label={themeMode === 'dark' ? '切换浅色样式' : '切换深色样式'}
                aria-checked={themeMode === 'dark'}
                className={`header-vp-tool header-vp-tool--theme header-vp-theme-toggle header-vp-theme-toggle--${themeMode}`}
                onClick={toggleThemeMode}
                role="switch"
                title={themeMode === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
                type="button"
              >
                <span className="header-vp-theme-toggle__track" aria-hidden="true">
                  <span className="header-vp-theme-toggle__thumb">
                    <ThemeIcon />
                  </span>
                </span>
              </button>
              <span className="header-vp-separator" aria-hidden="true" />
              <a
                aria-label="GitHub"
                className="header-vp-tool"
                href="https://github.com/axiomaticworld/axi-docs"
                rel="noreferrer"
                target="_blank"
              >
                <GitHubIcon />
              </a>
            </div>
            <button
              aria-expanded={navOpen}
              aria-label={navOpen ? '关闭导航菜单' : '打开导航菜单'}
              className={`header-vp-menu${navOpen ? ' active' : ''}`}
              onClick={() => setNavOpen((current) => !current)}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </>
        )}
      </div>

      {pageMode !== 'category' && navOpen && (
        <div className="header-vp-screen">
          <nav aria-label="移动端顶部导航">
            {topNavItems.map((item) => (
              <Link
                key={`${item.label}:screen`}
                className={`header-vp-screen__link${item.active ? ' active' : ''}`}
                onClick={() => setNavOpen(false)}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {searchModal}
    </header>
  )
}
