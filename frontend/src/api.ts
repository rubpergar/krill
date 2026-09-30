export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: number
  type: TransactionType
  amount_cents: number
  transaction_date: string
  description: string | null
}

export interface TransactionPayload {
  type: TransactionType
  amount_cents: number
  transaction_date: string
  description: string | null
}

export interface TransactionList {
  items: Transaction[]
}

export interface MonthlySummary {
  year: number
  month: number
  income_cents: number
  expense_cents: number
  balance_cents: number
}

async function request<T>(
  path: string,
  options: RequestInit | undefined,
  errorMessage: string,
): Promise<T> {
  const response = options ? await fetch(path, options) : await fetch(path)

  if (!response.ok) {
    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function getTransactions(): Promise<TransactionList> {
  return request(
    '/api/transactions',
    undefined,
    'No se pudieron cargar los movimientos',
  )
}

export function createTransaction(
  payload: TransactionPayload,
): Promise<Transaction> {
  return request(
    '/api/transactions',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'No se pudo crear el movimiento',
  )
}

export function updateTransaction(
  id: number,
  payload: TransactionPayload,
): Promise<Transaction> {
  return request(
    `/api/transactions/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    'No se pudo actualizar el movimiento',
  )
}

export function deleteTransaction(id: number): Promise<void> {
  return request(
    `/api/transactions/${id}`,
    { method: 'DELETE' },
    'No se pudo eliminar el movimiento',
  )
}

export function getMonthlySummary(
  year: number,
  month: number,
): Promise<MonthlySummary> {
  return request(
    `/api/summary/monthly?year=${year}&month=${month}`,
    undefined,
    'No se pudo cargar el resumen mensual',
  )
}
