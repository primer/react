import {render as HTMLRender} from '@testing-library/react'
import {axe} from 'jest-axe'
import React from 'react'
import Breadcrumbs, {Breadcrumb} from '..'
import {behavesAsComponent, checkExports, render} from '../../utils/testing'

describe('Breadcrumbs', () => {
  behavesAsComponent({Component: Breadcrumbs, options: {skipAs: true}})

  checkExports('Breadcrumbs', {
    default: Breadcrumbs,
    Breadcrumb,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Breadcrumbs />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <nav>', () => {
    expect(render(<Breadcrumbs />).type).toEqual('nav')
  })
})
