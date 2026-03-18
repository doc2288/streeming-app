with open('backend/src/routes/chat.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "const parsed = typeof res.rows[0].settings === 'string' ? JSON.parse(res.rows[0].settings) : {}",
    "const parsed = typeof res.rows[0].settings === 'string' ? JSON.parse(res.rows[0].settings as string) : {}"
)

content = content.replace(
    "const decoded = app.jwt.verify<{ sub: string; email: string }>(token)",
    "const decoded = app.jwt.verify<{ sub: string, email: string }>(token)"
)

content = content.replace(
    "await processMessage(raw, client, streamId, room!, connection)",
    "await processMessage(raw, client, streamId, room, connection)"
)
content = content.replace(
    "void processMessage(raw, client, streamId, room!, connection)",
    "void processMessage(raw, client, streamId, room, connection)"
)

with open('backend/src/routes/chat.ts', 'w') as f:
    f.write(content)
