import React from 'react'
import {render, screen, within} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {ProgressBar} from './ProgressBar'

describe('ProgressBar', () => {
  it('exposes progressbar semantics and forwards container props', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<ProgressBar ref={ref} progress={42} aria-label="Upload" data-testid="progress" />)
    expect(screen.getByRole('progressbar', {name: 'Upload'})).toHaveAttribute('aria-valuenow', '42')
    expect(screen.getByTestId('progress')).toBe(ref.current)
  })

  it('uses the Primer shimmer without rounding individual segments', () => {
    const {container} = render(<ProgressBar progress={42} animated aria-label="Upload" />)
    const item = within(container).getByRole('progressbar', {name: 'Upload'})

    expect(item).toHaveClass('primer:motion-safe:animate-[primer-skeleton-shimmer_var(--base-duration-1000)_infinite]')
    expect(item).not.toHaveClass('primer:rounded-full')
    expect(item).not.toHaveClass('primer:transition-[width]')
  })

  it('forwards accessible value overrides and name references to the single segment', () => {
    render(
      <>
        <span id="usage-label">Usage</span>
        <span id="usage-description">No resources used</span>
        <ProgressBar
          progress={100}
          aria-labelledby="usage-label"
          aria-describedby="usage-description"
          aria-valuemin={-10}
          aria-valuemax={200}
          aria-valuenow={0}
          aria-valuetext="0% used"
          fillColor="var(--empty-fill)"
        />
      </>,
    )

    const item = screen.getByRole('progressbar', {name: 'Usage'})
    expect(item).toHaveAttribute('aria-valuemin', '-10')
    expect(item).toHaveAttribute('aria-valuemax', '200')
    expect(item).toHaveAttribute('aria-valuenow', '0')
    expect(item).toHaveAttribute('aria-valuetext', '0% used')
    expect(item).toHaveAccessibleDescription('No resources used')
    expect(item).toHaveStyle({'--progress-width': '100%', '--progress-bg': 'var(--empty-fill)'})
    expect(item.parentElement).not.toHaveAttribute('aria-valuenow')
    expect(item.parentElement).not.toHaveAttribute('aria-valuetext')
    expect(item.parentElement).not.toHaveAttribute('aria-valuemin')
    expect(item.parentElement).not.toHaveAttribute('aria-valuemax')
  })

  it('lets composed segments override their announced values and fill colors', () => {
    render(
      <ProgressBar>
        <ProgressBar.Item
          aria-label="Storage"
          aria-valuemin={-10}
          aria-valuemax={200}
          aria-valuenow={0}
          aria-valuetext="No storage used"
          fillColor="var(--storage-color)"
          progress={100}
        />
      </ProgressBar>,
    )

    const item = screen.getByRole('progressbar', {name: 'Storage'})
    expect(item).toHaveAttribute('aria-valuemin', '-10')
    expect(item).toHaveAttribute('aria-valuemax', '200')
    expect(item).toHaveAttribute('aria-valuenow', '0')
    expect(item).toHaveAttribute('aria-valuetext', 'No storage used')
    expect(item).toHaveStyle({'--progress-width': '100%', '--progress-bg': 'var(--storage-color)'})
  })

  it('renders a zero-valued fallback for empty conditional children and forwards root values to it', () => {
    const {rerender} = render(
      <ProgressBar aria-label="Attachments" aria-valuetext="No attachments">
        {[false, null, undefined]}
      </ProgressBar>,
    )
    const fallback = screen.getByRole('progressbar', {name: 'Attachments'})
    expect(fallback).toHaveAttribute('aria-valuenow', '0')
    expect(fallback).toHaveAttribute('aria-valuetext', 'No attachments')
    expect(fallback).toHaveStyle({'--progress-width': '0%'})

    rerender(
      <ProgressBar aria-label="Attachments" aria-valuenow={12} progress={30}>
        <>
          {false}
          {null}
        </>
      </ProgressBar>,
    )
    const explicitFallback = screen.getByRole('progressbar', {name: 'Attachments'})
    expect(explicitFallback).toHaveAttribute('aria-valuenow', '12')
    expect(explicitFallback).toHaveStyle({'--progress-width': '30%'})
  })

  it('keeps grouped values on individual segments rather than the generic root', () => {
    const {container} = render(
      <ProgressBar aria-label="Usage" aria-valuemin={0} aria-valuemax={100} aria-valuenow={20} aria-valuetext="Total">
        <ProgressBar.Item aria-label="Storage" progress={35} aria-valuetext="35% storage" />
      </ProgressBar>,
    )
    const root = container.querySelector('[data-component="ProgressBar"]')
    expect(root).not.toHaveAttribute('aria-valuemin')
    expect(root).not.toHaveAttribute('aria-valuemax')
    expect(root).not.toHaveAttribute('aria-valuenow')
    expect(root).not.toHaveAttribute('aria-valuetext')
    expect(screen.getByRole('progressbar', {name: 'Storage'})).toHaveAttribute('aria-valuenow', '35')
    expect(screen.getByRole('progressbar', {name: 'Storage'})).toHaveAttribute('aria-valuetext', '35% storage')
  })
})
