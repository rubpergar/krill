import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

export interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType) => void
}

export const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
})

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Set<number>>(new Set())

  const removeToast = useCallback((id: number) => {
    timers.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = ++toastId
      setToasts((prev) => [...prev, { id, message, type }])
      const timer = window.setTimeout(() => removeToast(id), 4000)
      timers.current.add(timer)
    },
    [removeToast],
  )

  const value = useMemo(() => ({ toasts, addToast }), [toasts, addToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
              toast.type === 'success'
                ? 'bg-green-600'
                : toast.type === 'error'
                  ? 'bg-red-600'
                  : 'bg-blue-600'
            }`}
            role="alert"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
