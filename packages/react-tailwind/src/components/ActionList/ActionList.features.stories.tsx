import {
  AlertIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  EyeIcon,
  FileDirectoryIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  LawIcon,
  LinkIcon,
  PeopleIcon,
  PlusCircleIcon,
  ProjectIcon,
  RepoForkedIcon,
  StarIcon,
  TableIcon,
} from '@primer/octicons-react'
import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {Avatar} from '../Avatar'
import {CounterLabel} from '../CounterLabel'
import {KeybindingHint} from '../KeybindingHint'
import {Label} from '../Label'
import {ActionList} from './ActionList'

const meta = {
  title: 'React Tailwind/Components/ActionList/Features',
  component: ActionList,
} satisfies Meta<typeof ActionList>

export default meta
type Story = StoryObj<typeof meta>

const projects = [
  {name: 'Primer Backlog', scope: 'GitHub'},
  {name: 'Accessibility', scope: 'GitHub'},
  {name: 'Octicons', scope: 'github/primer'},
  {name: 'Primer React', scope: 'github/primer'},
]
const users = [
  {login: 'pksjce', name: 'Pavithra Kodmad'},
  {login: 'jfuchs', name: 'Jonathan Fuchs'},
  {login: 'colebemis', name: 'Cole Bemis'},
  {login: 'mperrotti', name: 'Mike Perrotti'},
  {login: 'dgreif', name: 'Dusty Greif'},
  {login: 'smockle', name: 'Clay Miller'},
  {login: 'siddharthkp', name: 'Siddharth Kshetrapal'},
]
const teams = [
  {id: '5025661', type: 'team', slug: 'github/primer-reviewers', name: 'Primer Reviewers', members: 20},
  {id: '1929972', type: 'team', slug: 'github/design-infrastructure', name: 'Design Infrastructure', members: 20},
]

export const SimpleList: Story = {
  render: () => (
    <ActionList>
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Quote reply</ActionList.Item>
      <ActionList.Item>Edit comment</ActionList.Item>
      <ActionList.Divider />
      <ActionList.Item variant="danger">Delete file</ActionList.Item>
    </ActionList>
  ),
}
export const WithVisualListHeading: Story = {
  render: () => (
    <ActionList>
      <ActionList.Heading as="h2" size="small">
        Filter by
      </ActionList.Heading>
      <ActionList.Group>
        <ActionList.GroupHeading as="h3">Repositories</ActionList.GroupHeading>
        {['app/assets/modules', 'src/react/components', 'memex/shared-ui/components', 'views/assets/modules'].map(
          item => (
            <ActionList.Item key={item}>
              <ActionList.LeadingVisual>
                <FileDirectoryIcon />
              </ActionList.LeadingVisual>
              {item}
            </ActionList.Item>
          ),
        )}
      </ActionList.Group>
      <ActionList.Group>
        <ActionList.GroupHeading as="h3">Advanced</ActionList.GroupHeading>
        {['Owner', 'Symbol', 'Exclude archived'].map(item => (
          <ActionList.Item key={item}>
            <ActionList.LeadingVisual>
              <PlusCircleIcon />
            </ActionList.LeadingVisual>
            {item}
          </ActionList.Item>
        ))}
      </ActionList.Group>
    </ActionList>
  ),
}
export const WithCustomHeading: Story = {
  render: () => (
    <>
      <h1 id="list-heading" className="m-0 mx-4 text-xl leading-[30px]">
        Details
      </h1>
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
  ),
}
export const WithIcons: Story = {
  render: () => (
    <ActionList>
      {(
        [
          [LinkIcon, 'github.com/primer'],
          [LawIcon, 'MIT License'],
          [StarIcon, '256 stars'],
          [RepoForkedIcon, '3 forks'],
        ] satisfies Array<[React.ElementType, string]>
      ).map(([Icon, label]) => (
        <ActionList.Item key={label}>
          <ActionList.LeadingVisual>
            <Icon />
          </ActionList.LeadingVisual>
          {label}
        </ActionList.Item>
      ))}
      <ActionList.Item variant="danger">
        <ActionList.LeadingVisual>
          <AlertIcon />
        </ActionList.LeadingVisual>
        4 vulnerabilities
      </ActionList.Item>
    </ActionList>
  ),
}
export const WithAvatars: Story = {
  render: () => (
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
  ),
}
export const ItemDividers: Story = {
  render: () => (
    <ActionList showDividers>
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Quote reply</ActionList.Item>
      <ActionList.Item>Edit comment</ActionList.Item>
    </ActionList>
  ),
}
export const SingleDivider: Story = {
  render: () => (
    <ActionList>
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Quote reply</ActionList.Item>
      <ActionList.Item>Edit comment</ActionList.Item>
      <ActionList.Divider />
      <ActionList.Item variant="danger">Delete file</ActionList.Item>
    </ActionList>
  ),
}
export const InlineDescription: Story = {
  render: () => (
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
  ),
}
export const BlockDescription: Story = {
  render: () => (
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
  ),
}

