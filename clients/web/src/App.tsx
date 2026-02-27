import { useEffect, useState, useCallback } from 'react'
import { api, setAuthToken, setRefreshToken, clearAuth, getStoredToken } from './api'
import { Player } from './components/Player'
import { Chat } from './components/Chat'

interface Stream {
  id: string
  title: string
  status: string
  ingest_url: string | null
  stream_key: string | null
  user_id: string
  created_at: string
}

interface UserInfo {
  id: string
  email: string
  role: string
}

const sampleHls = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

export default function App (): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<UserInfo | null>(null)
  const [streams, setStreams] = useState<Stream[]>([])
  const [title, setTitle] = useState('')
  const [selected, setSelected] = useState<Stream | null>(null)
  const [status, setStatus] = useState<{ text: string, type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)
  const [streamLoading, setStreamLoading] = useState(false)

  const fetchStreams = useCallback(async () => {
    try {
      const res = await api.get('/streams')
      setStreams(res.data.streams)
    } catch {
      // silent on stream fetch
    }
  }, [])

  const restoreSession = useCallback(async () => {
    const token = getStoredToken()
    if (token == null) return
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user)
    } catch {
      clearAuth()
    }
  }, [])

  useEffect(() => {
    void restoreSession()
    void fetchStreams()
    const interval = setInterval(() => { void fetchStreams() }, 15000)
    return () => { clearInterval(interval) }
  }, [fetchStreams, restoreSession])

  const handleAuth = async (path: 'login' | 'register'): Promise<void> => {
    if (email.trim().length === 0 || password.length < 8) {
      setStatus({ text: 'Email та пароль (мін. 8 символів) обов\'язкові', type: 'error' })
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      const res = await api.post(`/auth/${path}`, { email: email.trim(), password })
      const { accessToken, refreshToken, user: u } = res.data
      setAuthToken(accessToken)
      setRefreshToken(refreshToken)
      setUser({ id: u.id, email: u.email, role: u.role })
      setStatus({ text: path === 'login' ? 'Успішний вхід!' : 'Реєстрація успішна!', type: 'success' })
      setPassword('')
      void fetchStreams()
    } catch (err: any) {
      const msg = err.response?.data?.error
      const text = typeof msg === 'string' ? msg : 'Помилка авторизації'
      setStatus({ text, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = (): void => {
    const refreshToken = localStorage.getItem('streeming_refresh_token')
    if (refreshToken != null) {
      void api.post('/auth/logout', { refreshToken }).catch(() => {})
    }
    clearAuth()
    setUser(null)
    setStatus(null)
    setSelected(null)
  }

  const handleCreateStream = async (): Promise<void> => {
    if (title.trim().length < 3) {
      setStatus({ text: 'Назва стріму мінімум 3 символи', type: 'error' })
      return
    }
    setStreamLoading(true)
    try {
      await api.post('/streams', { title: title.trim() })
      setTitle('')
      await fetchStreams()
      setStatus({ text: 'Стрім створено!', type: 'success' })
    } catch (err: any) {
      const msg = err.response?.data?.error
      setStatus({ text: typeof msg === 'string' ? msg : 'Не вдалось створити стрім', type: 'error' })
    } finally {
      setStreamLoading(false)
    }
  }

  const handleStart = async (id: string): Promise<void> => {
    try {
      await api.post(`/streams/${id}/start`)
      await fetchStreams()
    } catch {
      setStatus({ text: 'Не вдалось запустити стрім', type: 'error' })
    }
  }

  const handleStop = async (id: string): Promise<void> => {
    try {
      await api.post(`/streams/${id}/stop`)
      await fetchStreams()
    } catch {
      setStatus({ text: 'Не вдалось зупинити стрім', type: 'error' })
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await api.delete(`/streams/${id}`)
      if (selected?.id === id) setSelected(null)
      await fetchStreams()
    } catch {
      setStatus({ text: 'Не вдалось видалити стрім', type: 'error' })
    }
  }

  const playbackUrl = selected?.ingest_url != null
    ? selected.ingest_url.replace('rtmp://', 'http://').replace('/live', '/hls') + '/index.m3u8'
    : sampleHls

  const liveStreams = streams.filter(s => s.status === 'live')
  const offlineStreams = streams.filter(s => s.status !== 'live')

  return (
    <div className="layout">
      <header>
        <div className="header-content">
          <div>
            <h1>Streeming</h1>
            <p className="subtitle">Платформа стрімінгу ігор</p>
          </div>
          {user != null && (
            <div className="header-user">
              <span className="pill">{user.email}</span>
              <button className="btn-outline" onClick={handleLogout}>Вийти</button>
            </div>
          )}
        </div>
      </header>

      {status != null && (
        <div className={`toast ${status.type}`}>
          {status.text}
          <button className="toast-close" onClick={() => { setStatus(null) }}>×</button>
        </div>
      )}

      {user == null ? (
        <section className="auth">
          <h2>Вхід / Реєстрація</h2>
          <form onSubmit={(e) => { e.preventDefault(); void handleAuth('login') }}>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              autoComplete="email"
            />
            <input
              placeholder="Пароль (мін. 8 символів)"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              autoComplete="current-password"
            />
            <div className="row">
              <button type="submit" disabled={loading}>
                {loading ? 'Зачекайте…' : 'Увійти'}
              </button>
              <button type="button" className="btn-secondary" disabled={loading} onClick={() => { void handleAuth('register') }}>
                Зареєструватись
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="create-stream">
          <h2>Новий стрім</h2>
          <form onSubmit={(e) => { e.preventDefault(); void handleCreateStream() }}>
            <div className="row">
              <input
                placeholder="Назва стріму"
                value={title}
                onChange={(e) => { setTitle(e.target.value) }}
                maxLength={120}
              />
              <button type="submit" disabled={streamLoading}>
                {streamLoading ? '…' : 'Створити'}
              </button>
            </div>
          </form>
        </section>
      )}

      {selected != null && (
        <section className="player-section">
          <div className="player-header">
            <h2>{selected.title}</h2>
            <span className={`badge ${selected.status}`}>{selected.status}</span>
            <button className="btn-outline btn-small" onClick={() => { setSelected(null) }}>Закрити</button>
          </div>
          <Player src={playbackUrl} />
          <Chat streamId={selected.id} />
        </section>
      )}

      <section className="streams">
        <div className="row space-between">
          <h2>
            Стріми
            {liveStreams.length > 0 && <span className="live-count">{liveStreams.length} live</span>}
          </h2>
          <button className="btn-outline" onClick={() => { void fetchStreams() }}>Оновити</button>
        </div>

        {streams.length === 0 && (
          <p className="muted center">Поки немає стрімів. Створіть перший!</p>
        )}

        <div className="stream-list">
          {[...liveStreams, ...offlineStreams].map((s) => (
            <div key={s.id} className={`card ${selected?.id === s.id ? 'active' : ''} ${s.status === 'live' ? 'card-live' : ''}`}>
              <div className="card-top">
                <div className="card-info">
                  <strong>{s.title}</strong>
                  <span className={`badge ${s.status}`}>{s.status === 'live' ? '🔴 LIVE' : 'offline'}</span>
                </div>
                <div className="card-actions">
                  <button className="btn-small" onClick={() => { setSelected(s) }}>Дивитись</button>
                  {user != null && user.id === s.user_id && (
                    <>
                      {s.status !== 'live'
                        ? <button className="btn-small btn-success" onClick={() => { void handleStart(s.id) }}>Старт</button>
                        : <button className="btn-small btn-danger" onClick={() => { void handleStop(s.id) }}>Стоп</button>
                      }
                      <button className="btn-small btn-danger" onClick={() => { void handleDelete(s.id) }}>×</button>
                    </>
                  )}
                </div>
              </div>
              {s.ingest_url != null && user != null && user.id === s.user_id && (
                <div className="ingest">
                  <code>ingest: {s.ingest_url}</code>
                  <code>ключ: {s.stream_key}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
