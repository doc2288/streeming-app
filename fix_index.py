with open('backend/src/index.ts', 'r') as f:
    content = f.read()

old_code = """        .then(() => pool.end())"""
new_code = """        .then(async () => { await pool.end() })"""

content = content.replace(old_code, new_code)

with open('backend/src/index.ts', 'w') as f:
    f.write(content)
