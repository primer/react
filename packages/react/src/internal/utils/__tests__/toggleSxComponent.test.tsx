import React from 'react'
import {render} from '@testing-library/react'
import {toggleSxComponent} from '../toggleSxComponent'

const customSx = {color: 'red', p: 2}

describe('toggleSxComponent', () => {
  test('renders the plain component when no sx', () => {
    const TestComponent = toggleSxComponent('span')
    const {container} = render(<TestComponent />)
    expect(container.firstChild).toBeInstanceOf(HTMLSpanElement)
  })

  test('renders Box with `as` if `sx` is provided', () => {
    const TestComponent = toggleSxComponent('div')
    const {container} = render(<TestComponent as="button" sx={customSx} />)

    expect(container.firstChild).toBeInstanceOf(HTMLButtonElement)
    expect(container.firstChild).toHaveStyle('color: red')
  })

  test('swaps out component if `sx` is not the default', () => {
    const Label = toggleSxComponent('label') as React.ComponentType<{htmlFor: string}>
    const {container} = render(<Label htmlFor="bloop" />)

    expect(container.firstChild).toBeInstanceOf(HTMLLabelElement)
    expect(container.firstChild).toHaveAttribute('for', 'bloop')
  })

  test('passes down other props', () => {
    const TestComponent = toggleSxComponent('div')
    const {container} = render(<TestComponent as="button" sx={customSx} data-foo="bar" />)

    expect(container.firstChild).toBeInstanceOf(HTMLButtonElement)
    expect(container.firstChild).toHaveStyle('color: red')
    expect(container.firstChild).toHaveAttribute('data-foo', 'bar')
  })
})
