import {cleanup, render, screen, waitFor} from '@testing-library/react'
import {createRef} from 'react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Portal} from './Portal'

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

    expect(screen.getByTestId('portal')).toHaveClass('relative', 'z-[1]')
  })
})
