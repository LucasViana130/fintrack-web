import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, CreditCard, TrendingUp, TrendingDown } from 'lucide-react'
import { accountsService } from '../services/accounts.service'
import AccountModal from '../components/modals/AccountModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { formatCurrency, ACCOUNT_TYPE_LABELS } from '../utils/format'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const TYPE_ICONS = { CHECKING: '🏦', SAVINGS: '🐖', CASH: '💵', CREDIT: '💳' }

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [delLoading, setDelLoading] = useState(false)

  async function load() {
    setLoading(true)
    try { setAccounts(await accountsService.list()) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    setDelLoading(true)
    try {
      await accountsService.deactivate(deleting.id)
      toast.success('Conta desativada!')
      setDeleting(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao desativar conta')
    } finally { setDelLoading(false) }
  }

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Contas</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gerencie suas contas bancárias</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setEditing(null); setShowModal(true) }}>
          <Plus size={16} /> Nova conta
        </button>
      </div>

      {/* Total */}
      {!loading && accounts.length > 0 && (
        <div className="card p-5 border border-brand-500/20 animate-fade-in">
          <p className="text-sm text-slate-500 mb-1">Saldo total consolidado</p>
          <p className={clsx('font-display text-3xl font-bold', totalBalance >= 0 ? 'text-white' : 'text-red-400')}>
            {formatCurrency(totalBalance)}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
      ) : accounts.length === 0 ? (
        <div className="card">
          <EmptyState icon={CreditCard} title="Nenhuma conta cadastrada"
            description="Crie sua primeira conta para começar a registrar transações."
            action={<button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowModal(true)}><Plus size={14}/>Nova conta</button>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((a, i) => (
            <div key={a.id} className={`card p-5 group hover:border-white/10 transition-all animate-slide-up stagger-${Math.min(i+1,6)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-lg">
                    {TYPE_ICONS[a.type]}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{a.name}</p>
                    <p className="text-xs text-slate-500">{ACCOUNT_TYPE_LABELS[a.type]}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="btn-ghost p-1.5 rounded-lg text-sm" onClick={() => { setEditing(a); setShowModal(true) }}>
                    <Pencil size={14} />
                  </button>
                  <button className="btn-ghost p-1.5 rounded-lg hover:text-red-400 text-sm" onClick={() => setDeleting(a)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Saldo atual</p>
                <p className={clsx('font-display text-2xl font-bold', a.balance >= 0 ? 'text-white' : 'text-red-400')}>
                  {formatCurrency(a.balance)}
                </p>
              </div>

              {a.description && <p className="text-xs text-slate-500 mt-3 truncate">{a.description}</p>}
            </div>
          ))}
        </div>
      )}

      <AccountModal open={showModal} onClose={() => { setShowModal(false); setEditing(null) }}
        onSuccess={load} account={editing} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        loading={delLoading} title="Desativar conta"
        message={`Tem certeza que deseja desativar a conta "${deleting?.name}"? Ela não aparecerá mais nas listagens.`} />
    </div>
  )
}
