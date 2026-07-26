import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it} from 'vitest'
import {AnchoredOverlay} from './AnchoredOverlay'

describe('AnchoredOverlay', () => {
  afterEach(cleanup)

  it('opens from its trigger and closes when pressing outside', async () => {
    const user = userEvent.setup()
    render(
      <>
        <AnchoredOverlay>
          <AnchoredOverlay.Trigger>Options</AnchoredOverlay.Trigger>
          <AnchoredOverlay.Content>Content</AnchoredOverlay.Content>
        </AnchoredOverlay>
        <button type="button">Outside</button>
      </>,
    )
    await user.click(screen.getByRole('button', {name: 'Options'}))
    expect(await screen.findByText('Content')).toBeVisible()
    await user.click(screen.getByRole('button', {name: 'Outside'}))
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('supports content refs and state-aware class names', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    render(
      <AnchoredOverlay>
        <AnchoredOverlay.Trigger className={({open}) => (open ? 'open' : 'closed')}>Options</AnchoredOverlay.Trigger>
        <AnchoredOverlay.Content ref={ref} data-testid="content">
          Content
        </AnchoredOverlay.Content>
      </AnchoredOverlay>,
    )
    const trigger = screen.getByRole('button', {name: 'Options'})
    expect(trigger).toHaveClass('closed')
    await user.click(trigger)
    expect(ref.current).toBe(screen.getByTestId('content'))
    expect(ref.current).toHaveAttribute('data-component', 'AnchoredOverlay.Content')
    expect(ref.current).toHaveClass('bg-[var(--overlay-bgColor)]')
    expect(trigger).toHaveClass('open')
  })

  it('names and describes dialog content with its styled Base UI parts', () => {
    render(
      <AnchoredOverlay open>
        <AnchoredOverlay.Trigger>Options</AnchoredOverlay.Trigger>
        <AnchoredOverlay.Content role="dialog">
          <AnchoredOverlay.Title>Repository options</AnchoredOverlay.Title>
          <AnchoredOverlay.Description>Manage this repository.</AnchoredOverlay.Description>
        </AnchoredOverlay.Content>
      </AnchoredOverlay>,
    )

    expect(screen.getByRole('dialog', {name: 'Repository options'})).toHaveAccessibleDescription(
      'Manage this repository.',
    )
  })

  it('merges state-aware arrow classes and keeps its marker immutable', () => {
    render(
      <AnchoredOverlay open>
        <AnchoredOverlay.Trigger data-component="consumer">Options</AnchoredOverlay.Trigger>
        <AnchoredOverlay.Content>
          <AnchoredOverlay.Arrow data-testid="arrow" className={({open}) => (open ? 'open' : 'closed')} />
        </AnchoredOverlay.Content>
      </AnchoredOverlay>,
    )

    expect(screen.getByRole('button', {name: 'Options'})).toHaveAttribute('data-component', 'AnchoredOverlay.Trigger')
    expect(screen.getByTestId('arrow')).toHaveClass('fill-default', 'stroke-default', 'open')
  })
})
