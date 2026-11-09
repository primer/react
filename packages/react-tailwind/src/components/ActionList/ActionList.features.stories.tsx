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
  PlusIcon,
  ProjectIcon,
  RepoForkedIcon,
  StarIcon,
  TableIcon,
} from '@primer/octicons-react'
import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {ListContainerContext} from '../../internal/listContainer'
import {Avatar} from '../Avatar'
import {CounterLabel} from '../CounterLabel'
import {FeatureFlags} from '../FeatureFlags'
import {Heading} from '../Heading'
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

export const StaticItems: Story = {
  render: () => (
    <ActionList aria-label="Repository statuses">
      <ActionList.Item
        role="listitem"
        leadingVisual={<BookIcon />}
        description="Owned by octocat"
        trailingVisual={<span data-testid="passive-trailing">Changes blocked by enterprise</span>}
      >
        primer/react
      </ActionList.Item>
      <ActionList.Item
        role="listitem"
        trailingAction={<ActionList.TrailingAction as="a" href="#details" icon={ArrowRightIcon} label="View details" />}
      >
        Repository details
      </ActionList.Item>
    </ActionList>
  ),
}

function WrappedRepositoryDescription(_props: {id?: string; variant?: 'block' | 'inline'}) {
  // eslint-disable-next-line primer-react/direct-slot-children -- The wrapper is supplied through the description region.
  return <ActionList.Description variant="block">Recently updated</ActionList.Description>
}

export const ItemDescriptions: Story = {
  render: function ItemDescriptionsStory() {
    const [selected, setSelected] = React.useState(false)
    return (
      <>
        <ActionList aria-label="Repository actions">
          <ActionList.Item>
            Archive
            <ActionList.Description variant="block">Move the repository out of active lists</ActionList.Description>
          </ActionList.Item>
          <ActionList.LinkItem
            aria-describedby="repository-detail"
            description={<WrappedRepositoryDescription id="repository-detail" variant="block" />}
            href="#repository"
            trailingVisual={<ActionList.TrailingVisual>Ready</ActionList.TrailingVisual>}
          >
            Repository
          </ActionList.LinkItem>
        </ActionList>
        <ActionList.Listbox aria-label="Project choices" selectionVariant="single">
          <ActionList.Item onSelect={() => setSelected(true)} selected={selected}>
            Primer React
            <ActionList.Description>Design system</ActionList.Description>
          </ActionList.Item>
        </ActionList.Listbox>
        <p role="status">Selected: {selected ? 'Primer React' : 'none'}</p>
      </>
    )
  },
}

export const TreeWithManagedFocus: Story = {
  render: function TreeWithManagedFocusStory() {
    const items = ['First project', 'Unavailable project', 'Last project']
    const [activeIndex, setActiveIndex] = React.useState(0)
    const [activated, setActivated] = React.useState<string | null>(null)

    return (
      <>
        <ActionList
          aria-label="Projects"
          aria-multiselectable="true"
          onKeyDown={event => {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
            event.preventDefault()
            const offset = event.key === 'ArrowDown' ? 1 : -1
            const nextIndex = Math.max(0, Math.min(items.length - 1, activeIndex + offset))
            setActiveIndex(nextIndex)
            event.currentTarget.querySelectorAll<HTMLElement>('[role="treeitem"]')[nextIndex].focus()
          }}
          role="tree"
          selectionVariant="multiple"
        >
          {items.map((item, index) => (
            <ActionList.Item
              key={item}
              aria-checked={index === 1 ? 'mixed' : activated === item}
              disabled={index === 1}
              onFocus={() => setActiveIndex(index)}
              onSelect={() => setActivated(item)}
              tabIndex={index === activeIndex ? 0 : -1}
            >
              {item}
            </ActionList.Item>
          ))}
        </ActionList>
        <p role="status">Last activated: {activated ?? 'none'}</p>
      </>
    )
  },
}

