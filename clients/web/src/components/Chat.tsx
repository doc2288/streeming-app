import { useEffect, useRef, useState, useCallback } from 'react'
import { getWsBaseUrl, getStoredToken } from '../api'
import { useI18n } from '../i18n'

interface Reaction { emoji: string; count: number; mine: boolean }
interface Message {
  userId: string | null; userName: string | null; message: string; ts: number
  type?: 'msg' | 'system' | 'action' | 'highlight'
  reactions?: Reaction[]
}
interface Props { streamId: string; ownerUserId?: string }

const NAME_COLORS = ['#ff4500', '#b22222', '#ff69b4', '#1e90ff', '#9acd32', '#ff7f50', '#2e8b57', '#daa520', '#d2691e', '#5f9ea0', '#00ff7f', '#8a2be2', '#ff0000', '#0000ff', '#008000']
function nameColor (id: string | null): string {
  if (id == null) return '#adadb8'
  let h = 0; for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h)
  return NAME_COLORS[Math.abs(h) % NAME_COLORS.length]
}
function fmtTime (ts: number): string { const d = new Date(ts); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }

const COMMANDS: Record<string, string> = {
  '/shrug': '¯\\_(ツ)_/¯',
  '/tableflip': '(╯°□°)╯︵ ┻━┻',
  '/unflip': '┬─┬ノ( º _ ºノ)',
  '/lenny': '( ͡° ͜ʖ ͡°)',
  '/hype': '🎉🔥🎉🔥🎉',
  '/gg': '🏆 GG WP! 🏆',
  '/love': '❤️💜💙💚💛🧡',
  '/rip': '⚰️ F in chat ⚰️'
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🔥', '👀']

const EMOJI_SETS = [
  ['😀', '😂', '🤣', '😍', '🥰', '😎', '🤩', '🥳'],
  ['👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '💪'],
  ['❤️', '🔥', '⭐', '💯', '🎮', '🏆', '🎯', '💎'],
  ['😱', '😭', '🤔', '😴', '🤮', '💀', '👀', '🫡'],
  ['GG', 'EZ', 'F', 'W', 'POG', 'KEK', 'LOL', 'RIP']
]

const RAIN_TRIGGERS = ['🎉', '🔥🔥🔥', 'POG', '🏆', '/hype']
const RAIN_EMOJIS = ['🎉', '🎊', '⭐', '✨', '🔥', '💜', '🎮']

export function Chat ({ streamId, ownerUserId }: Props): JSX.Element {
  const { t } = useI18n()
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null)
  const [raining, setRaining] = useState(false)
  const [rainParticles, setRainParticles] = useState<Array<{ id: number; emoji: string; x: number; delay: number }>>([])
  const socketRef = useRef<WebSocket | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const rainIdRef = useRef(0)

  const triggerRain = useCallback(() => {
    if (raining) return
    setRaining(true)
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: ++rainIdRef.current,
      emoji: RAIN_EMOJIS[Math.floor(Math.random() * RAIN_EMOJIS.length)],
      x: Math.random() * 100,
      delay: Math.random() * 1.5
    }))
    setRainParticles(particles)
    setTimeout(() => { setRaining(false); setRainParticles([]) }, 3500)
  }, [raining])

  useEffect(() => {
    setMessages([{ userId: null, userName: null, message: t('chatJoined'), ts: Date.now(), type: 'system' }])
    let wsUrl = `${getWsBaseUrl()}/chat/${streamId}`
    const token = getStoredToken()
    if (token != null) wsUrl += `?token=${encodeURIComponent(token)}`
    const ws = new WebSocket(wsUrl)
    socketRef.current = ws
    ws.onopen = () => { setConnected(true) }
    ws.onclose = () => { setConnected(false) }
    ws.onerror = () => { setConnected(false) }
    ws.onmessage = (ev) => {
      try {
        const d = JSON.parse(String(ev.data)) as Message
        if (d.message.startsWith('/me ')) {
          d.type = 'action'
          d.message = d.message.slice(4)
        } else {
          d.type = 'msg'
        }
        d.reactions = []
        if (RAIN_TRIGGERS.some(tr => d.message.includes(tr))) {
          triggerRain()
        }
        setMessages(p => { const n = [...p, d]; return n.length > 300 ? n.slice(-300) : n })
      } catch {}
    }
    return () => { ws.close() }
  }, [streamId, t, triggerRain])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = (): void => {
    let s = text.trim()
    if (s.length === 0 || s.length > 500) return
    const cmdKey = Object.keys(COMMANDS).find(k => s.toLowerCase() === k)
    if (cmdKey != null) s = COMMANDS[cmdKey]
    socketRef.current?.send(s)
    setText('')
    setShowEmoji(false)
  }

  const addReaction = (msgIdx: number, emoji: string): void => {
    setMessages(prev => prev.map((m, i) => {
      if (i !== msgIdx) return m
      const reactions = [...(m.reactions ?? [])]
      const existing = reactions.find(r => r.emoji === emoji)
      if (existing != null) {
        if (existing.mine) { existing.count--; existing.mine = false; if (existing.count <= 0) return { ...m, reactions: reactions.filter(r => r.count > 0) } }
        else { existing.count++; existing.mine = true }
      } else {
        reactions.push({ emoji, count: 1, mine: true })
      }
      return { ...m, reactions }
    }))
  }

  const replyTo = (name: string): void => {
    setText(`@${name} `)
    inputRef.current?.focus()
  }

  const renderBody = (body: string): JSX.Element => {
    const parts = body.split(/(@\w+)/g)
    return <>{parts.map((p, i) => p.startsWith('@') ? <span key={i} className="chat-mention">{p}</span> : <span key={i}>{p}</span>)}</>
  }

  const isOwner = (uid: string | null): boolean => uid != null && uid === ownerUserId

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span>{t('chatTitle')}</span>
        <div className="chat-header-actions">
          <button className="chat-header-btn" onClick={() => { setShowRules(!showRules) }} title={t('chatRules')} aria-label={t('chatRules')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
          </button>
          <span className={`chat-conn ${connected ? 'on' : 'off'}`} />
        </div>
      </div>
      {showRules && (
        <div className="chat-rules">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <span>{t('chatRulesText')}</span>
          <span className="chat-commands-hint">💡 /shrug /tableflip /hype /gg /love /rip</span>
        </div>
      )}

      <div className="chat-messages">
        {rainParticles.length > 0 && (
          <div className="emoji-rain">
            {rainParticles.map(p => (
              <span key={p.id} className="rain-particle" style={{ left: `${p.x}%`, animationDelay: `${p.delay}s` }}>{p.emoji}</span>
            ))}
          </div>
        )}
        {messages.map((m, i) => {
          if (m.type === 'system') {
            return <div key={i} className="chat-system"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg><span>{m.message}</span></div>
          }
          const name = m.userName ?? (m.userId != null ? m.userId.slice(0, 8) : t('guest'))
          const color = nameColor(m.userId)
          const owner = isOwner(m.userId)
          return (
            <div key={i} className={`chat-line ${m.type === 'action' ? 'chat-action' : ''}`} onMouseEnter={() => { setHoveredMsg(i) }} onMouseLeave={() => { setHoveredMsg(null) }}>
              {hoveredMsg === i && (
                <div className="chat-line-actions">
                  <button className="chat-react-btn" onClick={() => { replyTo(name) }} title="Reply">↩</button>
                  {QUICK_REACTIONS.map(e => <button key={e} className="chat-react-btn" onClick={() => { addReaction(i, e) }}>{e}</button>)}
                </div>
              )}
              <span className="chat-ts">{fmtTime(m.ts)}</span>
              {owner && <span className="chat-owner-badge" title="Streamer">🎬</span>}
              {m.type === 'action' ? (
                <span className="chat-action-text" style={{ color }}>★ {name} {renderBody(m.message)}</span>
              ) : (
                <>
                  <span className="chat-badge-name" style={{ color }} onClick={() => { replyTo(name) }}>{name}</span>
                  <span className="chat-colon">: </span>
                  <span className="chat-body">{renderBody(m.message)}</span>
                </>
              )}
              {(m.reactions ?? []).length > 0 && (
                <div className="chat-reactions">
                  {m.reactions!.map((r, ri) => (
                    <button key={ri} className={`chat-reaction ${r.mine ? 'mine' : ''}`} onClick={() => { addReaction(i, r.emoji) }}>
                      {r.emoji} {r.count}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {showEmoji && (
        <div className="emoji-picker">
          {EMOJI_SETS.map((row, ri) => (<div key={ri} className="emoji-row">{row.map((e, ei) => (<button key={ei} className="emoji-btn" onClick={() => { setText(prev => prev + e); inputRef.current?.focus() }}>{e}</button>))}</div>))}
        </div>
      )}

      <div className="chat-input-area">
        <button className="chat-emoji-toggle" onClick={() => { setShowEmoji(!showEmoji) }} title="Emoji" aria-label="Emoji">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
        </button>
        <input ref={inputRef} value={text} onChange={(e) => { setText(e.target.value) }} onKeyDown={(e) => { if (e.key === 'Enter') send() }} placeholder={connected ? t('chatPlaceholder') : t('connecting')} maxLength={500} disabled={!connected} />
        <button onClick={send} disabled={!connected || text.trim().length === 0} className="chat-send" aria-label={t('chatPlaceholder')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
        </button>
      </div>
    </div>
  )
}
