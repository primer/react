import {describe, expect, it} from 'vitest'
import SubNav from '.'
import {render as HTMLRender} from '@testing-library/react'
import {page} from 'vitest/browser'
import {implementsClassName} from '../utils/testing'
import classes from './SubNav.module.css'

describe('SubNav', () => {
  implementsClassName(SubNav, classes.SubNav)
  implementsClassName(SubNav.Links, classes.Links)

  it('renders data-component attributes', async () => {
    HTMLRender(
      <SubNav>
        <SubNav.Links>
          <SubNav.Link data-testid="link">Link</SubNav.Link>
        </SubNav.Links>
      </SubNav>,
    )

    await expect.element(page.getByRole('navigation')).toHaveAttribute('data-component', 'SubNav')
    await expect
      .element(page.getByTestId('link').element().parentElement)
      .toHaveAttribute('data-component', 'SubNav.Links')
    await expect.element(page.getByTestId('link')).toHaveAttribute('data-component', 'SubNav.Link')
  })

  it('renders a <nav>', () => {
    HTMLRender(<SubNav />)
    expect(page.getByRole('navigation').element().nodeName).toEqual('NAV')
  })

  it('adds the SubNav class', async () => {
    HTMLRender(<SubNav />)
    await expect.element(page.getByRole('navigation')).toHaveClass('SubNav')
  })

  it('sets aria-label to the "label" prop', async () => {
    HTMLRender(<SubNav label="foo" />)
    await expect.element(page.getByRole('navigation')).toHaveAttribute('aria-label', 'foo')
  })

  it('wraps its children in an "SubNav-body" div', async () => {
    HTMLRender(
      <SubNav>
        <b data-testid="children">test</b>
      </SubNav>,
    )

    const parent = page.getByTestId('children').element().parentElement
    expect(parent?.tagName).toBe('DIV')
    await expect.element(parent).toHaveClass('SubNav-body')
  })

  it('respects the "actions" prop', async () => {
    HTMLRender(<SubNav actions={<span data-testid="action">action</span>} />)
    await expect.element(page.getByTestId('action')).toBeInTheDocument()
    await expect.element(page.getByTestId('action').element().parentElement).toHaveClass('SubNav-actions')
  })

  it('sets aria-current on the selected child', async () => {
    HTMLRender(
      <SubNav>
        <SubNav.Link to="/foo" data-testid="foo" selected>
          Foo
        </SubNav.Link>
        <SubNav.Link to="/bar" data-testid="bar">
          Bar
        </SubNav.Link>
      </SubNav>,
    )

    await expect.element(page.getByTestId('foo')).toHaveAttribute('aria-current', 'true')
    await expect.element(page.getByTestId('bar')).not.toHaveAttribute('aria-current')
  })
})
