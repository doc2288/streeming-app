import re

with open('clients/web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { getAuthToken, setAuthToken, getRefreshToken, setRefreshToken, fetchUser, fetchStreams, logout, fetchStream } from './api'", "import { getAuthToken, getRefreshToken, fetchUser, fetchStreams, logout, fetchStream } from './api'")
content = content.replace("export interface UserInfo { id: string; email: string; role: string }", "export interface UserInfo {\n  id: string\n  email: string\n  role: string\n}")
content = content.replace("export interface StreamSettings { max_quality?: string; delay_seconds?: number; mature_content?: boolean; chat_followers_only?: boolean; chat_slow_mode?: number }", "export interface StreamSettings {\n  max_quality?: string\n  delay_seconds?: number\n  mature_content?: boolean\n  chat_followers_only?: boolean\n  chat_slow_mode?: number\n}")
content = content.replace("export interface Stream { id: string; title: string; description: string; category: string; language: string; tags: string[]; settings: StreamSettings; status: string; ingest_url?: string; stream_key?: string; thumbnail_url: string | null; user?: { email: string } }", "export interface Stream {\n  id: string\n  title: string\n  description: string\n  category: string\n  language: string\n  tags: string[]\n  settings: StreamSettings\n  status: string\n  ingest_url?: string\n  stream_key?: string\n  thumbnail_url: string | null\n  user?: {\n    email: string\n  }\n}")
content = content.replace("setStreams(data)", "setStreams(data as Stream[])")
content = content.replace("setUser(data.user)", "setUser(data.user as UserInfo | null)")
content = content.replace("setLang(e.target.value as any)", "setLang(e.target.value as 'ua' | 'en' | 'no')")

with open('clients/web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/Chat.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("interface Reaction { emoji: string; count: number; mine: boolean }", "interface Reaction {\n  emoji: string\n  count: number\n  mine: boolean\n}")
content = content.replace("m.reactions!.map((r, ri) => (", "(m.reactions ?? []).map((r, ri) => (")
with open('clients/web/src/components/Chat.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("interface FormState { title: string; description: string; category: Category }", "interface FormState {\n  title: string\n  description: string\n  category: Category\n}")
with open('clients/web/src/components/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/Sidebar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("interface SidebarProps { open: boolean; onToggle: () => void; streams: Stream[]; onNavigate: (view: 'home' | 'browse') => void; currentView: 'home' | 'browse'; onSelectStream: (id: string) => void; activeCategory: string | null; onFilterCategory: (cat: string | null) => void }", "interface SidebarProps {\n  open: boolean\n  onToggle: () => void\n  streams: Stream[]\n  onNavigate: (view: 'home' | 'browse') => void\n  currentView: 'home' | 'browse'\n  onSelectStream: (id: string) => void\n  activeCategory: string | null\n  onFilterCategory: (cat: string | null) => void\n}")
with open('clients/web/src/components/Sidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/StreamCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("interface StreamCardProps { stream: Stream; onClick: () => void; showViewerCount?: boolean; viewers?: number }", "interface StreamCardProps {\n  stream: Stream\n  onClick: () => void\n  showViewerCount?: boolean\n  viewers?: number\n}")
content = content.replace("stream.user && stream.user.email", "stream.user?.email")
with open('clients/web/src/components/StreamCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/StreamGrid.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("interface StreamGridProps { title?: string; streams: Stream[]; onSelectStream: (id: string) => void; emptyMessage?: string; emptyCta?: string; onEmptyCtaClick?: () => void }", "interface StreamGridProps {\n  title?: string\n  streams: Stream[]\n  onSelectStream: (id: string) => void\n  emptyMessage?: string\n  emptyCta?: string\n  onEmptyCtaClick?: () => void\n}")
with open('clients/web/src/components/StreamGrid.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/WatchPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("interface WatchPageProps { streamId: string; user: UserInfo | null; onBack: () => void }", "interface WatchPageProps {\n  streamId: string\n  user: UserInfo | null\n  onBack: () => void\n}")
content = content.replace("stream.user && stream.user.email", "stream.user?.email")
with open('clients/web/src/components/WatchPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/TopBar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("interface TopBarProps { user: UserInfo | null; onLogin: () => void; onLogout: () => void; onToggleSidebar: () => void; onSearch: (q: string) => void; onNavigateHome: () => void; onNavigateDashboard: () => void }", "interface TopBarProps {\n  user: UserInfo | null\n  onLogin: () => void\n  onLogout: () => void\n  onToggleSidebar: () => void\n  onSearch: (q: string) => void\n  onNavigateHome: () => void\n  onNavigateDashboard: () => void\n}")
content = content.replace("import { useI18n, LANG_NAMES, Lang } from '../i18n'", "import { useI18n, Lang } from '../i18n'")
with open('clients/web/src/components/TopBar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/config/env.ts', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("const raw = (import.meta as any).env[key]", "const envVars = import.meta.env as Record<string, unknown>\n  const raw = envVars[key] as string | undefined")
with open('clients/web/src/config/env.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("if (!url) return null", "if (typeof url !== 'string' || url === '') return null")
content = content.replace("Authorization: `Bearer ${token}`", "Authorization: `Bearer ${String(token)}`")
content = content.replace("if (!res.ok) throw new Error('API Error')", "if (res.ok !== true) throw new Error('API Error')")
with open('clients/web/src/api.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/AuthModal.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("setError(err.response?.data?.error || 'Auth failed')", "setError((err.response?.data?.error as string | undefined) ?? 'Auth failed')")
with open('clients/web/src/components/AuthModal.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/BrowsePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("import { useI18n, CATEGORIES, getCategoryKey, Category } from '../i18n'", "import { useI18n, CATEGORIES, getCategoryKey } from '../i18n'")
with open('clients/web/src/components/BrowsePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/main.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("const root = document.getElementById('root')!", "const root = document.getElementById('root') ?? document.body")
with open('clients/web/src/main.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
