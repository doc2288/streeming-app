import { useState } from 'react'
import { api, setAuthToken, setRefreshToken } from '../api'
import { useI18n } from '../i18n'

interface Props {
  onClose: () => void
  onSuccess: (user: { id: string; email: string; role: string }) => void
}

export function AuthModal ({ onClose, onSuccess }: Props): JSX.Element {
  const { t } = useI18n()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (email.trim().length === 0 || password.length < 8) { setError(t('authRequired')); return }
    setLoading(true); setError(null)
    try {
      const res = await api.post(`/auth/${mode}`, { email: email.trim(), password })
      setAuthToken(res.data.accessToken); setRefreshToken(res.data.refreshToken)
      onSuccess({ id: res.data.user.id, email: res.data.user.email, role: res.data.user.role })
    } catch (err: any) {
      const msg = err.response?.data?.error
      setError(typeof msg === 'string' ? msg : t('authError'))
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => { e.stopPropagation() }}>
        <button className="modal-close" onClick={onClose} aria-label={t('close')}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
        <div className="modal-header">
          <svg className="modal-logo" width="40" height="40" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="url(#mg)" /><path d="M7 8l5 4-5 4V8z" fill="#fff" /><path d="M12 8l5 4-5 4V8z" fill="#fff" opacity="0.6" /><defs><linearGradient id="mg" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#2563eb" /></linearGradient></defs></svg>
          <h2>{mode === 'login' ? t('loginTitle') : t('registerTitle')}</h2>
        </div>
        <form className="modal-form" onSubmit={(e) => { void handleSubmit(e) }}>
          <div className="form-group"><label>{t('email')}</label><input type="email" placeholder="your@email.com" value={email} onChange={(e) => { setEmail(e.target.value) }} autoFocus /></div>
          <div className="form-group"><label>{t('password')}</label><input type="password" placeholder={t('passwordMin')} value={password} onChange={(e) => { setPassword(e.target.value) }} /></div>
          {error != null && <div className="form-error">{error}</div>}
          <button type="submit" className="btn-primary btn-full" disabled={loading}>{loading ? t('wait') : mode === 'login' ? t('login') : t('register')}</button>
        </form>
        <div className="modal-footer">
          {mode === 'login'
            ? <p>{t('noAccount')} <button className="link-btn" onClick={() => { setMode('register'); setError(null) }}>{t('register')}</button></p>
            : <p>{t('hasAccount')} <button className="link-btn" onClick={() => { setMode('login'); setError(null) }}>{t('login')}</button></p>
          }
        </div>
      </div>
    </div>
  )
}
