import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import App from './App'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function mockApi(items: unknown[] = []) {
  const fetchMock = vi.fn((path: string, options?: RequestInit) => {
    if (path === '/api/transactions' && !options) {
      return Promise.resolve({ ok: true, json: async () => ({ items }) })
    }
    if (path.startsWith('/api/summary/monthly')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          year: 2026,
          month: 9,
          income_cents: 0,
          expense_cents: 0,
          balance_cents: 0,
        }),
      })
    }
    return Promise.resolve({
      ok: true,
      status: 201,
      json: async () => ({
        id: 2,
        type: 'expense',
        amount_cents: 1250,
        transaction_date: '2026-09-30',
        description: 'Café',
      }),
    })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

test('shows validation before creating an invalid transaction', async () => {
  mockApi()
  const user = userEvent.setup()

  render(<App />)
  await screen.findByRole('heading', { name: 'Resumen mensual' })
  await user.click(screen.getByRole('button', { name: 'Nuevo movimiento' }))
  await user.click(screen.getByRole('button', { name: 'Guardar' }))

  expect(
    screen.getByText(/El importe debe ser mayor que cero/),
  ).toBeInTheDocument()
})

test('shows validation when the description exceeds 500 characters', async () => {
  mockApi()
  const user = userEvent.setup()

  render(<App />)
  await screen.findByRole('heading', { name: 'Resumen mensual' })
  await user.click(screen.getByRole('button', { name: 'Nuevo movimiento' }))
  fireEvent.change(screen.getByLabelText('Descripción'), {
    target: { value: 'x'.repeat(501) },
  })
  await user.type(screen.getByLabelText('Importe (€)'), '1')
  await user.click(screen.getByRole('button', { name: 'Guardar' }))

  expect(
    screen.getByText(/La descripción no puede superar los 500 caracteres/),
  ).toBeInTheDocument()
})

test('creates a transaction from the modal', async () => {
  const fetchMock = mockApi()
  const user = userEvent.setup()

  render(<App />)
  await screen.findByRole('heading', { name: 'Resumen mensual' })
  await user.click(screen.getByRole('button', { name: 'Nuevo movimiento' }))
  await user.type(screen.getByLabelText('Importe (€)'), '12.50')
  await user.type(screen.getByLabelText('Descripción'), 'Café')
  await user.click(screen.getByRole('button', { name: 'Guardar' }))

  await waitFor(() => {
    const postCall = fetchMock.mock.calls.find(
      ([path, options]) =>
        path === '/api/transactions' && options?.method === 'POST',
    )
    expect(postCall).toBeDefined()
    const payload = JSON.parse(postCall?.[1]?.body as string) as Record<
      string,
      unknown
    >
    expect(payload).toMatchObject({
      type: 'expense',
      amount_cents: 1250,
      description: 'Café',
    })
    expect(payload.transaction_date).toEqual(expect.any(String))
  })
})

test('edits an existing transaction from the modal', async () => {
  const fetchMock = mockApi([
    {
      id: 1,
      type: 'expense',
      amount_cents: 1000,
      transaction_date: '2026-09-15',
      description: 'Comida',
    },
  ])
  const user = userEvent.setup()

  render(<App />)
  await screen.findByRole('button', { name: 'Editar' })
  await user.click(screen.getByRole('button', { name: 'Editar' }))
  const amountInput = screen.getByLabelText('Importe (€)')
  fireEvent.change(amountInput, { target: { value: '15.00' } })
  await user.click(screen.getByRole('button', { name: 'Guardar' }))

  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/transactions/1',
      expect.objectContaining({ method: 'PUT' }),
    ),
  )
})
