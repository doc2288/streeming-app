def fix_auth():
    with open('backend/src/routes/auth.ts', 'r') as f:
        content = f.read()

    # line 31
    content = content.replace('if (!match) return 30 * 24 * 60 * 60 * 1000', 'if (match == null) return 30 * 24 * 60 * 60 * 1000')

    # lines 70, 98, 132
    content = content.replace('const user = sanitizeUser(insert.rows[0])', 'const user = sanitizeUser(insert.rows[0] as Record<string, unknown>)')
    content = content.replace('const user = sanitizeUser(row)', 'const user = sanitizeUser(row as Record<string, unknown>)')
    content = content.replace('const user = sanitizeUser(userRes.rows[0])', 'const user = sanitizeUser(userRes.rows[0] as Record<string, unknown>)')

    # line 94
    content = content.replace('const ok = await verifyPassword(password, row.password_hash)', 'const ok = await verifyPassword(password, String(row.password_hash))')

    # line 124
    content = content.replace('if (new Date(row.expires_at) < new Date()) {', 'if (new Date(String(row.expires_at)) < new Date()) {')

    # line 143
    content = content.replace('if (body?.refreshToken) {', 'if (body?.refreshToken != null && body.refreshToken !== "") {')

    with open('backend/src/routes/auth.ts', 'w') as f:
        f.write(content)

fix_auth()
