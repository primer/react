import type {Meta, StoryObj} from '@storybook/react-vite'
import React, {useState} from 'react'
import {within, userEvent, expect} from 'storybook/test'
import {SelectPanel, type SelectPanelProps} from './SelectPanel'
import type {ItemInput} from '.'
import {TriangleDownIcon} from '@primer/octicons-react'
import {Button} from '../Button'
import FormControl from '../FormControl'
import {FeatureFlags} from '../FeatureFlags'

export default {
  title: 'Components/SelectPanel/Interactions',
} as Meta

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

function getColorCircle(color: string) {
  return function () {
    return (
      <div
        style={{
          backgroundColor: color,
          borderColor: color,
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: '1px solid',
        }}
      />
    )
  }
}

const items = [
  {leadingVisual: getColorCircle('#a2eeef'), text: 'enhancement', id: 1},
  {leadingVisual: getColorCircle('#d73a4a'), text: 'bug', id: 2},
  {leadingVisual: getColorCircle('#0cf478'), text: 'good first issue', id: 3},
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
]

const KeyboardNavigationStory = () => {
  const [selected, setSelected] = useState<ItemInput[]>([])
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <FormControl>
      <FormControl.Label>Select labels</FormControl.Label>
      <SelectPanel
        title="Select labels"
        placeholder="Select labels"
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps}>
            {children}
          </Button>
        )}
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        width="medium"
      />
    </FormControl>
  )
}

const KeyboardNavigationWithFeatureFlagStory = () => {
  const [selected, setSelected] = useState<ItemInput[]>([])
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text.toLowerCase().startsWith(filter.toLowerCase()))
  const [open, setOpen] = useState(false)

  return (
    <FeatureFlags flags={{primer_react_select_panel_remove_active_descendant: true}}>
      <FormControl>
        <FormControl.Label>Select labels</FormControl.Label>
        <SelectPanel
          title="Select labels"
          placeholder="Select labels"
          subtitle="Use labels to organize issues and pull requests"
          renderAnchor={({children, ...anchorProps}) => (
            <Button trailingAction={TriangleDownIcon} {...anchorProps}>
              {children}
            </Button>
          )}
          open={open}
          onOpenChange={setOpen}
          items={filteredItems}
          selected={selected}
          onSelectedChange={setSelected}
          onFilterChange={setFilter}
          width="medium"
        />
      </FormControl>
    </FeatureFlags>
  )
}

export const KeyboardNavigation: StoryObj<SelectPanelProps> = {
  render: KeyboardNavigationStory,
  play: async ({canvasElement}: {canvasElement: HTMLElement}) => {
    const canvas = within(canvasElement)

    // Wait for initial render
    await delay(300)

    // Find and click the button to open the panel
    const button = canvas.getByRole('button', {name: /select labels/i})
    await userEvent.click(button)

    // Wait for panel to open
    await delay(500)

    // Find the search input
    const searchInput = canvas.getByRole('combobox', {name: /filter items/i})
    expect(searchInput).toBeInTheDocument()

    // Type to filter items
    await delay(300)
    await userEvent.type(searchInput, 'b')

    // Wait for filtering to occur
    await delay(500)

    // Get all visible options (should be filtered to items starting with 'b')
    const options = canvas.getAllByRole('option')
    expect(options).toHaveLength(3) // bug, blocker, backend

    // Use arrow keys to navigate
    await delay(300)
    await userEvent.keyboard('{ArrowDown}')

    await delay(300)
    await userEvent.keyboard('{ArrowDown}')

    await delay(300)
    await userEvent.keyboard('{ArrowDown}')

    // Navigate back up
    await delay(300)
    await userEvent.keyboard('{ArrowUp}')

    await delay(300)
    await userEvent.keyboard('{ArrowUp}')

    // Select an item with Space or Enter
    await delay(300)
    await userEvent.keyboard('{Enter}')

    // Wait to show the selection
    await delay(500)

    // Clear the filter with backspace
    await delay(500)
    await userEvent.keyboard('{Backspace}')

    await delay(500)
    await userEvent.type(searchInput, 'b')

    await delay(500)
    await userEvent.type(searchInput, 'u')

    await delay(500)
    await userEvent.keyboard('{Enter}')

    // Escape to close the panel
    await delay(500)
    await userEvent.keyboard('{Escape}')
  },
}

export const KeyboardNavigationWithRovingTabindex: StoryObj<SelectPanelProps> = {
  render: KeyboardNavigationWithFeatureFlagStory,
  play: async ({canvasElement}: {canvasElement: HTMLElement}) => {
    const canvas = within(canvasElement)

    // Wait for initial render
    await delay(300)

    // Find and click the button to open the panel
    const button = canvas.getByRole('button', {name: /select labels/i})
    await userEvent.click(button)

    // Wait for panel to open
    await delay(500)

    // Find the search input
    const searchInput = canvas.getByRole('combobox', {name: /Filter items/i})
    expect(searchInput).toBeInTheDocument()

    // Type to filter items
    await delay(500)
    await userEvent.type(searchInput, 'f')

    await delay(500)
    await userEvent.type(searchInput, 'r')

    // Wait for filtering to occur
    await delay(500)

    // Get all visible options (should be filtered to items starting with 'f')
    const options = canvas.getAllByRole('option')
    expect(options).toHaveLength(1) // frontend

    // Clear the filter to see more items
    await delay(300)
    await userEvent.clear(searchInput)

    await delay(300)
    await userEvent.type(searchInput, 'e')

    // Wait for filtering
    await delay(500)

    // Use arrow keys to navigate (roving tabindex behavior)
    await delay(300)
    await userEvent.keyboard('{ArrowDown}')

    await delay(300)
    await userEvent.keyboard('{ArrowDown}')

    await delay(300)
    await userEvent.keyboard('{ArrowDown}')

    // Navigate back up
    await delay(300)
    await userEvent.keyboard('{ArrowUp}')

    await delay(300)
    await userEvent.keyboard('{ArrowUp}')

    // Select an item with Space or Enter
    await delay(300)
    await userEvent.keyboard('{Enter}')

    // Wait to show the selection
    await delay(500)

    // Shift+Tab to go back to the search input
    await delay(300)
    await userEvent.keyboard('{Shift}{Tab}')

    // Backspace to clear the filter
    await delay(300)
    await userEvent.keyboard('{Backspace}')

    // Select another option
    // Type to filter items
    await delay(500)
    await userEvent.type(searchInput, 'b')

    await delay(500)
    await userEvent.type(searchInput, 'u')

    // Wait for filtering to occur
    await delay(500)

    // Use arrow keys to navigate (roving tabindex behavior)
    await delay(300)
    await userEvent.keyboard('{ArrowDown}')

    // Select an item with Space or Enter
    await delay(300)
    await userEvent.keyboard('{Enter}')

    // Escape to close the panel
    await delay(500)
    await userEvent.keyboard('{Escape}')
  },
}
