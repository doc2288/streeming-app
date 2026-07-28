import re

def fix():
    with open('clients/web/src/components/AuthModal.tsx', 'r') as f:
        content = f.read()

    content = content.replace("onSuccess: (user: { id: string; email: string; role: string }) => void", "onSuccess: (user: { id: string\n    email: string\n    role: string }) => void")
    content = content.replace("setAuthToken(res.data.accessToken); setRefreshToken(res.data.refreshToken)", "setAuthToken(String(res.data.accessToken)); setRefreshToken(String(res.data.refreshToken))")

    with open('clients/web/src/components/AuthModal.tsx', 'w') as f:
        f.write(content)

fix()
