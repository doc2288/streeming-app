import { useEffect, useRef, useState } from 'react'
import { getWsBaseUrl } from '../api'
import { useI18n } from '../i18n'

interface Message { userId: string | null; message: string; ts: number; type?: 'msg' | 'system' }
interface Props { streamId: string }

const NAME_COLORS = ['#9147ff', '#00b894', '#e17055', '#00cec9', '#fd79a8', '#6c5ce7', '#55efc4', '#ff6b6b', '#48dbfb', '#feca57']
function nameColor (id: string | null): string { if (id == null) return '#adadb8'; let h = 0; for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h); return NAME_COLORS[Math.abs(h) % NAME_COLORS.length] }
function fmtTime (ts: number): string { const d = new Date(ts); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }

const EMOJI_SETS = [
  ['😀', '😂', '🤣', '😍', '🥰', '😎', '🤩', '🥳'],
  ['👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '💪'],
  ['❤️', '🔥', '⭐', '💯', '🎮', '🏆', '🎯', '💎'],
  ['😱', '😭', '🤔', '😴', '🤮', '💀', '👀', '🫡'],
  ['GG', 'EZ', 'F', 'W', 'POG', 'KEK', 'LOL', 'RIP']
]

export function Chat ({ streamId }: Props): JSX.Element {
  const { t } = useI18n()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setMessages([{ userId: null, message: t('chatJoined'), ts: Date.now(), type: 'system' }])
    const ws = new WebSocket(`${getWsBaseUrl()}/chat/${streamId}`)
    socketRef.current = ws
    ws.onopen = () => { setConnected(true) }
    ws.onclose = () => { setConnected(false) }
    ws.onerror = () => { setConnected(false) }
    ws.onmessage = (ev) => {
      try {
        const d = JSON.parse(String(ev.data)) as Message
        d.type = 'msg'
        setMessages(p => { const n = [...p, d]; return n.length > 300 ? n.slice(-300) : n })
      } catch {}
    }
    return () => { ws.close() }
  }, [streamId, t])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = (): void => {
    const s = text.trim()
    if (s.length === 0 || s.length > 500) return
    socketRef.current?.send(s)
    setText('')
    setShowEmoji(false)
  }

  const insertEmoji = (e: string): void => {
    setText(prev => prev + e)
    inputRef.current?.focus()
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span>{t('chatTitle')}</span>
        <div className="chat-header-actions">
          <button className="chat-header-btn" onClick={() => { setShowRules(!showRules) }} title={t('chatRules')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          </button>
          <span className={`chat-conn ${connected ? 'on' : 'off'}`} />
        </div>
      </div>

      {showRules && (
        <div className="chat-rules">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <span>{t('chatRulesText')}</span>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((m, i) => (
          m.type === 'system' ? (
            <div key={i} className="chat-system">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
              <span>{m.message}</span>
            </div>
          ) : (
            <div key={i} className="chat-msg">
              <span className="chat-ts">{fmtTime(m.ts)}</span>
              <span className="chat-name" style={{ color: nameColor(m.userId) }}>
                {m.userId != null ? m.userId.slice(0, 8) : t('guest')}
              </span>
              <span className="chat-text">{m.message}</span>
            </div>
          )
        ))}
        <div ref={endRef} />
      </div>

      {showEmoji && (
        <div className="emoji-picker">
          {EMOJI_SETS.map((row, ri) => (
            <div key={ri} className="emoji-row">
              {row.map((e, ei) => (
                <button key={ei} className="emoji-btn" onClick={() => { insertEmoji(e) }}>{e}</button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="chat-input-area">
        <button className="chat-emoji-toggle" onClick={() => { setShowEmoji(!showEmoji) }} title="Emoji">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
        </button>
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => { setText(e.target.value) }}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          placeholder={connected ? t('chatPlaceholder') : t('connecting')}
          maxLength={500}
          disabled={!connected}
        />
        <button onClick={send} disabled={!connected || text.trim().length === 0} className="chat-send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
        </button>
      </div>
    </div>
  )
}
