import type React from 'react'
import {Popover as BasePopover} from '@base-ui/react/popover'
import {act, cleanup, render, screen, waitFor} from '@testing-library/react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it} from 'vitest'
import {BaseStyles} from '../BaseStyles'
import {BasePortalProvider} from '../base'
import {Popover} from '../components/Popover'
import {Portal} from '../components/Portal'
import type {PortalContainer} from '../utils/types/portal'
import {usePortalContainer, usePortalRoot} from './index'

const results: Record<string, PortalContainer | undefined> = {}

function record(id: string, value: PortalContainer | undefined) {
  results[id] = value
}

function Probe({id, container}: {id: string; container?: PortalContainer}) {
  record(id, usePortalContainer(container))
  return null
}

function RootProbe({id}: {id: string}) {
  record(id, usePortalRoot())
  return null
}

/** A host-composed Base UI popover routed with the public hook, not a Primer component. */
function HostPopover({container}: {container?: PortalContainer}) {
  const resolved = usePortalContainer(container)
  return (
    <BasePopover.Root open>
      <BasePopover.Trigger>Host</BasePopover.Trigger>
      <BasePopover.Portal container={resolved}>
        <BasePopover.Positioner>
          <BasePopover.Popup data-testid="host-popup">Host popup</BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  )
}

function appendContainer() {
  const element = document.createElement('div')
  document.body.append(element)
  return element
}

describe('usePortalContainer', () => {
  afterEach(() => {
    cleanup()
    for (const key of Object.keys(results)) delete results[key]
    for (const element of document.querySelectorAll('[data-portal-root]')) element.remove()
  })

  it('keeps an explicit container, including null and refs, over the nearest provider', () => {
    const provided = appendContainer()
    const explicit = appendContainer()
    const ref = {current: explicit}

    render(
      <BasePortalProvider container={provided}>
        <Probe id="element" container={explicit} />
        <Probe id="ref" container={ref} />
        <Probe id="null" container={null} />
        <Probe id="inherited" />
      </BasePortalProvider>,
    )

    expect(results.element).toBe(explicit)
    expect(results.ref).toBe(ref)
    expect(results.null).toBeNull()
    expect(results.inherited).toBe(provided)
    provided.remove()
    explicit.remove()
  })

  it('uses the nearest provider, including null, before the default root', () => {
    const outer = appendContainer()
    const nearer = appendContainer()

    render(
      <>
        <Probe id="default" />
        <BasePortalProvider container={outer}>
          <Probe id="outer" />
          <BasePortalProvider>
            <Probe id="transparent" />
          </BasePortalProvider>
          <BasePortalProvider container={nearer}>
            <Probe id="nearer" />
          </BasePortalProvider>
          <BasePortalProvider container={null}>
            <Probe id="waiting" />
          </BasePortalProvider>
        </BasePortalProvider>
      </>,
    )

    expect(results.default).toBe(document.body)
    expect(results.outer).toBe(outer)
    expect(results.transparent).toBe(outer)
    expect(results.nearer).toBe(nearer)
    expect(results.waiting).toBeNull()
    outer.remove()
    nearer.remove()
  })

  it('routes a host-composed Base UI portal through the provider and an explicit override', async () => {
    const provided = appendContainer()
    const explicit = appendContainer()

    const {rerender} = render(
      <BasePortalProvider container={provided}>
        <HostPopover />
      </BasePortalProvider>,
    )
    expect(provided).toContainElement(await screen.findByTestId('host-popup'))

    rerender(
      <BasePortalProvider container={provided}>
        <HostPopover container={explicit} />
      </BasePortalProvider>,
    )
    await waitFor(() => {
      expect(explicit).toContainElement(screen.getByTestId('host-popup'))
    })
    provided.remove()
    explicit.remove()
  })

  it('leaves nested Base UI portals in their Primer floating layer unless a nearer provider is supplied', async () => {
    const provided = appendContainer()
    const nearer = appendContainer()

    render(
      <BasePortalProvider container={provided}>
        <Popover open>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content data-testid="layer">
            <Probe id="nested" />
            <BasePortalProvider container={nearer}>
              <Probe id="routed" />
            </BasePortalProvider>
          </Popover.Content>
        </Popover>
      </BasePortalProvider>,
    )

    expect(provided).toContainElement(await screen.findByTestId('layer'))
    expect(results.nested).toBeUndefined()
    expect(results.routed).toBe(nearer)
    provided.remove()
    nearer.remove()
  })

  it('shares provider state with Portal.Provider and the styled Portal', async () => {
    const provided = appendContainer()

    expect(Portal.Provider).toBe(BasePortalProvider)
    render(
      <Portal.Provider container={provided}>
        <Probe id="hook" />
        <Portal data-testid="portal">Portaled</Portal>
      </Portal.Provider>,
    )

    expect(results.hook).toBe(provided)
    await waitFor(() => {
      expect(provided).toContainElement(screen.getByTestId('portal'))
    })
    provided.remove()
  })
})

describe('usePortalRoot', () => {
  afterEach(() => {
    cleanup()
    for (const key of Object.keys(results)) delete results[key]
    for (const element of document.querySelectorAll('[data-portal-root]')) element.remove()
  })

  it('resolves the default root and ignores providers', () => {
    const provided = appendContainer()
    render(
      <BasePortalProvider container={provided}>
        <RootProbe id="body" />
      </BasePortalProvider>,
    )
    expect(results.body).toBe(document.body)
    cleanup()

    const documentRoot = appendContainer()
    documentRoot.setAttribute('data-portal-root', '')
    render(<RootProbe id="document" />)
    expect(results.document).toBe(documentRoot)
    provided.remove()
  })

  it('prefers the nearest BaseStyles element', async () => {
    render(
      <BaseStyles data-testid="base-styles">
        <RootProbe id="baseStyles" />
      </BaseStyles>,
    )
    await waitFor(() => {
      expect(results.baseStyles).toBe(screen.getByTestId('base-styles'))
    })
  })

  it('resets inherited routing to the default root through a nested provider', async () => {
    const outer = appendContainer()
    function ResetToDefault({children}: {children: React.ReactNode}) {
      return <BasePortalProvider container={usePortalRoot()}>{children}</BasePortalProvider>
    }

    render(
      <BasePortalProvider container={outer}>
        <ResetToDefault>
          <Portal data-testid="portal">Portaled</Portal>
        </ResetToDefault>
      </BasePortalProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('portal').parentElement).toBe(document.body)
    })
    outer.remove()
  })
})

describe('portal routing hydration', () => {
  it('hydrates without a provider wrapper or portal markup, then renders into the provided container', async () => {
    const provided = appendContainer()
    const element = (
      <BasePortalProvider container={provided}>
        <span>Inline</span>
        <Portal data-testid="portal">Portaled</Portal>
      </BasePortalProvider>
    )
    const host = appendContainer()
    host.innerHTML = renderToString(element)
    const inline = host.firstElementChild
    expect(host.childNodes).toHaveLength(1)
    expect(inline).toHaveTextContent('Inline')

    const recoverableErrors: unknown[] = []
    const root = hydrateRoot(host, element, {onRecoverableError: error => recoverableErrors.push(error)})
    try {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      expect(provided).toContainElement(screen.getByTestId('portal'))
      expect(host.childNodes).toHaveLength(1)
      expect(host.firstElementChild).toBe(inline)
      expect(recoverableErrors).toEqual([])
    } finally {
      await act(async () => root.unmount())
      host.remove()
      provided.remove()
    }
  })
})
