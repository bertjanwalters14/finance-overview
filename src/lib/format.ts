export function formatEUR(n: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatEURPrecies(n: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPercent(n: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(n);
}
