import type {Meta, StoryObj} from '@storybook/react-vite'
import {useMemo, useState} from 'react'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {SelectPanel, type SelectPanelValue} from '.'
import {VirtualizedSelectPanelCollection} from './virtualization/VirtualizedSelectPanelCollection'

const repositories = Array.from({length: 10_000}, (_, index) => ({
  value: index,
  label: `Repository ${String(index + 1).padStart(5, '0')}`,
  disabled: (index + 1) % 97 === 0,
}))

const meta = {
  title: 'Components/SelectPanel/Virtualization',
  component: SelectPanel.Root,
} satisfies Meta<typeof SelectPanel.Root>

export default meta

export const TenThousandItems = {
  render: function VirtualizedRepositoryPicker() {
    const [selected, setSelected] = useState<SelectPanelValue[]>([])
    const [query, setQuery] = useState('')
    const filtered = useMemo(
      () => repositories.filter(item => item.label.toLowerCase().includes(query.trim().toLowerCase())),
      [query],
    )
    return (
      <SelectPanel.Root
        focusStrategy="roving"
        selectionMode="multiple"
        selected={selected}
        onSelectedChange={setSelected}
        filterValue={query}
        onFilterChange={setQuery}
      >
        <SelectPanel.Trigger>Repositories ({selected.length})</SelectPanel.Trigger>
        <SelectPanel.Overlay width="large">
          <SelectPanel.Content>
            <SelectPanel.Header>
              <div>
                <SelectPanel.Title>Choose repositories</SelectPanel.Title>
                <SelectPanel.Description>
                  10,000 items with virtual scrolling. Every 97th repository is disabled.
                </SelectPanel.Description>
              </div>
              <SelectPanel.CloseButton />
            </SelectPanel.Header>
            <VirtualizedSelectPanelCollection items={filtered} />
            {filtered.length === 0 && (
              <SelectPanel.Message variant="empty" size="inline" title="No matching repositories">
                Try a different name or number.
              </SelectPanel.Message>
            )}
            <SelectPanel.Footer>
              <span role="status">
                {filtered.length.toLocaleString()} results / {selected.length} selected
              </span>
            </SelectPanel.Footer>
          </SelectPanel.Content>
        </SelectPanel.Overlay>
      </SelectPanel.Root>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Internal TanStack Virtual proof of concept, not a public SelectPanel virtualization API. Flat, single-line, fixed 32px rows only. Arrow keys, Home/End and PageUp/PageDown navigate the full filtered collection; the focused row stays mounted during scrolling. Selection persists across filters. Grouping, variable-height content and secondary actions are outside this experiment.',
      },
    },
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', {name: 'Repositories (0)'}))
    const input = await body.findByRole('textbox', {name: 'Filter virtualized items'})
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.keyboard('{ArrowDown}{End}')
    const last = await body.findByRole('option', {name: 'Repository 10000'})
    await expect(last).toHaveFocus()
    await expect(last).toHaveAttribute('aria-posinset', '10000')
    await expect(last).toHaveAttribute('aria-setsize', '10000')
    await expect(body.getAllByRole('option').length).toBeLessThan(40)
    await userEvent.keyboard('{Enter}{Home}')
    await expect(body.getByRole('option', {name: 'Repository 00001'})).toHaveFocus()
    await userEvent.type(input, '09999')
    await userEvent.keyboard('{ArrowDown}')
    const match = body.getByRole('option', {name: 'Repository 09999'})
    await expect(match).toHaveFocus()
    await expect(match).toHaveAttribute('aria-posinset', '1')
    await expect(match).toHaveAttribute('aria-setsize', '1')
    await userEvent.keyboard('{Enter}')
    await userEvent.clear(input)
    await waitFor(() =>
      expect(body.getByRole('option', {name: 'Repository 00001'})).toHaveAttribute('aria-setsize', '10000'),
    )
    await userEvent.click(body.getByRole('button', {name: 'Close'}))
    await waitFor(() => expect(canvas.getByRole('button', {name: 'Repositories (2)'})).toHaveFocus())
  },
} satisfies StoryObj<typeof meta>
