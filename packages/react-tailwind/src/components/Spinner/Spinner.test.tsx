import React from 'react'
import {act, cleanup, render, screen} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Spinner} from './Spinner'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Spinner', () => {
  it('announces its loading text and forwards root props and ref', () => {
    const ref = React.createRef<HTMLElement>()
    render(<Spinner ref={ref} data-testid="spinner" />)
    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(screen.getByTestId('spinner')).toBe(ref.current)
  })

  it('delays rendering by the configured duration', () => {
    vi.useFakeTimers()
    render(<Spinner data-testid="spinner" delay="short" />)

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(299))
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1))
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('synchronizes the animation phase when it becomes visible', () => {
    vi.spyOn(performance, 'now').mockReturnValue(250)
    render(<Spinner data-testid="spinner" />)

    expect(screen.getByTestId('spinner').querySelector('svg')).toHaveStyle({animationDelay: '-250ms'})
  })

  it('suppresses status semantics when screen-reader text is disabled', () => {
    render(<Spinner data-testid="spinner" srText={null} />)

    expect(screen.getByTestId('spinner')).not.toHaveAttribute('role')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
