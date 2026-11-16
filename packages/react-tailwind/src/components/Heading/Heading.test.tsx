import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Heading} from './Heading'

describe('Heading', () => {
  it('preserves the selected native heading level', () => {
    const ref = React.createRef<HTMLHeadingElement>()
    render(
      <Heading as="h1" ref={ref} data-testid="heading">
        Title
      </Heading>,
    )
    expect(screen.getByRole('heading', {level: 1})).toBe(ref.current)
    expect(screen.getByRole('heading', {level: 1})).toHaveClass('primer:m-0')
  })
})
