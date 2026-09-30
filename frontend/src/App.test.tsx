import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import App from './App'

test('renders the application name', () => {
  render(<App />)

  expect(screen.getByText('myFinancePal')).toBeInTheDocument()
})
