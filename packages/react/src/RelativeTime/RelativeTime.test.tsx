import {describe, expect, it} from 'vitest'
import {RelativeTime} from '..'
import {render} from '@testing-library/react'
import {implementsClassName} from '../utils/testing'

describe('RelativeTime', () => {
  implementsClassName(RelativeTime)
  it('renders a <relative-time>', () => {
    const {container} = render(<RelativeTime />)
    expect(container.firstChild?.nodeName.toLowerCase()).toEqual('relative-time')
  })

  it('renders a date inside', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date} />)
    expect(container.textContent).toEqual('Mar 7, 2024')
  })

  it('renders a datetime inside', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime datetime={date.toJSON()} />)
    expect(container.textContent).toEqual('Mar 7, 2024')
  })

  it('renders children if passed', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date}>server rendered date</RelativeTime>)
    expect(container.textContent).toEqual('server rendered date')
  })

  it('does not render no-title attribute by default', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date} />)
    expect(container.firstChild).not.toHaveAttribute('no-title')
  })

  it('adds no-title attribute if noTitle={true}', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date} noTitle={true} />)
    expect(container.firstChild).toHaveAttribute('no-title')
  })
})
