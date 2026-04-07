import {render, screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import React from 'react'
import {describe, expect, it, vi} from 'vitest'

import {FeatureFlags} from '../FeatureFlags'
import FormControl from '../FormControl'
import {SelectPanel, type ItemInput} from '../SelectPanel'
import {createInitialSelectPanelNextState, selectPanelNextReducer} from './SelectPanelNext.state'
import {getFooterLayout} from './SelectPanelNext.utils'

const items: ItemInput[] = [
  {id: 1, text: 'item one'},
  {id: 2, text: 'item two'},
  {id: 3, text: 'item three'},
]

function renderWithNextFlag(element: React.ReactElement) {
  return render(<FeatureFlags flags={{primer_react_select_panel_next: true}}>{element}</FeatureFlags>)
}

describe('SelectPanelNext', () => {
  it('tracks reducer transitions for loading, sorting, and modal selection state', () => {
    const initialState = createInitialSelectPanelNextState({selected: items[0]})

    expect(initialState.selectedOnSort).toEqual([items[0]])
    expect(initialState.dataLoadedOnce).toBe(false)

    const loadingState = selectPanelNextReducer(initialState, {type: 'set-internal-loading', value: true})
    expect(loadingState.internalLoading).toBe(true)

    const loadedState = selectPanelNextReducer(loadingState, {type: 'mark-loaded'})
    expect(loadedState.internalLoading).toBe(false)
    expect(loadedState.dataLoadedOnce).toBe(true)

    const syncState = selectPanelNextReducer(loadedState, {
      type: 'sync-open-state',
      selectedItems: [items[1]],
    })
    expect(syncState.selectedOnSort).toEqual([items[1]])
  })

  it('simplifies footer modes through an explicit layout helper', () => {
    const legacyFooterLayout = getFooterLayout({
      footer: <div>legacy footer</div>,
      hasOnCancel: true,
      hasSecondaryAction: true,
      isMultiSelect: true,
      usingFullScreenOnNarrow: true,
      variant: 'anchored',
    })
    expect(legacyFooterLayout.kind).toBe('legacy')

    const responsiveFooterLayout = getFooterLayout({
      footer: undefined,
      hasOnCancel: false,
      hasSecondaryAction: false,
      isMultiSelect: true,
      usingFullScreenOnNarrow: true,
      variant: 'anchored',
    })

    expect(responsiveFooterLayout).toMatchObject({
      kind: 'actions',
      displayFooter: 'only-small',
      showCancelAndSave: false,
      showSaveAndClose: true,
    })
  })

  it('defers single-select modal commits until Save and discards them on Cancel', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()

    function ModalFixture() {
      const [selected, setSelected] = React.useState<ItemInput | undefined>(items[0])
      const [open, setOpen] = React.useState(false)

      return (
        <SelectPanel
          title="Select an item"
          placeholder="Select an item"
          items={items}
          selected={selected}
          onSelectedChange={(value: ItemInput | undefined) => {
            onSelectedChange(value)
            setSelected(value)
          }}
          open={open}
          onOpenChange={setOpen}
          onFilterChange={() => {}}
          variant="modal"
          onCancel={() => {}}
        />
      )
    }

    renderWithNextFlag(<ModalFixture />)

    await user.click(screen.getByRole('button', {name: 'item one'}))
    await user.click(screen.getByRole('option', {name: 'item two'}))

    expect(onSelectedChange).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', {name: 'Cancel'}))
    expect(screen.getByRole('button', {name: 'item one'})).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: 'item one'}))
    await user.click(screen.getByRole('option', {name: 'item two'}))
    await user.click(screen.getByRole('button', {name: 'Save'}))

    expect(onSelectedChange).toHaveBeenCalledWith(items[1])
    expect(screen.getByRole('button', {name: 'item two'})).toBeInTheDocument()
  })

  it('keeps deprecated footer support ahead of secondaryAction in the next implementation', async () => {
    const user = userEvent.setup()

    function FooterFixture() {
      const [selected, setSelected] = React.useState<ItemInput[]>([])
      const [open, setOpen] = React.useState(false)

      return (
        <SelectPanel
          title="Select items"
          placeholder="Select items"
          items={items}
          selected={selected}
          onSelectedChange={setSelected}
          open={open}
          onOpenChange={setOpen}
          onFilterChange={() => {}}
          footer={<div>deprecated footer</div>}
          secondaryAction={<SelectPanel.SecondaryActionButton>secondary action</SelectPanel.SecondaryActionButton>}
        />
      )
    }

    renderWithNextFlag(<FooterFixture />)

    await user.click(screen.getByRole('button', {name: 'Select items'}))

    expect(screen.getByText('deprecated footer')).toBeInTheDocument()
    expect(screen.queryByText('secondary action')).not.toBeInTheDocument()
  })

  it('keeps trigger labeling wired through FormControl when the next implementation is enabled', () => {
    function LabelFixture() {
      const [selected, setSelected] = React.useState<ItemInput[]>([])

      return (
        <FormControl>
          <FormControl.Label>Labels</FormControl.Label>
          <SelectPanel
            id="labels-panel"
            title="Select labels"
            placeholder="Choose labels"
            items={items}
            selected={selected}
            onSelectedChange={setSelected}
            open={false}
            onOpenChange={() => {}}
            onFilterChange={() => {}}
          />
        </FormControl>
      )
    }

    renderWithNextFlag(<LabelFixture />)

    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAccessibleName(/Labels/i)
    expect(trigger).toHaveAttribute('aria-labelledby')
  })
})
