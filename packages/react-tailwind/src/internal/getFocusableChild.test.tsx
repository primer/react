import {render, screen} from '@testing-library/react'
import React from 'react'
import {expect, it} from 'vitest'
import {getFocusableChild, isAvailableFocusTarget} from './getFocusableChild'

it('skips disabled and visually hidden descendants when selecting a focus target', () => {
  const {container} = render(
    <div>
      <button type="button" disabled>
        Disabled
      </button>
      <button type="button" aria-disabled="true">
        Unavailable
      </button>
      <span role="group" aria-disabled="true">
        <a href="#disabled-group">Unavailable in group</a>
      </span>
      <fieldset disabled>
        <button type="button">Disabled by fieldset</button>
      </fieldset>
      <input type="hidden" />
      <span hidden>
        <a href="#hidden-attribute">Hidden by attribute</a>
      </span>
      <span style={{display: 'none'}}>
        <a href="#hidden-style">Hidden by style</a>
      </span>
      <a href="#hidden-visibility" style={{visibility: 'hidden'}}>
        Hidden by visibility
      </a>
      <span aria-hidden="true">
        <a href="#aria-hidden">Hidden from assistive technology</a>
      </span>
      <span inert>
        <a href="#inert">Inert</a>
      </span>
      <span style={{contentVisibility: 'hidden'}}>
        <a href="#hidden-content">Hidden content</a>
      </span>
      <a href="#visible">Visible</a>
    </div>,
  )

  expect(getFocusableChild(container)).toBe(screen.getByRole('link', {name: 'Visible'}))
})

it('allows a descendant to restore inherited visibility', () => {
  const {container} = render(
    <span style={{visibility: 'hidden'}}>
      <a href="#visible" style={{visibility: 'visible'}}>
        Visible
      </a>
    </span>,
  )

  expect(getFocusableChild(container)).toBe(screen.getByRole('link', {name: 'Visible'}))
})

it('returns no target when no enabled, visible descendant exists', () => {
  const {container} = render(
    <div>
      <button type="button" aria-disabled="true">
        Unavailable
      </button>
      <span hidden>
        <a href="#hidden">Hidden</a>
      </span>
    </div>,
  )

  expect(getFocusableChild(container)).toBeNull()
  expect(getFocusableChild(null)).toBeNull()
})

it('allows available targets outside the tab order but rejects non-focusable elements', () => {
  render(
    <div>
      <div role="menuitem" tabIndex={-1}>
        Roving item
      </div>
      <span>Not focusable</span>
    </div>,
  )

  expect(isAvailableFocusTarget(screen.getByRole('menuitem', {name: 'Roving item'}))).toBe(true)
  expect(isAvailableFocusTarget(screen.getByText('Not focusable'))).toBe(false)
})
