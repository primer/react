import React from 'react'
import {SelectPanel} from '../SelectPanel'
import {ActionList, ActionMenu, Avatar, Box, Button, Flash} from '../../../index'
import {ArrowRightIcon, AlertIcon, EyeIcon, GitBranchIcon, TriangleDownIcon, GearIcon} from '@primer/octicons-react'
import data from './mock-data'

export default {
  title: 'Drafts/Components/SelectPanel/Examples',
  component: SelectPanel,
}

const getCircle = (color: string) => (
  <Box sx={{width: 14, height: 14, borderRadius: '100%'}} style={{backgroundColor: `#${color}`}} />
)

export const Minimal = () => {
  const initialSelectedLabels = data.issue.labelIds // mock initial state: has selected labels
  const [selectedLabelIds, setSelectedLabelIds] = React.useState<string[]>(initialSelectedLabels)

  /* Selection */
  const onLabelSelect = (labelId: string) => {
    if (!selectedLabelIds.includes(labelId)) setSelectedLabelIds([...selectedLabelIds, labelId])
    else setSelectedLabelIds(selectedLabelIds.filter(id => id !== labelId))
  }

  const onSubmit = () => {
    data.issue.labelIds = selectedLabelIds // pretending to persist changes

    // eslint-disable-next-line no-console
    console.log('form submitted')
  }

  const sortingFn = (itemA: {id: string}, itemB: {id: string}) => {
    const initialSelectedIds = data.issue.labelIds
    if (initialSelectedIds.includes(itemA.id) && initialSelectedIds.includes(itemB.id)) return 1
    else if (initialSelectedIds.includes(itemA.id)) return -1
    else if (initialSelectedIds.includes(itemB.id)) return 1
    else return 1
  }

  const itemsToShow = data.labels.sort(sortingFn)

  return (
    <>
      <h1>Minimal SelectPanel</h1>

      <SelectPanel title="Select labels" onSubmit={onSubmit}>
        <SelectPanel.Button>Assign label</SelectPanel.Button>

        <ActionList>
          {itemsToShow.map(label => (
            <ActionList.Item
              key={label.id}
              onSelect={() => onLabelSelect(label.id)}
              selected={selectedLabelIds.includes(label.id)}
            >
              <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
              {label.name}
              <ActionList.Description variant="block">{label.description}</ActionList.Description>
            </ActionList.Item>
          ))}
        </ActionList>
        <SelectPanel.Footer />
      </SelectPanel>
    </>
  )
}

