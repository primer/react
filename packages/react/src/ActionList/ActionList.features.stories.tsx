import React from 'react'
import type {Meta} from '@storybook/react-vite'
import {ActionList} from '.'
import {Item} from './Item'
import {LinkItem} from './LinkItem'
import {Group} from './Group'
import {Divider} from './Divider'
import {Description} from './Description'
import Avatar from '../Avatar'
import Label from '../Label'
import Heading from '../Heading'
import {AnchoredOverlay} from '../AnchoredOverlay'
import CounterLabel from '../CounterLabel'
import {
  EyeIcon,
  BookIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  LinkIcon,
  LawIcon,
  StarIcon,
  RepoForkedIcon,
  AlertIcon,
  TableIcon,
  PeopleIcon,
  FileDirectoryIcon,
  PlusCircleIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  ProjectIcon,
} from '@primer/octicons-react'
import {KeybindingHint} from '../KeybindingHint'
import {FeatureFlags} from '../FeatureFlags'
import classes from './ActionList.features.stories.module.css'

export default {
  title: 'Components/ActionList/Features',
  component: ActionList,
  subcomponents: {Item, LinkItem, Group, Divider, Description},
} as Meta<typeof ActionList>

export const SimpleList = () => (
  <ActionList>
    <ActionList.Item>Copy link</ActionList.Item>
    <ActionList.Item>Quote reply</ActionList.Item>
    <ActionList.Item>Edit comment</ActionList.Item>
    <ActionList.Divider />
    <ActionList.Item variant="danger">Delete file</ActionList.Item>
  </ActionList>
)

export const WithVisualListHeading = () => (
  <ActionList>
    <ActionList.Heading as="h2" size="small">
      Filter by
    </ActionList.Heading>
    <ActionList.Group>
      <ActionList.GroupHeading as="h3">Repositories</ActionList.GroupHeading>
      <ActionList.Item onSelect={() => {}}>
        <ActionList.LeadingVisual>
          <FileDirectoryIcon />
        </ActionList.LeadingVisual>
        app/assets/modules
      </ActionList.Item>
      <ActionList.Item onSelect={() => {}}>
        <ActionList.LeadingVisual>
          <FileDirectoryIcon />
        </ActionList.LeadingVisual>
        src/react/components
      </ActionList.Item>
      <ActionList.Item onSelect={() => {}}>
        <ActionList.LeadingVisual>
          <FileDirectoryIcon />
        </ActionList.LeadingVisual>
        memex/shared-ui/components
      </ActionList.Item>
      <ActionList.Item onSelect={() => {}}>
        <ActionList.LeadingVisual>
          <FileDirectoryIcon />
        </ActionList.LeadingVisual>
        views/assets/modules
      </ActionList.Item>
    </ActionList.Group>

    <ActionList.Group>
      <ActionList.GroupHeading as="h3">Advanced</ActionList.GroupHeading>
      <ActionList.Item onSelect={() => {}}>
        <ActionList.LeadingVisual>
          <PlusCircleIcon />
        </ActionList.LeadingVisual>
        Owner
      </ActionList.Item>
      <ActionList.Item onSelect={() => {}}>
        <ActionList.LeadingVisual>
          <PlusCircleIcon />
        </ActionList.LeadingVisual>
        Symbol
      </ActionList.Item>
      <ActionList.Item onSelect={() => {}}>
        <ActionList.LeadingVisual>
          <PlusCircleIcon />
        </ActionList.LeadingVisual>
        Exclude archived
      </ActionList.Item>
    </ActionList.Group>
  </ActionList>
)

