import React from 'react'
import {Tooltip as BaseTooltip} from '@base-ui/react/tooltip'
import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
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

  it('associates named triggers with their visual popups independently of ARIA references', () => {
    render(
      <>
        <Tooltip id="plain-tooltip" open type="label">
          <Tooltip.Trigger aria-label="Close">
            <svg aria-hidden="true" />
          </Tooltip.Trigger>
          <Tooltip.Content data-testid="plain-popup">Close</Tooltip.Content>
        </Tooltip>
        <Tooltip id="hint-tooltip" keybindingHint="Control+K" open type="label">
          <Tooltip.Trigger render={<button aria-label="Search" type="button" />} />
          <Tooltip.Content data-testid="hint-popup">Search</Tooltip.Content>
        </Tooltip>
      </>,
    )

    const close = screen.getByRole('button', {name: 'Close'})
    const search = screen.getByRole('button', {name: 'Search'})
    const closeOwner = close.getAttribute('data-tooltip-trigger')
    const searchOwner = search.getAttribute('data-tooltip-trigger')
    expect(closeOwner).toBeTruthy()
    expect(searchOwner).toBeTruthy()
    expect(closeOwner).not.toBe(searchOwner)
    expect(screen.getByTestId('plain-popup').getAttribute('data-tooltip-popup')).toBe(closeOwner)
    expect(screen.getByTestId('hint-popup').getAttribute('data-tooltip-popup')).toBe(searchOwner)
    expect(close).not.toHaveAttribute('aria-labelledby')
    expect(close).not.toHaveAttribute('aria-describedby')
    expect(search).not.toHaveAttribute('aria-labelledby')
    expect(search).toHaveAccessibleDescription('(control k)')
    expect(screen.getByTestId('hint-popup')).toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards the association through trigger and popup render callbacks', () => {
    render(
      <Tooltip open>
        <Tooltip.Trigger
          render={props => (
            <a {...props} href="#details">
              Details
            </a>
          )}
        />
        <Tooltip.Content data-testid="popup" render={props => <div {...props} />}>
          Open details
        </Tooltip.Content>
      </Tooltip>,
    )

    const trigger = screen.getByRole('link', {name: 'Details'})
    const owner = trigger.getAttribute('data-tooltip-trigger')
    expect(owner).toBeTruthy()
    expect(screen.getByTestId('popup').getAttribute('data-tooltip-popup')).toBe(owner)
    expect(trigger).toHaveAccessibleDescription('Open details')
  })

  it('moves the server-rendered reference target to the mounted popup without duplicating its ID', async () => {
    const element = (
      <Tooltip id="hydrated-tooltip" type="label">
        <Tooltip.Trigger>
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content>Save changes</Tooltip.Content>
      </Tooltip>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(element)
    document.body.append(container)
    const serverOwner = container.querySelector('button')?.getAttribute('data-tooltip-trigger')
    const recoverableErrors: unknown[] = []
    const root = hydrateRoot(container, element, {onRecoverableError: error => recoverableErrors.push(error)})

    try {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(serverOwner).toBeTruthy()
      expect(await screen.findByRole('button', {name: 'Save changes'})).toHaveAttribute(
        'aria-labelledby',
        'hydrated-tooltip',
      )
      expect(document.querySelectorAll('#hydrated-tooltip')).toHaveLength(1)
      expect(document.getElementById('hydrated-tooltip')).toHaveAttribute('data-component', 'Tooltip.Content')
      expect(screen.getByRole('button', {name: 'Save changes'}).getAttribute('data-tooltip-trigger')).toBe(serverOwner)
      expect(document.getElementById('hydrated-tooltip')?.getAttribute('data-tooltip-popup')).toBe(serverOwner)
      expect(recoverableErrors).toEqual([])
    } finally {
      await act(async () => root.unmount())
      container.remove()
    }
  })

  it('hydrates a named tooltip with a shortcut without changing its popup association', async () => {
    const element = (
      <Tooltip id="hydrated-hint" keybindingHint="Control+K" type="label">
        <Tooltip.Trigger aria-label="Search" />
        <Tooltip.Content data-testid="popup">Search</Tooltip.Content>
      </Tooltip>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(element)
    document.body.append(container)
    const serverOwner = container.querySelector('button')?.getAttribute('data-tooltip-trigger')
    const recoverableErrors: unknown[] = []
    const root = hydrateRoot(container, element, {onRecoverableError: error => recoverableErrors.push(error)})

    try {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      const trigger = screen.getByRole('button', {name: 'Search'})
      expect(serverOwner).toBeTruthy()
      expect(trigger.getAttribute('data-tooltip-trigger')).toBe(serverOwner)
      expect(screen.getByTestId('popup').getAttribute('data-tooltip-popup')).toBe(serverOwner)
      expect(trigger).not.toHaveAttribute('aria-labelledby')
      expect(trigger).toHaveAccessibleDescription('(control k)')
      expect(document.querySelectorAll('#hydrated-hint')).toHaveLength(1)
      expect(recoverableErrors).toEqual([])
    } finally {
      await act(async () => root.unmount())
      container.remove()
    }
  })

  it('keeps independently prefixed server roots associated through hydration', async () => {
    const fixture = (name: string) => (
      <Tooltip type="label">
        <Tooltip.Trigger aria-label={name} />
        <Tooltip.Content data-testid={`${name}-popup`}>{name}</Tooltip.Content>
      </Tooltip>
    )
    const first = document.createElement('div')
    const second = document.createElement('div')
    first.innerHTML = renderToString(fixture('First'), {identifierPrefix: 'first-'})
    second.innerHTML = renderToString(fixture('Second'), {identifierPrefix: 'second-'})
    document.body.append(first, second)
    const firstOwner = first.querySelector('button')?.getAttribute('data-tooltip-trigger')
    const secondOwner = second.querySelector('button')?.getAttribute('data-tooltip-trigger')
    const recoverableErrors: unknown[] = []
    let firstRoot: ReturnType<typeof hydrateRoot> | undefined
    let secondRoot: ReturnType<typeof hydrateRoot> | undefined

    try {
      await act(async () => {
        firstRoot = hydrateRoot(first, fixture('First'), {
          identifierPrefix: 'first-',
          onRecoverableError: error => recoverableErrors.push(error),
        })
        secondRoot = hydrateRoot(second, fixture('Second'), {
          identifierPrefix: 'second-',
          onRecoverableError: error => recoverableErrors.push(error),
        })
      })

      expect(firstOwner).toBeTruthy()
      expect(secondOwner).toBeTruthy()
      expect(firstOwner).not.toBe(secondOwner)
      expect(screen.getByRole('button', {name: 'First'}).getAttribute('data-tooltip-trigger')).toBe(firstOwner)
      expect(screen.getByRole('button', {name: 'Second'}).getAttribute('data-tooltip-trigger')).toBe(secondOwner)
      expect(screen.getByTestId('First-popup').getAttribute('data-tooltip-popup')).toBe(firstOwner)
      expect(screen.getByTestId('Second-popup').getAttribute('data-tooltip-popup')).toBe(secondOwner)
      expect(recoverableErrors).toEqual([])
    } finally {
      await act(async () => {
        firstRoot?.unmount()
        secondRoot?.unmount()
      })
      first.remove()
      second.remove()
    }
  })

  it('keeps the reference target available while waiting for a portal container', () => {
    render(
      <Tooltip id="pending-tooltip" type="label">
        <Tooltip.Trigger>
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content container={null}>Save changes</Tooltip.Content>
      </Tooltip>,
    )

    expect(screen.getByRole('button', {name: 'Save changes'})).toHaveAttribute('aria-labelledby', 'pending-tooltip')
    expect(document.getElementById('pending-tooltip')).not.toBeNull()
    expect(document.querySelector('[data-component="Tooltip.Content"]')).toBeNull()
  })

  it('merges descriptions from rendered elements and render callbacks', () => {
    render(
      <>
        <span id="existing-description">Existing context.</span>
        <Tooltip>
          <Tooltip.Trigger
            render={
              <a aria-describedby="existing-description" href="#first">
                First
              </a>
            }
          />
          <Tooltip.Content>Opens first.</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger
            render={props => (
              <a {...props} aria-describedby="existing-description" href="#second">
                Second
              </a>
            )}
          />
          <Tooltip.Content>Opens second.</Tooltip.Content>
        </Tooltip>
      </>,
    )
    expect(screen.getByRole('link', {name: 'First'})).toHaveAccessibleDescription('Existing context. Opens first.')
    expect(screen.getByRole('link', {name: 'Second'})).toHaveAccessibleDescription('Existing context. Opens second.')
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
    const trigger = screen.getByRole('button', {name: 'Save'})
    expect(trigger).toHaveAccessibleDescription('Save this file')
    expect(trigger.getAttribute('data-tooltip-trigger')).toBeTruthy()
    expect(screen.getByTestId('popup').getAttribute('data-tooltip-popup')).toBe(
      trigger.getAttribute('data-tooltip-trigger'),
    )
  })

  it('only associates a trigger handle with the matching surrounding tooltip root', () => {
    const matchingHandle = BaseTooltip.createHandle()
    const otherHandle = BaseTooltip.createHandle()
    render(
      <Tooltip handle={matchingHandle} open>
        <Tooltip.Trigger handle={matchingHandle}>Matching trigger</Tooltip.Trigger>
        <Tooltip.Trigger handle={otherHandle}>Different handle</Tooltip.Trigger>
        <Tooltip.Content data-testid="popup">Tooltip text</Tooltip.Content>
      </Tooltip>,
    )

    const matchingTrigger = screen.getByRole('button', {name: 'Matching trigger'})
    const otherTrigger = screen.getByRole('button', {name: 'Different handle'})
    const owner = matchingTrigger.getAttribute('data-tooltip-trigger')
    expect(owner).toBeTruthy()
    expect(screen.getByTestId('popup').getAttribute('data-tooltip-popup')).toBe(owner)
    expect(otherTrigger).not.toHaveAttribute('data-tooltip-trigger')
  })

  it('does not associate a detached handle trigger outside the owning root', () => {
    const handle = BaseTooltip.createHandle()
    render(
      <>
        <Tooltip.Trigger handle={handle}>Detached trigger</Tooltip.Trigger>
        <Tooltip handle={handle} open>
          <Tooltip.Content data-testid="popup">Tooltip text</Tooltip.Content>
        </Tooltip>
      </>,
    )

    expect(screen.getByRole('button', {name: 'Detached trigger'})).not.toHaveAttribute('data-tooltip-trigger')
    expect(screen.getByTestId('popup').getAttribute('data-tooltip-popup')).toBeTruthy()
  })

  it('distinguishes identical tooltip text and tracks which shared trigger is open', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Tooltip>
          <Tooltip.Trigger>First</Tooltip.Trigger>
          <Tooltip.Trigger>Second</Tooltip.Trigger>
          <Tooltip.Content data-testid="shared-popup">Same text</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger>Third</Tooltip.Trigger>
          <Tooltip.Content data-testid="other-popup">Same text</Tooltip.Content>
        </Tooltip>
      </>,
    )

    const first = screen.getByRole('button', {name: 'First'})
    const second = screen.getByRole('button', {name: 'Second'})
    const third = screen.getByRole('button', {name: 'Third'})
    const sharedOwner = first.getAttribute('data-tooltip-trigger')
    const otherOwner = third.getAttribute('data-tooltip-trigger')
    expect(sharedOwner).toBeTruthy()
    expect(second.getAttribute('data-tooltip-trigger')).toBe(sharedOwner)
    expect(otherOwner).toBeTruthy()
    expect(otherOwner).not.toBe(sharedOwner)
    expect(screen.getByTestId('shared-popup').getAttribute('data-tooltip-popup')).toBe(sharedOwner)
    expect(screen.getByTestId('other-popup').getAttribute('data-tooltip-popup')).toBe(otherOwner)
    expect(first).not.toHaveAttribute('data-popup-open')

    await user.tab()
    await waitFor(() => expect(first).toHaveAttribute('data-popup-open'))
    expect(second).not.toHaveAttribute('data-popup-open')
    await user.tab()
    await waitFor(() => expect(second).toHaveAttribute('data-popup-open'))
    expect(first).not.toHaveAttribute('data-popup-open')
  })

  it('keeps the association stable when a delayed portal becomes available', () => {
    const container = document.createElement('div')
    document.body.append(container)
    const fixture = (portalContainer: HTMLElement | null) => (
      <Tooltip open type="label">
        <Tooltip.Trigger aria-label="Close" />
        <Tooltip.Content container={portalContainer} data-testid="popup">
          Close
        </Tooltip.Content>
      </Tooltip>
    )
    const {rerender, unmount} = render(fixture(null))
    try {
      const trigger = screen.getByRole('button', {name: 'Close'})
      const owner = trigger.getAttribute('data-tooltip-trigger')
      expect(owner).toBeTruthy()
      expect(screen.queryByTestId('popup')).not.toBeInTheDocument()

      rerender(fixture(container))
      expect(screen.getByTestId('popup').getAttribute('data-tooltip-popup')).toBe(owner)
      expect(container).toContainElement(screen.getByTestId('popup'))
    } finally {
      unmount()
      container.remove()
    }
  })

  it('keeps the association stable when an unmounted popup reopens', async () => {
    const fixture = (open: boolean) => (
      <Tooltip open={open}>
        <Tooltip.Trigger>Details</Tooltip.Trigger>
        <Tooltip.Content data-testid="popup" keepMounted={false}>
          Open details
        </Tooltip.Content>
      </Tooltip>
    )
    const {rerender} = render(fixture(true))
    const trigger = screen.getByRole('button', {name: 'Details'})
    const owner = trigger.getAttribute('data-tooltip-trigger')
    expect(owner).toBeTruthy()
    expect(screen.getByTestId('popup').getAttribute('data-tooltip-popup')).toBe(owner)
    expect(trigger).toHaveAccessibleDescription('Open details')

    rerender(fixture(false))
    await waitFor(() => expect(screen.queryByTestId('popup')).not.toBeInTheDocument())
    expect(trigger.getAttribute('data-tooltip-trigger')).toBe(owner)
    expect(trigger).toHaveAccessibleDescription('Open details')

    rerender(fixture(true))
    expect((await screen.findByTestId('popup')).getAttribute('data-tooltip-popup')).toBe(owner)
    expect(trigger).toHaveAccessibleDescription('Open details')
  })

  it('preserves the association when a popup is portaled into an open shadow root', () => {
    const host = document.createElement('div')
    document.body.append(host)
    const shadowRoot = host.attachShadow({mode: 'open'})
    const portalContainer = document.createElement('div')
    shadowRoot.append(portalContainer)
    const {unmount} = render(
      <Tooltip open type="label">
        <Tooltip.Trigger aria-label="Close" />
        <Tooltip.Content container={portalContainer}>Close</Tooltip.Content>
      </Tooltip>,
    )
    try {
      const trigger = screen.getByRole('button', {name: 'Close'})
      const owner = trigger.getAttribute('data-tooltip-trigger')
      expect(owner).toBeTruthy()
      expect(shadowRoot.querySelector('[data-tooltip-popup]')?.getAttribute('data-tooltip-popup')).toBe(owner)
      expect(document.querySelector('[data-tooltip-popup]')).toBeNull()
      expect(trigger).not.toHaveAttribute('aria-labelledby')
    } finally {
      unmount()
      host.remove()
    }
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
    expect(screen.getByTestId('arrow')).toHaveClass('primer:[--arrow-bg-color:var(--tooltip-bgColor)]', 'open')
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

    it('preserves a render callback label without discarding explicit trigger references', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const ref = React.createRef<HTMLElement>()
      render(
        <>
          <span id="callback-name">Callback reference</span>
          <Tooltip type="label" id="callback-tooltip" keybindingHint="Control+K">
            <Tooltip.Trigger
              ref={ref}
              render={props => <button {...props} aria-label="Caller-owned name" onClick={onClick} type="button" />}
            >
              <svg aria-hidden="true" />
            </Tooltip.Trigger>
            <Tooltip.Content>Visual label</Tooltip.Content>
          </Tooltip>
          <Tooltip type="label" id="referenced-tooltip">
            <Tooltip.Trigger
              aria-labelledby="referenced-tooltip"
              render={props => <button {...props} aria-label="Fallback name" type="button" />}
            />
            <Tooltip.Content>Explicit tooltip reference</Tooltip.Content>
          </Tooltip>
          <Tooltip type="label">
            <Tooltip.Trigger
              render={props => (
                <button {...props} aria-label="Fallback name" aria-labelledby="callback-name" type="button" />
              )}
            />
            <Tooltip.Content>Other visual label</Tooltip.Content>
          </Tooltip>
        </>,
      )
      const trigger = screen.getByRole('button', {name: 'Caller-owned name'})
      expect(trigger).not.toHaveAttribute('aria-labelledby')
      expect(trigger).toHaveAccessibleDescription('(control k)')
      expect(ref.current).toBe(trigger)
      await user.click(trigger)
      expect(onClick).toHaveBeenCalledOnce()
      expect(screen.getByRole('button', {name: 'Explicit tooltip reference'})).toHaveAttribute(
        'aria-labelledby',
        'referenced-tooltip',
      )
      expect(screen.getByRole('button', {name: 'Callback reference'})).toHaveAttribute(
        'aria-labelledby',
        'callback-name',
      )
    })

    it('honors content names with hints for default and custom popup rendering', () => {
      render(
        <>
          <span id="content-reference">Referenced content name</span>
          <Tooltip type="label" keybindingHint="Control+K">
            <Tooltip.Trigger>
              <svg aria-hidden="true" />
            </Tooltip.Trigger>
            <Tooltip.Content aria-label="Contextual label">Visible label</Tooltip.Content>
          </Tooltip>
          <Tooltip type="label" keybindingHint="Control+K">
            <Tooltip.Trigger>
              <svg aria-hidden="true" />
            </Tooltip.Trigger>
            <Tooltip.Content aria-label="Fallback" render={<div aria-labelledby="content-reference" role="group" />}>
              Visible label
            </Tooltip.Content>
          </Tooltip>
          <Tooltip type="label" keybindingHint="Control+K">
            <Tooltip.Trigger>
              <svg aria-hidden="true" />
            </Tooltip.Trigger>
            <Tooltip.Content
              aria-label="Fallback"
              render={props => <div {...props} aria-label="Callback content name" />}
            >
              Visible label
            </Tooltip.Content>
          </Tooltip>
        </>,
      )
      for (const name of ['Contextual label', 'Fallback', 'Callback content name']) {
        const trigger = screen.getByRole('button', {name})
        expect(trigger).toHaveAccessibleDescription('(control k)')
        const text = document.getElementById(trigger.getAttribute('aria-labelledby') ?? '')
        expect(text).toHaveAttribute('role', 'group')
      }
    })

    it.each([
      ['empty aria-label', {'aria-label': ''}],
      ['whitespace aria-label', {'aria-label': '   '}],
      ['empty aria-labelledby', {'aria-labelledby': ''}],
      ['whitespace aria-labelledby', {'aria-labelledby': '   '}],
    ])('uses the tooltip when the trigger has %s', (_, triggerProps) => {
      render(
        <Tooltip type="label" id="fallback-tooltip">
          <Tooltip.Trigger {...triggerProps}>
            <svg aria-hidden="true" />
          </Tooltip.Trigger>
          <Tooltip.Content aria-label="   ">Meaningful tooltip</Tooltip.Content>
        </Tooltip>,
      )
      expect(screen.getByRole('button', {name: 'Meaningful tooltip'})).toHaveAttribute(
        'aria-labelledby',
        'fallback-tooltip',
      )
    })

    it('uses the tooltip when rendered elements replace trigger names with whitespace', () => {
      render(
        <>
          <Tooltip type="label">
            <Tooltip.Trigger
              aria-label="Overridden label"
              render={<button aria-label=" " aria-labelledby=" " type="button" />}
            />
            <Tooltip.Content>Element fallback</Tooltip.Content>
          </Tooltip>
          <Tooltip type="label">
            <Tooltip.Trigger
              aria-label="Overridden label"
              render={props => <button {...props} aria-label=" " type="button" />}
            />
            <Tooltip.Content>Callback fallback</Tooltip.Content>
          </Tooltip>
          <Tooltip type="label">
            <Tooltip.Trigger render={props => <button {...props} aria-label=" " aria-labelledby=" " type="button" />} />
            <Tooltip.Content>Callback reference fallback</Tooltip.Content>
          </Tooltip>
        </>,
      )
      for (const name of ['Element fallback', 'Callback fallback', 'Callback reference fallback']) {
        expect(screen.getByRole('button', {name})).toHaveAttribute('aria-labelledby')
      }
    })

    it('updates callback names without replacing the trigger or popup', () => {
      const triggerRef = React.createRef<HTMLElement>()
      const contentRef = React.createRef<HTMLDivElement>()
      const fixture = (triggerName: string, contentName: string) => (
        <Tooltip type="label" keybindingHint="Control+K">
          <Tooltip.Trigger
            ref={triggerRef}
            render={props => <button {...props} aria-label={triggerName} type="button" />}
          />
          <Tooltip.Content ref={contentRef} render={props => <div {...props} aria-label={contentName} role="group" />}>
            Visible label
          </Tooltip.Content>
        </Tooltip>
      )
      const {rerender} = render(fixture('Caller name', 'First content name'))
      const trigger = screen.getByRole('button', {name: 'Caller name'})
      const content = contentRef.current
      expect(triggerRef.current).toBe(trigger)
      expect(content).not.toBeNull()

      rerender(fixture(' ', 'Second content name'))
      expect(screen.getByRole('button', {name: 'Second content name'})).toBe(trigger)
      expect(contentRef.current).toBe(content)

      rerender(fixture('Another caller name', 'Third content name'))
      expect(screen.getByRole('button', {name: 'Another caller name'})).toBe(trigger)
      expect(contentRef.current).toBe(content)
    })
  })

  it('includes the content name and shortcut in a description', () => {
    render(
      <Tooltip id="description-tooltip" keybindingHint="Control+K">
        <Tooltip.Trigger>Search</Tooltip.Trigger>
        <Tooltip.Content aria-label="Search all repositories">Search</Tooltip.Content>
      </Tooltip>,
    )
    expect(screen.getByRole('button', {name: 'Search'})).toHaveAttribute('aria-describedby', 'description-tooltip')
    const description = document.getElementById('description-tooltip')
    expect(description).toHaveAttribute('aria-label', 'Search all repositories (control k)')
    expect(description).toHaveTextContent('Search (control k)')
  })

  it.each<[string, Pick<React.AriaAttributes, 'aria-label' | 'aria-labelledby'>]>([
    ['aria-label', {'aria-label': 'Search all repositories'}],
    ['aria-labelledby', {'aria-labelledby': 'tooltip-description-name'}],
    ['both content names', {'aria-label': 'Search all repositories', 'aria-labelledby': 'tooltip-description-name'}],
  ])('preserves %s and a shortcut in a description through hydration', async (_, contentProps) => {
    const element = (
      <>
        <span id="tooltip-description-name">Search all projects</span>
        <Tooltip id="server-description-tooltip" keybindingHint="Control+K">
          <Tooltip.Trigger>Search</Tooltip.Trigger>
          <Tooltip.Content {...contentProps}>Search</Tooltip.Content>
        </Tooltip>
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(element)
    document.body.append(container)
    const recoverableErrors: unknown[] = []
    let root: ReturnType<typeof hydrateRoot> | undefined
    const expectReference = () => {
      expect(container.querySelector('button')).toHaveAttribute('aria-describedby', 'server-description-tooltip')
      const targets = document.querySelectorAll('#server-description-tooltip')
      expect(targets).toHaveLength(1)
      const text =
        contentProps['aria-label'] !== undefined && contentProps['aria-labelledby'] === undefined
          ? targets[0]
          : targets[0].querySelector('[role="group"]')
      if (contentProps['aria-label'] !== undefined) {
        expect(text).toHaveAttribute(
          'aria-label',
          contentProps['aria-labelledby'] === undefined
            ? `${contentProps['aria-label']} (control k)`
            : contentProps['aria-label'],
        )
      }
      if (contentProps['aria-labelledby'] !== undefined) {
        expect(text).toHaveAttribute('aria-labelledby', contentProps['aria-labelledby'])
      }
      expect(text).toHaveTextContent('Search')
      expect(targets[0]).toHaveTextContent('Search (control k)')
    }
    try {
      expectReference()
      await act(async () => {
        root = hydrateRoot(container, element, {onRecoverableError: error => recoverableErrors.push(error)})
      })
      expectReference()
      expect(recoverableErrors).toEqual([])
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
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
    expect(trigger).not.toHaveAttribute('data-tooltip-trigger')
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
