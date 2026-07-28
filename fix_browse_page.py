import re

def fix():
    with open('clients/web/src/components/BrowsePage.tsx', 'r') as f:
        content = f.read()

    # semicolons in interface
    content = content.replace("id: string; title: string; category?: string; tags?: string[]; thumbnail_url?: string | null; status: string; user_id: string",
                              "id: string\n  title: string\n  category?: string\n  tags?: string[]\n  thumbnail_url?: string | null\n  status: string\n  user_id: string")

    # unneeded assertions
    content = content.replace("const filtered = Array.isArray(streams) ? (streams as Stream[]).filter(s => {",
                              "const filtered = Array.isArray(streams) ? streams.filter(s => {")
    content = content.replace("const live = Array.isArray(streams) ? (streams as Stream[]).filter(s => s.status === 'live') : []",
                              "const live = Array.isArray(streams) ? streams.filter(s => s.status === 'live') : []")

    with open('clients/web/src/components/BrowsePage.tsx', 'w') as f:
        f.write(content)

fix()
