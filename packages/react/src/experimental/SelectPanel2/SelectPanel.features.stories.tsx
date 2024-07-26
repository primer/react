import React from 'react'
import {SelectPanel} from './SelectPanel'
import {
  ActionList,
  Avatar,
  Box,
  Button,
  Link,
  SegmentedControl,
  Text,
  ToggleSwitch,
  useResponsiveValue,
} from '../../index'
import {TagIcon, GearIcon, ArrowBothIcon} from '@primer/octicons-react'
import data from './mock-story-data'

export default {
  title: 'Drafts/Components/SelectPanel/Features',
  component: SelectPanel,
}

const getCircle = (color: string) => (
  <Box sx={{width: 14, height: 14, borderRadius: '100%'}} style={{backgroundColor: `#${color}`}} />
)

export const InstantSelectionVariant = () => {
  const [selectedTag, setSelectedTag] = React.useState<string>()

  const onSubmit = () => {
    if (!selectedTag) return
    data.ref = selectedTag // pretending to persist changes
  }

  const itemsToShow = data.tags

  return (
    <>
      <h1>Instant selection variant</h1>

      <SelectPanel title="Choose a tag" selectionVariant="instant" onSubmit={onSubmit}>
        <SelectPanel.Button leadingVisual={TagIcon}>{selectedTag || 'Choose a tag'}</SelectPanel.Button>

        <ActionList>
          {itemsToShow.map(tag => (
            <ActionList.Item key={tag.id} onSelect={() => setSelectedTag(tag.id)} selected={selectedTag === tag.id}>
              {tag.name}
            </ActionList.Item>
          ))}
        </ActionList>
        <SelectPanel.Footer>
          <SelectPanel.SecondaryAction variant="button">Edit tags</SelectPanel.SecondaryAction>
        </SelectPanel.Footer>
      </SelectPanel>
    </>
  )
}

export const SingleSelection = () => <h1>TODO</h1>

export const WithWarning = () => {
  /* Selection */

  const initialAssigneeIds = data.issue.assigneeIds // mock initial state
  const [selectedAssigneeIds, setSelectedAssigneeIds] = React.useState<string[]>(initialAssigneeIds)
  const MAX_LIMIT = 3

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
      <h1>SelectPanel with warning</h1>

      <SelectPanel
        title="Set assignees"
        description={`Select up to ${MAX_LIMIT} people`}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onClearSelection={onClearSelection}
      >
        <SelectPanel.Button
          variant="invisible"
          trailingAction={GearIcon}
          sx={{width: '200px', '[data-component=buttonContent]': {justifyContent: 'start'}}}
        >
          Assignees
        </SelectPanel.Button>
        <SelectPanel.Header>
          <SelectPanel.SearchInput onChange={onSearchInputChange} />
        </SelectPanel.Header>

        {selectedAssigneeIds.length >= MAX_LIMIT ? (
          <SelectPanel.Message variant="warning" size="inline">
            You have reached the limit of {MAX_LIMIT} assignees on your free account.{' '}
            <Link href="/upgrade">Upgrade your account.</Link>
          </SelectPanel.Message>
        ) : null}

        {itemsToShow.length === 0 ? (
          <SelectPanel.Message variant="empty" title={`No labels found for "${query}"`}>
            Try a different search term
          </SelectPanel.Message>
        ) : (
          <ActionList>
            {itemsToShow.map(collaborator => (
              <ActionList.Item
                key={collaborator.id}
                onSelect={() => onCollaboratorSelect(collaborator.id)}
                selected={selectedAssigneeIds.includes(collaborator.id)}
                disabled={selectedAssigneeIds.length >= MAX_LIMIT && !selectedAssigneeIds.includes(collaborator.id)}
              >
                <ActionList.LeadingVisual>
                  <Avatar src={`https://github.com/${collaborator.login}.png`} />
                </ActionList.LeadingVisual>
                {collaborator.login}
                <ActionList.Description>{collaborator.login}</ActionList.Description>
              </ActionList.Item>
            ))}
          </ActionList>
        )}

        <SelectPanel.Footer />
      </SelectPanel>
    </>
  )
}

