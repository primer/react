import React from 'react'
import BranchName from '../BranchName'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('BranchName', () => {
  behavesAsComponent({Component: BranchName})

  checkExports('BranchName', {
    default: BranchName,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<BranchName />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders an <a> by default', () => {
    expect(render(<BranchName />).type).toEqual('a')
  })
})
