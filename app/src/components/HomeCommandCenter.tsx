import { DocSource, SelectedFile } from '../types'
import { PageShell, RailPanel } from './CockpitPrimitives'
import { HeroKnowledgeScene } from './HeroKnowledgeScene'

export interface QuickKnowledgeItemLike {
  sourceId: string
  path: string
  name: string
  title?: string
  graphTitle?: string
  description?: string
}

interface HomeCommandCenterProps {
  source: DocSource
  searchQuery: string
  activeTag: string | null
  selectedFile: SelectedFile | null
  onOpenExplorer: () => void
  onTagSelect: (tag: string | null) => void
  onOpenItem: (sourceId: string, path: string) => void
  onClearSelectedFile: () => void
  graphFocusPath?: string | null
}

export function HomeCommandCenter({
  source,
  searchQuery,
  selectedFile,
  onTagSelect,
  onOpenItem,
  graphFocusPath,
}: HomeCommandCenterProps) {
  const graphMode = selectedFile ? 'focus' : searchQuery.trim() ? 'global' : 'tree'

  return (
    <PageShell className="command-center__home-shell" compact>
      <RailPanel className="command-center__graph-shell command-center__graph-shell--home" tone="primary">
        <div className="command-center__graph">
          <HeroKnowledgeScene
            focusPath={graphFocusPath}
            mode={graphMode}
            onNavigate={(path) => onOpenItem(source.id, path)}
            onTagSelect={onTagSelect}
            sourceId={source.id}
          />
        </div>
      </RailPanel>
    </PageShell>
  )
}
