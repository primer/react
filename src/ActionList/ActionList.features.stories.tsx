import React from 'react'
import {Meta} from '@storybook/react'
import {ActionList} from '.'
import {Item} from './Item'
import {LinkItem} from './LinkItem'
import {Group} from './Group'
import {Divider} from './Divider'
import {Description} from './Description'
import Avatar from '../Avatar'
import Box from '../Box'
import Label from '../Label'
import Heading from '../Heading'
import {AnchoredOverlay} from '../AnchoredOverlay'
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
} from '@primer/octicons-react'

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

export const MultiSelect = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  return (
    <ActionList selectionVariant="multiple" showDividers role="menu" aria-label="Project">
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

export const Links = () => (
  <>
    <Heading as="h1" id="list-heading" sx={{fontSize: 1}}>
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
  <Box maxWidth="300px">
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
        <ActionList.Description>This description gets truncated because it is inline</ActionList.Description>
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
    </ActionList>
  </Box>
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
      renderAnchor={props => <button {...props}>toggle overlay</button>}
    >
      <ActionList>
        <ActionList.Item>
          Use your arrow keys
          <ActionList.TrailingVisual>↓</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item>
          keep going
          <ActionList.TrailingVisual>↓</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item>
          more more
          <ActionList.TrailingVisual>↓</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item variant="danger">
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
      <ActionList.Group title="Everyone">
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
      <ActionList.Group title="Everyone" variant="filled">
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
