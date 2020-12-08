import React from 'react'
import {BranchName} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('BranchName', () => {
  behavesAsComponent(BranchName, [COMMON])

  checkExports('BranchName', {
    default: BranchName,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<BranchName />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders an <a> by default', () => {
    expect(render(<BranchName />).type).toEqual('a')
  })
})
