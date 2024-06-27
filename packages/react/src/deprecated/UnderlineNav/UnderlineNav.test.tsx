import React from 'react'
import {UnderlineNav} from '../../deprecated'
import {render, rendersClass, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('UnderlineNav', () => {
  checkExports('deprecated/UnderlineNav', {
    default: UnderlineNav,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<UnderlineNav />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <nav>', () => {
    expect(render(<UnderlineNav />).type).toEqual('nav')
  })

  it('adds the UnderlineNav class', () => {
    expect(rendersClass(<UnderlineNav />, 'PRC-UnderlineNav')).toEqual(true)
  })

  it('respects the "align" prop', () => {
    expect(rendersClass(<UnderlineNav align="right" />, 'PRC-UnderlineNav--right')).toEqual(true)
  })

  it('respects the "full" prop', () => {
    expect(rendersClass(<UnderlineNav full />, 'PRC-UnderlineNav--full')).toEqual(true)
  })

  it('sets aria-label to the "label" prop', () => {
    expect(render(<UnderlineNav label="foo" />).props['aria-label']).toEqual('foo')
  })

  it('wraps its children in an "PRC-UnderlineNav-body" div', () => {
    const {getByTestId} = HTMLRender(
      <UnderlineNav>
        <b data-testid="content">test</b>
      </UnderlineNav>,
    )

    expect(getByTestId('content')).toBeInTheDocument()
    expect(getByTestId('content').parentElement).toHaveClass('PRC-UnderlineNav-body')
  })

  it('respects the "actions" prop', () => {
    const {getByTestId} = HTMLRender(<UnderlineNav actions={<span data-testid="action">test</span>} />)

    expect(getByTestId('action')).toBeInTheDocument()
    expect(getByTestId('action').parentElement).toHaveClass('PRC-UnderlineNav-actions')
  })
})
