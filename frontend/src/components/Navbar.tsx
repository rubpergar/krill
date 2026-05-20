import { Building2, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-primary" />
          <span className="text-sm font-medium text-neutral-100">
            Incidencias Coworking
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{user?.name}</span>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-neutral-100"
          >
            <LogOut className="size-4" />
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
