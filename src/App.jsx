import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getSupabase } from './lib/supabaseWeb'
import LoginScreen from './screens/LoginScreen'
import ChatScreen from './screens/ChatScreen'
import ChatRoomScreen from './screens/ChatRoomScreen'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <span>Cargando...</span>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!session ? <LoginScreen /> : <Navigate to="/" replace />}
      />
      <Route
        path="/"
        element={session ? <ChatScreen session={session} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/chat/:friendId"
        element={session ? <ChatRoomScreen session={session} /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}