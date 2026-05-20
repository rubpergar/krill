import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { useToast } from '../hooks/useToast'
import type { AuthResponse, ApiResponse } from '../types'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password })
      login(res.data.accessToken, res.data.refreshToken, res.data.user)
      addToast('Sesión iniciada correctamente', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md">
      <Card>
        <h1 className="mb-6 text-2xl font-bold text-neutral-900">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading}>
            Iniciar sesión
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-neutral-500">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </Card>
    </div>
  )
}
