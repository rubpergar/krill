import { render, screen } from '@testing-library/react'
import { Card } from '../components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
