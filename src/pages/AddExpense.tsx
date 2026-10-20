import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, CATEGORY_IDS, PEOPLE, PERSON_IDS } from '../data/constants'
import { toISODate } from '../lib/format'
import { useStore } from '../store'
import type { CategoryId, PersonId } from '../types'

export default function AddExpense() {
  const { addExpense } = useStore()
  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<CategoryId>('mercado')
  const [paidBy, setPaidBy] = useState<PersonId>('vitor')
  const [date, setDate] = useState(() => toISODate(new Date()))

  // "1.234,56" (pt-BR) ou "12.50": com vírgula, o ponto é separador de milhar
  const value = Number(amount.includes(',') ? amount.replace(/\./g, '').replace(',', '.') : amount)
  const valid = Number.isFinite(value) && value > 0 && date !== ''

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!valid) return
    addExpense({
      amount: Math.round(value * 100) / 100,
      description: description.trim() || CATEGORIES[category].label,
      category,
      paidBy,
      date,
    })
    navigate('/')
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Lançar gasto</h1>

      <label className="block rounded-2xl bg-card p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">Valor</span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-muted">R$</span>
          <input
            inputMode="decimal"
            autoFocus
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ''))}
            className="w-full bg-transparent text-4xl font-bold outline-none placeholder:text-line"
          />
        </div>
      </label>

      <label className="block rounded-2xl bg-card p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">Descrição</span>
        <input
          placeholder="Ex.: Mercado do mês"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full bg-transparent outline-none placeholder:text-muted"
        />
      </label>

      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Categoria
        </legend>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORY_IDS.map((id) => {
            const c = CATEGORIES[id]
            const active = id === category
            return (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-1 py-3 text-[11px] font-medium ${
                  active ? 'border-brand bg-brand/10 text-ink' : 'border-transparent bg-card text-muted'
                }`}
              >
                <span className="text-2xl leading-none">{c.emoji}</span>
                {c.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Quem pagou
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {PERSON_IDS.map((id) => {
            const active = id === paidBy
            return (
              <button
                key={id}
                type="button"
                onClick={() => setPaidBy(id)}
                className={`flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-medium ${
                  active ? 'border-brand bg-brand/10' : 'border-transparent bg-card text-muted'
                }`}
              >
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ background: PEOPLE[id].color }}
                />
                {PEOPLE[id].name}
              </button>
            )
          })}
        </div>
      </fieldset>

      <label className="block rounded-2xl bg-card p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">Data</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full bg-transparent outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={!valid}
        className="rounded-2xl bg-brand py-4 text-lg font-semibold text-white shadow-sm active:opacity-80 disabled:opacity-40"
      >
        Salvar gasto
      </button>
    </form>
  )
}
