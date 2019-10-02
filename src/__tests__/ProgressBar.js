import React from 'react'
import ProgressBar from '../ProgressBar'
import {render, mount} from '../utils/testing'
import {COMMON} from '../constants'

describe('ProgressBar', () => {
  it('implements system props', () => {
    expect(ProgressBar).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(ProgressBar).toSetDefaultTheme()
  })

  it('respects the "as" prop', () => {
    expect(render(<ProgressBar as="span" />).type).toEqual('span')
  })

  it('respects the "large" prop', () => {
    expect(render(<ProgressBar progress={80} large />)).toHaveStyleRule('height', '10px')
  })

  it('respects the "progress" prop', () => {
    expect(render(<ProgressBar progress={80} large />)).toMatchSnapshot()
  })
})
