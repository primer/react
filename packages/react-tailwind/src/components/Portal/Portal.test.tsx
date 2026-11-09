import {cleanup, render, screen, waitFor} from '@testing-library/react'
import {createRef} from 'react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {IconButton} from '../IconButton'
import {Popover} from '../Popover'
import {SegmentedControl} from '../SegmentedControl'
import {Tooltip} from '../Tooltip'
import {Portal} from './Portal'

const TestIcon = () => <svg aria-hidden="true" />

describe('Portal', () => {
  afterEach(() => {
    cleanup()
    document.querySelector('[data-testid="portal-root"]')?.remove()
  })

  it('renders into the document body after hydration', async () => {
    render(<Portal>Portaled content</Portal>)

    await waitFor(() => {
      expect(screen.getByText('Portaled content')).toHaveAttribute('data-component', 'Portal')
    })
  })

  it('renders into an explicit container and forwards props and refs', async () => {
    const container = document.createElement('div')
    const ref = createRef<HTMLDivElement>()
    const onMount = vi.fn()
    document.body.append(container)

    render(
      <Portal className="portal-content" container={container} data-testid="portal" onMount={onMount} ref={ref}>
        Portaled content
      </Portal>,
    )

    await waitFor(() => {
      expect(container).toContainElement(screen.getByTestId('portal'))
    })

    expect(ref.current).toBe(screen.getByTestId('portal'))
    expect(screen.getByTestId('portal')).toHaveClass('portal-content')
    expect(onMount).toHaveBeenCalledTimes(1)
  })

  it('uses the nearest Primer portal root before falling back to the document body', async () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('data-portal-root', 'true')
    portalRoot.setAttribute('data-testid', 'portal-root')
    document.body.append(portalRoot)

    render(<Portal data-testid="portal">Portaled content</Portal>)

    await waitFor(() => {
      expect(portalRoot).toContainElement(screen.getByTestId('portal'))
    })

    expect(screen.getByTestId('portal')).toHaveClass('primer:relative', 'primer:z-[1]')
  })

  describe('Portal.Provider', () => {
    it('routes portals and internally generated tooltips without rendering an element', async () => {
      const container = document.createElement('div')
      document.body.append(container)

      const {container: renderRoot} = render(
        <Portal.Provider container={container}>
          <Portal data-testid="portal">Portaled content</Portal>
          <IconButton aria-label="Back" icon={TestIcon} />
          <SegmentedControl aria-label="View" defaultValue={['list']}>
            <SegmentedControl.IconButton value="list" aria-label="List view" icon={TestIcon} />
          </SegmentedControl>
        </Portal.Provider>,
      )

      await waitFor(() => {
        expect(container).toContainElement(screen.getByTestId('portal'))
      })
      const tooltips = Array.from(container.querySelectorAll('[data-component="Tooltip.Content"]'))
      expect(tooltips.map(tooltip => tooltip.textContent)).toEqual(expect.arrayContaining(['Back', 'List view']))
      expect(renderRoot.querySelector('[data-component="Tooltip.Content"]')).toBeNull()
      container.remove()
    })

    it('accepts a ref container and lets explicit containers and portal={false} win', async () => {
      const provided = document.createElement('div')
      const explicit = document.createElement('div')
      document.body.append(provided, explicit)

      render(
        <Portal.Provider container={{current: provided}}>
          <Tooltip open>
            <Tooltip.Trigger>Save</Tooltip.Trigger>
            <Tooltip.Content container={explicit} data-testid="explicit">
              Save this file
            </Tooltip.Content>
          </Tooltip>
          <div data-testid="inline-parent">
            <Tooltip open>
              <Tooltip.Trigger>Copy</Tooltip.Trigger>
              <Tooltip.Content portal={false} data-testid="inline">
                Copy this file
              </Tooltip.Content>
            </Tooltip>
          </div>
          <Portal data-testid="portal">Portaled content</Portal>
        </Portal.Provider>,
      )

      expect(explicit).toContainElement(await screen.findByTestId('explicit'))
      expect(screen.getByTestId('inline-parent')).toContainElement(await screen.findByTestId('inline'))
      await waitFor(() => {
        expect(provided).toContainElement(screen.getByTestId('portal'))
      })
      provided.remove()
      explicit.remove()
    })

    it('waits for a null container instead of falling back to the document', async () => {
      const container = document.createElement('div')
      document.body.append(container)
      const ui = (target: HTMLElement | null) => (
        <Portal.Provider container={target}>
          <Tooltip open>
            <Tooltip.Trigger>Save</Tooltip.Trigger>
            <Tooltip.Content data-testid="tooltip">Save this file</Tooltip.Content>
          </Tooltip>
        </Portal.Provider>
      )
      const {rerender} = render(ui(null))

      await new Promise(resolve => setTimeout(resolve, 50))
      expect(screen.queryByTestId('tooltip')).toBeNull()

      rerender(ui(container))
      expect(container).toContainElement(await screen.findByTestId('tooltip'))
      container.remove()
    })

    it('is transparent when the container is undefined', async () => {
      const outer = document.createElement('div')
      document.body.append(outer)

      render(
        <Portal.Provider container={outer}>
          <Portal.Provider>
            <Portal data-testid="portal">Portaled content</Portal>
          </Portal.Provider>
        </Portal.Provider>,
      )

      await waitFor(() => {
        expect(outer).toContainElement(screen.getByTestId('portal'))
      })
      outer.remove()
    })

    it('keeps nested floating content in its parent layer unless a nearer provider is supplied', async () => {
      const provided = document.createElement('div')
      const nearer = document.createElement('div')
      document.body.append(provided, nearer)

      render(
        <Portal.Provider container={provided}>
          <Popover open>
            <Popover.Trigger>Open</Popover.Trigger>
            <Popover.Content data-testid="popover">
              <Tooltip open>
                <Tooltip.Trigger>Nested</Tooltip.Trigger>
                <Tooltip.Content data-testid="nested">Nested tooltip</Tooltip.Content>
              </Tooltip>
              <Portal.Provider container={nearer}>
                <Tooltip open>
                  <Tooltip.Trigger>Routed</Tooltip.Trigger>
                  <Tooltip.Content data-testid="routed">Routed tooltip</Tooltip.Content>
                </Tooltip>
              </Portal.Provider>
            </Popover.Content>
          </Popover>
        </Portal.Provider>,
      )

      const popover = await screen.findByTestId('popover')
      expect(provided).toContainElement(popover)
      expect(provided).toContainElement(await screen.findByTestId('nested'))
      expect(nearer).toContainElement(await screen.findByTestId('routed'))
      provided.remove()
      nearer.remove()
    })
  })
})
