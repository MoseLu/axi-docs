import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './Header'

// Mock icons
vi.mock('./Icons', () => ({
  RefreshIcon: () => <span data-testid="refresh-icon">🔄</span>,
  SearchIcon: () => <span data-testid="search-icon">🔍</span>,
  BookIcon: () => <span data-testid="book-icon">📖</span>,
}))

describe('Header', () => {
  const defaultProps = {
    onRefresh: vi.fn(),
    searchQuery: '',
    onSearch: vi.fn(),
    searching: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render app title', () => {
    render(<Header {...defaultProps} />)
    expect(screen.getByText('Info Hub')).toBeInTheDocument()
  })

  it('should render search input with placeholder', () => {
    render(<Header {...defaultProps} />)
    const input = screen.getByPlaceholderText('搜索文档... (支持全文搜索)')
    expect(input).toBeInTheDocument()
  })

  it('should render refresh button', () => {
    render(<Header {...defaultProps} />)
    expect(screen.getByText('刷新')).toBeInTheDocument()
  })

  it('should call onSearch when typing in search input (debounced)', async () => {
    const onSearch = vi.fn()
    render(<Header {...defaultProps} onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('搜索文档... (支持全文搜索)')
    fireEvent.change(input, { target: { value: 'test' } })

    // Should not call immediately due to debounce
    expect(onSearch).not.toHaveBeenCalled()

    // Wait for debounce (300ms)
    await new Promise(resolve => setTimeout(resolve, 350))
    expect(onSearch).toHaveBeenCalledWith('test')
  })

  it('should call onSearch immediately when pressing Enter', () => {
    const onSearch = vi.fn()
    render(<Header {...defaultProps} onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('搜索文档... (支持全文搜索)')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSearch).toHaveBeenCalledWith('test')
  })

  it('should clear search when pressing Escape', () => {
    const onSearch = vi.fn()
    render(<Header {...defaultProps} searchQuery="existing" onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('搜索文档... (支持全文搜索)')
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(onSearch).toHaveBeenCalledWith('')
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })

  it('should call onRefresh when clicking refresh button', () => {
    const onRefresh = vi.fn()
    render(<Header {...defaultProps} onRefresh={onRefresh} />)

    fireEvent.click(screen.getByText('刷新'))
    expect(onRefresh).toHaveBeenCalledTimes(1)
  })

  it('should show search clear button when input has value', () => {
    render(<Header {...defaultProps} searchQuery="test" />)

    // First set the input value
    const input = screen.getByPlaceholderText('搜索文档... (支持全文搜索)')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(screen.getByText('×')).toBeInTheDocument()
  })

  it('should clear search when clicking clear button', () => {
    const onSearch = vi.fn()
    render(<Header {...defaultProps} searchQuery="test" onSearch={onSearch} />)

    const input = screen.getByPlaceholderText('搜索文档... (支持全文搜索)')
    fireEvent.change(input, { target: { value: 'test' } })

    fireEvent.click(screen.getByText('×'))

    expect(onSearch).toHaveBeenCalledWith('')
    expect(input).toHaveValue('')
  })

  it('should update input value when searchQuery prop changes', () => {
    const { rerender } = render(<Header {...defaultProps} />)

    const input = screen.getByPlaceholderText('搜索文档... (支持全文搜索)')
    expect(input).toHaveValue('')

    rerender(<Header {...defaultProps} searchQuery="new query" />)
    expect(input).toHaveValue('new query')
  })

  it('should show loading indicator when searching', () => {
    render(<Header {...defaultProps} searching={true} />)

    expect(screen.getByTestId('search-icon-wrap')).toBeInTheDocument()
    expect(screen.getByTestId('search-icon-wrap').firstChild).toHaveClass('search-spinner')
  })
})
