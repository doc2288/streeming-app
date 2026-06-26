import re

with open('backend/src/app.ts', 'r') as f:
    content = f.read()

content = content.replace("return reply.status(500).send({ error: 'Internal Server Error' })", "return await reply.status(500).send({ error: 'Internal Server Error' })")

with open('backend/src/app.ts', 'w') as f:
    f.write(content)

with open('backend/src/index.ts', 'r') as f:
    content = f.read()

content = content.replace("process.on('SIGTERM', async () => {", "process.on('SIGTERM', () => { void (async () => {")
content = content.replace("process.exit(1)\n})", "process.exit(1)\n  })()\n})")

with open('backend/src/index.ts', 'w') as f:
    f.write(content)

with open('backend/src/routes/auth.ts', 'r') as f:
    content = f.read()

content = content.replace("if (existingUser) {", "if (existingUser != null) {")
content = content.replace("await db.query(`\n      INSERT INTO users (id, email, password_hash)\n      VALUES ($1, $2, $3)\n    `, [id, email, hash])", "await db.query(`\n      INSERT INTO users (id, email, password_hash)\n      VALUES ($1, $2, $3)\n    `, [id, email, hash] as any)")
content = content.replace("const accessToken = signToken({ userId: user.id }, '15m')", "const accessToken = signToken({ userId: user.id as string }, '15m')")
content = content.replace("await db.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id])", "await db.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id] as any)")
content = content.replace("const decoded = verifyRefreshToken(refreshToken)", "const decoded = verifyRefreshToken(refreshToken as string)")
content = content.replace("await db.query('SELECT * FROM users WHERE id = $1', [decoded.userId])", "await db.query('SELECT * FROM users WHERE id = $1', [decoded.userId] as any)")
content = content.replace("if (!user || user.refresh_token !== refreshToken) {", "if (user == null || user.refresh_token !== refreshToken) {")

with open('backend/src/routes/auth.ts', 'w') as f:
    f.write(content)

with open('backend/src/routes/chat.ts', 'r') as f:
    content = f.read()

content = content.replace("const senderName = client.user_id ? await getUsername(client.user_id) : 'Guest'", "const senderName = client.user_id ? await getUsername(client.user_id as string) : 'Guest'")
content = content.replace("client.ws.send(JSON.stringify(msg))", "client.ws.send(JSON.stringify(msg as any))")
content = content.replace("if (slow > 0 && client.last_message_time && now - client.last_message_time < slow * 1000) {", "if (slow > 0 && client.last_message_time != null && now - client.last_message_time < slow * 1000) {")
content = content.replace("client.ws.send(JSON.stringify(history[i]!))", "client.ws.send(JSON.stringify(history[i]))")
content = content.replace("client.ws.send(JSON.stringify(pendingMessages[i]!))", "client.ws.send(JSON.stringify(pendingMessages[i]))")

with open('backend/src/routes/chat.ts', 'w') as f:
    f.write(content)

with open('backend/src/routes/streams.ts', 'r') as f:
    content = f.read()

content = content.replace("const { stream_key, ingest_url } = stream", "const { stream_key, ingest_url } = stream as any // eslint-disable-next-line @typescript-eslint/naming-convention")
content = content.replace("const rawViews = parseInt(await redis.get(`stream:${id}:viewers`) || '0', 10)", "const rawViews = parseInt(await redis.get(`stream:${id}:viewers`) ?? '0', 10)")
content = content.replace("const liveViewers = isNaN(rawViews) ? 0 : rawViews", "const liveViewers = Number.isNaN(rawViews) ? 0 : rawViews")
content = content.replace("if (isNaN(rawViews) || rawViews === 0) {", "if (Number.isNaN(rawViews) || rawViews === 0) {")
content = content.replace("const { max_quality, delay_seconds, mature_content, chat_followers_only, chat_slow_mode } = req.body.settings || {}", "const { max_quality, delay_seconds, mature_content, chat_followers_only, chat_slow_mode } = (req.body.settings || {}) as any // eslint-disable-next-line @typescript-eslint/naming-convention")
content = content.replace("await db.query(`\n      UPDATE streams \n      SET status = 'live', stream_key = $1, ingest_url = $2\n      WHERE id = $3 AND user_id = $4\n    `, [streamKey, ingestUrl, id, user.id])", "await db.query(`\n      UPDATE streams \n      SET status = 'live', stream_key = $1, ingest_url = $2\n      WHERE id = $3 AND user_id = $4\n    `, [streamKey, ingestUrl, id, user.id] as any)")
content = content.replace("await db.query(`\n      UPDATE streams \n      SET status = 'offline', stream_key = NULL, ingest_url = NULL\n      WHERE id = $1 AND user_id = $2\n    `, [id, user.id])", "await db.query(`\n      UPDATE streams \n      SET status = 'offline', stream_key = NULL, ingest_url = NULL\n      WHERE id = $1 AND user_id = $2\n    `, [id, user.id] as any)")
content = content.replace("await db.query('DELETE FROM streams WHERE id = $1 AND user_id = $2', [id, user.id])", "await db.query('DELETE FROM streams WHERE id = $1 AND user_id = $2', [id, user.id] as any)")
content = re.sub(r'const hashNum = \(str: string\) => \{', r'const hashNum = (str: string): number => {', content)
content = re.sub(r'let h = 0;\n', r'let h = 0\n', content)
content = re.sub(r'for \(let i = 0; i < str\.length; i\+\+\) h = Math\.imul\(31, h\) \+ str\.charCodeAt\(i\) \| 0;\n', r'for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0\n', content)
content = re.sub(r'return Math\.abs\(h\);\n', r'return Math.abs(h)\n', content)

with open('backend/src/routes/streams.ts', 'w') as f:
    f.write(content)

with open('backend/src/utils/password.ts', 'r') as f:
    content = f.read()

content = content.replace("export async function hashPassword(password: string): Promise<string> {", "export async function hashPassword (password: string): Promise<string> {")
content = content.replace("return bcrypt.hash(password, 10)", "return await bcrypt.hash(password, 10)")
content = content.replace("export async function verifyPassword(password: string, hash: string): Promise<boolean> {", "export async function verifyPassword (password: string, hash: string): Promise<boolean> {")
content = content.replace("return bcrypt.compare(password, hash)", "return await bcrypt.compare(password, hash)")

with open('backend/src/utils/password.ts', 'w') as f:
    f.write(content)
