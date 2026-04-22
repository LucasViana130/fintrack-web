import api from './api'

export const accountsService = {
  async list()           { const { data } = await api.get('/accounts'); return data },
  async getById(id)      { const { data } = await api.get(`/accounts/${id}`); return data },
  async create(payload)  { const { data } = await api.post('/accounts', payload); return data },
  async update(id, payload) { const { data } = await api.put(`/accounts/${id}`, payload); return data },
  async deactivate(id)   { await api.delete(`/accounts/${id}`) },
}