export const WithGroups = () => {
  /* Selection */
  const initialAssigneeIds = data.issue.assigneeIds // mock initial state
  const [selectedAssigneeIds, setSelectedAssigneeIds] = React.useState<string[]>(initialAssigneeIds)

  const onCollaboratorSelect = (colloratorId: string) => {
    if (!selectedAssigneeIds.includes(colloratorId)) setSelectedAssigneeIds([...selectedAssigneeIds, colloratorId])
    else setSelectedAssigneeIds(selectedAssigneeIds.filter(id => id !== colloratorId))
  }

  const onClearSelection = () => setSelectedAssigneeIds([])
  const onSubmit = () => {
    data.issue.assigneeIds = selectedAssigneeIds // pretending to persist changes
  }

  /* Filtering */
  const [filteredUsers, setFilteredUsers] = React.useState(data.collaborators)
  const [query, setQuery] = React.useState('')

  const onSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const query = event.currentTarget.value
    setQuery(query)

    if (query === '') setFilteredUsers(data.collaborators)
    else {
      setFilteredUsers(
        data.collaborators
          .map(collaborator => {
            if (collaborator.login.toLowerCase().startsWith(query)) return {priority: 1, collaborator}
            else if (collaborator.name.startsWith(query)) return {priority: 2, collaborator}
            else if (collaborator.login.toLowerCase().includes(query)) return {priority: 3, collaborator}
            else if (collaborator.name.toLowerCase().includes(query)) return {priority: 4, collaborator}
            else return {priority: -1, collaborator}
          })
          .filter(result => result.priority > 0)
          .map(result => result.collaborator),
      )
    }
  }

  const sortingFn = (itemA: {id: string}, itemB: {id: string}) => {
    const initialSelectedIds = data.issue.assigneeIds
    if (initialSelectedIds.includes(itemA.id) && initialSelectedIds.includes(itemB.id)) return 1
    else if (initialSelectedIds.includes(itemA.id)) return -1
    else if (initialSelectedIds.includes(itemB.id)) return 1
    else return 1
  }

  const itemsToShow = query ? filteredUsers : data.collaborators.sort(sortingFn)

  return (
    <>
      <h1>SelectPanel with groups</h1>

      <SelectPanel title="Request up to 100 reviewers" onSubmit={onSubmit} onClearSelection={onClearSelection}>
        <SelectPanel.Button
          variant="invisible"
          trailingAction={GearIcon}
          sx={{width: '200px', '[data-component=buttonContent]': {justifyContent: 'start'}}}
        >
          Reviewers
        </SelectPanel.Button>
        <SelectPanel.Header>
          <SelectPanel.SearchInput onChange={onSearchInputChange} />
        </SelectPanel.Header>

        {itemsToShow.length === 0 ? (
          <SelectPanel.Message variant="empty" title={`No labels found for "${query}"`}>
            Try a different search term
          </SelectPanel.Message>
        ) : (
          <ActionList>
            <ActionList.Group>
              <ActionList.GroupHeading variant="filled">Suggestions</ActionList.GroupHeading>
              {itemsToShow
                .filter(collaborator => collaborator.recommended)
                .map(collaborator => (
                  <ActionList.Item
                    key={collaborator.id}
                    onSelect={() => onCollaboratorSelect(collaborator.id)}
                    selected={selectedAssigneeIds.includes(collaborator.id)}
                  >
                    <ActionList.LeadingVisual>
                      <Avatar src={`https://github.com/${collaborator.login}.png`} />
                    </ActionList.LeadingVisual>
                    {collaborator.login}
                    <ActionList.Description>{collaborator.login}</ActionList.Description>
                  </ActionList.Item>
                ))}
            </ActionList.Group>
            <ActionList.Group>
              <ActionList.GroupHeading variant="filled">Everyone else</ActionList.GroupHeading>
              {itemsToShow
                .filter(collaborator => !collaborator.recommended)
                .map(collaborator => (
                  <ActionList.Item
                    key={collaborator.id}
                    onSelect={() => onCollaboratorSelect(collaborator.id)}
                    selected={selectedAssigneeIds.includes(collaborator.id)}
                  >
                    <ActionList.LeadingVisual>
                      <Avatar src={`https://github.com/${collaborator.login}.png`} />
                    </ActionList.LeadingVisual>
                    {collaborator.login}
                    <ActionList.Description>{collaborator.login}</ActionList.Description>
                  </ActionList.Item>
                ))}
            </ActionList.Group>
          </ActionList>
        )}

        <SelectPanel.Footer />
      </SelectPanel>
    </>
  )
}

export const AsyncWithSuspendedList = () => {
  const [query, setQuery] = React.useState('')

  const onSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const query = event.currentTarget.value
    setQuery(query)
  }

  return (
    <>
      <h1>Async: Suspended list</h1>
      <p>Fetching items once when the panel is opened (like repo labels)</p>
      <SelectPanel title="Select labels">
        <SelectPanel.Button>Assign label</SelectPanel.Button>

        <SelectPanel.Header>
          <SelectPanel.SearchInput onChange={onSearchInputChange} />
        </SelectPanel.Header>

        <React.Suspense fallback={<SelectPanel.Loading>Fetching labels...</SelectPanel.Loading>}>
          <SuspendedActionList query={query} />
          <SelectPanel.Footer>
            <SelectPanel.SecondaryButton>Edit labels</SelectPanel.SecondaryButton>
          </SelectPanel.Footer>
        </React.Suspense>
      </SelectPanel>
    </>
  )
}

