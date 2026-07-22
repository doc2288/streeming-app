with open("clients/web/src/main.tsx", "r") as f:
    c = f.read()
c = c.replace("  </React.StrictMode>\n)", "  </React.StrictMode>\n)\n}")
with open("clients/web/src/main.tsx", "w") as f:
    f.write(c)
