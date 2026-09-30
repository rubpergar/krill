import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  createTransaction,
  deleteTransaction,
  getMonthlySummary,
  getTransactions,
  type MonthlySummary,
  type Transaction,
  type TransactionPayload,
  type TransactionType,
  updateTransaction,
} from './api'

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

function formatCents(amountCents: number) {
  return currencyFormatter.format(amountCents / 100)
}

function getCurrentMonth() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(month: string) {
  const [year, monthNumber] = month.split('-').map(Number)
  return new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, monthNumber - 1, 1))
}

function amountToCents(value: string) {
  const normalized = value.trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return null
  }

  const [whole, fraction = ''] = normalized.split('.')
  const amountCents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  return amountCents > 0 ? amountCents : null
}

function centsToAmount(amountCents: number) {
  return (amountCents / 100).toFixed(2)
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    const [year, month] = selectedMonth.split('-').map(Number)

    Promise.all([getTransactions(), getMonthlySummary(year, month)])
      .then(([transactionList, monthlySummary]) => {
        if (cancelled) return
        setTransactions(transactionList.items)
        setSummary(monthlySummary)
      })
      .catch((requestError: unknown) => {
        if (cancelled) return
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No se pudieron cargar los datos',
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadToken, selectedMonth])

  const visibleTransactions = transactions.filter((transaction) =>
    transaction.transaction_date.startsWith(selectedMonth),
  )

  async function handleSubmit(payload: TransactionPayload) {
    setError(null)
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload)
      } else {
        await createTransaction(payload)
      }
      setIsFormOpen(false)
      setEditingTransaction(null)
      setLoading(true)
      setReloadToken((token) => token + 1)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo guardar el movimiento',
      )
    }
  }

  async function handleDelete(transaction: Transaction) {
    if (!window.confirm('¿Quieres eliminar este movimiento?')) return

    setError(null)
    try {
      await deleteTransaction(transaction.id)
      setLoading(true)
      setReloadToken((token) => token + 1)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo eliminar el movimiento',
      )
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-8 py-10">
      <header className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            myFinancePal
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Tus finanzas, claras.
          </h1>
          <p className="mt-2 text-slate-600">
            Controla ingresos y gastos desde un solo panel.
          </p>
        </div>
        <button
          className="rounded-[0.625rem] bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
          onClick={() => {
            setEditingTransaction(null)
            setIsFormOpen(true)
          }}
          type="button"
        >
          Nuevo movimiento
        </button>
      </header>

      <section
        aria-label="Seleccionar mes"
        className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
      >
        <div>
          <h2 className="font-semibold text-slate-900">Resumen mensual</h2>
          <p className="text-sm capitalize text-slate-500">
            {monthLabel(selectedMonth)}
          </p>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          Mes
          <input
            aria-label="Mes del resumen"
            className="rounded-md border border-slate-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={(event) => {
              setError(null)
              setLoading(true)
              setSelectedMonth(event.target.value)
            }}
            type="month"
            value={selectedMonth}
          />
        </label>
      </section>

      {error && (
        <div
          aria-live="assertive"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800"
        >
          {error}
        </div>
      )}

      {loading && <p role="status">Cargando resumen...</p>}

      {!loading && summary && (
        <>
          <section
            aria-label="Totales mensuales"
            className="mb-6 grid grid-cols-3 gap-4"
          >
            <SummaryCard
              label="Ingresos"
              value={summary.income_cents}
              tone="text-emerald-700"
            />
            <SummaryCard
              label="Gastos"
              value={summary.expense_cents}
              tone="text-red-700"
            />
            <SummaryCard
              label="Balance"
              value={summary.balance_cents}
              tone="text-blue-700"
            />
          </section>

          <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Balance del mes
                </h2>
                <p className="text-sm text-slate-500">
                  Comparativa de ingresos, gastos y balance.
                </p>
              </div>
            </div>
            <div
              aria-label="Gráfica de ingresos, gastos y balance"
              className="h-72"
            >
              <ResponsiveContainer height="100%" width="100%">
                <BarChart
                  data={[
                    {
                      name: 'Mes',
                      Ingresos: summary.income_cents / 100,
                      Gastos: summary.expense_cents / 100,
                      Balance: summary.balance_cents / 100,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value: number) => `${value} €`} />
                  <Tooltip
                    formatter={(value) => `${Number(value ?? 0).toFixed(2)} €`}
                  />
                  <Legend />
                  <Bar dataKey="Ingresos" fill="#15803D" />
                  <Bar dataKey="Gastos" fill="#B91C1C" />
                  <Bar dataKey="Balance" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="sr-only">
              Ingresos: {formatCents(summary.income_cents)}. Gastos:{' '}
              {formatCents(summary.expense_cents)}. Balance:{' '}
              {formatCents(summary.balance_cents)}.
            </p>
          </section>

          <section
            aria-labelledby="transactions-title"
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-lg font-semibold text-slate-900"
                id="transactions-title"
              >
                Movimientos
              </h2>
              <span className="text-sm text-slate-500">
                {visibleTransactions.length} en este mes
              </span>
            </div>
            {visibleTransactions.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No hay movimientos en este mes.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {visibleTransactions.map((transaction) => (
                  <li
                    className="flex items-center justify-between gap-4 py-4"
                    key={transaction.id}
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {transaction.description || 'Sin descripción'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {transaction.transaction_date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={
                          transaction.type === 'income'
                            ? 'font-semibold text-emerald-700'
                            : 'font-semibold text-red-700'
                        }
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCents(transaction.amount_cents)}
                      </span>
                      <button
                        className="text-sm font-medium text-blue-700 hover:text-blue-900"
                        onClick={() => {
                          setEditingTransaction(transaction)
                          setIsFormOpen(true)
                        }}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="text-sm font-medium text-red-700 hover:text-red-900"
                        onClick={() => void handleDelete(transaction)}
                        type="button"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {isFormOpen && (
        <TransactionModal
          onClose={() => {
            setIsFormOpen(false)
            setEditingTransaction(null)
          }}
          onSubmit={handleSubmit}
          transaction={editingTransaction}
        />
      )}
    </main>
  )
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: string
}) {
  return (
    <article className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tone}`}>{formatCents(value)}</p>
    </article>
  )
}

function TransactionModal({
  transaction,
  onClose,
  onSubmit,
}: {
  transaction: Transaction | null
  onClose: () => void
  onSubmit: (payload: TransactionPayload) => Promise<void>
}) {
  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? 'expense',
  )
  const [amount, setAmount] = useState(
    transaction ? centsToAmount(transaction.amount_cents) : '',
  )
  const [transactionDate, setTransactionDate] = useState(
    transaction?.transaction_date ?? new Date().toISOString().slice(0, 10),
  )
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const amountCents = amountToCents(amount)
    if (!amountCents) {
      setValidationError(
        'El importe debe ser mayor que cero y tener como máximo dos decimales.',
      )
      return
    }
    if (!transactionDate) {
      setValidationError('La fecha es obligatoria.')
      return
    }
    if (description.length > 500) {
      setValidationError('La descripción no puede superar los 500 caracteres.')
      return
    }

    setValidationError(null)
    setSaving(true)
    await onSubmit({
      type,
      amount_cents: amountCents,
      transaction_date: transactionDate,
      description: description || null,
    })
    setSaving(false)
  }

  return (
    <div
      aria-labelledby="transaction-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-6"
      role="dialog"
    >
      <form
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        onSubmit={(event) => void submit(event)}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="text-xl font-semibold text-slate-900"
            id="transaction-modal-title"
          >
            {transaction ? 'Editar movimiento' : 'Nuevo movimiento'}
          </h2>
          <button
            aria-label="Cerrar formulario"
            className="text-2xl text-slate-500"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        {validationError && (
          <p
            aria-live="polite"
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800"
          >
            {validationError}
          </p>
        )}
        <div className="grid gap-4">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Tipo
            <select
              className="rounded-md border border-slate-300 px-3 py-2"
              onChange={(event) =>
                setType(event.target.value as TransactionType)
              }
              value={type}
            >
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Importe (€)
            <input
              className="rounded-md border border-slate-300 px-3 py-2"
              inputMode="decimal"
              onChange={(event) => setAmount(event.target.value)}
              value={amount}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Fecha
            <input
              className="rounded-md border border-slate-300 px-3 py-2"
              onChange={(event) => setTransactionDate(event.target.value)}
              type="date"
              value={transactionDate}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Descripción
            <textarea
              className="rounded-md border border-slate-300 px-3 py-2"
              maxLength={500}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              value={description}
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-md px-4 py-2 font-medium text-slate-700 hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
            disabled={saving}
            type="submit"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
