with open('clients/web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("setStreams(data)", "setStreams(data as Stream[])")
content = content.replace("setUser(data.user)", "setUser(data.user as UserInfo)")
content = content.replace("setLang(e.target.value as any)", "setLang(e.target.value as 'ua' | 'en' | 'no')")

with open('clients/web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("if (!url) return null", "if (url == null || url === '') return null")
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

with open('clients/web/src/components/Chat.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("m.reactions!.map((r, ri) => (", "(m.reactions ?? []).map((r, ri) => (")
with open('clients/web/src/components/Chat.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/StreamCard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("stream.user && stream.user.email", "stream.user?.email")
with open('clients/web/src/components/StreamCard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/TopBar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("import { useI18n, LANG_NAMES, Lang } from '../i18n'", "import { useI18n, Lang } from '../i18n'")
with open('clients/web/src/components/TopBar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/WatchPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("stream.user && stream.user.email", "stream.user?.email")
with open('clients/web/src/components/WatchPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/config/env.ts', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("const raw = (import.meta as any).env[key]", "const envVars = import.meta.env as Record<string, unknown>\n  const raw = envVars[key] as string | undefined")
with open('clients/web/src/config/env.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/main.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("const root = document.getElementById('root')!", "const root = document.getElementById('root') ?? document.body")
with open('clients/web/src/main.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
