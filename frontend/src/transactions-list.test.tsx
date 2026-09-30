import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import App from './App'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function mockApi() {
  const fetchMock = vi.fn((path: string, options?: RequestInit) => {
    if (path === '/api/transactions' && !options) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 1,
              type: 'expense',
              amount_cents: 1250,
              transaction_date: '2026-09-15',
              description: 'Café',
            },
          ],
        }),
      })
    }
    if (path.startsWith('/api/summary/monthly')) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          year: 2026,
          month: 9,
          income_cents: 0,
          expense_cents: 1250,
          balance_cents: -1250,
        }),
      })
    }
    return Promise.resolve({ ok: true, status: 204, json: async () => ({}) })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

test('lists a movement and deletes it after confirmation', async () => {
  const fetchMock = mockApi()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  const user = userEvent.setup()

  render(<App />)
  expect(await screen.findByText('Café')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Eliminar' }))

  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith('/api/transactions/1', {
      method: 'DELETE',
    }),
  )
  expect(window.confirm).toHaveBeenCalled()
})

test('does not delete a movement when confirmation is cancelled', async () => {
  const fetchMock = mockApi()
  vi.spyOn(window, 'confirm').mockReturnValue(false)
  const user = userEvent.setup()

  render(<App />)
  await screen.findByText('Café')
  await user.click(screen.getByRole('button', { name: 'Eliminar' }))

  expect(fetchMock).not.toHaveBeenCalledWith('/api/transactions/1', {
    method: 'DELETE',
  })
})
