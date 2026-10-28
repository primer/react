import {useId, useRef, useState} from 'react'
import type {Meta} from '@storybook/react-vite'
import {
  BellIcon,
  BookIcon,
  CheckIcon,
  CodeIcon,
  CommentDiscussionIcon,
  CommentIcon,
  GitPullRequestIcon,
  GraphIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  MarkGithubIcon,
  MilestoneIcon,
  PlusIcon,
  RepoForkedIcon,
  RowsIcon,
  SearchIcon,
  ShieldIcon,
  SidebarCollapseIcon,
  SidebarExpandIcon,
  StarFillIcon,
  StarIcon,
  TableIcon,
  TagIcon,
  ThreeBarsIcon,
  TriangleDownIcon,
  WorkflowIcon,
} from '@primer/octicons-react'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import Avatar from '../Avatar'
import {Button, IconButton} from '../Button'
import Checkbox from '../Checkbox'
import {Dialog} from '../Dialog'
import FormControl from '../FormControl'
import Label from '../Label'
import Link from '../Link'
import {PageHeader} from '../PageHeader'
import Pagination from '../Pagination'
import Select from '../Select'
import {SegmentedControl} from '../SegmentedControl'
import {SelectPanel} from '../SelectPanel'
import Textarea from '../Textarea'
import TextInput from '../TextInput'
import {UnderlineNav} from '../UnderlineNav'
import {IssueLabel} from '../experimental/IssueLabel'
import {PlaygroundAppearance} from './PlaygroundAppearance'
import {issueFixtures} from './IssuesPage.fixtures'
import type {IssueFixture} from './IssuesPage.fixtures'
import classes from './IssuesPage.stories.module.css'

const repositoryUrl = 'https://github.com/primer/react'
const currentUser = 'mona'
const pageSize = 12

const meta = {
  title: 'Design tools/Issues page',
  parameters: {
    layout: 'fullscreen',
    controls: {disable: true},
    docs: {
      description: {
        component:
          'Shopify Polaris, Adobe Spectrum and Stripe presets adapt public brand token values through scoped CSS variables only. Shopify uses the older MIT-licensed Polaris Tokens 4.0.0 baseline. Adobe and Stripe use published font stacks with local fallbacks; no brand fonts or component stylesheets are downloaded. Stripe is a website/Appearance API adaptation, not a Dashboard replica. Source versions, token roles and limitations are recorded in PlaygroundAppearance.brands.json and the picker shows source notes. ' +
          'Author, label, type and sort filters use searchable SelectPanels with single selection, explicit reset choices and empty-result feedback. Author, assignee and profile avatars load from https://github.com/username.png; GitHub Actions uses its published app-avatar URL because bot logins have no username.png endpoint. Label swatches follow the active theme. ' +
          'A Primer-first reconstruction of the primer/react issues list. Public fixtures captured October 28, 2026: 25 open issues and a seven-issue closed sample. All filters, selection, star/watch toggles and new issues are local fixture-only behavior; issue changes are never sent to GitHub or persisted remotely. Repository and real issue links open GitHub in a new tab. Search supports text, #number, is:issue, state:open/closed, is:open/closed, label:"name", author:login and type:Bug/Feature/Task. The demo user is mona. The issue toolbar switches between Comfortable and Compact rows independently of page-wide density; Compact reduces row spacing and title size and hides labels, while retaining issue metadata. PlaygroundAppearance manages density, portaled overlays, and independent Primer adaptations of color values snapshotted from the supplied VS Code repositories. The density slider previews five live steps from Very compact to Very spacious, with Default in the middle; spacing and control tiers shift by up to two adjacent steps in either direction and clamp at the scale boundaries. Sources are commit-pinned, inherited color definitions are resolved, and tints and contrast-safe text are adapted locally. Windows 95 (95CSS) additionally customizes typography using the bundled OFL-licensed W95FA font, square corners, and raised/sunken primitive shadows. Primer inherits Storybook. The theme button opens a searchable palette side sheet with miniature previews, recent choices, an Active indicator, and an immutable source link for the selected preset. Selecting a card applies it immediately while keeping the picker open. These are demonstration presets, not a reproduction of GitHub appearance settings.',
      },
    },
  },
} satisfies Meta

