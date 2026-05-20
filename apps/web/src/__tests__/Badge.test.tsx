import { render, screen } from '@testing-library/react'
import { Badge } from '../components/ui/Badge'

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge variant="open">Open</Badge>)
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  it('applies priority styles', () => {
    render(<Badge variant="critical">Critical</Badge>)
    const badge = screen.getByText('Critical')
    expect(badge.className).toContain('bg-red')
  })
})
