import { kvGet, kvSet, kvKeys } from './kv'
import type {
  Maand,
  BesteedbaarVermogen,
  OverigVermogen,
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

function besteedbaarVermogenKey(jaar: number, maand: number) {
  return `vermogen:besteedbaar:${jaar}:${String(maand).padStart(2, '0')}`
}

export async function setBesteedbaarVermogen(
  data: BesteedbaarVermogen
): Promise<void> {
  await kvSet(besteedbaarVermogenKey(data.jaar, data.maand), data)
}

export async function listBesteedbaarVermogenGeschiedenis(): Promise<
  BesteedbaarVermogen[]
> {
  const keys = await kvKeys('vermogen:besteedbaar:')
  const punten = await Promise.all(
    keys.map((k) => kvGet<BesteedbaarVermogen>(k))
  )
  return punten
    .filter((p): p is BesteedbaarVermogen => p !== null)
    .sort((a, b) => a.jaar - b.jaar || a.maand - b.maand)
}

export async function getLaatsteBesteedbaarVermogen(): Promise<BesteedbaarVermogen | null> {
  const geschiedenis = await listBesteedbaarVermogenGeschiedenis()
  return geschiedenis.at(-1) ?? null
}

const OVERIG_VERMOGEN_KEY = 'vermogen:overig'

export async function getOverigVermogen(): Promise<OverigVermogen | null> {
  return kvGet<OverigVermogen>(OVERIG_VERMOGEN_KEY)
}

export async function setOverigVermogen(data: OverigVermogen): Promise<void> {
  await kvSet(OVERIG_VERMOGEN_KEY, data)
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
