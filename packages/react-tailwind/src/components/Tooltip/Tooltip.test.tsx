import React from 'react'
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {BaseStyles} from '../../BaseStyles'
import {tooltipDirectionPlacement} from './direction'
import {Tooltip, type TooltipDelay} from './Tooltip'

describe('Tooltip', () => {
  afterEach(cleanup)

  it('supports controlled state and provides an accessible description', async () => {
    const onOpenChange = vi.fn()
    render(
      <Tooltip open onOpenChange={onOpenChange}>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content data-testid="tooltip">Save this file</Tooltip.Content>
      </Tooltip>,
    )
    const tooltip = await screen.findByTestId('tooltip')
    expect(tooltip).toHaveTextContent('Save this file')
    expect(tooltip).toHaveAttribute('aria-hidden', 'true')
    expect(tooltip).not.toHaveAttribute('role')
    expect(screen.getByRole('button', {name: 'Save'})).toHaveAccessibleDescription('Save this file')
  })

  it('describes the trigger with text and a keyboard hint, without the visual hint', () => {
    render(
      <Tooltip keybindingHint="Control+K">
        <Tooltip.Trigger>Search</Tooltip.Trigger>
        <Tooltip.Content>Search files</Tooltip.Content>
      </Tooltip>,
    )
    expect(screen.getByRole('button', {name: 'Search'})).toHaveAccessibleDescription('Search files (control k)')
  })

  it('hides the lower-level popup from the accessibility tree by default', () => {
    render(
      <Tooltip open id="composed-tooltip">
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup id="composed-tooltip" data-testid="popup">
              Save this file
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip>,
    )
    expect(screen.getByTestId('popup')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('popup')).not.toHaveAttribute('role')
    expect(screen.getByRole('button', {name: 'Save'})).toHaveAccessibleDescription('Save this file')
  })

  it('portals into the nearest BaseStyles so content inherits its theme and typography', async () => {
    render(
      <>
        <BaseStyles data-testid="first" />
        <BaseStyles data-testid="second">
          <Tooltip open>
            <Tooltip.Trigger>Save</Tooltip.Trigger>
            <Tooltip.Content data-testid="tooltip">Save this file</Tooltip.Content>
          </Tooltip>
        </BaseStyles>
      </>,
    )
    const tooltip = await screen.findByTestId('tooltip')
    expect(screen.getByTestId('second')).toContainElement(tooltip)
  })

  it('renders in place when portal is false', async () => {
    render(
      <div data-testid="container">
        <Tooltip open>
          <Tooltip.Trigger>Save</Tooltip.Trigger>
          <Tooltip.Content portal={false} data-testid="tooltip">
            Save this file
          </Tooltip.Content>
        </Tooltip>
      </div>,
    )
    expect(screen.getByTestId('container')).toContainElement(await screen.findByTestId('tooltip'))
  })

  it('closes on escape without moving focus from the trigger', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip defaultOpen>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content data-testid="tooltip">Save this file</Tooltip.Content>
      </Tooltip>,
    )
    const trigger = screen.getByRole('button', {name: 'Save'})
    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip).toHaveAttribute('data-open')
    trigger.focus()
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
    expect(tooltip).toHaveAttribute('data-closed')
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

  it('opens below the trigger by default', async () => {
    render(
      <Tooltip open>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content data-testid="tooltip">Save this file</Tooltip.Content>
      </Tooltip>,
    )
    expect(await screen.findByTestId('tooltip')).toHaveAttribute('data-side', 'bottom')
  })

  it('maps diagonal directions to the side and alignment Primer React uses', () => {
    expect(tooltipDirectionPlacement.ne).toEqual({align: 'start', side: 'top'})
    expect(tooltipDirectionPlacement.nw).toEqual({align: 'end', side: 'top'})
    expect(tooltipDirectionPlacement.se).toEqual({align: 'start', side: 'bottom'})
    expect(tooltipDirectionPlacement.sw).toEqual({align: 'end', side: 'bottom'})
  })

  describe('labels', () => {
    it('names the trigger with the tooltip text while closed', () => {
      render(
        <Tooltip type="label">
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content -- The trigger supplies the content through the render prop. */}
          <Tooltip.Trigger render={<a href="#docs" />}>
            <svg aria-hidden="true" />
          </Tooltip.Trigger>
          <Tooltip.Content>Contribution docs</Tooltip.Content>
        </Tooltip>,
      )
      const link = screen.getByRole('link', {name: 'Contribution docs'})
      expect(link).not.toHaveAttribute('aria-describedby')
    })

    it('keeps keybinding hints out of the name and in the description', () => {
      render(
        <Tooltip type="label" keybindingHint="Control+K">
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content -- The trigger supplies the content through the render prop. */}
          <Tooltip.Trigger render={<a href="#search" />}>
            <svg aria-hidden="true" />
          </Tooltip.Trigger>
          <Tooltip.Content>Search</Tooltip.Content>
        </Tooltip>,
      )
      expect(screen.getByRole('link', {name: 'Search'})).toHaveAccessibleDescription('(control k)')
    })

    it('keeps an existing aria-label without adding a redundant aria-labelledby', () => {
      render(
        <>
          <Tooltip type="label">
            <Tooltip.Trigger aria-label="Edit file">
              <svg aria-hidden="true" />
            </Tooltip.Trigger>
            <Tooltip.Content>Edit file</Tooltip.Content>
          </Tooltip>
          <Tooltip type="label">
            <Tooltip.Trigger render={<a href="#history" aria-label="View history" />}>
              <svg aria-hidden="true" />
            </Tooltip.Trigger>
            <Tooltip.Content>View history</Tooltip.Content>
          </Tooltip>
        </>,
      )
      expect(screen.getByRole('button', {name: 'Edit file'})).not.toHaveAttribute('aria-labelledby')
      expect(screen.getByRole('link', {name: 'View history'})).not.toHaveAttribute('aria-labelledby')
    })

    it('lets an aria-labelledby on the trigger take precedence', () => {
      render(
        <>
          <span id="external-label">External label</span>
          <Tooltip type="label">
            <Tooltip.Trigger aria-labelledby="external-label">
              <svg aria-hidden="true" />
            </Tooltip.Trigger>
            <Tooltip.Content>Tooltip label</Tooltip.Content>
          </Tooltip>
        </>,
      )
      expect(screen.getByRole('button', {name: 'External label'})).toHaveAttribute('aria-labelledby', 'external-label')
    })
  })

  it('uses a custom id for the tooltip text so other elements can reference it', () => {
    render(
      <Tooltip id="custom-tooltip" type="label">
        <Tooltip.Trigger aria-labelledby="custom-tooltip">
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content>Close feedback form</Tooltip.Content>
      </Tooltip>,
    )
    expect(screen.getByRole('button', {name: 'Close feedback form'})).toHaveAttribute(
      'aria-labelledby',
      'custom-tooltip',
    )
    expect(document.getElementById('custom-tooltip')).toHaveAttribute('data-component', 'Tooltip.Content')
  })

  it('appends the description to an existing aria-describedby', () => {
    render(
      <>
        <span id="external-description">External description</span>
        <Tooltip>
          <Tooltip.Trigger aria-describedby="external-description">Save</Tooltip.Trigger>
          <Tooltip.Content>Supplementary text</Tooltip.Content>
        </Tooltip>
      </>,
    )
    expect(screen.getByRole('button', {name: 'Save'})).toHaveAccessibleDescription(
      'External description Supplementary text',
    )
  })

  it('neither names nor describes the trigger, nor mounts content, while disabled', () => {
    render(
      <Tooltip disabled>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Content data-testid="tooltip">Save this file</Tooltip.Content>
      </Tooltip>,
    )
    const trigger = screen.getByRole('button', {name: 'Save'})
    expect(trigger).not.toHaveAttribute('aria-describedby')
    expect(trigger).not.toHaveAttribute('aria-labelledby')
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument()
  })

  describe('delay', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    const hover = (element: HTMLElement) => {
      fireEvent.pointerEnter(element, {pointerType: 'mouse'})
      fireEvent.mouseEnter(element)
      fireEvent.mouseMove(element)
    }

    const advance = (ms: number) => {
      act(() => {
        vi.advanceTimersByTime(ms)
      })
    }

    it.each([
      ['short', 50],
      ['medium', 400],
      ['long', 1200],
    ] satisfies Array<[TooltipDelay, number]>)('opens a %s tooltip %ims after hover', (delay, ms) => {
      vi.useFakeTimers()
      const onOpenChange = vi.fn()
      render(
        <Tooltip delay={delay} onOpenChange={onOpenChange}>
          <Tooltip.Trigger>Save</Tooltip.Trigger>
          <Tooltip.Content>Save this file</Tooltip.Content>
        </Tooltip>,
      )
      hover(screen.getByRole('button', {name: 'Save'}))
      advance(ms - 10)
      expect(onOpenChange).not.toHaveBeenCalled()
      advance(10)
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
    })

    it('lets a numeric trigger delay override the named delay', () => {
      vi.useFakeTimers()
      const onOpenChange = vi.fn()
      render(
        <Tooltip delay="long" onOpenChange={onOpenChange}>
          <Tooltip.Trigger delay={0}>Save</Tooltip.Trigger>
          <Tooltip.Content>Save this file</Tooltip.Content>
        </Tooltip>,
      )
      hover(screen.getByRole('button', {name: 'Save'}))
      advance(0)
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
    })

    it('defers to the provider delay unless the tooltip sets its own', () => {
      vi.useFakeTimers()
      const onProviderOpenChange = vi.fn()
      const onOwnOpenChange = vi.fn()
      render(
        <Tooltip.Provider delay="long">
          <Tooltip onOpenChange={onProviderOpenChange}>
            <Tooltip.Trigger>Provider</Tooltip.Trigger>
            <Tooltip.Content>Uses the provider delay</Tooltip.Content>
          </Tooltip>
          <Tooltip delay="short" onOpenChange={onOwnOpenChange}>
            <Tooltip.Trigger>Own</Tooltip.Trigger>
            <Tooltip.Content>Uses its own delay</Tooltip.Content>
          </Tooltip>
        </Tooltip.Provider>,
      )
      hover(screen.getByRole('button', {name: 'Provider'}))
      advance(1190)
      expect(onProviderOpenChange).not.toHaveBeenCalled()
      advance(10)
      expect(onProviderOpenChange).toHaveBeenCalledWith(true, expect.anything())
    })

    it('applies its own delay inside a provider', () => {
      vi.useFakeTimers()
      const onOpenChange = vi.fn()
      render(
        <Tooltip.Provider delay="long">
          <Tooltip delay="short" onOpenChange={onOpenChange}>
            <Tooltip.Trigger>Own</Tooltip.Trigger>
            <Tooltip.Content>Uses its own delay</Tooltip.Content>
          </Tooltip>
        </Tooltip.Provider>,
      )
      hover(screen.getByRole('button', {name: 'Own'}))
      advance(50)
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
    })

    it('opens on keyboard focus without waiting for the delay', () => {
      vi.useFakeTimers()
      const onOpenChange = vi.fn()
      render(
        <Tooltip delay="long" onOpenChange={onOpenChange}>
          <Tooltip.Trigger>Save</Tooltip.Trigger>
          <Tooltip.Content>Save this file</Tooltip.Content>
        </Tooltip>,
      )
      fireEvent.keyDown(document.body, {key: 'Tab'})
      act(() => {
        screen.getByRole('button', {name: 'Save'}).focus()
      })
      advance(0)
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
    })
  })
})
