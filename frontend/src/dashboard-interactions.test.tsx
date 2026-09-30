import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import App from './App'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test('reloads the summary when the selected month changes', async () => {
  const fetchMock = vi.fn((path: string) => {
    if (path === '/api/transactions') {
      return Promise.resolve({ ok: true, json: async () => ({ items: [] }) })
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({
        year: 2026,
        month: 8,
        income_cents: 0,
        expense_cents: 0,
        balance_cents: 0,
      }),
    })
  })
  vi.stubGlobal('fetch', fetchMock)

  render(<App />)
  await screen.findByRole('heading', { name: 'Resumen mensual' })
  fireEvent.change(screen.getByLabelText('Mes del resumen'), {
    target: { value: '2026-08' },
  })

  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/summary/monthly?year=2026&month=8',
    ),
  )
})

test('shows an API error visibly when loading fails', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn((path: string) => {
      if (path === '/api/transactions') {
        return Promise.resolve({ ok: false, status: 503 })
      }
      return Promise.resolve({ ok: true, json: async () => ({}) })
    }),
  )

  render(<App />)

  expect(
    await screen.findByText('No se pudieron cargar los movimientos'),
  ).toBeInTheDocument()
})
