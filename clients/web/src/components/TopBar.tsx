import { useState } from 'react'

interface Props {
  user: { id: string; email: string; role: string } | null
  onLogin: () => void
  onLogout: () => void
  onSearch: (q: string) => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function TopBar ({ user, onLogin, onLogout, onSearch, sidebarOpen, onToggleSidebar }: Props): JSX.Element {
  const [query, setQuery] = useState('')

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
        <a className="topbar-logo" href="/" onClick={(e) => { e.preventDefault() }}>
          <svg className="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="url(#g)" />
            <path d="M7 8l5 4-5 4V8z" fill="#fff" />
            <path d="M12 8l5 4-5 4V8z" fill="#fff" opacity="0.6" />
            <defs><linearGradient id="g" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#2563eb" /></linearGradient></defs>
          </svg>
          <span className="logo-text">Streeming</span>
        </a>
      </div>

      <form className="topbar-search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Пошук"
          value={query}
          onChange={(e) => { setQuery(e.target.value) }}
        />
        <button type="submit" className="search-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
        </button>
      </form>

      <div className="topbar-right">
        {user != null ? (
          <div className="topbar-user">
            <div className="avatar">{user.email[0].toUpperCase()}</div>
            <div className="user-dropdown">
              <span className="user-email">{user.email}</span>
              <button onClick={onLogout}>Вийти</button>
            </div>
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
