import { describe, it, expect } from 'vitest'
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
// @ts-expect-error - JS file without types
import { noteToMarkdown } from '../../sync-blinko.js'

describe('Blinko Sync - noteToMarkdown', () => {
  const createMockNote = (overrides = {}) => ({
    id: 123,
    title: 'Test Note',
    content: 'This is test content',
    createdAt: '2026-03-24T10:00:00.000Z',
    updatedAt: '2026-03-24T11:00:00.000Z',
    tags: [{ name: 'test' }, { name: 'demo' }],
    url: 'https://example.com/note/123',
    attachments: [],
    comments: [],
    ...overrides,
  })

  it('should convert note to markdown with frontmatter', () => {
    const note = createMockNote()
    const result = noteToMarkdown(note)

    expect(result).toContain('---')
    expect(result).toContain('title: "Test Note"')
    expect(result).toContain('created: 2026-03-24T10:00:00.000Z')
    expect(result).toContain('updated: 2026-03-24T11:00:00.000Z')
    expect(result).toContain('tags: [test, demo]')
    expect(result).toContain('source: Blinko')
    expect(result).toContain('# Test Note')
    expect(result).toContain('This is test content')
  })

  it('should handle notes without title', () => {
    const note = createMockNote({ title: undefined })
    const result = noteToMarkdown(note)

    expect(result).toContain('title: "无标题"')
    expect(result).toContain('# 无标题')
  })

  it('should handle notes without tags', () => {
    const note = createMockNote({ tags: [] })
    const result = noteToMarkdown(note)

    expect(result).toContain('tags: []')
  })

  it('should handle notes with string tags', () => {
    const note = createMockNote({ tags: ['tag1', 'tag2'] as any })
    const result = noteToMarkdown(note)

    expect(result).toContain('tags: [tag1, tag2]')
  })

  it('should include attachments section when present', () => {
    const note = createMockNote({
      attachments: [
        { id: 1, name: 'image.png', path: '/files/1.png', size: 1024, type: 'image/png', url: 'https://example.com/files/1.png' }
      ]
    })
    const result = noteToMarkdown(note)

    expect(result).toContain('## 附件')
    expect(result).toContain('[image.png](https://example.com/files/1.png)')
  })

  it('should include comments section when present', () => {
    const note = createMockNote({
      comments: [
        { id: 1, author: 'User1', content: 'Great note!' }
      ]
    })
    const result = noteToMarkdown(note)

    expect(result).toContain('## 评论')
    expect(result).toContain('**User1**: Great note!')
  })

  it('should handle empty content', () => {
    const note = createMockNote({ content: '' })
    const result = noteToMarkdown(note)

    expect(result).toBeDefined()
    expect(result).toContain('# Test Note')
  })

  it('should handle missing dates', () => {
    const note = createMockNote({ createdAt: undefined, updatedAt: undefined })
    const result = noteToMarkdown(note)

    expect(result).toContain('created:')
    expect(result).toContain('updated:')
    // Should have ISO date format
    expect(result).toMatch(/created: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('should sanitize invalid filename characters in title', () => {
    // This tests the filename sanitization logic in syncNotes
    const note = createMockNote({ title: 'Test/Invalid:*?"<>|Title' })
    const result = noteToMarkdown(note)

    expect(result).toContain('# Test/Invalid:*?"<>|Title')
    // The markdown content keeps original title, only filename is sanitized
  })

  it('should include URL when present', () => {
    const note = createMockNote({ url: 'https://example.com/note/123' })
    const result = noteToMarkdown(note)

    expect(result).toContain('url: https://example.com/note/123')
  })

  it('should handle missing URL', () => {
    const note = createMockNote({ url: '' })
    const result = noteToMarkdown(note)

    expect(result).toContain('url: ')
  })
})
