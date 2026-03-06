import { useI18n } from '../i18n'

interface Stream { id: string; title: string; status: string; user_id: string }

interface Props {
  streams: Stream[]
  open: boolean
  currentView: string
  onNavigate: (view: string) => void
  onSelectStream: (id: string) => void
  isLoggedIn: boolean
}

export function Sidebar ({ streams, open, currentView, onNavigate, onSelectStream, isLoggedIn }: Props): JSX.Element {
  const { t } = useI18n()
  const liveStreams = streams.filter(s => s.status === 'live')
  const offlineStreams = streams.filter(s => s.status !== 'live')

  return (
    <aside className={`sidebar ${open ? 'open' : 'collapsed'}`}>
      <div className="sidebar-nav">
        <button className={`sidebar-item ${currentView === 'home' ? 'active' : ''}`} onClick={() => { onNavigate('home') }} title={t('home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 00.7-1.7l-9-9a1 1 0 00-1.4 0l-9 9A1 1 0 003 13z" /></svg>
          {open && <span>{t('home')}</span>}
        </button>
        <button className={`sidebar-item ${currentView === 'browse' ? 'active' : ''}`} onClick={() => { onNavigate('browse') }} title={t('browse')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 3v18l7-3 4 3 6-3V3l-6 3-4-3-7 3z" /></svg>
          {open && <span>{t('browse')}</span>}
        </button>
        {isLoggedIn && (
          <button className={`sidebar-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => { onNavigate('dashboard') }} title={t('dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm0 8h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1zm10 0h6a1 1 0 001-1v-8a1 1 0 00-1-1h-6a1 1 0 00-1 1v8a1 1 0 001 1zm0-18v4a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1h-6a1 1 0 00-1 1z" /></svg>
            {open && <span>{t('dashboard')}</span>}
          </button>
        )}
      </div>

      {liveStreams.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-heading">{open ? t('liveChannels') : ''}</h3>
          {liveStreams.map(s => (
            <button key={s.id} className="sidebar-channel" onClick={() => { onSelectStream(s.id) }} title={s.title}>
              <div className="channel-avatar live-ring">{s.title[0]}</div>
              {open && <div className="channel-info"><span className="channel-name">{s.title}</span><span className="channel-live-label"><span className="live-dot" /> Live</span></div>}
            </button>
          ))}
        </div>
      )}

      {open && offlineStreams.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-heading">{t('recommended')}</h3>
          {offlineStreams.slice(0, 5).map(s => (
            <button key={s.id} className="sidebar-channel" onClick={() => { onSelectStream(s.id) }} title={s.title}>
              <div className="channel-avatar">{s.title[0]}</div>
              <div className="channel-info"><span className="channel-name">{s.title}</span><span className="channel-offline-label">{t('offline')}</span></div>
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
