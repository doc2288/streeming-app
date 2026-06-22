import re

def fix_file(filepath, replacements):
    with open(filepath, "r") as f:
        content = f.read()
    for search, replace in replacements:
        content = content.replace(search, replace)
    with open(filepath, "w") as f:
        f.write(content)

fix_file("clients/web/src/App.tsx", [
    ("import { api, setAuthToken, setRefreshToken } from './api'", "import { api } from './api'"),
    ("interface UserInfo { id: string; email: string; role: string }\ninterface Stream {", "interface UserInfo { id: string, email: string, role: string }\ninterface Stream {"),
    ("id: string\n  title: string\n  description: string\n  category: string\n  language: string\n  thumbnail_url: string | null\n  settings: {\n    max_quality: string\n    delay_seconds: number\n    mature_content: boolean\n    chat_followers_only: boolean\n    chat_slow_mode: number\n  }\n  status: string\n  ingest_url: string | null\n  stream_key: string | null\n  user_id: string\n}", "id: string, title: string, description: string, category: string, language: string, thumbnail_url: string | null, settings: { max_quality: string, delay_seconds: number, mature_content: boolean, chat_followers_only: boolean, chat_slow_mode: number }, status: string, ingest_url: string | null, stream_key: string | null, user_id: string}"),
    ("setStreams(res.data.streams)", "setStreams(res.data.streams as Stream[])"),
    ("setUser(res.data.user)", "setUser(res.data.user as UserInfo | null)"),
    ("setLang(storedLang)", "setLang(storedLang as 'ua' | 'en' | 'no')")
])

fix_file("clients/web/src/api.ts", [
    ("if (authHeader) {", "if (authHeader != null && authHeader !== '') {"),
    ("const t = localStorage.getItem('accessToken')", "const t = localStorage.getItem('accessToken')\n  if (t == null) return null"),
    ("return t", "return t"),
    ("if (err.response?.data?.error === 'Refresh token expired' || err.response?.data?.error === 'Invalid refresh token') {", "if (err.response?.data?.error === 'Refresh token expired' || err.response?.data?.error === 'Invalid refresh token') {")
])

fix_file("clients/web/src/components/AuthModal.tsx", [
    ("const msg = err.response?.data?.error", "const msg = err.response?.data?.error as string | null"),
    ("setError(typeof msg === 'string' ? msg : t('authError'))", "setError(typeof msg === 'string' ? msg : t('authError'))")
])

fix_file("clients/web/src/components/BrowsePage.tsx", [
    ("import { useI18n, CATEGORIES, getCategoryKey, type Category } from '../i18n'", "import { useI18n, CATEGORIES, getCategoryKey } from '../i18n'")
])

fix_file("clients/web/src/components/Chat.tsx", [
    ("interface Reaction { emoji: string; count: number; mine: boolean }", "interface Reaction { emoji: string, count: number, mine: boolean }"),
    ("m.reactions!.map", "(m.reactions ?? []).map")
])

fix_file("clients/web/src/components/Dashboard.tsx", [
    ("interface StreamSettings {\n  max_quality: string; delay_seconds: number; mature_content: boolean\n  chat_followers_only: boolean; chat_slow_mode: number\n}", "interface StreamSettings { max_quality: string, delay_seconds: number, mature_content: boolean, chat_followers_only: boolean, chat_slow_mode: number }"),
    ("interface Stream {\n  id: string\n  title: string\n  description: string\n  category: string\n  language: string\n  thumbnail_url: string | null\n  settings: StreamSettings\n  status: string\n  ingest_url: string | null\n  stream_key: string | null\n  user_id: string\n}", "interface Stream { id: string, title: string, description: string, category: string, language: string, thumbnail_url: string | null, settings: StreamSettings, status: string, ingest_url: string | null, stream_key: string | null, user_id: string }")
])

fix_file("clients/web/src/components/StreamCard.tsx", [
    ("&& s.settings.mature_content", "&& s.settings?.mature_content === true")
])

fix_file("clients/web/src/components/TopBar.tsx", [
    ("const LANG_NAMES: Record<Lang, string> = { ua: 'Українська', en: 'English', no: 'Norsk' }\n\nexport function TopBar", "export function TopBar")
])

fix_file("clients/web/src/components/WatchPage.tsx", [
    ("&& stream.settings.mature_content", "&& stream.settings?.mature_content === true")
])

fix_file("clients/web/src/config/env.ts", [
    ("const url = env.VITE_MEDIA_SERVER_URL", "const url = String(env.VITE_MEDIA_SERVER_URL)")
])

fix_file("clients/web/src/main.tsx", [
    ("createRoot(document.getElementById('root')!).render(", "const rootEl = document.getElementById('root')\nif (rootEl != null) {\n  createRoot(rootEl).render(\n    <StrictMode>\n      <I18nProvider>\n        <App />\n      </I18nProvider>\n    </StrictMode>,\n  )\n}")
])

print("Replacements done")
