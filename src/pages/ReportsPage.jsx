import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { reportsService } from '../services/reports.service'
import BalanceEvolutionChart from '../components/charts/BalanceEvolutionChart'
import ExpensesByCategoryChart from '../components/charts/ExpensesByCategoryChart'
import Spinner from '../components/ui/Spinner'
import { formatCurrency, currentYearMonth, firstDayOfMonth, lastDayOfMonth } from '../utils/format'
import clsx from 'clsx'

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export default function ReportsPage() {
  const now = currentYearMonth()
  const [year, setYear]           = useState(now.year)
  const [month, setMonth]         = useState(now.month)
  const [summary, setSummary]     = useState(null)
  const [evolution, setEvolution] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(true)

  const startDate = `${year}-${String(month).padStart(2,'0')}-01`
  const endDate   = (() => { const d = new Date(year, month, 0); return `${year}-${String(month).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })()

  async function load() {
    setLoading(true)
    try {
      const [sum, evo, cats] = await Promise.all([
        reportsService.getMonthlySummary(year, month),
        reportsService.getBalanceEvolution(),
        reportsService.getExpensesByCategory(startDate, endDate),
      ])
      setSummary(sum)
      setEvolution(evo)
      setCategories(cats)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [year, month])

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
  }
  const isCurrentMonth = year === now.year && month === now.month

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Relatórios</h1>
          <p className="text-slate-500 text-sm mt-0.5">Análise financeira detalhada</p>
        </div>
        {/* Month navigator */}
        <div className="flex items-center gap-2 card px-3 py-2">
          <button className="btn-ghost p-1 rounded-lg" onClick={prevMonth}><ChevronLeft size={16}/></button>
          <span className="text-sm font-medium text-slate-200 min-w-28 text-center">
            {MONTHS[month-1]} {year}
          </span>
          <button className="btn-ghost p-1 rounded-lg" disabled={isCurrentMonth} onClick={nextMonth}>
            <ChevronRight size={16} className={isCurrentMonth ? 'opacity-30' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
            <SummaryCard label="Total de receitas" value={summary?.totalIncome} color="text-emerald-400" bg="bg-emerald-500/5 border-emerald-500/15" />
            <SummaryCard label="Total de despesas" value={summary?.totalExpense} color="text-red-400" bg="bg-red-500/5 border-red-500/15" />
            <SummaryCard
              label="Saldo do mês"
              value={summary?.balance}
              color={summary?.balance >= 0 ? 'text-brand-400' : 'text-red-400'}
              bg={summary?.balance >= 0 ? 'bg-brand-500/5 border-brand-500/15' : 'bg-red-500/5 border-red-500/15'}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card p-5 animate-fade-in">
              <h2 className="font-display font-semibold text-white mb-4">Evolução dos últimos 12 meses</h2>
              <BalanceEvolutionChart data={evolution} />
            </div>
            <div className="card p-5 animate-fade-in">
              <h2 className="font-display font-semibold text-white mb-4">Despesas por categoria</h2>
              <ExpensesByCategoryChart data={categories} />
            </div>
          </div>

          {/* Category breakdown */}
          {categories.length > 0 && (
            <div className="card p-5 animate-fade-in">
              <h2 className="font-display font-semibold text-white mb-4">Detalhamento por categoria</h2>
              <div className="space-y-3">
                {categories.map(c => (
                  <div key={c.categoryId} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color || '#64748b' }} />
                    <span className="text-sm text-slate-300 flex-1">{c.categoryName}</span>
                    <div className="flex-1 max-w-48 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${c.percentage}%`, backgroundColor: c.color || '#64748b' }} />
                    </div>
                    <span className="text-xs text-slate-500 w-10 text-right">{c.percentage?.toFixed(1)}%</span>
                    <span className="text-sm font-medium text-slate-200 w-28 text-right">{formatCurrency(c.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SummaryCard({ label, value, color, bg }) {
  return (
    <div className={clsx('card p-5 border', bg)}>
      <p className="text-sm text-slate-500 mb-2">{label}</p>
      <p className={clsx('font-display text-2xl font-bold', color)}>{formatCurrency(value)}</p>
    </div>
  )
}
