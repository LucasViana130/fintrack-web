import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, Pencil, Trash2, ArrowLeftRight } from 'lucide-react'
import { transactionsService } from '../services/transactions.service'
import { categoriesService } from '../services/categories.service'
import { accountsService } from '../services/accounts.service'
import TransactionModal from '../components/modals/TransactionModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { formatCurrency, formatDate, firstDayOfMonth, lastDayOfMonth } from '../utils/format'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function TransactionsPage() {
  const [transactions, setTrans] = useState([])
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [deleting, setDeleting]   = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [filters, setFilters]     = useState({
    type: '', categoryId: '', accountId: '',
    startDate: firstDayOfMonth(), endDate: lastDayOfMonth()
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, size: 10 }
      if (filters.type)       params.type = filters.type
      if (filters.categoryId) params.categoryId = filters.categoryId
      if (filters.accountId)  params.accountId = filters.accountId
      if (filters.startDate)  params.startDate = filters.startDate
      if (filters.endDate)    params.endDate = filters.endDate
      const data = await transactionsService.list(params)
      setTrans(data.content || [])
      setTotalPages(data.totalPages || 0)
    } finally { setLoading(false) }
  }, [page, filters])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    Promise.all([categoriesService.list(), accountsService.list()])
      .then(([cats, accs]) => { setCategories(cats); setAccounts(accs) })
  }, [])

  async function handleDelete() {
    setDelLoading(true)
    try {
      await transactionsService.delete(deleting.id)
      toast.success('Transação deletada!')
      setDeleting(null)
      load()
    } catch { toast.error('Erro ao deletar') }
    finally { setDelLoading(false) }
  }

  function setFilter(k, v) { setFilters(f => ({ ...f, [k]: v })); setPage(0) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Transações</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gerencie suas receitas e despesas</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setEditing(null); setShowModal(true) }}>
          <Plus size={16} /> Nova transação
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 animate-fade-in">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="label text-xs">Tipo</label>
            <select className="input text-sm py-2" value={filters.type} onChange={e => setFilter('type', e.target.value)}>
              <option value="">Todos</option>
              <option value="INCOME">Receitas</option>
              <option value="EXPENSE">Despesas</option>
            </select>
          </div>
          <div>
            <label className="label text-xs">Categoria</label>
            <select className="input text-sm py-2" value={filters.categoryId} onChange={e => setFilter('categoryId', e.target.value)}>
              <option value="">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label text-xs">Conta</label>
            <select className="input text-sm py-2" value={filters.accountId} onChange={e => setFilter('accountId', e.target.value)}>
              <option value="">Todas</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label text-xs">De</label>
            <input className="input text-sm py-2" type="date" value={filters.startDate}
              onChange={e => setFilter('startDate', e.target.value)} />
          </div>
          <div>
            <label className="label text-xs">Até</label>
            <input className="input text-sm py-2" type="date" value={filters.endDate}
              onChange={e => setFilter('endDate', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden animate-fade-in">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
        ) : transactions.length === 0 ? (
          <EmptyState icon={ArrowLeftRight} title="Nenhuma transação encontrada"
            description="Tente ajustar os filtros ou registre uma nova transação."
            action={<button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowModal(true)}><Plus size={14}/>Nova transação</button>} />
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Data','Descrição','Conta','Categoria','Tipo','Valor',''].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-4 py-3 text-sm text-slate-400 font-mono">{formatDate(t.date)}</td>
                    <td className="px-4 py-3 text-sm text-slate-200 max-w-xs truncate">{t.description || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{t.account?.name}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-sm text-slate-300">
                        <span className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: t.category?.color || '#64748b' }} />
                        {t.category?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {t.type === 'INCOME'
                        ? <span className="badge-income">Receita</span>
                        : <span className="badge-expense">Despesa</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx('text-sm font-semibold', t.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400')}>
                        {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="btn-ghost p-1.5 rounded-lg" onClick={() => { setEditing(t); setShowModal(true) }}>
                          <Pencil size={14} />
                        </button>
                        <button className="btn-ghost p-1.5 rounded-lg hover:text-red-400" onClick={() => setDeleting(t)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4 border-t border-white/5">
                <button className="btn-secondary text-sm px-3 py-1.5" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Anterior</button>
                <span className="text-sm text-slate-500">{page + 1} / {totalPages}</span>
                <button className="btn-secondary text-sm px-3 py-1.5" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Próximo →</button>
              </div>
            )}
          </>
        )}
      </div>

      <TransactionModal open={showModal} onClose={() => { setShowModal(false); setEditing(null) }}
        onSuccess={load} transaction={editing} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        loading={delLoading} title="Deletar transação"
        message={`Tem certeza que deseja deletar esta transação de ${formatCurrency(deleting?.amount)}? Esta ação não pode ser desfeita.`} />
    </div>
  )
}
