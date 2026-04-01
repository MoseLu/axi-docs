interface NotFoundPageProps {
  title?: string
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
  onPrimaryAction: () => void
  onSecondaryAction?: () => void
}

export function NotFoundPage({
  title = '页面不存在',
  description = '当前链接没有对应的页面或内容。你可以返回首页重新浏览，或直接进入搜索页查找目标知识点。',
  primaryLabel = '返回首页',
  secondaryLabel = '打开搜索',
  onPrimaryAction,
  onSecondaryAction,
}: NotFoundPageProps) {
  return (
    <div className="workspace-empty-state workspace-empty-state--centered">
      <div className="workspace-empty-state__eyebrow">404</div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="workspace-empty-state__actions">
        <button className="workspace-empty-state__action" onClick={onPrimaryAction} type="button">
          {primaryLabel}
        </button>
        {onSecondaryAction && secondaryLabel && (
          <button className="workspace-empty-state__action workspace-empty-state__action--ghost" onClick={onSecondaryAction} type="button">
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  )
}
