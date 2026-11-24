import React from 'react'
import {render} from '@testing-library/react'
import {afterEach, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import BaseStyles from '../../BaseStyles'
import {Dialog} from '../../Dialog'
import {FeatureFlags} from '../../FeatureFlags'
import {SelectPanel} from '../SelectPanel'

afterEach(() => vi.restoreAllMocks())

function ConfiguredPicker() {
  const [open, setOpen] = React.useState(false)
  return (
    <SelectPanel
      title="Choose labels"
      open={open}
      onOpenChange={setOpen}
      items={[{id: 'bug', text: 'Bug'}]}
      selected={[]}
      onSelectedChange={() => {}}
      onFilterChange={() => {}}
      renderAnchor={props => (
        <button {...props} type="button">
          Open configured picker
        </button>
      )}
    />
  )
}

it.each([1280, 390])('keeps configured hosting compatible inside legacy Dialog at %ipx', async width => {
  await page.viewport(width, 900)
  const onClose = vi.fn()
  render(
    <BaseStyles>
      <FeatureFlags
        flags={{
          primer_react_select_panel_composable_adapter: true,
          primer_react_select_panel_native_dialog: true,
        }}
      >
        <Dialog title="Legacy parent" onClose={onClose}>
          <ConfiguredPicker />
        </Dialog>
      </FeatureFlags>
    </BaseStyles>,
  )
  const trigger = page.getByRole('button', {name: 'Open configured picker', exact: true})
  expect(document.querySelector('dialog')).toBeNull()
  await userEvent.click(trigger)
  const collection = page.getByTestId('filtered-action-list')
  await expect.element(collection).toHaveAttribute('data-component', 'SelectPanel.Collection')
  await expect.element(collection.getByRole('combobox')).toHaveFocus()
  expect(document.querySelector('dialog')).toBeNull()
  await userEvent.keyboard('{Escape}')
  await expect.element(collection).not.toBeInTheDocument()
  await expect.element(trigger).toHaveFocus()
  await expect.element(page.getByRole('dialog', {name: 'Legacy parent', exact: true})).toBeVisible()
  expect(onClose).not.toHaveBeenCalled()
})

it('still adopts native configured hosting outside legacy Dialog', async () => {
  await page.viewport(1280, 900)
  render(
    <BaseStyles>
      <FeatureFlags
        flags={{
          primer_react_select_panel_composable_adapter: true,
          primer_react_select_panel_native_dialog: true,
        }}
      >
        <ConfiguredPicker />
      </FeatureFlags>
    </BaseStyles>,
  )
  await userEvent.click(page.getByRole('button', {name: 'Open configured picker', exact: true}))
  await expect.poll(() => document.querySelector('dialog')?.matches(':popover-open')).toBe(true)
  await userEvent.keyboard('{Escape}')
  await expect.element(page.getByTestId('filtered-action-list')).not.toBeInTheDocument()
})
