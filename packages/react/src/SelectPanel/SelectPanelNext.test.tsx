import {render, screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import React from 'react'
import {describe, expect, it, vi} from 'vitest'

import {FeatureFlags} from '../FeatureFlags'
import FormControl from '../FormControl'
import {SelectPanel, type ItemInput} from '../SelectPanel'
import {implementsClassName} from '../utils/testing'
import {getSelectPanelNextMultiModeConfig, handleSelectAllChange} from './SelectPanelNextMulti'
import {getSelectPanelNextSingleModeConfig, handleSingleModeSave} from './SelectPanelNextSingle'
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
  implementsClassName(props => (
    <FeatureFlags flags={{primer_react_select_panel_next: true}}>
      <SelectPanel
        title="Select items"
        placeholder="Select items"
        items={items}
        selected={[]}
        onSelectedChange={() => {}}
        open={true}
        onOpenChange={() => {}}
        onFilterChange={() => {}}
        {...props}
      />
    </FeatureFlags>
  ))

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

  it('builds mode-specific configuration for single and multi controllers', () => {
    const onIntermediateSelectedChange = vi.fn()
    const onSingleSelectedChange = vi.fn()
    const onSelectionClose = vi.fn()

    const singleModeConfig = getSelectPanelNextSingleModeConfig({
      intermediateSelected: items[0],
      isSingleSelectModal: true,
      items,
      onIntermediateSelectedChange,
      onSelectedChange: onSingleSelectedChange,
      onSelectionClose,
      selected: items[0],
      selectedOnSort: [items[0]],
      shouldOrderSelectedFirst: true,
    })

    expect(singleModeConfig.selectionVariant).toBe('radio')
    expect(singleModeConfig.itemsToRender).toHaveLength(items.length)

    const onMultiSelectedChange = vi.fn()
    const multiModeConfig = getSelectPanelNextMultiModeConfig({
      items,
      onSelectedChange: onMultiSelectedChange,
      selected: [items[0]],
      selectedOnSort: [items[0]],
      shouldOrderSelectedFirst: true,
    })

    expect(multiModeConfig.selectionVariant).toBe('multiple')
    expect(multiModeConfig.itemsToRender[0]).toMatchObject({selected: true})
  })

  it('routes controller actions for Save and Select all', () => {
    const onSingleClose = vi.fn()
    const onSingleSelectedChange = vi.fn()

    handleSingleModeSave({
      intermediateSelected: items[1],
      isSingleSelectModal: true,
      onClose: onSingleClose,
      onSelectedChange: onSingleSelectedChange,
      variant: 'modal',
    })

    expect(onSingleSelectedChange).toHaveBeenCalledWith(items[1])
    expect(onSingleClose).toHaveBeenCalledWith('selection')

    const onMultiSelectedChange = vi.fn()
    const itemsInViewSet = new Set<string | number | ItemInput>([1, 2])

    handleSelectAllChange({
      checked: true,
      items: [items[0], items[1]],
      itemsInViewSet,
      onSelectedChange: onMultiSelectedChange,
      selected: [items[2]],
    })

    expect(onMultiSelectedChange).toHaveBeenCalledWith([items[2], items[0], items[1]])
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
