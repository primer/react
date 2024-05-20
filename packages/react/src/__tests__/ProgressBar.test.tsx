import React from 'react'
import {ProgressBar} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('ProgressBar', () => {
  behavesAsComponent({Component: ProgressBar})

  checkExports('ProgressBar', {
    default: undefined,
    ProgressBar,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<ProgressBar progress={80} barSize="small" aria-label="Upload test.png" />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the "barSize" prop', () => {
    expect(render(<ProgressBar progress={80} barSize="small" aria-label="Upload test.png" />)).toHaveStyleRule(
      'height',
      '5px',
    )
    expect(render(<ProgressBar progress={80} barSize="default" aria-label="Upload test.png" />)).toHaveStyleRule(
      'height',
      '8px',
    )
    expect(render(<ProgressBar progress={80} barSize="large" aria-label="Upload test.png" />)).toHaveStyleRule(
      'height',
      '10px',
    )
  })

  it('respects the "inline" prop', () => {
    expect(render(<ProgressBar progress={80} inline aria-label="Upload test.png" />)).toHaveStyleRule(
      'display',
      'inline-flex',
    )
  })

  it('respects the "width" prop', () => {
    expect(render(<ProgressBar progress={80} inline width="100px" aria-label="Upload test.png" />)).toHaveStyleRule(
      'width',
      '100px',
    )
  })

  it('respects the "progress" prop', () => {
    expect(render(<ProgressBar progress={80} aria-label="Upload test.png" />)).toMatchSnapshot()
  })
})
