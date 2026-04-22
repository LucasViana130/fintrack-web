import api from './api'

export const reportsService = {
  async getMonthlySummary(year, month) {
    const { data } = await api.get('/reports/monthly-summary', { params: { year, month } })
    return data
  },

  async getExpensesByCategory(startDate, endDate) {
    const { data } = await api.get('/reports/expenses-by-category', { params: { startDate, endDate } })
    return data
  },

  async getBalanceEvolution() {
    const { data } = await api.get('/reports/balance-evolution')
    return data
  },
}
