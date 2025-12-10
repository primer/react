import {describe, expect, it} from 'vitest'
import {SubNav} from '..'
import {render as HTMLRender} from '@testing-library/react'
import {implementsClassName} from '../utils/testing'
import classes from './SubNav.module.css'

describe('SubNav', () => {
  implementsClassName(SubNav, classes.SubNav)
  implementsClassName(SubNav.Link, classes.Link)
  implementsClassName(SubNav.Links, classes.Links)

  it('renders a <nav>', () => {
    const {container} = HTMLRender(<SubNav />)
    expect(container.firstChild?.nodeName).toEqual('NAV')
  })

  it('adds the SubNav class', () => {
    const {container} = HTMLRender(<SubNav />)
    expect(container.firstChild).toHaveClass('SubNav')
  })

  it('sets aria-label to the "label" prop', () => {
    const {container} = HTMLRender(<SubNav label="foo" />)
    expect(container.firstChild).toHaveAttribute('aria-label', 'foo')
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

  it('sets aria-current on the selected child', () => {
    const {getByTestId} = HTMLRender(
      <SubNav>
        <SubNav.Link to="/foo" data-testid="foo" selected>
          Foo
        </SubNav.Link>
        <SubNav.Link to="/bar" data-testid="bar">
          Bar
        </SubNav.Link>
      </SubNav>,
    )

    expect(getByTestId('foo')).toHaveAttribute('aria-current', 'true')
    expect(getByTestId('bar')).not.toHaveAttribute('aria-current')
  })
})
