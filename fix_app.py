import re

with open('clients/web/src/App.tsx', 'r') as f:
    content = f.read()

# Fix unused imports
content = content.replace("import { api, setAuthToken, setRefreshToken, clearAuth, getStoredToken } from './api'", "import { api, clearAuth, getStoredToken } from './api'")

# Fix semicolons in interfaces
old_interfaces = """interface StreamSettings {
  max_quality: string; delay_seconds: number; mature_content: boolean
  chat_followers_only: boolean; chat_slow_mode: number
}
interface Stream {
  id: string; title: string; description: string; category: string; language: string; tags: string[]
  settings: StreamSettings
  status: string; ingest_url: string | null; stream_key: string | null; thumbnail_url: string | null
  user_id: string; created_at?: string
}"""
new_interfaces = """interface StreamSettings {
  max_quality: string, delay_seconds: number, mature_content: boolean,
  chat_followers_only: boolean, chat_slow_mode: number
}
interface Stream {
  id: string, title: string, description: string, category: string, language: string, tags: string[],
  settings: StreamSettings,
  status: string, ingest_url: string | null, stream_key: string | null, thumbnail_url: string | null,
  user_id: string, created_at?: string
}"""
content = content.replace(old_interfaces, new_interfaces)

# Fix unsafe arguments for SetStateAction
content = content.replace("setStreams(res.data.streams)", "setStreams(res.data.streams as Stream[])")
content = content.replace("setUser(res.data.user)", "setUser(res.data.user as UserInfo)")
content = content.replace("setLang(res.data.user.language)", 'setLang(res.data.user.language as "ua" | "en" | "no")')

with open('clients/web/src/App.tsx', 'w') as f:
    f.write(content)

with open('clients/web/src/api.ts', 'r') as f:
    api_content = f.read()
api_content = api_content.replace("import.meta.env.DEV", "import.meta.env.DEV === true")
api_content = api_content.replace("import.meta.env.VITE_API_URL", "import.meta.env.VITE_API_URL as string | undefined")
api_content = api_content.replace("original._retry", "original._retry === true")
api_content = api_content.replace("!original._retry", "original._retry !== true")
with open('clients/web/src/api.ts', 'w') as f:
    f.write(api_content)

with open('clients/web/src/components/AuthModal.tsx', 'r') as f:
    auth_content = f.read()
auth_content = auth_content.replace("res.data.accessToken", "res.data.accessToken as string")
auth_content = auth_content.replace("res.data.refreshToken", "res.data.refreshToken as string")
with open('clients/web/src/components/AuthModal.tsx', 'w') as f:
    f.write(auth_content)

with open('clients/web/src/components/BrowsePage.tsx', 'r') as f:
    browse_content = f.read()
browse_content = browse_content.replace("import { useI18n, getCategoryKey, type Category } from '../i18n'", "import { useI18n, getCategoryKey } from '../i18n'")
with open('clients/web/src/components/BrowsePage.tsx', 'w') as f:
    f.write(browse_content)

with open('clients/web/src/components/Chat.tsx', 'r') as f:
    chat_content = f.read()
chat_content = chat_content.replace("interface Message { userId: string | null; userName: string | null; message: string; ts: number", "interface Message { userId: string | null, userName: string | null, message: string, ts: number")
chat_content = chat_content.replace("m.reactions!.map", "(m.reactions ?? []).map")
with open('clients/web/src/components/Chat.tsx', 'w') as f:
    f.write(chat_content)

with open('clients/web/src/components/Dashboard.tsx', 'r') as f:
    dash_content = f.read()
dash_content = dash_content.replace("max_quality: string; delay_seconds: number; mature_content: boolean\n  chat_followers_only: boolean; chat_slow_mode: number", "max_quality: string, delay_seconds: number, mature_content: boolean,\n  chat_followers_only: boolean, chat_slow_mode: number")
with open('clients/web/src/components/Dashboard.tsx', 'w') as f:
    f.write(dash_content)

with open('clients/web/src/components/StreamCard.tsx', 'r') as f:
    card_content = f.read()
card_content = card_content.replace("stream.tags != null && stream.tags.slice", "stream.tags?.slice")
with open('clients/web/src/components/StreamCard.tsx', 'w') as f:
    f.write(card_content)

with open('clients/web/src/components/TopBar.tsx', 'r') as f:
    top_content = f.read()
top_content = top_content.replace("const LANG_NAMES: Record<Lang, string> = { ua: 'Українська', en: 'English', no: 'Norsk' }\n\n", "")
with open('clients/web/src/components/TopBar.tsx', 'w') as f:
    f.write(top_content)

with open('clients/web/src/components/WatchPage.tsx', 'r') as f:
    watch_content = f.read()
watch_content = watch_content.replace("stream.description != null && stream.description.length > 0", "stream.description != null && stream.description.length > 0")
watch_content = watch_content.replace("stream.description != null && stream.description.length > 0", "stream.description?.length")
with open('clients/web/src/components/WatchPage.tsx', 'w') as f:
    f.write(watch_content)

with open('clients/web/src/config/env.ts', 'r') as f:
    env_content = f.read()
env_content = env_content.replace("import.meta.env.VITE_MEDIA_SERVER_URL", "import.meta.env.VITE_MEDIA_SERVER_URL as string | undefined")
with open('clients/web/src/config/env.ts', 'w') as f:
    f.write(env_content)

with open('clients/web/src/main.tsx', 'r') as f:
    main_content = f.read()
main_content = main_content.replace("ReactDOM.createRoot(document.getElementById('root')!).render(", "const rootEl = document.getElementById('root')\nif (rootEl != null) ReactDOM.createRoot(rootEl).render(")
with open('clients/web/src/main.tsx', 'w') as f:
    f.write(main_content)
