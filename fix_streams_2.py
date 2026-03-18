with open('backend/src/routes/streams.ts', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "const { stream_key: streamKey, ingest_url: ingestUrl, ...safe } = row as Record<string, unknown>" in line:
        lines[i] = line.replace("const { stream_key: streamKey, ingest_url: ingestUrl, ...safe } = row as Record<string, unknown>", "const { stream_key: streamKey, ingest_url: ingestUrl, ...safe } = row")
        continue

    if "const limit = Math.min(Math.max(parseInt(query.limit ?? '50', 10) || 50, 1), 100)" in line:
        lines[i] = line.replace("parseInt(query.limit ?? '50', 10) || 50", "parseInt(query.limit ?? '50', 10) !== 0 && !isNaN(parseInt(query.limit ?? '50', 10)) ? parseInt(query.limit ?? '50', 10) : 50")
        continue

    if "const offset = Math.max(parseInt(query.offset ?? '0', 10) || 0, 0)" in line:
        lines[i] = line.replace("parseInt(query.offset ?? '0', 10) || 0", "parseInt(query.offset ?? '0', 10) !== 0 && !isNaN(parseInt(query.offset ?? '0', 10)) ? parseInt(query.offset ?? '0', 10) : 0")
        continue

    if "tags: typeof s.tags === 'string' && s.tags !== '' ? (s.tags as string).split(',') : []," in line:
        lines[i] = line.replace("(s.tags as string).split(',')", "s.tags.split(',')")
        continue

    if "return { stream: sanitizeStream(updated.rows[0], request.user.sub) }" in line:
        lines[i] = line.replace("sanitizeStream(updated.rows[0], request.user.sub)", "sanitizeStream(updated.rows[0] as Record<string, unknown>, request.user.sub)")
        continue

with open('backend/src/routes/streams.ts', 'w') as f:
    f.writelines(lines)
