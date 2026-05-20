import { render, screen, act, renderHook } from '@testing-library/react'
import { ToastProvider, ToastContext } from '../context/ToastContext'
import { useContext } from 'react'

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds and removes toast', () => {
    const { result } = renderHook(() => useContext(ToastContext), {
      wrapper: ToastProvider,
    })

    act(() => {
      result.current.addToast('Test message', 'success')
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].message).toBe('Test message')

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('renders toast in DOM', () => {
    render(
      <ToastProvider>
        <ToastContext.Consumer>
          {(ctx) => (
            <button onClick={() => ctx.addToast('Visible toast', 'error')}>
              Show toast
            </button>
          )}
        </ToastContext.Consumer>
      </ToastProvider>,
    )

    act(() => {
      screen.getByText('Show toast').click()
    })

    expect(screen.getByText('Visible toast')).toBeInTheDocument()
  })
})
