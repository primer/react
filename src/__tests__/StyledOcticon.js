import React from 'react'
import {X} from '@githubprimer/octicons-react'
import StyledOcticon from '../StyledOcticon'
import {render} from '../utils/testing'
import {COMMON} from '../system-props'

describe('StyledOcticon', () => {
  it('is a system component', () => {
    expect(StyledOcticon.systemComponent).toEqual(true)
  })

  it('implements layout system props', () => {
    expect(StyledOcticon).toImplementSystemProps(COMMON)
  })

  it('matches the snapshot', () => {
    expect(() => render(<StyledOcticon icon={X} />)).toMatchSnapshot()
  })
})
