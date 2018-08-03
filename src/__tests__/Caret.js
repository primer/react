import React from 'react'
import Caret from '../Caret'
import {render} from '../utils/testing'
import theme from '../theme'

describe('Caret', () => {
  it('renders <svg>', () => {
    expect(render(<Caret />).type).toEqual('svg')
  })

  it('renders cardinal directions', () => {
    for (const location of ['top', 'right', 'bottom', 'left']) {
      expect(render(<Caret location={location} theme={theme} />)).toMatchSnapshot()
    }
    for (const location of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
      expect(render(<Caret location={location} theme={theme} />)).toMatchSnapshot()
    }
    for (const location of ['left-top', 'left-bottom', 'right-top', 'right-bottom']) {
      expect(render(<Caret location={location} theme={theme} />)).toMatchSnapshot()
    }
  })
})
