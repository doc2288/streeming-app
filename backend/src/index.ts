import { env } from './config/env'
import { pool } from './db'
import { createApp } from './app'

async function bootstrap (): Promise<void> {
  const app = await createApp()

  const port = env.PORT
  app.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err != null) {
      app.log.error(err)
      process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
  })

  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
  for (const sig of signals) {
    process.on(sig, () => {
      Promise.all([app.close(), pool.end()])
        .then(() => process.exit(0))
        .catch((err) => {
          app.log.error(err)
          process.exit(1)
        })
    })
  }
}

void bootstrap()
