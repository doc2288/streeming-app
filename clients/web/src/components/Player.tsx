import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface Props {
  src: string
}

export function Player ({ src }: Props): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video == null) return
    setError(null)

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError('Помилка програвання відео')
          hls.destroy()
        }
      })
      return () => { hls.destroy() }
    } else if (video.canPlayType('application/vnd.apple.mpegurl') !== '') {
      video.src = src
    } else {
      setError('HLS не підтримується у цьому браузері')
    }
  }, [src])

  return (
    <div className="player-wrapper">
      {error != null
        ? <div className="player-error">{error}</div>
        : <video ref={videoRef} controls playsInline />
      }
    </div>
  )
}
