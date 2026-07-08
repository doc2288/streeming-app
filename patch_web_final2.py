import re

with open('clients/web/src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("export interface UserInfo { id: string; email: string; role: string }", "export interface UserInfo {\n  id: string\n  email: string\n  role: string\n}")
content = content.replace("export interface StreamSettings { max_quality?: string; delay_seconds?: number; mature_content?: boolean; chat_followers_only?: boolean; chat_slow_mode?: number }", "export interface StreamSettings {\n  max_quality?: string\n  delay_seconds?: number\n  mature_content?: boolean\n  chat_followers_only?: boolean\n  chat_slow_mode?: number\n}")
content = content.replace("export interface Stream { id: string; title: string; description: string; category: string; language: string; tags: string[]; settings: StreamSettings; status: string; ingest_url?: string; stream_key?: string; thumbnail_url: string | null; user?: { email: string } }", "export interface Stream {\n  id: string\n  title: string\n  description: string\n  category: string\n  language: string\n  tags: string[]\n  settings: StreamSettings\n  status: string\n  ingest_url?: string\n  stream_key?: string\n  thumbnail_url: string | null\n  user?: { email: string }\n}")

with open('clients/web/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/Chat.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("interface Reaction { emoji: string; count: number; mine: boolean }", "interface Reaction {\n  emoji: string\n  count: number\n  mine: boolean\n}")
with open('clients/web/src/components/Chat.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('clients/web/src/components/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("interface FormState { title: string; description: string; category: Category }", "interface FormState {\n  title: string\n  description: string\n  category: Category\n}")
with open('clients/web/src/components/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
