export interface User {
  id: string
  email: string
  password_hash: string
  role: 'user' | 'admin'
  created_at: Date
}

export interface Stream {
  id: string
  user_id: string
  title: string
  status: 'offline' | 'live'
  ingest_url: string | null
  stream_key: string | null
  created_at: Date
  updated_at: Date
}
