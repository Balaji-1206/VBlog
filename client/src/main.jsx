import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/Home.jsx'
import PostPage from './pages/PostPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Editor from './pages/Editor.jsx'
import Profile from './pages/Profile.jsx'
import { useAuthProvider, AuthContext } from './hooks/useAuth.js'
import Layout from './components/Layout.jsx'
import './styles.css'

const queryClient = new QueryClient()

function AppShell() {
  const auth = useAuthProvider()
  return (
    <AuthContext.Provider value={auth}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/login" element={auth.user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={auth.user ? <Navigate to="/" /> : <Register />} />
          <Route path="/dashboard" element={auth.isReady ? (auth.token ? <Dashboard /> : <Navigate to="/login" />) : <div className="card">Loading…</div>} />
          <Route path="/editor" element={auth.isReady ? (auth.token ? <Editor /> : <Navigate to="/login" />) : <div className="card">Loading…</div>} />
          <Route path="/profile" element={auth.isReady ? (auth.token ? <Profile /> : <Navigate to="/login" />) : <div className="card">Loading…</div>} />
        </Routes>
      </Layout>
    </AuthContext.Provider>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
