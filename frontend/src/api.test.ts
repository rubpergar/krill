import { afterEach, expect, test, vi } from 'vitest'

import { getTransactions } from './api'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('gets transactions from the API', async () => {
  const response = {
    ok: true,
    json: async () => ({
      items: [
        {
          id: 1,
          type: 'expense',
          amount_cents: 1250,
          transaction_date: '2026-09-30',
          description: 'Comida',
        },
      ],
    }),
  }
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)

  const result = await getTransactions()

  expect(fetchMock).toHaveBeenCalledWith('/api/transactions')
  expect(result.items[0].amount_cents).toBe(1250)
})

test('raises an error when the API request fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))

  await expect(getTransactions()).rejects.toThrow(
    'No se pudieron cargar los movimientos',
  )
})
