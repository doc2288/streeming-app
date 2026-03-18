with open('clients/web/src/App.tsx', 'r') as f:
    content = f.read()
content = content.replace("setNewLang(e.target.value as any)", 'setNewLang(e.target.value as "ua" | "en" | "no")')
content = content.replace("setStreams(Array.isArray(r.data.streams) ? r.data.streams : [])", "setStreams(Array.isArray(r.data.streams) ? r.data.streams as Stream[] : [])")
with open('clients/web/src/App.tsx', 'w') as f:
    f.write(content)

with open('clients/web/src/components/BrowsePage.tsx', 'r') as f:
    content = f.read()
content = content.replace("import { useI18n, getCategoryKey, type Category } from '../i18n'", "import { useI18n, getCategoryKey } from '../i18n'")
with open('clients/web/src/components/BrowsePage.tsx', 'w') as f:
    f.write(content)

with open('clients/web/src/components/WatchPage.tsx', 'r') as f:
    content = f.read()
content = content.replace(
    "stream.description != null && stream.description.length > 0",
    "(stream.description?.length ?? 0) > 0"
)
content = content.replace(
    "stream.description != null && stream.description.length !== 0",
    "(stream.description?.length ?? 0) > 0"
)
content = content.replace(
    "stream.ingest_url != null && stream.ingest_url.endsWith",
    "stream.ingest_url?.endsWith"
)
with open('clients/web/src/components/WatchPage.tsx', 'w') as f:
    f.write(content)
