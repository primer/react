import React from 'react'
import type {CaretProps} from '../Caret'
import Caret from '../Caret'
import {render, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('Caret', () => {
  it('renders <svg>', () => {
    expect(render(<Caret />).type).toEqual('svg')
  })

  checkExports('Caret', {
    default: Caret,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Caret />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders cardinal directions', () => {
    for (const location of ['top', 'right', 'bottom', 'left']) {
      expect(render(<Caret location={location as CaretProps['location']} />)).toMatchSnapshot()
    }
    for (const location of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
      expect(render(<Caret location={location as CaretProps['location']} />)).toMatchSnapshot()
    }
    for (const location of ['left-top', 'left-bottom', 'right-top', 'right-bottom']) {
      expect(render(<Caret location={location as CaretProps['location']} />)).toMatchSnapshot()
    }
  })
})
