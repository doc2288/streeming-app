import sys

with open("/app/backend/src/index.ts", "r") as f:
    content = f.read()

original = "    process.on(sig, async () => {\n      await app.close()\n      await pool.end()\n      process.exit(0)\n    })"
replacement = "    process.on(sig, () => {\n      void (async () => {\n        await app.close()\n        await pool.end()\n        process.exit(0)\n      })()\n    })"

content = content.replace(original, replacement)

with open("/app/backend/src/index.ts", "w") as f:
    f.write(content)