export default meta

function FilterPanel({
  name,
  value,
  options,
  onChange,
}: {
  name: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const subject = name === 'Labels' ? 'label' : name === 'Types' ? 'type' : name.toLowerCase()
  const items = ['', ...options].map(option => ({
    id: option,
    text: option || `Any ${subject}`,
    leadingVisual:
      option && name === 'Author'
        ? () => <Avatar src={avatarSource(option)} size={20} />
        : option && name === 'Labels'
          ? () => <span className={classes.FilterLabelColor} data-variant={labelVariant(option)} aria-hidden="true" />
          : undefined,
  }))
  const filteredItems = items.filter(item => item.text.toLowerCase().includes(filter.trim().toLowerCase()))

  return (
    <SelectPanel
      title={name === 'Sort' ? 'Sort issues' : `Filter by ${subject}`}
      placeholderText={`Filter ${name === 'Author' ? 'authors' : name === 'Sort' ? 'sort options' : name.toLowerCase()}`}
      renderAnchor={anchorProps => (
        <Button
          {...anchorProps}
          size="small"
          variant="invisible"
          trailingAction={TriangleDownIcon}
          aria-label={`${name}: ${value || 'Any'}`}
          aria-haspopup="dialog"
        >
          {value || name}
        </Button>
      )}
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen)
        if (!nextOpen) setFilter('')
      }}
      items={filteredItems}
      selected={items.find(item => item.id === value)}
      onSelectedChange={item => onChange(item?.id?.toString() ?? '')}
      filterValue={filter}
      onFilterChange={setFilter}
      showItemDividers
      width="medium"
      height="large"
      displayInViewport
      message={
        filteredItems.length === 0
          ? {variant: 'empty', title: 'No matching options', body: 'Try a different search.'}
          : undefined
      }
    />
  )
}

function avatarSource(login: string) {
  if (login === 'github-actions[bot]') return 'https://avatars.githubusercontent.com/in/15368?v=4'
  return `https://github.com/${encodeURIComponent(login)}.png`
}

function labelVariant(label: string) {
  if (label === 'bug') return 'red'
  if (label === 'react') return 'blue'
  if (label === 'staff') return 'purple'
  if (label === 'accessibility') return 'yellow'
  if (label.startsWith('component:')) return 'pink'
  if (label === 'up for grabs') return 'green'
  return 'gray'
}

