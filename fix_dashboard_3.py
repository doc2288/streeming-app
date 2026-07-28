def fix():
    with open('clients/web/src/components/Dashboard.tsx', 'r') as f:
        content = f.read()

    content = content.replace("max_quality: string; delay_seconds: number; mature_content: boolean",
                              "max_quality: string\n  delay_seconds: number\n  mature_content: boolean")
    content = content.replace("chat_followers_only: boolean; chat_slow_mode: number",
                              "chat_followers_only: boolean\n  chat_slow_mode: number")

    with open('clients/web/src/components/Dashboard.tsx', 'w') as f:
        f.write(content)

fix()
