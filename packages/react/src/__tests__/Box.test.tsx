import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import React from 'react'
import {Box} from '..'
import theme from '../theme'
import {behavesAsComponent, checkExports, render} from '../utils/testing'

describe('Box', () => {
  behavesAsComponent({Component: Box})

  checkExports('Box', {
    default: Box,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Box />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders margin', () => {
    expect(render(<Box m={1} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box m={[0, 1, 2, 3]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box m={[1, 1, 1, 3]} theme={theme} />)).toMatchSnapshot()
  })

  it('renders padding', () => {
    expect(render(<Box p={1} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box p={[0, 1, 2, 3]} theme={theme} />)).toMatchSnapshot()
    expect(render(<Box p={[1, 1, 1, 3]} theme={theme} />)).toMatchSnapshot()
  })

  it('respects display', () => {
    expect(render(<Box display="inline" />)).toMatchSnapshot()
    expect(render(<Box display="inline-block" />)).toMatchSnapshot()
    expect(render(<Box display="none" />)).toMatchSnapshot()
    expect(render(<Box display={['none', 'none', 'block']} theme={theme} />)).toMatchSnapshot()
  })
})
