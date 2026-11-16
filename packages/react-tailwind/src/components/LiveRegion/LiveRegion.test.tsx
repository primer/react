import {cleanup, render, screen} from '@testing-library/react'
import {createRef} from 'react'
import {afterEach, describe, expect, it} from 'vitest'
import {Announce, AriaAlert, AriaStatus} from './LiveRegion'

describe('live regions', () => {
  afterEach(cleanup)

  it('renders polite announcements with native live-region semantics', () => {
    const ref = createRef<HTMLElement>()

    render(
      <Announce data-testid="announce" ref={ref}>
        Saved
      </Announce>,
    )

    const announce = screen.getByTestId('announce')
    expect(announce).toHaveAttribute('aria-atomic', 'true')
    expect(announce).toHaveAttribute('aria-live', 'polite')
    expect(announce).toHaveAttribute('data-component', 'Announce')
    expect(announce).toHaveAttribute('role', 'status')
    expect(ref.current).toBe(announce)
  })

  it('renders assertive alerts with an alert role', () => {
    render(<AriaAlert data-testid="alert">Export failed</AriaAlert>)

    expect(screen.getByTestId('alert')).toHaveAttribute('aria-live', 'assertive')
    expect(screen.getByTestId('alert')).toHaveAttribute('data-component', 'AriaAlert')
    expect(screen.getByTestId('alert')).toHaveAttribute('role', 'alert')
  })

  it('does not announce status content when it is initially hidden', () => {
    render(
      <AriaStatus data-testid="status" hidden>
        Export complete
      </AriaStatus>,
    )

    expect(screen.getByTestId('status')).toHaveAttribute('aria-live', 'off')
    expect(screen.getByTestId('status')).toHaveAttribute('data-component', 'AriaStatus')
    expect(screen.getByTestId('status')).toHaveAttribute('hidden')
  })

  it('supports a custom element', () => {
    render(
      <Announce as="span" data-testid="announce">
        Saved
      </Announce>,
    )

    expect(screen.getByTestId('announce').tagName).toBe('SPAN')
  })
})
