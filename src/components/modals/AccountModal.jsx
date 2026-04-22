import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import { accountsService } from '../../services/accounts.service'
import { ACCOUNT_TYPE_LABELS } from '../../utils/format'
import toast from 'react-hot-toast'

const TYPES = ['CHECKING','SAVINGS','CASH','CREDIT']
const EMPTY = { name: '', type: 'CHECKING', description: '' }

export default function AccountModal({ open, onClose, onSuccess, account }) {
  const [form, setForm]     = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (account) setForm({ name: account.name, type: account.type, description: account.description || '' })
    else setForm(EMPTY)
  }, [account, open])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (account) {
        await accountsService.update(account.id, form)
        toast.success('Conta atualizada!')
      } else {
        await accountsService.create(form)
        toast.success('Conta criada!')
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar conta')
    } finally {
      setLoading(false)
    }
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  return (
    <Modal open={open} onClose={onClose} title={account ? 'Editar Conta' : 'Nova Conta'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Nome da conta</label>
          <input className="input" required value={form.name}
            onChange={e => set('name', e.target.value)} placeholder="Ex: Nubank, Bradesco..." />
        </div>

        <div>
          <label className="label">Tipo</label>
          <div className="grid grid-cols-2 gap-2">
            {TYPES.map(t => (
              <button key={t} type="button"
                onClick={() => !account && set('type', t)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border text-left ${
                  form.type === t
                    ? 'bg-brand-500/15 text-brand-400 border-brand-500/30'
                    : 'bg-surface-100 text-slate-400 border-white/10 hover:border-white/20'
                } ${account ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                {ACCOUNT_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          {account && <p className="text-xs text-slate-500 mt-1">O tipo não pode ser alterado após criação.</p>}
        </div>

        <div>
          <label className="label">Descrição (opcional)</label>
          <input className="input" value={form.description}
            onChange={e => set('description', e.target.value)} placeholder="Descrição da conta..." />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={loading}>
            {loading && <Spinner size="sm" />}
            {account ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
