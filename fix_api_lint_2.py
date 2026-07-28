def fix_api_2():
    with open('clients/web/src/api.ts', 'r') as f:
        content = f.read()

    # line 4 is actually import.meta.env.DEV
    content = content.replace("import.meta.env.DEV\n  ?", "import.meta.env.DEV === true\n  ?")

    with open('clients/web/src/api.ts', 'w') as f:
        f.write(content)

fix_api_2()
