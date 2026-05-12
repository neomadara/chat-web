import { useState } from 'react'
import { getSupabase } from '../lib/supabaseWeb'
import styles from './LoginScreen.module.css'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu email y contraseña')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>💬</div>
          <h1 className={styles.title}>Chat App</h1>
          <p className={styles.subtitle}>Inicia sesión para continuar</p>
        </div>
        <form className={styles.form} onSubmit={handleLogin}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="usuario@test.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <label className={styles.label}>Contraseña</label>
          <input
            className={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}