import { useEffect, useRef, useState } from 'react'

interface Message {
  userId: string | null
  message: string
  ts: number
}

interface Props {
  streamId: string
}

export function Chat({ streamId }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:4000/chat/${streamId}`)
    socketRef.current = ws
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data.toString()) as Message
        setMessages((prev) => [...prev, data])
      } catch {
        // ignore
      }
    }
    return () => {
      ws.close()
    }
  }, [streamId])

  const send = (): void => {
    if (!text.trim()) return
    socketRef.current?.send(text.trim())
    setText('')
  }

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className="chat-message">
            <strong>{m.userId ?? 'anon'}:</strong> {m.message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишіть повідомлення"
        />
        <button onClick={send}>Надіслати</button>
      </div>
    </div>
  )
}
