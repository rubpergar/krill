import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="text-lg font-semibold text-neutral-900">
            Krill
          </Link>
          {isAuthenticated && (
            <div className="hidden items-center gap-4 sm:flex">
              <Link to="/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900">
                Dashboard
              </Link>
              <Link to="/incidents/new" className="text-sm text-neutral-600 hover:text-neutral-900">
                Nueva Incidencia
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Admin
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-neutral-500 sm:inline">{user?.name}</span>
              <Button variant="ghost" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Iniciar sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
