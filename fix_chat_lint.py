def fix_chat():
    with open('backend/src/routes/chat.ts', 'r') as f:
        content = f.read()

    # line 36
    content = content.replace("typeof res.rows[0].settings === 'string' ? JSON.parse(res.rows[0].settings) : {}",
                              "typeof res.rows[0].settings === 'string' ? JSON.parse(String(res.rows[0].settings)) : {}")

    # line 57
    content = content.replace("const decoded = app.jwt.verify<{ sub: string; email: string }>(token)",
                              "const decoded = app.jwt.verify<{ sub: string, email: string }>(token)")

    # lines 93, 103 (room!)
    content = content.replace("room!,", "room,")
    content = content.replace("const room = rooms.get(streamId)", "let room = rooms.get(streamId)")
    content = content.replace("room = { clients: new Set() }", "room = { clients: new Set() } as { clients: Set<Client> }")

    with open('backend/src/routes/chat.ts', 'w') as f:
        f.write(content)

fix_chat()
