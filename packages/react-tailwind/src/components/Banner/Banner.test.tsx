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
  const {container} = render(
    <Banner actionsLayout="stacked" aria-label="Actions" primaryAction={<button type="button">Confirm</button>} />,
  )

  const actions = container.querySelector('[data-component="Banner.Actions"]')
  expect(actions).toHaveAttribute('data-layout', 'stacked')
  expect(actions?.firstElementChild).toHaveClass('items-center')
  expect(actions?.firstElementChild).not.toHaveClass('flex-row-reverse')
  expect(container.querySelector('[data-component="Banner"] > div')).toHaveClass('flex', 'flex-col')
})

it('only reserves a second narrow row when actions are present', () => {
  const {container, rerender} = render(<Banner aria-label="No actions" description="Description" />)
  const content = container.querySelector('[data-component="Banner.Content"]')?.parentElement

  expect(content).not.toHaveClass('@max-[500px]/banner:grid-rows-[auto_auto]')

  rerender(
    <Banner aria-label="Actions" description="Description" primaryAction={<button type="button">Confirm</button>} />,
  )
  expect(container.querySelector('[data-component="Banner.Content"]')?.parentElement).toHaveClass(
    '@max-[500px]/banner:grid-rows-[auto_auto]',
  )
})
