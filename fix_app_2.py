with open('clients/web/src/App.tsx', 'r') as f:
    content = f.read()

# member-delimiter-style wants neither commas nor semicolons, or semicolons only at the end, etc.
# In web client rules: `favoring commas or no delimiters over semicolons in types/interfaces`
# Actually the rule might want no delimiters for single lines or commas for single lines and no delimiters for multiline?
# Let's replace the interfaces with no delimiters at the end of lines.
old_interfaces = """interface StreamSettings {
  max_quality: string, delay_seconds: number, mature_content: boolean,
  chat_followers_only: boolean, chat_slow_mode: number
}
interface Stream {
  id: string, title: string, description: string, category: string, language: string, tags: string[],
  settings: StreamSettings,
  status: string, ingest_url: string | null, stream_key: string | null, thumbnail_url: string | null,
  user_id: string, created_at?: string
}
interface UserInfo { id: string, email: string, role: string }"""

new_interfaces = """interface StreamSettings {
  max_quality: string
  delay_seconds: number
  mature_content: boolean
  chat_followers_only: boolean
  chat_slow_mode: number
}
interface Stream {
  id: string
  title: string
  description: string
  category: string
  language: string
  tags: string[]
  settings: StreamSettings
  status: string
  ingest_url: string | null
  stream_key: string | null
  thumbnail_url: string | null
  user_id: string
  created_at?: string
}
interface UserInfo {
  id: string
  email: string
  role: string
}"""

content = content.replace(old_interfaces, new_interfaces)
with open('clients/web/src/App.tsx', 'w') as f:
    f.write(content)

with open('clients/web/src/components/Chat.tsx', 'r') as f:
    chat_content = f.read()
chat_content = chat_content.replace(
    "interface Message { userId: string | null, userName: string | null, message: string, ts: number\n  type?: 'msg' | 'system' | 'action' | 'highlight'\n  reactions?: Reaction[]\n}",
    "interface Message {\n  userId: string | null\n  userName: string | null\n  message: string\n  ts: number\n  type?: 'msg' | 'system' | 'action' | 'highlight'\n  reactions?: Reaction[]\n}"
)
with open('clients/web/src/components/Chat.tsx', 'w') as f:
    f.write(chat_content)

with open('clients/web/src/components/Dashboard.tsx', 'r') as f:
    dash_content = f.read()
dash_content = dash_content.replace(
    "max_quality: string, delay_seconds: number, mature_content: boolean,\n  chat_followers_only: boolean, chat_slow_mode: number",
    "max_quality: string\n  delay_seconds: number\n  mature_content: boolean\n  chat_followers_only: boolean\n  chat_slow_mode: number"
)
with open('clients/web/src/components/Dashboard.tsx', 'w') as f:
    f.write(dash_content)

with open('clients/web/src/components/WatchPage.tsx', 'r') as f:
    watch_content = f.read()
watch_content = watch_content.replace(
    "stream.description != null && stream.description?.length",
    "stream.description != null && stream.description.length > 0"
)
with open('clients/web/src/components/WatchPage.tsx', 'w') as f:
    f.write(watch_content)
