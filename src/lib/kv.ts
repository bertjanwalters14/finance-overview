import { Redis } from '@upstash/redis'
import fs from 'fs'
import path from 'path'

const hasUpstash = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
)

const redis = hasUpstash ? Redis.fromEnv() : null

// Zolang er geen Upstash-credentials zijn ingevuld in .env.local, valt de app
// terug op een lokaal JSON-bestand zodat je zonder externe database kunt
// ontwikkelen en testen. In productie (Vercel) staan de KV_REST_API_* env
// vars wel, dus daar wordt altijd Redis gebruikt.
const LOCAL_STORE_PATH = path.join(process.cwd(), '.data', 'store.json')

function readLocalStore(): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

function writeLocalStore(store: Record<string, unknown>) {
  fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true })
  fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2))
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (redis) {
    return (await redis.get<T>(key)) ?? null
  }
  const store = readLocalStore()
  return (store[key] as T | undefined) ?? null
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  if (redis) {
    await redis.set(key, value)
    return
  }
  const store = readLocalStore()
  store[key] = value
  writeLocalStore(store)
}

export async function kvKeys(prefix: string): Promise<string[]> {
  if (redis) {
    return redis.keys(`${prefix}*`)
  }
  const store = readLocalStore()
  return Object.keys(store).filter((k) => k.startsWith(prefix))
}
