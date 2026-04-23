import type {Meta, StoryFn} from '@storybook/react-vite'
import {
  ArrowUpRightIcon,
  BookmarkIcon,
  ClockIcon,
  EyeIcon,
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestDraftIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  MentionIcon,
  MilestoneIcon,
  PeopleIcon,
  ProjectIcon,
  ProjectRoadmapIcon,
  ProjectTemplateIcon,
  SmileyIcon,
  StarIcon,
  TagIcon,
  TableIcon,
  ToolsIcon,
} from '@primer/octicons-react'
import {Button} from '../../Button'
import Heading from '../../Heading'
import {NavList} from '../../NavList'
import {Placeholder} from '../../Placeholder'
import {FilteredListLayout} from '../FilteredListLayout'

export default {
  title: 'Experimental/Components/FilteredListLayout/Examples',
  component: FilteredListLayout,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof FilteredListLayout>

type View = {
  key: string
  label: string
  icon: React.ComponentType
  selected?: boolean
}

const HeaderRow = ({title, primaryActionLabel}: {title: string; primaryActionLabel: string}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--stack-gap-condensed, 8px)',
    }}
  >
    <Heading as="h2" variant="small">
      {title}
    </Heading>
    <Button variant="primary">{primaryActionLabel}</Button>
  </div>
)

const ViewsNavList = ({label, views}: {label: string; views: View[]}) => (
  <NavList aria-label={label}>
    {views.map(view => {
      const Icon = view.icon
      return (
        <NavList.Item key={view.key} href={`#${view.key}`} aria-current={view.selected ? 'page' : undefined}>
          <NavList.LeadingVisual>
            <Icon />
          </NavList.LeadingVisual>
          {view.label}
        </NavList.Item>
      )
    })}
  </NavList>
)

// ---------------------------------------------------------------------------
// Issues

const issuesViews: View[] = [
  {key: 'issues', label: 'Issues', icon: IssueOpenedIcon, selected: true},
  {key: 'assigned', label: 'Assigned to me', icon: PeopleIcon},
  {key: 'created', label: 'Created by me', icon: SmileyIcon},
  {key: 'mentioned', label: 'Mentioned', icon: MentionIcon},
  {key: 'recent', label: 'Recent activity', icon: ClockIcon},
]

const issuesShortcuts: View[] = [
  {key: 'projects', label: 'Projects', icon: TableIcon},
  {key: 'milestones', label: 'Milestones', icon: MilestoneIcon},
  {key: 'labels', label: 'Labels', icon: TagIcon},
]

const issuesCustomViews: View[] = [
  {key: 'mentioned-custom', label: 'Mentioned', icon: EyeIcon},
  {key: 'assigned-custom', label: 'Assigned', icon: ToolsIcon},
  {key: 'test-view', label: 'Test View', icon: BookmarkIcon},
  {key: 'second-test', label: 'Second test view', icon: BookmarkIcon},
]

const IssuesSidebar = ({selectedKey, customViews = issuesCustomViews}: {selectedKey: string; customViews?: View[]}) => (
  <NavList aria-label="Issues">
    {issuesViews.map(view => (
      <ViewsItem key={view.key} view={{...view, selected: view.key === selectedKey}} />
    ))}
    <NavList.Group title="Custom views">
      {customViews.map(view => (
        <ViewsItem key={view.key} view={{...view, selected: view.key === selectedKey}} />
      ))}
    </NavList.Group>
    <NavList.Group title="Shortcuts">
      {issuesShortcuts.map(view => {
        const Icon = view.icon
        return (
          <NavList.Item key={view.key} href={`#${view.key}`}>
            <NavList.LeadingVisual>
              <Icon />
            </NavList.LeadingVisual>
            {view.label}
            <NavList.TrailingVisual>
              <ArrowUpRightIcon />
            </NavList.TrailingVisual>
          </NavList.Item>
        )
      })}
    </NavList.Group>
  </NavList>
)

const ViewsItem = ({view}: {view: View}) => {
  const Icon = view.icon
  return (
    <NavList.Item href={`#${view.key}`} aria-current={view.selected ? 'page' : undefined}>
      <NavList.LeadingVisual>
        <Icon />
      </NavList.LeadingVisual>
      {view.label}
    </NavList.Item>
  )
}