export const DirectTreeItems: Story = {
  render: function DirectTreeItemsStory() {
    const [activeIndex, setActiveIndex] = React.useState(0)
    const [activated, setActivated] = React.useState<string | null>(null)
    const [activationCount, setActivationCount] = React.useState(0)
    const [expanded, setExpanded] = React.useState(true)

    return (
      <>
        <ActionList
          aria-label="Projects"
          aria-multiselectable="true"
          disableFocusZone
          onKeyDown={event => {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
            event.preventDefault()
            const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="treeitem"]')).filter(
              item => item.getClientRects().length > 0,
            )
            const offset = event.key === 'ArrowDown' ? 1 : -1
            const nextIndex = Math.max(0, Math.min(items.length - 1, activeIndex + offset))
            setActiveIndex(nextIndex)
            items[nextIndex].focus()
          }}
          role="tree"
          selectionVariant="multiple"
        >
          <li
            aria-checked="mixed"
            aria-expanded={expanded}
            aria-label="Project group"
            aria-level={1}
            onFocus={event => {
              if (event.target === event.currentTarget) setActiveIndex(0)
            }}
            onKeyDown={event => {
              if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault()
                setExpanded(value => !value)
              }
            }}
            // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- Selection is represented by aria-checked.
            role="treeitem"
            tabIndex={activeIndex === 0 ? 0 : -1}
          >
            <ActionList.GroupHeading as="div">Projects</ActionList.GroupHeading>
            <div hidden={!expanded}>
              <ul aria-label="Projects" role="group">
                <ActionList.TreeItem
                  aria-checked="mixed"
                  aria-level={2}
                  disabled
                  onFocus={() => setActiveIndex(1)}
                  onSelect={() => {
                    setActivated('Unavailable project')
                    setActivationCount(count => count + 1)
                  }}
                  tabIndex={activeIndex === 1 ? 0 : -1}
                >
                  Unavailable project
                  {/* eslint-disable-next-line primer-react/direct-slot-children -- TreeItem accepts Item content parts. */}
                  <ActionList.Description>Archived</ActionList.Description>
                </ActionList.TreeItem>
                <ActionList.TreeItem
                  aria-checked={activated === 'Primer React'}
                  aria-level={2}
                  onFocus={() => setActiveIndex(2)}
                  onSelect={() => {
                    setActivated('Primer React')
                    setActivationCount(count => count + 1)
                  }}
                  tabIndex={activeIndex === 2 ? 0 : -1}
                >
                  Primer React
                  {/* eslint-disable-next-line primer-react/direct-slot-children -- TreeItem accepts Item content parts. */}
                  <ActionList.TrailingVisual>
                    <CounterLabel>3</CounterLabel>
                  </ActionList.TrailingVisual>
                </ActionList.TreeItem>
              </ul>
            </div>
          </li>
        </ActionList>
        <p role="status">
          Last activated: {activated ?? 'none'}; count: {activationCount}
        </p>
      </>
    )
  },
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
      <h1
        id="list-heading"
        className="m-0 mx-4 text-[length:var(--text-title-size-medium)] leading-[30px] font-semibold"
      >
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

const ExampleRouterLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {onNavigate: (path: string) => void; to: string}
>(function ExampleRouterLink({children, onClick, onNavigate, to, ...props}, ref) {
  return (
    <a
      {...props}
      href={to}
      onClick={event => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          event.preventDefault()
          onNavigate(to)
        }
      }}
      ref={ref}
    >
      {children}
    </a>
  )
})

export const DirectListbox: Story = {
  render: function DirectListboxStory() {
    const [selected, setSelected] = React.useState('First project')
    const [path, setPath] = React.useState('/')

    return (
      <>
        <ActionList.Listbox aria-label="Select a project" selectionVariant="single" showDividers>
          <ActionList.Listbox.Divider data-testid="first-divider" />
          <ActionList.Item
            aria-describedby="first-project-description"
            aria-label="First project"
            onSelect={() => setSelected('First project')}
            selected={selected === 'First project'}
          >
            First project
            <ActionList.Description id="first-project-description">Recently updated</ActionList.Description>
          </ActionList.Item>
          <ActionList.Listbox.Divider />
          <ActionList.Listbox.Group aria-label="Repositories">
            <ActionList.GroupHeading variant="filled">Repositories</ActionList.GroupHeading>
            <ActionList.Item disabled onSelect={() => setSelected('Unavailable project')}>
              Unavailable project
            </ActionList.Item>
            <ActionList.LinkItem
              inactiveText="Temporarily unavailable"
              render={<ExampleRouterLink onNavigate={setPath} to="/unavailable" />}
            >
              Unavailable link
            </ActionList.LinkItem>
            <ActionList.Item onSelect={() => setSelected('Primer React')} selected={selected === 'Primer React'}>
              Primer React
              <ActionList.TrailingVisual>
                <CounterLabel>3</CounterLabel>
              </ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.LinkItem
              aria-selected="false"
              render={<ExampleRouterLink onNavigate={setPath} to="/repositories" />}
            >
              Browse repositories
            </ActionList.LinkItem>
          </ActionList.Listbox.Group>
        </ActionList.Listbox>
        <p role="status">
          Selected: {selected}; current path: {path}
        </p>
      </>
    )
  },
}

function WrappedProjectGroupHeading({id}: {id?: string}) {
  return <ActionList.GroupHeading id={id}>Libraries</ActionList.GroupHeading>
}

export const GroupHeadingAuxiliaryText: Story = {
  render: function GroupHeadingAuxiliaryTextStory() {
    const [lastAction, setLastAction] = React.useState('None')
    return (
      <>
        <ActionList aria-label="Repository actions">
          <ActionList.Group>
            <ActionList.GroupHeading auxiliaryText="Recently updated by your team" data-testid="group-heading-label">
              Repositories
              <ActionList.GroupHeading.TrailingAction
                icon={ArrowRightIcon}
                label="Manage repositories"
                onClick={() => setLastAction('Manage repositories')}
              />
            </ActionList.GroupHeading>
            <ActionList.Item>
              Primer React
              <ActionList.TrailingAction
                icon={ArrowRightIcon}
                label="Repository details"
                onClick={() => setLastAction('Repository details')}
              />
            </ActionList.Item>
          </ActionList.Group>
        </ActionList>
        <ActionList.Listbox aria-label="Projects">
          <ActionList.Listbox.Group auxiliaryText="Additional projects" heading={<WrappedProjectGroupHeading />}>
            <ActionList.Item>Octicons</ActionList.Item>
          </ActionList.Listbox.Group>
        </ActionList.Listbox>
        <p role="status">Last action: {lastAction}</p>
      </>
    )
  },
}

