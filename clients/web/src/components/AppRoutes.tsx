import { StreamGrid } from './StreamGrid'
import { WatchPage } from './WatchPage'
import { Dashboard } from './Dashboard'
import { BrowsePage } from './BrowsePage'

interface StreamSettings {
  max_quality: string
  delay_seconds: number
  mature_content: boolean
  chat_followers_only: boolean
  chat_slow_mode: number
}
interface Stream {
  id: string
  title: string
  description: string
  category: string
  language: string
  tags: string[]
  settings: StreamSettings
  status: string
  ingest_url: string | null
  stream_key: string | null
  thumbnail_url: string | null
  user_id: string
  created_at?: string
}
interface UserInfo {
  id: string
  email: string
  role: string
}

interface Props {
  view: string
  selectedStream: Stream | null
  user: UserInfo | null
  streams: Stream[]
  searchQuery: string
  activeCategory: string | null
  onNavigateHome: () => void
  onRefreshStreams: () => void
  onDeleteStream: (id: string) => void
  onWatchStream: (s: Stream) => void
  onShowCreate: () => void
  flash: (text: string, type?: 'ok' | 'err') => void
}

export function AppRoutes ({
  view,
  selectedStream,
  user,
  streams,
  searchQuery,
  activeCategory,
  onNavigateHome,
  onRefreshStreams,
  onDeleteStream,
  onWatchStream,
  onShowCreate,
  flash
}: Props): JSX.Element {
  if (view === 'watch' && selectedStream != null) {
    return (
      <WatchPage
        stream={selectedStream}
        user={user}
        onBack={onNavigateHome}
        onRefresh={onRefreshStreams}
        onDelete={onDeleteStream}
      />
    )
  }

  if (view === 'dashboard' && user != null) {
    return (
      <Dashboard
        streams={streams}
        userId={user.id}
        onRefresh={onRefreshStreams}
        onDelete={onDeleteStream}
        flash={flash}
        onShowCreate={onShowCreate}
      />
    )
  }

  if (view === 'browse') {
    return (
      <BrowsePage
        streams={streams}
        onWatch={onWatchStream}
      />
    )
  }

  return (
    <StreamGrid
      streams={streams}
      onWatch={onWatchStream}
      searchQuery={searchQuery}
      categoryFilter={activeCategory}
    />
  )
}
