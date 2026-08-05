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

export interface Vermogen {
  spaarrekening: number
  belegging: number
  aandelenPaytWaarde: number
  huisWaarde: number
  hypotheek: number
  // Jouw deel in de overwaarde van het huis (bv. bij gedeeld eigendom is dit
  // niet automatisch huisWaarde - hypotheek, maar een los ingevuld bedrag).
  overwaardeAandeel: number
  schuld: number
  bijgewerktOp: string
}

// eigenVermogen = spaarrekening + belegging + aandelenPaytWaarde + overwaardeAandeel - schuld
export function berekenEigenVermogen(v: Vermogen): number {
  return (
    v.spaarrekening +
    v.belegging +
    v.aandelenPaytWaarde +
    v.overwaardeAandeel -
    v.schuld
  )
}

export interface AandeelhouderPayt {
  naam: string
  aantal: number
  inleg: number
  waarde: number
  rendement: number
  dividend: number
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
