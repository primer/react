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
      '[&[data-clip-sidebar=both]>li:first-child]:pt-0',
      '[&[data-clip-sidebar=both]>li:last-child]:pb-0',
    )
  })
})
