export interface VasteLast {
  naam: string
  bedrag: number
}

export interface Maand {
  jaar: number
  maand: number // 1-12
  loon: number
  overigeInkomsten: number
  vasteLasten: VasteLast[]
  doelSparen: number
  werkelijkGespaard: number
  beleggingInleg: number
}

// Besteedbaar vermogen (spaarrekening + belegging) schommelt vaak en wordt
// per kalendermaand gehistoriseerd, zodat je een trend kunt zien.
export interface BesteedbaarVermogen {
  jaar: number
  maand: number
  spaarrekening: number
  belegging: number
}

export function besteedbaarVermogenTotaal(b: BesteedbaarVermogen): number {
  return b.spaarrekening + b.belegging
}

// Overig vermogen (huis, hypotheek, schuld) verandert zelden, dus dit is één
// losse "huidige stand" zonder historie. Payt-aandelenwaarde staat hier
// bewust niet in — die wordt live berekend vanuit de aandelen-data, zodat
// een koerswijziging daar automatisch doorwerkt in het eigen vermogen.
export interface OverigVermogen {
  huisWaarde: number
  hypotheek: number
  // Jouw aandeel (0-100%) in de overwaarde, bv. bij gedeeld eigendom van het
  // huis. De overwaarde zelf (huisWaarde - hypotheek) wordt niet los
  // opgeslagen, maar altijd berekend — zie berekenOverwaarde.
  overwaardePercentage: number
  schuld: number
  bijgewerktOp: string
}

export function berekenOverwaarde(o: OverigVermogen): number {
  return o.huisWaarde - o.hypotheek
}

export function berekenOverwaardeAandeel(o: OverigVermogen): number {
  return berekenOverwaarde(o) * (o.overwaardePercentage / 100)
}

export function berekenEigenVermogen(
  besteedbaar: BesteedbaarVermogen,
  overig: OverigVermogen,
  aandelenPaytWaarde: number
): number {
  return (
    besteedbaarVermogenTotaal(besteedbaar) +
    aandelenPaytWaarde +
    berekenOverwaardeAandeel(overig) -
    overig.schuld
  )
}

export interface AandeelhouderPayt {
  naam: string
  aantal: number
  inleg: number
  dividend: number
  // Telt dit mee in jouw eigen vermogen (dashboard/vermogen-pagina)?
  vanJou: boolean
}

export interface AandelenPaytData {
  koersPerAandeel: number
  aandeelhouders: AandeelhouderPayt[]
}

export function berekenAandelenWaarde(
  a: AandeelhouderPayt,
  koersPerAandeel: number
): number {
  return a.aantal * koersPerAandeel
}

// rendement als multiplier (waarde / inleg), bv. 6.28x
export function berekenRendement(
  a: AandeelhouderPayt,
  koersPerAandeel: number
): number {
  if (a.inleg === 0) return 0
  return berekenAandelenWaarde(a, koersPerAandeel) / a.inleg
}

// Som van de waarde van alle aandeelhouders die als "van jou" zijn gemarkeerd.
export function berekenEigenAandelenWaarde(data: AandelenPaytData): number {
  return data.aandeelhouders
    .filter((a) => a.vanJou)
    .reduce((s, a) => s + berekenAandelenWaarde(a, data.koersPerAandeel), 0)
}

export interface LoonEntry {
  jaar: number
  werkgever: string
  bedrag: number
}

export interface DoelCategorie {
  naam: string
  bedragenPerMaand: number[]
}

export interface JaarDoelen {
  jaar: number
  doelPerMaand: number[]
  werkelijkPerMaand: number[]
  categorieen: DoelCategorie[]
}

export const MAAND_NAMEN = [
  'Januari',
  'Februari',
  'Maart',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Augustus',
  'September',
  'Oktober',
  'November',
  'December',
] as const
