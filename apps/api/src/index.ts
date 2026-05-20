import { serve } from '@hono/node-server'
import { createApp } from './server/app.js'
import { connectDatabase } from './db/index.js'

const port = process.env.PORT ? Number(process.env.PORT) : 3001
const dbPath = process.env.DB_PATH || './data/krill.db'

connectDatabase(dbPath)

const app = createApp()

serve({ fetch: app.fetch, port })

console.log(`API running at http://localhost:${port}`)
console.log(`API docs at http://localhost:${port}/docs`)
