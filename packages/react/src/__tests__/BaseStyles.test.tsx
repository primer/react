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
})
