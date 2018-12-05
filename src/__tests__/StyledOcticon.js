import React from 'react'
import {X} from '@githubprimer/octicons-react'
import StyledOcticon from '../StyledOcticon'
import {render, mount} from '../utils/testing'
import {COMMON} from '../system-props'

describe('StyledOcticon', () => {
  it('implements layout system props', () => {
    expect(StyledOcticon).toImplementSystemProps(COMMON)
  })

  it('matches the snapshot', () => {
    expect(render(mount(<StyledOcticon icon={X} />))).toMatchSnapshot()
  })
})
