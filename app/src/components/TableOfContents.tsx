import { useEffect, useState } from 'react'
import { TocHeading } from '../types'

interface TableOfContentsProps {
  content: string
  scrollContainerSelector?: string
  headingRootSelector?: string
  label?: string
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
      const id = normalizeHeadingId(text)
      headings.push({ level, text, id })
    }
  }
  return headings
}

function normalizeHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function getRenderedHeadingText(el: Element): string {
  const clone = el.cloneNode(true) as Element
  clone.querySelector('.heading-anchor')?.remove()
  return clone.textContent?.trim() || ''
}

export function TableOfContents({
  content,
  scrollContainerSelector = '.app-main',
  headingRootSelector = '.doc-body',
  label = '目录',
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    setHeadings(extractHeadings(content))
    setActiveId('')
  }, [content])

  useEffect(() => {
    const handleScroll = () => {
      const docBody = document.querySelector(headingRootSelector)
      if (!docBody) return

      const scrollContainer = document.querySelector(scrollContainerSelector)
      const activationTop = scrollContainer instanceof HTMLElement
        ? scrollContainer.getBoundingClientRect().top + 32
        : 120
      const allHeadings = docBody.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let current = ''

      allHeadings.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top <= activationTop) {
          current = normalizeHeadingId(getRenderedHeadingText(el))
        }
      })
      setActiveId(current)
    }

    const scrollContainer = document.querySelector(scrollContainerSelector)
    handleScroll()
    scrollContainer?.addEventListener('scroll', handleScroll)
    return () => scrollContainer?.removeEventListener('scroll', handleScroll)
  }, [headingRootSelector, headings, scrollContainerSelector])

  const scrollToHeading = (heading: TocHeading) => {
    const docBody = document.querySelector(headingRootSelector)
    if (!docBody) return

    const allHeadings = docBody.querySelectorAll('h1, h2, h3, h4, h5, h6')
    for (const el of allHeadings) {
      if (getRenderedHeadingText(el) === heading.text) {
        const scrollContainer = document.querySelector(scrollContainerSelector)
        if (scrollContainer instanceof HTMLElement) {
          const containerTop = scrollContainer.getBoundingClientRect().top
          const headingTop = el.getBoundingClientRect().top
          scrollContainer.scrollTo({
            top: scrollContainer.scrollTop + headingTop - containerTop - 24,
            behavior: 'smooth',
          })
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        setActiveId(heading.id)
        break
      }
    }
  }

  if (headings.length < 2) return null

  return (
    <>
      <div className="toc-header">{label}</div>
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
