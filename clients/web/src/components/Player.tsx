import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import type { ErrorData } from 'hls.js'

interface Props {
  src: string
}

export function Player ({ src }: Props): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video == null) return
    setError(false)

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
<<<<<<< HEAD
        xhrSetup: (xhr) => {
=======
        xhrSetup: (xhr: XMLHttpRequest) => {
>>>>>>> bcebf11 (refactor: unify stream ingest URL and key handling; add webhook routes for stream status updates)
          xhr.setRequestHeader('ngrok-skip-browser-warning', 'true')
        }
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.ERROR, (_e: unknown, data: ErrorData) => {
        if (data.fatal) {
          setError(true)
          hls.destroy()
        }
      })
      return () => { hls.destroy() }
    } else if (video.canPlayType('application/vnd.apple.mpegurl') !== '') {
      video.src = src
    } else {
      setError(true)
    }
  }, [src])

  if (error) {
    return (
      <div className="player-error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <p>Стрім офлайн або відео недоступне</p>
      </div>
    )
  }

  return <video ref={videoRef} controls playsInline className="player-video" />
}
