def fix():
    with open('clients/web/src/components/WatchPage.tsx', 'r') as f:
        content = f.read()

    # line 55
    content = content.replace("stream.ingest_url != null && stream.ingest_url.endsWith(`/${stream.id}`)",
                              "(stream.ingest_url?.endsWith(`/${stream.id}`) === true)")

    with open('clients/web/src/components/WatchPage.tsx', 'w') as f:
        f.write(content)

fix()
