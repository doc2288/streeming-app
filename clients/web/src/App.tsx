import { useEffect, useState, useCallback, useRef } from 'react'
import type { AxiosError } from 'axios'
import { api, clearAuth, getStoredToken } from './api'
import { useI18n, type Category } from './i18n'
import { TopBar } from './components/TopBar'
import { Sidebar } from './components/Sidebar'
import { AuthModal } from './components/AuthModal'
import { AppRoutes } from './components/AppRoutes'
import { CreateStreamModal } from './components/CreateStreamModal'

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
interface UserInfo { id: string, email: string, role: string }

export default function App (): JSX.Element {
  const { t } = useI18n()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [streams, setStreams] = useState<Stream[]>([])
  const [view, setView] = useState<'home' | 'watch' | 'dashboard' | 'browse'>('home')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [toast, setToast] = useState<{ text: string, type: string } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [showCreatedSuccess, setShowCreatedSuccess] = useState(false)
  const toastTimer = useRef<NodeJS.Timeout>()

  const flash = useCallback((text: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ text, type })
    if (toastTimer.current != null) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => { setToast(null) }, 3000)
  }, [])

  const fetchStreams = useCallback(async () => {
    try { const r = await api.get('/streams'); setStreams(Array.isArray(r.data.streams) ? r.data.streams as Stream[] : []) } catch {}
  }, [])

  const restoreSession = useCallback(async () => {
    if (getStoredToken() == null) return
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user as UserInfo)
    } catch (error) {
      const status = (error as AxiosError).response?.status
      if (status === 401) clearAuth()
    }
  }, [])

  useEffect(() => {
    void restoreSession()
    void fetchStreams()
    const i = setInterval(() => { void fetchStreams() }, 10000)
    return () => { clearInterval(i) }
  }, [fetchStreams, restoreSession])

  const handleLogout = async (): Promise<void> => {
    try { await api.post('/auth/logout') } catch {}
    clearAuth()
    setUser(null)
    setView('home')
    flash(t('loggedOut'))
  }

  const navigateHome = (): void => {
    setView('home')
    setSelectedId(null)
    setSearchQuery('')
  }

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm(t('deleteConfirm'))) return
    try {
      await api.delete(`/streams/${id}`)
      flash(t('streamDeleted'))
      if (selectedId === id) navigateHome()
      void fetchStreams()
    } catch { flash(t('deleteError'), 'err') }
  }

  const handleSelectStream = (s: Stream): void => {
    setSelectedId(s.id)
    setView('watch')
    if (window.innerWidth <= 768) setSidebarOpen(false)
  }

  const handleWatch = (s: Stream): void => { handleSelectStream(s) }
  const selected = streams.find(s => s.id === selectedId) ?? null

  return (
    <div className="app">
      <TopBar user={user} onLogin={() => { setShowAuth(true) }} onLogout={() => { void handleLogout() }} onSearch={setSearchQuery} onNavigateHome={navigateHome} onNavigateDashboard={() => { setView('dashboard'); setSelectedId(null) }} sidebarOpen={sidebarOpen} onToggleSidebar={() => { setSidebarOpen(!sidebarOpen) }} searchValue={searchQuery} />

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
            onDeleteStream={(id) => { void handleDelete(id) }}
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
