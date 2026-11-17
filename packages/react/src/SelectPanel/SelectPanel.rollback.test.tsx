import React from 'react'
import {render} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {FeatureFlags} from '../FeatureFlags'
import {getLiveRegion} from '../live-region/__tests__/test-helpers'
import {SelectPanel} from './SelectPanel'
import {SelectPanelMessage} from './SelectPanelMessage'

describe.each([false, true])('configured SelectPanel rollback with adapter=%s', composable => {
  function withFlags(children: React.ReactNode) {
    return <FeatureFlags flags={{primer_react_select_panel_composable_adapter: composable}}>{children}</FeatureFlags>
  }

  beforeEach(() => {
    document.body.appendChild(document.createElement('live-region'))
  })

  afterEach(() => {
    getLiveRegion().remove()
  })

  it('gates named-message markup and live-region announcements', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      withFlags(
        <SelectPanelMessage
          ref={ref}
          variant="error"
          title="Search unavailable"
          action={<button type="button">Retry</button>}
        >
          Please try again.
        </SelectPanelMessage>,
      ),
    )

    const message = ref.current
    const title = page.getByText('Search unavailable', {exact: true}).element()
    const body = page.getByText('Please try again.', {exact: true}).element()
    expect(title.parentElement === message).toBe(!composable)
    expect(body.parentElement).toBe(title.parentElement)
    expect(page.getByRole('button', {name: 'Retry'}).element().closest('[data-component="SelectPanel.Message"]')).toBe(
      message,
    )
    if (composable) {
      expect(message).toHaveAttribute('data-size', 'full')
      expect(getLiveRegion().getMessage('polite')).toContain('Search unavailable')
      expect(getLiveRegion().getMessage('polite')).not.toContain('Retry')
    } else {
      expect(message).not.toHaveAttribute('data-size')
      expect(getLiveRegion().getMessage('polite')).toBe('')
    }
  })

  it('always uses the new message part for explicit composition', () => {
    render(
      withFlags(
        <SelectPanel.Message variant="empty" title="No matches" data-testid="message">
          Try another query.
        </SelectPanel.Message>,
      ),
    )
    expect(page.getByTestId('message').element()).toHaveAttribute('data-size', 'full')
    expect(getLiveRegion().getMessage('polite')).toContain('No matches')
  })

  it('preserves configured headings while gating message markup', async () => {
    render(
      withFlags(
        <SelectPanel
          open
          onOpenChange={() => {}}
          items={[]}
          loading={false}
          selected={[]}
          onSelectedChange={() => {}}
          onFilterChange={() => {}}
          title="Choose labels"
          subtitle="Labels for this issue"
          message={{variant: 'error', title: 'Search unavailable', body: 'Please try again.'}}
        />,
      ),
    )
    await expect.element(page.getByRole('heading', {name: 'Choose labels', level: 1})).toBeVisible()
    const title = page.getByText('Search unavailable', {exact: true}).element()
    const message = title.closest('[data-component="SelectPanel.Message"]')
    expect(title.parentElement === message).toBe(!composable)
    expect(page.getByRole('dialog').element()).toHaveAttribute(
      'aria-describedby',
      page.getByText('Labels for this issue', {exact: true}).element().id,
    )
  })

  it('preserves reference-based anchored single selection until opted in', async () => {
    const selected = {id: 'one', text: 'One'}
    const item = {...selected}
    const onSelectedChange = vi.fn()
    const onOpenChange = vi.fn()
    render(
      withFlags(
        <SelectPanel
          open
          onOpenChange={onOpenChange}
          items={[item]}
          selected={selected}
          onSelectedChange={onSelectedChange}
          onFilterChange={() => {}}
        />,
      ),
    )
    await userEvent.click(page.getByRole('option', {name: 'One', exact: true}))
    expect(onSelectedChange).toHaveBeenCalledExactlyOnceWith(composable ? undefined : item)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false, 'selection')
  })

  it('preserves legacy ID comparison for modal drafts until opted in', async () => {
    const first = {text: 'First'}
    const second = {text: 'Second'}
    const onSelectedChange = vi.fn()
    const onOpenChange = vi.fn()
    render(
      withFlags(
        <SelectPanel
          open
          onOpenChange={onOpenChange}
          variant="modal"
          onCancel={() => {}}
          items={[first, second]}
          selected={first}
          onSelectedChange={onSelectedChange}
          onFilterChange={() => {}}
        />,
      ),
    )
    await userEvent.click(page.getByRole('option', {name: 'Second', exact: true}))
    expect(onSelectedChange).not.toHaveBeenCalled()
    await userEvent.click(page.getByRole('button', {name: 'Save', exact: true}))
    expect(onSelectedChange).toHaveBeenCalledExactlyOnceWith(composable ? second : undefined)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false, 'selection')
  })
})

it('retains the original overlay without the adapter despite native browser support', async () => {
  render(
    <FeatureFlags flags={{primer_react_select_panel_composable_adapter: false}}>
      <SelectPanel
        open
        onOpenChange={() => {}}
        items={[{id: 'one', text: 'One'}]}
        selected={[]}
        onSelectedChange={() => {}}
        onFilterChange={() => {}}
      />
    </FeatureFlags>,
  )
  const dialog = page.getByRole('dialog')
  await expect.element(dialog).toBeVisible()
  expect(dialog.element()).not.toBeInstanceOf(HTMLDialogElement)
  expect(dialog.element()).not.toHaveAttribute('aria-modal')
  expect(page.getByRole('heading', {name: 'Select items', level: 1}).element()).toBeVisible()
  expect(page.getByTestId('filtered-action-list').element()).toHaveAttribute('data-component', 'FilteredActionList')
})