export const DirectListboxVisualParity: Story = {
  render: () => {
    const rows = (divider: React.ReactNode) => (
      <>
        <ActionList.Item selected>Selected project</ActionList.Item>
        <ActionList.Item disabled>Unavailable project</ActionList.Item>
        {divider}
        <ActionList.Item active>Active project</ActionList.Item>
        <ActionList.Item variant="danger">Remove project</ActionList.Item>
      </>
    )
    return (
      <div className="grid grid-cols-2 gap-4">
        <ActionList
          aria-label="Standard actions"
          data-testid="standard-actions"
          selectionVariant="multiple"
          showDividers
        >
          {rows(<ActionList.Divider />)}
        </ActionList>
        <ActionList.Listbox
          aria-label="Selectable actions"
          data-testid="selectable-actions"
          selectionVariant="multiple"
          showDividers
        >
          {rows(<ActionList.Listbox.Divider />)}
        </ActionList.Listbox>
      </div>
    )
  },
}

export const RouterLinkComposition: Story = {
  render: () => {
    const [path, setPath] = React.useState('/')
    return (
      <>
        <ActionList>
          <ActionList.LinkItem
            aria-label="Native projects link"
            data-testid="native-link"
            href="#projects"
            size="small"
          >
            <ActionList.LeadingVisual>
              <BookIcon />
            </ActionList.LeadingVisual>
            Projects
            <ActionList.Description>View projects</ActionList.Description>
          </ActionList.LinkItem>
          <ActionList.LinkItem
            aria-label="Router projects link"
            data-testid="router-link"
            render={<ExampleRouterLink onNavigate={setPath} to="/projects" />}
            size="small"
          >
            <ActionList.LeadingVisual>
              <BookIcon />
            </ActionList.LeadingVisual>
            Projects
            <ActionList.Description>View projects</ActionList.Description>
          </ActionList.LinkItem>
        </ActionList>
        <p role="status">Current path: {path}</p>
      </>
    )
  },
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
  render: function InactiveSingleSelectStory() {
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
  },
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
export const InactiveReasons: Story = {
  render: () => (
    <ActionList aria-label="Project actions">
      <ActionList.Item inactiveText="Contact an administrator to grant project:configure_administration_and_billing_permissions.">
        <ActionList.LeadingVisual>
          <ProjectIcon />
        </ActionList.LeadingVisual>
        Transfer project
      </ActionList.Item>
      <ActionList.LinkItem
        href="#billing"
        inactiveText={<span>Billing details are available to organization owners.</span>}
      >
        Billing settings
      </ActionList.LinkItem>
      <ActionList.LinkItem href="#security" inactiveText="Contact an owner to update security settings.">
        <ActionList.LeadingVisual>
          <ProjectIcon />
        </ActionList.LeadingVisual>
        Security settings
        <ActionList.TrailingVisual>Admin</ActionList.TrailingVisual>
      </ActionList.LinkItem>
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
      <ActionList.Heading as="h1" className="mx-4 text-sm">
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
        <ActionList.GroupHeading as="h3">
          Custom fields
          <ActionList.GroupHeading.TrailingAction label="New field" icon={PlusIcon} />
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
        <ActionList.GroupHeading as="h3" variant="filled">
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
export const SmallItem: Story = {
  render: () => (
    <ActionList>
      <ActionList.Item size="small">Small item</ActionList.Item>
      <ActionList.Item size="small">
        Small item
        <ActionList.Description>With inline description</ActionList.Description>
      </ActionList.Item>
      <ActionList.Item size="small">
        Small item
        <ActionList.Description variant="block">With block description</ActionList.Description>
      </ActionList.Item>
    </ActionList>
  ),
}
export const DisableItemGap: Story = {
  render: () => (
    <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
      {/* The item gap only applies inside a NavList, so the story provides that container directly. */}
      <ListContainerContext.Provider value="NavList">
        <Heading as="h3">Default item gap</Heading>
        <ActionList>
          <ActionList.Item>Copy link</ActionList.Item>
          <ActionList.Item>Quote reply</ActionList.Item>
          <ActionList.Item>Edit comment</ActionList.Item>
        </ActionList>

        <Heading as="h3">Item gap disabled</Heading>
        <ActionList disableItemGap>
          <ActionList.Item>Copy link</ActionList.Item>
          <ActionList.Item>Quote reply</ActionList.Item>
          <ActionList.Item>Edit comment</ActionList.Item>
        </ActionList>
      </ListContainerContext.Provider>
    </FeatureFlags>
  ),
}
