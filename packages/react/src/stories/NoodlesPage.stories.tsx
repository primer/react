import {useId, useRef, useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, waitFor, within} from 'storybook/test'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BookIcon,
  ChevronRightIcon,
  CodeSquareIcon,
  CommentDiscussionIcon,
  CommentIcon,
  GearIcon,
  GrabberIcon,
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
import Textarea from '../Textarea'
import TextInput from '../TextInput'
import {
  PlaygroundAppearanceControls,
  PlaygroundAppearancePortals,
  PlaygroundAppearanceProvider,
  PlaygroundAppearanceSurface,
} from './PlaygroundAppearance'
import {noodlesPages, noodlesReports, noodlesStatusSections} from './NoodlesPage.fixtures'
import classes from './NoodlesPage.stories.module.css'

const meta = {
  title: 'Design tools/Noodles page',
  globals: {colorScheme: 'light'},
  parameters: {
    layout: 'fullscreen',
    controls: {disable: true},
    docs: {
      description: {
        component:
          'A separate Primer-first interpretation of a user-authorized Noodles reference. Default uses unmodified Primer appearance tokens. The Noodles theme is an optional scoped preset; every existing theme, Density and Seriousness control also works here. Layout and typography approximate the reference without importing its code, fonts, assets, authenticated URLs, account details or report copy. All report text, notes and pages are fictional local fixtures. Navigation, report switching, page creation/renaming/duplication, comments, attachments, reading width, focus mode and Markdown preview run locally. No account connection, remote writes or persistence. Reloading resets the demo.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>
type UtilityDialog = 'agent' | 'settings' | 'attachments' | null
type EditDialog = 'new' | 'rename' | null

function NoodlesPage() {
  const [pages, setPages] = useState([...noodlesPages])
  const [selectedId, setSelectedId] = useState('status-updates')
  const [reportIndex, setReportIndex] = useState(0)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [projectExpanded, setProjectExpanded] = useState(true)
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
    'Fictional notes for the Arcade Shield team.',
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

  function addPage(pageTitle: string) {
    const page = {id: `${id}-page-${nextId.current++}`, title: pageTitle}
    setPages(current => [...current, page])
    setSelectedId(page.id)
    setNotice(`Created "${pageTitle}" locally. Nothing was saved remotely.`)
  }

  function reset() {
    setPages([...noodlesPages])
    setSelectedId('status-updates')
    setReportIndex(0)
    setReportTitles({})
    setNotesByPage({})
    setAttachmentsByPage({})
    setNoteDraft('')
    setMarkdown(false)
    setNotice('Local pages, comments and attachments reset. Appearance choices are unchanged.')
  }

  return (
    <div className={classes.Workspace} data-sidebar={sidebarVisible && !focusMode} data-comments={commentsOpen}>
      {sidebarVisible && !focusMode && (
        <aside className={classes.Sidebar} aria-label="Page navigation">
          <div className={classes.Brand}>
            <span className={classes.Wordmark}>
              <CodeSquareIcon size={16} /> Noodles
            </span>
            <IconButton
              icon={SidebarCollapseIcon}
              variant="invisible"
              size="small"
              aria-label="Hide page navigation"
              onClick={() => setSidebarVisible(false)}
            />
          </div>
          <Button
            className={classes.Project}
            variant="invisible"
            block
            alignContent="start"
            leadingVisual={BookIcon}
            onClick={() => setUtilityDialog('settings')}
          >
            Arcade &middot; Shield Project
          </Button>
          <nav className={classes.Navigation} aria-label="Workspace pages">
            <Button
              variant="invisible"
              leadingVisual={projectExpanded ? ArrowDownIcon : ChevronRightIcon}
              aria-expanded={projectExpanded}
              aria-controls={`${id}-pages`}
              onClick={() => setProjectExpanded(value => !value)}
              block
              alignContent="start"
            >
              Arcade &middot; Shield Project
            </Button>
            {projectExpanded && (
              <ActionList id={`${id}-pages`}>
                {pages.map(page => (
                  <ActionList.Item
                    key={page.id}
                    active={selectedId === page.id}
                    onSelect={() => {
                      setSelectedId(page.id)
                      setMarkdown(false)
                    }}
                  >
                    {page.title}
                    {page.count !== undefined && (
                      <ActionList.TrailingVisual>
                        <span className={classes.Count}>{page.count}</span>
                      </ActionList.TrailingVisual>
                    )}
                  </ActionList.Item>
                ))}
              </ActionList>
            )}
            <Button
              variant="invisible"
              leadingVisual={PlusIcon}
              block
              alignContent="start"
              onClick={() => openEditor('new')}
            >
              New page
            </Button>
          </nav>
          <div className={classes.SidebarFooter}>
            <Button
              variant="invisible"
              leadingVisual={CommentDiscussionIcon}
              trailingVisual={PlusIcon}
              block
              alignContent="start"
              onClick={() => setUtilityDialog('agent')}
            >
              Connect agent
            </Button>
            <Button
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
                  <ActionList.Item onSelect={() => addPage(`${title} (copy)`)}>Duplicate page</ActionList.Item>
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
        <main className={classes.ScrollArea} aria-label="Noodles document" tabIndex={0}>
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
                      ? 'Fictional weekly report for the Arcade Shield team.'
                      : 'A local planning page for the Arcade Shield project.'}
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
              This prototype does not connect to an agent or request credentials. Try appearance controls, local pages
              and comments instead.
            </p>
          ) : (
            <>
              <p>
                Arcade &middot; Shield Project is a fictional local workspace. Use the appearance bar to try themes,
                density and Seriousness.
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

function NoodlesDemo() {
  return (
    <PlaygroundAppearanceProvider>
      <div className={classes.Playground}>
        <PlaygroundAppearanceControls />
        <PlaygroundAppearanceSurface className={classes.Surface}>
          <NoodlesPage />
        </PlaygroundAppearanceSurface>
        <PlaygroundAppearancePortals />
      </div>
    </PlaygroundAppearanceProvider>
  )
}

export const Default: Story = {render: () => <NoodlesDemo />}

export const NoodlesTheme: Story = {
  render: () => <NoodlesDemo />,
  play: async ({canvas, canvasElement}) => {
    await userEvent.click(canvas.getByRole('button', {name: 'Choose theme: Primer'}))
    const body = within(canvasElement.ownerDocument.body)
    const dialog = within(await body.findByRole('dialog', {name: 'Themes'}))
    const theme = dialog.getByRole('button', {name: 'Use Noodles theme', exact: true})
    await userEvent.click(theme)
    await expect(theme).toHaveAttribute('aria-pressed', 'true')
    await userEvent.keyboard('{Escape}')
    await expect(canvas.getByRole('heading', {name: 'October 2, 2026', level: 1})).toBeVisible()
    await expect(canvas.getByRole('heading', {name: 'October 2, 2026', level: 1})).toHaveStyle({
      fontSize: '36px',
      fontWeight: '500',
    })
  },
}

export const LocalInteractions: Story = {
  render: () => <NoodlesDemo />,
  play: async ({canvas, canvasElement}) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole('button', {name: 'New page', exact: true}))
    const dialog = within(await body.findByRole('dialog', {name: 'New page', exact: true}))
    const title = dialog.getByRole('textbox', {name: /Page title/})
    await userEvent.type(title, '   ')
    await userEvent.click(dialog.getByRole('button', {name: 'Create page'}))
    await expect(dialog.getByText('Enter a page title.')).toBeVisible()
    await userEvent.clear(title)
    await userEvent.type(title, 'Release notes')
    await userEvent.click(dialog.getByRole('button', {name: 'Create page'}))
    await expect(canvas.getByRole('heading', {name: 'Release notes', level: 1})).toBeVisible()
    await userEvent.click(canvas.getByRole('button', {name: 'Page comments'}))
    await userEvent.type(canvas.getByRole('textbox', {name: 'Add a comment'}), 'Ready for review.')
    await userEvent.click(canvas.getByRole('button', {name: 'Comment', exact: true}))
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
