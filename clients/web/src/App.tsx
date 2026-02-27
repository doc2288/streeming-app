import { useEffect, useState } from 'react'
import { api, setAuthToken } from './api'
import { Player } from './components/Player'
import { Chat } from './components/Chat'

interface Stream {
  id: string
  title: string
  status: string
  ingest_url: string | null
  stream_key: string | null
  user_id: string
}

const sampleHls = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<{ id: string, email: string, role: string } | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [streams, setStreams] = useState<Stream[]>([])
  const [title, setTitle] = useState('')
  const [selected, setSelected] = useState<Stream | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const fetchStreams = async (): Promise<void> => {
    const res = await api.get('/streams')
    setStreams(res.data.streams)
  }

  useEffect(() => {
    void fetchStreams()
  }, [])

  const handleAuth = async (path: 'login' | 'register'): Promise<void> => {
    setStatus(null)
    const res = await api.post(`/auth/${path}`, { email, password })
    const { accessToken: at, user: u } = res.data
    setAuthToken(at)
    setAccessToken(at)
    setUser({ id: u.id, email: u.email, role: u.role })
    setStatus('Успішно')
  }

  const handleCreateStream = async (): Promise<void> => {
    if (!title.trim()) return
    await api.post('/streams', { title })
    setTitle('')
    await fetchStreams()
  }

  const handleStart = async (id: string): Promise<void> => {
    await api.post(`/streams/${id}/start`)
    await fetchStreams()
  }

  const handleStop = async (id: string): Promise<void> => {
    await api.post(`/streams/${id}/stop`)
    await fetchStreams()
  }

  const playbackUrl = selected?.ingest_url
    ? selected.ingest_url.replace('rtmp://', 'http://').replace('/live', '/hls') + '/index.m3u8'
    : sampleHls

  return (
    <div className="layout">
      <header>
        <h1>Streeming App</h1>
        <p>Auth + стріми + чат</p>
      </header>

      <section className="auth">
        <h2>Логін / Реєстрація</h2>
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="row">
          <button onClick={() => { void handleAuth('login') }}>Увійти</button>
          <button onClick={() => { void handleAuth('register') }}>Зареєструвати</button>
        </div>
        {user && <div className="pill">Ви увійшли як {user.email}</div>}
        {status && <div className="status">{status}</div>}
      </section>

      <section className="streams">
        <div className="row space-between">
          <h2>Стріми</h2>
          <button onClick={() => { void fetchStreams() }}>Оновити</button>
        </div>
        {accessToken && (
          <div className="row">
            <input
              placeholder="Назва стріму"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={() => { void handleCreateStream() }}>Створити</button>
          </div>
        )}
        <div className="stream-list">
          {streams.map((s) => (
            <div key={s.id} className={`card ${selected?.id === s.id ? 'active' : ''}`}>
              <div className="row space-between">
                <div>
                  <strong>{s.title}</strong>
                  <div className="muted">{s.status}</div>
                </div>
                <div className="row gap">
                  <button onClick={() => setSelected(s)}>Дивитись</button>
                  {user && user.id === s.user_id && (
                    <>
                      <button onClick={() => { void handleStart(s.id) }}>Старт</button>
                      <button onClick={() => { void handleStop(s.id) }}>Стоп</button>
                    </>
                  )}
                </div>
              </div>
              {s.ingest_url && (
                <div className="ingest">
                  ingest: {s.ingest_url} — ключ: {s.stream_key}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <section className="player">
          <h2>Програвач</h2>
          <Player src={playbackUrl} />
          <Chat streamId={selected.id} />
        </section>
      )}
    </div>
  )
}
