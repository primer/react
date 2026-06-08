import {render} from '@testing-library/react'
import type {ReactElement} from 'react'
import {describe, expect, it} from 'vitest'
import Timeline from '..'
import {FeatureFlags} from '../../FeatureFlags'
import {implementsClassName} from '../../utils/testing'
import classes from '../Timeline.module.css'

function renderWithListSemantics(ui: ReactElement) {
  return render(<FeatureFlags flags={{primer_react_timeline_list_semantics: true}}>{ui}</FeatureFlags>)
}

describe('Timeline', () => {
  implementsClassName(Timeline, classes.Timeline)

  it('renders as a div by default (flag off)', () => {
    const {container} = render(<Timeline />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('does not set role="list" by default (flag off)', () => {
    const {container} = render(<Timeline />)
    expect(container.firstChild).not.toHaveAttribute('role')
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

describe('Timeline with primer_react_timeline_list_semantics flag', () => {
  it('renders as an ordered list', () => {
    const {container} = renderWithListSemantics(<Timeline />)
    expect(container.firstChild?.nodeName).toBe('OL')
  })

  it('has role="list" to restore semantics in Safari/VoiceOver', () => {
    const {container} = renderWithListSemantics(<Timeline />)
    expect(container.firstChild).toHaveAttribute('role', 'list')
  })

  it('renders items as list items', () => {
    const {container} = renderWithListSemantics(
      <Timeline>
        <Timeline.Item />
      </Timeline>,
    )
    expect(container.querySelector('ol > li')).not.toBeNull()
  })

  it('renders break as a presentational list item', () => {
    const {container} = renderWithListSemantics(<Timeline.Break />)
    expect(container.firstChild?.nodeName).toBe('LI')
    expect(container.firstChild).toHaveAttribute('role', 'presentation')
  })
})

describe('Timeline.Item', () => {
  implementsClassName(Timeline.Item, classes.TimelineItem)

  it('renders as a div by default (flag off)', () => {
    const {container} = render(<Timeline.Item />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

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

  it('renders as a div by default (flag off)', () => {
    const {container} = render(<Timeline.Break />)
    expect(container.firstChild?.nodeName).toBe('DIV')
    expect(container.firstChild).not.toHaveAttribute('role')
  })
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
