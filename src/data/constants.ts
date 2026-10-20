import type { CategoryId, PersonId } from '../types'

export const PEOPLE: Record<PersonId, { name: string; color: string; income: number }> = {
  vitor: { name: 'Vitor', color: '#6366f1', income: 6500 },
  juvi: { name: 'Juvi', color: '#ec4899', income: 4800 },
}

export const PERSON_IDS = Object.keys(PEOPLE) as PersonId[]

export const CATEGORIES: Record<CategoryId, { label: string; emoji: string; color: string }> = {
  mercado: { label: 'Mercado', emoji: '🛒', color: '#10b981' },
  moradia: { label: 'Moradia', emoji: '🏠', color: '#6366f1' },
  contas: { label: 'Contas', emoji: '💡', color: '#f59e0b' },
  transporte: { label: 'Transporte', emoji: '🚗', color: '#0ea5e9' },
  restaurantes: { label: 'Comer fora', emoji: '🍽️', color: '#ef4444' },
  lazer: { label: 'Lazer', emoji: '🎬', color: '#ec4899' },
  saude: { label: 'Saúde', emoji: '💊', color: '#14b8a6' },
  outros: { label: 'Outros', emoji: '📦', color: '#94a3b8' },
}

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[]

/** Meta de gastos mensal do casal (mock). */
export const MONTHLY_BUDGET = 8000
