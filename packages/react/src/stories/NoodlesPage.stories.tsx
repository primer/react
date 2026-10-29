import {useId, useMemo, useRef, useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookIcon,
  ChevronDownIcon,
  CodeSquareIcon,
  CommentDiscussionIcon,
  CommentIcon,
  GearIcon,
  GrabberIcon,
  HomeIcon,
  KebabHorizontalIcon,
  LinkIcon,
  PaperclipIcon,
  PencilIcon,
  PlusIcon,
  ScreenFullIcon,
  SidebarCollapseIcon,
  SidebarExpandIcon,
  SyncIcon,
  ZapIcon,
} from '@primer/octicons-react'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import {Button, IconButton} from '../Button'
import {Dialog} from '../Dialog'
import FormControl from '../FormControl'
import Heading from '../Heading'
import {NavList} from '../NavList'
import {PortalContext, registerPortalRoot} from '../Portal'
import Textarea from '../Textarea'
import TextInput from '../TextInput'
import {
  noodlesPages,
  noodlesProjectCover,
  noodlesProjectPages,
  noodlesReports,
  noodlesStatusSections,
} from './NoodlesPage.fixtures'
import type {NoodlesPageFixture} from './NoodlesPage.fixtures'
import classes from './NoodlesPage.stories.module.css'

