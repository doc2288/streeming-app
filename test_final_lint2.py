with open("clients/web/src/components/BrowsePage.tsx", "r") as f:
    c = f.read()
c = c.replace("interface Stream { id: string, title: string, description?: string, category?: string, language?: string, tags?: string[], status: string }", "interface Stream { id: string\n title: string\n description?: string\n category?: string\n language?: string\n tags?: string[]\n status: string }")
c = c.replace("interface Props { streams: Stream[], onSelectStream: (id: string) => void }", "interface Props { streams: Stream[]\n onSelectStream: (id: string) => void }")
with open("clients/web/src/components/BrowsePage.tsx", "w") as f:
    f.write(c)

with open("clients/web/src/components/StreamCard.tsx", "r") as f:
    c = f.read()
c = c.replace("interface Stream { id: string, title: string, description?: string, category?: string, language?: string, thumbnail_url?: string | null, status: string, user_id: string }", "interface Stream { id: string\n title: string\n description?: string\n category?: string\n language?: string\n thumbnail_url?: string | null\n status: string\n user_id: string }")
c = c.replace("interface Props { stream: Stream, onClick: (id: string) => void }", "interface Props { stream: Stream\n onClick: (id: string) => void }")
with open("clients/web/src/components/StreamCard.tsx", "w") as f:
    f.write(c)

with open("clients/web/src/main.tsx", "r") as f:
    c = f.read()
c = c.replace("const rootEl = document.getElementById('root')\nif (rootEl != null) {\n  createRoot(rootEl).render(\n", "const rootEl = document.getElementById('root');\nif (rootEl != null) {\n  createRoot(rootEl).render(\n")
with open("clients/web/src/main.tsx", "w") as f:
    f.write(c)
