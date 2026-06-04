import { describe, expect, it } from 'vitest'
import {
  buildBrowserPathFromLegacyHashRoute,
  buildCategoryRoute,
  buildDocumentRoute,
  buildSearchRoute,
  normalizeRouterBasename,
} from './routes'

function locationLike(pathname: string, search = '', hash = ''): Pick<Location, 'hash' | 'pathname' | 'search'> {
  return { hash, pathname, search }
}

describe('route helpers', () => {
  it('builds application routes without hash fragments', () => {
    expect(buildSearchRoute('axi', 'workspace')).toBe('/search?keyword=axi&source=workspace')
    expect(buildCategoryRoute('guide')).toBe('/nodes/guide')
    expect(buildDocumentRoute({ sourceId: 'workspace', path: 'projects/axi-docs.md' })).toMatch(/^\/doc\//u)
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
    )).toBe('/search?keyword=axi')
    expect(buildBrowserPathFromLegacyHashRoute(
      locationLike('/docs/', '', '#/search?keyword=axi'),
      '/docs/',
    )).toBe('/docs/search?keyword=axi')
  })

  it('keeps normal document anchors untouched', () => {
    expect(buildBrowserPathFromLegacyHashRoute(
      locationLike('/doc/abc', '', '#section-title'),
    )).toBeNull()
  })
})
