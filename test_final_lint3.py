with open("clients/web/src/main.tsx", "r") as f:
    c = f.read()
c = c.replace("ReactDOM.const rootEl = document.getElementById('root');", "const rootEl = document.getElementById('root');")
c = c.replace("createRoot(rootEl).render(", "ReactDOM.createRoot(rootEl).render(")
with open("clients/web/src/main.tsx", "w") as f:
    f.write(c)

with open("clients/web/src/components/BrowsePage.tsx", "r") as f:
    c = f.read()
c = c.replace("import { useI18n, getCategoryKey } from '../i18n'", "import { useI18n, getCategoryKey, type Category } from '../i18n'")
with open("clients/web/src/components/BrowsePage.tsx", "w") as f:
    f.write(c)
