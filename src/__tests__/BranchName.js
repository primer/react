import React from 'react'
import BranchName from '../BranchName'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from "@testing-library/react";
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('BranchName', () => {
  it("should have no axe violations", async () => {
    const {container} = HTMLRender(<BranchName/>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
  it('renders an <a> by default', () => {
    expect(render(<BranchName />).type).toEqual('a')
  })

  it('has default theme', () => {
    expect(BranchName).toSetDefaultTheme()
  })

  it('respects the "as" prop', () => {
    expect(render(<BranchName as="span" />).type).toEqual('span')
  })

  it('implements common system props', () => {
    expect(BranchName).toImplementSystemProps(COMMON)
  })
})
