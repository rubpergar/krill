import { render, screen } from '@testing-library/react'
import { Input } from '../components/ui/Input'

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Input label="Email" error="Email is required" />)
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('renders select type', () => {
    render(<Input label="Priority" type="select"><option>low</option></Input>)
    expect(screen.getByLabelText('Priority')).toBeInTheDocument()
  })
})