export const SingleSelect: Story = {
  render: function SingleSelectStory() {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    return (
      <ActionList aria-label="Project" role="menu" selectionVariant="single" showDividers>
        {projects.map((project, index) => (
          <ActionList.Item
            key={project.name}
            aria-checked={index === selectedIndex}
            onSelect={() => setSelectedIndex(index)}
            role="menuitemradio"
            selected={index === selectedIndex}
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
  },
}
export const InactiveSingleSelect: Story = {
  render: () => (
    <ActionList role="menu" aria-label="Project" selectionVariant="single">
      <ActionList.Item role="menuitem" inactiveText="Unavailable due to an outage">
        Inactive item
      </ActionList.Item>
      <ActionList.Item role="menuitemradio" selected>
        Item 2
      </ActionList.Item>
    </ActionList>
  ),
}
export const MultiSelect: Story = {
  render: function MultiSelectStory() {
    const [selectedIndices, setSelectedIndices] = React.useState([0])
    const handleSelect = (index: number) => {
      setSelectedIndices(current =>
        current.includes(index) ? current.filter(selected => selected !== index) : [...current, index],
      )
    }
    return (
      <ActionList aria-label="Project" role="menu" selectionVariant="multiple" showDividers>
        {projects.map((project, index) => (
          <ActionList.Item
            key={project.name}
            aria-checked={selectedIndices.includes(index)}
            disabled={index === 3}
            onSelect={() => handleSelect(index)}
            role="menuitemcheckbox"
            selected={selectedIndices.includes(index)}
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
  },
}
export const ListboxSingleSelect: Story = {
  render: function ListboxSingleSelectStory() {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    return (
      <ActionList selectionVariant="single" role="listbox" aria-label="Projects">
        {projects.map((project, index) => (
          <ActionList.Item
            key={project.name}
            selected={selectedIndex === index}
            onSelect={() => setSelectedIndex(index)}
            disabled={index === 3}
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
  },
}
export const ListboxMultiSelect: Story = {
  render: function ListboxMultiSelectStory() {
    const [selectedIndices, setSelectedIndices] = React.useState([0])
    return (
      <ActionList role="menu" selectionVariant="multiple" aria-label="Projects">
        {projects.map((project, index) => (
          <ActionList.Item
            key={project.name}
            role="menuitemcheckbox"
            selected={selectedIndices.includes(index)}
            onSelect={() =>
              setSelectedIndices(current =>
                current.includes(index) ? current.filter(item => item !== index) : [...current, index],
              )
            }
            disabled={index === 3}
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
  },
}
export const WithDynamicContent: Story = {
  render: () => {
    const [active, setActive] = React.useState(false)
    return (
      <ActionList>
        <ActionList.Item onSelect={() => setActive(current => !current)}>
          Activated? {active ? 'Yes' : 'No'}
        </ActionList.Item>
      </ActionList>
    )
  },
}
export const DisabledSelectedMultiselect: Story = {
  render: () => (
    <ActionList role="menu" aria-label="Project" selectionVariant="multiple">
      <ActionList.Item role="menuitemcheckbox" selected disabled>
        Selected disabled item
      </ActionList.Item>
      <ActionList.Item role="menuitemcheckbox">Item 2</ActionList.Item>
    </ActionList>
  ),
}
export const DisabledMultiselect: Story = {
  render: () => (
    <ActionList selectionVariant="multiple" role="menu" aria-label="Project">
      <ActionList.Item role="menuitemcheckbox" selected={false} disabled>
        Disabled item
      </ActionList.Item>
      <ActionList.Item role="menuitemcheckbox" selected={false}>
        Item 2
      </ActionList.Item>
    </ActionList>
  ),
}
export const InactiveMultiselect: Story = {
  render: () => (
    <ActionList role="menu" aria-label="Project" selectionVariant="multiple">
      <ActionList.Item role="menuitem" inactiveText="Unavailable due to an outage">
        Inactive item
      </ActionList.Item>
      <ActionList.Item role="menuitemcheckbox" selected>
        Item 2
      </ActionList.Item>
    </ActionList>
  ),
}
export const DisabledItem: Story = {
  render: function DisabledItemStory() {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    return (
      <ActionList selectionVariant="single" showDividers role="menu" aria-label="Project">
        {projects.map((project, index) => (
          <ActionList.Item
            key={project.name}
            role="menuitemradio"
            selected={index === selectedIndex}
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
  },
}
export const InactiveItem: Story = {
  render: () => (
    <ActionList aria-label="Project">
      {projects.map((project, index) => (
        <ActionList.Item key={project.name} inactiveText={index === 1 ? 'Unavailable due to an outage' : undefined}>
          <ActionList.LeadingVisual>
            <TableIcon />
          </ActionList.LeadingVisual>
          {project.name}
          <ActionList.Description variant="block">{project.scope}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  ),
}
export const LoadingItem: Story = {
  render: () => (
    <ActionList aria-label="Project">
      {projects.map((project, index) => (
        <ActionList.Item key={project.name} loading={index === 1}>
          {project.name}
          <ActionList.Description variant="block">{project.scope}</ActionList.Description>
        </ActionList.Item>
      ))}
    </ActionList>
  ),
}
export const Links: Story = {
  render: () => (
    <ActionList>
      <ActionList.Heading as="h1" className="mx-4 px-0 text-sm">
        Details
      </ActionList.Heading>
      {(
        [
          [BookIcon, 'Readme', 'https://github.com/primer/react#readme'],
          [LawIcon, 'MIT License', 'https://github.com/primer/react/blob/main/LICENSE'],
          [StarIcon, '1.5k stars', 'https://github.com/primer/react/stargazers'],
          [EyeIcon, '21 watching', 'https://github.com/primer/react/watchers'],
          [RepoForkedIcon, '225 forks', 'https://github.com/primer/react/network/members'],
        ] satisfies Array<[React.ElementType, string, string]>
      ).map(([Icon, label, href]) => (
        <ActionList.LinkItem key={label} href={href}>
          <ActionList.LeadingVisual>
            <Icon />
          </ActionList.LeadingVisual>
          {label}
        </ActionList.LinkItem>
      ))}
    </ActionList>
  ),
}
export const CustomItemChildren: Story = {
  render: () => (
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
  ),
}
export const TextWrapAndTruncation: Story = {
  render: () => (
    <div className="max-w-[300px]">
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
          <ActionList.Description>
            This description wraps because it is inline without truncation
          </ActionList.Description>
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
  ),
}
export const ConditionalChildren: Story = {
  render: () => {
    const potentialReviewers = [...teams, ...users]
    return (
      <ActionList showDividers>
        {potentialReviewers.map(reviewer => (
          <ActionList.Item key={'login' in reviewer ? reviewer.login : reviewer.id}>
            <ActionList.LeadingVisual>
              {'type' in reviewer ? (
                <Avatar src={`https://avatars.githubusercontent.com/t/${reviewer.id}`} />
              ) : (
                <Avatar src={`https://avatars.githubusercontent.com/${reviewer.login}`} />
              )}
            </ActionList.LeadingVisual>
            {'login' in reviewer ? reviewer.login : reviewer.slug}
            <ActionList.Description variant={'type' in reviewer ? 'block' : 'inline'}>
              {reviewer.name}
            </ActionList.Description>
            {'type' in reviewer ? (
              <ActionList.TrailingVisual>
                <PeopleIcon />
                {reviewer.members}
              </ActionList.TrailingVisual>
            ) : null}
          </ActionList.Item>
        ))}
      </ActionList>
    )
  },
}
function SideEffectDescription() {
  const [seconds, setSeconds] = React.useState(0)

  React.useEffect(() => {
    const interval = window.setInterval(() => setSeconds(value => value + 1), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return <>{seconds} seconds passed</>
}

export const ChildWithSideEffects: Story = {
  render: () => {
    const user = users[0]
    const [selected, setSelected] = React.useState(true)

    return (
      <ActionList selectionVariant="multiple" role="listbox" aria-label="Assignees">
        <ActionList.Item selected={selected} onSelect={() => setSelected(value => !value)} role="option">
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
  },
}
export const InsideOverlay: Story = {
  render: () => <button type="button">toggle overlay</button>,
}
export const GroupWithSubtleTitle: Story = {
  render: function GroupWithSubtleTitleStory() {
    const [assignees, setAssignees] = React.useState(users.slice(0, 1))
    return (
      <ActionList selectionVariant="multiple" role="menu" showDividers aria-label="Reviewers">
        <ActionList.Group>
          <ActionList.GroupHeading>Everyone</ActionList.GroupHeading>
          {users.slice(2).map(user => {
            const selected = assignees.some(assignee => assignee.login === user.login)
            return (
              <ActionList.Item
                role="menuitemcheckbox"
                key={user.login}
                selected={selected}
                onSelect={() =>
                  setAssignees(current =>
                    selected ? current.filter(assignee => assignee.login !== user.login) : [...current, user],
                  )
                }
              >
                <ActionList.LeadingVisual>
                  <Avatar src={`https://github.com/${user.login}.png`} />
                </ActionList.LeadingVisual>
                {user.login}
                <ActionList.Description>{user.name}</ActionList.Description>
              </ActionList.Item>
            )
          })}
        </ActionList.Group>
      </ActionList>
    )
  },
}
export const GroupWithFilledTitle: Story = {
  render: function GroupWithFilledTitleStory() {
    const [assignees, setAssignees] = React.useState(users.slice(0, 1))
    return (
      <ActionList selectionVariant="multiple" role="menu" showDividers aria-label="Reviewers">
        <ActionList.Group>
          <ActionList.GroupHeading variant="filled">Everyone</ActionList.GroupHeading>
          {users.slice(2).map(user => {
            const selected = assignees.some(assignee => assignee.login === user.login)
            return (
              <ActionList.Item
                role="menuitemcheckbox"
                key={user.login}
                selected={selected}
                onSelect={() =>
                  setAssignees(current =>
                    selected ? current.filter(assignee => assignee.login !== user.login) : [...current, user],
                  )
                }
              >
                <ActionList.LeadingVisual>
                  <Avatar src={`https://github.com/${user.login}.png`} />
                </ActionList.LeadingVisual>
                {user.login}
                <ActionList.Description>{user.name}</ActionList.Description>
              </ActionList.Item>
            )
          })}
        </ActionList.Group>
      </ActionList>
    )
  },
}
export const WithCustomTrailingVisuals: Story = {
  render: () => (
    <ActionList>
      {(
        [
          [IssueOpenedIcon, 'Issues', 20],
          [GitPullRequestIcon, 'PRs', 12],
          [ProjectIcon, 'Projects', 2],
        ] satisfies Array<[React.ElementType, string, number]>
      ).map(([Icon, label, count]) => (
        <ActionList.Item key={label}>
          <ActionList.LeadingVisual>
            <Icon />
          </ActionList.LeadingVisual>
          {label}
          <ActionList.TrailingVisual>
            <CounterLabel>{count}</CounterLabel>
          </ActionList.TrailingVisual>
        </ActionList.Item>
      ))}
    </ActionList>
  ),
}
export const WithKeyboardShortcuts: Story = {
  render: () => (
    <ActionList>
      {[
        ['New file', 'Mod+N'],
        ['Open file', 'Mod+O'],
        ['Save', 'Mod+S'],
      ].map(([label, keys]) => (
        <ActionList.Item key={label}>
          {label}
          <ActionList.TrailingVisual>
            <KeybindingHint keys={keys} />
          </ActionList.TrailingVisual>
        </ActionList.Item>
      ))}
      <ActionList.Divider />
      <ActionList.Item variant="danger">
        Delete
        <ActionList.TrailingVisual>
          <KeybindingHint keys="Mod+D" />
        </ActionList.TrailingVisual>
      </ActionList.Item>
    </ActionList>
  ),
}
export const WithTrailingCount: Story = {
  render: () => (
    <ActionList>
      {(
        [
          [IssueOpenedIcon, 'Open issues', 24],
          [GitPullRequestIcon, 'Pull requests', 8],
          [ProjectIcon, 'Projects', 3],
        ] satisfies Array<[React.ElementType, string, number]>
      ).map(([Icon, label, count]) => (
        <ActionList.Item key={label}>
          <ActionList.LeadingVisual>
            <Icon />
          </ActionList.LeadingVisual>
          {label}
          <ActionList.TrailingVisual>
            <CounterLabel>{count}</CounterLabel>
          </ActionList.TrailingVisual>
        </ActionList.Item>
      ))}
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
  ),
}
export const WithTrailingAction: Story = {
  render: function WithTrailingActionStory() {
    const [loadingState, setLoadingState] = React.useState(false)

    React.useEffect(() => {
      const interval = window.setInterval(() => setLoadingState(current => !current), 2500)
      return () => window.clearInterval(interval)
    }, [])

    return (
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
          <ActionList.TrailingAction as="a" href="#" label="Some action 5" />
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
    )
  },
}
export const WithTrailingActionOnGroupHeading: Story = {
  render: () => (
    <ActionList>
      <ActionList.Group>
        <ActionList.GroupHeading>
          Custom fields
          <ActionList.GroupHeading.TrailingAction label="New field" icon={ProjectIcon} />
        </ActionList.GroupHeading>
        <ActionList.Item>
          <ActionList.LeadingVisual>
            <FileDirectoryIcon />
          </ActionList.LeadingVisual>
          Field 1
        </ActionList.Item>
        <ActionList.Item>
          <ActionList.LeadingVisual>
            <FileDirectoryIcon />
          </ActionList.LeadingVisual>
          Field 2
        </ActionList.Item>
      </ActionList.Group>
      <ActionList.Group>
        <ActionList.GroupHeading variant="filled">
          Repositories
          <ActionList.GroupHeading.TrailingAction as="a" href="#" label="Manage repositories" icon={ProjectIcon} />
        </ActionList.GroupHeading>
        <ActionList.Item>primer/react</ActionList.Item>
        <ActionList.Item>primer/primitives</ActionList.Item>
      </ActionList.Group>
    </ActionList>
  ),
}
export const FullVariant: Story = {
  render: () => (
    <ActionList variant="full">
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Quote reply</ActionList.Item>
      <ActionList.Item>Edit comment</ActionList.Item>
      <ActionList.Divider />
      <ActionList.Item variant="danger">Delete file</ActionList.Item>
    </ActionList>
  ),
}
export const LargeItem: Story = {
  render: () => (
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
  ),
}
