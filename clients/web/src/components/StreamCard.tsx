interface Stream {
  id: string
  title: string
  status: string
  user_id: string
  created_at?: string
}

interface Props {
  stream: Stream
  onWatch: (stream: Stream) => void
}

const COLORS = ['#9147ff', '#2563eb', '#e91916', '#00b894', '#e17055', '#6c5ce7', '#00cec9', '#fd79a8']

function hashColor (str: string): string {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return COLORS[Math.abs(h) % COLORS.length]
}

export function StreamCard ({ stream, onWatch }: Props): JSX.Element {
  const bg = hashColor(stream.id)
  const isLive = stream.status === 'live'

  return (
    <div className="stream-card" onClick={() => { onWatch(stream) }}>
      <div className="card-thumbnail" style={{ background: `linear-gradient(135deg, ${bg}33, ${bg}11)` }}>
        <div className="thumbnail-icon" style={{ color: bg }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        {isLive && (
          <div className="card-live-badge">
            <span className="live-pulse" />
            LIVE
          </div>
        )}
        <div className="card-viewers">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
          </svg>
          {isLive ? Math.floor(Math.random() * 500 + 10) : 0}
        </div>
      </div>
      <div className="card-body">
        <div className="card-avatar" style={{ background: bg }}>{stream.title[0]}</div>
        <div className="card-meta">
          <h3 className="card-title">{stream.title}</h3>
          <p className="card-channel">Streamer #{stream.user_id.slice(0, 6)}</p>
          <div className="card-tags">
            <span className={`tag ${isLive ? 'tag-live' : 'tag-offline'}`}>
              {isLive ? 'Наживо' : 'Офлайн'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
