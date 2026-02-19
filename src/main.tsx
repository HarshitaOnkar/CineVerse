import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import { Auth } from './pages/Auth'
import { getLoggedInUser } from './api/auth'
import './index.css'

function ProtectedApp() {
  const user = getLoggedInUser()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <App />
}

function AuthPage() {
  return <Auth />
}

function RootRedirect() {
  const user = getLoggedInUser()
  return <Navigate to={user ? '/cineverse' : '/login'} replace />
}

function Root() {
  const [user, setUser] = useState<string | null>(() => getLoggedInUser())

  useEffect(() => {
    const onAuth = () => setUser(getLoggedInUser())
    window.addEventListener('cineverse-auth', onAuth)
    return () => window.removeEventListener('cineverse-auth', onAuth)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={user ? <Navigate to="/cineverse" replace /> : <AuthPage />} />
        <Route path="/signup" element={user ? <Navigate to="/cineverse" replace /> : <AuthPage />} />
        <Route path="/cineverse" element={<ProtectedApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
