import { kvGet, kvSet, kvKeys } from './kv'
import type {
  Maand,
  Vermogen,
  AandelenPaytData,
  LoonEntry,
  JaarDoelen,
} from './types'

function maandKey(jaar: number, maand: number) {
  return `maand:${jaar}:${String(maand).padStart(2, '0')}`
}

export async function getMaand(
  jaar: number,
  maand: number
): Promise<Maand | null> {
  return kvGet<Maand>(maandKey(jaar, maand))
}

export async function setMaand(data: Maand): Promise<void> {
  await kvSet(maandKey(data.jaar, data.maand), data)
}

export async function listMaandenVanJaar(jaar: number): Promise<Maand[]> {
  const keys = await kvKeys(`maand:${jaar}:`)
  const maanden = await Promise.all(keys.map((k) => kvGet<Maand>(k)))
  return maanden
    .filter((m): m is Maand => m !== null)
    .sort((a, b) => a.maand - b.maand)
}

const VERMOGEN_KEY = 'vermogen:huidig'

export async function getVermogen(): Promise<Vermogen | null> {
  return kvGet<Vermogen>(VERMOGEN_KEY)
}

export async function setVermogen(data: Vermogen): Promise<void> {
  await kvSet(VERMOGEN_KEY, data)
}

const AANDELEN_KEY = 'aandelenPayt'

export async function getAandelenPayt(): Promise<AandelenPaytData> {
  return (
    (await kvGet<AandelenPaytData>(AANDELEN_KEY)) ?? {
      koersPerAandeel: 0,
      aandeelhouders: [],
    }
  )
}

export async function setAandelenPayt(data: AandelenPaytData): Promise<void> {
  await kvSet(AANDELEN_KEY, data)
}

const LOON_KEY = 'loonontwikkeling'

export async function getLoonontwikkeling(): Promise<LoonEntry[]> {
  return (await kvGet<LoonEntry[]>(LOON_KEY)) ?? []
}

export async function setLoonontwikkeling(data: LoonEntry[]): Promise<void> {
  await kvSet(LOON_KEY, data)
}

function doelenKey(jaar: number) {
  return `doelen:${jaar}`
}

export async function getDoelen(jaar: number): Promise<JaarDoelen | null> {
  return kvGet<JaarDoelen>(doelenKey(jaar))
}

export async function setDoelen(data: JaarDoelen): Promise<void> {
  await kvSet(doelenKey(data.jaar), data)
}

export async function listDoelenJaren(): Promise<number[]> {
  const keys = await kvKeys('doelen:')
  return keys
    .map((k) => Number(k.split(':')[1]))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => b - a)
}
