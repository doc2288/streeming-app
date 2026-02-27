import { useState } from 'react'
import { api, setAuthToken, setRefreshToken } from '../api'

interface Props {
  onClose: () => void
  onSuccess: (user: { id: string; email: string; role: string }) => void
}

export function AuthModal ({ onClose, onSuccess }: Props): JSX.Element {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (email.trim().length === 0 || password.length < 8) {
      setError('Email та пароль (мін. 8 символів) обов\'язкові')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await api.post(`/auth/${mode}`, { email: email.trim(), password })
      const { accessToken, refreshToken, user } = res.data
      setAuthToken(accessToken)
      setRefreshToken(refreshToken)
      onSuccess({ id: user.id, email: user.email, role: user.role })
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : 'Помилка авторизації')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => { e.stopPropagation() }}>
        <button className="modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-header">
          <svg className="modal-logo" width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="url(#mg)" />
            <path d="M7 8l5 4-5 4V8z" fill="#fff" />
            <path d="M12 8l5 4-5 4V8z" fill="#fff" opacity="0.6" />
            <defs><linearGradient id="mg" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#2563eb" /></linearGradient></defs>
          </svg>
          <h2>{mode === 'login' ? 'Увійти в Streeming' : 'Створити акаунт'}</h2>
        </div>

        <form className="modal-form" onSubmit={(e) => { void handleSubmit(e) }}>
          <div className="form-group">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="auth-password">Пароль</label>
            <input
              id="auth-password"
              type="password"
              placeholder="Мінімум 8 символів"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>

          {error != null && <div className="form-error">{error}</div>}

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Зачекайте…' : mode === 'login' ? 'Увійти' : 'Зареєструватись'}
          </button>
        </form>

        <div className="modal-footer">
          {mode === 'login' ? (
            <p>Немає акаунту? <button className="link-btn" onClick={() => { setMode('register'); setError(null) }}>Зареєструватись</button></p>
          ) : (
            <p>Вже є акаунт? <button className="link-btn" onClick={() => { setMode('login'); setError(null) }}>Увійти</button></p>
          )}
        </div>
      </div>
    </div>
  )
}
