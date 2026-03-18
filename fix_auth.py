with open('backend/src/routes/auth.ts', 'r') as f:
    content = f.read()

content = content.replace("const user = sanitizeUser(insert.rows[0])", "const user = sanitizeUser(insert.rows[0] as Record<string, unknown>)")
content = content.replace("const user = sanitizeUser(userRes.rows[0])", "const user = sanitizeUser(userRes.rows[0] as Record<string, unknown>)")

with open('backend/src/routes/auth.ts', 'w') as f:
    f.write(content)
