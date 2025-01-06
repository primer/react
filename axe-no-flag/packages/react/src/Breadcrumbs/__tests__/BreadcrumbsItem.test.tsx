import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import React from 'react'
import Breadcrumbs from '..'
import {behavesAsComponent, render} from '../../utils/testing'

describe('Breadcrumbs.Item', () => {
  behavesAsComponent({Component: Breadcrumbs.Item})

  it('renders an <a> by default', () => {
    expect(render(<Breadcrumbs.Item />).type).toEqual('a')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Breadcrumbs.Item />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the "selected" prop', () => {
    expect(render(<Breadcrumbs.Item selected />)).toMatchSnapshot()
  })
})