const meta = {
  title: 'Examples/Noodles page',
  globals: {colorScheme: 'light'},
  parameters: {
    layout: 'fullscreen',
    controls: {disable: true},
    docs: {
      description: {
        component:
          'A standalone Noodles-inspired workspace with a fixed, page-scoped Noodles theme. Five optional ActionList and Button styling hooks provide its label typography and button typography; existing semantic tokens handle the remaining colors and selection styling. Menus and dialogs inherit the same theme through a registered portal container. Navigation, page creation, comments, attachments, reading width, focus mode and Markdown preview work locally with original fictional report fixtures. No account connection, remote writes or persistence. Reloading resets the demo.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>
type UtilityDialog = 'agent' | 'settings' | 'attachments' | null
type EditDialog = 'new' | 'rename' | null
const initialPages = [noodlesProjectCover, ...noodlesProjectPages, ...noodlesPages]

function NoodleCover() {
  return <span className={classes.NoodleCover} aria-hidden="true" />
}

function NoodleSwitcherIcon() {
  return (
    <span className={classes.CoverChevron} aria-hidden="true">
      <ChevronDownIcon size={12} />
    </span>
  )
}

function NoodlesPage() {
  const [pages, setPages] = useState([...initialPages])
  const [selectedId, setSelectedId] = useState('status-updates')
  const [reportIndex, setReportIndex] = useState(0)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [focusMode, setFocusMode] = useState(false)
  const [wide, setWide] = useState(false)
  const [markdown, setMarkdown] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [notesByPage, setNotesByPage] = useState<Record<string, string[]>>({})
  const [noteDraft, setNoteDraft] = useState('')
  const [utilityDialog, setUtilityDialog] = useState<UtilityDialog>(null)
  const [editDialog, setEditDialog] = useState<EditDialog>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [attachmentsByPage, setAttachmentsByPage] = useState<Record<string, string[]>>({})
  const [deliveryGroup, setDeliveryGroup] = useState('Third slice')
  const [notice, setNotice] = useState('')
  const [reportTitles, setReportTitles] = useState<Record<string, string>>({})
  const id = useId()
  const nextId = useRef(0)
  const titleRef = useRef<HTMLInputElement>(null)
  const selected = pages.find(page => page.id === selectedId)
  if (!selected) throw new Error(`Unknown local Noodles page: ${selectedId}`)
  const reportDate = noodlesReports.find((_, index) => index === reportIndex)
  if (!reportDate) throw new Error(`Unknown local Noodles report: ${reportIndex}`)
  const isReport = selected.id === 'status-updates'
  const pageKey = isReport ? reportDate : selected.id
  const notes = notesByPage[pageKey] ?? []
  const attachments = attachmentsByPage[pageKey] ?? []
  const title = isReport ? (reportTitles[reportDate] ?? reportDate) : selected.title
  const markdownPreview = [
    `# ${title}`,
    '',
    isReport ? `## Week ${12 - reportIndex}: Rollout readiness` : `## ${selected.title}`,
    '',
    'Demo notes for the Octoinvaders Ink Shield team.',
    ...noodlesStatusSections.flatMap(section => [
      '',
      `## ${section.heading}`,
      '',
      ...(section.items?.map(item => `- ${item}`) ?? [section.paragraph]),
    ]),
  ].join('\n')

  function openEditor(mode: EditDialog) {
    setDraftTitle(mode === 'rename' ? title : '')
    setTitleError(false)
    setEditDialog(mode)
  }

  function addPage(pageTitle: string, parentId?: string) {
    const page = {id: `${id}-page-${nextId.current++}`, title: pageTitle, parentId}
    setPages(current => [...current, page])
    setSelectedId(page.id)
    setNotice(`Created "${pageTitle}" locally. Nothing was saved remotely.`)
  }

  function reset() {
    setPages([...initialPages])
    setSelectedId('status-updates')
    setReportIndex(0)
    setReportTitles({})
    setNotesByPage({})
    setAttachmentsByPage({})
    setNoteDraft('')
    setMarkdown(false)
    setNotice('Local pages, comments and attachments reset.')
  }

  function openCover() {
    setSelectedId('project-cover')
    setMarkdown(false)
  }

  function renderPage(page: NoodlesPageFixture) {
    return (
      <NavList.Item
        key={page.id}
        href={`#${id}-${page.id}`}
        aria-current={selectedId === page.id ? 'page' : undefined}
        onClick={event => {
          event.preventDefault()
          setSelectedId(page.id)
          setMarkdown(false)
        }}
      >
        {page.title}
        {page.count !== undefined && <NavList.TrailingVisual>{page.count}</NavList.TrailingVisual>}
      </NavList.Item>
    )
  }

  return (
    <div className={classes.Workspace} data-sidebar={sidebarVisible && !focusMode} data-comments={commentsOpen}>
      {sidebarVisible && !focusMode && (
        <aside className={classes.Sidebar} aria-label="Page navigation">
          <div className={classes.Brand}>
            <span className={classes.Wordmark}>
              <LinkIcon size={16} /> Noodles
            </span>
            <IconButton
              icon={SidebarCollapseIcon}
              variant="invisible"
              size="small"
              className={classes.NavigationToggle}
              aria-label="Hide page navigation"
              onClick={() => setSidebarVisible(false)}
            />
          </div>
          <div className={classes.Project}>
            <ActionMenu>
              <ActionMenu.Anchor>
                <IconButton
                  icon={NoodleSwitcherIcon}
                  variant="invisible"
                  size="small"
                  className={classes.ProjectSwitch}
                  aria-label="Switch noodle"
                />
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList selectionVariant="single">
                  <ActionList.Group>
                    <ActionList.GroupHeading>Favourite noodles</ActionList.GroupHeading>
                    <ActionList.Item selected onSelect={openCover}>
                      {noodlesProjectCover.title}
                    </ActionList.Item>
                  </ActionList.Group>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
            <Button
              as="a"
              href={`#${id}-document`}
              aria-label={`Open ${noodlesProjectCover.title} cover`}
              className={classes.ProjectCoverLink}
              variant="invisible"
              leadingVisual={NoodleCover}
              block
              alignContent="start"
              onClick={event => {
                event.preventDefault()
                openCover()
              }}
            >
              {noodlesProjectCover.title}
            </Button>
            <ActionMenu>
              <ActionMenu.Anchor>
                <IconButton
                  icon={PlusIcon}
                  variant="invisible"
                  size="small"
                  className={classes.ProjectCreate}
                  aria-label="Create"
                />
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item onSelect={() => openEditor('new')}>
                    New page
                    <ActionList.Description variant="block">Create content</ActionList.Description>
                  </ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </div>
          <div className={classes.Navigation}>
            <NavList aria-label="Noodle pages">
              <NavList.Item>
                {noodlesProjectCover.title}
                <NavList.SubNav>
                  {pages.filter(page => page.parentId === 'project-cover').map(renderPage)}
                </NavList.SubNav>
              </NavList.Item>
              {pages.filter(page => page.id !== 'project-cover' && !page.parentId).map(renderPage)}
            </NavList>
            <Button
              variant="invisible"
              leadingVisual={PlusIcon}
              block
              alignContent="start"
              onClick={() => openEditor('new')}
            >
              New page
            </Button>
          </div>
          <div className={classes.SidebarFooter}>
            <Button
              className={classes.SidebarAction}
              variant="invisible"
              leadingVisual={CommentDiscussionIcon}
              trailingAction={PlusIcon}
              block
              alignContent="start"
              onClick={() => setUtilityDialog('agent')}
            >
              Connect agent
            </Button>
            <Button
              className={classes.SidebarAction}
              variant="invisible"
              leadingVisual={BookIcon}
              block
              alignContent="start"
              onClick={() => setUtilityDialog('settings')}
            >
              Noodle settings
            </Button>
            <div className={classes.Account}>
              <span className={classes.Avatar} aria-hidden="true">
                M
              </span>
              <span>Mona &middot; Demo account</span>
              <IconButton
                icon={GearIcon}
                variant="invisible"
                size="small"
                aria-label="App settings"
                onClick={() => setUtilityDialog('settings')}
              />
            </div>
          </div>
        </aside>
      )}
      <div className={classes.PagePanel} data-focus={focusMode} data-wide={wide}>
        <header className={classes.Header}>
          {(!sidebarVisible || focusMode) && (
            <IconButton
              icon={SidebarExpandIcon}
              variant="invisible"
              size="small"
              aria-label="Show page navigation"
              onClick={() => {
                setSidebarVisible(true)
                setFocusMode(false)
              }}
            />
          )}
          {selected.id === 'project-cover' && (
            <IconButton icon={HomeIcon} variant="invisible" aria-label="Open noodle cover" onClick={openCover} />
          )}
          <div className={classes.Breadcrumb} role="group" aria-label="Current page">
            <Button
              variant="invisible"
              size="small"
              leadingVisual={CodeSquareIcon}
              onClick={() => {
                setSelectedId('status-updates')
                setReportIndex(0)
              }}
            >
              {isReport ? 'Status updates' : 'Workspace'}
            </Button>
            <span className={classes.Muted} aria-hidden="true">
              /
            </span>
            {isReport ? (
              <ActionMenu>
                <ActionMenu.Button size="small" variant="invisible">
                  {title}
                </ActionMenu.Button>
                <ActionMenu.Overlay width="medium">
                  <ActionList selectionVariant="single">
                    {noodlesReports.map((report, index) => (
                      <ActionList.Item
                        key={report}
                        selected={reportIndex === index}
                        onSelect={() => setReportIndex(index)}
                      >
                        {report}
                      </ActionList.Item>
                    ))}
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            ) : (
              <span className={classes.CurrentTitle}>{title}</span>
            )}
            <ActionMenu>
              <ActionMenu.Anchor>
                <IconButton icon={KebabHorizontalIcon} aria-label="Page actions" size="small" variant="invisible" />
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item onSelect={() => openEditor('rename')}>Rename page</ActionList.Item>
                  <ActionList.Item onSelect={() => addPage(`${title} (copy)`, selected.parentId)}>
                    Duplicate page
                  </ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item onSelect={reset}>Reset local changes</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
            <IconButton
              icon={PlusIcon}
              size="small"
              variant="invisible"
              aria-label="Add tab"
              onClick={() => openEditor('new')}
            />
          </div>
          <div className={classes.HeaderActions}>
            <IconButton
              icon={CommentIcon}
              size="small"
              variant="invisible"
              aria-label="Page comments"
              aria-expanded={commentsOpen}
              aria-controls={`${id}-comments`}
              onClick={() => setCommentsOpen(value => !value)}
            />
            <div className={classes.SecondaryActions}>
              <IconButton
                icon={PaperclipIcon}
                size="small"
                variant="invisible"
                aria-label="Page attachments"
                onClick={() => setUtilityDialog('attachments')}
              />
              <IconButton
                icon={ZapIcon}
                size="small"
                variant="invisible"
                aria-label="Page automation"
                onClick={() => setUtilityDialog('agent')}
              />
              <IconButton
                icon={CommentDiscussionIcon}
                size="small"
                variant="invisible"
                aria-label="Open assistant"
                onClick={() => setUtilityDialog('agent')}
              />
            </div>
            <IconButton
              icon={ScreenFullIcon}
              size="small"
              variant="invisible"
              aria-label="Focus mode"
              aria-pressed={focusMode}
              onClick={() => setFocusMode(value => !value)}
            />
            <span className={classes.HeaderDivider} />
            <IconButton
              icon={ArrowUpIcon}
              size="small"
              variant="invisible"
              aria-label="Previous report"
              disabled={!isReport || reportIndex === noodlesReports.length - 1}
              onClick={() => setReportIndex(index => index + 1)}
            />
            <IconButton
              icon={ArrowDownIcon}
              size="small"
              variant="invisible"
              aria-label="Next report"
              disabled={!isReport || reportIndex === 0}
              onClick={() => setReportIndex(index => index - 1)}
            />
          </div>
        </header>
        <main id={`${id}-document`} className={classes.ScrollArea} aria-label="Noodles document" tabIndex={0}>
          <article className={classes.Document}>
            {markdown ? (
              <Textarea block readOnly rows={28} aria-label="Markdown preview" value={markdownPreview} />
            ) : (
              <>
                <Heading as="h1" className={classes.Title}>
                  {title}
                </Heading>
                <section className={classes.Introduction}>
                  <Heading as="h2" className={classes.SectionHeading}>
                    {isReport ? `Week ${12 - reportIndex}: Rollout readiness` : selected.title}
                  </Heading>
                  <p>
                    {isReport
                      ? 'Demo weekly report for the Octoinvaders Ink Shield team.'
                      : 'A local planning page for the Octoinvaders Ink Shield project.'}
                  </p>
                </section>
                {noodlesStatusSections.map((section, index) => (
                  <section className={classes.Section} key={section.heading}>
                    <span className={classes.BlockHandle} aria-hidden="true">
                      <GrabberIcon size={16} />
                    </span>
                    <Heading as="h2" className={classes.SectionHeading}>
                      {section.heading}
                    </Heading>
                    {section.items ? (
                      <ul>
                        {section.items.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{section.paragraph}</p>
                    )}
                    {!isReport && index === 0 && (
                      <p className={classes.Muted}>Use the page menu to rename or duplicate this fixture.</p>
                    )}
                  </section>
                ))}
              </>
            )}
          </article>
        </main>
        <footer className={classes.EditorFooter}>
          <Button
            variant="invisible"
            size="small"
            leadingVisual={PencilIcon}
            aria-label={markdown ? 'Switch to Rich text' : 'Switch to Markdown'}
            onClick={() => setMarkdown(value => !value)}
          >
            {markdown ? 'Markdown' : 'Rich text'}
          </Button>
          <ActionMenu>
            <ActionMenu.Anchor>
              <IconButton icon={KebabHorizontalIcon} variant="invisible" size="small" aria-label="Editor options" />
            </ActionMenu.Anchor>
            <ActionMenu.Overlay>
              <ActionList selectionVariant="single">
                <ActionList.Item selected={!wide} onSelect={() => setWide(false)}>
                  Comfortable width
                </ActionList.Item>
                <ActionList.Item selected={wide} onSelect={() => setWide(true)}>
                  Wide page
                </ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
          <span className={classes.Notice} role="status">
            {notice}
          </span>
          <ActionMenu>
            <ActionMenu.Button size="small">{deliveryGroup}</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList selectionVariant="single">
                {['First slice', 'Second slice', 'Third slice'].map(group => (
                  <ActionList.Item
                    key={group}
                    selected={deliveryGroup === group}
                    onSelect={() => setDeliveryGroup(group)}
                  >
                    {group}
                  </ActionList.Item>
                ))}
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
          <IconButton
            icon={SyncIcon}
            size="small"
            variant="invisible"
            aria-label="Reset prototype data"
            onClick={reset}
          />
        </footer>
      </div>
      {commentsOpen && (
        <aside className={classes.Comments} id={`${id}-comments`} aria-label="Page comments">
          <Heading as="h2" className={classes.SectionHeading}>
            Comments
          </Heading>
          <p className={classes.Muted}>Local demo notes only. Nothing is sent to the reference app.</p>
          {notes.length ? (
            <ul>
              {notes.map((note, index) => (
                <li key={`${index}-${note}`}>{note}</li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}
          <form
            onSubmit={event => {
              event.preventDefault()
              const note = noteDraft.trim()
              if (!note) {
                setNotice('Enter a comment before posting.')
                return
              }
              setNotesByPage(current => ({...current, [pageKey]: [...(current[pageKey] ?? []), note]}))
              setNoteDraft('')
            }}
          >
            <FormControl>
              <FormControl.Label>Add a comment</FormControl.Label>
              <Textarea block rows={4} value={noteDraft} onChange={event => setNoteDraft(event.target.value)} />
            </FormControl>
            <Button type="submit" variant="primary" disabled={!noteDraft.trim()}>
              Comment
            </Button>
          </form>
        </aside>
      )}
      {editDialog && (
        <Dialog
          title={editDialog === 'new' ? 'New page' : 'Rename page'}
          onClose={() => setEditDialog(null)}
          initialFocusRef={titleRef}
          footerButtons={[
            {content: 'Cancel', onClick: () => setEditDialog(null)},
            {
              content: editDialog === 'new' ? 'Create page' : 'Save title',
              buttonType: 'primary',
              type: 'submit',
              form: `${id}-page-form`,
            },
          ]}
        >
          <form
            id={`${id}-page-form`}
            onSubmit={event => {
              event.preventDefault()
              const value = draftTitle.trim()
              if (!value) {
                setTitleError(true)
                titleRef.current?.focus()
                return
              }
              if (editDialog === 'new') addPage(value)
              else if (isReport) setReportTitles(current => ({...current, [reportDate]: value}))
              else setPages(current => current.map(page => (page.id === selectedId ? {...page, title: value} : page)))
              setEditDialog(null)
            }}
          >
            <FormControl required>
              <FormControl.Label>Page title</FormControl.Label>
              <TextInput
                block
                ref={titleRef}
                value={draftTitle}
                onChange={event => {
                  setDraftTitle(event.target.value)
                  setTitleError(false)
                }}
              />
              {titleError && <FormControl.Validation variant="error">Enter a page title.</FormControl.Validation>}
              <FormControl.Caption>Stored in this demo until reload.</FormControl.Caption>
            </FormControl>
          </form>
        </Dialog>
      )}
      {utilityDialog && (
        <Dialog
          title={
            utilityDialog === 'attachments'
              ? 'Page attachments'
              : utilityDialog === 'agent'
                ? 'Connect agent'
                : 'Noodle settings'
          }
          onClose={() => setUtilityDialog(null)}
        >
          {utilityDialog === 'attachments' ? (
            <>
              {attachments.length ? (
                <ul>
                  {attachments.map(name => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              ) : (
                <p>No attachments yet.</p>
              )}
              <Button
                leadingVisual={LinkIcon}
                onClick={() =>
                  setAttachmentsByPage(current => ({
                    ...current,
                    [pageKey]: [...(current[pageKey] ?? []), `demo-notes-${attachments.length + 1}.txt`],
                  }))
                }
              >
                Add demo attachment
              </Button>
              <p className={classes.Muted}>Names only; no files are read, uploaded or downloaded.</p>
            </>
          ) : utilityDialog === 'agent' ? (
            <p>
              This prototype does not connect to an agent or request credentials. Try creating local pages and comments
              instead.
            </p>
          ) : (
            <>
              <p>
                This is a local demo of the Octoinvaders &middot; Ink Shield workspace. Changes stay in this story until
                you reload or reset the demo.
              </p>
              <Button
                onClick={() => {
                  reset()
                  setUtilityDialog(null)
                }}
              >
                Reset local demo
              </Button>
            </>
          )}
        </Dialog>
      )}
    </div>
  )
}

function NoodlesStory() {
  const portalContainerName = useId()
  const portalContext = useMemo(() => ({portalContainerName}), [portalContainerName])

  return (
    <PortalContext.Provider value={portalContext}>
      <div className={`${classes.Page} ${classes.NoodlesTheme}`}>
        <div className={classes.Surface}>
          <NoodlesPage />
        </div>
        <div
          className={classes.ThemePortals}
          ref={node => {
            if (node) registerPortalRoot(node, portalContainerName)
          }}
        />
      </div>
    </PortalContext.Provider>
  )
}

export const Default: Story = {
  render: () => <NoodlesStory />,
  play: async ({canvas, canvasElement}) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(canvas.getByRole('heading', {name: 'October 2, 2026', level: 1})).toHaveStyle({
      fontSize: '36px',
      fontWeight: '500',
    })
    await expect(canvas.getByRole('button', {name: 'Status updates'})).toHaveStyle({
      fontSize: '13px',
      fontWeight: '400',
    })
    const connectAgent = canvas.getByRole('button', {name: 'Connect agent'})
    await expect(connectAgent).toHaveAttribute('data-block', 'block')
    await expect(connectAgent).toHaveStyle({fontWeight: '400'})
    await expect(canvas.getByRole('button', {name: 'Noodle settings'})).toHaveStyle({fontWeight: '400'})
    const plus = connectAgent.querySelector('svg.octicon-plus')
    if (!plus) throw new Error('Connect agent must include a trailing plus icon')
    const plusInset = connectAgent.getBoundingClientRect().right - plus.getBoundingClientRect().right
    await expect(plusInset).toBeGreaterThanOrEqual(0)
    await expect(plusInset).toBeLessThanOrEqual(24)
    const navigation = within(canvas.getByRole('navigation', {name: 'Noodle pages'}))
    await expect(
      within(navigation.getByRole('link', {name: /Standups/})).getByText('Standups', {exact: true}),
    ).toHaveStyle({fontSize: '13px', color: 'rgb(89, 99, 110)'})
    const disclosure = navigation.getByRole('button', {name: noodlesProjectCover.title})
    await expect(disclosure).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(disclosure)
    await expect(navigation.getByRole('link', {name: 'First-use onboarding'})).toBeVisible()
    await expect(navigation.getByRole('link', {name: /Status updates/})).toBeVisible()
    await userEvent.click(navigation.getByRole('link', {name: 'First-use onboarding'}))
    await userEvent.click(disclosure)
    await expect(within(disclosure).getByText(noodlesProjectCover.title, {exact: true})).toHaveStyle({
      fontWeight: '400',
    })
    await expect(navigation.queryByRole('link', {name: 'First-use onboarding'})).not.toBeInTheDocument()
    await expect(navigation.getByRole('link', {name: /Status updates/})).toBeVisible()
    await userEvent.click(navigation.getByRole('link', {name: /Status updates/}))
    await userEvent.click(canvas.getByRole('button', {name: 'Switch noodle'}))
    const switcher = within(await body.findByRole('menu'))
    await expect(switcher.getByRole('menuitemradio', {name: noodlesProjectCover.title})).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await userEvent.keyboard('{Escape}')
    await userEvent.click(canvas.getByRole('link', {name: `Open ${noodlesProjectCover.title} cover`}))
    await expect(canvas.getByRole('heading', {name: noodlesProjectCover.title, level: 1})).toBeVisible()
    await expect(canvas.getByRole('button', {name: 'Open noodle cover'})).toBeVisible()
    await userEvent.click(navigation.getByRole('link', {name: /Status updates/}))
    await expect(canvas.getByRole('heading', {name: 'October 2, 2026', level: 1})).toBeVisible()
    await userEvent.click(canvas.getByRole('button', {name: 'Create'}))
    const createMenu = within(await body.findByRole('menu'))
    await userEvent.click(createMenu.getByRole('menuitem', {name: /^New page/}))
    const dialog = within(await body.findByRole('dialog', {name: 'New page'}))
    await expect(dialog.getByRole('button', {name: 'Create page'})).toHaveStyle({
      fontSize: '13px',
      fontWeight: '400',
      backgroundColor: 'rgb(31, 35, 40)',
      color: 'rgb(255, 255, 255)',
    })
    const title = dialog.getByRole('textbox', {name: /Page title/})
    await userEvent.type(title, '   ')
    await userEvent.click(dialog.getByRole('button', {name: 'Create page'}))
    await waitFor(() => expect(dialog.getByText('Enter a page title.')).toBeVisible())
    await userEvent.clear(title)
    await userEvent.type(title, 'Release notes')
    await userEvent.click(dialog.getByRole('button', {name: 'Create page'}))
    await expect(canvas.getByRole('heading', {name: 'Release notes', level: 1})).toBeVisible()
    await userEvent.click(canvas.getByRole('button', {name: 'Page comments'}))
    await userEvent.type(canvas.getByRole('textbox', {name: 'Add a comment'}), 'Ready for review.')
    await userEvent.click(canvas.getByRole('button', {name: 'Comment'}))
    await expect(canvas.getByText('Ready for review.')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', {name: 'Page comments'}))
    await userEvent.click(canvas.getByRole('button', {name: 'Reset prototype data'}))
    await waitFor(() => expect(canvas.getByRole('heading', {name: 'October 2, 2026', level: 1})).toBeVisible())
    await userEvent.click(canvas.getByRole('button', {name: 'Switch to Markdown'}))
    await expect(canvas.getByRole('textbox', {name: 'Markdown preview'})).toHaveProperty(
      'value',
      expect.stringContaining('# October 2, 2026'),
    )
    await userEvent.click(canvas.getByRole('button', {name: 'Switch to Rich text'}))
  },
}
