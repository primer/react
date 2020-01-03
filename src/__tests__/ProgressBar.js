import React from 'react'
import ProgressBar from '../ProgressBar'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from "@testing-library/react";
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('ProgressBar', () => {
  it('implements system props', () => {
    expect(ProgressBar).toImplementSystemProps(COMMON)
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<ProgressBar progress={80} barSize="small" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('has default theme', () => {
    expect(ProgressBar).toSetDefaultTheme()
  })

  it('respects the "as" prop', () => {
    expect(render(<ProgressBar as="span" />).type).toEqual('span')
  })

  it('respects the "barSize" prop', () => {
    expect(render(<ProgressBar progress={80} barSize="small" />)).toHaveStyleRule('height', '5px')
    expect(render(<ProgressBar progress={80} barSize="default" />)).toHaveStyleRule('height', '8px')
    expect(render(<ProgressBar progress={80} barSize="large" />)).toHaveStyleRule('height', '10px')
  })

  it('respects the "inline" prop', () => {
    expect(render(<ProgressBar progress={80} inline />)).toHaveStyleRule('display', 'inline-flex')
  })

  it('respects the "width" prop', () => {
    expect(render(<ProgressBar progress={80} inline width="100px" />)).toHaveStyleRule('width', '100px')
  })

  it('respects the "progress" prop', () => {
    expect(render(<ProgressBar progress={80} />)).toMatchSnapshot()
  })
})
