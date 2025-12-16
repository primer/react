import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import BaseStyles from '../BaseStyles'

describe('BaseStyles', () => {
  it('has default styles', () => {
    const {container} = render(<BaseStyles>Hello</BaseStyles>)
    expect(container).toMatchSnapshot()
  })

  it.todo('respects styling props', () => {
    const styles = {
      color: '#f00',
      fontFamily: 'Arial',
      lineHeight: '3.5',
    }

    const {container} = render(<BaseStyles {...styles}>Hello</BaseStyles>)
    expect(container.children[0]).toHaveStyle({
      color: '#f00',
      'font-family': 'Arial',
      'line-height': '3.5',
    } as Partial<CSSStyleDeclaration>)
  })

  it('accepts className and style props', () => {
    const styles = {
      style: {margin: '10px'},
      className: 'test-classname',
      sx: {},
    }

    const {container} = render(<BaseStyles {...styles}>Hello</BaseStyles>)
    expect(container.children[0]).toHaveClass('test-classname')
    expect(container.children[0]).toHaveStyle({margin: '10px'})
  })
})
