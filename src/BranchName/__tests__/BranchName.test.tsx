import {render as HTMLRender} from '@testing-library/react'
import {axe} from 'jest-axe'
import React from 'react'
import {behavesAsComponent, checkExports, render} from '../../utils/testing'
import BranchName from '../BranchName'

describe('BranchName', () => {
  behavesAsComponent({Component: BranchName})

  checkExports('BranchName', {
    default: BranchName,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<BranchName />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders an <a> by default', () => {
    expect(render(<BranchName />).type).toEqual('a')
  })
})
