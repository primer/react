import React from 'react'
import {X} from '@githubprimer/octicons-react'
import StyledOcticon from '../StyledOcticon'
import {render} from '../utils/testing'
import {COMMON} from '../constants'

describe('StyledOcticon', () => {
  it('implements system props', () => {
    expect(StyledOcticon).toImplementSystemProps(COMMON)
  })

  it('matches the snapshot', () => {
    expect(render(<StyledOcticon icon={X} />)).toMatchSnapshot()
  })

  xit('has default theme', () => {
    expect(StyledOcticon).toSetDefaultTheme()
  })
})
