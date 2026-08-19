import sys

with open("/app/backend/src/routes/streams.ts", "r") as f:
    content = f.read()

content = content.replace("return { stream: sanitizeStream(updated.rows[0], request.user.sub) }", "return { stream: sanitizeStream(updated.rows[0] as Record<string, unknown>, request.user.sub) }")
content = content.replace("return { stream: sanitizeStream(updated.rows[0], request.user.sub) }", "return { stream: sanitizeStream(updated.rows[0] as Record<string, unknown>, request.user.sub) }") # Replace any others

with open("/app/backend/src/routes/streams.ts", "w") as f:
    f.write(content)
