import { StreamCard } from './StreamCard'
import { useI18n } from '../i18n'

<<<<<<< HEAD
<<<<<<< HEAD
interface Stream {
  id: string
  title: string
  status: string
  ingest_url: string | null
  user_id: string
  created_at?: string
}

interface Props {
  streams: Stream[]
  onWatch: (stream: Stream) => void
  searchQuery: string
}
=======
interface Stream { id: string; title: string; status: string; ingest_url: string | null; stream_key: string | null; user_id: string; category?: string }
interface Props { streams: Stream[]; onWatch: (stream: Stream) => void; searchQuery: string }
>>>>>>> 161fe02 (feat: i18n (UA/EN/RU), improved stream creation, Dashboard for stream keys)
=======
interface Stream { id: string; title: string; status: string; ingest_url: string | null; stream_key: string | null; user_id: string; category?: string; tags?: string[] }
interface Props { streams: Stream[]; onWatch: (stream: Stream) => void; searchQuery: string; categoryFilter?: string | null }
>>>>>>> 8852efb (fix: sidebar categories, tags/hashtags, chat auth + Twitch-style design)

export function StreamGrid ({ streams, onWatch, searchQuery, categoryFilter }: Props): JSX.Element {
  const { t } = useI18n()
  let filtered = searchQuery.length > 0 ? streams.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())) : streams
  if (categoryFilter != null) filtered = filtered.filter(s => (s.category ?? 'other') === categoryFilter)
  const live = filtered.filter(s => s.status === 'live')
  const offline = filtered.filter(s => s.status !== 'live')

  return (
    <div className="stream-grid-page">
      {searchQuery.length > 0 && <div className="search-results-header"><h2>{t('searchResults')}: &ldquo;{searchQuery}&rdquo;</h2><span className="result-count">{filtered.length} {t('streams_count')}</span></div>}
      {live.length > 0 && (
        <section className="grid-section">
          <div className="section-header"><h2><span className="section-live-dot" />{t('liveNow')}</h2><span className="section-count">{live.length} {t('streams_count')}</span></div>
          <div className="stream-grid">{live.map(s => <StreamCard key={s.id} stream={s} onWatch={onWatch} />)}</div>
        </section>
      )}
      <section className="grid-section">
        <div className="section-header"><h2>{searchQuery.length > 0 ? t('allStreams') : t('recommendedChannels')}</h2>{offline.length > 0 && <span className="section-count">{offline.length} {t('channels_count')}</span>}</div>
        {[...live, ...offline].length === 0 ? (
          <div className="empty-state"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg><h3>{t('noStreams')}</h3><p>{t('createFirst')}</p></div>
        ) : (
          <div className="stream-grid">{offline.map(s => <StreamCard key={s.id} stream={s} onWatch={onWatch} />)}</div>
        )}
      </section>
    </div>
  )
}
