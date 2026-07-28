def fix():
    with open('clients/web/src/components/Dashboard.tsx', 'r') as f:
        content = f.read()

    # The previous replace might not have matched correctly. Let's do it generally
    content = content.replace("id: string; title: string; status: string; ingest_url?: string | null; stream_key?: string | null",
                              "id: string\n  title: string\n  status: string\n  ingest_url?: string | null\n  stream_key?: string | null")
    content = content.replace("id: string; title: string; status: string;",
                              "id: string\n  title: string\n  status: string")

    with open('clients/web/src/components/Dashboard.tsx', 'w') as f:
        f.write(content)

fix()
