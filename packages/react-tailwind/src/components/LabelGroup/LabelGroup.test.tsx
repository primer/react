import {act, cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {Token} from '../Token'
import {LabelGroup} from './LabelGroup'

describe('LabelGroup', () => {
  const originalResizeObserver = window.ResizeObserver
  let notifyResize: (() => void) | undefined

  beforeEach(() => {
    window.ResizeObserver = class ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = () => callback([], this)
      }
      disconnect() {}
      observe() {}
      unobserve() {}
    }
  })

  afterEach(() => {
    cleanup()
    window.ResizeObserver = originalResizeObserver
    notifyResize = undefined
  })

  it('uses list semantics by default and forwards its ref and DOM props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <LabelGroup aria-label="Applied labels" data-testid="labels" ref={ref} title="Labels">
        <span>one</span>
        <span>two</span>
      </LabelGroup>,
    )

    const group = screen.getByRole('list', {name: 'Applied labels'})
    expect(group).toBe(ref.current)
    expect(group).toHaveAttribute('data-component', 'LabelGroup')
    expect(group).toHaveAttribute('title', 'Labels')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(group).toHaveTextContent('onetwo')
  })

  it('preserves consumer markup for an untruncated non-list root', () => {
    render(
      <LabelGroup as="div" data-testid="labels">
        <div data-testid="child">one</div>
      </LabelGroup>,
    )

    const group = screen.getByTestId('labels')
    expect(group).not.toHaveAttribute('data-list')
    expect(screen.getByTestId('child').parentElement).toBe(group)
  })

  it('hides children after a numeric visible child count', () => {
    render(
      <LabelGroup visibleChildCount={2}>
        <span>one</span>
        <span>two</span>
        <span>three</span>
        <span>four</span>
      </LabelGroup>,
    )

    expect(screen.getAllByText(/one|two|three|four/)).toHaveLength(4)
    expect(document.querySelectorAll('[data-hidden]')).toHaveLength(2)
    expect(screen.getByRole('button', {name: 'Show +2 more'})).toBeVisible()
  })

  it('measures auto truncation again when its container resizes', () => {
    render(
      <LabelGroup style={{paddingLeft: 0, paddingRight: 0}} visibleChildCount="auto">
        <span>one</span>
        <span>two</span>
        <span>three</span>
        <span>four</span>
      </LabelGroup>,
    )

    const group = screen.getByRole('list')
    Object.defineProperty(group, 'clientWidth', {configurable: true, value: 75})
    for (const item of [...group.querySelectorAll<HTMLElement>('[data-index]')]) {
      item.getBoundingClientRect = () => ({width: 30}) as DOMRect
    }

    act(() => notifyResize?.())
    expect(document.querySelectorAll('[data-hidden]')).toHaveLength(2)
    expect(screen.getByRole('button', {name: 'Show +2 more'})).toBeVisible()

    Object.defineProperty(group, 'clientWidth', {configurable: true, value: 200})
    act(() => notifyResize?.())
    expect(document.querySelectorAll('[data-hidden]')).toHaveLength(0)
    expect(screen.queryByRole('button', {name: /Show \+/})).not.toBeInTheDocument()
  })

  it('accounts for customized padding and gaps when measuring auto truncation', () => {
    render(
      <LabelGroup style={{columnGap: 10, paddingLeft: 10, paddingRight: 10}} visibleChildCount="auto">
        <span>one</span>
        <span>two</span>
        <span>three</span>
      </LabelGroup>,
    )

    const group = screen.getByRole('list')
    Object.defineProperty(group, 'clientWidth', {configurable: true, value: 100})
    for (const item of [...group.querySelectorAll<HTMLElement>('[data-index]')]) {
      item.getBoundingClientRect = () => ({width: 30}) as DOMRect
    }

    act(() => notifyResize?.())
    expect(document.querySelectorAll('[data-hidden]')).toHaveLength(1)
    expect(screen.getByRole('button', {name: 'Show +1 more'})).toBeVisible()
  })

  it('expands inline and restores focus to the disclosure when it collapses', async () => {
    const user = userEvent.setup()
    render(
      <LabelGroup overflowStyle="inline" visibleChildCount={2}>
        <Token as="button" text="one" />
        <Token as="button" text="two" />
        <Token as="button" text="three" />
      </LabelGroup>,
    )

    const expand = screen.getByRole('button', {name: 'Show +1 more'})
    await user.click(expand)
    await waitFor(() => expect(screen.getByRole('button', {name: 'three'})).toHaveFocus())

    await user.click(screen.getByRole('button', {name: 'Show less'}))
    await waitFor(() => expect(screen.getByRole('button', {name: 'Show +1 more'})).toHaveFocus())
  })

  it('skips hidden and disabled descendants when focusing an expanded label', async () => {
    const user = userEvent.setup()
    render(
      <LabelGroup overflowStyle="inline" visibleChildCount={1}>
        <span>one</span>
        <span>
          <span style={{display: 'none'}}>
            <a href="#hidden">Hidden link</a>
          </span>
          <button type="button" aria-disabled="true">
            Unavailable label
          </button>
          <button type="button">Visible label</button>
        </span>
      </LabelGroup>,
    )

    await user.click(screen.getByRole('button', {name: 'Show +1 more'}))
    await waitFor(() => expect(screen.getByRole('button', {name: 'Visible label'})).toHaveFocus())
  })

  it('opens an accessible overlay and closes it with its close button', async () => {
    const user = userEvent.setup()
    render(
      <LabelGroup visibleChildCount={1}>
        <span>one</span>
        <span>two</span>
        <span>three</span>
      </LabelGroup>,
    )

    await user.click(screen.getByRole('button', {name: 'Show +2 more'}))
    expect(await screen.findByRole('dialog', {name: 'All 3 labels'})).toBeVisible()

    await user.click(screen.getByRole('button', {name: 'Close'}))
    expect(screen.queryByRole('dialog', {name: 'All 3 labels'})).not.toBeInTheDocument()
  })
})
