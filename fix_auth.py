import sys

with open("/app/backend/src/routes/auth.ts", "r") as f:
    content = f.read()

content = content.replace("if (new Date(row.expires_at) < new Date()) {", "if (new Date(row.expires_at as string | number | Date) < new Date()) {")

with open("/app/backend/src/routes/auth.ts", "w") as f:
    f.write(content)
