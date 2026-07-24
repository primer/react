import {cleanup, render, screen} from '@testing-library/react'
import {createRef} from 'react'
import {afterEach, describe, expect, it} from 'vitest'
import {Hidden} from './Hidden'

describe('Hidden', () => {
  afterEach(cleanup)

  it('uses static Tailwind responsive utilities for each requested viewport', () => {
    const ref = createRef<HTMLDivElement>()

    render(
      <Hidden className="custom-class" data-testid="hidden" ref={ref} when={['narrow', 'wide']}>
        Content
      </Hidden>,
    )

    expect(screen.getByTestId('hidden')).toHaveClass('max-md:hidden', 'lg:hidden', 'custom-class')
    expect(screen.getByTestId('hidden')).toHaveAttribute('data-component', 'Hidden')
    expect(ref.current).toBe(screen.getByTestId('hidden'))
  })

  it('hides only the regular viewport range when requested', () => {
    render(
      <Hidden data-testid="hidden" when="regular">
        Content
      </Hidden>,
    )

    expect(screen.getByTestId('hidden')).toHaveClass('md:max-lg:hidden')
  })
})
