const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatBRL = (value: number) => brl.format(value)

/** Data local no formato AAAA-MM-DD (evita o deslocamento de fuso do toISOString). */
export function toISODate(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function parseISODate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatShortDate(iso: string) {
  return parseISODate(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
}

export function monthKey(iso: string) {
  return iso.slice(0, 7)
}

export function monthLabel(d: Date) {
  const s = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function shortMonth(d: Date) {
  return d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
}
