import type { CategoryId, Expense, PersonId } from '../types'
import { toISODate } from '../lib/format'

interface Template {
  description: string
  amount: number
  /** variação percentual máxima (0–1) sobre o valor base */
  variance: number
  category: CategoryId
  paidBy: PersonId
  day: number
}

const TEMPLATES: Template[] = [
  { description: 'Aluguel', amount: 2200, variance: 0, category: 'moradia', paidBy: 'vitor', day: 5 },
  { description: 'Condomínio', amount: 480, variance: 0.03, category: 'moradia', paidBy: 'juvi', day: 8 },
  { description: 'Energia', amount: 210, variance: 0.25, category: 'contas', paidBy: 'vitor', day: 10 },
  { description: 'Internet', amount: 119.9, variance: 0, category: 'contas', paidBy: 'juvi', day: 12 },
  { description: 'Mercado semanal', amount: 380, variance: 0.2, category: 'mercado', paidBy: 'juvi', day: 3 },
  { description: 'Mercado semanal', amount: 340, variance: 0.2, category: 'mercado', paidBy: 'vitor', day: 10 },
  { description: 'Mercado semanal', amount: 410, variance: 0.2, category: 'mercado', paidBy: 'juvi', day: 17 },
  { description: 'Mercado semanal', amount: 360, variance: 0.2, category: 'mercado', paidBy: 'vitor', day: 24 },
  { description: 'Combustível', amount: 220, variance: 0.15, category: 'transporte', paidBy: 'vitor', day: 6 },
  { description: 'Uber', amount: 38, variance: 0.4, category: 'transporte', paidBy: 'juvi', day: 14 },
  { description: 'Jantar fora', amount: 185, variance: 0.3, category: 'restaurantes', paidBy: 'vitor', day: 7 },
  { description: 'iFood', amount: 72, variance: 0.3, category: 'restaurantes', paidBy: 'juvi', day: 15 },
  { description: 'Pizza de sábado', amount: 96, variance: 0.2, category: 'restaurantes', paidBy: 'vitor', day: 21 },
  { description: 'Cinema', amount: 64, variance: 0.1, category: 'lazer', paidBy: 'juvi', day: 13 },
  { description: 'Streaming', amount: 55.9, variance: 0, category: 'lazer', paidBy: 'vitor', day: 2 },
  { description: 'Farmácia', amount: 92, variance: 0.5, category: 'saude', paidBy: 'juvi', day: 18 },
  { description: 'Presente', amount: 150, variance: 0.4, category: 'outros', paidBy: 'vitor', day: 20 },
]

/** Pseudo-aleatório determinístico: o mock é sempre igual para o mesmo mês. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/** Despesas do mês atual e dos 5 anteriores, relativas à data de hoje. */
export function buildMockExpenses(today = new Date()): Expense[] {
  const out: Expense[] = []

  for (let back = 0; back < 6; back++) {
    const base = new Date(today.getFullYear(), today.getMonth() - back, 1)
    const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()

    TEMPLATES.forEach((t, i) => {
      // no mês atual, só entram lançamentos até hoje
      if (back === 0 && t.day > today.getDate()) return

      const seed = base.getMonth() * 100 + i + back * 7
      const factor = 1 + (rand(seed) * 2 - 1) * t.variance
      const day = Math.min(t.day, lastDay)

      out.push({
        id: `mock-${back}-${i}`,
        description: t.description,
        amount: Math.round(t.amount * factor * 100) / 100,
        category: t.category,
        paidBy: t.paidBy,
        date: toISODate(new Date(base.getFullYear(), base.getMonth(), day)),
      })
    })
  }

  return out
}
