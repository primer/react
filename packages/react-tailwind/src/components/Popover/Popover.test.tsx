import React from 'react'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
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
    expect(ref.current).toHaveClass('primer:bg-[var(--overlay-bgColor)]')
  })

  it('sizes content on the overlay token scale', () => {
    const {rerender} = render(
      <Popover open>
        <Popover.Trigger>More</Popover.Trigger>
        <Popover.Content data-testid="content">Details</Popover.Content>
      </Popover>,
    )
    expect(screen.getByTestId('content')).toHaveClass('primer:w-[var(--overlay-width-small)]', 'primer:h-fit')

    rerender(
      <Popover open>
        <Popover.Trigger>More</Popover.Trigger>
        <Popover.Content data-testid="content" width="large" height="medium" className="w-full">
          Details
        </Popover.Content>
      </Popover>,
    )
    const content = screen.getByTestId('content')
    expect(content).toHaveClass('w-full', 'primer:h-[var(--overlay-height-medium)]')
    expect(content).not.toHaveClass('primer:w-[var(--overlay-width-large)]')
  })

  it('positions against an anchor other than its trigger', async () => {
    const getBoundingClientRect = vi.fn(() => new DOMRect(10, 20, 30, 40))
    render(
      <Popover open>
        <Popover.Trigger>More</Popover.Trigger>
        <Popover.Content anchor={{getBoundingClientRect}}>Details</Popover.Content>
      </Popover>,
    )

    expect(screen.getByText('Details')).toBeInTheDocument()
    await waitFor(() => expect(getBoundingClientRect).toHaveBeenCalled())
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

  it('tracks its open state on a Button trigger with its own id', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <Popover.Button id="details-button">Details</Popover.Button>
        <Popover.Content>Repository details</Popover.Content>
      </Popover>,
    )
    const trigger = screen.getByRole('button', {name: 'Details'})
    expect(trigger).toHaveAttribute('id', 'details-button')
    await user.click(trigger)
    const content = await screen.findByText('Repository details')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById(trigger.getAttribute('aria-controls') ?? '')).toContainElement(content)
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

    const arrow = screen.getByTestId('arrow')
    expect(arrow).toHaveClass(
      'primer:[--arrow-bg-color:var(--overlay-bgColor)]',
      'primer:[--arrow-border-color:var(--borderColor-default)]',
      'open',
    )
    expect(arrow.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
