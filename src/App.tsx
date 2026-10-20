import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AddExpense from './pages/AddExpense'

const tabClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-0.5 pt-2 pb-1 text-[11px] font-medium ${
    isActive ? 'text-brand-ink' : 'text-muted'
  }`

export default function App() {
  return (
    <div className="mx-auto flex h-full max-w-md flex-col">
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lancar" element={<AddExpense />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>

      <nav className="flex border-t border-line bg-card pb-[env(safe-area-inset-bottom)]">
        <NavLink to="/" end className={tabClass}>
          <span className="text-2xl leading-none">📊</span>
          Resumo
        </NavLink>
        <NavLink to="/lancar" className={tabClass}>
          <span className="text-2xl leading-none">➕</span>
          Lançar gasto
        </NavLink>
      </nav>
    </div>
  )
}
