import { useState } from 'react'
import { User, Lock, Save } from 'lucide-react'
import { authService } from '../services/auth.service'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [name, setName]       = useState(user?.name || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSaveName(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const updated = await authService.updateProfile({ name })
      updateUser(updated)
      toast.success('Nome atualizado!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar')
    } finally { setLoading(false) }
  }

  async function handleSavePassword(e) {
    e.preventDefault()
    if (password.length < 8) return toast.error('Senha deve ter no mínimo 8 caracteres')
    if (password !== confirm) return toast.error('As senhas não coincidem')
    setLoading(true)
    try {
      await authService.updateProfile({ password })
      setPassword(''); setConfirm('')
      toast.success('Senha atualizada!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao atualizar senha')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-white">Configurações</h1>
        <p className="text-slate-500 text-sm mt-0.5">Gerencie seu perfil e preferências</p>
      </div>

      {/* Profile */}
      <div className="card p-5 animate-slide-up stagger-1">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
            <User size={15} className="text-brand-400" />
          </div>
          <h2 className="font-display font-semibold text-white">Perfil</h2>
        </div>

        <div className="mb-4">
          <label className="label">E-mail</label>
          <input className="input opacity-50 cursor-not-allowed" value={user?.email} disabled />
          <p className="text-xs text-slate-500 mt-1">O e-mail não pode ser alterado.</p>
        </div>

        <form onSubmit={handleSaveName} className="space-y-4">
          <div>
            <label className="label">Nome</label>
            <input className="input" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
            {loading ? <Spinner size="sm" /> : <Save size={15} />}
            Salvar nome
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="card p-5 animate-slide-up stagger-2">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Lock size={15} className="text-purple-400" />
          </div>
          <h2 className="font-display font-semibold text-white">Alterar senha</h2>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-4">
          <div>
            <label className="label">Nova senha</label>
            <input className="input" type="password" required minLength={8}
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres" />
          </div>
          <div>
            <label className="label">Confirmar nova senha</label>
            <input className="input" type="password" required
              value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Repita a nova senha" />
          </div>
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
            {loading ? <Spinner size="sm" /> : <Save size={15} />}
            Alterar senha
          </button>
        </form>
      </div>
    </div>
  )
}
