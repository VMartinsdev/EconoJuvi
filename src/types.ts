export type PersonId = 'vitor' | 'juvi'

export type CategoryId =
  | 'mercado'
  | 'moradia'
  | 'contas'
  | 'transporte'
  | 'restaurantes'
  | 'lazer'
  | 'saude'
  | 'outros'

export interface Expense {
  id: string
  description: string
  /** valor em reais */
  amount: number
  category: CategoryId
  paidBy: PersonId
  /** AAAA-MM-DD */
  date: string
}
