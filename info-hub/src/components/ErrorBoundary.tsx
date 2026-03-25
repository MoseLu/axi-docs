import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', gap: 12,
          color: 'var(--color-text-muted)', fontSize: 14, padding: 24,
        }}>
          <div style={{ fontSize: 32 }}>⚠️</div>
          <div>页面出现错误，请刷新重试</div>
          {this.state.error && (
            <div style={{ fontSize: 12, opacity: 0.6 }}>{this.state.error.message}</div>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: 8, padding: '6px 16px', borderRadius: 6,
              border: '1px solid var(--color-border)', cursor: 'pointer',
              background: 'var(--color-bg-secondary)', color: 'var(--color-text)',
            }}
          >
            重试
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
