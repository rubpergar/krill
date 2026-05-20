import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  interactive?: boolean
}

export function Card({ children, interactive = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-white p-4 shadow-sm ${
        interactive ? 'transition-shadow hover:shadow-md' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
