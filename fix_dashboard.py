import re

def fix():
    with open('clients/web/src/components/Dashboard.tsx', 'r') as f:
        content = f.read()

    # Semicolons
    content = content.replace("id: string; title: string; status: string", "id: string\n  title: string\n  status: string")

    # Multiline ternaries
    content = content.replace("{s.status === 'live' ? (", "{s.status === 'live'\n                    ? (")
    content = content.replace(") : (", ")\n                    : (")

    with open('clients/web/src/components/Dashboard.tsx', 'w') as f:
        f.write(content)

fix()
