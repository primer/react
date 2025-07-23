import {Text} from '..'
import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'

describe('Text', () => {
  it('renders a <span> by default', () => {
    const {container} = render(<Text />)
    expect(container.firstChild?.nodeName).toEqual('SPAN')
  })

  it('renders children', () => {
    const {getByText} = render(<Text>Hello World</Text>)
    expect(getByText('Hello World')).toBeInTheDocument()
  })

  it('accepts className', () => {
    const {container} = render(<Text className="test-class">Hello</Text>)
    expect(container.firstChild).toHaveClass('test-class')
  })

  it('renders as different element when as prop is provided', () => {
    const {container} = render(<Text as="p">Hello</Text>)
    expect(container.firstChild?.nodeName).toEqual('P')
  })

  it('passes through other props', () => {
    const {container} = render(<Text data-testid="text-element">Hello</Text>)
    expect(container.firstChild).toHaveAttribute('data-testid', 'text-element')
  })
})
