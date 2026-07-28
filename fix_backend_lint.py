def fix_app():
    with open('backend/src/app.ts', 'r') as f:
        content = f.read()
    content = content.replace('return app', 'return await Promise.resolve(app)')
    with open('backend/src/app.ts', 'w') as f:
        f.write(content)

def fix_index():
    with open('backend/src/index.ts', 'r') as f:
        content = f.read()
    content = content.replace('process.on(sig, async () => {', 'process.on(sig, () => { void (async () => {')
    content = content.replace('process.exit(0)\n    })', 'process.exit(0)\n    })() })')
    with open('backend/src/index.ts', 'w') as f:
        f.write(content)

def fix_password():
    with open('backend/src/utils/password.ts', 'r') as f:
        content = f.read()
    content = content.replace('hashPassword(plain: string)', 'hashPassword (plain: string)')
    content = content.replace('verifyPassword(plain: string, hash: string)', 'verifyPassword (plain: string, hash: string)')
    content = content.replace('return bcrypt.hash', 'return await bcrypt.hash')
    content = content.replace('return bcrypt.compare', 'return await bcrypt.compare')
    with open('backend/src/utils/password.ts', 'w') as f:
        f.write(content)

fix_app()
fix_index()
fix_password()
