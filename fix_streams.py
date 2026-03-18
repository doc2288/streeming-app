with open('backend/src/routes/streams.ts', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    # line 47: const { stream_key, ingest_url, ...safe } = row
    if "const { stream_key, ingest_url, ...safe } = row" in line:
        lines[i] = line.replace("const { stream_key, ingest_url, ...safe } = row", "const { stream_key: streamKey, ingest_url: ingestUrl, ...safe } = row as Record<string, unknown>")
        continue
    if "stream_key: isOwner ? stream_key : null," in line:
        lines[i] = line.replace("stream_key: isOwner ? stream_key : null,", "stream_key: isOwner ? streamKey : null,")
        continue
    if "ingest_url: isOwner ? ingest_url : null" in line:
        lines[i] = line.replace("ingest_url: isOwner ? ingest_url : null", "ingest_url: isOwner ? ingestUrl : null")
        continue
    # line 66: if (res.rowCount || res.rowCount === 0) -> let's fix it properly, probably res.rowCount !== null
    if "if (res.rowCount || res.rowCount === 0) {" in line:
        lines[i] = line.replace("if (res.rowCount || res.rowCount === 0) {", "if (res.rowCount != null) {")
        continue
    # Wait, the error is: Unexpected number value in conditional. An explicit zero/NaN check is required
    # `if (res.rowCount)` where rowCount is number | null. It should be `if (res.rowCount != null && res.rowCount > 0)` or similar.

    # line 80: return await reply.send({ streams: processed as any[] })
    if "return await reply.send({ streams: processed as any[] })" in line:
        lines[i] = line.replace("processed as any[]", "processed")
        continue

    # line 98: const { title, description, category, language, tags, max_quality, delay_seconds, mature_content, chat_followers_only, chat_slow_mode } = parsed.data
    if "const { title, description, category, language, tags, max_quality, delay_seconds, mature_content, chat_followers_only, chat_slow_mode } = parsed.data" in line:
        lines[i] = line.replace(
            "const { title, description, category, language, tags, max_quality, delay_seconds, mature_content, chat_followers_only, chat_slow_mode } = parsed.data",
            "const { title, description, category, language, tags, max_quality: maxQuality, delay_seconds: delaySeconds, mature_content: matureContent, chat_followers_only: chatFollowersOnly, chat_slow_mode: chatSlowMode } = parsed.data"
        )
        continue

    # line 100: const settings = JSON.stringify({ max_quality, delay_seconds, mature_content, chat_followers_only, chat_slow_mode })
    if "const settings = JSON.stringify({ max_quality, delay_seconds, mature_content, chat_followers_only, chat_slow_mode })" in line:
        lines[i] = line.replace(
            "const settings = JSON.stringify({ max_quality, delay_seconds, mature_content, chat_followers_only, chat_slow_mode })",
            "const settings = JSON.stringify({ max_quality: maxQuality, delay_seconds: delaySeconds, mature_content: matureContent, chat_followers_only: chatFollowersOnly, chat_slow_mode: chatSlowMode })"
        )
        continue

    # lines 112, 130, 148: return await reply.send({ stream: sanitizeStream(res.rows[0], true) })
    if "return await reply.send({ stream: sanitizeStream(res.rows[0], true) })" in line:
        lines[i] = line.replace("sanitizeStream(res.rows[0], true)", "sanitizeStream(res.rows[0] as Record<string, unknown>, true)")
        continue
    if "return await reply.send({ stream: sanitizeStream(res.rows[0], request.user.sub) })" in line:
        lines[i] = line.replace("sanitizeStream(res.rows[0], request.user.sub)", "sanitizeStream(res.rows[0] as Record<string, unknown>, request.user.sub)")
        continue
    if "return await reply.send({ stream: sanitizeStream(res.rows[0]) })" in line:
        lines[i] = line.replace("sanitizeStream(res.rows[0])", "sanitizeStream(res.rows[0] as Record<string, unknown>)")
        continue
    if "const processed = res.rows.map(s => {" in line:
        lines[i] = line.replace("const processed = res.rows.map(s => {", "const processed = res.rows.map((s: Record<string, unknown>) => {")
        continue
    if "stream_key: s.user_id === userId ? s.stream_key : null," in line:
        lines[i] = line.replace("stream_key: s.user_id === userId ? s.stream_key : null,", "stream_key: s.user_id === userId ? (s.stream_key as string) : null,")
        continue

with open('backend/src/routes/streams.ts', 'w') as f:
    f.writelines(lines)
