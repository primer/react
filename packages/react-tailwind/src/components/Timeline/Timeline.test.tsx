import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Timeline} from './Timeline'

describe('Timeline', () => {
  it('uses list semantics and composes timeline parts', () => {
    render(
      <Timeline aria-label="Activity">
        <Timeline.Item>
          <Timeline.Badge variant="success">✓</Timeline.Badge>
          <Timeline.Body>Opened issue</Timeline.Body>
        </Timeline.Item>
      </Timeline>,
    )
    expect(screen.getByRole('list', {name: 'Activity'})).toHaveAttribute('data-component', 'Timeline')
    expect(screen.getByRole('listitem')).toHaveTextContent('Opened issue')
  })

  it('applies clipSidebar utilities for first and last timeline items', () => {
    render(
      <Timeline clipSidebar="both" data-testid="timeline">
        <Timeline.Item condensed>
          <Timeline.Avatar>Avatar</Timeline.Avatar>
        </Timeline.Item>
      </Timeline>,
    )
    expect(screen.getByTestId('timeline')).toHaveClass(
      'primer:[&[data-clip-sidebar=both]>li:first-child]:pt-0',
      'primer:[&[data-clip-sidebar=both]>li:last-child]:pb-0',
    )
  })

  it('forwards refs and DOM props to the semantic roots', () => {
    const timelineRef = React.createRef<HTMLOListElement>()
    const itemRef = React.createRef<HTMLLIElement>()
    const avatarRef = React.createRef<HTMLDivElement>()
    const badgeRef = React.createRef<HTMLDivElement>()
    const bodyRef = React.createRef<HTMLDivElement>()
    const breakRef = React.createRef<HTMLLIElement>()
    const actionsRef = React.createRef<HTMLDivElement>()

    render(
      <Timeline aria-label="Activity" data-testid="timeline" ref={timelineRef}>
        <Timeline.Item data-testid="item" ref={itemRef}>
          <Timeline.Avatar data-testid="avatar" ref={avatarRef}>
            Avatar
          </Timeline.Avatar>
          <Timeline.Badge data-testid="badge" ref={badgeRef}>
            Event
          </Timeline.Badge>
          <Timeline.Body data-testid="body" ref={bodyRef}>
            Event body
          </Timeline.Body>
          <Timeline.Actions data-testid="actions" ref={actionsRef}>
            Actions
          </Timeline.Actions>
        </Timeline.Item>
        <Timeline.Break data-testid="break" ref={breakRef} />
      </Timeline>,
    )

    expect(timelineRef.current).toHaveAttribute('data-testid', 'timeline')
    expect(itemRef.current).toHaveAttribute('data-testid', 'item')
    expect(avatarRef.current).toHaveAttribute('data-testid', 'avatar')
    expect(badgeRef.current).toHaveAttribute('data-testid', 'badge')
    expect(bodyRef.current).toHaveAttribute('data-testid', 'body')
    expect(actionsRef.current).toHaveAttribute('data-testid', 'actions')
    expect(breakRef.current).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses compact badge geometry for condensed events and keeps breaks presentational', () => {
    render(
      <Timeline aria-label="Activity">
        <Timeline.Item condensed>
          <Timeline.Badge>Event</Timeline.Badge>
        </Timeline.Item>
        <Timeline.Break data-testid="break" />
      </Timeline>,
    )

    expect(screen.getAllByRole('listitem').at(-1)).toHaveClass(
      'primer:pt-1',
      'primer:pb-0',
      'primer:[&_[data-timeline-badge]]:h-4',
    )
    expect(screen.getAllByTestId('break').at(-1)).toHaveAttribute('aria-hidden', 'true')
  })
})