export const Issues: StoryFn = () => (
  <FilteredListLayout>
    <FilteredListLayout.Header>
      <HeaderRow title="Issues" primaryActionLabel="New issue" />
      <FilteredListLayout.FilterBar aria-label="Filter issues">
        <Placeholder label="Filter issues" height={48} />
      </FilteredListLayout.FilterBar>
    </FilteredListLayout.Header>
    <FilteredListLayout.Sidebar aria-label="Issues">
      <IssuesSidebar selectedKey="issues" />
    </FilteredListLayout.Sidebar>
    <FilteredListLayout.Content>
      <FilteredListLayout.Results aria-label="Issue results">
        <Placeholder label="Issue list" height={552} />
      </FilteredListLayout.Results>
    </FilteredListLayout.Content>
  </FilteredListLayout>
)

export const IssuesWithCustomViewSelected: StoryFn = () => {
  const customViews: View[] = [{key: 'important', label: 'Important', icon: BookmarkIcon}, ...issuesCustomViews]
  return (
    <FilteredListLayout>
      <FilteredListLayout.Header>
        <HeaderRow title="Important" primaryActionLabel="New issue" />
        <FilteredListLayout.FilterBar aria-label="Filter issues">
          <Placeholder label="Filter issues" height={48} />
        </FilteredListLayout.FilterBar>
      </FilteredListLayout.Header>
      <FilteredListLayout.Sidebar aria-label="Issues">
        <IssuesSidebar selectedKey="important" customViews={customViews} />
      </FilteredListLayout.Sidebar>
      <FilteredListLayout.Content>
        <FilteredListLayout.Results aria-label="Issue results">
          <Placeholder label="Issue list" height={552} />
        </FilteredListLayout.Results>
      </FilteredListLayout.Content>
    </FilteredListLayout>
  )
}

// ---------------------------------------------------------------------------
// Pull requests

const pullRequestViews: View[] = [
  {key: 'open', label: 'Open', icon: GitPullRequestIcon, selected: true},
  {key: 'review', label: 'Awaiting review', icon: GitPullRequestDraftIcon},
  {key: 'merged', label: 'Recently merged', icon: GitMergeIcon},
  {key: 'closed', label: 'Closed', icon: GitPullRequestClosedIcon},
  {key: 'mentioned', label: 'Mentioned', icon: MentionIcon},
]

export const PullRequests: StoryFn = () => (
  <FilteredListLayout>
    <FilteredListLayout.Header>
      <HeaderRow title="Pull requests" primaryActionLabel="New pull request" />
      <FilteredListLayout.FilterBar aria-label="Filter pull requests">
        <Placeholder label="Filter pull requests" height={48} />
      </FilteredListLayout.FilterBar>
    </FilteredListLayout.Header>
    <FilteredListLayout.Sidebar aria-label="Pull requests">
      <ViewsNavList label="Pull request views" views={pullRequestViews} />
    </FilteredListLayout.Sidebar>
    <FilteredListLayout.Content>
      <FilteredListLayout.Results aria-label="Pull request results">
        <Placeholder label="Pull request list" height={552} />
      </FilteredListLayout.Results>
    </FilteredListLayout.Content>
  </FilteredListLayout>
)

// ---------------------------------------------------------------------------
// Projects

const projectViews: View[] = [
  {key: 'all', label: 'All projects', icon: ProjectIcon, selected: true},
  {key: 'starred', label: 'Starred', icon: StarIcon},
  {key: 'roadmaps', label: 'Roadmaps', icon: ProjectRoadmapIcon},
  {key: 'templates', label: 'Templates', icon: ProjectTemplateIcon},
  {key: 'milestones', label: 'Milestones', icon: MilestoneIcon},
]

export const Projects: StoryFn = () => (
  <FilteredListLayout>
    <FilteredListLayout.Header>
      <HeaderRow title="Projects" primaryActionLabel="New project" />
      <FilteredListLayout.FilterBar aria-label="Filter projects">
        <Placeholder label="Filter projects" height={48} />
      </FilteredListLayout.FilterBar>
    </FilteredListLayout.Header>
    <FilteredListLayout.Sidebar aria-label="Projects">
      <ViewsNavList label="Project views" views={projectViews} />
    </FilteredListLayout.Sidebar>
    <FilteredListLayout.Content>
      <FilteredListLayout.Results aria-label="Project results">
        <Placeholder label="Project list" height={552} />
      </FilteredListLayout.Results>
    </FilteredListLayout.Content>
  </FilteredListLayout>
)
