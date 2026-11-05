import React from 'react'
import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {BaseStyles} from '../../BaseStyles'
import {Tooltip} from './Tooltip'

describe('Tooltip', () => {
  afterEach(cleanup)

  it('supports controlled state and provides an accessible description', async () => {
    const onOpenChange = vi.fn()
    render(
      <Tooltip open onOpenChange={onOpenChange}>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content>Save this file</Tooltip.Content>
      </Tooltip>,
    )
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Save this file')
    expect(screen.getByRole('button', {name: 'Save'})).toHaveAccessibleDescription('Save this file')
  })

  it('portals into the nearest BaseStyles so content inherits its theme and typography', async () => {
    render(
      <>
        <BaseStyles data-testid="first" />
        <BaseStyles data-testid="second">
          <Tooltip open>
            <Tooltip.Trigger>Save</Tooltip.Trigger>
            <Tooltip.Content>Save this file</Tooltip.Content>
          </Tooltip>
        </BaseStyles>
      </>,
    )
    const tooltip = await screen.findByRole('tooltip')
    expect(screen.getByTestId('second')).toContainElement(tooltip)
  })

  it('renders in place when portal is false', async () => {
    render(
      <div data-testid="container">
        <Tooltip open>
          <Tooltip.Trigger>Save</Tooltip.Trigger>
          <Tooltip.Content portal={false}>Save this file</Tooltip.Content>
        </Tooltip>
      </div>,
    )
    expect(screen.getByTestId('container')).toContainElement(await screen.findByRole('tooltip'))
  })

  it('closes on escape without moving focus from the trigger', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip defaultOpen>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content>Save this file</Tooltip.Content>
      </Tooltip>,
    )
    const trigger = screen.getByRole('button', {name: 'Save'})
    trigger.focus()
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('forwards content refs and rest props', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Tooltip defaultOpen>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content ref={ref} data-testid="tooltip">
          Save this file
        </Tooltip.Content>
      </Tooltip>,
    )
    expect(ref.current).toBe(screen.getByTestId('tooltip'))
    expect(ref.current).toHaveAttribute('data-component', 'Tooltip.Content')
  })

  it('supports HTMLElement refs for composed triggers and state-aware arrows', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Tooltip open>
        <Tooltip.Trigger ref={ref} render={<a href="#save">Save</a>}>
          Save
        </Tooltip.Trigger>
        <Tooltip.Content>
          Save this file
          <Tooltip.Arrow data-testid="arrow" className={({open}) => (open ? 'open' : 'closed')} />
        </Tooltip.Content>
      </Tooltip>,
    )

    expect(ref.current).toBe(screen.getByRole('link', {name: 'Save'}))
    expect(screen.getByTestId('arrow')).toHaveClass('[--arrow-bg-color:var(--tooltip-bgColor)]', 'open')
    expect(screen.getByTestId('arrow').querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
