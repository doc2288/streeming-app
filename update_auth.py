with open('clients/web/src/components/AuthModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<button className="modal-close" onClick={onClose}>',
    '<button className="modal-close" onClick={onClose} aria-label={t(\'cancel\')}>'
)

with open('clients/web/src/components/AuthModal.tsx', 'w') as f:
    f.write(content)
