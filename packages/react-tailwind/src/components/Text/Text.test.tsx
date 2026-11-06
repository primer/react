import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Text} from './Text'

describe('Text', () => {
  it('supports semantic composition and root props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Text as="p" ref={ref} data-testid="text">
        Copy
      </Text>,
    )
    expect(screen.getByTestId('text').tagName).toBe('P')
    expect(screen.getByTestId('text')).toBe(ref.current)
  })

  it('inherits typography when variants are omitted', () => {
    const {getByTestId} = render(<Text data-testid="inherited-text">Copy</Text>)

    expect(getByTestId('inherited-text')).not.toHaveClass('text-sm', 'font-normal', 'whitespace-normal')
  })

  it('supports Primer whitespace values', () => {
    const {getByTestId} = render(
      <Text data-testid="whitespace-text" whiteSpace="pre-wrap">
        Copy
      </Text>,
    )

    expect(getByTestId('whitespace-text')).toHaveClass('whitespace-pre-wrap')
  })
})
