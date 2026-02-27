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

export function Chat ({ streamId }: Props): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const wsUrl = `${getWsBaseUrl()}/chat/${streamId}`
    const ws = new WebSocket(wsUrl)
    socketRef.current = ws

    ws.onopen = () => { setConnected(true) }
    ws.onclose = () => { setConnected(false) }
    ws.onerror = () => { setConnected(false) }

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(String(ev.data)) as Message
        setMessages((prev) => {
          const next = [...prev, data]
          return next.length > 200 ? next.slice(-200) : next
        })
      } catch {
        // ignore invalid JSON
      }
    }

    return () => {
      ws.close()
    }
  }, [streamId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (): void => {
    const trimmed = text.trim()
    if (trimmed.length === 0 || trimmed.length > 500) return
    socketRef.current?.send(trimmed)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <span>Чат</span>
        <span className={`chat-status ${connected ? 'online' : 'offline'}`}>
          {connected ? '●' : '○'}
        </span>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="muted center">Ще немає повідомлень</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className="chat-message">
            <strong className="chat-user">{m.userId?.slice(0, 8) ?? 'anon'}:</strong>
            <span>{m.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => { setText(e.target.value) }}
          onKeyDown={handleKeyDown}
          placeholder="Повідомлення…"
          maxLength={500}
          disabled={!connected}
        />
        <button onClick={send} disabled={!connected || text.trim().length === 0}>
          Надіслати
        </button>
      </div>
    </div>
  )
}
