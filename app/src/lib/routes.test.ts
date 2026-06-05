import { describe, expect, it } from 'vitest'
import {
  buildBrowserPathFromLegacyHashRoute,
  buildCategoryRoute,
  buildDocumentRoute,
  buildSearchRoute,
  decodeDocumentRoute,
  normalizeRouterBasename,
} from './routes'

function locationLike(pathname: string, search = '', hash = ''): Pick<Location, 'hash' | 'pathname' | 'search'> {
  return { hash, pathname, search }
}

describe('route helpers', () => {
  it('builds application routes without hash fragments', () => {
    expect(buildSearchRoute('axi', 'workspace')).toBe('/zh/guide/search?q=axi&source=workspace')
    expect(buildCategoryRoute('guide')).toBe('/nodes/guide')
    expect(buildDocumentRoute({ sourceId: 'workspace', path: 'projects/axi-docs.md' })).toBe('/docs/workspace/projects/axi-docs')
  })

  it('round trips readable document routes', () => {
    const route = buildDocumentRoute({ sourceId: 'workspace', path: 'projects/快速开始.md' })
    expect(route).toBe('/docs/workspace/projects/%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B')

    expect(decodeDocumentRoute('workspace', 'projects/%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B')).toEqual({
      sourceId: 'workspace',
      path: 'projects/快速开始.md',
    })
  })

  it('normalizes router basenames for browser history routing', () => {
    expect(normalizeRouterBasename('/')).toBeUndefined()
    expect(normalizeRouterBasename('./')).toBeUndefined()
    expect(normalizeRouterBasename('/docs/')).toBe('/docs')
    expect(normalizeRouterBasename('https://example.com/docs/')).toBe('/docs')
  })

  it('upgrades legacy hash routes to browser paths', () => {
    expect(buildBrowserPathFromLegacyHashRoute(
      locationLike('/', '', '#/'),
    )).toBe('/')
    expect(buildBrowserPathFromLegacyHashRoute(
      locationLike('/', '', '#/search?keyword=axi'),
    )).toBe('/zh/guide/search?q=axi')
    expect(buildBrowserPathFromLegacyHashRoute(
      locationLike('/docs/', '', '#/search?keyword=axi'),
      '/docs/',
    )).toBe('/docs/zh/guide/search?q=axi')
  })

  it('keeps normal document anchors untouched', () => {
    expect(buildBrowserPathFromLegacyHashRoute(
      locationLike('/doc/abc', '', '#section-title'),
    )).toBeNull()
  })
})
