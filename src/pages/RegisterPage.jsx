import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm]  = useState({ name: '', email: '', password: '' })
  const { register, loading } = useAuth()
  const navigate         = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password.length < 8) return toast.error('Senha deve ter no mínimo 8 caracteres')
    try {
      await register(form.name, form.email, form.password)
      toast.success('Conta criada! Faça o login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao criar conta')
    }
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-500 shadow-glow mb-4">
            <TrendingUp size={22} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">FinTrack</h1>
          <p className="text-slate-500 text-sm mt-1">Crie sua conta gratuita</p>
        </div>

        <div className="card border border-white/8 p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-5">Criar conta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nome completo</label>
              <input className="input" required autoFocus value={form.name}
                onChange={e => set('name', e.target.value)} placeholder="Seu nome" />
            </div>
            <div>
              <label className="label">E-mail</label>
              <input className="input" type="email" required value={form.email}
                onChange={e => set('email', e.target.value)} placeholder="seu@email.com" />
            </div>
            <div>
              <label className="label">Senha</label>
              <input className="input" type="password" required minLength={8} value={form.password}
                onChange={e => set('password', e.target.value)} placeholder="Mínimo 8 caracteres" />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2" disabled={loading}>
              {loading && <Spinner size="sm" />}
              {loading ? 'Criando...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Já tem conta?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
