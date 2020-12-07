import React from 'react'
import {ProgressBar} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('ProgressBar', () => {
  behavesAsComponent(ProgressBar, [COMMON])

  checkExports('ProgressBar', {
    default: ProgressBar,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<ProgressBar progress={80} barSize="small" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
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
