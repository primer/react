import {
  ServerIcon,
  PlusCircleIcon,
  TypographyIcon,
  VersionsIcon,
  SearchIcon,
  NoteIcon,
  ProjectIcon,
  FilterIcon,
  GearIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  LinkIcon,
  LawIcon,
  StarIcon,
  GitForkIcon,
  AlertIcon,
  TableIcon,
  PeopleIcon
} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {Label, ThemeProvider} from '..'
import {ActionList as _ActionList} from '../ActionList2'
import {Header} from '../ActionList/Header'
import BaseStyles from '../BaseStyles'
import Avatar from '../Avatar'
import {ButtonInvisible} from '../Button'

const ActionList = Object.assign(_ActionList, {
  Header
})

const meta: Meta = {
  title: 'Composite components/ActionList2',
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

const ErsatzOverlay = styled.div<{maxWidth?: string}>`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(149, 157, 165, 0.2);
  overflow: hidden;
  max-width: ${({maxWidth}) => maxWidth || 'none'};
`
export function SimpleListStory(): JSX.Element {
  return (
    <>
      <h1>Simple List</h1>
      <ErsatzOverlay>
        <ActionList>
          <ActionList.Item>Copy link</ActionList.Item>
          <ActionList.Item>Quote reply</ActionList.Item>
          <ActionList.Item>Edit comment</ActionList.Item>
          <ActionList.Divider />
          <ActionList.Item variant="danger">Delete file</ActionList.Item>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
SimpleListStory.storyName = 'Simple List'

export function WithIcon(): JSX.Element {
  return (
    <>
      <h1>With Icon</h1>
      <ErsatzOverlay>
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
              <GitForkIcon />
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
      </ErsatzOverlay>
    </>
  )
}
WithIcon.storyName = 'With Icon'

const users = [
  {login: 'pksjce', name: 'Pavithra Kodmad'},
  {login: 'jfuchs', name: 'Jonathan Fuchs'},
  {login: 'colebemis', name: 'Cole Bemis'},
  {login: 'mperrotti', name: 'Mike Perrotti'},
  {login: 'dgreif', name: 'Dusty Greif'},
  {login: 'smockle', name: 'Clay Miller'},
  {login: 'siddharthkp', name: 'Siddharth Kshetrapal'}
]

export function WithAvatar(): JSX.Element {
  return (
    <>
      <h1>With Avatar</h1>
      <ErsatzOverlay>
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
      </ErsatzOverlay>
    </>
  )
}
WithAvatar.storyName = 'With Avatar'

const projects = [
  {name: 'Primer Backlog', scope: 'GitHub'},
  {name: 'Accessibility', scope: 'GitHub'},
  {name: 'Octicons', scope: 'github/primer'},
  {name: 'Primer React', scope: 'github/primer'}
]

export function WithDescription(): JSX.Element {
  return (
    <>
      <h1>With Description & Dividers</h1>
      <ErsatzOverlay>
        <ActionList showDividers>
          {users.map(user => (
            <ActionList.Item key={user.login}>
              <ActionList.LeadingVisual>
                <Avatar src={`https://github.com/${user.login}.png`} />
              </ActionList.LeadingVisual>
              {user.login}
              <ActionList.Description>{user.name}</ActionList.Description>
            </ActionList.Item>
          ))}
          <ActionList.Divider />
          {projects.map((project, index) => (
            <ActionList.Item key={index}>
              <ActionList.LeadingVisual>
                <TableIcon />
              </ActionList.LeadingVisual>
              {project.name}
              <ActionList.Description variant="block">{project.scope}</ActionList.Description>
            </ActionList.Item>
          ))}
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
WithDescription.storyName = 'With Description & Dividers'

export function SingleSelectListStory(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(1)

  return (
    <>
      <h1>Single Select List</h1>
      <ErsatzOverlay>
        <ActionList showDividers>
          {projects.map((project, index) => (
            <ActionList.Item key={index} selected={index === selectedIndex} onSelect={() => setSelectedIndex(index)}>
              <ActionList.LeadingVisual>
                <TableIcon />
              </ActionList.LeadingVisual>
              {project.name}
              <ActionList.Description variant="block">{project.scope}</ActionList.Description>
            </ActionList.Item>
          ))}
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
SingleSelectListStory.storyName = 'Single Select'

export function MultiSelectListStory(): JSX.Element {
  const [assignees, setAssignees] = React.useState(users.slice(0, 2))

  const toggleAssignee = assignee => {
    const assigneeIndex = assignees.findIndex(a => a.login === assignee.login)

    if (assigneeIndex === -1) setAssignees([...assignees, assignee])
    else setAssignees(assignees.filter((_, index) => index !== assigneeIndex))
  }

  return (
    <>
      <h1>Multi Select List</h1>
      <ErsatzOverlay>
        <ActionList selectionVariant="multiple" showDividers>
          {users.map(user => (
            <ActionList.Item
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
      </ErsatzOverlay>
    </>
  )
}
MultiSelectListStory.storyName = 'Multi Select'

export function DisabledStory(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  return (
    <>
      <h1>Disabled Items</h1>
      <ErsatzOverlay>
        <ActionList showDividers>
          {projects.map((project, index) => (
            <ActionList.Item
              key={index}
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
      </ErsatzOverlay>
    </>
  )
}
DisabledStory.storyName = 'Disabled Items'

export function GroupsStory(): JSX.Element {
  const [assignees, setAssignees] = React.useState(users.slice(0, 1))

  const toggleAssignee = assignee => {
    const assigneeIndex = assignees.findIndex(a => a.login === assignee.login)

    if (assigneeIndex === -1) setAssignees([...assignees, assignee])
    else setAssignees(assignees.filter((_, index) => index !== assigneeIndex))
  }

  return (
    <>
      <h1>Groups</h1>
      <ErsatzOverlay>
        <ActionList selectionVariant="multiple" showDividers>
          <ActionList.Group title="Suggestions" variant="filled">
            {users.slice(0, 2).map(user => (
              <ActionList.Item
                key={user.login}
                selected={Boolean(assignees.find(assignee => assignee.login === user.login))}
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
          <ActionList.Group title="Everyone" variant="filled">
            {users.slice(2).map(user => (
              <ActionList.Item
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
          </ActionList.Group>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
GroupsStory.storyName = 'Groups'

export function ActionsStory(): JSX.Element {
  return (
    <>
      <h1>Actions</h1>
      <ErsatzOverlay>
        <ActionList showDividers>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <ServerIcon />
            </ActionList.LeadingVisual>
            Open current Codespace
            <ActionList.Description variant="block">
              Your existing Codespace will be opened to its previous state, and you&apos;ll be asked to manually switch
              to new-branch.
            </ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <PlusCircleIcon />
            </ActionList.LeadingVisual>
            Create new Codespace
            <ActionList.Description variant="block">
              Create a brand new Codespace with a fresh image and checkout this branch.
            </ActionList.Description>
          </ActionList.Item>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
ActionsStory.storyName = 'Actions'

export function ComplexListInsetVariantStory(): JSX.Element {
  return (
    <>
      <h1>Complex List</h1>
      <h2>Inset Variant</h2>
      <ErsatzOverlay>
        <ActionList showDividers>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <TypographyIcon />
            </ActionList.LeadingVisual>
            Rename
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <VersionsIcon />
            </ActionList.LeadingVisual>
            Duplicate
            <ActionList.Description>Create a copy</ActionList.Description>
          </ActionList.Item>

          <ActionList.Group title="Live query" variant="filled">
            <ActionList.Item style={{color: 'rebeccapurple'}}>
              <ActionList.LeadingVisual>
                <SearchIcon />
              </ActionList.LeadingVisual>
              repo:github/memex,github/github
            </ActionList.Item>
          </ActionList.Group>
          <ActionList.Divider />
          <ActionList.Group title="Layout" variant="subtle">
            <ActionList.Item>
              <ActionList.LeadingVisual>
                <NoteIcon />
              </ActionList.LeadingVisual>
              Table
              <ActionList.Description variant="block">
                Information-dense table optimized for operations across teams
              </ActionList.Description>
            </ActionList.Item>
            <ActionList.Item>
              <ActionList.LeadingVisual>
                <ProjectIcon />
              </ActionList.LeadingVisual>
              Board
              <ActionList.Description variant="block">
                Kanban-style board focused on visual states
              </ActionList.Description>
            </ActionList.Item>
          </ActionList.Group>
          <ActionList.Divider />
          <ActionList.Group>
            <ActionList.Item style={{fontWeight: 'bold'}}>
              <ActionList.LeadingVisual>
                <FilterIcon />
              </ActionList.LeadingVisual>
              Save sort and filters to current view
            </ActionList.Item>
            <ActionList.Item style={{fontWeight: 'bold'}}>
              <ActionList.LeadingVisual>
                <FilterIcon />
              </ActionList.LeadingVisual>
              Save sort and filters to new view
            </ActionList.Item>
          </ActionList.Group>
          <ActionList.Divider />
          <ActionList.Group sx={{backgroundColor: 'cornflowerblue'}}>
            <ActionList.Item sx={{color: 'white'}}>
              <ActionList.LeadingVisual sx={{color: 'white'}}>
                <GearIcon />
              </ActionList.LeadingVisual>
              View settings
            </ActionList.Item>
          </ActionList.Group>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
ComplexListInsetVariantStory.storyName = 'Complex List — Inset Variant'

export function ComplexListFullVariantStory(): JSX.Element {
  return (
    <>
      <h1>Complex List</h1>
      <h2>Full Variant</h2>
      <ErsatzOverlay>
        <ActionList variant="full">
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <TypographyIcon />
            </ActionList.LeadingVisual>
            Rename
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <VersionsIcon />
            </ActionList.LeadingVisual>
            Duplicate
            <ActionList.Description>Create a copy</ActionList.Description>
          </ActionList.Item>

          <ActionList.Group title="Live query" variant="filled">
            <ActionList.Item style={{color: 'rebeccapurple'}}>
              <ActionList.LeadingVisual>
                <SearchIcon />
              </ActionList.LeadingVisual>
              repo:github/memex,github/github
            </ActionList.Item>
          </ActionList.Group>
          <ActionList.Divider />
          <ActionList.Group title="Layout" variant="subtle">
            <ActionList.Item>
              <ActionList.LeadingVisual>
                <NoteIcon />
              </ActionList.LeadingVisual>
              Table
              <ActionList.Description variant="block">
                Information-dense table optimized for operations across teams
              </ActionList.Description>
            </ActionList.Item>
            <ActionList.Item>
              <ActionList.LeadingVisual>
                <ProjectIcon />
              </ActionList.LeadingVisual>
              Board
              <ActionList.Description variant="block">
                Kanban-style board focused on visual states
              </ActionList.Description>
            </ActionList.Item>
          </ActionList.Group>
          <ActionList.Divider />
          <ActionList.Group>
            <ActionList.Item style={{fontWeight: 'bold'}}>
              <ActionList.LeadingVisual>
                <FilterIcon />
              </ActionList.LeadingVisual>
              Save sort and filters to current view
            </ActionList.Item>
            <ActionList.Item style={{fontWeight: 'bold'}}>
              <ActionList.LeadingVisual>
                <FilterIcon />
              </ActionList.LeadingVisual>
              Save sort and filters to new view
            </ActionList.Item>
          </ActionList.Group>
          <ActionList.Divider />
          <ActionList.Group sx={{backgroundColor: 'cornflowerblue'}}>
            <ActionList.Item sx={{color: 'white'}}>
              <ActionList.LeadingVisual sx={{color: 'white'}}>
                <GearIcon />
              </ActionList.LeadingVisual>
              View settings
            </ActionList.Item>
          </ActionList.Group>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
ComplexListFullVariantStory.storyName = 'Complex List — Full Variant'

type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode}
const ReactRouterLikeLink = forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
  ({to, ...props}: {to: string; children: React.ReactNode}, ref) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a ref={ref} href={to} {...props} />
  }
)

const NextJSLikeLink = forwardRef(
  ({href, children}: {href: string; children: React.ReactNode}, ref): React.ReactElement => {
    const child = React.Children.only(children)
    const childProps = {
      ref,
      href
    }
    return <>{React.isValidElement(child) ? React.cloneElement(child, childProps) : null}</>
  }
)

export function LinkItemStory(): JSX.Element {
  return (
    <>
      <h1>Simple List</h1>
      <ErsatzOverlay>
        <ActionList>
          <ActionList.Item onSelect={() => alert('hi!')}>A. Vanilla action</ActionList.Item>
          <ActionList.Item as="a" href="?path=/story/composite-components-actionlist2--simple-list-story">
            B. Vanilla link
          </ActionList.Item>
          <ActionList.Item
            as={ReactRouterLikeLink}
            to="?path=/story/composite-components-actionlist2--simple-list-story"
          >
            C. React Router link
          </ActionList.Item>
          <NextJSLikeLink href="?path=/story/composite-components-actionlist2--simple-list-story">
            <ActionList.Item as="a">D. NextJS style</ActionList.Item>
          </NextJSLikeLink>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
LinkItemStory.storyName = 'List with a link item'

export function DOMPropsStory(): JSX.Element {
  return (
    <>
      <h1>Simple List</h1>
      <ErsatzOverlay>
        <ActionList>
          <ActionList.Item id="something" onClick={event => alert(`Id is '${event.currentTarget.getAttribute('id')}'`)}>
            Has an id
          </ActionList.Item>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
DOMPropsStory.storyName = 'List an item input including DOM props'

export function CustomItemChildren(): JSX.Element {
  return (
    <>
      <h1>Custom Item Children</h1>
      <ErsatzOverlay>
        <ActionList>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <ArrowRightIcon />
            </ActionList.LeadingVisual>
            <Label outline borderColor="success.emphasis">
              Choose this one
            </Label>
            <ActionList.TrailingVisual>
              <ArrowLeftIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
CustomItemChildren.storyName = 'Custom Item Children'

export function SizeStressTestingStory(): JSX.Element {
  return (
    <>
      <h1>Size Stress Testing</h1>
      <ErsatzOverlay maxWidth="300px">
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
      </ErsatzOverlay>
    </>
  )
}
SizeStressTestingStory.storyName = 'Size Stress Testing'

export function AllCombinations(): JSX.Element {
  return (
    <>
      <h1>All Possible Combinations</h1>
      <code>
        dynamic features: L = Leading Visual, I = Inline Description, B = Block Description, T = Trailing Visual
      </code>
      <br />
      <code>16 possible combinations</code>
      <br />
      <br />
      <ErsatzOverlay maxWidth="300px">
        <ActionList showDividers>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            The everything bagel
            <ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>none of them, only text</ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            only L
          </ActionList.Item>
          <ActionList.Item>
            only I<ActionList.Description variant="inline">inline description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            only B<ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            only T
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + I<ActionList.Description variant="inline">inline description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + B<ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + T
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            I + B<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            I + T<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            B + T<ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + I + B<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + I + T<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <StarIcon />
            </ActionList.LeadingVisual>
            L + B + T<ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item>
            I + B + T<ActionList.Description variant="inline">inline description</ActionList.Description>
            <ActionList.Description variant="block">Block description</ActionList.Description>
            <ActionList.TrailingVisual>
              <StarIcon />
            </ActionList.TrailingVisual>
          </ActionList.Item>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
AllCombinations.storyName = 'All Combinations'

const teams = [
  {id: '5025661', type: 'team', slug: 'github/primer-reviewers', name: 'Primer Reviewers', members: 20},
  {id: '1929972', type: 'team', slug: 'github/design-infrastructure', name: 'Design Infrastructure', members: 20}
]

export function ConditionalChildren(): JSX.Element {
  type reviewerType = {name: string; id?: string; type?: string; login?: string; slug?: string; members?: number}
  const potentialReviewers: reviewerType[] = [...teams, ...users]
  return (
    <>
      <h1>Conditional Children</h1>
      <ErsatzOverlay>
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
      </ErsatzOverlay>
    </>
  )
}
ConditionalChildren.storyName = 'Conditional Children'

export function NestedChildren(): JSX.Element {
  return (
    <>
      <h1>Nested Children</h1>
      <ErsatzOverlay>
        <ActionList showDividers>
          <div id="i like extra divs">
            {users.map(user => (
              <ActionList.Item key={user.login}>
                <ActionList.LeadingVisual>
                  <Avatar src={`https://avatars.githubusercontent.com/${user.login}`} />
                </ActionList.LeadingVisual>
                {user.login}
                <ReviewerDescription user={user} />
              </ActionList.Item>
            ))}
          </div>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
NestedChildren.storyName = 'Nested Children'

const ReviewerDescription = ({user}) => {
  const usersRecentlyEditedFile = users.slice(0, 2)

  if (usersRecentlyEditedFile.find(u => u.login === user.login)) {
    return (
      <span>
        <ActionList.Description>{user.name}</ActionList.Description>
        <ActionList.Description variant="block">Recently edited this file</ActionList.Description>
      </span>
    )
  } else {
    return <ActionList.Description>{user.name}</ActionList.Description>
  }
}

export function ChildWithInternalState(): JSX.Element {
  return (
    <>
      <h1>Child with internal state - broken</h1>
      <ErsatzOverlay>
        <ActionList showDividers>
          {users.map(user => (
            <ActionList.Item key={user.login}>
              <ActionList.LeadingVisual>
                <Avatar src={`https://avatars.githubusercontent.com/${user.login}`} />
              </ActionList.LeadingVisual>
              {user.login}
              <StatefulChild>{user.name}</StatefulChild>
            </ActionList.Item>
          ))}
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
ChildWithInternalState.storyName = 'Child with internal state'

const StatefulChild = props => {
  const [nameVisible, setNameVisibility] = React.useState(false)
  const toggle = () => {
    setNameVisibility(!nameVisible)
  }

  /** once description is registered, it cannot be unregistered, only updated. */

  return (
    <>
      <ButtonInvisible onClick={toggle} sx={{fontSize: 0, paddingY: 0}}>
        {nameVisible ? 'Hide name' : 'Show name'}
      </ButtonInvisible>
      {nameVisible && <ActionList.Description>{props.children}</ActionList.Description>}
    </>
  )
}

export function ChildWithSideEffects(): JSX.Element {
  const user = users[0]
  const [selected, setSelected] = React.useState(true)

  return (
    <>
      <h1>Child with side effects</h1>
      <ErsatzOverlay>
        <ActionList selectionVariant="multiple">
          <ActionList.Item selected={selected} onSelect={() => setSelected(!selected)}>
            <ActionList.LeadingVisual>
              <Avatar src={`https://avatars.githubusercontent.com/${user.login}`} />
            </ActionList.LeadingVisual>
            {user.login}
            <SideEffectDescription />
          </ActionList.Item>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
ChildWithSideEffects.storyName = 'Child with side effects'

const SideEffectDescription = () => {
  const [seconds, setSeconds] = React.useState(0)

  React.useEffect(() => {
    const fn = () => setSeconds(s => s + 1)
    const interval = window.setInterval(fn, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return <ActionList.Description>{seconds} seconds passed</ActionList.Description>
}

export function WithSx(): JSX.Element {
  return (
    <>
      <h1>With sx prop</h1>
      <ErsatzOverlay>
        <ActionList sx={{paddingTop: 4}}>
          <ActionList.Item sx={{backgroundColor: 'accent.subtle'}}>
            <ActionList.LeadingVisual sx={{color: 'accent.emphasis'}}>
              <LinkIcon />
            </ActionList.LeadingVisual>
            github.com/primer
            <ActionList.Description sx={{paddingLeft: 4, color: 'accent.emphasis'}}>
              all items support sx prop
            </ActionList.Description>
          </ActionList.Item>
          <ActionList.Item>
            <ActionList.LeadingVisual>
              <LawIcon />
            </ActionList.LeadingVisual>
            MIT License
          </ActionList.Item>
          <ActionList.Item
            variant="danger"
            sx={{
              borderLeft: '2px solid',
              borderColor: 'danger.emphasis',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0
            }}
          >
            <ActionList.LeadingVisual>
              <AlertIcon />
            </ActionList.LeadingVisual>
            4 vulnerabilities
          </ActionList.Item>
        </ActionList>
      </ErsatzOverlay>
    </>
  )
}
WithSx.storyName = 'With sx'
