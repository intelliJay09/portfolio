// The arrow that ends a link: → goes somewhere on this site, ↗ opens another. It is joined to the
// word before it by a no-break space, so it never wraps onto a line alone, and it leans the way it
// points when its link is pointed at or focused (theme.module.css, [data-arrow]).

export default function Arrow({ out = false }: { out?: boolean }) {
  return <span aria-hidden="true" data-arrow={out ? 'out' : 'on'}>{'\u00a0'}{out ? '↗' : '→'}</span>
}
