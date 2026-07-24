import {cleanup, render, screen, waitFor} from '@testing-library/react'
import {createRef} from 'react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Portal} from './Portal'

describe('Portal', () => {
  afterEach(cleanup)

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
})
