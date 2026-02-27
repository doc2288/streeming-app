interface Stream {
  id: string
  title: string
  status: string
  user_id: string
}

interface Props {
  streams: Stream[]
  open: boolean
  currentView: string
  onNavigate: (view: string) => void
  onSelectStream: (id: string) => void
}

export function Sidebar ({ streams, open, currentView, onNavigate, onSelectStream }: Props): JSX.Element {
  const liveStreams = streams.filter(s => s.status === 'live')

  return (
    <aside className={`sidebar ${open ? 'open' : 'collapsed'}`}>
      <div className="sidebar-nav">
        <button
          className={`sidebar-item ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => { onNavigate('home') }}
          title="Головна"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 00.7-1.7l-9-9a1 1 0 00-1.4 0l-9 9A1 1 0 003 13z" />
          </svg>
          {open && <span>Головна</span>}
        </button>
        <button
          className={`sidebar-item ${currentView === 'browse' ? 'active' : ''}`}
          onClick={() => { onNavigate('browse') }}
          title="Огляд"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.5 3v18l7-3 4 3 6-3V3l-6 3-4-3-7 3z" />
          </svg>
          {open && <span>Огляд</span>}
        </button>
      </div>

      {open && liveStreams.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-heading">LIVE КАНАЛИ</h3>
          {liveStreams.map((s) => (
            <button
              key={s.id}
              className="sidebar-channel"
              onClick={() => { onSelectStream(s.id) }}
            >
              <div className="channel-avatar">{s.title[0]}</div>
              <div className="channel-info">
                <span className="channel-name">{s.title}</span>
                <span className="channel-live">
                  <span className="live-dot" />
                  Live
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="sidebar-section">
          <h3 className="sidebar-heading">РЕКОМЕНДОВАНІ</h3>
          {streams.slice(0, 5).map((s) => (
            <button
              key={s.id}
              className="sidebar-channel"
              onClick={() => { onSelectStream(s.id) }}
            >
              <div className="channel-avatar">{s.title[0]}</div>
              {open && (
                <div className="channel-info">
                  <span className="channel-name">{s.title}</span>
                  <span className={`channel-status ${s.status}`}>
                    {s.status === 'live' ? <><span className="live-dot" /> Live</> : 'Offline'}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
