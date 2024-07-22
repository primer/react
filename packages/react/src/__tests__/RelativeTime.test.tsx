import React from 'react'
import {RelativeTime} from '..'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import {render, behavesAsComponent, checkExports} from '../utils/testing'

describe('RelativeTime', () => {
  behavesAsComponent({Component: RelativeTime})

  checkExports('RelativeTime', {
    default: RelativeTime,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<RelativeTime />)
    const results = await axe.run(container)
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

  it('renders children if passed', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    expect(render(<RelativeTime date={date}>server rendered date</RelativeTime>).children).toEqual([
      'server rendered date',
    ])
  })

  it('does not render no-title attribute by default', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = HTMLRender(<RelativeTime date={date} />)
    expect(container.firstChild).not.toHaveAttribute('no-title')
  })

  it('adds no-title attribute if noTitle={true}', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = HTMLRender(<RelativeTime date={date} noTitle={true} />)
    expect(container.firstChild).toHaveAttribute('no-title')
  })
})
