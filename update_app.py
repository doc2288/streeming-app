with open('clients/web/src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<button className="modal-close" onClick={() => { setShowCreate(false) }}>',
    '<button className="modal-close" onClick={() => { setShowCreate(false) }} aria-label={t(\'cancel\')}>'
)

content = content.replace(
    '<button type="button" className="thumb-remove" onClick={() => { setNewThumb(null); setThumbPreview(null) }}>×</button>',
    '<button type="button" className="thumb-remove" onClick={() => { setNewThumb(null); setThumbPreview(null) }} aria-label={t(\'cancel\')}>×</button>'
)

content = content.replace(
    '<button className="toast-x" onClick={() => { setToast(null) }}>×</button>',
    '<button className="toast-x" onClick={() => { setToast(null) }} aria-label={t(\'cancel\')}>×</button>'
)

with open('clients/web/src/App.tsx', 'w') as f:
    f.write(content)
