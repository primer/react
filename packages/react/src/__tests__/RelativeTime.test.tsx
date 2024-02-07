import React from 'react'
import {RelativeTime} from '..'
import {render as HTMLRender} from '@testing-library/react'
import {axe} from 'jest-axe'
import {render, behavesAsComponent, checkExports} from '../utils/testing'

describe('RelativeTime', () => {
  behavesAsComponent({Component: RelativeTime})

  checkExports('RelativeTime', {
    default: RelativeTime,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<RelativeTime />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders a <relative-time>', () => {
    expect(render(<RelativeTime />).type).toEqual('relative-time')
  })
})
