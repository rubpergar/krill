import { render } from '@testing-library/react'
import { Skeleton, CardSkeleton, TableSkeleton } from '../components/ui/Skeleton'

describe('Skeleton', () => {
  it('renders Skeleton', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('.animate-pulse')).toBeTruthy()
  })

  it('renders CardSkeleton', () => {
    const { container } = render(<CardSkeleton />)
    expect(container.querySelector('.animate-pulse')).toBeTruthy()
  })

  it('renders TableSkeleton with correct row count', () => {
    const { container } = render(<TableSkeleton rows={3} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(3)
  })
})
