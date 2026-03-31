import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import * as THREE from 'three'
import SpriteText from 'three-spritetext'
import { API_BASE } from '../constants'
import { FileIcon, FolderIcon, LinkIcon, SearchIcon } from './Icons'

type GlobalGraphMode = 'focus' | 'global' | 'tree' | 'orphan'

interface GlobalGraphNode {
  id: string
  label: string
  kind: 'current' | 'note' | 'tag'
  path?: string
  tags?: string[]
}

interface GlobalGraphEdge {
  source: string
  target: string
  kind: 'wikilink' | 'tag'
}

interface GraphApiResponse {
  nodes: GlobalGraphNode[]
  edges: GlobalGraphEdge[]
  orphanNodes?: GlobalGraphNode[]
}

interface GraphTreeNode {
  id: string
  label: string
  pathKey: string
  depth: number
  count: number
  notes: GraphNoteNode[]
  children: GraphTreeNode[]
}

interface GraphNoteNode extends GlobalGraphNode {
  kind: 'current' | 'note'
}

type SpaceNodeKind = 'current' | 'note' | 'tag' | 'branch'

interface SpaceNode {
  id: string
  label: string
  kind: SpaceNodeKind
  path?: string
  tags?: string[]
  count?: number
  depth?: number
}

interface SpaceLink {
  source: string
  target: string
  kind: 'wikilink' | 'tag' | 'hierarchy'
}

interface GlobalGraphProps {
  width: number
  height: number
  sourceId: string
  focusPath?: string | null
  mode: GlobalGraphMode
  layout?: 'workspace' | 'dock' | 'hero'
  selectedBranch?: string | null
  selectedNodeId?: string | null
  onBranchChange?: (branch: string | null) => void
  onNodeSelect?: (nodeId: string | null) => void
  onNavigate?: (path: string) => void
  onTagSelect?: (tag: string) => void
}

const SPACE_COLORS: Record<SpaceNodeKind, string> = {
  current: '#7dd3fc',
  note: '#818cf8',
  tag: '#f59e0b',
  branch: '#34d399',
}

const GRAPH_BACKDROP = '#06111f'
const TREE_ROOT_ID = 'branch:__knowledge-root__'

function formatLabel(name: string): string {
  if (/[\u4e00-\u9fa5]/.test(name) || /\s/.test(name)) {
    return name
      .replace(/\.(md|markdown)$/i, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 40)
  }
  return name
    .replace(/\.(md|markdown)$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40)
}

function truncateLabel(label: string, max = 26): string {
  return label.length > max ? `${label.slice(0, max)}…` : label
}

function normalizeEndpoint(endpoint: string | { id: string }): string {
  return typeof endpoint === 'string' ? endpoint : endpoint.id
}

function matchesQuery(node: Pick<GlobalGraphNode, 'label' | 'path' | 'tags'>, term: string): boolean {
  if (!term) return true
  const haystack = `${node.label} ${node.path || ''} ${(node.tags || []).join(' ')}`.toLowerCase()
  return term
    .split(/\s+/)
    .filter(Boolean)
    .every(token => haystack.includes(token))
}

function buildAdjacency(links: SpaceLink[]) {
  const adjacency = new Map<string, Set<string>>()
  for (const link of links) {
    const sourceId = normalizeEndpoint(link.source)
    const targetId = normalizeEndpoint(link.target)
    if (!adjacency.has(sourceId)) adjacency.set(sourceId, new Set())
    if (!adjacency.has(targetId)) adjacency.set(targetId, new Set())
    adjacency.get(sourceId)!.add(targetId)
    adjacency.get(targetId)!.add(sourceId)
  }
  return adjacency
}

function buildKnowledgeTree(notes: GraphNoteNode[]) {
  const branchMap = new Map<string, GraphTreeNode>()
  const rootChildren: GraphTreeNode[] = []
  const looseNotes: GraphNoteNode[] = []

  function ensureBranch(pathKey: string, label: string, depth: number): GraphTreeNode {
    const existing = branchMap.get(pathKey)
    if (existing) return existing

    const branch: GraphTreeNode = {
      id: `branch:${pathKey}`,
      label,
      pathKey,
      depth,
      count: 0,
      notes: [],
      children: [],
    }
    branchMap.set(pathKey, branch)
    return branch
  }

  for (const note of notes) {
    const parts = (note.path || note.label)
      .split('/')
      .filter(Boolean)
    const directories = parts.slice(0, -1)

    if (directories.length === 0) {
      looseNotes.push(note)
      continue
    }

    let parent: GraphTreeNode | null = null
    let pathKey = ''
    for (const [index, segment] of directories.entries()) {
      pathKey = pathKey ? `${pathKey}/${segment}` : segment
      const branch = ensureBranch(pathKey, formatLabel(segment), index + 1)
      branch.count += 1

      if (!parent) {
        if (!rootChildren.some(item => item.id === branch.id)) {
          rootChildren.push(branch)
        }
      } else if (!parent.children.some(item => item.id === branch.id)) {
        parent.children.push(branch)
      }

      parent = branch
    }

    parent?.notes.push(note)
  }

  return { rootChildren, branchMap, looseNotes }
}

