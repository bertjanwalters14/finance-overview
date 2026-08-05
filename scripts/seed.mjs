/**
 * Eenmalig: laadt seed-data/seed.json in de datastore.
 * Gebruikt Upstash Redis als KV_REST_API_URL/TOKEN zijn ingevuld in
 * .env.local, anders het lokale .data/store.json bestand (zelfde logica als
 * src/lib/kv.ts, hier gedupliceerd omdat dit script buiten Next.js draait).
 *
 * Run: node scripts/seed.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvLocal()

const seedPath = path.join(ROOT, 'seed-data', 'seed.json')
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))

const entries = []
for (const maand of seed.maanden) {
  entries.push([`maand:${maand.jaar}:${String(maand.maand).padStart(2, '0')}`, maand])
}
entries.push(['vermogen:huidig', seed.vermogen])
entries.push(['aandelenPayt', seed.aandelenPayt])
entries.push(['loonontwikkeling', seed.loonontwikkeling])
for (const doelen of seed.doelen) {
  entries.push([`doelen:${doelen.jaar}`, doelen])
}

const hasUpstash = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

if (hasUpstash) {
  const { Redis } = await import('@upstash/redis')
  const redis = Redis.fromEnv()
  for (const [key, value] of entries) {
    await redis.set(key, value)
  }
  console.log(`${entries.length} keys geschreven naar Upstash Redis.`)
} else {
  const storePath = path.join(ROOT, '.data', 'store.json')
  let store = {}
  try {
    store = JSON.parse(fs.readFileSync(storePath, 'utf-8'))
  } catch {
    // nog geen bestaand bestand, begin leeg
  }
  for (const [key, value] of entries) {
    store[key] = value
  }
  fs.mkdirSync(path.dirname(storePath), { recursive: true })
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2))
  console.log(`${entries.length} keys geschreven naar lokaal bestand: ${storePath}`)
  console.log('(Geen KV_REST_API_URL/TOKEN gevonden in .env.local, dus lokale fallback gebruikt.)')
}
