import React from 'react'
import {XIcon} from '@primer/octicons-react'
import {StyledOcticon} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('StyledOcticon', () => {
  behavesAsComponent(StyledOcticon, [COMMON], () => <StyledOcticon icon={XIcon} />)

  checkExports('StyledOcticon', {
    default: StyledOcticon
  })

  it('implements system props', () => {
    expect(StyledOcticon).toImplementSystemProps(COMMON)
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<StyledOcticon icon={XIcon} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
