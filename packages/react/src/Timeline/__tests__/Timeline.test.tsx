import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Timeline from '..'
import {implementsClassName} from '../../utils/testing'
import classes from '../Timeline.module.css'

describe('Timeline', () => {
  implementsClassName(Timeline, classes.Timeline)

  it('renders with clipSidebar prop (boolean)', () => {
    const {container} = render(<Timeline clipSidebar />)
    expect(container.firstChild).toHaveAttribute('data-clip-sidebar', 'both')
  })

  it('renders with clipSidebar="both"', () => {
    const {container} = render(<Timeline clipSidebar="both" />)
    expect(container.firstChild).toHaveAttribute('data-clip-sidebar', 'both')
  })

  it('renders with clipSidebar="start"', () => {
    const {container} = render(<Timeline clipSidebar="start" />)
    expect(container.firstChild).toHaveAttribute('data-clip-sidebar', 'start')
  })

  it('renders with clipSidebar="end"', () => {
    const {container} = render(<Timeline clipSidebar="end" />)
    expect(container.firstChild).toHaveAttribute('data-clip-sidebar', 'end')
  })

  it('does not render data-clip-sidebar when clipSidebar is false', () => {
    const {container} = render(<Timeline clipSidebar={false} />)
    expect(container.firstChild).not.toHaveAttribute('data-clip-sidebar')
  })

  it('does not render data-clip-sidebar when clipSidebar is not provided', () => {
    const {container} = render(<Timeline />)
    expect(container.firstChild).not.toHaveAttribute('data-clip-sidebar')
  })
})

describe('Timeline.Item', () => {
  implementsClassName(Timeline.Item, classes.TimelineItem)
  it('renders with condensed prop', () => {
    const {container} = render(<Timeline.Item condensed />)
    expect(container).toMatchSnapshot()
  })

  it('adds the Timeline-Item class', () => {
    const {container} = render(<Timeline.Item />)
    expect(container.firstChild).toHaveClass('Timeline-Item')
  })
})

describe('Timeline.Badge', () => {
  implementsClassName(Timeline.Badge, classes.TimelineBadge)
})

describe('Timeline.Body', () => {
  implementsClassName(Timeline.Body, classes.TimelineBody)
})

describe('Timeline.Break', () => {
  implementsClassName(Timeline.Break, classes.TimelineBreak)
})
