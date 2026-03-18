with open('clients/web/src/api.ts', 'r') as f:
    content = f.read()

content = content.replace("original._retry !== true === true", "original._retry !== true")
content = content.replace("original._retry === true = true", "original._retry = true")
content = content.replace("import.meta.env.DEV === true === true", "import.meta.env.DEV === true")

with open('clients/web/src/api.ts', 'w') as f:
    f.write(content)
