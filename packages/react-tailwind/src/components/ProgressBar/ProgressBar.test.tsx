import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {ProgressBar} from './ProgressBar'

describe('ProgressBar', () => {
  it('exposes progressbar semantics and forwards container props', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<ProgressBar ref={ref} progress={42} aria-label="Upload" data-testid="progress" />)
    expect(screen.getByRole('progressbar', {name: 'Upload'})).toHaveAttribute('aria-valuenow', '42')
    expect(screen.getByTestId('progress')).toBe(ref.current)
  })
})
