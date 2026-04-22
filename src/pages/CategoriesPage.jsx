import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Tags, Lock } from 'lucide-react'
import { categoriesService } from '../services/categories.service'
import CategoryModal from '../components/modals/CategoryModal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editing, setEditing]       = useState(null)
  const [deleting, setDeleting]     = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [tab, setTab]               = useState('EXPENSE')

  async function load() {
    setLoading(true)
    try { setCategories(await categoriesService.list()) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    setDelLoading(true)
    try {
      await categoriesService.deactivate(deleting.id)
      toast.success('Categoria desativada!')
      setDeleting(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao desativar')
    } finally { setDelLoading(false) }
  }

  const filtered = categories.filter(c => c.type === tab)
  const defaults = filtered.filter(c => c.isDefault)
  const custom   = filtered.filter(c => !c.isDefault)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Categorias</h1>
          <p className="text-slate-500 text-sm mt-0.5">Organize suas transações por categoria</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setEditing(null); setShowModal(true) }}>
          <Plus size={16} /> Nova categoria
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 animate-fade-in">
        {['EXPENSE','INCOME'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              tab === t
                ? t === 'EXPENSE'
                  ? 'bg-red-500/15 text-red-400 border-red-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'text-slate-400 border-white/10 hover:border-white/20'
            }`}>
            {t === 'EXPENSE' ? 'Despesas' : 'Receitas'}
            <span className="ml-2 text-xs opacity-60">
              ({categories.filter(c => c.type === t).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={Tags} title="Nenhuma categoria" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Default categories */}
          {defaults.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Lock size={11} /> Categorias padrão
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {defaults.map((c, i) => (
                  <div key={c.id} className={`card p-3.5 flex items-center gap-3 animate-fade-in stagger-${Math.min(i+1,6)}`}>
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: c.color || '#64748b' }}>
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{c.name}</p>
                      <p className="text-xs text-slate-500">Padrão</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom categories */}
          {custom.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Suas categorias</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {custom.map((c, i) => (
                  <div key={c.id} className={`card p-3.5 flex items-center gap-3 group hover:border-white/10 transition-all animate-fade-in stagger-${Math.min(i+1,6)}`}>
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: c.color || '#64748b' }}>
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{c.name}</p>
                      <p className="text-xs text-slate-500">Personalizada</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="btn-ghost p-1 rounded-lg" onClick={() => { setEditing(c); setShowModal(true) }}>
                        <Pencil size={13} />
                      </button>
                      <button className="btn-ghost p-1 rounded-lg hover:text-red-400" onClick={() => setDeleting(c)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <CategoryModal open={showModal} onClose={() => { setShowModal(false); setEditing(null) }}
        onSuccess={load} category={editing} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        loading={delLoading} title="Desativar categoria"
        message={`Desativar a categoria "${deleting?.name}"?`} />
    </div>
  )
}
