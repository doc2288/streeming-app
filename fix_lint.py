with open('clients/web/src/components/Dashboard.tsx', 'r') as f:
    content = f.read()
# Fix interface StreamSettings semicolons
content = content.replace("max_quality: string; delay_seconds: number; mature_content: boolean\n  chat_followers_only: boolean; chat_slow_mode: number", "max_quality: string\n  delay_seconds: number\n  mature_content: boolean\n  chat_followers_only: boolean\n  chat_slow_mode: number")
with open('clients/web/src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

with open('clients/web/src/components/WatchPage.tsx', 'r') as f:
    content = f.read()
# Fix @typescript-eslint/prefer-optional-chain at line 30ish
content = content.replace("stream.ingest_url != null && stream.ingest_url.endsWith(`/${stream.id}`)", "stream.ingest_url?.endsWith(`/${stream.id}`) === true")
with open('clients/web/src/components/WatchPage.tsx', 'w') as f:
    f.write(content)
