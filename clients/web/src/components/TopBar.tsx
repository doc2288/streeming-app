import { useState, useRef, useEffect } from 'react'

interface Props {
  user: { id: string; email: string; role: string } | null
  onLogin: () => void
  onLogout: () => void
  onSearch: (q: string) => void
  onNavigateHome: () => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
  searchValue: string
}

export function TopBar ({ user, onLogin, onLogout, onSearch, onNavigateHome, sidebarOpen, onToggleSidebar, searchValue }: Props): JSX.Element {
  const [query, setQuery] = useState(searchValue)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(searchValue) }, [searchValue])

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (dropRef.current != null && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => { document.removeEventListener('mousedown', handler) }
  }, [])

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    onSearch(query.trim())
  }

  return (
    <nav className="topbar">
      <div className="topbar-left">
        <button className="topbar-hamburger" onClick={onToggleSidebar} title="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 4h16v1.5H2zm0 5h16v1.5H2zm0 5h16v1.5H2z" />
          </svg>
        </button>
        <button className="topbar-logo" onClick={onNavigateHome}>
          <svg className="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="url(#g)" />
            <path d="M7 8l5 4-5 4V8z" fill="#fff" />
            <path d="M12 8l5 4-5 4V8z" fill="#fff" opacity="0.6" />
            <defs><linearGradient id="g" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#2563eb" /></linearGradient></defs>
          </svg>
          <span className="logo-text">Streeming</span>
        </button>
      </div>

      <form className="topbar-search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Пошук стрімів…"
          value={query}
          onChange={(e) => { setQuery(e.target.value) }}
        />
        {query.length > 0 && (
          <button type="button" className="search-clear" onClick={() => { setQuery(''); onSearch('') }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        <button type="submit" className="search-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </button>
      </form>

      <div className="topbar-right">
        {user != null ? (
          <div className="topbar-user" ref={dropRef}>
            <button className="avatar" onClick={() => { setDropdownOpen(!dropdownOpen) }}>
              {user.email[0].toUpperCase()}
            </button>
            {dropdownOpen && (
              <div className="user-dropdown show">
                <span className="user-email">{user.email}</span>
                <button onClick={() => { onLogout(); setDropdownOpen(false) }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Вийти
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="topbar-auth">
            <button className="btn-login" onClick={onLogin}>Увійти</button>
            <button className="btn-signup" onClick={onLogin}>Реєстрація</button>
          </div>
        )}
      </div>
    </nav>
  )
}
