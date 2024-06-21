import React from 'react'
import {SubNav} from '..'
import {render, rendersClass, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('SubNav', () => {
  behavesAsComponent({Component: SubNav})

  checkExports('SubNav', {
    default: SubNav,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SubNav />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <nav>', () => {
    expect(render(<SubNav />).type).toEqual('nav')
  })

  it('adds the SubNav class', () => {
    expect(rendersClass(<SubNav />, 'SubNav')).toEqual(true)
  })

  it('sets aria-label to the "label" prop', () => {
    expect(render(<SubNav label="foo" />).props['aria-label']).toEqual('foo')
  })

  it('wraps its children in an "SubNav-body" div', () => {
    const {getByTestId} = HTMLRender(
      <SubNav>
        <b data-testid="children">test</b>
      </SubNav>,
    )

    const parent = getByTestId('children').parentElement
    expect(parent?.tagName).toBe('DIV')
    expect(parent).toHaveClass('SubNav-body')
  })

  it('respects the "actions" prop', () => {
    const {getByTestId} = HTMLRender(<SubNav actions={<span data-testid="action">action</span>} />)
    expect(getByTestId('action')).toBeInTheDocument()
    expect(getByTestId('action').parentElement).toHaveClass('SubNav-actions')
  })
})
