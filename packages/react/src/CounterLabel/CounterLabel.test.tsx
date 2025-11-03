import {describe, expect, it} from 'vitest'
import {CounterLabel} from '..'
import {render as HTMLRender} from '@testing-library/react'

describe('CounterLabel', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <CounterLabel className={'test-class-name'} />
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a <span>', () => {
    const {container} = HTMLRender(<CounterLabel>1234</CounterLabel>)
    expect(container.firstChild?.nodeName).toEqual('SPAN')
  })

  it('renders the counter correctly', () => {
    const {container} = HTMLRender(<CounterLabel>12K</CounterLabel>)
    expect(container.firstChild).toHaveTextContent('12K')
  })

  it('renders the visually visible span with "aria-hidden=true"', () => {
    const {container} = HTMLRender(<CounterLabel>1234</CounterLabel>)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('respects the primary "scheme" prop', () => {
    const {container} = HTMLRender(<CounterLabel scheme="primary">1234</CounterLabel>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveTextContent('1234')
  })

  it('renders with secondary scheme when no "scheme" prop is provided', () => {
    const {container} = HTMLRender(<CounterLabel>1234</CounterLabel>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveTextContent('1234')
  })

  it('should render visually hidden span correctly for screen readers', () => {
    const {container} = HTMLRender(<CounterLabel>1234</CounterLabel>)
    // Second span renders as visually hidden for screen readers and the content is &nbsp;(counter).
    // Non-breaking space is used because browsers tend to strip a standard space.
    expect(container.children[1].textContent).toEqual('\u00a0(1234)')
  })
})
