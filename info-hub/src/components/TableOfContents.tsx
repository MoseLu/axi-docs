import { useEffect, useState } from 'react'
import { TocHeading } from '../types'

interface TableOfContentsProps {
  content: string
}

function extractHeadings(markdown: string): TocHeading[] {
  const lines = markdown.split('\n')
  const headings: TocHeading[] = []
  let inCodeBlock = false

  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length as TocHeading['level']
      const text = match[2].replace(/\*\*|__|\*|_|`/g, '').trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      headings.push({ level, text, id })
    }
  }
  return headings
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    setHeadings(extractHeadings(content))
    setActiveId('')
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const docBody = document.querySelector('.doc-body')
      if (!docBody) return

      const allHeadings = docBody.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let current = ''

      allHeadings.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 120) {
          current = el.textContent?.toLowerCase().replace(/[^\w\u4e00-\u9fa5\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() || ''
        }
      })
      setActiveId(current)
    }

    const docBody = document.querySelector('.app-main')
    docBody?.addEventListener('scroll', handleScroll)
    return () => docBody?.removeEventListener('scroll', handleScroll)
  }, [headings])

  const scrollToHeading = (heading: TocHeading) => {
    const docBody = document.querySelector('.doc-body')
    if (!docBody) return

    const allHeadings = docBody.querySelectorAll('h1, h2, h3, h4, h5, h6')
    for (const el of allHeadings) {
      if (el.textContent?.trim() === heading.text) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setActiveId(heading.id)
        break
      }
    }
  }

  if (headings.length < 2) return null

  return (
    <>
      <div className="toc-header">目录</div>
      <nav className="toc-nav">
        {headings.map((h, i) => (
          <button
            key={i}
            className={`toc-item toc-level-${h.level} ${activeId === h.id ? 'active' : ''}`}
            onClick={() => scrollToHeading(h)}
            title={h.text}
          >
            {h.text}
          </button>
        ))}
      </nav>
    </>
  )
}
