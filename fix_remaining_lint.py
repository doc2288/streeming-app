def fix():
    # Sidebar.tsx
    with open('clients/web/src/components/Sidebar.tsx', 'r') as f:
        content = f.read()
    content = content.replace("id: string; title: string; status: string; user_id: string; category?: string",
                              "id: string\n  title: string\n  status: string\n  user_id: string\n  category?: string")
    content = content.replace("gaming: '🎮', irl: '📷', music: '🎵', esports: '🏆',\n  creative: '🎨', education: '📚', talkshow: '🎙️', other: '📺'",
                              "gaming: '🎮',\n  irl: '📷',\n  music: '🎵',\n  esports: '🏆',\n  creative: '🎨',\n  education: '📚',\n  talkshow: '🎙️',\n  other: '📺'")
    with open('clients/web/src/components/Sidebar.tsx', 'w') as f:
        f.write(content)

    # StreamCard.tsx
    with open('clients/web/src/components/StreamCard.tsx', 'r') as f:
        content = f.read()
    content = content.replace("id: string; title: string; status: string; user_id: string; category?: string; thumbnail_url?: string | null; tags?: string[]",
                              "id: string\n  title: string\n  status: string\n  user_id: string\n  category?: string\n  thumbnail_url?: string | null\n  tags?: string[]")
    content = content.replace("stream: Stream; onWatch: (stream: Stream) => void",
                              "stream: Stream\n  onWatch: (stream: Stream) => void")
    content = content.replace("const viewers = useMemo(() => isLive ? (hashNum(stream.id + 'v') % 900) + 10 : 0, [stream.id, isLive])",
                              "const viewers = useMemo(() => isLive\n    ? (hashNum(stream.id + 'v') % 900) + 10\n    : 0, [stream.id, isLive])")
    content = content.replace("thumbSrc != null ? `${getApiBaseUrl()}${stream.thumbnail_url}` : null",
                              "thumbSrc != null\n    ? `${getApiBaseUrl()}${stream.thumbnail_url}`\n    : null")
    # Actually line 42 is likely prefer-optional-chain, let's fix that
    content = content.replace("stream.tags != null && stream.tags.slice(0, 2).map", "(stream.tags ?? []).slice(0, 2).map")

    with open('clients/web/src/components/StreamCard.tsx', 'w') as f:
        f.write(content)

    # StreamGrid.tsx
    with open('clients/web/src/components/StreamGrid.tsx', 'r') as f:
        content = f.read()
    content = content.replace("id: string; title: string; status: string; user_id: string; category?: string; thumbnail_url?: string | null; tags?: string[]",
                              "id: string\n  title: string\n  status: string\n  user_id: string\n  category?: string\n  thumbnail_url?: string | null\n  tags?: string[]")
    content = content.replace("title?: string; streams: Stream[]; onWatch: (stream: Stream) => void",
                              "title?: string\n  streams: Stream[]\n  onWatch: (stream: Stream) => void")
    content = content.replace("{streams.length > 0 ? (", "{streams.length > 0\n        ? (")
    content = content.replace(") : (", ")\n        : (")
    with open('clients/web/src/components/StreamGrid.tsx', 'w') as f:
        f.write(content)

    # TopBar.tsx
    with open('clients/web/src/components/TopBar.tsx', 'r') as f:
        content = f.read()
    content = content.replace("user: { id: string; email: string; role: string } | null", "user: { id: string\n    email: string\n    role: string } | null")
    content = content.replace("const LANG_NAMES: Record<Lang, string> = { ua: 'Українська', en: 'English', no: 'Norsk' }\n\n", "")
    content = content.replace("{user != null ? (", "{user != null\n          ? (")
    content = content.replace(") : (", ")\n          : (")
    with open('clients/web/src/components/TopBar.tsx', 'w') as f:
        f.write(content)

    # WatchPage.tsx
    with open('clients/web/src/components/WatchPage.tsx', 'r') as f:
        content = f.read()
    content = content.replace("id: string; title: string; description: string; status: string", "id: string\n  title: string\n  description: string\n  status: string")
    content = content.replace("user_id: string; category?: string; language?: string; tags?: string[]", "user_id: string\n  category?: string\n  language?: string\n  tags?: string[]")
    content = content.replace("ingest_url?: string | null; stream_key?: string | null", "ingest_url?: string | null\n  stream_key?: string | null")
    content = content.replace("user: { id: string; email: string; role: string } | null", "user: { id: string\n    email: string\n    role: string } | null")
    content = content.replace("stream: Stream; user: any; onBack: () => void; onRefresh: () => void; onDelete: (id: string) => void",
                              "stream: Stream\n  user: any\n  onBack: () => void\n  onRefresh: () => void\n  onDelete: (id: string) => void")
    content = content.replace("stream.tags != null && stream.tags.map", "(stream.tags ?? []).map")
    with open('clients/web/src/components/WatchPage.tsx', 'w') as f:
        f.write(content)

fix()
