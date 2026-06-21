import { useI18n, CATEGORIES, getCategoryKey, type Category } from '../i18n'

interface Stream { id: string, title: string, status: string, user_id: string, category?: string }

const CAT_ICONS: Record<string, string> = {
  gaming: '🎮',
  irl: '📷',
  music: '🎵',
  esports: '🏆',
  creative: '🎨',
  education: '📚',
  talkshow: '🎙️',
  other: '📺'
}

interface Props {
  streams: Stream[]
  open: boolean
  currentView: string
  onNavigate: (view: string) => void
  onSelectStream: (id: string) => void
  onFilterCategory: (cat: string | null) => void
  activeCategory: string | null
}

export function Sidebar ({ streams, open, currentView, onNavigate, onSelectStream, onFilterCategory, activeCategory }: Props): JSX.Element {
  const { t } = useI18n()
  const liveStreams = streams.filter(s => s.status === 'live')
  const offlineStreams = streams.filter(s => s.status !== 'live')

  return (
    <aside className={`sidebar ${open ? 'open' : 'collapsed'}`}>
      <div className="sidebar-nav">
        <button className={`sidebar-item ${currentView === 'home' && activeCategory == null ? 'active' : ''}`} onClick={() => { onNavigate('home'); onFilterCategory(null) }} title={t('home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1a1 1 0 00.7-1.7l-9-9a1 1 0 00-1.4 0l-9 9A1 1 0 003 13z" /></svg>
          {open && <span>{t('home')}</span>}
        </button>
        <button className={`sidebar-item ${currentView === 'browse' ? 'active' : ''}`} onClick={() => { onNavigate('browse'); onFilterCategory(null) }} title={t('browse')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 3v18l7-3 4 3 6-3V3l-6 3-4-3-7 3z" /></svg>
          {open && <span>{t('browse')}</span>}
        </button>
      </div>

      {open && (
        <div className="sidebar-section">
          <h3 className="sidebar-heading">{t('streamCategory')}</h3>
          {CATEGORIES.filter(c => c !== 'other').map(c => {
            const count = streams.filter(s => (s.category ?? 'other') === c).length
            return (
              <button
                key={c}
                className={`sidebar-cat ${activeCategory === c ? 'active' : ''}`}
                onClick={() => { onFilterCategory(activeCategory === c ? null : c); onNavigate('home') }}
                title={t(getCategoryKey(c as Category))}
              >
                <span className="sidebar-cat-icon">{CAT_ICONS[c]}</span>
                <span className="sidebar-cat-name">{t(getCategoryKey(c as Category))}</span>
                {count > 0 && <span className="sidebar-cat-count">{count}</span>}
              </button>
            )
          })}
        </div>
      )}

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
