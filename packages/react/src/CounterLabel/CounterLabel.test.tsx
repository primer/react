import React from 'react'
import {CounterLabel} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('CounterLabel', () => {
  behavesAsComponent({Component: CounterLabel, options: {skipAs: true, skipSx: true}})

  checkExports('CounterLabel', {
    default: CounterLabel,
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

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<CounterLabel />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the primary "scheme" prop', () => {
    const {container} = HTMLRender(<CounterLabel scheme="primary">1234</CounterLabel>)
    expect(container).toMatchSnapshot()
  })

  it('renders with secondary scheme when no "scheme" prop is provided', () => {
    const {container} = HTMLRender(<CounterLabel>1234</CounterLabel>)
    expect(container).toMatchSnapshot()
  })

  it('should render visually hidden span correctly for screen readers', () => {
    const {container} = HTMLRender(<CounterLabel>1234</CounterLabel>)
    // Second span renders as visually hidden for screen readers and the content is &nbsp;(counter).
    // Non-breaking space is used because browsers tend to strip a standard space.
    expect(container.children[1].textContent).toEqual('\u00a0(1234)')
  })
})
