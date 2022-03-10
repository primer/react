import {Meta} from '@storybook/react'
import React from 'react'
import {
  TypographyIcon,
  LawIcon,
  StarIcon,
  RepoForkedIcon,
  TableIcon,
  PeopleIcon,
  CalendarIcon,
  IssueOpenedIcon,
  NumberIcon,
  BookIcon,
  EyeIcon,
  XIcon
} from '@primer/octicons-react'

import {ThemeProvider} from '../..'
import {ActionList} from '../../ActionList'
import BaseStyles from '../../BaseStyles'
import Avatar from '../../Avatar'
import TextInput from '../../TextInput'
import Spinner from '../../Spinner'
import Box from '../../Box'
import Text from '../../Text'

const meta: Meta = {
  title: 'Composite components/ActionList/examples',
  component: ActionList,
  decorators: [
    (Story: React.ComponentType): JSX.Element => (
      <ThemeProvider>
        <BaseStyles>
          <Story />
        </BaseStyles>
      </ThemeProvider>
    )
  ],
  parameters: {
    controls: {
      disable: true
    }
  }
}
export default meta

export function WithLinks(): JSX.Element {
  return (
    <>
      <h1>With Links</h1>

      <p>This pattern can be seen in the repository sidebar, containing a list of links</p>

      <ActionList>
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
}

export function SingleSelection(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  const options = [
    {text: 'Status', icon: <IssueOpenedIcon />},
    {text: 'Stage', icon: <TableIcon />},
    {text: 'Assignee', icon: <PeopleIcon />},
    {text: 'Team', icon: <TypographyIcon />, disabled: true},
    {text: 'Estimate', icon: <NumberIcon />},
    {text: 'Due Date', icon: <CalendarIcon />}
  ]

  return (
    <>
      <h1>Single Selection</h1>

      <p>This pattern appears inside a nested menu in Memex view options.</p>

      <ActionList aria-label="Group items by" selectionVariant="single" role="listbox">
        {options.map((option, index) => (
          <ActionList.Item
            key={index}
            selected={index === selectedIndex}
            onSelect={() => setSelectedIndex(index)}
            disabled={option.disabled}
            role="option"
          >
            <ActionList.LeadingVisual>{option.icon}</ActionList.LeadingVisual>
            {option.text}
          </ActionList.Item>
        ))}
      </ActionList>
    </>
  )
}

const users = [
  {login: 'pksjce', name: 'Pavithra Kodmad'},
  {login: 'jfuchs', name: 'Jonathan Fuchs'},
  {login: 'colebemis', name: 'Cole Bemis'},
  {login: 'mperrotti', name: 'Mike Perrotti'},
  {login: 'dgreif', name: 'Dusty Greif'},
  {login: 'smockle', name: 'Clay Miller'},
  {login: 'siddharthkp', name: 'Siddharth Kshetrapal'}
]

export function MultipleSelection(): JSX.Element {
  const [assignees, setAssignees] = React.useState(users.slice(0, 2))

  const toggleAssignee = (assignee: typeof users[number]) => {
    const assigneeIndex = assignees.findIndex(a => a.login === assignee.login)

    if (assigneeIndex === -1) setAssignees([...assignees, assignee])
    else setAssignees(assignees.filter((_, index) => index !== assigneeIndex))
  }

  return (
    <>
      <h1>Multi Select List</h1>

      <p>This pattern appears in issues and pull requests to pick multiple assignees</p>

      <ActionList selectionVariant="multiple" showDividers role="listbox" aria-label="Select assignees">
        {users.map(user => (
          <ActionList.Item
            role="option"
            key={user.login}
            selected={Boolean(assignees.find(assignee => assignee.login === user.login))}
            onSelect={() => toggleAssignee(user)}
          >
            <ActionList.LeadingVisual>
              <Avatar src={`https://github.com/${user.login}.png`} />
            </ActionList.LeadingVisual>
            {user.login}
            <ActionList.Description>{user.name}</ActionList.Description>
          </ActionList.Item>
        ))}
      </ActionList>
    </>
  )
}

export function Groups(): JSX.Element {
  const [assignees, setAssignees] = React.useState(users.slice(0, 1))

  const toggleAssignee = (assignee: typeof users[number]) => {
    const assigneeIndex = assignees.findIndex(a => a.login === assignee.login)

    if (assigneeIndex === -1) setAssignees([...assignees, assignee])
    else setAssignees(assignees.filter((_, index) => index !== assigneeIndex))
  }

  return (
    <>
      <h1>Groups & Descriptions</h1>

      <p>Grouped content with labels and description. This patterns appears in pull requests to pick a reviewer.</p>

      <ActionList selectionVariant="multiple" role="menu" showDividers aria-label="Select reviewers">
        <ActionList.Group title="Suggestions">
          {users.slice(0, 2).map(user => (
            <ActionList.Item
              key={user.login}
              role="menuitemcheckbox"
              selected={Boolean(assignees.find(assignee => assignee.login === user.login))}
              aria-checked={Boolean(assignees.find(assignee => assignee.login === user.login))}
              onSelect={() => toggleAssignee(user)}
            >
              <ActionList.LeadingVisual>
                <Avatar src={`https://github.com/${user.login}.png`} />
              </ActionList.LeadingVisual>
              {user.login}
              <ActionList.Description>{user.name}</ActionList.Description>
              <ActionList.Description variant="block">Recently edited these files</ActionList.Description>
            </ActionList.Item>
          ))}
        </ActionList.Group>
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
    </>
  )
}

const branches = [
  'main',
  'composable-dropdown',
  'exports',
  'label-to-beta',
  'reexport-behaviors',
  'changeset-release/main',
  'dependabot/npm_and_yarn/docs/engine.io-4.1.2',
  'ci-order',
  'mdx-components',
  'emoji-picker-api'
]

const filterSlowly = async (query: string) => {
  // sleep for 1s before returning results
  await new Promise(resolve => setTimeout(resolve, 1000))
  return await branches.filter(name => name.includes(query))
}

export function MixedSelection(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(1)

  const options = [
    {text: 'Status', icon: <IssueOpenedIcon />},
    {text: 'Stage', icon: <TableIcon />},
    {text: 'Assignee', icon: <PeopleIcon />},
    {text: 'Team', icon: <TypographyIcon />},
    {text: 'Estimate', icon: <NumberIcon />},
    {text: 'Due Date', icon: <CalendarIcon />}
  ]

  return (
    <>
      <h1>List with mixed selection</h1>

      <p>
        In this list, there is a ActionList.Group with single selection for picking one option, followed by a Item that
        is an action. This pattern appears inside a menu for selection view options in Memex
      </p>

      <ActionList>
        <ActionList.Group title="Group by" selectionVariant="single" role="listbox">
          {options.map((option, index) => (
            <ActionList.Item
              key={index}
              selected={index === selectedIndex}
              onSelect={() => setSelectedIndex(index)}
              role="option"
            >
              <ActionList.LeadingVisual>{option.icon}</ActionList.LeadingVisual>
              {option.text}
            </ActionList.Item>
          ))}
        </ActionList.Group>
        {typeof selectedIndex === 'number' && (
          <>
            <ActionList.Divider />
            <ActionList.Item onSelect={() => setSelectedIndex(null)}>
              <ActionList.LeadingVisual>
                <XIcon />
              </ActionList.LeadingVisual>
              Clear Group by
            </ActionList.Item>
          </>
        )}
      </ActionList>
    </>
  )
}

export function AsyncListWithSpinner(): JSX.Element {
  const [results, setResults] = React.useState(branches.slice(0, 6))
  const [loading, setLoading] = React.useState(false)
  const [selected, setSelected] = React.useState('main')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter = async (event: any) => {
    setLoading(true)
    const filteredResults = await filterSlowly(event.target.value)
    setResults(filteredResults.slice(0, 6))
    setLoading(false)
  }

  return (
    <>
      <h1>Async List</h1>
      <p>
        This pattern has an ActionList with single selection, the contents of which can change asynchronously through a
        filter. This pattern can be found in branch selection menus via the SelectPanel component.
      </p>

      <TextInput onChange={filter} placeholder="Search branches" sx={{m: 2, mb: 0, width: 'calc(100% - 16px)'}} />
      {results.length === 0 ? (
        <Text sx={{display: 'block', fontSize: 1, m: 2}}>No branches match that query</Text>
      ) : null}
      <ActionList
        selectionVariant="single"
        role="listbox"
        aria-label="Select a branch"
        sx={{height: 208, overflow: 'auto'}}
      >
        {loading ? (
          <Box sx={{display: 'flex', justifyContent: 'center', pt: 2}}>
            <Spinner />
          </Box>
        ) : (
          results.map(name => (
            <ActionList.Item key={name} role="option" selected={selected === name} onSelect={() => setSelected(name)}>
              {name}
            </ActionList.Item>
          ))
        )}
      </ActionList>
    </>
  )
}
