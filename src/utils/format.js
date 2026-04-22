export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value ?? 0)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function formatMonth(year, month) {
  const date = new Date(year, month - 1)
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
}

export function currentYearMonth() {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

export function firstDayOfMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

export function lastDayOfMonth() {
  const now = new Date()
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return `${last.getFullYear()}-${String(last.getMonth() + 1).padStart(2, '0')}-${String(last.getDate()).padStart(2, '0')}`
}

export function today() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export const ACCOUNT_TYPE_LABELS = {
  CHECKING: 'Conta Corrente',
  SAVINGS:  'Poupança',
  CASH:     'Dinheiro',
  CREDIT:   'Cartão de Crédito',
}

export const CATEGORY_TYPE_LABELS = {
  INCOME:  'Receita',
  EXPENSE: 'Despesa',
}
