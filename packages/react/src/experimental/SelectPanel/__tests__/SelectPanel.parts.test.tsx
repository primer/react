import {useState, type ComponentType} from 'react'
import {render, fireEvent, screen, within} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SelectPanelParts as SelectPanel} from '../SelectPanel'
import {Tabs, useTab, useTabList, useTabPanel} from '../../Tabs'
import {MultiSelectAcrossTabs} from '../SelectPanelParts.stories'

// Local Tabs convenience wrappers, mirroring the recipe story: the Tabs primitive
// exports only hooks, so a tabbed picker is composed from SelectPanel parts + these
// thin wrappers. SelectPanel itself no longer owns tabs.
function RefTabList({children, ...props}: {'aria-label': string; children: React.ReactNode}) {
  const {tabListProps} = useTabList<HTMLDivElement>(props)
  return (
    // @ts-expect-error Tabs primitive expects a non-nullable ref
    <div {...props} {...tabListProps}>
      {children}
    </div>
  )
}

function RefTab({value, count, children}: {value: string; count?: number; children: React.ReactNode}) {
  const {tabProps} = useTab({value})
  return (
    <button {...tabProps} type="button">
      {children}
      {count !== undefined ? <span aria-hidden>{count}</span> : null}
    </button>
  )
}

function RefTabPanel({value, children}: {value: string; children: React.ReactNode}) {
  const {tabPanelProps} = useTabPanel({value})
  return <div {...tabPanelProps}>{children}</div>
}

function Example() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('branches')
  const items = active === 'branches' ? ['main', 'develop'] : ['v1.0', 'v2.0']

  return (
    <SelectPanel.Root open={open} onOpenChange={setOpen} selectionVariant="single">
      <SelectPanel.Anchor>Open</SelectPanel.Anchor>
      <SelectPanel.Overlay>
        <SelectPanel.Header>
          <SelectPanel.Title>Switch ref</SelectPanel.Title>
          <SelectPanel.Input aria-label="Filter" />
        </SelectPanel.Header>
        <Tabs value={active} onValueChange={({value}) => setActive(value)}>
          <RefTabList aria-label="Ref type">
            <RefTab value="branches" count={2}>
              Branches
            </RefTab>
            <RefTab value="tags" count={2}>
              Tags
            </RefTab>
          </RefTabList>
          <RefTabPanel value={active}>
            <SelectPanel.List aria-label="Results">
              {items.map(name => (
                <SelectPanel.Option key={name} id={`opt-${name}`}>
                  {name}
                </SelectPanel.Option>
              ))}
            </SelectPanel.List>
          </RefTabPanel>
        </Tabs>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}

describe('SelectPanel Parts', () => {
  it('renders stable data-component selectors', () => {
    render(<Example />)
    expect(document.querySelector('[data-component="SelectPanel"]')).toBeInTheDocument()
    expect(document.querySelector('[data-component="SelectPanel.Anchor"]')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    for (const part of [
      'SelectPanel.Overlay',
      'SelectPanel.Header',
      'SelectPanel.Title',
      'SelectPanel.List',
      'SelectPanel.Option',
    ]) {
      expect(document.querySelector(`[data-component="${part}"]`)).toBeInTheDocument()
    }
    // The search input reuses Primer's TextInput; its combobox role is the stable selector.
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('composes the Tabs primitive: a tablist and listbox scoped inside the role=dialog popup', () => {
    render(<Example />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('tablist')).toBeInTheDocument()
    expect(within(dialog).getAllByRole('tab')).toHaveLength(2)
    expect(within(dialog).getByRole('tabpanel')).toBeInTheDocument()
    expect(within(dialog).getByRole('listbox')).toBeInTheDocument()
  })

  it('anchors the overlay against the trigger (inline top/left applied)', () => {
    render(<Example />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    const dialog = screen.getByRole('dialog')
    // useAnchoredPosition writes absolute coordinates as inline styles.
    expect(getComputedStyle(dialog).position).toBe('absolute')
    expect(dialog.style.top).not.toBe('')
    expect(dialog.style.left).not.toBe('')
  })

  it('switches the active list when a tab is selected', () => {
    render(<Example />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    expect(screen.getByText('main')).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole('tab', {name: /Tags/}))
    expect(screen.getByText('v1.0')).toBeInTheDocument()
    expect(screen.queryByText('main')).not.toBeInTheDocument()
  })

  it('the single tabpanel re-labels itself as the active tab changes', () => {
    render(<Example />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    const branchesTab = screen.getByRole('tab', {name: /Branches/})
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', branchesTab.id)

    fireEvent.mouseDown(screen.getByRole('tab', {name: /Tags/}))
    const tagsTab = screen.getByRole('tab', {name: /Tags/})
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', tagsTab.id)
  })
})

describe('SelectPanel headline story (MultiSelectAcrossTabs)', () => {
  it('persists one selection model across both tabs', () => {
    const Demo = MultiSelectAcrossTabs.render as ComponentType
    render(<Demo />)

    fireEvent.click(screen.getByRole('button', {name: /Refs selected/}))

    const list = () => screen.getByRole('listbox')

    // Select a branch.
    fireEvent.click(within(list()).getByText('main'))
    expect(within(list()).getByText('main').closest('[role="option"]')).toHaveAttribute('aria-selected', 'true')

    // Switch to Tags and select a tag — the branch selection must survive.
    fireEvent.mouseDown(screen.getByRole('tab', {name: /Tags/}))
    fireEvent.click(within(list()).getByText('v1.0.0'))
    expect(within(list()).getByText('v1.0.0').closest('[role="option"]')).toHaveAttribute('aria-selected', 'true')

    // The anchor reflects the combined count from both tabs.
    expect(screen.getByRole('button', {name: /Refs selected: 2/})).toBeInTheDocument()

    // Back on Branches, the earlier selection is still checked.
    fireEvent.mouseDown(screen.getByRole('tab', {name: /Branches/}))
    expect(within(list()).getByText('main').closest('[role="option"]')).toHaveAttribute('aria-selected', 'true')
  })
})
