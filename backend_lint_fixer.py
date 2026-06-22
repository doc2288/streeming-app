import re

def fix_file(filepath, replacements):
    with open(filepath, "r") as f:
        content = f.read()
    for search, replace in replacements:
        content = content.replace(search, replace)
    with open(filepath, "w") as f:
        f.write(content)

fix_file("backend/src/routes/auth.ts", [
    ("if (existingUser) {", "if (existingUser != null) {"),
    ("password: req.body.password", "password: String(req.body.password)"),
    ("email: req.body.email,", "email: String(req.body.email),"),
    ("role: req.body.role", "role: String(req.body.role)"),
    ("userId: req.user.id,", "userId: String(req.user.id),"),
    ("if (req.body.password) {", "if (req.body.password != null) {"),
    ("const email = req.body.email", "const email = String(req.body.email)"),
    ("const password = req.body.password", "const password = String(req.body.password)"),
    ("const id = req.body.id", "const id = String(req.body.id)"),
    ("const username = req.body.username", "const username = String(req.body.username)")
])

fix_file("backend/src/routes/chat.ts", [
    ("const message = req.body.message", "const message = String(req.body.message)")
])

fix_file("backend/src/routes/streams.ts", [
    ("const { stream_key, ingest_url } = rows[0]", "// eslint-disable-next-line @typescript-eslint/naming-convention\n  const { stream_key, ingest_url } = rows[0]"),
    ("const { max_quality, delay_seconds, mature_content, chat_followers_only, chat_slow_mode } = req.body", "// eslint-disable-next-line @typescript-eslint/naming-convention\n  const { max_quality, delay_seconds, mature_content, chat_followers_only, chat_slow_mode } = req.body"),
    ("const limit = req.query.limit ? Number(req.query.limit) : 20", "const limit = req.query.limit != null ? Number(req.query.limit) : 20"),
    ("const offset = req.query.offset ? Number(req.query.offset) : 0", "const offset = req.query.offset != null ? Number(req.query.offset) : 0"),
    ("{ user_id: req.user.id, category: req.query.category }", "{ user_id: String(req.user.id), category: String(req.query.category) }"),
    ("{ category: req.query.category }", "{ category: String(req.query.category) }")
])
