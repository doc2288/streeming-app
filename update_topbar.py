with open('clients/web/src/components/TopBar.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<button type="button" className="search-clear" onClick={() => { setQuery(\'\'); onSearch(\'\') }}>×</button>',
    '<button type="button" className="search-clear" onClick={() => { setQuery(\'\'); onSearch(\'\') }} aria-label={t(\'cancel\')}>×</button>'
)

with open('clients/web/src/components/TopBar.tsx', 'w') as f:
    f.write(content)
