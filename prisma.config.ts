import { defineConfig } from 'prisma/config'
import * as fs from 'fs'
import * as path from 'path'

const envFile = fs.readFileSync(path.resolve('.env'), 'utf-8')
const dbUrl = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1] ?? ''

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: dbUrl,
  },
})