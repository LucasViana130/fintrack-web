import api from './api'

export const transactionsService = {
  async list(params = {}) {
    const { data } = await api.get('/transactions', { params })
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/transactions/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await api.post('/transactions', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/transactions/${id}`, payload)
    return data
  },

  async delete(id) {
    await api.delete(`/transactions/${id}`)
  },
}
