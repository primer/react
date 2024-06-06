import React from 'react'
import {SubNav} from '..'
import {render, behavesAsComponent} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('SubNav.Link', () => {
  behavesAsComponent({Component: SubNav.Link})

  it('renders an <a> by default', () => {
    expect(render(<SubNav.Link />).type).toEqual('a')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SubNav.Link />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the "selected" prop', () => {
    expect(render(<SubNav.Link selected />)).toMatchSnapshot()
  })
})