export const WithErrors = () => {
  const [searchBroken, setSearchBroken] = React.useState(true)
  const [issuesBroken, setIssuesBroken] = React.useState(false)

  /* Selection */
  const initialAssigneeIds = data.collaborators.slice(0, 3).map(c => c.id) // mock initial state
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
  const [filteredUsers, setFilteredUsers] = React.useState(
    searchBroken ? data.collaborators.filter(c => initialAssigneeIds.includes(c.id)) : data.collaborators,
  )

  const [query, setQuery] = React.useState('')

  const onSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const query = event.currentTarget.value
    setQuery(query)

    if (query === '') setFilteredUsers(data.collaborators)
    else {
      // if search is broken, only show assignees, not all collaborators
      const allCollaborators = searchBroken
        ? data.collaborators.filter(c => initialAssigneeIds.includes(c.id))
        : data.collaborators

      setFilteredUsers(
        allCollaborators
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
      <h1>SelectPanel with Errors</h1>

      <Box sx={{display: 'flex', maxWidth: 600, marginBottom: 2}}>
        <Box sx={{flexGrow: 1}}>
          <Text sx={{fontSize: 2, fontWeight: 'bold', display: 'block'}} id="switch-label">
            Break search API
          </Text>
          <Text sx={{fontSize: 1, color: 'fg.subtle'}} id="switch-caption">
            Turn on to show error message while searching
          </Text>
        </Box>
        <ToggleSwitch
          defaultChecked={true}
          onChange={enabled => setSearchBroken(enabled)}
          aria-labelledby="switch-label"
          aria-describedby="switch-caption"
        />
      </Box>
      <Box sx={{display: 'flex', marginBottom: 5, maxWidth: 600}}>
        <Box sx={{flexGrow: 1}}>
          <Text id="break-issues-label" sx={{fontSize: 2, fontWeight: 'bold', display: 'block'}}>
            Break issues API
          </Text>
          <Text id="break-issues-caption" sx={{fontSize: 1, color: 'fg.subtle'}}>
            Turn on to break everything and show big error in panel
          </Text>
        </Box>
        <ToggleSwitch
          defaultChecked={false}
          onChange={enabled => setIssuesBroken(enabled)}
          aria-labelledby="break-issues-label"
          aria-describedby="break-issues-caption"
        />
      </Box>

      <SelectPanel title="Set assignees" onSubmit={onSubmit} onCancel={onCancel} onClearSelection={onClearSelection}>
        <SelectPanel.Button
          variant="invisible"
          trailingAction={GearIcon}
          sx={{width: '200px', '[data-component=buttonContent]': {justifyContent: 'start'}}}
        >
          Assignees
        </SelectPanel.Button>
        <SelectPanel.Header>
          <SelectPanel.SearchInput onChange={onSearchInputChange} />
        </SelectPanel.Header>

        {issuesBroken ? (
          <SelectPanel.Message variant="error" size="full" title="We couldn't load collaborators">
            Try again or if the problem persists, <Link href="/support">contact support</Link>
          </SelectPanel.Message>
        ) : (
          <>
            {query && searchBroken ? (
              <SelectPanel.Message variant="error" size="inline">
                We couldn&apos;t load all collaborators. Try again or if the problem persists,{' '}
                <Link href="/support">contact support</Link>
              </SelectPanel.Message>
            ) : null}
            {itemsToShow.length === 0 ? (
              <SelectPanel.Message variant="empty" title={`No labels found for "${query}"`}>
                Try a different search term
              </SelectPanel.Message>
            ) : (
              <ActionList>
                {itemsToShow.map(collaborator => (
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
              </ActionList>
            )}
          </>
        )}

        <SelectPanel.Footer />
      </SelectPanel>
    </>
  )
}

export const ExternalAnchor = () => {
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

  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <h1>With External Anchor</h1>
      <p>
        To use an external anchor, pass an `anchorRef` to `SelectPanel`. You would also need to control the `open` state
        with `onSubmit` and `onCancel`
      </p>

      <Button
        ref={anchorRef}
        variant="primary"
        onClick={() => setOpen(!open)}
        aria-haspopup
        aria-expanded={open ? true : undefined}
      >
        Assign label
      </Button>

      <SelectPanel
        title="Select labels"
        anchorRef={anchorRef}
        open={open} // this needs to be set with the button
        onSubmit={() => {
          setOpen(false) // close on submit
          onSubmit()
        }}
        onCancel={() => {
          onCancel()
          setOpen(false) // close on cancel
        }}
      >
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

export const AsModal = () => {
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
      <h1>SelectPanel as Modal</h1>

      <SelectPanel variant="modal" title="Select labels" onSubmit={onSubmit} onCancel={onCancel}>
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

export const ResponsiveVariants = () => {
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

  /** Controls for story/example */
  const {variant, Controls} = useResponsiveControlsForStory()

  return (
    <>
      <h1>Responsive SelectPanel</h1>

      {Controls}

      <SelectPanel title="Set assignees" variant={variant} onSubmit={onSubmit} onClearSelection={onClearSelection}>
        <SelectPanel.Button
          variant="invisible"
          trailingAction={GearIcon}
          sx={{width: '200px', '[data-component=buttonContent]': {justifyContent: 'start'}}}
        >
          Assignees
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
            {itemsToShow.map(collaborator => (
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
          </ActionList>
        )}

        <SelectPanel.Footer />
      </SelectPanel>
    </>
  )
}

// pulling this out of story so that the docs look clean
const useResponsiveControlsForStory = () => {
  const [variant, setVariant] = React.useState<{regular: 'anchored' | 'modal'; narrow: 'full-screen' | 'bottom-sheet'}>(
    {regular: 'anchored', narrow: 'full-screen'},
  )

  const isNarrow = useResponsiveValue({narrow: true}, false)

  const Controls = (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 4, maxWidth: 480, fontSize: 1}}>
      <Box sx={{display: 'flex', minHeight: 42}}>
        <Box sx={{flexGrow: 1}}>
          <Text sx={{display: 'block'}}>Regular variant</Text>
          {isNarrow ? (
            <Text sx={{color: 'attention.fg'}}>
              <ArrowBothIcon size={16} /> Resize screen to see regular variant
            </Text>
          ) : null}
        </Box>
        <SegmentedControl aria-label="Regular variant" size="small">
          <SegmentedControl.Button
            selected={variant.regular === 'anchored'}
            onClick={() => setVariant({...variant, regular: 'anchored'})}
          >
            Anchored
          </SegmentedControl.Button>
          <SegmentedControl.Button
            selected={variant.regular === 'modal'}
            onClick={() => setVariant({...variant, regular: 'modal'})}
          >
            Modal
          </SegmentedControl.Button>
        </SegmentedControl>
      </Box>
      <Box sx={{display: 'flex', minHeight: 42}}>
        <Box sx={{flexGrow: 1}}>
          <Text sx={{display: 'block'}}>Narrow variant</Text>
          {isNarrow ? null : (
            <Text sx={{color: 'attention.fg'}}>
              <ArrowBothIcon size={16} /> Resize screen to see narrow variant
            </Text>
          )}
        </Box>
        <SegmentedControl aria-label="Narrow variant" size="small">
          <SegmentedControl.Button
            selected={variant.narrow === 'full-screen'}
            onClick={() => setVariant({...variant, narrow: 'full-screen'})}
          >
            Full screen
          </SegmentedControl.Button>
          <SegmentedControl.Button
            selected={variant.narrow === 'bottom-sheet'}
            onClick={() => setVariant({...variant, narrow: 'bottom-sheet'})}
          >
            Bottom sheet
          </SegmentedControl.Button>
        </SegmentedControl>
      </Box>
    </Box>
  )

  return {variant, Controls}
}
