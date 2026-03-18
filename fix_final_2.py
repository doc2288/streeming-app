with open('clients/web/src/App.tsx', 'r') as f:
    content = f.read()
content = content.replace('setNewLang(e.target.value as "ua" | "en" | "no")', "setNewLang(e.target.value as 'ua' | 'en' | 'no')")
with open('clients/web/src/App.tsx', 'w') as f:
    f.write(content)

with open('clients/web/src/components/BrowsePage.tsx', 'r') as f:
    content = f.read()
content = content.replace("import { useI18n, getCategoryKey, type Category } from '../i18n'", "import { useI18n, getCategoryKey } from '../i18n'")
with open('clients/web/src/components/BrowsePage.tsx', 'w') as f:
    f.write(content)

with open('clients/web/src/components/WatchPage.tsx', 'r') as f:
    content = f.read()
content = content.replace("stream.ingest_url?.endsWith(`/${stream.id}`)", "(stream.ingest_url?.endsWith(`/${stream.id}`) ?? false)")
content = content.replace("{stream.description?.length && <p", "{(stream.description?.length ?? 0) > 0 && <p")
with open('clients/web/src/components/WatchPage.tsx', 'w') as f:
    f.write(content)
