import type { HTMLAttributes, ReactNode } from 'react'

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(' ')
}

interface PrimitiveProps {
  children: ReactNode
  className?: string
}

interface PageShellProps extends PrimitiveProps {
  compact?: boolean
}

export function PageShell({ children, className, compact = false }: PageShellProps) {
  return (
    <section className={cx('cockpit-shell', compact && 'cockpit-shell--compact', className)}>
      {children}
    </section>
  )
}

interface RailPanelProps extends PrimitiveProps {
  tone?: 'primary' | 'secondary' | 'ghost'
}

export function RailPanel({ children, className, tone = 'secondary' }: RailPanelProps) {
  return (
    <section className={cx('rail-panel', `rail-panel--${tone}`, className)}>
      {children}
    </section>
  )
}

interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  compact?: boolean
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
  compact = false,
  className,
  ...rest
}: SectionHeaderProps) {
  return (
    <div className={cx('section-header', compact && 'section-header--compact', className)} {...rest}>
      <div className="section-header__main">
        {eyebrow && <div className="section-header__eyebrow">{eyebrow}</div>}
        <div className="section-header__title">{title}</div>
        {description && <p className="section-header__description">{description}</p>}
      </div>
      {(meta || actions) && (
        <div className="section-header__aside">
          {meta && <div className="section-header__meta">{meta}</div>}
          {actions && <div className="section-header__actions">{actions}</div>}
        </div>
      )}
    </div>
  )
}

interface MetricPillProps {
  label: string
  value: ReactNode
  accent?: 'blue' | 'teal' | 'amber'
  subtle?: ReactNode
}

export function MetricPill({ label, value, accent = 'blue', subtle }: MetricPillProps) {
  return (
    <div className={cx('metric-pill', `metric-pill--${accent}`)}>
      <span className="metric-pill__label">{label}</span>
      <strong className="metric-pill__value">{value}</strong>
      {subtle && <span className="metric-pill__subtle">{subtle}</span>}
    </div>
  )
}

interface SegmentedTabsProps<T extends string> {
  items: Array<{ value: T; label: string; badge?: ReactNode }>
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedTabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div className={cx('segmented-tabs', className)} role="tablist">
      {items.map((item) => (
        <button
          key={item.value}
          className={cx('segmented-tabs__item', item.value === value && 'active')}
          onClick={() => onChange(item.value)}
          role="tab"
          type="button"
        >
          <span>{item.label}</span>
          {item.badge !== undefined && <small>{item.badge}</small>}
        </button>
      ))}
    </div>
  )
}

interface CompactEmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  actions?: ReactNode
  className?: string
}

export function CompactEmptyState({
  icon,
  title,
  description,
  actions,
  className,
}: CompactEmptyStateProps) {
  return (
    <div className={cx('compact-empty-state', className)}>
      {icon && <div className="compact-empty-state__icon">{icon}</div>}
      <div className="compact-empty-state__copy">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      {actions && <div className="compact-empty-state__actions">{actions}</div>}
    </div>
  )
}
