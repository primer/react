import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {page} from 'vitest/browser'
import BaseStyles from '../BaseStyles'
import classes from '../BaseStyles.module.css'
import {implementsClassName} from '../utils/testing'

describe('BaseStyles', () => {
  implementsClassName(BaseStyles, classes.BaseStyles)

  it('renders BaseStyles with data-component attribute', async () => {
    render(<BaseStyles>Hello</BaseStyles>)
    await expect.element(page.getByText('Hello', {exact: true})).toHaveAttribute('data-component', 'BaseStyles')
  })

  it('has default styles', () => {
    const {container} = render(<BaseStyles>Hello</BaseStyles>)
    expect(container).toMatchSnapshot()
  })

  it.todo('respects styling props', async () => {
    const styles = {
      color: '#f00',
      fontFamily: 'Arial',
      lineHeight: '3.5',
    }

    render(<BaseStyles {...styles}>Hello</BaseStyles>)
    await expect.element(page.getByText('Hello', {exact: true})).toHaveStyle({
      color: '#f00',
      'font-family': 'Arial',
      'line-height': '3.5',
    } as Partial<CSSStyleDeclaration>)
  })

  it('accepts className and style props', async () => {
    const styles = {
      style: {margin: '10px'},
      className: 'test-classname',
      sx: {},
    }

    render(<BaseStyles {...styles}>Hello</BaseStyles>)
    const baseStyles = page.getByText('Hello', {exact: true})
    await expect.element(baseStyles).toHaveClass('test-classname')
    await expect.element(baseStyles).toHaveStyle({margin: '10px'})
  })
})
