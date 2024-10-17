import React from 'react'
import Breadcrumbs, {Breadcrumb} from '..'
import {render, behavesAsComponent, checkExports, expectRendersWithClassname} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('Breadcrumbs', () => {
  behavesAsComponent({Component: Breadcrumbs, options: {skipAs: true}})

  checkExports('Breadcrumbs', {
    default: Breadcrumbs,
    Breadcrumb,
  })

  it('should support `className` on the outermost element', () => {
    const element = <Breadcrumbs className={'test-class-name'} />
    expectRendersWithClassname(element, 'test-class-name')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Breadcrumbs />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <nav>', () => {
    expect(render(<Breadcrumbs />).type).toEqual('nav')
  })
})
