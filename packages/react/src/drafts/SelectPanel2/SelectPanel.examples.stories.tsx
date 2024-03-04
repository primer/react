import React from 'react'
import {SelectPanel} from './SelectPanel'
import {ActionList, ActionMenu, Avatar, Box, Button, Text} from '../../index'
import {Dialog} from '../../drafts'
import {ArrowRightIcon, EyeIcon, GitBranchIcon, TriangleDownIcon, GearIcon, TagIcon} from '@primer/octicons-react'
import data from './mock-story-data'

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
  const onCancel = () => {
    setSelectedLabelIds(initialSelectedLabels)
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

      <SelectPanel title="Select labels" onSubmit={onSubmit} onCancel={onCancel}>
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
  const onCancel = () => {
    setSelectedAssigneeIds(initialAssigneeIds)
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

      <SelectPanel
        title="Request up to 100 reviewers"
        onSubmit={onSubmit}
        onCancel={onCancel}
        onClearSelection={onClearSelection}
      >
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
      <p>
        Fetching items once when the panel is opened (like repo labels)
        <br />
        Note: Save and Cancel is not implemented in this demo
      </p>

      <SelectPanel title="Select labels">
        <SelectPanel.Button>Assign label</SelectPanel.Button>

        <SelectPanel.Header>
          <SelectPanel.SearchInput onChange={onSearchInputChange} />
        </SelectPanel.Header>

        <React.Suspense fallback={<SelectPanel.Loading>Fetching labels...</SelectPanel.Loading>}>
          <SuspendedActionList query={query} />
          <SelectPanel.Footer>
            <SelectPanel.SecondaryAction variant="link" href="/settings">
              Edit labels
            </SelectPanel.SecondaryAction>
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
  const onCancel = () => {
    setSelectedUserIds(initialAssigneeIds)
  }

  return (
    <>
      <h1>Async: search with useTransition</h1>
      <p>Fetching items on every keystroke search (like github users)</p>

      <SelectPanel title="Select collaborators" onSubmit={onSubmit} onCancel={onCancel}>
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

  /* Selection */
  const [selectedSetting, setSelectedSetting] = React.useState<string>('All activity')
  const initialCustomEvents: string[] = []
  const [selectedCustomEvents, setSelectedCustomEvents] = React.useState<string[]>(initialCustomEvents)

  const onEventSelect = (event: string) => {
    if (!selectedCustomEvents.includes(event)) setSelectedCustomEvents([...selectedCustomEvents, event])
    else setSelectedCustomEvents(selectedCustomEvents.filter(name => name !== event))
  }

  const itemsToShow = ['Issues', 'Pull requests', 'Releases', 'Discussions', 'Security alerts']

  return (
    <>
      <h1>Open in modal from ActionMenu</h1>

      <ActionMenu open={menuOpen} onOpenChange={value => setMenuOpen(value)}>
        <ActionMenu.Button leadingVisual={EyeIcon}>
          {selectedSetting === 'Ignore' ? 'Watch' : 'Unwatch'}
        </ActionMenu.Button>
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
            <ActionList.Item
              selected={selectedSetting === 'Custom'}
              onSelect={() => {
                setMenuOpen(false)
                setSelectPanelOpen(true)
              }}
            >
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
        variant="modal"
        title="Custom"
        open={selectPanelOpen}
        onSubmit={() => {
          setSelectedSetting('Custom')
          setSelectPanelOpen(false)
          setMenuOpen(false)
        }}
        onCancel={() => {
          setSelectedCustomEvents(initialCustomEvents)
          setSelectPanelOpen(false)
          setMenuOpen(true)
        }}
      >
        <ActionList>
          {itemsToShow.map(item => (
            <ActionList.Item
              key={item}
              onSelect={() => onEventSelect(item)}
              selected={selectedCustomEvents.includes(item)}
            >
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
  const onCancel = () => {
    setSelectedRef(savedInitialRef)
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
      <h1>With Filter Buttons {savedInitialRef}</h1>

      <SelectPanel title="Switch branches/tags" onSubmit={onSubmit} onCancel={onCancel}>
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
          <ActionList>
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
          <SelectPanel.SecondaryAction variant="link" href={`/${selectedFilter}`}>
            View all {selectedFilter}
          </SelectPanel.SecondaryAction>
        </SelectPanel.Footer>
      </SelectPanel>
    </>
  )
}

export const ShortSelectPanel = () => {
  const initialChannels = {GitHub: false, Email: false}
  const [channels, setChannels] = React.useState(initialChannels)
  const [onlyFailures, setOnlyFailures] = React.useState(false)

  const onSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('form submitted')
  }
  const onCancel = () => {
    setChannels(initialChannels)
  }

  const toggleChannel = (channel: keyof typeof channels) => {
    setChannels({...channels, [channel]: !channels[channel]})
  }

  const channelsEnabled = channels.GitHub || channels.Email

  return (
    <>
      <h1>Short SelectPanel</h1>
      <p>
        Use <code>height=fit-content</code> to match height of contents
      </p>
      <SelectPanel title="Select notification channels" onSubmit={onSubmit} onCancel={onCancel}>
        <SelectPanel.Button>
          <Text sx={{color: 'fg.muted'}}>Notify me:</Text>{' '}
          {Object.keys(channels)
            .filter(channel => channels[channel as keyof typeof channels])
            .join(', ') || 'Never'}
          {onlyFailures && channelsEnabled && ' (Failed workflows only)'}
        </SelectPanel.Button>

        <ActionList>
          <ActionList.Item selected={channels.GitHub} onSelect={() => toggleChannel('GitHub')}>
            On GitHub
          </ActionList.Item>
          <ActionList.Item selected={channels.Email} onSelect={() => toggleChannel('Email')}>
            Email
          </ActionList.Item>
          <Box
            role="none"
            sx={{
              transition: 'max-height 100ms ease-out, opacity 100ms ease-out',
              opacity: channelsEnabled ? 1 : 0,
              maxHeight: channelsEnabled ? '100px' : 0,
              overflow: channelsEnabled ? 'visible' : 'hidden',
            }}
          >
            <ActionList.Divider />
            <ActionList.Item selected={onlyFailures} onSelect={() => setOnlyFailures(!onlyFailures)}>
              Only notify for failed workflows
            </ActionList.Item>
          </Box>
        </ActionList>
        <SelectPanel.Footer />
      </SelectPanel>
    </>
  )
}

export const InsideSidebar = () => {
  const [selectedTag, setSelectedTag] = React.useState<string>()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <>
      <h1>Opening SelectPanel inside a sidebar</h1>

      <Button onClick={() => setSidebarOpen(true)}>Open sidebar</Button>
      {sidebarOpen && (
        <Dialog position="right" title="Sidebar" onClose={() => setSidebarOpen(false)}>
          <Box p={3}>
            <SelectPanel
              title="Choose a tag"
              selectionVariant="instant"
              onSubmit={() => {
                if (!selectedTag) return
                data.ref = selectedTag // pretending to persist changes
              }}
            >
              <SelectPanel.Button leadingVisual={TagIcon}>{selectedTag || 'Choose a tag'}</SelectPanel.Button>

              <ActionList>
                {data.tags.map(tag => (
                  <ActionList.Item
                    key={tag.id}
                    onSelect={() => setSelectedTag(tag.id)}
                    selected={selectedTag === tag.id}
                  >
                    {tag.name}
                  </ActionList.Item>
                ))}
              </ActionList>
            </SelectPanel>
          </Box>
        </Dialog>
      )}
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
