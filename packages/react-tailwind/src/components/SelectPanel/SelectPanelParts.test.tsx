import React from 'react'
import {Combobox} from '@base-ui/react/combobox'
import {renderToString} from 'react-dom/server'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {SelectPanel} from './SelectPanel'
import {Button} from '../Button'

afterEach(cleanup)

describe('SelectPanel parts contract', () => {
  it('forwards root refs, DOM props and render replacements without nested controls', async () => {
    const user = userEvent.setup()
    const triggerRef = React.createRef<HTMLButtonElement>()
    const popupRef = React.createRef<HTMLDivElement>()
    const filterRef = React.createRef<HTMLInputElement>()
    const listRef = React.createRef<HTMLDivElement>()
    const itemRef = React.createRef<HTMLDivElement>()
    render(
      <SelectPanel.Root<string> items={['bug']}>
        <SelectPanel.Trigger ref={triggerRef} aria-label="Labels" render={<Button />}>
          Labels
        </SelectPanel.Trigger>
        <SelectPanel.Portal>
          <SelectPanel.Positioner>
            <SelectPanel.Popup ref={popupRef} data-testid="popup">
              <SelectPanel.Header>
                <SelectPanel.Title>Labels</SelectPanel.Title>
              </SelectPanel.Header>
              <SelectPanel.Filter ref={filterRef} aria-label="Filter" data-testid="filter" />
              <SelectPanel.List ref={listRef} aria-label="Labels">
                {(value: string) => (
                  <SelectPanel.Item ref={itemRef} key={value} value={value} data-testid="item">
                    {value}
                  </SelectPanel.Item>
                )}
              </SelectPanel.List>
              <SelectPanel.Footer data-testid="footer">Footer</SelectPanel.Footer>
            </SelectPanel.Popup>
          </SelectPanel.Positioner>
        </SelectPanel.Portal>
      </SelectPanel.Root>,
    )
    expect(triggerRef.current).toBe(screen.getByRole('combobox', {name: 'Labels'}))
    expect(triggerRef.current?.querySelector('button')).toBeNull()
    await user.click(triggerRef.current!)
    const popup = await screen.findByTestId('popup')
    expect(popupRef.current).toBe(popup)
    expect(filterRef.current).toBe(screen.getByTestId('filter'))
    expect(listRef.current).toBe(screen.getByRole('listbox', {name: 'Labels'}))
    expect(itemRef.current).toBe(screen.getByTestId('item'))
    expect(popupRef.current).toHaveAttribute('aria-labelledby', screen.getByRole('heading', {name: 'Labels'}).id)
  })

  it('preserves value change cancellation and state-aware styling', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn((_value: string | null, details: {cancel: () => void}) => details.cancel())
    render(
      <SelectPanel.Root<string> items={['bug']} defaultValue={null} onValueChange={onChange}>
        <SelectPanel.Trigger aria-label="Labels">Labels</SelectPanel.Trigger>
        <SelectPanel.Portal>
          <SelectPanel.Positioner>
            <SelectPanel.Popup>
              <SelectPanel.Title>Labels</SelectPanel.Title>
              <SelectPanel.Filter aria-label="Filter" />
              <SelectPanel.List aria-label="Labels">
                {(value: string) => (
                  <SelectPanel.Item
                    key={value}
                    value={value}
                    className={state => (state.selected ? 'font-bold' : 'font-normal')}
                  >
                    {value}
                    <SelectPanel.SelectionIndicator />
                  </SelectPanel.Item>
                )}
              </SelectPanel.List>
            </SelectPanel.Popup>
          </SelectPanel.Positioner>
        </SelectPanel.Portal>
      </SelectPanel.Root>,
    )
    await user.click(screen.getByRole('combobox', {name: 'Labels'}))
    const option = await screen.findByRole('option', {name: 'bug'})
    await user.click(option)
    expect(onChange).toHaveBeenCalledWith('bug', expect.objectContaining({reason: 'item-press'}))
    expect(option).toHaveAttribute('aria-selected', 'false')
    expect(option).toHaveClass('font-normal')
  })

  it.each(['spinner', 'skeleton'] as const)(
    'announces %s loading without a dangling input list reference',
    async variant => {
      const user = userEvent.setup()
      render(
        <SelectPanel.Root<string> items={[]}>
          <SelectPanel.Trigger aria-label="Loading labels">Labels</SelectPanel.Trigger>
          <SelectPanel.Portal>
            <SelectPanel.Positioner>
              <SelectPanel.Popup>
                <SelectPanel.Title>Loading labels</SelectPanel.Title>
                <SelectPanel.Filter aria-label="Filter" />
                <SelectPanel.Loading variant={variant}>Loading labels</SelectPanel.Loading>
              </SelectPanel.Popup>
            </SelectPanel.Positioner>
          </SelectPanel.Portal>
        </SelectPanel.Root>,
      )
      await user.click(screen.getByRole('combobox', {name: 'Loading labels'}))
      expect(await screen.findByRole('status')).toHaveTextContent('Loading labels')
      const input = screen.getByRole('combobox', {name: 'Filter'})
      await waitFor(() => expect(input).not.toHaveAttribute('aria-controls'))
    },
  )

  it('renders deterministic title associations on the server for an inline composition', () => {
    const html = renderToString(
      <SelectPanel.Root<string> inline open items={['bug']}>
        <SelectPanel.Title>Labels</SelectPanel.Title>
        <SelectPanel.Filter aria-label="Filter" />
        <SelectPanel.List aria-label="Labels">
          {(value: string) => (
            <SelectPanel.Item key={value} value={value}>
              {value}
            </SelectPanel.Item>
          )}
        </SelectPanel.List>
      </SelectPanel.Root>,
    )
    expect(html).toContain('SelectPanel.Title')
    expect(html).toContain('aria-label="Filter"')
    expect(html).toContain('role="listbox"')
    expect(html).toContain('role="option"')
  })

  it.each([true, false])('accepts an explicit popup name without a title (filterable=%s)', async filterable => {
    const user = userEvent.setup()
    render(
      <SelectPanel.Root<string> {...(filterable ? {} : {filterable: false})}>
        <SelectPanel.Trigger aria-label="Labels">Labels</SelectPanel.Trigger>
        <SelectPanel.Portal>
          <SelectPanel.Positioner>
            <SelectPanel.Popup aria-label="Available labels" data-testid="popup">
              <SelectPanel.List aria-label="Labels">
                <SelectPanel.Item value="bug">bug</SelectPanel.Item>
              </SelectPanel.List>
            </SelectPanel.Popup>
          </SelectPanel.Positioner>
        </SelectPanel.Portal>
      </SelectPanel.Root>,
    )
    await user.click(screen.getByRole('combobox', {name: 'Labels'}))
    const popup = await screen.findByTestId('popup')
    expect(popup).toHaveAccessibleName('Available labels')
    expect(popup).not.toHaveAttribute('aria-labelledby')
  })

  it('accepts a custom title id and an explicit popup association', async () => {
    const user = userEvent.setup()
    render(
      <SelectPanel.Root<string> items={['bug']}>
        <SelectPanel.Trigger aria-label="Labels">Labels</SelectPanel.Trigger>
        <SelectPanel.Portal>
          <SelectPanel.Positioner>
            <SelectPanel.Popup aria-labelledby="custom-title" data-testid="popup">
              <SelectPanel.Title id="custom-title">Custom labels</SelectPanel.Title>
              <SelectPanel.Filter aria-label="Filter" />
              <SelectPanel.List aria-label="Labels">
                {(value: string) => (
                  <SelectPanel.Item key={value} value={value}>
                    {value}
                  </SelectPanel.Item>
                )}
              </SelectPanel.List>
            </SelectPanel.Popup>
          </SelectPanel.Positioner>
        </SelectPanel.Portal>
      </SelectPanel.Root>,
    )
    await user.click(screen.getByRole('combobox', {name: 'Labels'}))
    expect(await screen.findByTestId('popup')).toHaveAccessibleName('Custom labels')
  })

  it('omits the input and preserves keyboard selection, disabled rejection and trigger focus', async () => {
    const user = userEvent.setup()
    function Picker() {
      const [value, setValue] = React.useState<string | null>(null)
      return (
        <SelectPanel.Root<string> filterable={false} value={value} onValueChange={setValue}>
          <SelectPanel.Trigger aria-label="Choose label">{value ?? 'Choose label'}</SelectPanel.Trigger>
          <SelectPanel.Portal>
            <SelectPanel.Positioner>
              <SelectPanel.Popup>
                <SelectPanel.Title>Choose label</SelectPanel.Title>
                <SelectPanel.List aria-label="Choose label">
                  <SelectPanel.Item value="bug">bug</SelectPanel.Item>
                  <SelectPanel.Item value="archived" disabled>
                    archived
                  </SelectPanel.Item>
                  <SelectPanel.Item value="enhancement">enhancement</SelectPanel.Item>
                </SelectPanel.List>
              </SelectPanel.Popup>
            </SelectPanel.Positioner>
          </SelectPanel.Portal>
        </SelectPanel.Root>
      )
    }
    render(<Picker />)
    const trigger = screen.getByRole('combobox', {name: 'Choose label'})
    trigger.focus()
    await user.keyboard('{ArrowDown}')
    await screen.findByRole('listbox', {name: 'Choose label'})
    await waitFor(() => expect(screen.getByRole('option', {name: 'bug'})).toHaveFocus())
    expect(document.querySelector('input:not([type="hidden"]):not([aria-hidden="true"])')).not.toBeInTheDocument()
    await user.keyboard('{Home}{ArrowDown}')
    await waitFor(() => expect(screen.getByRole('option', {name: 'archived'})).toHaveFocus())
    await user.keyboard('{Enter}')
    expect(trigger).toHaveTextContent('Choose label')
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(screen.getByRole('option', {name: 'enhancement'})).toHaveFocus())
    await user.keyboard('{Enter}')
    await waitFor(() => expect(trigger).toHaveTextContent('enhancement'))
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('preserves Base UI context when a consumer supplies a matching primitive item', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SelectPanel.Root<string> items={['bug']} onValueChange={onChange}>
        <SelectPanel.Trigger aria-label="Labels">Labels</SelectPanel.Trigger>
        <SelectPanel.Portal>
          <SelectPanel.Positioner>
            <SelectPanel.Popup>
              <SelectPanel.Title>Labels</SelectPanel.Title>
              <SelectPanel.Filter aria-label="Filter" />
              <SelectPanel.List aria-label="Labels">
                {(value: string) => (
                  <Combobox.Item key={value} value={value}>
                    <SelectPanel.SelectionIndicator />
                    {value}
                  </Combobox.Item>
                )}
              </SelectPanel.List>
            </SelectPanel.Popup>
          </SelectPanel.Positioner>
        </SelectPanel.Portal>
      </SelectPanel.Root>,
    )
    await user.click(screen.getByRole('combobox', {name: 'Labels'}))
    await user.click(await screen.findByRole('option', {name: 'bug'}))
    expect(onChange).toHaveBeenCalledWith('bug', expect.objectContaining({reason: 'item-press'}))
  })
})
