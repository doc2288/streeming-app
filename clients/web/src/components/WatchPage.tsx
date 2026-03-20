import { useEffect, useState } from 'react'
import { Player } from './Player'
import { Chat } from './Chat'
import { api } from '../api'
import { useI18n, getCategoryKey, type Category } from '../i18n'
import { getMediaServerUrl } from '../config/env'

interface StreamSettings {
  max_quality: string
  delay_seconds: number
  mature_content: boolean
  chat_followers_only: boolean
  chat_slow_mode: number
}
interface Stream {
  id: string
  title: string
  description?: string
  category?: string
  settings?: StreamSettings
  status: string
  ingest_url: string | null
  stream_key: string | null
  user_id: string
}
interface Props {
  stream: Stream
  user: { id: string, email: string, role: string } | null
  onBack: () => void
  onRefresh: () => void
  onDelete: (id: string) => void
}

const mediaServerUrl = getMediaServerUrl()
const FOLLOWED_CHANNELS_KEY = 'streeming_followed_channels'

export function WatchPage ({ stream, user, onBack, onRefresh, onDelete }: Props): JSX.Element {
  const { t } = useI18n()
  const isOwner = user != null && user.id === stream.user_id
  const [followed, setFollowed] = useState(false)
  const [selectedQuality, setSelectedQuality] = useState('auto')
  const [showQuality, setShowQuality] = useState(false)
  const playbackUrl = `${mediaServerUrl}/hls/${stream.id}/index.m3u8`
  const maxQ = stream.settings?.max_quality ?? '1080p'
  const allQualities = ['source', '1080p', '720p', '480p', '360p']
  const maxIdx = allQualities.indexOf(maxQ)
  const availableQualities = ['auto', ...allQualities.slice(maxIdx === -1 ? 0 : maxIdx)]
  const delaySeconds = stream.settings?.delay_seconds ?? 0
  const cat = stream.category as Category | undefined
  const defaultObsServer = 'rtmp://localhost/live'
  const obsServer = (stream.ingest_url?.endsWith(`/${stream.id}`) === true)
    ? stream.ingest_url.slice(0, -(`/${stream.id}`).length)
    : defaultObsServer

  const handleStart = async (): Promise<void> => { try { await api.post(`/streams/${stream.id}/start`); onRefresh() } catch {} }
  const handleStop = async (): Promise<void> => { try { await api.post(`/streams/${stream.id}/stop`); onRefresh() } catch {} }
  const handleDelete = async (): Promise<void> => {
    if (!confirm('Видалити цей стрім?')) return
    try { await api.delete(`/streams/${stream.id}`); onDelete(stream.id) } catch {}
  }
  const copyToClipboard = (text: string | null): void => {
    if (text != null) void navigator.clipboard.writeText(text)
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FOLLOWED_CHANNELS_KEY)
      const ids = raw != null ? JSON.parse(raw) as string[] : []
      setFollowed(ids.includes(stream.user_id))
    } catch {
      setFollowed(false)
    }
  }, [stream.user_id])

  const toggleFollow = (): void => {
    const next = !followed
    setFollowed(next)
    try {
      const raw = localStorage.getItem(FOLLOWED_CHANNELS_KEY)
      const ids = new Set<string>(raw != null ? JSON.parse(raw) as string[] : [])
      if (next) ids.add(stream.user_id)
      else ids.delete(stream.user_id)
      localStorage.setItem(FOLLOWED_CHANNELS_KEY, JSON.stringify(Array.from(ids)))
    } catch {}
  }

  return (
    <div className="watch-layout">
      <div className="watch-main">
        <div className="watch-player"><Player src={playbackUrl} /></div>
        <div className="watch-info">
          <div className="watch-info-left">
            <div className="watch-avatar">{stream.title[0]}</div>
            <div className="watch-meta">
              <h1>{stream.title}</h1>
              <div className="watch-details">
                <span className={`status-badge ${stream.status}`}>{stream.status === 'live' ? '🔴 LIVE' : t('offline')}</span>
                <span className="watch-streamer">Streamer #{stream.user_id.slice(0, 8)}</span>
                {cat != null && cat !== 'other' && <span className="dash-tag">{t(getCategoryKey(cat))}</span>}
              </div>
              {delaySeconds > 0 && <span className="watch-delay-badge">⏱ {delaySeconds}s {t('delay')}</span>}
              {stream.settings?.mature_content === true && <span className="watch-mature-badge">18+</span>}
              {stream.description != null && stream.description.length > 0 && <p className="watch-desc">{stream.description}</p>}
            </div>
          </div>
          <div className="watch-actions">
            <div className="quality-picker" style={{ position: 'relative' }}>
              <button className="btn-icon" onClick={() => { setShowQuality(!showQuality) }} title={t('viewers_quality')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
              </button>
              {showQuality && (
                <div className="quality-dropdown">
                  <div className="quality-title">{t('viewers_quality')}</div>
                  {availableQualities.map(q => (
                    <button key={q} className={`quality-option ${selectedQuality === q ? 'active' : ''}`} onClick={() => { setSelectedQuality(q); setShowQuality(false) }}>
                      {q === 'auto' ? `${t('auto')} ✨` : q === 'source' ? t('source') : q}
                      {selectedQuality === q && ' ✓'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!isOwner && user != null && (
              <button className={`btn-follow ${followed ? 'following' : ''}`} onClick={toggleFollow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={followed ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 000-7.8z" /></svg>
                {followed ? t('following') : t('follow')}
              </button>
            )}
            {isOwner && (
              <>
                {stream.status !== 'live'
                  ? <button className="btn-go-live" onClick={() => { void handleStart() }}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>{t('goLive')}</button>
                  : <button className="btn-stop" onClick={() => { void handleStop() }}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>{t('stopStream')}</button>
                }
                <button className="btn-icon btn-danger-icon" onClick={() => { void handleDelete() }} title="Видалити стрім">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                </button>
              </>
            )}
            <button className="btn-icon" onClick={onBack} title={t('back')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
          </div>
        </div>

        {isOwner && stream.ingest_url != null && (
          <div className="watch-ingest">
            <div className="ingest-row">
              <span className="ingest-label">Server</span>
              <code>{obsServer}</code>
              <button className="btn-copy" onClick={() => { copyToClipboard(obsServer) }} title="Копіювати">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
            </div>
            <div className="ingest-row">
              <span className="ingest-label">Stream Key</span>
              <code>{stream.stream_key ?? '—'}</code>
              <button className="btn-copy" onClick={() => { copyToClipboard(stream.stream_key ?? null) }} title="Копіювати">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      <Chat streamId={stream.id} ownerUserId={stream.user_id} />
    </div>
  )
}
