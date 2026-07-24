import {fireEvent, render, screen} from '@testing-library/react'
import {expect, it, vi} from 'vitest'
import {Banner, BannerTitle} from './Banner'
it('labels itself with its title and dismisses', () => {
  const dismiss = vi.fn()
  render(
    <Banner onDismiss={dismiss} title="Update available">
      Details
    </Banner>,
  )
  expect(screen.getByRole('region', {name: 'Update available'})).toHaveAttribute('data-variant', 'info')
  fireEvent.click(screen.getByRole('button', {name: 'Dismiss banner'}))
  expect(dismiss).toHaveBeenCalledOnce()
})
it('supports a composed title', () => {
  render(
    <Banner aria-label="Composed">
      <BannerTitle as="h3">Composed</BannerTitle>
    </Banner>,
  )
  expect(screen.getByRole('region', {name: 'Composed'})).toBeInTheDocument()
})

it('applies the actions layout', () => {
  render(<Banner actionsLayout="stacked" aria-label="Actions" primaryAction={<button type="button">Confirm</button>} />)

  expect(screen.getByText('Confirm').parentElement).toHaveAttribute('data-layout', 'stacked')
})