export const WithCustomHeading = () => (
  <>
    <Heading as="h1" id="list-heading" className={classes.HeadingLarge}>
      Details
    </Heading>
    <ActionList aria-labelledby="list-heading">
      <ActionList.LinkItem href="https://github.com/primer/react#readme">
        <ActionList.LeadingVisual>
          <BookIcon />
        </ActionList.LeadingVisual>
        Readme
      </ActionList.LinkItem>
      <ActionList.LinkItem href="https://github.com/primer/react/blob/main/LICENSE">
        <ActionList.LeadingVisual>
          <LawIcon />
        </ActionList.LeadingVisual>
        MIT License
      </ActionList.LinkItem>
      <ActionList.LinkItem href="https://github.com/primer/react/stargazers">
        <ActionList.LeadingVisual>
          <StarIcon />
        </ActionList.LeadingVisual>
        <strong>1.5k</strong> stars
      </ActionList.LinkItem>
      <ActionList.LinkItem href="https://github.com/primer/react/watchers">
        <ActionList.LeadingVisual>
          <EyeIcon />
        </ActionList.LeadingVisual>
        <strong>21</strong> watching
      </ActionList.LinkItem>
      <ActionList.LinkItem href="https://github.com/primer/react/network/members">
        <ActionList.LeadingVisual>
          <RepoForkedIcon />
        </ActionList.LeadingVisual>
        <strong>225</strong> forks
      </ActionList.LinkItem>
    </ActionList>
  </>
)
export const WithIcons = () => (
  <ActionList>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <LinkIcon />
      </ActionList.LeadingVisual>
      github.com/primer
    </ActionList.Item>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <LawIcon />
      </ActionList.LeadingVisual>
      MIT License
    </ActionList.Item>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <StarIcon />
      </ActionList.LeadingVisual>
      256 stars
    </ActionList.Item>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <RepoForkedIcon />
      </ActionList.LeadingVisual>
      3 forks
    </ActionList.Item>
    <ActionList.Item variant="danger">
      <ActionList.LeadingVisual>
        <AlertIcon />
      </ActionList.LeadingVisual>
      4 vulnerabilities
    </ActionList.Item>
  </ActionList>
)

const users = [
  {login: 'pksjce', name: 'Pavithra Kodmad'},
  {login: 'jfuchs', name: 'Jonathan Fuchs'},
  {login: 'colebemis', name: 'Cole Bemis'},
  {login: 'mperrotti', name: 'Mike Perrotti'},
  {login: 'dgreif', name: 'Dusty Greif'},
  {login: 'smockle', name: 'Clay Miller'},
  {login: 'siddharthkp', name: 'Siddharth Kshetrapal'},
]

export const WithAvatars = () => (
  <ActionList>
    {users.map(user => (
      <ActionList.Item key={user.login}>
        <ActionList.LeadingVisual>
          <Avatar src={`https://github.com/${user.login}.png`} />
        </ActionList.LeadingVisual>
        {user.login}
      </ActionList.Item>
    ))}
  </ActionList>
)

export const ItemDividers = () => (
  <ActionList showDividers>
    <ActionList.Item>Copy link</ActionList.Item>
    <ActionList.Item>Quote reply</ActionList.Item>
    <ActionList.Item>Edit comment</ActionList.Item>
  </ActionList>
)

export const SingleDivider = () => (
  <ActionList>
    <ActionList.Item>Copy link</ActionList.Item>
    <ActionList.Item>Quote reply</ActionList.Item>
    <ActionList.Item>Edit comment</ActionList.Item>
    <ActionList.Divider />
    <ActionList.Item variant="danger">Delete file</ActionList.Item>
  </ActionList>
)

export const InlineDescription = () => (
  <ActionList>
    {users.map(user => (
      <ActionList.Item key={user.login}>
        <ActionList.LeadingVisual>
          <Avatar src={`https://github.com/${user.login}.png`} />
        </ActionList.LeadingVisual>
        {user.login}
        <ActionList.Description>{user.name}</ActionList.Description>
      </ActionList.Item>
    ))}
  </ActionList>
)

export const BlockDescription = () => (
  <ActionList>
    {users.map(user => (
      <ActionList.Item key={user.login}>
        <ActionList.LeadingVisual>
          <Avatar src={`https://github.com/${user.login}.png`} />
        </ActionList.LeadingVisual>
        {user.login}
        <ActionList.Description variant="block">{user.name}</ActionList.Description>
      </ActionList.Item>
    ))}
  </ActionList>
)