function collectTreeBranchIds(branch: GraphTreeNode): Set<string> {
  const ids = new Set<string>([branch.pathKey])
  for (const child of branch.children) {
    for (const id of collectTreeBranchIds(child)) {
      ids.add(id)
    }
  }
  return ids
}

function resolveSelectedTree(tree: ReturnType<typeof buildKnowledgeTree>, selectedBranch: string | null) {
  if (!selectedBranch) {
    return {
      roots: tree.rootChildren,
      looseNotes: tree.looseNotes,
      currentBranch: null as GraphTreeNode | null,
    }
  }

  const currentBranch = tree.branchMap.get(selectedBranch) || null
  if (!currentBranch) {
    return {
      roots: tree.rootChildren,
      looseNotes: tree.looseNotes,
      currentBranch: null as GraphTreeNode | null,
    }
  }

  return {
    roots: [currentBranch],
    looseNotes: [],
    currentBranch,
  }
}

function createTreeGraph(
  roots: GraphTreeNode[],
  looseNotes: GraphNoteNode[],
  selectedBranch: GraphTreeNode | null,
  searchTerm: string,
) {
  const nodes: SpaceNode[] = [{
    id: TREE_ROOT_ID,
    label: selectedBranch ? formatLabel(selectedBranch.label) : 'Knowledge Space',
    kind: 'branch',
    path: selectedBranch?.pathKey,
    count: selectedBranch?.count,
    depth: 0,
  }]
  const links: SpaceLink[] = []

  function visitBranch(branch: GraphTreeNode, parentId: string) {
    nodes.push({
      id: branch.id,
      label: branch.label,
      kind: 'branch',
      path: branch.pathKey,
      count: branch.count,
      depth: branch.depth,
    })
    links.push({ source: parentId, target: branch.id, kind: 'hierarchy' })

    for (const child of branch.children) {
      visitBranch(child, branch.id)
    }

    for (const note of branch.notes) {
      if (!matchesQuery(note, searchTerm)) continue
      nodes.push({
        id: note.id,
        label: note.label,
        kind: note.kind === 'current' ? 'current' : 'note',
        path: note.path,
        tags: note.tags,
      })
      links.push({ source: branch.id, target: note.id, kind: 'hierarchy' })
    }
  }

  for (const branch of roots) {
    visitBranch(branch, TREE_ROOT_ID)
  }

  for (const note of looseNotes) {
    if (!matchesQuery(note, searchTerm)) continue
    nodes.push({
      id: note.id,
      label: note.label,
      kind: note.kind === 'current' ? 'current' : 'note',
      path: note.path,
      tags: note.tags,
    })
    links.push({ source: TREE_ROOT_ID, target: note.id, kind: 'hierarchy' })
  }

  return { nodes, links }
}

function createNodeObject(node: SpaceNode, selectedId: string | null, hoveredId: string | null, hero = false) {
  const color = SPACE_COLORS[node.kind]
  const isSelected = node.id === selectedId
  const isHovered = node.id === hoveredId
  const scale = hero ? 1.6 : 1
  const radius = node.kind === 'current'
    ? 10 * scale
    : node.kind === 'branch'
      ? 7 * scale
      : node.kind === 'tag'
        ? 5 * scale
        : 6.5 * scale

  const geometry = new THREE.SphereGeometry(radius, 24, 24)
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: isSelected ? 0.95 : isHovered ? 0.65 : 0.34,
    metalness: 0.25,
    roughness: node.kind === 'tag' ? 0.38 : 0.3,
  })

  const mesh = new THREE.Mesh(geometry, material)
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.8, 16, 16),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: isSelected ? 0.15 : isHovered ? 0.09 : 0.04,
    }),
  )

  const group = new THREE.Group()
  group.add(halo)
  group.add(mesh)

  const showLabel = !hero || isSelected || isHovered || node.kind === 'branch' || node.kind === 'current'
  if (showLabel) {
    const label = new SpriteText(
      node.kind === 'tag'
        ? `#${truncateLabel(formatLabel(node.label), 18)}`
        : truncateLabel(formatLabel(node.label), hero ? 18 : 20),
    )
    label.color = node.kind === 'tag' ? '#fde68a' : '#e5eef9'
    label.textHeight = hero
      ? (isSelected ? 10 : node.kind === 'branch' ? 7.6 : 6.4)
      : (isSelected ? 7 : node.kind === 'branch' ? 6 : 5)
    label.backgroundColor = 'rgba(8, 15, 32, 0.78)'
    label.padding = 3
    label.borderRadius = 3
    ;(label as unknown as THREE.Object3D).position.set(0, radius + (hero ? 14 : 8), 0)
    group.add(label)
  }

  return group
}

