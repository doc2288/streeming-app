import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface Props {
  src: string
}

export function Player({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    } else {
      video.src = src
    }
  }, [src])

  return <video ref={videoRef} controls style={{ width: '100%', maxHeight: 360 }} />
}
