import {cleanup, render, screen} from '@testing-library/react'
import {createRef} from 'react'
import {afterEach, describe, expect, it} from 'vitest'
import {Hidden} from './Hidden'

describe('Hidden', () => {
  afterEach(cleanup)

  it.each([
    ['narrow', ['primer:max-md:hidden']],
    ['regular', ['primer:md:max-2xl:hidden']],
    ['wide', ['primer:2xl:hidden']],
    [
      ['narrow', 'regular'],
      ['primer:max-md:hidden', 'primer:md:max-2xl:hidden'],
    ],
    [
      ['narrow', 'wide'],
      ['primer:max-md:hidden', 'primer:2xl:hidden'],
    ],
    [
      ['regular', 'wide'],
      ['primer:md:max-2xl:hidden', 'primer:2xl:hidden'],
    ],
    [
      ['narrow', 'regular', 'wide'],
      ['primer:max-md:hidden', 'primer:md:max-2xl:hidden', 'primer:2xl:hidden'],
    ],
  ] as const)('uses the static utilities for %o', (when, expectedClasses) => {
    render(
      <Hidden data-testid="hidden" when={when}>
        Content
      </Hidden>,
    )

    expect(screen.getByTestId('hidden')).toHaveClass(...expectedClasses)
  })

  it('maps named ranges to the 768px and 1400px boundaries', () => {
    render(
      <>
        <Hidden data-testid="narrow" when="narrow">
          Narrow
        </Hidden>
        <Hidden data-testid="regular" when="regular">
          Regular
        </Hidden>
        <Hidden data-testid="wide" when="wide">
          Wide
        </Hidden>
      </>,
    )

    // max-md is below 48rem; md:max-2xl is 48rem through below 87.5rem;
    // 2xl begins at 87.5rem. @primer/tailwind-config defines those values.
    expect(screen.getByTestId('narrow')).toHaveClass('primer:max-md:hidden')
    expect(screen.getByTestId('regular')).toHaveClass('primer:md:max-2xl:hidden')
    expect(screen.getByTestId('wide')).toHaveClass('primer:2xl:hidden')
  })

  it('preserves the div root, children, DOM props, ref, and component identifier', () => {
    const ref = createRef<HTMLDivElement>()

    render(
      <Hidden
        aria-label="Responsive content"
        className="custom-class"
        data-testid="hidden"
        id="responsive-content"
        ref={ref}
        when={['narrow', 'wide']}
      >
        Content
      </Hidden>,
    )

    const hidden = screen.getByTestId('hidden')
    expect(hidden.tagName).toBe('DIV')
    expect(hidden).toHaveTextContent('Content')
    expect(hidden).toHaveAttribute('aria-label', 'Responsive content')
    expect(hidden).toHaveAttribute('id', 'responsive-content')
    expect(hidden).toHaveAttribute('data-component', 'Hidden')
    expect(hidden).toHaveClass('primer:max-md:hidden', 'primer:2xl:hidden', 'custom-class')
    expect(ref.current).toBe(hidden)
  })

  it('allows className to replace a matching visibility utility', () => {
    render(
      <Hidden className="md:max-2xl:block" data-testid="hidden" when="regular">
        Content
      </Hidden>,
    )

    expect(screen.getByTestId('hidden')).toHaveClass('md:max-2xl:block')
    expect(screen.getByTestId('hidden')).not.toHaveClass('primer:md:max-2xl:hidden')
  })

  it('owns its data-component identifier', () => {
    render(
      <Hidden {...({'data-component': 'ConsumerHidden'} as object)} data-testid="hidden" when="narrow">
        Content
      </Hidden>,
    )

    expect(screen.getByTestId('hidden')).toHaveAttribute('data-component', 'Hidden')
  })
})
