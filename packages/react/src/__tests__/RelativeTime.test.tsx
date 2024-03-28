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

  it('renders a date inside', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    expect(render(<RelativeTime date={date} />).children).toEqual(['Mar 7, 2024'])
  })

  it('renders a datetime inside', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    expect(render(<RelativeTime datetime={date.toJSON()} />).children).toEqual(['Mar 7, 2024'])
  })
})
