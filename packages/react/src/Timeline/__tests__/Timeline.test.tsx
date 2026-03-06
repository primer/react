import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import Timeline from '..'
import {implementsClassName} from '../../utils/testing'
import classes from '../Timeline.module.css'

describe('Timeline', () => {
  implementsClassName(Timeline, classes.Timeline)

  it('renders with clipSidebar prop', () => {
    const {container} = render(<Timeline clipSidebar />)
    expect(container).toMatchSnapshot()
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
