import React from 'react'
import {createRoot} from 'react-dom/client'
import {SearchIcon} from '@primer/octicons-react'
import {Blankslate} from '../src/components/Blankslate'
import {Button} from '../src/components/Button'
import {Dialog} from '../src/components/Dialog'
import {FilteredActionList} from '../src/components/FilteredActionList'

const longName = 'security-managers-and-compliance-reviewers-for-organization-projects-and-enterprise-audit-workflows'
const stressName = `${longName}-${'team-name-'.repeat(15)}`

export function Fixture({
  distinctPlaceholder,
  emptyState,
  fullscreen,
  removePadding,
  sharedLabels,
  stress,
}: {
  distinctPlaceholder: boolean
  emptyState?: 'dynamic' | 'embedded' | 'sibling'
  fullscreen: boolean
  removePadding: boolean
  sharedLabels: boolean
  stress: boolean
}) {
  const [selected, setSelected] = React.useState(false)
  const position = fullscreen ? ({narrow: 'fullscreen', regular: 'center'} as const) : 'center'
  const blankslate = (
    <Blankslate spacious>
      <Blankslate.Heading>No teams found</Blankslate.Heading>
      <Blankslate.Description>Try another search or add a security manager team.</Blankslate.Description>
    </Blankslate>
  )
  return (
    <Dialog.Root open>
      <Dialog.Content height="small" position={position} width="large">
        <Dialog.Header>
          <Dialog.Title>Assign security manager role</Dialog.Title>
          <Dialog.CloseButton />
        </Dialog.Header>
        <Dialog.Body className={removePadding ? 'Dialog_Body p-0' : 'Dialog_Body'}>
          <div className="Box d-flex flex-column">
            <FilteredActionList
              actionListProps={sharedLabels ? undefined : {'aria-label': 'Select teams'}}
              aria-label="Search for teams"
              className={emptyState === 'sibling' ? 'Empty_Picker' : undefined}
              emptyStateText={
                emptyState === 'sibling'
                  ? null
                  : emptyState === 'embedded'
                    ? blankslate
                    : emptyState === 'dynamic'
                      ? 'No matching teams'
                      : undefined
              }
              items={
                emptyState && emptyState !== 'dynamic'
                  ? []
                  : [{id: 'security-team', text: stress ? stressName : longName, selected}]
              }
              onSelectedChange={ids => setSelected(ids.length > 0)}
              placeholderText={distinctPlaceholder ? 'Filter by team' : 'Search for teams'}
              selectionVariant="multiple"
              textInputProps={{leadingVisual: SearchIcon, style: {margin: '8px'}}}
            />
            {emptyState === 'sibling' ? blankslate : null}
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button>Cancel</Button>
          <Button variant="primary">Next</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

function mountFixture() {
  const root = document.getElementById('root')
  if (!root) throw new Error('Expected the dialog fixture root')
  const params = new URLSearchParams(window.location.search)
  const emptyState = params.get('empty')
  createRoot(root).render(
    <Fixture
      distinctPlaceholder={params.get('placeholder') === 'distinct'}
      emptyState={
        emptyState === 'embedded' || emptyState === 'sibling' || emptyState === 'dynamic' ? emptyState : undefined
      }
      fullscreen={params.get('position') === 'fullscreen'}
      removePadding={params.get('padding') === 'zero'}
      sharedLabels={params.get('labels') === 'shared'}
      stress={params.get('name') === 'stress'}
    />,
  )
}

mountFixture()
