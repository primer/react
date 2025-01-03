import React from 'react'
import Pagehead from '../Pagehead'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('Pagehead', () => {
  behavesAsComponent({Component: Pagehead})

  checkExports('Pagehead', {
    default: Pagehead,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Pagehead>Pagehead</Pagehead>)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })
})
