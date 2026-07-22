with open("clients/web/src/components/AuthModal.tsx", "r") as f:
    c = f.read()
c = c.replace("setError(typeof msg === 'string' ? msg : t('authError'))", "setError(typeof msg === 'string' ? String(msg) : t('authError'))")
c = c.replace("onSuccess: (user: { id: string; email: string; role: string }) => void", "onSuccess: (user: { id: string, email: string, role: string }) => void")
with open("clients/web/src/components/AuthModal.tsx", "w") as f:
    f.write(c)

with open("clients/web/src/components/BrowsePage.tsx", "r") as f:
    c = f.read()
c = c.replace("import { useI18n, getCategoryKey, type Category } from '../i18n'", "import { useI18n, getCategoryKey } from '../i18n'")
c = c.replace("interface Stream { id: string; title: string; description?: string; category?: string; language?: string; tags?: string[]; status: string }", "interface Stream { id: string, title: string, description?: string, category?: string, language?: string, tags?: string[], status: string }")
c = c.replace("interface Props { streams: Stream[]; onSelectStream: (id: string) => void }", "interface Props { streams: Stream[], onSelectStream: (id: string) => void }")
with open("clients/web/src/components/BrowsePage.tsx", "w") as f:
    f.write(c)

with open("clients/web/src/components/StreamCard.tsx", "r") as f:
    c = f.read()
c = c.replace("stream.thumbnail_url != null && stream.thumbnail_url.length > 0", "stream.thumbnail_url?.length ?? 0 > 0")
c = c.replace("interface Stream { id: string; title: string; description?: string; category?: string; language?: string; thumbnail_url?: string | null; status: string; user_id: string }", "interface Stream { id: string, title: string, description?: string, category?: string, language?: string, thumbnail_url?: string | null, status: string, user_id: string }")
c = c.replace("interface Props { stream: Stream; onClick: (id: string) => void }", "interface Props { stream: Stream, onClick: (id: string) => void }")
with open("clients/web/src/components/StreamCard.tsx", "w") as f:
    f.write(c)

with open("clients/web/src/config/env.ts", "r") as f:
    c = f.read()
c = c.replace("return new URL(apiBasePath, window.location.href).toString()", "return new URL(apiBasePath as string, window.location.href).toString()")
with open("clients/web/src/config/env.ts", "w") as f:
    f.write(c)

with open("clients/web/src/main.tsx", "r") as f:
    c = f.read()
c = c.replace("createRoot(document.getElementById('root')!).render(", "const rootEl = document.getElementById('root')\nif (rootEl != null) {\n  createRoot(rootEl).render(\n")
c = c.replace("    <App />\n  </React.StrictMode>\n)", "    <App />\n  </React.StrictMode>\n)\n}")
with open("clients/web/src/main.tsx", "w") as f:
    f.write(c)
