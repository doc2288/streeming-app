def fix():
    # BrowsePage.tsx
    with open('clients/web/src/components/BrowsePage.tsx', 'r') as f:
        content = f.read()
    content = content.replace("import { useI18n, getCategoryKey, type Category } from '../i18n'",
                              "import { useI18n, getCategoryKey } from '../i18n'")
    with open('clients/web/src/components/BrowsePage.tsx', 'w') as f:
        f.write(content)

    # Chat.tsx
    with open('clients/web/src/components/Chat.tsx', 'r') as f:
        content = f.read()
    content = content.replace("id: string; emoji: string; x: number; delay: number",
                              "id: string\n  emoji: string\n  x: number\n  delay: number")
    content = content.replace("m.reactions!.map", "(m.reactions ?? []).map")
    with open('clients/web/src/components/Chat.tsx', 'w') as f:
        f.write(content)

    # env.ts
    with open('clients/web/src/config/env.ts', 'r') as f:
        content = f.read()
    content = content.replace("export const getMediaServerUrl = (): string => import.meta.env.VITE_MEDIA_SERVER_URL || 'http://localhost:8080'",
                              "export const getMediaServerUrl = (): string => import.meta.env.VITE_MEDIA_SERVER_URL != null && import.meta.env.VITE_MEDIA_SERVER_URL !== '' ? String(import.meta.env.VITE_MEDIA_SERVER_URL) : 'http://localhost:8080'")
    with open('clients/web/src/config/env.ts', 'w') as f:
        f.write(content)

    # main.tsx
    with open('clients/web/src/main.tsx', 'r') as f:
        content = f.read()
    content = content.replace("createRoot(document.getElementById('root')!).render(",
                              "const root = document.getElementById('root')\nif (root != null) {\n  createRoot(root).render(")
    content = content.replace("  </I18nProvider>\n)", "  </I18nProvider>\n)\n}")
    with open('clients/web/src/main.tsx', 'w') as f:
        f.write(content)

fix()
