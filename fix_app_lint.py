import re

def fix_app():
    with open('clients/web/src/App.tsx', 'r') as f:
        content = f.read()

    # lines 3: remove setAuthToken, setRefreshToken
    content = content.replace("api, setAuthToken, setRefreshToken, clearAuth, getStoredToken", "api, clearAuth, getStoredToken")

    # missing semicolons in interfaces
    content = content.replace("max_quality: string; delay_seconds: number; mature_content: boolean", "max_quality: string\n  delay_seconds: number\n  mature_content: boolean")
    content = content.replace("chat_followers_only: boolean; chat_slow_mode: number", "chat_followers_only: boolean\n  chat_slow_mode: number")
    content = content.replace("id: string; title: string; description: string; category: string; language: string; tags: string[]", "id: string\n  title: string\n  description: string\n  category: string\n  language: string\n  tags: string[]")
    content = content.replace("status: string; ingest_url: string | null; stream_key: string | null; thumbnail_url: string | null", "status: string\n  ingest_url: string | null\n  stream_key: string | null\n  thumbnail_url: string | null")
    content = content.replace("user_id: string; created_at?: string", "user_id: string\n  created_at?: string")
    content = content.replace("id: string; email: string; role: string", "id: string\n  email: string\n  role: string")

    # line 23
    content = content.replace("type: 'ok' | 'err'", "type: 'ok' | 'err'") # keep this, it's not the interface semicolon

    # line 63
    content = content.replace("Array.isArray(r.data.streams) ? r.data.streams : []", "Array.isArray(r.data.streams) ? (r.data.streams as Stream[]) : []")

    # line 70
    content = content.replace("setUser(res.data.user)", "setUser(res.data.user as UserInfo)")

    # line 105
    content = content.replace("title: newTitle.trim(), description: newDesc.trim(), category: newCat, language: newLang, tags: parsedTags,", "title: newTitle.trim(),\n        description: newDesc.trim(),\n        category: newCat,\n        language: newLang,\n        tags: parsedTags,")
    content = content.replace("max_quality: newMaxQuality, delay_seconds: newDelay, mature_content: newMature,", "max_quality: newMaxQuality,\n        delay_seconds: newDelay,\n        mature_content: newMature,")
    content = content.replace("chat_followers_only: newChatFollowers, chat_slow_mode: newChatSlow", "chat_followers_only: newChatFollowers,\n        chat_slow_mode: newChatSlow")

    # multiline ternaries 128, 130, 132
    content = content.replace(
        "{view === 'watch' && selected != null ? (",
        "{view === 'watch' && selected != null\n            ? ("
    ).replace(
        ") : view === 'dashboard' && user != null ? (",
        ")\n            : view === 'dashboard' && user != null\n              ? ("
    ).replace(
        ") : view === 'browse' ? (",
        ")\n              : view === 'browse'\n                ? ("
    ).replace(
        ") : (",
        ")\n                : ("
    )

    # line 165
    content = content.replace("onChange={(e) => { setNewLang(e.target.value as any) }}", "onChange={(e) => { setNewLang(e.target.value as 'ua' | 'en' | 'no') }}")

    # line 213 (multiline ternary in thumbPreview)
    content = content.replace(
        "{thumbPreview != null ? (",
        "{thumbPreview != null\n                    ? ("
    ).replace(
        ") : (",
        ")\n                    : ("
    )

    with open('clients/web/src/App.tsx', 'w') as f:
        f.write(content)

fix_app()
