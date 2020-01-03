import React from 'react'
import {X} from '@primer/octicons-react'
import StyledOcticon from '../StyledOcticon'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from "@testing-library/react";
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('StyledOcticon', () => {
  it('implements system props', () => {
    expect(StyledOcticon).toImplementSystemProps(COMMON)
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<StyledOcticon icon={X} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('matches the snapshot', () => {
    expect(render(<StyledOcticon icon={X} />)).toMatchSnapshot()
  })

  it.skip('has default theme', () => {
    expect(StyledOcticon).toSetDefaultTheme()
  })
})
