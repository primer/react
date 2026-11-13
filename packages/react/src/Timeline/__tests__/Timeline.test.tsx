import {render} from '@testing-library/react'
import {createRef} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {page} from 'vitest/browser'
import Timeline from '..'
import {implementsClassName} from '../../utils/testing'
import classes from '../Timeline.module.css'

describe('Timeline', () => {
  implementsClassName(Timeline, classes.Timeline)

  it('renders an ordered list with event items and a decorative break without a provider', async () => {
    render(
      <Timeline aria-label="Activity" start={3}>
        <Timeline.Item value={3}>First event</Timeline.Item>
        <Timeline.Break data-testid="break" />
        <Timeline.Item>Second event</Timeline.Item>
      </Timeline>,
    )

    const list = page.getByRole('list', {name: 'Activity'})
    await expect.element(list).toHaveAttribute('role', 'list')
    expect(list.element().tagName).toBe('OL')
    expect(list.element()).toHaveAttribute('start', '3')
    expect(Array.from(list.element().children, child => child.tagName)).toEqual(['LI', 'LI', 'LI'])
    expect(page.getByRole('listitem').elements()).toHaveLength(2)
    expect(page.getByText('First event').element()).toHaveAttribute('value', '3')
    await expect.element(page.getByTestId('break')).toHaveAttribute('role', 'presentation')
  })

  it('forwards object refs to the list and list items', () => {
    const listRef = createRef<HTMLOListElement>()
    const itemRef = createRef<HTMLLIElement>()
    const breakRef = createRef<HTMLLIElement>()
    const {unmount} = render(
      <Timeline ref={listRef}>
        <Timeline.Item ref={itemRef}>Event</Timeline.Item>
        <Timeline.Break ref={breakRef} data-testid="break" />
      </Timeline>,
    )

    expect(listRef.current).toBe(page.getByRole('list').element())
    expect(itemRef.current).toBe(page.getByRole('listitem').element())
    expect(breakRef.current).toBe(page.getByTestId('break').element())
    expect(listRef.current).toBeInstanceOf(HTMLOListElement)
    expect(itemRef.current).toBeInstanceOf(HTMLLIElement)
    expect(breakRef.current).toBeInstanceOf(HTMLLIElement)

    unmount()
    expect(listRef.current).toBeNull()
    expect(itemRef.current).toBeNull()
    expect(breakRef.current).toBeNull()
  })

  it('forwards callback refs to the list and list items', () => {
    const listRef = vi.fn<(node: HTMLOListElement | null) => void>()
    const itemRef = vi.fn<(node: HTMLLIElement | null) => void>()
    const breakRef = vi.fn<(node: HTMLLIElement | null) => void>()
    const {unmount} = render(
      <Timeline ref={listRef}>
        <Timeline.Item ref={itemRef}>Event</Timeline.Item>
        <Timeline.Break ref={breakRef} data-testid="break" />
      </Timeline>,
    )

    expect(listRef).toHaveBeenLastCalledWith(page.getByRole('list').element())
    expect(itemRef).toHaveBeenLastCalledWith(page.getByRole('listitem').element())
    expect(breakRef).toHaveBeenLastCalledWith(page.getByTestId('break').element())

    unmount()
    // React 19's development ref cleanup passes additional internal arguments.
    expect(listRef.mock.lastCall?.[0]).toBeNull()
    expect(itemRef.mock.lastCall?.[0]).toBeNull()
    expect(breakRef.mock.lastCall?.[0]).toBeNull()
  })

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

  it('renders with variant prop', () => {
    const {container} = render(<Timeline.Badge variant="done" />)
    expect(container.querySelector(`.${classes.TimelineBadge}`)).toHaveAttribute('data-variant', 'done')
  })

  it('does not render data-variant when variant is omitted', () => {
    const {container} = render(<Timeline.Badge />)
    expect(container.querySelector(`.${classes.TimelineBadge}`)).not.toHaveAttribute('data-variant')
  })
})

describe('Timeline.Body', () => {
  implementsClassName(Timeline.Body, classes.TimelineBody)
})

describe('Timeline.Break', () => {
  implementsClassName(Timeline.Break, classes.TimelineBreak)
})

describe('Timeline.Actions', () => {
  implementsClassName(Timeline.Actions, classes.TimelineItemActions)

  it('renders children', () => {
    const {getByTestId} = render(
      <Timeline.Actions>
        <button type="button" data-testid="actions-child">
          Revert
        </button>
      </Timeline.Actions>,
    )
    expect(getByTestId('actions-child')).toBeInTheDocument()
  })

  it('forwards additional props to the underlying element', () => {
    const {container} = render(<Timeline.Actions data-foo="bar" />)
    expect(container.firstChild).toHaveAttribute('data-foo', 'bar')
  })
})

describe('Timeline.Avatar', () => {
  implementsClassName(Timeline.Avatar, classes.TimelineItemAvatar)

  it('renders children', () => {
    const {getByTestId} = render(
      <Timeline.Avatar>
        <span data-testid="avatar-child">avatar</span>
      </Timeline.Avatar>,
    )
    expect(getByTestId('avatar-child')).toBeInTheDocument()
  })

  it('forwards additional props to the underlying element', () => {
    const {container} = render(<Timeline.Avatar data-foo="bar" />)
    expect(container.firstChild).toHaveAttribute('data-foo', 'bar')
  })
})
