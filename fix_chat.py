import sys

with open("/app/backend/src/routes/chat.ts", "r") as f:
    content = f.read()

content = content.replace("const parsed = typeof res.rows[0].settings === 'string' ? JSON.parse(res.rows[0].settings) : {}", "const parsed = typeof res.rows[0].settings === 'string' ? JSON.parse(res.rows[0].settings as string) : {}")

with open("/app/backend/src/routes/chat.ts", "w") as f:
    f.write(content)
