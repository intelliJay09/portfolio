// Plays each video while a good part of it is on screen and pauses it when it leaves. Nothing
// starts before the page has loaded: the poster already fills the frame, so a recording in the
// first view never competes with the page's own first paint for the network (it is the heaviest
// file on the page). Never plays with reduced motion or Save-Data (the caller passes `still`).
// A video that has started playing is marked data-playing (Recording shows it from then on).
// Returns the cleanup.

export function playWhileSeen(videos: HTMLVideoElement[], still: boolean): () => void {
  if (still || !videos.length) return () => {}
  const seen = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const v = target as HTMLVideoElement
      if (isIntersecting) v.play().catch(() => {})
      else v.pause()
    })
  }, { threshold: 0.35 })
  const mark = (e: Event) => (e.target as HTMLVideoElement).setAttribute('data-playing', '')
  videos.forEach((v) => v.addEventListener('playing', mark, { once: true }))
  const start = () => videos.forEach((v) => seen.observe(v))
  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start, { once: true })
  return () => { window.removeEventListener('load', start); videos.forEach((v) => v.removeEventListener('playing', mark)); seen.disconnect() }
}
