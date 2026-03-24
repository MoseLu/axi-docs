import { RefreshIcon, BookIcon } from './Icons'

interface HeaderProps {
  onRefresh: () => void
}

export function Header({ onRefresh }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-logo">
        <BookIcon />
        <span>Info Hub</span>
      </div>
      <button className="refresh-btn" onClick={onRefresh} title="刷新">
        <RefreshIcon />
        <span>刷新</span>
      </button>
    </header>
  )
}
