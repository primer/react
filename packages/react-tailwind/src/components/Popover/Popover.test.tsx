import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Popover} from './Popover'

describe('Popover', () => {
  afterEach(cleanup)

  it('supports controlled state and reports Base UI event details', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const {rerender} = render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <Popover.Trigger>More</Popover.Trigger>
        <Popover.Content>Details</Popover.Content>
      </Popover>,
    )
    await user.click(screen.getByRole('button', {name: 'More'}))
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.objectContaining({reason: 'trigger-press'}))
    rerender(
      <Popover open onOpenChange={onOpenChange}>
        <Popover.Trigger>More</Popover.Trigger>
        <Popover.Content>Details</Popover.Content>
      </Popover>,
    )
    expect(await screen.findByText('Details')).toBeVisible()
  })

  it('dismisses on escape and restores focus to its trigger', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <Popover.Trigger>More</Popover.Trigger>
        <Popover.Content>Details</Popover.Content>
      </Popover>,
    )
    const trigger = screen.getByRole('button', {name: 'More'})
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('forwards refs and rest props to the content', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Popover>
        <Popover.Trigger>More</Popover.Trigger>
        <Popover.Content ref={ref} data-testid="content">
          Details
        </Popover.Content>
      </Popover>,
    )
    await user.click(screen.getByRole('button', {name: 'More'}))
    expect(ref.current).toBe(screen.getByTestId('content'))
    expect(ref.current).toHaveAttribute('data-component', 'Popover.Content')
    expect(ref.current).toHaveClass('bg-[var(--overlay-bgColor)]')
  })

  it('renders through a local Base UI portal when portal is disabled', () => {
    const {container} = render(
      <Popover open>
        <Popover.Trigger>More</Popover.Trigger>
        <Popover.Content portal={false}>Details</Popover.Content>
      </Popover>,
    )

    expect(container).toContainElement(screen.getByText('Details'))
  })

  it('supports HTMLElement refs for composed triggers', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Popover>
        <Popover.Trigger ref={ref} render={<a href="#details">Repository details</a>} nativeButton={false} />
        <Popover.Content>Details</Popover.Content>
      </Popover>,
    )

    expect(ref.current).toBe(screen.getByRole('button', {name: 'Repository details'}))
  })

  it('merges state-aware arrow class names', () => {
    render(
      <Popover open>
        <Popover.Trigger>More</Popover.Trigger>
        <Popover.Content>
          <Popover.Arrow data-testid="arrow" className={({open}) => (open ? 'open' : 'closed')} />
        </Popover.Content>
      </Popover>,
    )

    expect(screen.getByTestId('arrow')).toHaveClass(
      'fill-[var(--overlay-bgColor)]',
      'stroke-[var(--borderColor-default)]',
      'open',
    )
  })
})