function simplifyGraphForHero(graph: { nodes: SpaceNode[]; links: SpaceLink[] }) {
  const visibleNodes = [...graph.nodes]
    .filter((node) => node.kind !== 'tag')
    .sort((left, right) => {
      const score = (node: SpaceNode) => {
        if (node.kind === 'current') return 100
        if (node.kind === 'branch') return 80 - (node.depth || 0)
        if (node.kind === 'note') return 50
        return 10
      }
      return score(right) - score(left)
    })
    .slice(0, 26)

  const visibleIds = new Set(visibleNodes.map((node) => node.id))
  const links = graph.links
    .filter((link) => visibleIds.has(normalizeEndpoint(link.source)) && visibleIds.has(normalizeEndpoint(link.target)))
    .slice(0, 42)

  return { nodes: visibleNodes, links }
}

export function GlobalGraph({
  width,
  height,
  sourceId,
  focusPath,
  mode,
  layout = 'workspace',
  selectedBranch: selectedBranchProp,
  selectedNodeId: selectedNodeIdProp,
  onBranchChange,
  onNodeSelect,
  onNavigate,
  onTagSelect,
}: GlobalGraphProps) {
  const graphRef = useRef<{
    cameraPosition?: (position: { x?: number; y?: number; z?: number }, lookAt?: { x?: number; y?: number; z?: number }, ms?: number) => void
    controls?: () => {
      enableDamping?: boolean
      dampingFactor?: number
      autoRotate?: boolean
      autoRotateSpeed?: number
      minDistance?: number
      maxDistance?: number
    }
    zoomToFit?: (ms?: number, padding?: number, nodeFilter?: (node: SpaceNode) => boolean) => void
    scene?: () => THREE.Scene
    d3Force?: (forceName: string) => {
      distance?: (distance: number) => void
      strength?: (strength: number) => void
    } | undefined
  } | null>(null)

  const [globalData, setGlobalData] = useState<GraphApiResponse>({ nodes: [], edges: [], orphanNodes: [] })
  const [focusData, setFocusData] = useState<GraphApiResponse | null>(null)
  const [loadingGlobal, setLoadingGlobal] = useState(true)
  const [loadingFocus, setLoadingFocus] = useState(false)
  const [internalSelectedBranch, setInternalSelectedBranch] = useState<string | null>(null)
  const [internalSelectedNodeId, setInternalSelectedNodeId] = useState<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [showTags, setShowTags] = useState(true)
  const [autoRotate, setAutoRotate] = useState(() => {
    if (typeof window === 'undefined') return true
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [query, setQuery] = useState('')
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set())
  const clickStateRef = useRef<{ id: string; at: number } | null>(null)
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const isDockLayout = layout === 'dock'
  const isHeroLayout = layout === 'hero'
  const selectedBranch = selectedBranchProp === undefined ? internalSelectedBranch : selectedBranchProp
  const selectedNodeId = selectedNodeIdProp === undefined ? internalSelectedNodeId : selectedNodeIdProp

  const setSelectedBranch = (branch: string | null) => {
    onBranchChange?.(branch)
    if (selectedBranchProp === undefined) {
      setInternalSelectedBranch(branch)
    }
  }

  const setSelectedNodeId = (nodeId: string | null) => {
    onNodeSelect?.(nodeId)
    if (selectedNodeIdProp === undefined) {
      setInternalSelectedNodeId(nodeId)
    }
  }

  useEffect(() => {
    let cancelled = false
    setLoadingGlobal(true)
    fetch(`${API_BASE}/global-graph?source=${sourceId}`)
      .then(async response => {
        if (!response.ok) throw new Error('global graph request failed')
        const payload = await response.json() as GraphApiResponse
        if (!cancelled) {
          setGlobalData({
            nodes: payload.nodes || [],
            edges: payload.edges || [],
            orphanNodes: payload.orphanNodes || [],
          })
          const nextExpanded = new Set<string>()
          for (const node of payload.nodes || []) {
            if (node.kind === 'note' && node.path?.includes('/')) {
              nextExpanded.add(node.path.split('/')[0])
            }
          }
          setExpandedBranches(nextExpanded)
        }
      })
      .catch(() => {
        if (!cancelled) setGlobalData({ nodes: [], edges: [], orphanNodes: [] })
      })
      .finally(() => {
        if (!cancelled) setLoadingGlobal(false)
      })

    return () => {
      cancelled = true
    }
  }, [sourceId])

  useEffect(() => {
    if (mode !== 'focus' || !focusPath) {
      setFocusData(null)
      setLoadingFocus(false)
      return
    }

    let cancelled = false
    setLoadingFocus(true)
    fetch(`${API_BASE}/graph?source=${sourceId}&path=${encodeURIComponent(focusPath)}`)
      .then(async response => {
        if (!response.ok) throw new Error('focus graph request failed')
        const payload = await response.json() as GraphApiResponse
        if (!cancelled) {
          setFocusData({ nodes: payload.nodes || [], edges: payload.edges || [] })
        }
      })
      .catch(() => {
        if (!cancelled) setFocusData({ nodes: [], edges: [] })
      })
      .finally(() => {
        if (!cancelled) setLoadingFocus(false)
      })

    return () => {
      cancelled = true
    }
  }, [focusPath, mode, sourceId])

  const connectedNotes = useMemo(
    () => globalData.nodes.filter((node): node is GraphNoteNode => node.kind === 'note'),
    [globalData.nodes],
  )

  const orphanNotes = useMemo(
    () => (globalData.orphanNodes || []).filter((node): node is GraphNoteNode => node.kind === 'note'),
    [globalData.orphanNodes],
  )

  const allNotes = useMemo(() => {
    const map = new Map<string, GraphNoteNode>()
    for (const node of [...connectedNotes, ...orphanNotes]) {
      map.set(node.id, node)
    }
    return [...map.values()]
  }, [connectedNotes, orphanNotes])

  const tree = useMemo(() => buildKnowledgeTree(allNotes), [allNotes])
  const selectedTree = useMemo(() => resolveSelectedTree(tree, selectedBranch), [tree, selectedBranch])

  const baseGraph = useMemo(() => {
    if (mode === 'focus') {
      const nodes = (focusData?.nodes || [])
        .filter(node => node.kind === 'current' || node.kind === 'note' || (showTags && node.kind === 'tag'))
        .filter(node => matchesQuery(node, deferredQuery))
        .map<SpaceNode>(node => ({
          id: node.id,
          label: node.label,
          kind: node.kind === 'current' ? 'current' : node.kind === 'tag' ? 'tag' : 'note',
          path: node.path,
          tags: node.tags,
        }))

      const visibleIds = new Set(nodes.map(node => node.id))
      const links = (focusData?.edges || [])
        .filter(edge => visibleIds.has(normalizeEndpoint(edge.source)) && visibleIds.has(normalizeEndpoint(edge.target)))
        .filter(edge => showTags || edge.kind !== 'tag')
        .map<SpaceLink>(edge => ({ ...edge }))

      return { nodes, links }
    }

    if (mode === 'tree') {
      return createTreeGraph(
        selectedTree.roots,
        selectedTree.looseNotes,
        selectedTree.currentBranch,
        deferredQuery,
      )
    }

    if (mode === 'orphan') {
      const nodes = orphanNotes
        .filter(node => !selectedBranch || node.path?.startsWith(selectedBranch))
        .filter(node => matchesQuery(node, deferredQuery))
        .map<SpaceNode>(node => ({
          id: node.id,
          label: node.label,
          kind: 'note',
          path: node.path,
          tags: node.tags,
        }))

      return { nodes, links: [] as SpaceLink[] }
    }

    const allowedBranchIds = selectedBranch && tree.branchMap.get(selectedBranch)
      ? collectTreeBranchIds(tree.branchMap.get(selectedBranch)!)
      : null

    const notes = allNotes
      .filter(node => !selectedBranch || (node.path && allowedBranchIds?.has(node.path.split('/').slice(0, -1).join('/'))))
      .filter(node => matchesQuery(node, deferredQuery))
      .map<SpaceNode>(node => ({
        id: node.id,
        label: node.label,
        kind: 'note',
        path: node.path,
        tags: node.tags,
      }))

    const visibleNoteIds = new Set(notes.map(node => node.id))
    const visibleTagIds = new Set<string>()
    const links = globalData.edges
      .filter(edge => {
        const source = normalizeEndpoint(edge.source)
        const target = normalizeEndpoint(edge.target)
        if (edge.kind === 'tag') {
          if (!showTags) return false
          const noteId = visibleNoteIds.has(source) ? source : visibleNoteIds.has(target) ? target : null
          const tagId = noteId === source ? target : source
          if (!noteId) return false
          visibleTagIds.add(tagId)
          return true
        }
        return visibleNoteIds.has(source) && visibleNoteIds.has(target)
      })
      .map<SpaceLink>(edge => ({ ...edge }))

    const tags = globalData.nodes
      .filter((node): node is GlobalGraphNode => node.kind === 'tag')
      .filter(node => visibleTagIds.has(node.id))
      .filter(node => matchesQuery(node, deferredQuery))
      .map<SpaceNode>(node => ({
        id: node.id,
        label: node.label,
        kind: 'tag',
        tags: node.tags,
      }))

    return { nodes: [...notes, ...tags], links }
  }, [allNotes, deferredQuery, focusData, globalData.edges, globalData.nodes, mode, orphanNotes, selectedBranch, selectedTree, showTags, tree.branchMap])

  const currentGraph = useMemo(
    () => isHeroLayout ? simplifyGraphForHero(baseGraph) : baseGraph,
    [baseGraph, isHeroLayout],
  )

  const adjacency = useMemo(() => buildAdjacency(currentGraph.links), [currentGraph.links])

  const selectedNode = useMemo(
    () => currentGraph.nodes.find(node => node.id === selectedNodeId) || null,
    [currentGraph.nodes, selectedNodeId],
  )
  const showTreePanel = !isHeroLayout && (!isDockLayout || mode === 'tree')
  const showInspectorPanel = !isHeroLayout && !isDockLayout
  const showFloatingInspector = isDockLayout && Boolean(selectedNode)

  const selectedNeighbors = useMemo(
    () => selectedNodeId ? adjacency.get(selectedNodeId) || new Set<string>() : new Set<string>(),
    [adjacency, selectedNodeId],
  )

  const totals = useMemo(() => ({
    notes: allNotes.length,
    links: globalData.edges.filter(edge => edge.kind === 'wikilink').length,
    tags: globalData.nodes.filter(node => node.kind === 'tag').length,
    orphans: orphanNotes.length,
  }), [allNotes.length, globalData.edges, globalData.nodes, orphanNotes.length])

  useEffect(() => {
    const controls = graphRef.current?.controls?.()
    if (!controls) return
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = isHeroLayout ? 0.2 : 0.32
    controls.minDistance = 120
    controls.maxDistance = 2400
  }, [autoRotate, currentGraph.nodes.length, isHeroLayout])

  useEffect(() => {
    const scene = graphRef.current?.scene?.()
    if (!scene || scene.getObjectByName('knowledge-space-grid')) return

    scene.fog = new THREE.FogExp2(GRAPH_BACKDROP, 0.00065)

    const ambientLight = new THREE.AmbientLight('#dce8ff', 1.2)
    ambientLight.name = 'knowledge-space-ambient'
    scene.add(ambientLight)

    const primaryLight = new THREE.DirectionalLight('#8bc5ff', 1.8)
    primaryLight.name = 'knowledge-space-key'
    primaryLight.position.set(140, 180, 120)
    scene.add(primaryLight)

    const accentLight = new THREE.PointLight('#8b5cf6', 1.2, 1200)
    accentLight.name = 'knowledge-space-accent'
    accentLight.position.set(-120, -60, 180)
    scene.add(accentLight)

    const grid = new THREE.GridHelper(1800, 28, '#1f4f82', '#10263f')
    grid.name = 'knowledge-space-grid'
    grid.position.y = -180
    scene.add(grid)
  }, [currentGraph.nodes.length])

  useEffect(() => {
    if (currentGraph.nodes.length === 0) return
    const timeout = window.setTimeout(() => {
      graphRef.current?.zoomToFit?.(700, isHeroLayout ? 8 : 80)
    }, 220)
    return () => window.clearTimeout(timeout)
  }, [currentGraph.links.length, currentGraph.nodes.length, isHeroLayout, mode])

  useEffect(() => {
    if (!isHeroLayout || currentGraph.nodes.length === 0) return

    const timeout = window.setTimeout(() => {
      const positionedNodes = currentGraph.nodes.filter((node) => (
        typeof (node as SpaceNode & { x?: number }).x === 'number'
        && typeof (node as SpaceNode & { y?: number }).y === 'number'
        && typeof (node as SpaceNode & { z?: number }).z === 'number'
      )) as Array<SpaceNode & { x: number; y: number; z: number }>

      if (positionedNodes.length === 0) return

      const bounds = positionedNodes.reduce(
        (accumulator, node) => ({
          minX: Math.min(accumulator.minX, node.x),
          maxX: Math.max(accumulator.maxX, node.x),
          minY: Math.min(accumulator.minY, node.y),
          maxY: Math.max(accumulator.maxY, node.y),
          minZ: Math.min(accumulator.minZ, node.z),
          maxZ: Math.max(accumulator.maxZ, node.z),
        }),
        {
          minX: positionedNodes[0].x,
          maxX: positionedNodes[0].x,
          minY: positionedNodes[0].y,
          maxY: positionedNodes[0].y,
          minZ: positionedNodes[0].z,
          maxZ: positionedNodes[0].z,
        },
      )

      const center = {
        x: (bounds.minX + bounds.maxX) / 2,
        y: (bounds.minY + bounds.maxY) / 2,
        z: (bounds.minZ + bounds.maxZ) / 2,
      }
      const span = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY, bounds.maxZ - bounds.minZ, 220)
      const distance = Math.max(span * 0.92, 260)

      graphRef.current?.cameraPosition?.(
        {
          x: center.x + distance * 0.42,
          y: center.y + distance * 0.18,
          z: center.z + distance * 0.94,
        },
        {
          x: center.x,
          y: center.y + distance * 0.03,
          z: center.z,
        },
        900,
      )
    }, 1100)

    return () => window.clearTimeout(timeout)
  }, [currentGraph.nodes, isHeroLayout])

  useEffect(() => {
    if (!selectedNodeId && currentGraph.nodes.length > 0) {
      const current = currentGraph.nodes.find(node => node.kind === 'current')
      setSelectedNodeId(current?.id || currentGraph.nodes[0].id)
    }
  }, [currentGraph.nodes, selectedNodeId])

  function focusNode(node: { x?: number; y?: number; z?: number }) {
    graphRef.current?.cameraPosition?.(
      {
        x: (node.x || 0) + 160,
        y: (node.y || 0) + 90,
        z: (node.z || 0) + 160,
      },
      { x: node.x || 0, y: node.y || 0, z: node.z || 0 },
      900,
    )
  }

  function handleNodeClick(node: SpaceNode & { x?: number; y?: number; z?: number }) {
    setSelectedNodeId(node.id)
    if (node.kind === 'branch') {
      startTransition(() => {
        setSelectedBranch(node.path || null)
      })
    }
    focusNode(node)
  }

  function handleNodeOpen(node: SpaceNode) {
    if ((node.kind === 'note' || node.kind === 'current') && node.path) {
      onNavigate?.(node.path)
      return
    }
    if (node.kind === 'tag') {
      onTagSelect?.(node.label)
    }
  }

  function handleNodeInteraction(node: SpaceNode & { x?: number; y?: number; z?: number }) {
    const now = Date.now()
    const last = clickStateRef.current
    if (last && last.id === node.id && now - last.at < 260) {
      clickStateRef.current = null
      handleNodeOpen(node)
      return
    }

    clickStateRef.current = { id: node.id, at: now }
    handleNodeClick(node)
  }

  function toggleBranch(pathKey: string) {
    setExpandedBranches(previous => {
      const next = new Set(previous)
      if (next.has(pathKey)) next.delete(pathKey)
      else next.add(pathKey)
      return next
    })
  }

  function renderTreeNodes(nodes: GraphTreeNode[]) {
    return nodes.map(branch => {
      const isExpanded = expandedBranches.has(branch.pathKey) || (selectedBranch ? selectedBranch.startsWith(branch.pathKey) : branch.depth <= 1)
      const isActive = selectedBranch === branch.pathKey
      return (
        <div key={branch.id} className="graph-tree-node">
          <button
            className={`graph-tree-branch${isActive ? ' active' : ''}`}
            style={{ paddingLeft: `${branch.depth * 12 + 14}px` }}
            onClick={() => startTransition(() => setSelectedBranch(isActive ? null : branch.pathKey))}
            onDoubleClick={() => toggleBranch(branch.pathKey)}
            title={branch.pathKey}
            type="button"
          >
            <span className={`graph-tree-caret${isExpanded ? ' expanded' : ''}`}>▶</span>
            <FolderIcon />
            <span className="graph-tree-label">{branch.label}</span>
            <span className="graph-tree-count">{branch.count}</span>
          </button>

          {isExpanded && branch.notes.length > 0 && branch.notes.map(note => (
            <button
              key={note.id}
              className={`graph-tree-leaf${selectedNodeId === note.id ? ' active' : ''}`}
              style={{ paddingLeft: `${branch.depth * 12 + 36}px` }}
              onClick={() => {
                setSelectedNodeId(note.id)
                onNavigate?.(note.path || note.id)
              }}
              title={note.path}
              type="button"
            >
              <FileIcon />
              <span className="graph-tree-label">{formatLabel(note.label)}</span>
            </button>
          ))}

          {isExpanded && branch.children.length > 0 && renderTreeNodes(branch.children)}
        </div>
      )
    })
  }

  function renderInspectorContent() {
    if (!selectedNode) {
      return (
        <div className="graph-inspector graph-inspector--empty">
          <p>点击一个节点查看路径、标签和快速操作。</p>
        </div>
      )
    }

    return (
      <div className="graph-inspector">
        <div className={`graph-inspector__badge graph-inspector__badge--${selectedNode.kind}`}>
          {selectedNode.kind === 'current' && '当前文档'}
          {selectedNode.kind === 'note' && '知识文档'}
          {selectedNode.kind === 'tag' && '标签节点'}
          {selectedNode.kind === 'branch' && '树形分支'}
        </div>
        <h4 className="graph-inspector__title">{formatLabel(selectedNode.label)}</h4>
        {selectedNode.path && (
          <div className="graph-inspector__path">{selectedNode.path}</div>
        )}
        {selectedNode.tags && selectedNode.tags.length > 0 && (
          <div className="graph-inspector__tags">
            {selectedNode.tags.slice(0, 8).map(tag => (
              <button
                key={tag}
                className="tag tag--small"
                onClick={() => onTagSelect?.(tag)}
                type="button"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <div className="graph-inspector__facts">
          <div className="graph-fact">
            <span>邻接节点</span>
            <strong>{adjacency.get(selectedNode.id)?.size || 0}</strong>
          </div>
          <div className="graph-fact">
            <span>类型</span>
            <strong>{selectedNode.kind}</strong>
          </div>
          {selectedNode.count !== undefined && (
            <div className="graph-fact">
              <span>子文档</span>
              <strong>{selectedNode.count}</strong>
            </div>
          )}
        </div>

        <div className="graph-inspector__actions">
          {(selectedNode.kind === 'note' || selectedNode.kind === 'current') && selectedNode.path && (
            <button className="graph-action" onClick={() => onNavigate?.(selectedNode.path!)} type="button">
              打开文档
            </button>
          )}
          {selectedNode.kind === 'tag' && (
            <button className="graph-action" onClick={() => onTagSelect?.(selectedNode.label)} type="button">
              以此标签筛选
            </button>
          )}
          {selectedNode.kind === 'branch' && (
            <button className="graph-action" onClick={() => setSelectedBranch(selectedNode.path || null)} type="button">
              聚焦该分支
            </button>
          )}
        </div>
      </div>
    )
  }

  if ((loadingGlobal && mode !== 'focus') || (mode === 'focus' && loadingFocus)) {
    return (
      <div className="graph-space graph-space--loading" style={{ width, height }}>
        <div className="spinner" style={{ width: 24, height: 24 }} />
        <span>构建 3D 知识空间中...</span>
      </div>
    )
  }

  if (mode === 'focus' && !focusPath) {
    return (
      <div className="graph-space graph-space--empty" style={{ width, height }}>
        <FileIcon />
        <p>先选择一篇文档，再进入聚焦图谱。</p>
      </div>
    )
  }

  if (currentGraph.nodes.length === 0) {
    return (
      <div className="graph-space graph-space--empty" style={{ width, height }}>
        <SearchIcon />
        <p>当前筛选下没有可展示的节点。</p>
      </div>
    )
  }

  if (isHeroLayout) {
    return (
      <div className="graph-space graph-space--hero" style={{ width, height }}>
        <section className="graph-space__stage graph-space__stage--hero">
          <div className="graph-stage__overlay graph-stage__overlay--hero">
            <div className="graph-stage__hint">拖拽旋转，单击聚焦，双击打开证据</div>
            <div className="graph-stage__mode">Command Tree</div>
          </div>
          <ForceGraph3D
            ref={graphRef as never}
            width={Math.max(width, 320)}
            height={Math.max(height, 360)}
            graphData={currentGraph as never}
            nodeLabel={(node: object) => {
              const current = node as SpaceNode
              return current.path
                ? `${formatLabel(current.label)}\n${current.path}`
                : formatLabel(current.label)
            }}
            backgroundColor={GRAPH_BACKDROP}
            showNavInfo={false}
            linkColor={(link: object) => {
              const current = link as SpaceLink
              if (current.kind === 'tag') return 'rgba(245, 158, 11, 0.2)'
              if (current.kind === 'hierarchy') return 'rgba(52, 211, 153, 0.34)'
              return 'rgba(129, 140, 248, 0.28)'
            }}
            linkWidth={(link: object) => {
              const current = link as SpaceLink
              return current.kind === 'hierarchy' ? 1.8 : 1.2
            }}
            linkOpacity={0.7}
            linkDirectionalParticles={0}
            nodeAutoColorBy="kind"
            nodeThreeObject={(node: object) => createNodeObject(node as SpaceNode, selectedNodeId, hoveredNodeId, true)}
            nodeThreeObjectExtend={false}
            onNodeClick={(node: object) => handleNodeInteraction(node as SpaceNode & { x?: number; y?: number; z?: number })}
            onNodeHover={(node: object | null) => {
              const current = node as SpaceNode | null
              setHoveredNodeId(current?.id || null)
              document.body.style.cursor = current ? 'pointer' : 'default'
            }}
            dagMode={mode === 'tree' ? 'zout' : undefined}
            dagLevelDistance={mode === 'tree' ? 112 : undefined}
            d3AlphaDecay={0.05}
            d3VelocityDecay={0.26}
            cooldownTicks={120}
          />
        </section>
      </div>
    )
  }

  return (
    <div
      className={[
        'graph-space',
        isDockLayout ? 'graph-space--dock' : 'graph-space--workspace',
        showTreePanel ? 'graph-space--tree-panel' : 'graph-space--no-tree',
      ].join(' ')}
      style={{ width, height }}
    >
      <div className="graph-space__topbar">
        <div>
          <div className="graph-space__eyebrow">
            {mode === 'focus' && 'Document Focus'}
            {mode === 'global' && 'Knowledge Galaxy'}
            {mode === 'tree' && 'Knowledge Tree'}
            {mode === 'orphan' && 'Orphan Radar'}
          </div>
          <h3 className="graph-space__title">
            {mode === 'focus' && '局部关系星图'}
            {mode === 'global' && '全局知识星图'}
            {mode === 'tree' && '树形知识架构'}
            {mode === 'orphan' && '孤岛知识雷达'}
          </h3>
        </div>

        <div className="graph-space__toolbar">
          <label className="graph-space__search" aria-label="筛选图谱节点">
            <SearchIcon />
            <input
              aria-label="筛选图谱节点"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="筛选路径 / 标签 / 文档名"
            />
          </label>

          <button
            className={`graph-chip${showTags ? ' active' : ''}`}
            onClick={() => setShowTags(value => !value)}
            type="button"
          >
            标签层
          </button>
          <button
            className={`graph-chip${autoRotate ? ' active' : ''}`}
            onClick={() => setAutoRotate(value => !value)}
            type="button"
          >
            自旋
          </button>
          {selectedBranch && (
            <button className="graph-chip" onClick={() => setSelectedBranch(null)} type="button">
              清除分支
            </button>
          )}
        </div>
      </div>

      <div className="graph-space__stats">
        <div className="graph-metric">
          <span>文档</span>
          <strong>{totals.notes}</strong>
        </div>
        <div className="graph-metric">
          <span>连接</span>
          <strong>{totals.links}</strong>
        </div>
        <div className="graph-metric">
          <span>标签</span>
          <strong>{totals.tags}</strong>
        </div>
        <div className="graph-metric">
          <span>孤立</span>
          <strong>{totals.orphans}</strong>
        </div>
        <div className="graph-legend">
          <span><i style={{ background: SPACE_COLORS.note }} />文档</span>
          <span><i style={{ background: SPACE_COLORS.branch }} />分支</span>
          <span><i style={{ background: SPACE_COLORS.tag }} />标签</span>
        </div>
      </div>

      <div className="graph-space__body">
        {showTreePanel && (
          <aside className="graph-space__tree">
            <div className="graph-panel__header">
              <FolderIcon />
              <span>知识树</span>
            </div>
            <div className="graph-tree">
              <button
                className={`graph-tree-root${selectedBranch === null ? ' active' : ''}`}
                onClick={() => setSelectedBranch(null)}
                type="button"
              >
                <span className="graph-tree-root__title">全库视图</span>
                <span className="graph-tree-count">{totals.notes}</span>
              </button>
              {renderTreeNodes(tree.rootChildren)}
              {tree.looseNotes.length > 0 && (
                <div className="graph-tree-node">
                  <div className="graph-tree-section">根文档</div>
                  {tree.looseNotes.map(note => (
                    <button
                      key={note.id}
                      className={`graph-tree-leaf${selectedNodeId === note.id ? ' active' : ''}`}
                      style={{ paddingLeft: '18px' }}
                      onClick={() => {
                        setSelectedNodeId(note.id)
                        onNavigate?.(note.path || note.id)
                      }}
                      title={note.path}
                      type="button"
                    >
                      <FileIcon />
                      <span className="graph-tree-label">{formatLabel(note.label)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        <section className="graph-space__stage">
          <div className="graph-stage__overlay">
            <div className="graph-stage__hint">
              拖拽旋转，滚轮缩放，单击聚焦，双击打开证据
            </div>
            <div className="graph-stage__mode">
              {mode === 'tree' ? '3D Tree' : mode === 'orphan' ? 'Islands' : 'Force Space'}
            </div>
          </div>
          <ForceGraph3D
            ref={graphRef as never}
            width={Math.max(width - (isDockLayout ? (showTreePanel ? 220 : 0) : 540), 320)}
            height={Math.max(height - (isDockLayout ? 116 : 140), 280)}
            graphData={currentGraph as never}
            nodeLabel={(node: object) => {
              const current = node as SpaceNode
              return current.path
                ? `${formatLabel(current.label)}\n${current.path}`
                : formatLabel(current.label)
            }}
            backgroundColor={GRAPH_BACKDROP}
            showNavInfo={false}
            linkColor={(link: object) => {
              const current = link as SpaceLink
              const source = normalizeEndpoint(current.source)
              const target = normalizeEndpoint(current.target)
              const highlighted = selectedNodeId && (
                source === selectedNodeId
                || target === selectedNodeId
                || selectedNeighbors.has(source)
                || selectedNeighbors.has(target)
              )
              if (current.kind === 'tag') return highlighted ? 'rgba(245, 158, 11, 0.85)' : 'rgba(245, 158, 11, 0.25)'
              if (current.kind === 'hierarchy') return highlighted ? 'rgba(52, 211, 153, 0.8)' : 'rgba(52, 211, 153, 0.28)'
              return highlighted ? 'rgba(129, 140, 248, 0.95)' : 'rgba(129, 140, 248, 0.22)'
            }}
            linkWidth={(link: object) => {
              const current = link as SpaceLink
              const source = normalizeEndpoint(current.source)
              const target = normalizeEndpoint(current.target)
              return selectedNodeId && (source === selectedNodeId || target === selectedNodeId)
                ? 3.2
                : current.kind === 'hierarchy'
                  ? 1.6
                  : 1.1
            }}
            linkOpacity={0.7}
            linkDirectionalParticles={(link: object) => {
              const current = link as SpaceLink
              const source = normalizeEndpoint(current.source)
              const target = normalizeEndpoint(current.target)
              return selectedNodeId && (source === selectedNodeId || target === selectedNodeId)
                ? 3
                : current.kind === 'hierarchy'
                  ? 1
                  : 0
            }}
            linkDirectionalParticleWidth={1.8}
            linkDirectionalParticleSpeed={0.0035}
            nodeAutoColorBy="kind"
            nodeThreeObject={(node: object) => createNodeObject(node as SpaceNode, selectedNodeId, hoveredNodeId)}
            nodeThreeObjectExtend={false}
            onNodeClick={(node: object) => handleNodeInteraction(node as SpaceNode & { x?: number; y?: number; z?: number })}
            onNodeHover={(node: object | null) => {
              const current = node as SpaceNode | null
              setHoveredNodeId(current?.id || null)
              document.body.style.cursor = current ? 'pointer' : 'default'
            }}
            dagMode={mode === 'tree' ? 'zout' : undefined}
            dagLevelDistance={mode === 'tree' ? 120 : undefined}
            d3AlphaDecay={mode === 'tree' ? 0.08 : 0.022}
            d3VelocityDecay={mode === 'tree' ? 0.3 : 0.24}
            cooldownTicks={mode === 'tree' ? 80 : 130}
          />

          {showFloatingInspector && (
            <div className="graph-stage__inspector-float">
              {renderInspectorContent()}
            </div>
          )}
        </section>

        {showInspectorPanel && (
          <aside className="graph-space__inspector">
            <div className="graph-panel__header">
              <LinkIcon />
              <span>交互面板</span>
            </div>
            {renderInspectorContent()}
          </aside>
        )}
      </div>
    </div>
  )
}
