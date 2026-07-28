def fix_api():
    with open('clients/web/src/api.ts', 'r') as f:
        content = f.read()

    # line 4
    content = content.replace("const API_URL = import.meta.env.VITE_API_URL ?? defaultApiUrl", "const API_URL = import.meta.env.VITE_API_URL != null ? String(import.meta.env.VITE_API_URL) : defaultApiUrl")

    # line 114
    content = content.replace("!original._retry &&", "original._retry !== true &&")

    with open('clients/web/src/api.ts', 'w') as f:
        f.write(content)

fix_api()
