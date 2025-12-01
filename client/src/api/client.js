import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function api(auth) {
  const instance = axios.create({ baseURL: API_BASE })
  instance.interceptors.request.use((config) => {
    const headers = auth?.authHeaders?.()
    if (headers) config.headers = { ...config.headers, ...headers }
    return config
  })
  return instance
}