const SuspendedActionList: React.FC<{query: string}> = ({query}) => {
  const fetchedData: typeof data = use(getData({key: 'suspended-action-list'}))

  /* Selection */
  const initialSelectedLabels: string[] = fetchedData.issue.labelIds
  const [selectedLabelIds, setSelectedLabelIds] = React.useState<string[]>(initialSelectedLabels)

  const onLabelSelect = (labelId: string) => {
    if (!selectedLabelIds.includes(labelId)) setSelectedLabelIds([...selectedLabelIds, labelId])
    else setSelectedLabelIds(selectedLabelIds.filter(id => id !== labelId))
  }

  /* Filtering */
  const filteredLabels = fetchedData.labels
    .map(label => {
      if (label.name.toLowerCase().startsWith(query)) return {priority: 1, label}
      else if (label.name.toLowerCase().includes(query)) return {priority: 2, label}
      else if (label.description?.toLowerCase().includes(query)) return {priority: 3, label}
      else return {priority: -1, label}
    })
    .filter(result => result.priority > 0)
    .map(result => result.label)

  const sortingFn = (itemA: {id: string}, itemB: {id: string}) => {
    const initialSelectedIds = data.issue.labelIds
    if (initialSelectedIds.includes(itemA.id) && initialSelectedIds.includes(itemB.id)) return 1
    else if (initialSelectedIds.includes(itemA.id)) return -1
    else if (initialSelectedIds.includes(itemB.id)) return 1
    else return 1
  }

  const itemsToShow = query ? filteredLabels : data.labels.sort(sortingFn)

  return itemsToShow.length === 0 ? (
    <SelectPanel.Message variant="empty" title={`No labels found for "${query}"`}>
      Try a different search term
    </SelectPanel.Message>
  ) : (
    <ActionList>
      {itemsToShow.map(label => (
        <ActionList.Item
          key={label.id}
          onSelect={() => onLabelSelect(label.id)}
          selected={selectedLabelIds.includes(label.id)}
        >
          <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
          {label.name}
          <ActionList.Description variant="block">{label.description}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

/* 
  `data` is already pre-fetched with the issue 
  `users` are fetched async on search
*/
const SearchableUserList: React.FC<{
  query: string
  showLoading?: boolean
  initialAssigneeIds: string[]
  selectedUserIds: string[]
  onUserSelect: (id: string) => void
}> = ({query, showLoading = false, initialAssigneeIds, selectedUserIds, onUserSelect}) => {
  const repository = {collaborators: data.collaborators}

  /* Filtering */
  const filteredUsers: typeof data.users = query ? use(queryUsers({query})) : []

  if (showLoading) return <SelectPanel.Loading>Search for users...</SelectPanel.Loading>

  const sortingFn = (itemA: {id: string}, itemB: {id: string}) => {
    if (initialAssigneeIds.includes(itemA.id) && initialAssigneeIds.includes(itemB.id)) return 1
    else if (initialAssigneeIds.includes(itemA.id)) return -1
    else if (initialAssigneeIds.includes(itemB.id)) return 1
    else return 1
  }
  const itemsToShow = query ? filteredUsers : repository.collaborators.sort(sortingFn)

  return itemsToShow.length === 0 ? (
    <SelectPanel.Message variant="empty" title={`No users found for "${query}"`}>
      Try a different search term
    </SelectPanel.Message>
  ) : (
    <ActionList>
      {itemsToShow.map(user => (
        <ActionList.Item
          key={user.id}
          onSelect={() => onUserSelect(user.id)}
          selected={selectedUserIds.includes(user.id)}
        >
          <ActionList.LeadingVisual>
            <Avatar src={`https://github.com/${user.login}.png`} />
          </ActionList.LeadingVisual>
          {user.login}
          <ActionList.Description>{user.name}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

/* 
  `data` is already pre-fetched with the issue 
  `users` are fetched async on search
*/
export const AsyncSearchWithUseTransition = () => {
  const [isPending, startTransition] = React.useTransition()

  const [query, setQuery] = React.useState('')
  const onSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const query = event.currentTarget.value
    startTransition(() => setQuery(query))
  }

  /* Selection */
  const initialAssigneeIds: string[] = data.issue.assigneeIds
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>(initialAssigneeIds)
  const onUserSelect = (userId: string) => {
    if (!selectedUserIds.includes(userId)) setSelectedUserIds([...selectedUserIds, userId])
    else setSelectedUserIds(selectedUserIds.filter(id => id !== userId))
  }

  const onSubmit = () => {
    data.issue.assigneeIds = selectedUserIds // pretending to persist changes
    // eslint-disable-next-line no-console
    console.log('form submitted')
  }

  return (
    <>
      <h1>Async: search with useTransition</h1>
      <p>Fetching items on every keystroke search (like github users)</p>

      <SelectPanel title="Select collaborators" onSubmit={onSubmit}>
        <SelectPanel.Button>Select assignees</SelectPanel.Button>
        <SelectPanel.Header>
          <SelectPanel.SearchInput loading={isPending} onChange={onSearchInputChange} />
        </SelectPanel.Header>

        <SearchableUserList
          query={query}
          initialAssigneeIds={initialAssigneeIds}
          selectedUserIds={selectedUserIds}
          onUserSelect={onUserSelect}
        />
        <SelectPanel.Footer />
      </SelectPanel>
    </>
  )
}

export const OpenFromMenu = () => {
  /* Open state */
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [selectPanelOpen, setSelectPanelOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  /* Selection */
  const [selectedSetting, setSelectedSetting] = React.useState<string>('All activity')
  const [selectedEvents, setSelectedEvents] = React.useState<string[]>([])

  const onEventSelect = (event: string) => {
    if (!selectedEvents.includes(event)) setSelectedEvents([...selectedEvents, event])
    else setSelectedEvents(selectedEvents.filter(name => name !== event))
  }

  const onSelectPanelSubmit = () => {
    setSelectedSetting('Custom')
  }

  const itemsToShow = ['Issues', 'Pull requests', 'Releases', 'Discussions', 'Security alerts']

  return (
    <>
      <h1>Open from ActionMenu</h1>
      <Flash variant="danger">
        <AlertIcon />
        This implementation will most likely change.{' '}
        <a href="https://github.com/github/primer/discussions/2614#discussioncomment-6879407">
          See decision log for more details.
        </a>
      </Flash>
      <p>
        To open SelectPanel from a menu, you would need to use an external anchor and pass `anchorRef` to `SelectPanel`.
        You would also need to control the `open` state for both ActionMenu and SelectPanel.
        <br />
        <br />
        Important: Pass the same `anchorRef` to both ActionMenu and SelectPanel
      </p>

      <Button
        ref={buttonRef}
        leadingVisual={EyeIcon}
        trailingAction={TriangleDownIcon}
        aria-haspopup
        aria-expanded={menuOpen || selectPanelOpen ? true : undefined}
        onClick={() => {
          if (menuOpen) setMenuOpen(false)
          else if (selectPanelOpen) setSelectPanelOpen(false)
          else setMenuOpen(true)
        }}
      >
        {selectedSetting === 'Ignore' ? 'Watch' : 'Unwatch'}
      </Button>
      <ActionMenu anchorRef={buttonRef} open={menuOpen} onOpenChange={value => setMenuOpen(value)}>
        <ActionMenu.Overlay width="medium">
          <ActionList selectionVariant="single">
            <ActionList.Item
              selected={selectedSetting === 'Participating and @mentions'}
              onSelect={() => setSelectedSetting('Participating and @mentions')}
            >
              Participating and @mentions
              <ActionList.Description variant="block">
                Only receive notifications from this repository when participating or @mentioned.
              </ActionList.Description>
            </ActionList.Item>
            <ActionList.Item
              selected={selectedSetting === 'All activity'}
              onSelect={() => setSelectedSetting('All activity')}
            >
              All activity
              <ActionList.Description variant="block">
                Notified of all notifications on this repository.
              </ActionList.Description>
            </ActionList.Item>
            <ActionList.Item selected={selectedSetting === 'Ignore'} onSelect={() => setSelectedSetting('Ignore')}>
              Ignore
              <ActionList.Description variant="block">Never be notified.</ActionList.Description>
            </ActionList.Item>
            <ActionList.Item selected={selectedSetting === 'Custom'} onSelect={() => setSelectPanelOpen(true)}>
              Custom
              <ActionList.TrailingVisual>
                <ArrowRightIcon />
              </ActionList.TrailingVisual>
              <ActionList.Description variant="block">
                Select events you want to be notified of in addition to participating and @mentions.
              </ActionList.Description>
            </ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>

      <SelectPanel
        title="Custom"
        open={selectPanelOpen}
        anchorRef={buttonRef}
        onSubmit={() => {
          setSelectPanelOpen(false)
          onSelectPanelSubmit()
        }}
        onCancel={() => {
          setSelectPanelOpen(false)
          setMenuOpen(true)
        }}
        height="medium"
      >
        <ActionList>
          {itemsToShow.map(item => (
            <ActionList.Item key={item} onSelect={() => onEventSelect(item)} selected={selectedEvents.includes(item)}>
              {item}
            </ActionList.Item>
          ))}
        </ActionList>
        <SelectPanel.Footer />
      </SelectPanel>
    </>
  )
}

export const WithFilterButtons = () => {
  const [selectedFilter, setSelectedFilter] = React.useState<'branches' | 'tags'>('branches')

  /* Selection */
  const [savedInitialRef, setSavedInitialRef] = React.useState(data.ref)
  const [selectedRef, setSelectedRef] = React.useState(savedInitialRef)

  const onSubmit = () => {
    setSavedInitialRef(selectedRef)
    data.ref = selectedRef // pretending to persist changes

    // eslint-disable-next-line no-console
    console.log('form submitted')
  }

  /* Filter */
  const [query, setQuery] = React.useState('')
  const onSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const query = event.currentTarget.value
    setQuery(query)
  }

  const [filteredRefs, setFilteredRefs] = React.useState(data.branches)
  const setSearchResults = (query: string, selectedFilter: 'branches' | 'tags') => {
    if (query === '') setFilteredRefs(data[selectedFilter])
    else {
      setFilteredRefs(
        data[selectedFilter]
          .map(item => {
            if (item.name.toLowerCase().startsWith(query)) return {priority: 1, item}
            else if (item.name.toLowerCase().includes(query)) return {priority: 2, item}
            else return {priority: -1, item}
          })
          .filter(result => result.priority > 0)
          .map(result => result.item),
      )
    }
  }

  React.useEffect(
    function updateSearchResults() {
      setSearchResults(query, selectedFilter)
    },
    [query, selectedFilter],
  )

  const sortingFn = (ref: {id: string}) => {
    if (ref.id === savedInitialRef) return -1
    else return 1
  }

  const itemsToShow = query ? filteredRefs : data[selectedFilter].sort(sortingFn)

  return (
    <>
      <h1>With Filter Buttons</h1>

      <SelectPanel title="Switch branches/tags" onSubmit={onSubmit}>
        <SelectPanel.Button leadingVisual={GitBranchIcon} trailingVisual={TriangleDownIcon}>
          {savedInitialRef}
        </SelectPanel.Button>

        <SelectPanel.Header>
          <SelectPanel.SearchInput onChange={onSearchInputChange} />

          <Box id="filters" sx={{display: 'flex', marginTop: 1}}>
            <Button
              variant="invisible"
              sx={{fontWeight: selectedFilter === 'branches' ? 'semibold' : 'normal', color: 'fg.default'}}
              onClick={() => setSelectedFilter('branches')}
              count={20}
            >
              Branches
            </Button>
            <Button
              variant="invisible"
              sx={{fontWeight: selectedFilter === 'tags' ? 'semibold' : 'normal', color: 'fg.default'}}
              onClick={() => setSelectedFilter('tags')}
              count={8}
            >
              Tags
            </Button>
          </Box>
        </SelectPanel.Header>

        {itemsToShow.length === 0 ? (
          <SelectPanel.Message variant="empty" title={`No labels found for "${query}"`}>
            Try a different search term
          </SelectPanel.Message>
        ) : (
          <ActionList selectionVariant="single">
            {itemsToShow.map(item => (
              <ActionList.Item
                key={item.id}
                selected={selectedRef === item.id}
                onSelect={() => setSelectedRef(item.id)}
              >
                {item.name}
                <ActionList.TrailingVisual>{item.trailingInfo}</ActionList.TrailingVisual>
              </ActionList.Item>
            ))}
          </ActionList>
        )}

        <SelectPanel.Footer>
          {/* @ts-ignore TODO as prop is not identified by button? */}
          <SelectPanel.SecondaryButton as="a" href={`/${selectedFilter}`}>
            View all {selectedFilter}
          </SelectPanel.SecondaryButton>
        </SelectPanel.Footer>
      </SelectPanel>
    </>
  )
}

export const CustomHeight = () => {
  const initialSelectedLabels = data.issue.labelIds // mock initial state: has selected labels
  const [selectedLabelIds, setSelectedLabelIds] = React.useState<string[]>(initialSelectedLabels)

  /* Selection */
  const onLabelSelect = (labelId: string) => {
    if (!selectedLabelIds.includes(labelId)) setSelectedLabelIds([...selectedLabelIds, labelId])
    else setSelectedLabelIds(selectedLabelIds.filter(id => id !== labelId))
  }

  const onSubmit = () => {
    data.issue.labelIds = selectedLabelIds // pretending to persist changes

    // eslint-disable-next-line no-console
    console.log('form submitted')
  }

  const sortingFn = (itemA: {id: string}, itemB: {id: string}) => {
    const initialSelectedIds = data.issue.labelIds
    if (initialSelectedIds.includes(itemA.id) && initialSelectedIds.includes(itemB.id)) return 1
    else if (initialSelectedIds.includes(itemA.id)) return -1
    else if (initialSelectedIds.includes(itemB.id)) return 1
    else return 1
  }

  const itemsToShow = data.labels.sort(sortingFn)

  return (
    <>
      <h1>Custom height SelectPanel</h1>
      <p>
        Uses <code>height: fit-content</code> to display the full height of the dialog
      </p>
      <SelectPanel title="Select labels" onSubmit={onSubmit} height="fit-content">
        <SelectPanel.Button>Assign label</SelectPanel.Button>

        <ActionList>
          {itemsToShow.slice(0, 10).map(label => (
            <ActionList.Item
              key={label.id}
              onSelect={() => onLabelSelect(label.id)}
              selected={selectedLabelIds.includes(label.id)}
            >
              <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
              {label.name}
              <ActionList.Description variant="block">{label.description}</ActionList.Description>
            </ActionList.Item>
          ))}
        </ActionList>
        <SelectPanel.Footer />
      </SelectPanel>
    </>
  )
}

// ----- Suspense implementation details ----

const cache = new Map()
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getData = ({key = '0', delay = 1000}: {key: string; delay?: number}) => {
  if (!cache.has(key)) cache.set(key, fetchData(delay))
  return cache.get(key)
}
// return a promise!
const fetchData = async (delay: number) => {
  await sleep(delay)
  return data
}

const queryUsers = ({query = '', delay = 500}: {query: string; delay?: number}) => {
  const key = `users-${query}`
  if (!cache.has(key)) cache.set(key, fetchUsers(query, delay))
  return cache.get(key)
}
const fetchUsers = async (query: string, delay: number) => {
  await sleep(delay)
  return data.users.filter(user => {
    return (
      user.login.toLowerCase().includes(query.toLowerCase()) || user.name.toLowerCase().includes(query.toLowerCase())
    )
  })
}

/* lifted from the examples at https://react.dev/reference/react/Suspense */
// @ts-ignore copied from untyped example
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value
  } else if (promise.status === 'rejected') {
    throw promise.reason
  } else if (promise.status === 'pending') {
    throw promise
  } else {
    promise.status = 'pending'

    // eslint-disable-next-line github/no-then
    promise.then(
      (result: Record<string, unknown>) => {
        promise.status = 'fulfilled'
        promise.value = result
      },
      (error: Error) => {
        promise.status = 'rejected'
        promise.reason = error
      },
    )
    throw promise
  }
}
