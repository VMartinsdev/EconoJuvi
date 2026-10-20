import { useMemo } from 'react'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import {
  CATEGORIES,
  MONTHLY_BUDGET,
  PEOPLE,
  PERSON_IDS,
} from '../data/constants'
import { formatBRL, formatShortDate, monthKey, monthLabel, shortMonth, toISODate } from '../lib/format'
import { useStore } from '../store'
import type { CategoryId, PersonId } from '../types'

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm">
      {title && <h2 className="mb-3 text-sm font-semibold text-muted">{title}</h2>}
      {children}
    </section>
  )
}

export default function Dashboard() {
  const { expenses } = useStore()

  const data = useMemo(() => {
    const now = new Date()
    const currentKey = monthKey(toISODate(now))
    const month = expenses.filter((e) => monthKey(e.date) === currentKey)

    const total = sum(month.map((e) => e.amount))
    const income = sum(Object.values(PEOPLE).map((p) => p.income))

    const byCategory = (Object.keys(CATEGORIES) as CategoryId[])
      .map((id) => ({
        id,
        ...CATEGORIES[id],
        value: sum(month.filter((e) => e.category === id).map((e) => e.amount)),
      }))
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value)

    const paid = Object.fromEntries(
      PERSON_IDS.map((id) => [id, sum(month.filter((e) => e.paidBy === id).map((e) => e.amount))]),
    ) as Record<PersonId, number>

    // gastos divididos meio a meio: quem pagou mais, tem a receber
    const fairShare = total / PERSON_IDS.length
    const [a, b] = PERSON_IDS
    const diff = paid[a] - fairShare
    const settle =
      Math.abs(diff) < 0.01 ? null : { from: diff > 0 ? b : a, to: diff > 0 ? a : b, amount: Math.abs(diff) }

    const history = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const key = monthKey(toISODate(d))
      return {
        label: shortMonth(d),
        total: sum(expenses.filter((e) => monthKey(e.date) === key).map((e) => e.amount)),
        current: i === 5,
      }
    })

    const recent = [...expenses]
      .sort((x, y) => (x.date === y.date ? 0 : x.date < y.date ? 1 : -1))
      .slice(0, 8)

    return { now, total, income, byCategory, paid, settle, history, recent }
  }, [expenses])

  const { total, income, settle } = data
  const balance = income - total
  const budgetPct = Math.min(100, (total / MONTHLY_BUDGET) * 100)
  const overBudget = total > MONTHLY_BUDGET

  return (
    <div className="flex flex-col gap-4">
      <header>
        <p className="text-sm text-muted">Olá, casal 👋</p>
        <h1 className="text-2xl font-bold">{monthLabel(data.now)}</h1>
      </header>

      <section className="rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 p-5 text-white shadow-md">
        <p className="text-sm opacity-90">Saldo do mês</p>
        <p className="text-4xl font-bold tracking-tight">{formatBRL(balance)}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/15 p-3">
            <p className="opacity-90">Receitas</p>
            <p className="text-lg font-semibold">{formatBRL(income)}</p>
          </div>
          <div className="rounded-xl bg-white/15 p-3">
            <p className="opacity-90">Gastos</p>
            <p className="text-lg font-semibold">{formatBRL(total)}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs opacity-90">
            <span>Meta de gastos</span>
            <span>
              {formatBRL(total)} / {formatBRL(MONTHLY_BUDGET)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/25">
            <div
              className={`h-full rounded-full ${overBudget ? 'bg-red-300' : 'bg-white'}`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>
      </section>

      <Card title="Quem pagou">
        <div className="flex flex-col gap-3">
          {PERSON_IDS.map((id) => {
            const pct = total > 0 ? (data.paid[id] / total) * 100 : 0
            return (
              <div key={id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{PEOPLE[id].name}</span>
                  <span className="text-muted">{formatBRL(data.paid[id])}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: PEOPLE[id].color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-4 rounded-xl bg-bg px-3 py-2 text-sm">
          {settle ? (
            <>
              🤝 <b>{PEOPLE[settle.from].name}</b> deve <b>{formatBRL(settle.amount)}</b> a{' '}
              <b>{PEOPLE[settle.to].name}</b> para fechar as contas.
            </>
          ) : (
            <>🤝 Tudo quite entre vocês!</>
          )}
        </p>
      </Card>

      <Card title="Gastos por categoria">
        <div className="flex items-center gap-4">
          <div className="relative h-36 w-36 shrink-0">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data.byCategory}
                  dataKey="value"
                  nameKey="label"
                  innerRadius="62%"
                  outerRadius="100%"
                  paddingAngle={2}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {data.byCategory.map((c) => (
                    <Cell key={c.id} fill={c.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-muted">Total</span>
              <span className="text-sm font-bold">{formatBRL(total)}</span>
            </div>
          </div>

          <ul className="flex min-w-0 flex-1 flex-col gap-1.5 text-sm">
            {data.byCategory.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                <span className="flex-1 truncate">{c.label}</span>
                <span className="text-muted">{Math.round((c.value / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title="Últimos 6 meses">
        <div className="h-40">
          <ResponsiveContainer>
            <BarChart data={data.history} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted)', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                formatter={(v) => formatBRL(Number(v))}
                labelFormatter={() => ''}
                separator=""
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  color: 'var(--ink)',
                }}
              />
              <Bar dataKey="total" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                {data.history.map((h, i) => (
                  <Cell key={i} fill={h.current ? 'var(--brand)' : 'var(--line)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Últimos lançamentos">
        <ul className="divide-y divide-line">
          {data.recent.map((e) => (
            <li key={e.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                style={{ background: `${CATEGORIES[e.category].color}22` }}
              >
                {CATEGORIES[e.category].emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{e.description}</p>
                <p className="text-xs text-muted">
                  {formatShortDate(e.date)} · {PEOPLE[e.paidBy].name}
                </p>
              </div>
              <span className="font-semibold">-{formatBRL(e.amount)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
