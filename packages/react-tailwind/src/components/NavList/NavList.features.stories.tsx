import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  FileDirectoryIcon,
  GitCommitIcon,
  IssueOpenedIcon,
  PeopleIcon,
  RepoIcon,
} from '@primer/octicons-react'
import {expect, userEvent, within} from 'storybook/test'
import {useState} from 'react'
import {PageLayout} from '../PageLayout'
import {NavList} from './NavList'

const meta = {
  title: 'React Tailwind/Navigation/NavList/Features',
  component: NavList,
  parameters: {layout: 'fullscreen'},
} satisfies Meta<typeof NavList>
export default meta
type Story = StoryObj<typeof meta>

function PageLayoutNav({children}: {children: React.ReactNode}) {
  return (
    <PageLayout>
      <PageLayout.Pane position="start">{children}</PageLayout.Pane>
      <PageLayout.Content />
    </PageLayout>
  )
}

const childItems = (
  <NavList.SubNav.Panel>
    <NavList.Item href="#sub-item-1" aria-current="page">
      Sub item 1
    </NavList.Item>
    <NavList.Item href="#sub-item-2">Sub item 2</NavList.Item>
  </NavList.SubNav.Panel>
)
export const WithSubItems: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Item href="#item-1">Item 1</NavList.Item>
        <NavList.SubNav defaultOpen>
          <NavList.SubNav.Trigger>Item 2</NavList.SubNav.Trigger>
          {childItems}
        </NavList.SubNav>
        <NavList.Item href="#item-3">Item 3</NavList.Item>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithNestedSubItems: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.SubNav defaultOpen>
          <NavList.SubNav.Trigger>Item 1</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="#sub-item-1">Sub item 1</NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
        <NavList.SubNav defaultOpen>
          <NavList.SubNav.Trigger>Item 2</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.SubNav defaultOpen>
              <NavList.SubNav.Trigger>Sub item 1</NavList.SubNav.Trigger>
              <NavList.SubNav.Panel>
                <NavList.SubNav defaultOpen>
                  <NavList.SubNav.Trigger>Sub item 1.1</NavList.SubNav.Trigger>
                  <NavList.SubNav.Panel>
                    <NavList.Item href="#sub-item-1-1-1">Sub item 1.1.1</NavList.Item>
                    <NavList.SubNav defaultOpen>
                      <NavList.SubNav.Trigger>Sub item 1.1.2</NavList.SubNav.Trigger>
                      <NavList.SubNav.Panel>
                        <NavList.Item href="#sub-item-1-1-2-1">Sub item 1.1.2.1</NavList.Item>
                        <NavList.Item href="#sub-item-1-1-2-2" aria-current="page">
                          Sub item 1.1.2.2
                        </NavList.Item>
                      </NavList.SubNav.Panel>
                    </NavList.SubNav>
                  </NavList.SubNav.Panel>
                </NavList.SubNav>
                <NavList.Item href="#sub-item-1-2">Sub item 1.2</NavList.Item>
              </NavList.SubNav.Panel>
            </NavList.SubNav>
            <NavList.Item href="#sub-item-2">Sub item 2</NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
        <NavList.Item href="#item-3">Item 3</NavList.Item>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithInactiveItems: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Item href="#item-1" inactiveText="Unavailable due to an outage">
          Item 1
        </NavList.Item>
        <NavList.SubNav defaultOpen>
          <NavList.SubNav.Trigger>Item 2</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="#sub-item-1" aria-current="page">
              Sub item 1
            </NavList.Item>
            <NavList.Item href="#sub-item-2" inactiveText="Unavailable due to an outage">
              Sub item 2
            </NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
        <NavList.Item href="#item-3">Item 3</NavList.Item>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithGroup: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Group title="Group 1">
          <NavList.Item aria-current="true" href="#item-1-a">
            Item 1A
          </NavList.Item>
          <NavList.Item href="#item-1-b">Item 1B</NavList.Item>
          <NavList.Item href="#item-1-c">Item 1C</NavList.Item>
        </NavList.Group>
        <NavList.Group title="Group 2">
          <NavList.Item href="#item-2-a">Item 2A</NavList.Item>
          <NavList.Item href="#item-2-b">Item 2B</NavList.Item>
          <NavList.Item href="#item-2-c">Item 2C</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithGroupHeadingLinks: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Group>
          <NavList.GroupHeading>
            <a href="#group-1">Group 1</a>
          </NavList.GroupHeading>
          <NavList.Item aria-current="true" href="#item-1-a">
            Item 1A
          </NavList.Item>
          <NavList.Item href="#item-1-b">Item 1B</NavList.Item>
          <NavList.Item href="#item-1-c">Item 1C</NavList.Item>
        </NavList.Group>
        <NavList.Group>
          <NavList.GroupHeading>
            <a href="#group-2">Group 2</a>
          </NavList.GroupHeading>
          <NavList.Item href="#item-2-a">Item 2A</NavList.Item>
          <NavList.Item href="#item-2-b">Item 2B</NavList.Item>
          <NavList.Item href="#item-2-c">Item 2C</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithTrailingAction: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Item>
          <NavList.LeadingVisual>
            <FileDirectoryIcon />
          </NavList.LeadingVisual>
          Item 1
          <NavList.TrailingAction label="Expand sidebar" icon={ArrowLeftIcon} />
        </NavList.Item>
        <NavList.Item>
          Item 2
          <NavList.TrailingAction as="a" href="#" label="Some action" icon={ArrowRightIcon} />
        </NavList.Item>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithTrailingActionInSubItem: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Item>
          <NavList.LeadingVisual>
            <FileDirectoryIcon />
          </NavList.LeadingVisual>
          Item 1
          <NavList.TrailingAction label="Expand sidebar" icon={ArrowLeftIcon} />
        </NavList.Item>
        <NavList.Item>
          Item 2
          <NavList.TrailingAction as="a" href="#" label="Some action" icon={ArrowRightIcon} />
        </NavList.Item>
        <NavList.SubNav>
          <NavList.SubNav.Trigger>Item 3</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="#sub-item-1">
              Sub item 1
              <NavList.TrailingAction label="Another action" icon={BookIcon} />
            </NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithExpand: Story = {
  render: function ExpandStory() {
    const [expanded, setExpanded] = useState(false)
    return (
      <PageLayoutNav>
        <NavList aria-label="Settings">
          <NavList.Item href="#item-1" aria-current="page">
            Item 1
          </NavList.Item>
          <NavList.Item href="#item-2">Item 2</NavList.Item>
          <NavList.Item href="#item-3">Item 3</NavList.Item>
          {expanded ? (
            [4, 5, 6, 7, 8, 9].map(item => (
              <NavList.Item key={item} href={`#item-${item}`}>
                Item {item}
              </NavList.Item>
            ))
          ) : (
            <li className="list-none">
              <button
                type="button"
                className="flex h-8 w-full appearance-none items-center rounded-md border-0 bg-transparent px-2 py-1 text-left text-base leading-5 text-default hover:bg-muted focus-visible:outline-2 focus-visible:outline-focus"
                onClick={() => setExpanded(true)}
              >
                Show more
              </button>
            </li>
          )}
        </NavList>
      </PageLayoutNav>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Show more'}))
    await expect(canvas.getByRole('link', {name: 'Item 9'})).toBeVisible()
  },
}
export const WithExpandAndIcons: Story = {
  ...WithExpand,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Show more'}))
    await expect(canvas.getByRole('link', {name: 'Item 9'})).toBeVisible()
  },
}
export const WithDescription: Story = {
  render: () => (
    <NavList aria-label="Settings">
      <NavList.Item href="#main" aria-current="page">
        <NavList.LeadingVisual>
          <RepoIcon />
        </NavList.LeadingVisual>
        Main Repository
        <NavList.Description>Primary project repository</NavList.Description>
      </NavList.Item>
      <NavList.Item href="#docs">
        <NavList.LeadingVisual>
          <BookIcon />
        </NavList.LeadingVisual>
        Documentation
        <NavList.Description>User guides and API documentation</NavList.Description>
      </NavList.Item>
      <NavList.Item href="#bugs">
        <NavList.LeadingVisual>
          <IssueOpenedIcon />
        </NavList.LeadingVisual>
        Bug Reports
        <NavList.Description variant="block">
          Submit and track bug reports for the project. Include detailed steps to reproduce, expected behavior, and
          system information.
        </NavList.Description>
      </NavList.Item>
      <NavList.Item href="#community">
        <NavList.LeadingVisual>
          <PeopleIcon />
        </NavList.LeadingVisual>
        Community
        <NavList.Description variant="block">
          Connect with other developers, share ideas, and collaborate on features and improvements.
        </NavList.Description>
      </NavList.Item>
      <NavList.Item href="#changes">
        <NavList.LeadingVisual>
          <GitCommitIcon />
        </NavList.LeadingVisual>
        Recent Changes
        <NavList.Description>Latest commits and releases</NavList.Description>
      </NavList.Item>
    </NavList>
  ),
}
export const WithItemGap: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings" className="[&_[data-component='NavList.Content']]:space-y-0.5">
        <NavList.Item href="#home" aria-current="page">
          Home
        </NavList.Item>
        <NavList.SubNav defaultOpen>
          <NavList.SubNav.Trigger>About</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel className="mt-0.5 space-y-0.5">
            <NavList.Item href="#team">Team</NavList.Item>
            <NavList.Item href="#history">History</NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
        <NavList.Item href="#contact">Contact</NavList.Item>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithoutDivider: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList aria-label="Settings">
        <NavList.Item href="#home" aria-current="page">
          Home
        </NavList.Item>
        <NavList.Group hideDivider>
          <NavList.SubNav defaultOpen>
            <NavList.SubNav.Trigger>About</NavList.SubNav.Trigger>
            <NavList.SubNav.Panel>
              <NavList.Item href="#team">Team</NavList.Item>
              <NavList.Item href="#history">History</NavList.Item>
            </NavList.SubNav.Panel>
          </NavList.SubNav>
          <NavList.Item href="#settings">Settings</NavList.Item>
        </NavList.Group>
        <NavList.Group>
          <NavList.Item href="#contact">Contact</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithHeading: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList>
        <NavList.Heading>Settings</NavList.Heading>
        <NavList.Group title="Account">
          <NavList.Item href="#profile" aria-current="page">
            Profile
          </NavList.Item>
          <NavList.Item href="#appearance">Appearance</NavList.Item>
        </NavList.Group>
        <NavList.Group title="Security">
          <NavList.Item href="#password">Password and authentication</NavList.Item>
          <NavList.Item href="#sessions">Sessions</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayoutNav>
  ),
}
export const WithVisuallyHiddenHeading: Story = {
  render: () => (
    <PageLayoutNav>
      <NavList>
        <NavList.Heading visuallyHidden>Settings</NavList.Heading>
        <NavList.Group title="Account">
          <NavList.Item href="#profile" aria-current="page">
            Profile
          </NavList.Item>
          <NavList.Item href="#appearance">Appearance</NavList.Item>
        </NavList.Group>
        <NavList.Group title="Security">
          <NavList.Item href="#password">Password and authentication</NavList.Item>
          <NavList.Item href="#sessions">Sessions</NavList.Item>
        </NavList.Group>
      </NavList>
    </PageLayoutNav>
  ),
}
export const CurrentItem: Story = {
  render: function CurrentItemStory() {
    const [current, setCurrent] = useState('Code')
    return (
      <NavList aria-label="Repository">
        <NavList.List>
          {['Code', 'Issues'].map(item => (
            <NavList.Item
              key={item}
              href={`#${item}`}
              aria-current={current === item ? 'page' : undefined}
              onClick={event => {
                event.preventDefault()
                setCurrent(item)
              }}
            >
              {item}
            </NavList.Item>
          ))}
        </NavList.List>
      </NavList>
    )
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('link', {name: 'Issues'}))
    await expect(canvas.getByRole('link', {name: 'Issues'})).toHaveAttribute('aria-current', 'page')
  },
}
