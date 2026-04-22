import api from './api'

export const categoriesService = {
  async list()              { const { data } = await api.get('/categories'); return data },
  async getById(id)         { const { data } = await api.get(`/categories/${id}`); return data },
  async create(payload)     { const { data } = await api.post('/categories', payload); return data },
  async update(id, payload) { const { data } = await api.put(`/categories/${id}`, payload); return data },
  async deactivate(id)      { await api.delete(`/categories/${id}`) },
}
