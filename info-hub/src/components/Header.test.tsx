import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Header } from './Header'

vi.mock('./Icons', () => ({
  RefreshIcon: () => <span data-testid="refresh-icon">🔄</span>,
  SearchIcon: () => <span data-testid="search-icon">🔍</span>,
  BookIcon: () => <span data-testid="book-icon">📖</span>,
}))

describe('Header', () => {
  const defaultProps = {
    activeSourceName: 'Obsidian 知识库',
    onNavigateExplorer: vi.fn(),
    onNavigateHome: vi.fn(),
    onRefresh: vi.fn(),
    onSearch: vi.fn(),
    pageMode: 'explorer' as const,
    searchQuery: '',
    searching: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders app title and source pill', () => {
    render(<Header {...defaultProps} />)
    expect(screen.getByText('Info Hub')).toBeInTheDocument()
    expect(screen.getByText('Obsidian 知识库')).toBeInTheDocument()
  })

  it('renders explorer search input when in explorer mode', () => {
    render(<Header {...defaultProps} />)
    expect(screen.getByLabelText('搜索知识库')).toBeInTheDocument()
  })

  it('debounces explorer search input', async () => {
    const onSearch = vi.fn()
    render(<Header {...defaultProps} onSearch={onSearch} />)

    const input = screen.getByLabelText('搜索知识库')
    fireEvent.change(input, { target: { value: 'graph' } })

    expect(onSearch).not.toHaveBeenCalled()
    await new Promise((resolve) => setTimeout(resolve, 320))
    expect(onSearch).toHaveBeenCalledWith('graph')
  })

  it('submits search immediately on Enter', () => {
    const onSearch = vi.fn()
    render(<Header {...defaultProps} onSearch={onSearch} />)

    const input = screen.getByLabelText('搜索知识库')
    fireEvent.change(input, { target: { value: 'path' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSearch).toHaveBeenCalledWith('path')
  })

  it('clears search on Escape', () => {
    const onSearch = vi.fn()
    render(<Header {...defaultProps} searchQuery="existing" onSearch={onSearch} />)

    const input = screen.getByLabelText('搜索知识库')
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(onSearch).toHaveBeenCalledWith('')
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })

  it('renders quick launcher on home mode', () => {
    render(<Header {...defaultProps} pageMode="home" searchQuery="index" />)
    expect(screen.getByText('继续搜索 “index”')).toBeInTheDocument()
  })

  it('calls onNavigateHome and onNavigateExplorer', () => {
    const onNavigateHome = vi.fn()
    const onNavigateExplorer = vi.fn()
    render(
      <Header
        {...defaultProps}
        onNavigateExplorer={onNavigateExplorer}
        onNavigateHome={onNavigateHome}
      />,
    )

    fireEvent.click(screen.getByText('指挥中心'))
    fireEvent.click(screen.getByText('图谱探索'))

    expect(onNavigateHome).toHaveBeenCalledTimes(1)
    expect(onNavigateExplorer).toHaveBeenCalledTimes(1)
  })

  it('calls onRefresh when clicking refresh button', () => {
    const onRefresh = vi.fn()
    render(<Header {...defaultProps} onRefresh={onRefresh} />)

    fireEvent.click(screen.getByText('刷新'))
    expect(onRefresh).toHaveBeenCalledTimes(1)
  })

  it('shows clear button when input has value', () => {
    render(<Header {...defaultProps} searchQuery="test" />)
    expect(screen.getByLabelText('清除搜索')).toBeInTheDocument()
  })

  it('shows loading indicator when searching', () => {
    render(<Header {...defaultProps} searching={true} />)
    expect(screen.getByTestId('search-icon-wrap').firstChild).toHaveClass('search-spinner')
  })
})
