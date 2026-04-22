import api from './api'

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('fintrack_token', data.token)
    localStorage.setItem('fintrack_user', JSON.stringify(data.user))
    return data
  },

  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password })
    return data
  },

  logout() {
    localStorage.removeItem('fintrack_token')
    localStorage.removeItem('fintrack_user')
  },

  getUser() {
    const u = localStorage.getItem('fintrack_user')
    return u ? JSON.parse(u) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('fintrack_token')
  },

  async getProfile() {
    const { data } = await api.get('/users/me')
    return data
  },

  async updateProfile(payload) {
    const { data } = await api.put('/users/me', payload)
    localStorage.setItem('fintrack_user', JSON.stringify(data))
    return data
  },
}
