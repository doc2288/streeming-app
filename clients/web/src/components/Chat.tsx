import { useEffect, useRef, useState } from 'react'
import { getWsBaseUrl } from '../api'

interface Message {
  userId: string | null
  message: string
  ts: number
}

interface Props {
  streamId: string
}

const COLORS = ['#9147ff', '#00b894', '#e17055', '#00cec9', '#fd79a8', '#6c5ce7', '#ffeaa7', '#55efc4']
function nameColor (id: string | null): string {
  if (id == null) return '#adadb8'
  let h = 0
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h)
  return COLORS[Math.abs(h) % COLORS.length]
}

export function Chat ({ streamId }: Props): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const ws = new WebSocket(`${getWsBaseUrl()}/chat/${streamId}`)
    socketRef.current = ws
    ws.onopen = () => { setConnected(true) }
    ws.onclose = () => { setConnected(false) }
    ws.onerror = () => { setConnected(false) }
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(String(ev.data)) as Message
        setMessages((prev) => {
          const next = [...prev, data]
          return next.length > 300 ? next.slice(-300) : next
        })
      } catch { /* ignore */ }
    }
    return () => { ws.close() }
  }, [streamId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (): void => {
    const t = text.trim()
    if (t.length === 0 || t.length > 500) return
    socketRef.current?.send(t)
    setText('')
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span>Чат стріму</span>
        <span className={`chat-conn ${connected ? 'on' : 'off'}`} title={connected ? 'Підключено' : 'Відключено'} />
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>Вітаємо у чаті!</p>
            <p className="chat-empty-sub">Напишіть перше повідомлення</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className="chat-msg">
            <span className="chat-name" style={{ color: nameColor(m.userId) }}>
              {m.userId != null ? m.userId.slice(0, 8) : 'Гість'}
            </span>
            <span className="chat-text">{m.message}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="chat-input-area">
        <input
          value={text}
          onChange={(e) => { setText(e.target.value) }}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          placeholder={connected ? 'Надіслати повідомлення' : 'З\'єднання…'}
          maxLength={500}
          disabled={!connected}
        />
        <button onClick={send} disabled={!connected || text.trim().length === 0} className="chat-send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
