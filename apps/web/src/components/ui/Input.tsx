import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  children?: ReactNode
}

export function Input({ label, error, className = '', id, children, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      {props.type === 'select' ? (
        <select
          id={inputId}
          value={props.value as string}
          onChange={props.onChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
          required={props.required}
          disabled={props.disabled}
          className={`rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            error ? 'border-red-500' : 'border-neutral-300'
          } ${className}`}
        >
          {children}
        </select>
      ) : (
        <input
          id={inputId}
          className={`rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            error ? 'border-red-500' : 'border-neutral-300'
          } ${className}`}
          {...props}
        />
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
