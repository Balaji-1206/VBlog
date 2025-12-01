import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function useAuthProvider() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isReady, setIsReady] = useState(false)

  // Rehydrate from localStorage on mount
  useEffect(()=>{
    try {
      const raw = localStorage.getItem('vblog_auth')
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved?.user && saved?.token) {
          setUser(saved.user)
          setToken(saved.token)
        }
      }
    } catch {}
    setIsReady(true)
  }, [])

  // Persist when auth changes
  useEffect(()=>{
    try {
      if (user && token) {
        localStorage.setItem('vblog_auth', JSON.stringify({ user, token }))
      } else {
        localStorage.removeItem('vblog_auth')
      }
    } catch {}
  }, [user, token])

  async function login(email, password) {
    const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password })
    setUser(data.user)
    setToken(data.token)
  }

  async function register(name, email, password) {
    const { data } = await axios.post(`${API_BASE}/auth/register`, { name, email, password })
    setUser(data.user)
    setToken(data.token)
  }

  function logout() {
    setUser(null)
    setToken(null)
  }

  function authHeaders() {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  return { user, token, isReady, login, register, logout, authHeaders }
}
