// A heading split into lines in the markup itself, so the server render is final and the
// line-mask reveal never measures fonts or rewrites the DOM (the site enforces Trusted Types).
// Each line is a mask (`data-line`) holding the moving part (`data-line-inner`).
// The mask reaches a little below the line and gives the space back, so letters that hang below
// it (g, p, y) aren't cut off at a tight line height, and the lines keep their spacing.

import type { CSSProperties, ElementType } from 'react'

export const LINE_MASK: CSSProperties = { display: 'block', overflow: 'hidden', paddingBottom: '0.14em', marginBottom: '-0.14em' }
export const LINE_INNER: CSSProperties = { display: 'block' }

export default function Lines({
  as: Tag = 'h2',
  lines,
  className,
  lineClassName,
  id,
}: {
  as?: ElementType
  lines: string[]
  className?: string
  lineClassName?: string
  id?: string
}) {
  return (
    <Tag id={id} className={className} data-lines="">
      {lines.map((line, i) => (
        <span key={i} data-line="" className={lineClassName} style={LINE_MASK}>
          <span data-line-inner="" style={LINE_INNER}>
            {line}
            {i < lines.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
