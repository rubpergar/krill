import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import App from './App'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('loads the monthly dashboard and shows the empty state', async () => {
  const fetchMock = vi.fn((path: string) => {
    if (path === '/api/transactions') {
      return Promise.resolve({ ok: true, json: async () => ({ items: [] }) })
    }

    return Promise.resolve({
      ok: true,
      json: async () => ({
        year: 2026,
        month: 9,
        income_cents: 10000,
        expense_cents: 2500,
        balance_cents: 7500,
      }),
    })
  })
  vi.stubGlobal('fetch', fetchMock)

  render(<App />)

  expect(screen.getByText('Cargando resumen...')).toBeInTheDocument()
  expect(
    await screen.findByRole('heading', { name: 'Resumen mensual' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Ingresos').parentElement).toHaveTextContent('100,00')
  expect(
    screen.getByLabelText('Gráfica de ingresos, gastos y balance'),
  ).toBeInTheDocument()
  expect(screen.getByText(/Balance: 75,00/)).toBeInTheDocument()
  expect(
    screen.getByText('No hay movimientos en este mes.'),
  ).toBeInTheDocument()
  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith('/api/transactions'),
  )
})
