// A heading split into lines in the markup itself, so the server render is final and the
// line-mask reveal never measures fonts or rewrites the DOM (the site enforces Trusted Types).
// Each line is a mask (`data-line`) holding the moving part (`data-line-inner`).

import type { ElementType } from 'react'

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
        <span key={i} data-line="" className={lineClassName} style={{ display: 'block', overflow: 'hidden' }}>
          <span data-line-inner="" style={{ display: 'block' }}>
            {line}
            {i < lines.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
