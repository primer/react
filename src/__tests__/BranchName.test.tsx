import React from 'react'
import {BranchName} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('BranchName', () => {
  behavesAsComponent({Component: BranchName})

  checkExports('BranchName', {
    default: BranchName
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
