import {render} from '@testing-library/react'
import MatchMediaMock from 'jest-matchmedia-mock'
import 'jest-styled-components'
import React from 'react'
import {BaseStyles} from '..'

let matchMedia: MatchMediaMock

describe('BaseStyles', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock()
  })

  afterEach(() => {
    matchMedia.clear()
  })

  it('has default styles', () => {
    const {container} = render(<BaseStyles></BaseStyles>)
    expect(container).toMatchSnapshot()
  })

  it('respects styling props', () => {
    const styles = {
      color: '#f00',
      fontFamily: 'Arial',
      lineHeight: '3.5',
    }

    const {container} = render(<BaseStyles {...styles}></BaseStyles>)
    expect(container.children[0]).toHaveStyle({color: '#f00', 'font-family': 'Arial', 'line-height': '3.5'})
  })

  it('accepts className and style props', () => {
    const styles = {
      style: {margin: '10px'},
      className: 'test-classname',
      sx: {},
    }

    const {container} = render(<BaseStyles {...styles}></BaseStyles>)
    expect(container.children[0]).toHaveClass('test-classname')
    expect(container.children[0]).toHaveStyle({margin: '10px'})
  })
})
