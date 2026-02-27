import { useEffect, useState, useCallback } from 'react'
import { api, setAuthToken, setRefreshToken, clearAuth, getStoredToken } from './api'
import { TopBar } from './components/TopBar'
import { Sidebar } from './components/Sidebar'
import { StreamGrid } from './components/StreamGrid'
import { WatchPage } from './components/WatchPage'
import { AuthModal } from './components/AuthModal'

interface Stream {
  id: string
  title: string
  status: string
  ingest_url: string | null
  stream_key: string | null
  user_id: string
  created_at?: string
}

interface UserInfo {
  id: string
  email: string
  role: string
}

export default function App (): JSX.Element {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [streams, setStreams] = useState<Stream[]>([])
  const [selected, setSelected] = useState<Stream | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1200)
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState('home')
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [toast, setToast] = useState<{ text: string; type: 'ok' | 'err' } | null>(null)

  const flash = useCallback((text: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ text, type })
    setTimeout(() => { setToast(null) }, 4000)
  }, [])

  const fetchStreams = useCallback(async () => {
    try {
      const res = await api.get('/streams')
      setStreams(res.data.streams)
    } catch { /* */ }
  }, [])

  const restoreSession = useCallback(async () => {
    if (getStoredToken() == null) return
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
    const t = setInterval(() => { void fetchStreams() }, 12000)
    return () => { clearInterval(t) }
  }, [fetchStreams, restoreSession])

  const handleLogout = (): void => {
    const rt = localStorage.getItem('streeming_refresh_token')
    if (rt != null) void api.post('/auth/logout', { refreshToken: rt }).catch(() => {})
    clearAuth()
    setUser(null)
    setSelected(null)
    flash('Ви вийшли з акаунту', 'ok')
  }

  const handleWatch = (stream: Stream): void => {
    setSelected(stream)
    setView('watch')
  }

  const handleSelectStream = (id: string): void => {
    const s = streams.find(st => st.id === id)
    if (s != null) handleWatch(s)
  }

  const handleCreate = async (): Promise<void> => {
    if (newTitle.trim().length < 3) {
      flash('Назва мін. 3 символи', 'err')
      return
    }
    try {
      await api.post('/streams', { title: newTitle.trim() })
      setNewTitle('')
      setShowCreate(false)
      await fetchStreams()
      flash('Стрім створено!')
    } catch {
      flash('Не вдалось створити стрім', 'err')
    }
  }

  return (
    <div className="app">
      <TopBar
        user={user}
        onLogin={() => { setShowAuth(true) }}
        onLogout={handleLogout}
        onSearch={setSearchQuery}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => { setSidebarOpen(!sidebarOpen) }}
      />

      <div className="app-body">
        <Sidebar
          streams={streams}
          open={sidebarOpen}
          currentView={view}
          onNavigate={(v) => { setView(v); setSelected(null); setSearchQuery('') }}
          onSelectStream={handleSelectStream}
        />

        <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
          {view === 'watch' && selected != null ? (
            <WatchPage
              stream={selected}
              user={user}
              onBack={() => { setView('home'); setSelected(null) }}
              onRefresh={() => { void fetchStreams() }}
            />
          ) : (
            <>
              {user != null && (
                <div className="create-bar">
                  {showCreate ? (
                    <form className="create-form" onSubmit={(e) => { e.preventDefault(); void handleCreate() }}>
                      <input
                        placeholder="Назва стріму"
                        value={newTitle}
                        onChange={(e) => { setNewTitle(e.target.value) }}
                        maxLength={120}
                        autoFocus
                      />
                      <button type="submit" className="btn-primary">Створити</button>
                      <button type="button" className="btn-ghost" onClick={() => { setShowCreate(false); setNewTitle('') }}>Скасувати</button>
                    </form>
                  ) : (
                    <button className="btn-create" onClick={() => { setShowCreate(true) }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Створити стрім
                    </button>
                  )}
                </div>
              )}
              <StreamGrid
                streams={streams}
                onWatch={handleWatch}
                searchQuery={searchQuery}
              />
            </>
          )}
        </main>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => { setShowAuth(false) }}
          onSuccess={(u) => {
            setUser(u)
            setShowAuth(false)
            flash('Ласкаво просимо!')
            void fetchStreams()
          }}
        />
      )}

      {toast != null && (
        <div className={`toast ${toast.type}`}>
          {toast.text}
        </div>
      )}
    </div>
  )
}
