import { Player } from './Player'
import { Chat } from './Chat'
import { api } from '../api'

interface Stream {
  id: string
  title: string
  status: string
  ingest_url: string | null
  stream_key: string | null
  user_id: string
}

interface Props {
  stream: Stream
  user: { id: string; email: string; role: string } | null
  onBack: () => void
  onRefresh: () => void
}

const sampleHls = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

export function WatchPage ({ stream, user, onBack, onRefresh }: Props): JSX.Element {
  const isOwner = user != null && user.id === stream.user_id
  const playbackUrl = stream.ingest_url != null
    ? stream.ingest_url.replace('rtmp://', 'http://').replace('/live', '/hls') + '/index.m3u8'
    : sampleHls

  const handleStart = async (): Promise<void> => {
    try {
      await api.post(`/streams/${stream.id}/start`)
      onRefresh()
    } catch { /* */ }
  }

  const handleStop = async (): Promise<void> => {
    try {
      await api.post(`/streams/${stream.id}/stop`)
      onRefresh()
    } catch { /* */ }
  }

  return (
    <div className="watch-layout">
      <div className="watch-main">
        <div className="watch-player">
          <Player src={playbackUrl} />
        </div>
        <div className="watch-info">
          <div className="watch-info-left">
            <div className="watch-avatar">{stream.title[0]}</div>
            <div className="watch-meta">
              <h1>{stream.title}</h1>
              <div className="watch-details">
                <span className={`status-badge ${stream.status}`}>
                  {stream.status === 'live' ? '🔴 LIVE' : 'Офлайн'}
                </span>
                <span className="watch-streamer">Streamer #{stream.user_id.slice(0, 8)}</span>
              </div>
            </div>
          </div>
          <div className="watch-actions">
            <button className="btn-icon" onClick={onBack} title="Назад">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            {isOwner && (
              <>
                {stream.status !== 'live' ? (
                  <button className="btn-go-live" onClick={() => { void handleStart() }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    Розпочати стрім
                  </button>
                ) : (
                  <button className="btn-stop" onClick={() => { void handleStop() }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>
                    Зупинити
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {isOwner && stream.ingest_url != null && (
          <div className="watch-ingest">
            <div className="ingest-row">
              <span className="ingest-label">RTMP URL</span>
              <code>{stream.ingest_url}</code>
            </div>
            <div className="ingest-row">
              <span className="ingest-label">Ключ стріму</span>
              <code>{stream.stream_key}</code>
            </div>
          </div>
        )}
      </div>
      <Chat streamId={stream.id} />
    </div>
  )
}
