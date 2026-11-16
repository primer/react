import React from 'react'
import {createRoot} from 'react-dom/client'
import {DirectionProvider} from '@base-ui/react/direction-provider'
import {ActionList} from '../src/components/ActionList'
import {ActionMenu} from '../src/components/ActionMenu'
import {SelectPanel} from '../src/components/SelectPanel'

const reason = 'Unavailable due to an outage'
const label = 'RepositoryNameThatNeedsToWrap'
const description = 'Owned by an organization with additional review requirements'
const trailing = 'EnterprisePolicyBlocksThisRepositoryWithoutAnySpaces'

function Icon({testId}: {testId?: string}) {
  return (
    <svg aria-hidden="true" data-testid={testId} width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6" fill="currentColor" />
    </svg>
  )
}

export function Fixture() {
  const [inactive, setInactive] = React.useState(true)
  const [action, setAction] = React.useState('')
  const inactiveText = inactive ? reason : undefined
  const trailingVisual = <span data-testid="picker-trailing">{trailing}</span>

  return (
    <div style={{width: 'min(100%, 240px)'}}>
      <ActionMenu>
        <ActionMenu.Button>Open actions</ActionMenu.Button>
        <ActionMenu.Content aria-label="Actions" width="auto">
          <ActionMenu.Item inactiveText={inactiveText} onClick={() => setAction('menu')}>
            <ActionMenu.LeadingVisual>
              <Icon />
            </ActionMenu.LeadingVisual>
            Workflows
            <ActionMenu.TrailingVisual>
              <Icon testId="menu-trailing-icon" />
            </ActionMenu.TrailingVisual>
          </ActionMenu.Item>
          <ActionMenu.Item>Another action</ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
      <ActionList aria-label="Repositories">
        <ActionList.Item data-testid="list-item" inactiveText={inactiveText} onSelect={() => setAction('list')}>
          <ActionList.LeadingVisual>
            <Icon />
          </ActionList.LeadingVisual>
          {label}
          <ActionList.Description variant="block">{description}</ActionList.Description>
          <ActionList.TrailingVisual>
            <span data-testid="list-trailing">{trailing}</span>
          </ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>
      <SelectPanel
        disableFullscreenOnNarrow
        items={[
          {
            id: 'repository',
            text: label,
            description,
            descriptionVariant: 'block',
            inactiveText,
            trailingVisual,
          },
        ]}
        onSelectedChange={() => setAction('picker')}
        placeholder="Open picker"
        selected={undefined}
        title="Pick a repository"
        width="small"
      />
      <button onClick={() => setInactive(value => !value)} type="button">
        {inactive ? 'Make available' : 'Make inactive'}
      </button>
      <output data-testid="action-result">{action}</output>
    </div>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Inactive item layout fixture root not found')
  const direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr'
  createRoot(root).render(
    <DirectionProvider direction={direction}>
      <Fixture />
    </DirectionProvider>,
  )
}

mountFixture()
