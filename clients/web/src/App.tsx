import { useEffect, useState, useCallback, useRef } from 'react'
import type { AxiosError } from 'axios'
import { api, clearAuth, getStoredToken } from './api'
import { useI18n } from './i18n'
import { TopBar } from './components/TopBar'
import { Sidebar } from './components/Sidebar'
import { AuthModal } from './components/AuthModal'
import { CreateStreamModal } from './components/CreateStreamModal'
import { AppRoutes } from './components/AppRoutes'

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
  description: string
  category: string
  language: string
  tags: string[]
  settings: StreamSettings
  status: string
  ingest_url: string | null
  stream_key: string | null
  thumbnail_url: string | null
  user_id: string
  created_at?: string
}
interface UserInfo {
  id: string
  email: string
  role: string
}

export default function App (): JSX.Element {
  const { t } = useI18n()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [streams, setStreams] = useState<Stream[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showCreatedSuccess, setShowCreatedSuccess] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1200)
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState('home')
  const [toast, setToast] = useState<{ text: string, type: 'ok' | 'err' } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const selected = streams.find(s => s.id === selectedId) ?? null

  const flash = useCallback((text: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ text, type })
    if (toastTimer.current != null) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => { setToast(null) }, 5000)
  }, [])

  const fetchStreams = useCallback(async () => {
    try { const r = await api.get('/streams'); setStreams(Array.isArray(r.data.streams) ? r.data.streams : []) } catch {}
  }, [])

  const restoreSession = useCallback(async () => {
    if (getStoredToken() == null) return
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user)
    } catch (error) {
      const status = (error as AxiosError).response?.status
      if (status === 401) clearAuth()
    }
  }, [])

  useEffect(() => { void restoreSession(); void fetchStreams(); const t = setInterval(() => { void fetchStreams() }, 12000); return () => { clearInterval(t) } }, [fetchStreams, restoreSession])

  const navigateHome = (): void => { setView('home'); setSelectedId(null); setSearchQuery('') }

  const handleLogout = (): void => {
    const rt = localStorage.getItem('streeming_refresh_token')
    if (rt != null) void api.post('/auth/logout', { refreshToken: rt }).catch(() => {})
    clearAuth(); setUser(null); setSelectedId(null); flash(t('loggedOut'))
  }

  const handleWatch = (s: Stream): void => { setSelectedId(s.id); setView('watch') }
  const handleSelectStream = (id: string): void => { setSelectedId(id); setView('watch') }
  const handleDelete = (id: string): void => { setStreams(p => p.filter(s => s.id !== id)); setSelectedId(null); setView('home'); flash(t('streamDeleted')) }

  return (
    <div className="app">
      <TopBar user={user} onLogin={() => { setShowAuth(true) }} onLogout={handleLogout} onSearch={setSearchQuery} onNavigateHome={navigateHome} onNavigateDashboard={() => { setView('dashboard'); setSelectedId(null) }} sidebarOpen={sidebarOpen} onToggleSidebar={() => { setSidebarOpen(!sidebarOpen) }} searchValue={searchQuery} />

      <div className="app-body">
        <Sidebar streams={streams} open={sidebarOpen} currentView={view} onNavigate={(v) => { setView(v); setSelectedId(null); setSearchQuery('') }} onSelectStream={handleSelectStream} onFilterCategory={setActiveCategory} activeCategory={activeCategory} />

        <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
          <AppRoutes
            view={view}
            selectedStream={selected}
            user={user}
            streams={streams}
            searchQuery={searchQuery}
            activeCategory={activeCategory}
            onNavigateHome={navigateHome}
            onRefreshStreams={() => { void fetchStreams() }}
            onDeleteStream={handleDelete}
            onWatchStream={handleWatch}
            onShowCreate={() => { setShowCreate(true) }}
            flash={flash}
          />
        </main>
      </div>

      {showAuth && <AuthModal onClose={() => { setShowAuth(false) }} onSuccess={(u) => { setUser(u); setShowAuth(false); flash(t('welcome')); void fetchStreams() }} />}

      {showCreate && (
        <CreateStreamModal
          onClose={() => { setShowCreate(false) }}
          onSuccess={() => {
            setShowCreate(false)
            setShowCreatedSuccess(true)
            void fetchStreams()
          }}
          flash={flash}
        />
      )}

      {showCreatedSuccess && (
        <div className="modal-overlay" onClick={() => { setShowCreatedSuccess(false) }}>
          <div className="modal modal-sm" onClick={(e) => { e.stopPropagation() }}>
            <div className="modal-header">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              <h2>{t('streamCreated')}</h2>
            </div>
            <p className="modal-body-text">{t('streamCreatedDesc')}</p>
            <div className="modal-actions">
              <button className="btn-primary btn-full" onClick={() => { setShowCreatedSuccess(false); setView('dashboard') }}>{t('goToDashboard')}</button>
              <button className="btn-ghost btn-full" onClick={() => { setShowCreatedSuccess(false) }}>{t('later')}</button>
            </div>
          </div>
        </div>
      )}

      {toast != null && <div className={`toast ${toast.type}`}><span>{toast.text}</span><button className="toast-x" onClick={() => { setToast(null) }}>×</button></div>}
    </div>
  )
}
