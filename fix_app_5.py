with open('clients/web/src/App.tsx', 'r') as f:
    content = f.read()
content = content.replace("setStreams(res.data.streams)", "setStreams(res.data.streams as Stream[])")
content = content.replace('setLang(res.data.user.language)', 'setLang(res.data.user.language as "ua" | "en" | "no")')
with open('clients/web/src/App.tsx', 'w') as f:
    f.write(content)

with open('clients/web/src/components/BrowsePage.tsx', 'r') as f:
    content = f.read()
content = content.replace("import { useI18n, getCategoryKey, type Category } from '../i18n'", "import { useI18n, getCategoryKey } from '../i18n'")
content = content.replace("import { useI18n, getCategoryKey } from '../i18n'", "import { useI18n, getCategoryKey } from '../i18n'")
with open('clients/web/src/components/BrowsePage.tsx', 'w') as f:
    f.write(content)

with open('clients/web/src/components/Chat.tsx', 'r') as f:
    content = f.read()
content = content.replace("  userId: string | null; userName: string | null; message: string; ts: number", "  userId: string | null\n  userName: string | null\n  message: string\n  ts: number")
with open('clients/web/src/components/Chat.tsx', 'w') as f:
    f.write(content)

with open('clients/web/src/components/WatchPage.tsx', 'r') as f:
    content = f.read()
content = content.replace("stream.description != null && stream.description.length > 0 === true", "(stream.description?.length ?? 0) > 0")
with open('clients/web/src/components/WatchPage.tsx', 'w') as f:
    f.write(content)
