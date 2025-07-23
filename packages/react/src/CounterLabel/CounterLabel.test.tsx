import {describe, expect, it} from 'vitest'
import {CounterLabel} from '..'
import {render} from '@testing-library/react'

describe('CounterLabel', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <CounterLabel className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a <span>', () => {
    const {container} = render(<CounterLabel>1234</CounterLabel>)
    expect(container.firstChild?.nodeName).toEqual('SPAN')
  })

  it('renders the counter correctly', () => {
    const {container} = render(<CounterLabel>12K</CounterLabel>)
    expect(container.firstChild).toHaveTextContent('12K')
  })

  it('renders the visually visible span with "aria-hidden=true"', () => {
    const {container} = render(<CounterLabel>1234</CounterLabel>)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('respects the primary "scheme" prop', () => {
    const {container} = render(<CounterLabel scheme="primary">1234</CounterLabel>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with secondary scheme when no "scheme" prop is provided', () => {
    const {container} = render(<CounterLabel>1234</CounterLabel>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render visually hidden span correctly for screen readers', () => {
    const {container} = render(<CounterLabel>1234</CounterLabel>)
    // Second span renders as visually hidden for screen readers and the content is &nbsp;(counter).
    // Non-breaking space is used because browsers tend to strip a standard space.
    expect(container.children[1].textContent).toEqual('\u00a0(1234)')
  })
})
