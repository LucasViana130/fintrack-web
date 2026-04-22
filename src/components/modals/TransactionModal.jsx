import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import { transactionsService } from '../../services/transactions.service'
import { accountsService } from '../../services/accounts.service'
import { categoriesService } from '../../services/categories.service'
import { today } from '../../utils/format'
import toast from 'react-hot-toast'

const EMPTY = { accountId: '', categoryId: '', type: 'EXPENSE', amount: '', description: '', date: today() }

export default function TransactionModal({ open, onClose, onSuccess, transaction }) {
  const [form, setForm]           = useState(EMPTY)
  const [accounts, setAccounts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (!open) return
    Promise.all([accountsService.list(), categoriesService.list()])
      .then(([accs, cats]) => { setAccounts(accs); setCategories(cats) })
  }, [open])

  useEffect(() => {
    if (transaction) {
      setForm({
        accountId:   transaction.account?.id || '',
        categoryId:  transaction.category?.id || '',
        type:        transaction.type,
        amount:      transaction.amount,
        description: transaction.description || '',
        date:        transaction.date,
      })
    } else {
      setForm(EMPTY)
    }
  }, [transaction, open])

  const filtered = categories.filter(c => c.type === form.type)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount), accountId: +form.accountId, categoryId: +form.categoryId }
      if (transaction) {
        await transactionsService.update(transaction.id, payload)
        toast.success('Transação atualizada!')
      } else {
        await transactionsService.create(payload)
        toast.success('Transação registrada!')
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar transação')
    } finally {
      setLoading(false)
    }
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  return (
    <Modal open={open} onClose={onClose} title={transaction ? 'Editar Transação' : 'Nova Transação'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo */}
        <div className="grid grid-cols-2 gap-2">
          {['EXPENSE','INCOME'].map(t => (
            <button key={t} type="button"
              className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                form.type === t
                  ? t === 'INCOME'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/15 text-red-400 border-red-500/30'
                  : 'bg-surface-100 text-slate-400 border-white/10 hover:border-white/20'
              }`}
              onClick={() => set('type', t)}
            >
              {t === 'INCOME' ? 'Receita' : 'Despesa'}
            </button>
          ))}
        </div>

        {/* Valor */}
        <div>
          <label className="label">Valor (R$)</label>
          <input className="input" type="number" step="0.01" min="0.01" required
            value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0,00" />
        </div>

        {/* Conta */}
        <div>
          <label className="label">Conta</label>
          <select className="input" required value={form.accountId} onChange={e => set('accountId', e.target.value)}>
            <option value="">Selecione a conta</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className="label">Categoria</label>
          <select className="input" required value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
            <option value="">Selecione a categoria</option>
            {filtered.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Data */}
        <div>
          <label className="label">Data</label>
          <input className="input" type="date" required
            value={form.date} onChange={e => set('date', e.target.value)}
            max={today()} />
        </div>

        {/* Descrição */}
        <div>
          <label className="label">Descrição (opcional)</label>
          <input className="input" type="text"
            value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Ex: Supermercado, Salário..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={loading}>
            {loading && <Spinner size="sm" />}
            {transaction ? 'Salvar' : 'Registrar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