const projects = [
  {name: 'Primer Backlog', scope: 'GitHub'},
  {name: 'Accessibility', scope: 'GitHub'},
  {name: 'Octicons', scope: 'github/primer'},
  {name: 'Primer React', scope: 'github/primer'},
]

export const SingleSelect = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  return (
    <ActionList selectionVariant="single" showDividers role="menu" aria-label="Project">
      {projects.map((project, index) => (
        <ActionList.Item
          key={index}
          role="menuitemradio"
          selected={index === selectedIndex}
          aria-checked={index === selectedIndex}
          onSelect={() => setSelectedIndex(index)}
        >
          <ActionList.LeadingVisual>
            <TableIcon />
          </ActionList.LeadingVisual>
          {project.name}
          <ActionList.Description variant="block">{project.scope}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

export const InactiveSingleSelect = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(1)
  return (
    <ActionList selectionVariant="single" showDividers role="menu" aria-label="Project">
      {/* menuitem because state is inactive */}
      <ActionList.Item role="menuitem" selected={false} inactiveText="Unavailable due to an outage">
        Inactive item
      </ActionList.Item>
      <ActionList.Item
        role="menuitemradio"
        selected={selectedIndex === 1}
        aria-checked={selectedIndex === 1}
        onSelect={() => setSelectedIndex(1)}
      >
        Item 2
      </ActionList.Item>
    </ActionList>
  )
}

export const MultiSelect = () => {
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([0])
  const handleSelect = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index))
    } else {
      setSelectedIndices([...selectedIndices, index])
    }
  }
  return (
    <ActionList selectionVariant="multiple" showDividers role="menu" aria-label="Project">
      {projects.map((project, index) => (
        <ActionList.Item
          key={index}
          role="menuitemcheckbox"
          selected={selectedIndices.includes(index)}
          aria-checked={selectedIndices.includes(index)}
          onSelect={() => handleSelect(index)}
          disabled={index === 3 ? true : undefined}
        >
          <ActionList.LeadingVisual>
            <TableIcon />
          </ActionList.LeadingVisual>
          {project.name}
          <ActionList.Description variant="block">{project.scope}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

export const ListboxSingleSelect = () => {
  const [selectedIndice, setSelectedIndice] = React.useState<number>(0)
  const handleSelect = (index: number) => {
    setSelectedIndice(index)
  }

  return (
    <ActionList selectionVariant="single" role="listbox" aria-label="Projects">
      {projects.map((project, index) => (
        <ActionList.Item
          key={index}
          selected={selectedIndice === index}
          aria-checked={selectedIndice === index}
          onSelect={() => handleSelect(index)}
          disabled={index === 3 ? true : undefined}
          role="option"
        >
          <ActionList.LeadingVisual>
            <TableIcon />
          </ActionList.LeadingVisual>
          {project.name}
          <ActionList.Description variant="block">{project.scope}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

export const ListboxMultiSelect = () => {
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([0])
  const handleSelect = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index))
    } else {
      setSelectedIndices([...selectedIndices, index])
    }
  }
  return (
    <ActionList role="menu" selectionVariant="multiple" aria-label="Projects">
      {projects.map((project, index) => (
        <ActionList.Item
          key={index}
          role="menuitemcheckbox"
          selected={selectedIndices.includes(index)}
          aria-checked={selectedIndices.includes(index)}
          onSelect={() => handleSelect(index)}
          disabled={index === 3 ? true : undefined}
        >
          <ActionList.LeadingVisual>
            <TableIcon />
          </ActionList.LeadingVisual>
          {project.name}
          <ActionList.Description variant="block">{project.scope}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

export const WithDynamicContent = () => {
  const [isTrue, setIsTrue] = React.useState(false)

  return (
    <FeatureFlags flags={{primer_react_action_list_item_as_button: true}}>
      <ActionList>
        <ActionList.Item
          onSelect={() => {
            setIsTrue(!isTrue)
          }}
        >
          Activated? {isTrue ? 'Yes' : 'No'}
        </ActionList.Item>
      </ActionList>
    </FeatureFlags>
  )
}

export const DisabledSelectedMultiselect = () => (
  <ActionList selectionVariant="multiple" role="menu" aria-label="Project">
    <ActionList.Item role="menuitemcheckbox" selected aria-checked disabled>
      Selected disabled item
    </ActionList.Item>
    <ActionList.Item role="menuitemcheckbox" selected={false} aria-checked={false}>
      Item 2
    </ActionList.Item>
  </ActionList>
)

export const DisabledMultiselect = () => (
  <ActionList selectionVariant="multiple" role="menu" aria-label="Project">
    <ActionList.Item role="menuitemcheckbox" selected={false} aria-checked={false} disabled>
      Disabled item
    </ActionList.Item>
    <ActionList.Item role="menuitemcheckbox" selected={false} aria-checked={false}>
      Item 2
    </ActionList.Item>
  </ActionList>
)

export const InactiveMultiselect = () => {
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([0])
  const handleSelect = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index))
    } else {
      setSelectedIndices([...selectedIndices, index])
    }
  }
  return (
    <ActionList selectionVariant="multiple" role="menu" aria-label="Project">
      {/* menuitem because state is inactive */}
      <ActionList.Item role="menuitem" selected={false} inactiveText="Unavailable due to an outage">
        Inactive item
      </ActionList.Item>
      <ActionList.Item
        role="menuitemcheckbox"
        selected={selectedIndices.includes(1)}
        aria-checked={selectedIndices.includes(1)}
        onSelect={() => handleSelect(1)}
      >
        Item 2
      </ActionList.Item>
    </ActionList>
  )
}

export const DisabledItem = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  return (
    <ActionList selectionVariant="single" showDividers role="menu" aria-label="Project">
      {projects.map((project, index) => (
        <ActionList.Item
          key={index}
          role="menuitemradio"
          selected={index === selectedIndex}
          aria-checked={index === selectedIndex}
          onSelect={() => setSelectedIndex(index)}
          disabled={index === 1}
        >
          <ActionList.LeadingVisual>
            <TableIcon />
          </ActionList.LeadingVisual>
          {project.name}
          <ActionList.Description variant="block">{project.scope}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

export const InactiveItem = () => {
  return (
    <ActionList aria-label="Project">
      {projects.map((project, index) => (
        <ActionList.Item key={index} inactiveText={index === 1 ? 'Unavailable due to an outage' : undefined}>
          <ActionList.LeadingVisual>
            <TableIcon />
          </ActionList.LeadingVisual>
          {project.name}
          <ActionList.Description variant="block">{project.scope}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

export const LoadingItem = () => {
  return (
    <ActionList aria-label="Project">
      {projects.map((project, index) => (
        <ActionList.Item key={index} loading={index === 1}>
          {project.name}
          <ActionList.Description variant="block">{project.scope}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

export const Links = () => (
  <ActionList>
    <ActionList.Heading as="h1" className={classes.HeadingSmall}>
      Details
    </ActionList.Heading>
    <ActionList.LinkItem href="https://github.com/primer/react#readme">
      <ActionList.LeadingVisual>
        <BookIcon />
      </ActionList.LeadingVisual>
      Readme
    </ActionList.LinkItem>
    <ActionList.LinkItem href="https://github.com/primer/react/blob/main/LICENSE">
      <ActionList.LeadingVisual>
        <LawIcon />
      </ActionList.LeadingVisual>
      MIT License
    </ActionList.LinkItem>
    <ActionList.LinkItem href="https://github.com/primer/react/stargazers">
      <ActionList.LeadingVisual>
        <StarIcon />
      </ActionList.LeadingVisual>
      <strong>1.5k</strong> stars
    </ActionList.LinkItem>
    <ActionList.LinkItem href="https://github.com/primer/react/watchers">
      <ActionList.LeadingVisual>
        <EyeIcon />
      </ActionList.LeadingVisual>
      <strong>21</strong> watching
    </ActionList.LinkItem>
    <ActionList.LinkItem href="https://github.com/primer/react/network/members">
      <ActionList.LeadingVisual>
        <RepoForkedIcon />
      </ActionList.LeadingVisual>
      <strong>225</strong> forks
    </ActionList.LinkItem>
  </ActionList>
)

export const CustomItemChildren = () => (
  <ActionList>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <ArrowRightIcon />
      </ActionList.LeadingVisual>
      <Label>Choose this one</Label>
      <ActionList.TrailingVisual>
        <ArrowLeftIcon />
      </ActionList.TrailingVisual>
    </ActionList.Item>
  </ActionList>
)

export const TextWrapAndTruncation = () => (
  <div className={classes.BoxWithMaxWidth}>
    <ActionList showDividers>
      <ActionList.Item>
        <ActionList.LeadingVisual>
          <ArrowRightIcon />
        </ActionList.LeadingVisual>
        Block Description. Long text should wrap
        <ActionList.Description variant="block">
          This description is long, but it is block so it wraps
        </ActionList.Description>
        <ActionList.TrailingVisual>
          <ArrowLeftIcon />
        </ActionList.TrailingVisual>
      </ActionList.Item>
      <ActionList.Item>
        <ActionList.LeadingVisual>
          <ArrowRightIcon />
        </ActionList.LeadingVisual>
        Inline Description
        <ActionList.Description truncate>
          This description gets truncated because it is inline with truncation
        </ActionList.Description>
        <ActionList.TrailingVisual>
          <ArrowLeftIcon />
        </ActionList.TrailingVisual>
      </ActionList.Item>
      <ActionList.Item>
        <ActionList.LeadingVisual>
          <ArrowRightIcon />
        </ActionList.LeadingVisual>
        Description with truncation and complex children
        <ActionList.Description truncate>
          With <strong>bold</strong> and <em>italic</em> text, and it should truncate if it is too long
        </ActionList.Description>
        <ActionList.TrailingVisual>
          <ArrowLeftIcon />
        </ActionList.TrailingVisual>
      </ActionList.Item>
      <ActionList.Item>
        <ActionList.LeadingVisual>
          <ArrowRightIcon />
        </ActionList.LeadingVisual>
        Inline Description
        <ActionList.Description>This description wraps because it is inline without truncation</ActionList.Description>
        <ActionList.TrailingVisual>
          <ArrowLeftIcon />
        </ActionList.TrailingVisual>
      </ActionList.Item>
      <ActionList.Item>
        <ActionList.LeadingVisual>
          <ArrowRightIcon />
        </ActionList.LeadingVisual>
        Really long text without a description should wrap so it wraps
        <ActionList.TrailingVisual>
          <ArrowLeftIcon />
        </ActionList.TrailingVisual>
      </ActionList.Item>
      <ActionList.Item>
        <ActionList.LeadingVisual>
          <ArrowRightIcon />
        </ActionList.LeadingVisual>
        SomethingSomething/SomethingElse.Some.Thing.Lalala.la
        <ActionList.TrailingVisual>
          <ArrowLeftIcon />
        </ActionList.TrailingVisual>
      </ActionList.Item>
    </ActionList>
  </div>
)

const teams = [
  {id: '5025661', type: 'team', slug: 'github/primer-reviewers', name: 'Primer Reviewers', members: 20},
  {id: '1929972', type: 'team', slug: 'github/design-infrastructure', name: 'Design Infrastructure', members: 20},
]

export const ConditionalChildren = () => {
  type reviewerType = {name: string; id?: string; type?: string; login?: string; slug?: string; members?: number}
  const potentialReviewers: reviewerType[] = [...teams, ...users]

  return (
    <ActionList showDividers>
      {potentialReviewers.map((reviewer, index) => (
        <ActionList.Item key={index}>
          <ActionList.LeadingVisual>
            {reviewer.type === 'team' ? (
              <Avatar src={`https://avatars.githubusercontent.com/t/${reviewer.id}`} />
            ) : (
              <Avatar src={`https://avatars.githubusercontent.com/${reviewer.login}`} />
            )}
          </ActionList.LeadingVisual>
          {reviewer.login || reviewer.slug}
          {reviewer.type === 'team' ? (
            <ActionList.Description variant="block">{reviewer.name}</ActionList.Description>
          ) : (
            <ActionList.Description>{reviewer.name}</ActionList.Description>
          )}
          {reviewer.type === 'team' && (
            <ActionList.TrailingVisual>
              <PeopleIcon />
              {reviewer.members}
            </ActionList.TrailingVisual>
          )}
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

export const ChildWithSideEffects = () => {
  const user = users[0]
  const [selected, setSelected] = React.useState(true)

  const SideEffectDescription = () => {
    const [seconds, setSeconds] = React.useState(0)

    React.useEffect(() => {
      const fn = () => setSeconds(s => s + 1)
      const interval = window.setInterval(fn, 1000)
      return () => window.clearInterval(interval)
    }, [])

    return <>{seconds} seconds passed</>
  }

  return (
    <ActionList selectionVariant="multiple" role="listbox" aria-label="Assignees">
      <ActionList.Item selected={selected} onSelect={() => setSelected(!selected)} role="option">
        <ActionList.LeadingVisual>
          <Avatar src={`https://avatars.githubusercontent.com/${user.login}`} />
        </ActionList.LeadingVisual>
        {user.login}
        <ActionList.Description>
          <SideEffectDescription />
        </ActionList.Description>
      </ActionList.Item>
    </ActionList>
  )
}

export const InsideOverlay = () => {
  const [open, setOpen] = React.useState(false)
  const toggle = () => setOpen(!open)
  return (
    <AnchoredOverlay
      open={open}
      onOpen={toggle}
      onClose={toggle}
      renderAnchor={props => (
        <button type="button" {...props}>
          toggle overlay
        </button>
      )}
    >
      <ActionList role="menu">
        <ActionList.Item role="menuitem">
          Use your arrow keys
          <ActionList.TrailingVisual>↓</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item role="menuitem">
          keep going
          <ActionList.TrailingVisual>↓</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item role="menuitem">
          more more
          <ActionList.TrailingVisual>↓</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item variant="danger" role="menuitem">
          now go up!
          <ActionList.TrailingVisual>↑</ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>
    </AnchoredOverlay>
  )
}

export const GroupWithSubtleTitle = () => {
  const [assignees, setAssignees] = React.useState(users.slice(0, 1))

  const toggleAssignee = (assignee: (typeof users)[number]) => {
    const assigneeIndex = assignees.findIndex(a => a.login === assignee.login)

    if (assigneeIndex === -1) setAssignees([...assignees, assignee])
    else setAssignees(assignees.filter((_, index) => index !== assigneeIndex))
  }

  return (
    <ActionList selectionVariant="multiple" role="menu" showDividers aria-label="Reviewers">
      <ActionList.Group>
        <ActionList.GroupHeading>Everyone</ActionList.GroupHeading>
        {users.slice(2).map(user => (
          <ActionList.Item
            role="menuitemcheckbox"
            key={user.login}
            selected={Boolean(assignees.find(assignee => assignee.login === user.login))}
            aria-checked={Boolean(assignees.find(assignee => assignee.login === user.login))}
            onSelect={() => toggleAssignee(user)}
          >
            <ActionList.LeadingVisual>
              <Avatar src={`https://github.com/${user.login}.png`} />
            </ActionList.LeadingVisual>
            {user.login}
            <ActionList.Description>{user.name}</ActionList.Description>
          </ActionList.Item>
        ))}
      </ActionList.Group>
    </ActionList>
  )
}

export const GroupWithFilledTitle = () => {
  const [assignees, setAssignees] = React.useState(users.slice(0, 1))

  const toggleAssignee = (assignee: (typeof users)[number]) => {
    const assigneeIndex = assignees.findIndex(a => a.login === assignee.login)

    if (assigneeIndex === -1) setAssignees([...assignees, assignee])
    else setAssignees(assignees.filter((_, index) => index !== assigneeIndex))
  }

  return (
    <ActionList selectionVariant="multiple" role="menu" showDividers aria-label="Reviewers">
      <ActionList.Group>
        <ActionList.GroupHeading variant="filled">Everyone</ActionList.GroupHeading>
        {users.slice(2).map(user => (
          <ActionList.Item
            role="menuitemcheckbox"
            key={user.login}
            selected={Boolean(assignees.find(assignee => assignee.login === user.login))}
            aria-checked={Boolean(assignees.find(assignee => assignee.login === user.login))}
            onSelect={() => toggleAssignee(user)}
          >
            <ActionList.LeadingVisual>
              <Avatar src={`https://github.com/${user.login}.png`} />
            </ActionList.LeadingVisual>
            {user.login}
            <ActionList.Description>{user.name}</ActionList.Description>
          </ActionList.Item>
        ))}
      </ActionList.Group>
    </ActionList>
  )
}

export const WithCustomTrailingVisuals = () => (
  <ActionList>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <IssueOpenedIcon />
      </ActionList.LeadingVisual>
      Issues
      <ActionList.TrailingVisual>
        <CounterLabel>20</CounterLabel>
      </ActionList.TrailingVisual>
    </ActionList.Item>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <GitPullRequestIcon />
      </ActionList.LeadingVisual>
      PRs
      <ActionList.TrailingVisual>
        <CounterLabel>12</CounterLabel>
      </ActionList.TrailingVisual>
    </ActionList.Item>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <ProjectIcon />
      </ActionList.LeadingVisual>
      Projects
      <ActionList.TrailingVisual>
        <CounterLabel>2</CounterLabel>
      </ActionList.TrailingVisual>
    </ActionList.Item>
  </ActionList>
)

export const WithKeyboardShortcuts = () => (
  <ActionList>
    <ActionList.Item>
      New file
      <ActionList.TrailingVisual>
        <KeybindingHint keys="Mod+N" />
      </ActionList.TrailingVisual>
    </ActionList.Item>
    <ActionList.Item>
      Open file
      <ActionList.TrailingVisual>
        <KeybindingHint keys="Mod+O" />
      </ActionList.TrailingVisual>
    </ActionList.Item>
    <ActionList.Item>
      Save
      <ActionList.TrailingVisual>
        <KeybindingHint keys="Mod+S" />
      </ActionList.TrailingVisual>
    </ActionList.Item>
    <ActionList.Divider />
    <ActionList.Item variant="danger">
      Delete
      <ActionList.TrailingVisual>
        <KeybindingHint keys="Mod+D" />
      </ActionList.TrailingVisual>
    </ActionList.Item>
  </ActionList>
)

export const WithTrailingCount = () => (
  <ActionList>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <IssueOpenedIcon />
      </ActionList.LeadingVisual>
      Open issues
      <ActionList.TrailingVisual>
        <CounterLabel>24</CounterLabel>
      </ActionList.TrailingVisual>
    </ActionList.Item>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <GitPullRequestIcon />
      </ActionList.LeadingVisual>
      Pull requests
      <ActionList.TrailingVisual>
        <CounterLabel>8</CounterLabel>
      </ActionList.TrailingVisual>
    </ActionList.Item>
    <ActionList.Item>
      <ActionList.LeadingVisual>
        <ProjectIcon />
      </ActionList.LeadingVisual>
      Projects
      <ActionList.TrailingVisual>
        <CounterLabel>3</CounterLabel>
      </ActionList.TrailingVisual>
    </ActionList.Item>
    <ActionList.Item variant="danger">
      <ActionList.LeadingVisual>
        <AlertIcon />
      </ActionList.LeadingVisual>
      Alerts
      <ActionList.TrailingVisual>
        <CounterLabel>12</CounterLabel>
      </ActionList.TrailingVisual>
    </ActionList.Item>
  </ActionList>
)

export const WithTrailingAction = () => {
  const [loadingState, setLoadingState] = React.useState(false)

  // Auto-toggle every 2.5 seconds to continuously show transitions
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoadingState(prev => !prev)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <FeatureFlags flags={{primer_react_action_list_item_as_button: true}}>
      <ActionList>
        <ActionList.Item>
          <ActionList.LeadingVisual>
            <FileDirectoryIcon />
          </ActionList.LeadingVisual>
          Item 1 (with default TrailingAction)
          <ActionList.TrailingAction label="Expand sidebar" icon={ArrowLeftIcon} />
        </ActionList.Item>
        <ActionList.Item>
          Item 2 (with link TrailingAction)
          <ActionList.TrailingAction as="a" href="#" label="Some action 1" icon={ArrowRightIcon} />
        </ActionList.Item>
        <ActionList.Item>
          Item 3<ActionList.Description>This is an inline description.</ActionList.Description>
          <ActionList.TrailingAction label="Some action 2" icon={BookIcon} />
        </ActionList.Item>
        <ActionList.Item>
          Item 4<ActionList.Description variant="block">This is a block description.</ActionList.Description>
          <ActionList.TrailingAction label="Some action 3" icon={BookIcon} />
        </ActionList.Item>
        <ActionList.Item>
          Item 5<ActionList.Description variant="block">This is a block description.</ActionList.Description>
          <ActionList.TrailingAction label="Some action 4" />
        </ActionList.Item>
        <ActionList.Item>
          Item 6
          <ActionList.TrailingAction href="#" as="a" label="Some action 5" />
        </ActionList.Item>
        <ActionList.Item>
          Icon button loading state
          <ActionList.Description>
            Shows how IconButton maintains width and centers spinner when loading
          </ActionList.Description>
          <ActionList.TrailingAction label="Process item" icon={ArrowRightIcon} loading />
        </ActionList.Item>
        <ActionList.Item>
          Icon button with transitions
          <ActionList.Description>
            Automatically toggles loading state every 2.5 seconds to show transitions
          </ActionList.Description>
          <ActionList.TrailingAction label="Toggle loading" icon={ArrowRightIcon} loading={loadingState} />
        </ActionList.Item>
        <ActionList.Item>
          Text button loading state
          <ActionList.Description>
            Shows how text button aligns spinner to the right and preserves width
          </ActionList.Description>
          <ActionList.TrailingAction label="Save changes" loading />
        </ActionList.Item>
        <ActionList.Item>
          Text button with transitions
          <ActionList.Description>
            Automatically toggles loading state every 2.5 seconds to show transitions
          </ActionList.Description>
          <ActionList.TrailingAction label="Apply settings" loading={loadingState} />
        </ActionList.Item>
        <ActionList.LinkItem href="#">
          LinkItem 1
          <ActionList.Description>
            with TrailingAction this is a long description and should not cause horizontal scroll on smaller screen
            sizes
          </ActionList.Description>
          <ActionList.TrailingAction label="Another action" />
        </ActionList.LinkItem>
        <ActionList.LinkItem href="#">
          LinkItem 2
          <ActionList.Description>
            with TrailingVisual this is a long description and should not cause horizontal scroll on smaller screen
            sizes
          </ActionList.Description>
          <ActionList.TrailingVisual>
            <TableIcon />
          </ActionList.TrailingVisual>
        </ActionList.LinkItem>
        <ActionList.Item inactiveText="Unavailable due to an outage">
          Inactive Item<ActionList.Description>With TrailingAction</ActionList.Description>
          <ActionList.TrailingAction as="a" href="#" label="Some action 8" icon={ArrowRightIcon} />
        </ActionList.Item>
      </ActionList>
    </FeatureFlags>
  )
}

export const FullVariant = () => (
  <ActionList variant="full">
    <ActionList.Item>Copy link</ActionList.Item>
    <ActionList.Item>Quote reply</ActionList.Item>
    <ActionList.Item>Edit comment</ActionList.Item>
    <ActionList.Divider />
    <ActionList.Item variant="danger">Delete file</ActionList.Item>
  </ActionList>
)

export const LargeItem = () => (
  <ActionList>
    <ActionList.Item size="large">Large item</ActionList.Item>
    <ActionList.Item size="large">
      Large item
      <ActionList.Description>With inline description</ActionList.Description>
    </ActionList.Item>
    <ActionList.Item size="large">
      Large item
      <ActionList.Description variant="block">With block description</ActionList.Description>
    </ActionList.Item>
  </ActionList>
)
