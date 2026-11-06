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

    expect(item).toHaveClass('motion-safe:animate-[primer-skeleton-shimmer_var(--base-duration-1000)_infinite]')
    expect(item).not.toHaveClass('rounded-full')
    expect(item).not.toHaveClass('transition-[width]')
  })
})
