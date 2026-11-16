import React from 'react'
import {createRoot} from 'react-dom/client'
import {ActionList} from '../src/components/ActionList'
import {ActionMenu} from '../src/components/ActionMenu'
import {FilteredActionList, type FilteredActionListItem} from '../src/components/FilteredActionList'
import {NavList} from '../src/components/NavList'
import {SelectPanel} from '../src/components/SelectPanel'

const longTrailingText = 'EnterprisePolicyBlocksThisRepositoryWithoutAnySpaces'
const longDescription = 'Owned by an organization with additional review requirements'
const longLabel = 'LongRepositoryNameWithoutAnySpacesThatNeedsToWrap'

function trailingText() {
  return <span data-testid="long-trailing">{longTrailingText}</span>
}

function WrappedDescription({id, truncate}: {id?: string; truncate?: boolean}) {
  return (
    // eslint-disable-next-line primer-react/direct-slot-children -- The wrapper is supplied through the description region.
    <ActionList.Description id={id} truncate={truncate}>
      {longDescription}
    </ActionList.Description>
  )
}

const recoveryItems = Array.from({length: 80}, (_, index) => ({
  id: `recovery-${index}`,
  text: `Repository ${index}`,
  trailingVisual: 'StatusReady',
}))
const replacementItems = Array.from({length: 80}, (_, index) => ({
  id: `replacement-${index}`,
  text: `Repository ${index}`,
  trailingVisual: trailingText(),
}))
let visualLoaded = false
const visualSubscribers = new Set<() => void>()

function subscribeToVisual(callback: () => void) {
  visualSubscribers.add(callback)
  return () => visualSubscribers.delete(callback)
}

function DelayedVisual() {
  const loaded = React.useSyncExternalStore(
    subscribeToVisual,
    () => visualLoaded,
    () => false,
  )
  return (
    <span data-testid="delayed-visual">
      <span data-testid="long-trailing">{loaded ? longTrailingText : 'OK'}</span>
    </span>
  )
}

const delayedItems = Array.from({length: 80}, (_, index) => ({
  id: `delayed-${index}`,
  text: `Repository ${index}`,
  trailingVisual: index === 0 ? <DelayedVisual /> : 'OK',
}))
const oversizedItems = [
  {
    id: 'oversized',
    text: 'Repository',
    description: 'Additional review requirements and repository ownership details. '.repeat(24),
  },
]

function VirtualRecoveryFixture() {
  const [virtualized, setVirtualized] = React.useState(true)
  const [items, setItems] = React.useState<FilteredActionListItem[]>(recoveryItems)
  return (
    <>
      <FilteredActionList
        data-testid="recovery-filtered"
        items={items}
        style={{height: 160, width: 96}}
        virtualized={virtualized}
      />
      <button data-testid="toggle-virtualization" onClick={() => setVirtualized(value => !value)} type="button">
        Toggle virtualization
      </button>
      <button
        data-testid="replace-items"
        onClick={() => setItems(value => (value === recoveryItems ? replacementItems : recoveryItems))}
        type="button"
      >
        Replace items
      </button>
    </>
  )
}

