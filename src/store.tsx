import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Expense } from './types'
import { buildMockExpenses } from './data/mock'

const STORAGE_KEY = 'econojuvi:expenses:v1'

interface Store {
  expenses: Expense[]
  addExpense: (e: Omit<Expense, 'id'>) => void
}

const Ctx = createContext<Store | null>(null)

function load(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Expense[]
  } catch {
    // storage indisponível ou corrompido: cai no mock
  }
  return buildMockExpenses()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    } catch {
      // ignora
    }
  }, [expenses])

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setExpenses((prev) => [{ ...e, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }, ...prev])
  }, [])

  const value = useMemo(() => ({ expenses, addExpense }), [expenses, addExpense])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore fora do StoreProvider')
  return v
}
