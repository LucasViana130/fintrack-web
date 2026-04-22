import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Wallet, Plus, ArrowLeftRight } from 'lucide-react'
import { reportsService } from '../services/reports.service'
import { transactionsService } from '../services/transactions.service'
import { accountsService } from '../services/accounts.service'
import BalanceEvolutionChart from '../components/charts/BalanceEvolutionChart'
import ExpensesByCategoryChart from '../components/charts/ExpensesByCategoryChart'
import TransactionModal from '../components/modals/TransactionModal'
import SkeletonCard from '../components/ui/SkeletonCard'
import { formatCurrency, formatDate, currentYearMonth, firstDayOfMonth, lastDayOfMonth } from '../utils/format'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

export default function DashboardPage() {
  const { user }                  = useAuth()
  const [summary, setSummary]     = useState(null)
  const [evolution, setEvolution] = useState([])
  const [categories, setCategories] = useState([])
  const [transactions, setTrans]  = useState([])
  const [accounts, setAccounts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const { year, month }           = currentYearMonth()

  async function load() {
    setLoading(true)
    try {
      const [sum, evo, cats, trans, accs] = await Promise.all([
        reportsService.getMonthlySummary(year, month),
        reportsService.getBalanceEvolution(),
        reportsService.getExpensesByCategory(firstDayOfMonth(), lastDayOfMonth()),
        transactionsService.list({ page: 0, size: 5 }),
        accountsService.list(),
      ])
      setSummary(sum)
      setEvolution(evo)
      setCategories(cats)
      setTrans(trans.content || [])
      setAccounts(accs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Olá, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Aqui está seu resumo financeiro</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Nova transação
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className={`stagger-${i+1} animate-fade-in`} />)
        ) : (
          <>
            <StatCard
              label="Saldo total"
              value={totalBalance}
              icon={Wallet}
              iconColor="text-brand-400"
              iconBg="bg-brand-500/10"
              className="stagger-1 animate-slide-up"
              valueColor={totalBalance >= 0 ? 'text-white' : 'text-red-400'}
            />
            <StatCard
              label="Receitas do mês"
              value={summary?.totalIncome}
              icon={TrendingUp}
              iconColor="text-emerald-400"
              iconBg="bg-emerald-500/10"
              className="stagger-2 animate-slide-up"
              valueColor="text-emerald-400"
            />
            <StatCard
              label="Despesas do mês"
              value={summary?.totalExpense}
              icon={TrendingDown}
              iconColor="text-red-400"
              iconBg="bg-red-500/10"
              className="stagger-3 animate-slide-up"
              valueColor="text-red-400"
            />
            <StatCard
              label="Saldo do mês"
              value={summary?.balance}
              icon={ArrowLeftRight}
              iconColor="text-purple-400"
              iconBg="bg-purple-500/10"
              className="stagger-4 animate-slide-up"
              valueColor={summary?.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5 animate-fade-in stagger-3">
          <h2 className="font-display font-semibold text-white mb-4">Evolução financeira</h2>
          {loading ? <div className="h-64 shimmer rounded-xl" /> : <BalanceEvolutionChart data={evolution} />}
        </div>
        <div className="card p-5 animate-fade-in stagger-4">
          <h2 className="font-display font-semibold text-white mb-4">Despesas por categoria</h2>
          {loading ? <div className="h-64 shimmer rounded-xl" /> : <ExpensesByCategoryChart data={categories} />}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent transactions */}
        <div className="lg:col-span-2 card p-5 animate-fade-in stagger-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">Últimas transações</h2>
            <a href="/transactions" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Ver todas →</a>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 shimmer rounded-xl" />)}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">Nenhuma transação registrada</p>
          ) : (
            <div className="space-y-2">
              {transactions.map(t => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ backgroundColor: (t.category?.color || '#0c8de4') + '20', color: t.category?.color || '#0c8de4' }}>
                    {t.category?.name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{t.description || t.category?.name}</p>
                    <p className="text-xs text-slate-500">{formatDate(t.date)} · {t.category?.name}</p>
                  </div>
                  <span className={clsx('text-sm font-semibold', t.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400')}>
                    {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accounts */}
        <div className="card p-5 animate-fade-in stagger-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">Contas</h2>
            <a href="/accounts" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">Gerenciar →</a>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 shimmer rounded-xl" />)}
            </div>
          ) : accounts.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">Nenhuma conta cadastrada</p>
          ) : (
            <div className="space-y-2">
              {accounts.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-100">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{a.name}</p>
                    <p className="text-xs text-slate-500">{a.type}</p>
                  </div>
                  <span className={clsx('text-sm font-semibold', a.balance >= 0 ? 'text-slate-200' : 'text-red-400')}>
                    {formatCurrency(a.balance)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TransactionModal open={showModal} onClose={() => setShowModal(false)} onSuccess={load} />
    </div>
  )
}

function StatCard({ label, value, icon: Icon, iconColor, iconBg, className, valueColor = 'text-white' }) {
  return (
    <div className={clsx('stat-card', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon size={15} className={iconColor} />
        </div>
      </div>
      <p className={clsx('text-2xl font-display font-bold', valueColor)}>
        {formatCurrency(value)}
      </p>
    </div>
  )
}