export function Fixture() {
  const [action, setAction] = React.useState('')
  const [selected, setSelected] = React.useState('')
  const item = {id: 'repository', text: 'Primer React', description: longDescription, trailingVisual: trailingText()}
  const virtualItems = Array.from({length: 30}, (_, index) => ({
    id: `virtual-${index}`,
    text: `Virtual repository ${index}`,
    trailingVisual: trailingText(),
  }))
  const resizableItems = Array.from({length: 80}, (_, index) => ({
    id: `resize-${index}`,
    text: `Repository ${index}`,
    trailingVisual: <span data-testid="long-trailing">StatusReady</span>,
  }))
  const lateItems = Array.from({length: 80}, (_, index) => ({
    id: `late-${index}`,
    text: `Item ${index}`,
    trailingVisual: index < 30 ? 'OK' : trailingText(),
  }))

  return (
    <div style={{width: 'min(100%, 272px)'}}>
      <ActionList aria-label="Layout examples">
        <ActionList.Item
          role="listitem"
          data-testid="static-row"
          description={longDescription}
          trailingVisual={trailingText()}
        >
          Primer React
        </ActionList.Item>
        <ActionList.Item data-testid="action-row" onSelect={() => setAction('action')}>
          Primer React
          <ActionList.Description>{longDescription}</ActionList.Description>
          <ActionList.TrailingVisual>{trailingText()}</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item data-testid="block-row">
          {longLabel}
          <ActionList.Description variant="block">{longDescription}</ActionList.Description>
          <ActionList.TrailingVisual>{trailingText()}</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item data-testid="truncated-row">
          Primer React
          <ActionList.Description truncate>{longDescription}</ActionList.Description>
          <ActionList.TrailingVisual>
            <span data-testid="short-trailing">42</span>
          </ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item
          data-testid="wrapped-truncated-row"
          description={<WrappedDescription truncate />}
          trailingVisual={<span data-testid="short-trailing">42</span>}
        >
          Primer React
        </ActionList.Item>
        <ActionList.Item data-testid="short-row">
          Copy
          <ActionList.TrailingVisual>
            <span data-testid="short-trailing">42</span>
          </ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>
      <NavList aria-label="Layout navigation">
        <NavList.Item data-testid="nav-row" href="#repository">
          Primer React
          <NavList.Description>{longDescription}</NavList.Description>
          <NavList.TrailingVisual>{trailingText()}</NavList.TrailingVisual>
        </NavList.Item>
        <NavList.Item data-testid="nav-leading-row" href="#leading">
          <NavList.LeadingVisual aria-hidden="true">O</NavList.LeadingVisual>
          Primer React
          <NavList.Description>{longDescription}</NavList.Description>
          <NavList.TrailingVisual>{trailingText()}</NavList.TrailingVisual>
        </NavList.Item>
        <NavList.Item data-testid="nav-short-row" href="#short">
          Copy
          <NavList.TrailingVisual>
            <span data-testid="short-trailing">42</span>
          </NavList.TrailingVisual>
        </NavList.Item>
      </NavList>
      <FilteredActionList
        data-testid="regular-filtered"
        items={[item]}
        onSelectedChange={ids => setSelected(`filtered:${ids[0]}`)}
        selectionVariant="single"
      />
      <FilteredActionList data-testid="virtual-filtered" items={virtualItems} style={{height: 160}} virtualized />
      <FilteredActionList data-testid="resizable-filtered" items={resizableItems} style={{height: 160}} virtualized />
      <FilteredActionList
        data-testid="late-filtered"
        items={lateItems}
        onSelectedChange={ids => setSelected(`late:${ids[0]}`)}
        selectionVariant="single"
        style={{height: 160}}
        virtualized
      />
      <VirtualRecoveryFixture />
      <FilteredActionList data-testid="delayed-filtered" items={delayedItems} style={{height: 160}} virtualized />
      <FilteredActionList data-testid="oversized-filtered" items={oversizedItems} style={{height: 160}} />
      <button
        data-testid="load-visual"
        onClick={() => {
          visualLoaded = true
          for (const subscriber of visualSubscribers) subscriber()
        }}
        type="button"
      >
        Load trailing visual
      </button>
      <ActionMenu>
        <ActionMenu.Button>Open layout menu</ActionMenu.Button>
        <ActionMenu.Content width="small">
          <ActionMenu.Item data-testid="menu-row" onClick={() => setAction('menu')}>
            Primer React
            <ActionMenu.Description>{longDescription}</ActionMenu.Description>
            <ActionMenu.TrailingVisual>{trailingText()}</ActionMenu.TrailingVisual>
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
      <SelectPanel
        disableFullscreenOnNarrow
        items={[item]}
        onSelectedChange={value => {
          if (value && !Array.isArray(value)) setSelected(`picker:${value.id}`)
        }}
        placeholder="Open layout picker"
        selected={undefined}
        title="Pick a repository"
        width="small"
      />
      <output data-testid="action-result">{action}</output>
      <output data-testid="selection-result">{selected}</output>
    </div>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('ActionList layout fixture root not found')
  createRoot(root).render(<Fixture />)
}

mountFixture()
