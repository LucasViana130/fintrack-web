import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import { categoriesService } from '../../services/categories.service'
import toast from 'react-hot-toast'

const COLORS = ['#0c8de4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#06b6d4','#84cc16']
const EMPTY  = { name: '', type: 'EXPENSE', color: '#0c8de4' }

export default function CategoryModal({ open, onClose, onSuccess, category }) {
  const [form, setForm]     = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) setForm({ name: category.name, type: category.type, color: category.color || '#0c8de4' })
    else setForm(EMPTY)
  }, [category, open])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (category) {
        await categoriesService.update(category.id, form)
        toast.success('Categoria atualizada!')
      } else {
        await categoriesService.create(form)
        toast.success('Categoria criada!')
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao salvar categoria')
    } finally {
      setLoading(false)
    }
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  return (
    <Modal open={open} onClose={onClose} title={category ? 'Editar Categoria' : 'Nova Categoria'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Nome</label>
          <input className="input" required value={form.name}
            onChange={e => set('name', e.target.value)} placeholder="Ex: Academia, Freelance..." />
        </div>

        <div>
          <label className="label">Tipo</label>
          <div className="grid grid-cols-2 gap-2">
            {['EXPENSE','INCOME'].map(t => (
              <button key={t} type="button"
                onClick={() => !category && set('type', t)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  form.type === t
                    ? t === 'INCOME'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-red-500/15 text-red-400 border-red-500/30'
                    : 'bg-surface-100 text-slate-400 border-white/10 hover:border-white/20'
                } ${category ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                {t === 'INCOME' ? 'Receita' : 'Despesa'}
              </button>
            ))}
          </div>
          {category && <p className="text-xs text-slate-500 mt-1">O tipo não pode ser alterado após criação.</p>}
        </div>

        <div>
          <label className="label">Cor</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c => (
              <button key={c} type="button"
                onClick={() => set('color', c)}
                className={`w-8 h-8 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-50 scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={loading}>
            {loading && <Spinner size="sm" />}
            {category ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