function parseSearch(query: string) {
  const tokens = query.match(/(?:[^\s"]+|"[^"]*")+/g) ?? []
  let state: 'open' | 'closed' = 'open'
  const labels: string[] = []
  const authors: string[] = []
  const types: string[] = []
  const text: string[] = []
  for (const token of tokens) {
    const value = token
      .slice(token.indexOf(':') + 1)
      .replaceAll('"', '')
      .toLowerCase()
    if (/^(?:is|state):(open|closed)$/i.test(token)) state = value === 'closed' ? 'closed' : 'open'
    else if (/^label:/i.test(token)) labels.push(value)
    else if (/^author:/i.test(token)) authors.push(value)
    else if (/^type:/i.test(token)) types.push(value)
    else if (token.toLowerCase() !== 'is:issue') text.push(token.replaceAll('"', '').toLowerCase())
  }
  return {state, labels, authors, types, text}
}

function IssuesPage() {
  const [issues, setIssues] = useState(issueFixtures)
  const [query, setQuery] = useState('is:issue state:open')
  const [label, setLabel] = useState('')
  const [type, setType] = useState('')
  const [author, setAuthor] = useState('')
  const [sort, setSort] = useState('Newest')
  const [view, setView] = useState('All issues')
  const [rowDensity, setRowDensity] = useState<'comfortable' | 'compact'>('comfortable')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<number[]>([])
  const [starred, setStarred] = useState(false)
  const [watching, setWatching] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [newIssueOpen, setNewIssueOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [draftType, setDraftType] = useState('Task')
  const [notice, setNotice] = useState('')
  const [previewIssue, setPreviewIssue] = useState<IssueFixture | null>(null)
  const newIssueRef = useRef<HTMLButtonElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const searchHelpId = useId()
  const search = parseSearch(query)

  const matches = issues.filter(issue => {
    const searchable = `${issue.title} #${issue.number} ${issue.author} ${issue.labels.join(' ')}`.toLowerCase()
    return (
      search.text.every(term => searchable.includes(term)) &&
      search.labels.every(item => issue.labels.some(issueLabel => issueLabel.toLowerCase() === item)) &&
      search.authors.every(item => issue.author.toLowerCase() === item) &&
      search.types.every(item => issue.type?.toLowerCase() === item) &&
      (!label || issue.labels.includes(label)) &&
      (!type || (type === 'No type' ? !issue.type : issue.type === type)) &&
      (!author || issue.author === author) &&
      (view !== 'Assigned to me' || issue.assignees?.includes(currentUser)) &&
      (view !== 'Created by me' || issue.author === currentUser)
    )
  })
  const openCount = matches.filter(issue => issue.state === 'open').length
  const closedCount = matches.length - openCount
  const filtered = matches
    .filter(issue => issue.state === search.state)
    .sort((a, b) => {
      if (sort === 'Most commented') return b.comments - a.comments || b.number - a.number
      if (sort === 'Least commented') return a.comments - b.comments || b.number - a.number
      return sort === 'Oldest' ? a.number - b.number : b.number - a.number
    })
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const selectedOnPage = visible.filter(issue => selected.includes(issue.number)).length
  const labels = [...new Set(issues.flatMap(issue => issue.labels))].sort()
  const authors = [...new Set(issues.map(issue => issue.author))].sort()

  function changeState(state: 'open' | 'closed') {
    setQuery(`${query.replace(/\b(?:is|state):(open|closed)\b/gi, '').trim()} state:${state}`.trim())
    setPage(1)
  }

  function resetFilters() {
    setQuery('is:issue state:open')
    setLabel('')
    setType('')
    setAuthor('')
    setView('All issues')
    setPage(1)
  }

  function changeView(nextView: string) {
    resetFilters()
    setView(nextView)
  }

  function updateSelected(state: 'open' | 'closed') {
    setIssues(previous => previous.map(issue => (selected.includes(issue.number) ? {...issue, state} : issue)))
    setNotice(
      `${selected.length} issue${selected.length === 1 ? '' : 's'} ${state === 'closed' ? 'closed' : 'reopened'} in this demo only.`,
    )
    setSelected([])
  }

  function createIssue() {
    if (!draftTitle.trim()) return
    const issue: IssueFixture = {
      number: Math.max(...issues.map(item => item.number)) + 1,
      title: draftTitle.trim(),
      body: draftBody,
      type: draftType,
      author: currentUser,
      date: '2026-10-28',
      state: 'open',
      labels: [],
      comments: 0,
      local: true,
    }
    setIssues(previous => [issue, ...previous])
    resetFilters()
    setSort('Newest')
    setNewIssueOpen(false)
    setDraftTitle('')
    setDraftBody('')
    setNotice(`Created “${issue.title}” locally. Nothing was posted to GitHub.`)
  }

  return (
    <div className={classes.Page}>
      <header className={classes.RepositoryHeader}>
        <div className={classes.GlobalBar}>
          <Link href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
            <MarkGithubIcon size={32} />
          </Link>
          <div className={classes.Breadcrumb}>
            <Link href="https://github.com/primer" target="_blank" rel="noreferrer" muted>
              primer
            </Link>
            <span className={classes.Muted}>/</span>
            <Link href={repositoryUrl} target="_blank" rel="noreferrer" muted>
              <strong>react</strong>
            </Link>
          </div>
          <Label>Public</Label>
          <div className={classes.RepositoryActions}>
            <Button
              size="small"
              leadingVisual={BellIcon}
              aria-pressed={watching}
              onClick={() => {
                setWatching(!watching)
                setNotice(
                  watching
                    ? 'Stopped watching in this demo only.'
                    : 'Watching in this demo only. No GitHub notifications will be sent.',
                )
              }}
            >
              {watching ? 'Watching' : 'Watch'} <span className={classes.Count}>{29 + Number(watching)}</span>
            </Button>
            <Button
              as="a"
              href={`${repositoryUrl}/forks`}
              target="_blank"
              rel="noreferrer"
              size="small"
              leadingVisual={RepoForkedIcon}
            >
              Fork <span className={classes.Count}>709</span>
            </Button>
            <Button
              size="small"
              leadingVisual={starred ? StarFillIcon : StarIcon}
              aria-pressed={starred}
              onClick={() => {
                setStarred(!starred)
                setNotice(
                  starred
                    ? 'Star removed in this demo only.'
                    : 'Repository starred in this demo only. Nothing was changed on GitHub.',
                )
              }}
            >
              {starred ? 'Starred' : 'Star'}{' '}
              <span className={classes.Count}>{(3925 + Number(starred)).toLocaleString('en-US')}</span>
            </Button>
          </div>
          <Avatar src={avatarSource(currentUser)} alt={`Demo user: ${currentUser}`} size={28} />
        </div>
        <UnderlineNav aria-label="Repository navigation">
          <UnderlineNav.Item href={repositoryUrl} target="_blank" rel="noreferrer" icon={CodeIcon}>
            Code
          </UnderlineNav.Item>
          <UnderlineNav.Item
            href="#issues-list"
            icon={IssueOpenedIcon}
            counter={issues.filter(issue => issue.state === 'open').length}
            aria-current="page"
          >
            Issues
          </UnderlineNav.Item>
          <UnderlineNav.Item
            href={`${repositoryUrl}/pulls`}
            target="_blank"
            rel="noreferrer"
            icon={GitPullRequestIcon}
            counter={56}
          >
            Pull requests
          </UnderlineNav.Item>
          <UnderlineNav.Item
            href={`${repositoryUrl}/discussions`}
            target="_blank"
            rel="noreferrer"
            icon={CommentDiscussionIcon}
          >
            Discussions
          </UnderlineNav.Item>
          <UnderlineNav.Item href={`${repositoryUrl}/actions`} target="_blank" rel="noreferrer" icon={WorkflowIcon}>
            Actions
          </UnderlineNav.Item>
          <UnderlineNav.Item href={`${repositoryUrl}/projects`} target="_blank" rel="noreferrer" icon={TableIcon}>
            Projects
          </UnderlineNav.Item>
          <UnderlineNav.Item href={`${repositoryUrl}/security`} target="_blank" rel="noreferrer" icon={ShieldIcon}>
            Security and quality
          </UnderlineNav.Item>
          <UnderlineNav.Item href={`${repositoryUrl}/pulse`} target="_blank" rel="noreferrer" icon={GraphIcon}>
            Insights
          </UnderlineNav.Item>
        </UnderlineNav>
      </header>

      <div className={classes.Workspace} data-sidebar={sidebarVisible}>
        {sidebarVisible && (
          <aside className={classes.Sidebar} aria-label="Issue views">
            <div className={classes.SidebarHeading}>
              <strong>Issues</strong>
              <IconButton
                icon={SidebarCollapseIcon}
                variant="invisible"
                size="small"
                aria-label="Collapse issue sidebar"
                onClick={() => setSidebarVisible(false)}
              />
            </div>
            <ActionList className={classes.SidebarNavigation}>
              {['All issues', 'Assigned to me', 'Created by me'].map(item => (
                <ActionList.Item key={item} active={view === item} onSelect={() => changeView(item)}>
                  <ActionList.LeadingVisual>
                    <IssueOpenedIcon />
                  </ActionList.LeadingVisual>
                  {item}
                </ActionList.Item>
              ))}
              <ActionList.Divider />
              <ActionList.Group>
                <ActionList.GroupHeading as="h2">Plan and organize</ActionList.GroupHeading>
                <ActionList.LinkItem href={`${repositoryUrl}/projects`} target="_blank" rel="noreferrer">
                  <ActionList.LeadingVisual>
                    <TableIcon />
                  </ActionList.LeadingVisual>
                  Projects
                </ActionList.LinkItem>
                <ActionList.LinkItem href={`${repositoryUrl}/milestones`} target="_blank" rel="noreferrer">
                  <ActionList.LeadingVisual>
                    <MilestoneIcon />
                  </ActionList.LeadingVisual>
                  Milestones
                </ActionList.LinkItem>
                <ActionList.LinkItem href={`${repositoryUrl}/labels`} target="_blank" rel="noreferrer">
                  <ActionList.LeadingVisual>
                    <TagIcon />
                  </ActionList.LeadingVisual>
                  Labels
                </ActionList.LinkItem>
              </ActionList.Group>
            </ActionList>
            <p className={classes.SidebarNote}>
              <BookIcon /> Built with Primer React
            </p>
          </aside>
        )}

        <main className={classes.Main} id="issues-list">
          <PageHeader>
            <PageHeader.TitleArea>
              <PageHeader.Title as="h1">
                <span className={classes.Inline}>
                  {!sidebarVisible && (
                    <IconButton
                      icon={SidebarExpandIcon}
                      variant="invisible"
                      size="small"
                      aria-label="Expand issue sidebar"
                      onClick={() => setSidebarVisible(true)}
                    />
                  )}
                  Issues
                </span>
              </PageHeader.Title>
            </PageHeader.TitleArea>
            <PageHeader.Actions>
              <div className={classes.Inline}>
                <div className={classes.MobileViews}>
                  <ActionMenu>
                    <ActionMenu.Button aria-label="Choose issue view">Views</ActionMenu.Button>
                    <ActionMenu.Overlay width="medium">
                      <ActionList selectionVariant="single">
                        {['All issues', 'Assigned to me', 'Created by me'].map(item => (
                          <ActionList.Item key={item} selected={view === item} onSelect={() => changeView(item)}>
                            {item}
                          </ActionList.Item>
                        ))}
                      </ActionList>
                    </ActionMenu.Overlay>
                  </ActionMenu>
                </div>
                <Button
                  ref={newIssueRef}
                  variant="primary"
                  leadingVisual={PlusIcon}
                  onClick={() => setNewIssueOpen(true)}
                >
                  New issue
                </Button>
              </div>
            </PageHeader.Actions>
          </PageHeader>

          <div className={classes.SearchToolbar}>
            <TextInput
              block
              leadingVisual={SearchIcon}
              aria-label="Search issues"
              aria-describedby={searchHelpId}
              placeholder="Search all issues"
              value={query}
              onChange={event => {
                setQuery(event.target.value)
                setPage(1)
              }}
            />
            <Button onClick={resetFilters}>Clear filters</Button>
          </div>
          <div className={classes.DemoNote}>
            <span id={searchHelpId}>Search titles, #numbers or qualifiers like label:bug and type:Bug.</span>
            <span>Local demo · {issues.filter(issue => issue.state === 'open').length} open · 7 closed fixtures</span>
          </div>

          <section className={classes.IssueList} aria-label="Issues">
            <div className={classes.ListToolbar}>
              <div className={classes.StatusControls}>
                <Checkbox
                  aria-label="Select all issues on this page"
                  checked={visible.length > 0 && selectedOnPage === visible.length}
                  indeterminate={selectedOnPage > 0 && selectedOnPage < visible.length}
                  disabled={visible.length === 0}
                  onChange={event => {
                    setSelected(
                      event.target.checked
                        ? [...new Set([...selected, ...visible.map(issue => issue.number)])]
                        : selected.filter(number => !visible.some(issue => issue.number === number)),
                    )
                  }}
                />
                <Button
                  size="small"
                  variant="invisible"
                  leadingVisual={IssueOpenedIcon}
                  aria-pressed={search.state === 'open'}
                  onClick={() => changeState('open')}
                >
                  Open <span className={classes.Count}>{openCount}</span>
                </Button>
                <Button
                  size="small"
                  variant="invisible"
                  leadingVisual={CheckIcon}
                  aria-pressed={search.state === 'closed'}
                  onClick={() => changeState('closed')}
                >
                  Closed <span className={classes.Count}>{closedCount}</span>
                </Button>
              </div>
              <div className={classes.Filters}>
                <FilterPanel
                  name="Author"
                  value={author}
                  options={authors}
                  onChange={value => {
                    setAuthor(value)
                    setPage(1)
                  }}
                />
                <FilterPanel
                  name="Labels"
                  value={label}
                  options={labels}
                  onChange={value => {
                    setLabel(value)
                    setPage(1)
                  }}
                />
                <FilterPanel
                  name="Types"
                  value={type}
                  options={['Bug', 'Feature', 'Task', 'No type']}
                  onChange={value => {
                    setType(value)
                    setPage(1)
                  }}
                />
                <FilterPanel
                  name="Sort"
                  value={sort}
                  options={['Newest', 'Oldest', 'Most commented', 'Least commented']}
                  onChange={value => {
                    setSort(value || 'Newest')
                    setPage(1)
                  }}
                />
                <SegmentedControl
                  aria-label="Issues display density"
                  onChange={index => setRowDensity(index === 0 ? 'comfortable' : 'compact')}
                >
                  <SegmentedControl.IconButton
                    icon={RowsIcon}
                    aria-label="Comfortable display density"
                    selected={rowDensity === 'comfortable'}
                  />
                  <SegmentedControl.IconButton
                    icon={ThreeBarsIcon}
                    aria-label="Compact display density"
                    selected={rowDensity === 'compact'}
                  />
                </SegmentedControl>
              </div>
            </div>
            {selected.length > 0 && (
              <div className={classes.SelectionToolbar} aria-label="Selected issue actions">
                <strong>{selected.length} selected</strong>
                <Button size="small" onClick={() => updateSelected('closed')}>
                  Close selected
                </Button>
                <Button size="small" onClick={() => updateSelected('open')}>
                  Reopen selected
                </Button>
                <Button size="small" variant="invisible" onClick={() => setSelected([])}>
                  Clear selection
                </Button>
              </div>
            )}
            <ul
              className={classes.Rows}
              data-density={rowDensity}
              aria-label={`${search.state === 'open' ? 'Open' : 'Closed'} issues`}
            >
              {visible.map(issue => (
                <li key={issue.number} className={classes.Row} data-selected={selected.includes(issue.number)}>
                  <div className={classes.RowCheckbox}>
                    <Checkbox
                      aria-label={`Select issue ${issue.number}`}
                      checked={selected.includes(issue.number)}
                      onChange={event =>
                        setSelected(
                          event.target.checked
                            ? [...selected, issue.number]
                            : selected.filter(number => number !== issue.number),
                        )
                      }
                    />
                  </div>
                  <span
                    className={classes.StateIcon}
                    data-state={issue.state}
                    role="img"
                    aria-label={issue.state === 'open' ? 'Open issue' : 'Closed issue'}
                  >
                    {issue.state === 'open' ? <IssueOpenedIcon size={16} /> : <IssueClosedIcon size={16} />}
                  </span>
                  <div className={classes.IssueContent}>
                    <div className={classes.IssueTitleLine}>
                      {issue.local ? (
                        <Link as="button" className={classes.IssueTitle} onClick={() => setPreviewIssue(issue)}>
                          {issue.title}
                        </Link>
                      ) : (
                        <Link
                          className={classes.IssueTitle}
                          href={`${repositoryUrl}/issues/${issue.number}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {issue.title}
                        </Link>
                      )}
                      {issue.labels.map(item => (
                        <IssueLabel
                          key={item}
                          className={classes.IssueTag}
                          variant={labelVariant(item)}
                          onClick={() => {
                            setLabel(item)
                            setPage(1)
                          }}
                          aria-label={`Filter by label ${item}`}
                        >
                          {item}
                        </IssueLabel>
                      ))}
                    </div>
                    <div className={classes.IssueMetadata}>
                      {issue.type && <span className={classes.Type}>{issue.type}</span>}
                      <span>#{issue.number}</span>
                      <span>·</span>
                      <span>
                        {issue.local ? 'created locally' : 'opened'} on{' '}
                        <time dateTime={issue.date}>
                          {new Date(`${issue.date}T12:00:00Z`).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'UTC',
                          })}
                        </time>{' '}
                        by {issue.author}
                      </span>
                      {issue.local && <Label size="small">Local only</Label>}
                    </div>
                  </div>
                  {(Boolean(issue.assignees?.length) || issue.comments > 0) && (
                    <div className={classes.RowTrailing}>
                      {Boolean(issue.assignees?.length) && (
                        <div className={classes.Assignees}>
                          {issue.assignees
                            ?.slice(0, 2)
                            .map(login => (
                              <Avatar
                                key={login}
                                src={avatarSource(login)}
                                size={20}
                                alt={`Assigned to ${login}`}
                                title={`Assigned to ${login}`}
                              />
                            ))}
                        </div>
                      )}
                      {issue.comments > 0 && (
                        <Link
                          muted
                          className={classes.Comments}
                          href={`${repositoryUrl}/issues/${issue.number}#issuecomment-new`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${issue.comments} comments on issue ${issue.number}`}
                        >
                          <CommentIcon />
                          {issue.comments}
                        </Link>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {visible.length === 0 && (
              <div className={classes.Empty}>
                <SearchIcon size={24} />
                <h2>No results matched your search</h2>
                <p>Try a different title, label or issue type.</p>
                <Button onClick={resetFilters}>Clear all filters</Button>
              </div>
            )}
          </section>
          <div className={classes.Pagination}>
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              showPages={{narrow: false}}
              onPageChange={(event, nextPage) => {
                event.preventDefault()
                setPage(nextPage)
              }}
            />
            <span className={classes.Muted}>
              {filtered.length
                ? `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length} issues`
                : '0 issues'}
            </span>
          </div>
          <p className={classes.Notice} role="status" aria-live="polite">
            {notice || `${filtered.length} ${search.state} issues match. Changes stay in this demo.`}
          </p>
          <footer className={classes.Footer}>
            <MarkGithubIcon size={20} />
            <span>© 2026 GitHub, Inc.</span>
            <Link muted href="https://docs.github.com" target="_blank" rel="noreferrer">
              Docs
            </Link>
            <Link muted href="https://www.githubstatus.com" target="_blank" rel="noreferrer">
              Status
            </Link>
            <span>Reconstructed with Primer React</span>
          </footer>
        </main>
      </div>
      {newIssueOpen && (
        <Dialog
          title="New issue"
          subtitle="Create an issue in this local demo. Nothing will be posted to GitHub."
          onClose={() => setNewIssueOpen(false)}
          width="xlarge"
          returnFocusRef={newIssueRef}
          initialFocusRef={titleRef}
          footerButtons={[
            {buttonType: 'default', content: 'Cancel', onClick: () => setNewIssueOpen(false)},
            {buttonType: 'primary', content: 'Create local issue', disabled: !draftTitle.trim(), onClick: createIssue},
          ]}
        >
          <form
            className={classes.IssueForm}
            onSubmit={event => {
              event.preventDefault()
              createIssue()
            }}
          >
            <FormControl required>
              <FormControl.Label>Title</FormControl.Label>
              <TextInput
                ref={titleRef}
                block
                value={draftTitle}
                onChange={event => setDraftTitle(event.target.value)}
                placeholder="Give your issue a title"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Description</FormControl.Label>
              <Textarea
                block
                rows={6}
                value={draftBody}
                onChange={event => setDraftBody(event.target.value)}
                placeholder="Describe the issue, expected behavior, and steps to reproduce…"
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Issue type</FormControl.Label>
              <Select value={draftType} onChange={event => setDraftType(event.target.value)}>
                {['Bug', 'Feature', 'Task'].map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </FormControl>
          </form>
        </Dialog>
      )}
      {previewIssue && (
        <Dialog
          title={previewIssue.title}
          subtitle={`#${previewIssue.number} · Local demo issue`}
          onClose={() => setPreviewIssue(null)}
          width="xlarge"
        >
          <p className={classes.PreviewBody}>{previewIssue.body || 'No description provided.'}</p>
          <p className={classes.Muted}>This issue exists only in this story and has not been posted to GitHub.</p>
        </Dialog>
      )}
    </div>
  )
}

export const Default = () => (
  <PlaygroundAppearance>
    <IssuesPage />
  </PlaygroundAppearance>
)
