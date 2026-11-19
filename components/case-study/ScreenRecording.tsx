'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import type { Recording } from '../../lib/case-studies'

type Frame = 'laptop' | 'phone'

// A muted, looping screen recording that plays only while it is on screen. The
// poster is the server-rendered state, so with no JavaScript, reduced motion or
// Save-Data nothing is missing and nothing moves. The file is not requested
// until the recording is within one screen of the viewport.
export default function ScreenRecording({ recording, frame }: { recording: Recording; frame: Frame }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [src, setSrc] = useState<string | undefined>(undefined)
  const [playing, setPlaying] = useState(false)
  const [allowed, setAllowed] = useState(false)
  // A viewer who pauses a recording keeps it paused when it scrolls back in
  const pausedByViewer = useRef(false)
  const inView = useRef(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    if (reduce || saveData) return
    setAllowed(true)

    const wrap = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return

    const loader = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSrc(recording.mp4)
          loader.disconnect()
        }
      },
      { rootMargin: '100% 0px' }
    )
    const player = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
        if (entry.isIntersecting) {
          if (!pausedByViewer.current) video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { threshold: 0.35 }
    )
    loader.observe(wrap)
    player.observe(wrap)
    return () => {
      loader.disconnect()
      player.disconnect()
    }
  }, [recording.mp4])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      pausedByViewer.current = false
      video.play().catch(() => undefined)
    } else {
      pausedByViewer.current = true
      video.pause()
    }
  }

  const screen = (
    <video
      ref={videoRef}
      src={src}
      poster={recording.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={recording.label}
      // The file may arrive after the recording is already in view
      onCanPlay={(e) => {
        if (inView.current && !pausedByViewer.current) e.currentTarget.play().catch(() => undefined)
      }}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      className="block h-full w-full object-cover object-top"
    />
  )

  return (
    <div ref={wrapRef} className="group relative">
      {frame === 'laptop' ? (
        <div>
          <div className="rounded-t-[1.1rem] bg-[#1b1b1d] p-[1.6%] pb-[1.3%] shadow-[0_2.5rem_5rem_-1.5rem_rgba(0,0,0,0.35)]">
            <div className="overflow-hidden rounded-[0.35rem]" style={{ aspectRatio: `${recording.width} / ${recording.height}` }}>
              {screen}
            </div>
          </div>
          <div className="mx-auto h-[0.9rem] w-[112%] -translate-x-[5.35%] rounded-b-[1.4rem] bg-gradient-to-b from-[#d9d9db] to-[#a9a9ad]">
            <div className="mx-auto h-[0.35rem] w-[16%] rounded-b-md bg-[#8f8f93]" />
          </div>
        </div>
      ) : (
        <div className="rounded-[2.6rem] bg-[#1b1b1d] p-[3.2%] shadow-[0_2.5rem_5rem_-1.5rem_rgba(0,0,0,0.35)]">
          <div className="relative overflow-hidden rounded-[2rem]" style={{ aspectRatio: `${recording.width} / ${recording.height}` }}>
            {screen}
            <span aria-hidden="true" className="absolute left-1/2 top-[2.2%] h-[1.1%] w-[3.4%] -translate-x-1/2 rounded-full bg-[#1b1b1d]" />
          </div>
        </div>
      )}

      {allowed && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause the ${recording.label}` : `Play the ${recording.label}`}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
        >
          {playing ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}
