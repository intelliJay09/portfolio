// A chapter mark: the number and title of a section on the left, the role it proves on the right.
// It is a label, not a heading to look at; each section's big type is its own content. The h2 is
// still the section's real heading for the outline and for screen readers.

import s from './chapter.module.css'

export default function Chapter({
  n,
  title,
  titleId,
  role,
  pickFor,
  className,
}: {
  n: string
  title: string
  titleId: string
  role: string
  /** the role number the visitor can pick in "What I do"; the section then says "Your pick" */
  pickFor: number
  className?: string
}) {
  return (
    <header className={`${s.chapter} ${className ?? ''}`}>
      <h2 id={titleId} className={s.title}><span className={s.n}>{n}</span>{title}</h2>
      <p className={s.role}>
        {role}
        <span className={s.pick} data-pick-for={pickFor} hidden> · Your pick</span>
      </p>
    </header>
  )
}
