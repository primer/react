import {memo, useCallback, useRef, useState, type CSSProperties} from 'react'
import {createPortal} from 'react-dom'
import {clsx} from 'clsx'
import {
  AccessibilityIcon,
  AgentIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  BoldIcon,
  BookmarkIcon,
  CheckCircleFillIcon,
  CheckIcon,
  ChevronDownIcon,
  CodeIcon,
  CommentDiscussionIcon,
  HistoryIcon,
  HomeIcon,
  InfoIcon,
  IssueOpenedIcon,
  ItalicIcon,
  KebabHorizontalIcon,
  LinkIcon,
  ListUnorderedIcon,
  MarkGithubIcon,
  MentionIcon,
  PaperAirplaneIcon,
  PaintbrushIcon,
  PlusIcon,
  ProjectRoadmapIcon,
  QuestionIcon,
  SearchIcon,
  SmileyIcon,
  VideoIcon,
  WorkflowIcon,
} from '@primer/octicons-react'
import {ActionList} from '../../ActionList'
import {ActionMenu} from '../../ActionMenu'
import {FeatureFlags} from '../../FeatureFlags'
import {useMedia} from '../../hooks/useMedia'
import {useResizeObserver} from '../../hooks/useResizeObserver'
import Link from '../../Link'
import Portal from '../../Portal'
import Spinner from '../../Spinner'
import useLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {SelectPanel} from '../index'
import {updateFilmPointer} from './filmAnatomy'
import {SelectPanelFilmIssue} from './SelectPanelFilmIssue'
import {SelectPanelFilmBrowserChrome, SelectPanelFilmDesktopBackground} from './SelectPanelFilmDesktop'
import {PlatformCapabilities, ShowcaseTypewriter} from './SelectPanelShowcase'
import {
  filmChannelMessages,
  filmConversation,
  filmDraftConversation,
  filmRequests,
  filmRequestTiming,
  filmScreenshotMessage,
  filmTiming,
} from './filmTimeline'
import showcaseClasses from './SelectPanelShowcase.module.css'
import classes from './SelectPanelFilmSequence.module.css'

const draftScreenshot = new URL('./SelectPanelFilmDraft.png', import.meta.url).href

const agents = [
  {
    id: 'project-manager',
    name: 'Project manager',
    description: 'Keeps the work moving',
    group: 'Plan',
    icon: ProjectRoadmapIcon,
    status: 'done',
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Shapes the experience',
    group: 'Plan',
    icon: PaintbrushIcon,
    status: 'done',
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'Plans the technical approach',
    group: 'Plan',
    icon: WorkflowIcon,
    status: 'done',
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Turns the plan into code',
    group: 'Build',
    icon: CodeIcon,
    status: 'working',
  },
  {
    id: 'accessibility',
    name: 'Accessibility Reviewer',
    description: 'Reviews inclusive interaction',
    group: 'Review',
    icon: AccessibilityIcon,
    status: 'queued',
  },
] as const

function FilmPointer({
  className,
  target,
  style,
  continuous,
}: {
  className?: string
  target?: string
  style?: CSSProperties
  continuous?: boolean
}) {
  return (
    <svg
      className={clsx(classes.Pointer, className)}
      width="32"
      height="38"
      viewBox="0 0 30 36"
      aria-hidden="true"
      data-target={target}
      data-film-pointer={continuous ? '' : undefined}
      style={style}
    >
      <path
        d="M3 2L25 20L15 22L10 32L3 2Z"
        fill="currentColor"
        stroke="white"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatAvatar({person}: {person: string}) {
  return (
    <span className={classes.Avatar} data-person={person} aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="8" fill="var(--avatar-background)" />
        <path d="M5 40C5 29 11 27 20 27S35 29 35 40" fill="var(--avatar-shirt)" />
        <path d="M9 29V17C9 2 31 2 31 17V29" fill="var(--avatar-hair)" />
        <path d="M16 25H24V31C22 34 18 34 16 31Z" fill="var(--avatar-skin)" />
        <ellipse cx="20" cy="18" rx="8" ry="10" fill="var(--avatar-skin)" />
        <path d="M11 17C10 6 27 3 30 16C25 16 22 12 21 10C18 14 15 16 11 17Z" fill="var(--avatar-hair)" />
        <circle cx="17" cy="18" r="0.8" fill="var(--avatar-hair)" />
        <circle cx="24" cy="18" r="0.8" fill="var(--avatar-hair)" />
        <path d="M18 23Q20 25 23 23" stroke="var(--avatar-hair)" strokeLinecap="round" />
        {person === 'S' ? <path d="M13 17H19V21H13ZM22 17H28V21H22ZM19 18H22" stroke="var(--avatar-hair)" /> : null}
      </svg>
      <span className={classes.Presence} />
    </span>
  )
}

export function FilmTeamChat({time, alone = false}: {time: number; alone?: boolean}) {
  const returning = alone && time >= filmTiming.teamReturn
  const reviewing = alone && time >= filmTiming.draftShare && !returning
  const messages = returning || reviewing ? filmChannelMessages : alone ? filmConversation : filmRequests
  const sent = messages.filter(message => time >= message.time + filmRequestTiming.delivery)
  const visible = alone ? sent : sent.slice(-3)
  const ownMessage = returning
    ? time >= filmTiming.approvalTyping
      ? filmDraftConversation[4]
      : filmDraftConversation[0]
    : reviewing
      ? filmScreenshotMessage
      : filmConversation[2]
  const typingStart = returning
    ? time >= filmTiming.approvalTyping
      ? filmTiming.approvalTyping
      : filmTiming.draftPrTyping
    : reviewing
      ? filmTiming.draftShareTyping
      : filmTiming.replyTyping
  const reply =
    alone && time >= typingStart && time < ownMessage.time + filmRequestTiming.delivery
      ? Array.from(ownMessage.message)
          .slice(0, Math.floor((time - typingStart) / 40))
          .join('')
      : ''
  const messageList = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const viewport = messageList.current
    if ((!returning && !reviewing) || !viewport) return
    viewport.scrollTop = viewport.scrollHeight - viewport.clientHeight
  }, [returning, reviewing, time])
  const minimize = reviewing ? filmTiming.draftShareMinimize : filmTiming.draft
  const attaching = reviewing && time >= filmTiming.draftShareAttach && time < filmTiming.draftShared
  return (
    <>
      <aside
        className={classes.Chat}
        aria-label="Team conversation"
        data-alone={alone}
        data-returning={returning}
        data-reviewing={reviewing}
        data-minimizing={alone && !returning && time >= minimize}
        style={
          alone
            ? ({
                '--conversation-age': `-${time - filmTiming.conversation}ms`,
                '--minimize-age': `${minimize - time}ms`,
                '--return-age': `${(reviewing ? filmTiming.draftShare : filmTiming.teamReturn) - time}ms`,
              } as CSSProperties)
            : undefined
        }
      >
        <div className={classes.ChatTopBar} aria-hidden="true">
          <div className={classes.WindowDots}>
            <span />
            <span data-film-minimize />
            <span />
          </div>
          <ArrowLeftIcon size={14} />
          <ArrowRightIcon size={14} />
          <HistoryIcon size={15} />
          <div className={classes.WorkspaceSearch}>
            <SearchIcon size={12} />
            <span>Search</span>
          </div>
          <QuestionIcon size={16} />
        </div>
        <div className={classes.ChatBody}>
          <div className={classes.ChatRail} aria-hidden="true">
            <span className={classes.WorkspaceMark}>
              <MarkGithubIcon size={20} />
            </span>
            {[
              {label: 'Home', icon: HomeIcon},
              {label: 'DMs', icon: CommentDiscussionIcon},
              {label: 'Activity', icon: BellIcon},
              {label: 'Later', icon: BookmarkIcon},
              {label: 'More', icon: KebabHorizontalIcon},
            ].map(({label, icon: Icon}) => (
              <div key={label} className={classes.RailItem} data-active={label === 'Home'}>
                <span>
                  <Icon size={19} />
                  {label === 'Activity' ? <i /> : null}
                </span>
                {label}
              </div>
            ))}
            <div className={classes.RailBottom}>
              <PlusIcon size={20} />
              <ChatAvatar person="S" />
            </div>
          </div>
          <div className={classes.Channel}>
            <header className={classes.ChannelHeader}>
              <strong>
                <span>#</span> feature-agent-assignment <ChevronDownIcon size={12} />
              </strong>
              <span className={classes.Huddle} aria-hidden="true">
                <VideoIcon size={17} />
                <ChevronDownIcon size={10} />
              </span>
            </header>
            <div className={classes.ChannelDetails}>
              <span aria-hidden="true">
                <ChatAvatar person="M" />
                <ChatAvatar person="L" />
                <ChatAvatar person="S" />
                <span className={classes.MemberOverflow}>+21</span>
              </span>
              <span>24 members</span>
              <span className={classes.ChannelTopic}>Building something together</span>
            </div>
            <div ref={messageList} className={classes.ChatMessages}>
              <div className={classes.ChatDate}>
                <span>Today</span>
              </div>
              {alone && time >= filmTiming.channelJoined ? (
                <div className={classes.SystemMessage} style={{animationDelay: `${filmTiming.channelJoined - time}ms`}}>
                  <InfoIcon size={16} />
                  <span>
                    You&apos;ve been added to this channel by <strong>Maya</strong>
                  </span>
                </div>
              ) : null}
              {visible.map((message, index) => (
                <div
                  className={classes.OldMessage}
                  key={message.time}
                  data-film-message={message.time}
                  data-new={
                    (returning && message.time >= filmTiming.teamReturn) ||
                    (reviewing && message.time >= filmScreenshotMessage.time)
                  }
                  style={{'--message-age': `${message.time + filmRequestTiming.delivery - time}ms`} as CSSProperties}
                >
                  <ChatAvatar person={message.initials} />
                  <div>
                    <div className={classes.MessageByline}>
                      <strong>{message.author}</strong>
                      <time>10:{String(index + 1).padStart(2, '0')} AM</time>
                    </div>
                    <p>
                      {'href' in message ? (
                        <>
                          <span>{message.message}</span>
                          <br />
                          <Link inline href={message.href}>
                            {message.href}
                          </Link>
                        </>
                      ) : (
                        message.message
                      )}
                    </p>
                    {'screenshot' in message ? (
                      <img
                        className={classes.SharedScreenshot}
                        src={draftScreenshot}
                        alt="Draft agent picker with Architect selected"
                        width="384"
                        height="277"
                      />
                    ) : null}
                    {alone && 'reactions' in message ? (
                      <div
                        className={classes.ReactionRow}
                        role="group"
                        aria-label={`Reactions to ${message.author}'s message`}
                      >
                        {message.reactions.map((reaction, reactionIndex) => {
                          const nextMessage = messages.at(index + 1)
                          const reactionTime = nextMessage
                            ? Math.min(time, nextMessage.time + filmRequestTiming.delivery)
                            : time
                          const age =
                            reactionTime - (message.time + filmRequestTiming.delivery + 500 + reactionIndex * 180)
                          if (age < 0) return null
                          const count = Math.min(reaction.count, 1 + Math.floor(age / 120))
                          return (
                            <span
                              key={reaction.label}
                              className={classes.Reaction}
                              role="img"
                              aria-label={`${reaction.label}, ${count} ${count === 1 ? 'reaction' : 'reactions'}`}
                              style={{'--reaction-age': `-${age}ms`} as CSSProperties}
                            >
                              <span aria-hidden="true">{reaction.emoji}</span>
                              <span>{count}</span>
                            </span>
                          )
                        })}
                      </div>
                    ) : null}
                    {!alone && index < visible.length - 1 ? (
                      <span className={classes.Reaction} role="img" aria-label="Completed, 1 reaction">
                        <CheckIcon size={12} /> 1
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <div className={classes.Composer}>
              <div className={classes.ComposerFormatting} aria-hidden="true">
                <BoldIcon size={15} />
                <ItalicIcon size={15} />
                <span />
                <LinkIcon size={15} />
                <span />
                <ListUnorderedIcon size={16} />
                <CodeIcon size={16} />
              </div>
              <span className={classes.ComposerPlaceholder} data-writing={reply.length > 0}>
                {reply || 'Message #feature-agent-assignment'}
              </span>
              {attaching ? (
                <img
                  className={classes.AttachedScreenshot}
                  src={draftScreenshot}
                  alt="Attached screenshot of the draft agent picker"
                  width="384"
                  height="277"
                />
              ) : null}
              <div className={classes.ComposerActions} aria-hidden="true">
                <span className={classes.Attach}>
                  <PlusIcon size={17} />
                </span>
                <SmileyIcon size={16} />
                <MentionIcon size={16} />
                <span className={classes.ComposerSpacer} />
                <PaperAirplaneIcon size={16} data-film-send />
                <ChevronDownIcon size={10} />
              </div>
            </div>
            <div className={classes.ComposerHint}>
              <span>
                <strong>Shift + Return</strong> to add a new line
              </span>
            </div>
          </div>
        </div>
      </aside>
      {alone && !returning && !reviewing ? (
        <FilmPointer
          className={classes.MinimizePointer}
          style={
            {
              '--minimize-pointer-age': `${filmTiming.minimizePointer - time}ms`,
            } as CSSProperties
          }
        />
      ) : null}
    </>
  )
}

function FilmDraftCapture({time}: {time: number}) {
  const capture = useRef<HTMLDivElement>(null)
  const capturedPanel = useRef<HTMLElement | null>(null)
  const measure = useCallback(() => {
    const region = capture.current
    const target = document.querySelector<HTMLElement>('[data-film-trigger-target]')
    const heading = target?.previousElementSibling
    const panel = capturedPanel.current
    if (!region || !heading || !panel) throw new Error('The film needs the draft picker for its screenshot.')
    const titleBounds = heading.getBoundingClientRect()
    const panelBounds = panel.getBoundingClientRect()
    const left = titleBounds.left - 12
    const top = titleBounds.top - 8
    region.style.setProperty('--capture-left', `${left}px`)
    region.style.setProperty('--capture-top', `${top}px`)
    region.style.setProperty('--capture-width', `${panelBounds.right - left + 12}px`)
    region.style.setProperty('--capture-height', `${panelBounds.bottom - top + 12}px`)
  }, [])
  useLayoutEffect(() => {
    capturedPanel.current =
      document.querySelector('[aria-label="Available agents"]')?.closest<HTMLElement>('[role="dialog"]') ?? null
    measure()
  }, [measure])
  useResizeObserver(measure, capturedPanel)
  return (
    <div
      ref={capture}
      className={classes.Capture}
      role="img"
      aria-label={
        time < filmTiming.draftScreenshotTaken ? 'Selecting the agent panel for a screenshot' : 'Screenshot captured'
      }
      data-captured={time >= filmTiming.draftScreenshotTaken}
      style={
        {
          '--capture-age': `${filmTiming.draftScreenshot - time}ms`,
          '--captured-age': `${filmTiming.draftScreenshotTaken - time}ms`,
        } as CSSProperties
      }
    >
      <div className={classes.CaptureRegion}>
        <div className={classes.CaptureMarquee} data-film-screenshot-selection />
        <svg className={classes.CaptureCrosshair} width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <path d="M14 0V28M0 14H28" stroke="white" strokeWidth="3" />
          <path d="M14 0V28M0 14H28" stroke="black" />
        </svg>
        <img className={classes.CapturedScreenshot} src={draftScreenshot} alt="" width="384" height="277" />
      </div>
      <div className={classes.CaptureFlash} />
    </div>
  )
}

export function FilmAgentPicker({time, mobile = false}: {time: number; mobile?: boolean}) {
  const [cursorContainer, setCursorContainer] = useState<HTMLElement | null>(null)
  useLayoutEffect(() => {
    setCursorContainer(document.body)
  }, [])
  const issueContext = !mobile && time < filmTiming.platform
  const draftReady = time >= filmTiming.draftZoomEnd
  const draftTarget = useRef<HTMLDivElement>(null)
  const [origin, setOrigin] = useState({
    panelX: 0,
    panelY: 0,
    panelWidth: 0,
    panelMaxHeight: 0,
  })
  useLayoutEffect(() => {
    const target = draftTarget.current
    if (!issueContext || !draftReady || !target) return
    const bounds = target.getBoundingClientRect()
    setOrigin({
      panelX: bounds.left,
      panelY: bounds.bottom + 4,
      panelWidth: bounds.width,
      panelMaxHeight: 810 - bounds.bottom - 20,
    })
  }, [issueContext, draftReady])
  useLayoutEffect(() => {
    // The anatomy runner positions the cursor after advancing its carried cards.
    if (issueContext && !document.querySelector('[data-film-anatomy]')) updateFilmPointer(document, time)
  }, [issueContext, time, origin, cursorContainer])
  const motion: CSSProperties & Record<'--draft-zoom-age', string> = {
    '--draft-zoom-age': `${filmTiming.minimizeEnd - time}ms`,
  }
  const grouped = time >= filmTiming.groups
  const descriptions = time >= filmTiming.descriptions
  const search = time >= filmTiming.search
  const [modeChoice, setModeChoice] = useState<{time: number; multiple: boolean} | null>(null)
  const multiple = modeChoice?.time === time ? modeChoice.multiple : time >= filmTiming.multiple
  const [modeMenu, setModeMenu] = useState<{time: number; open: boolean} | null>(null)
  const modeOpen = modeMenu?.time === time ? modeMenu.open : time >= filmTiming.modeOpen && time < filmTiming.multiple
  const footer = time >= filmTiming.footer
  const statuses = time >= filmTiming.statuses
  const [filter, setFilter] = useState('')
  const results = agents.filter(agent =>
    `${agent.name} ${agent.description}`.toLowerCase().includes(filter.toLowerCase()),
  )
  const selected =
    time < filmTiming.draftSelect
      ? []
      : [
          'architect',
          ...(multiple && time >= filmTiming.developerSelect ? ['developer'] : []),
          ...(multiple && time >= filmTiming.reviewerSelect ? ['accessibility'] : []),
        ]
  const reveal = (partTime: number): CSSProperties => ({
    animationDelay: `-${Math.max(0, time - partTime)}ms`,
  })
  const row = (agent: (typeof agents)[number]) => {
    const Icon = agent.icon
    const status = time >= filmTiming.agentsFinished ? 'done' : agent.status
    return (
      <SelectPanel.Item key={agent.id} value={agent.id} className={classes.Option}>
        {/* eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item composes ActionList.Item. */}
        <ActionList.LeadingVisual>
          <Icon size={16} />
        </ActionList.LeadingVisual>
        {agent.name}
        {descriptions ? (
          // eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item composes ActionList.Item.
          <ActionList.Description
            variant="block"
            className={classes.Description}
            style={reveal(filmTiming.descriptions)}
          >
            {agent.description}
          </ActionList.Description>
        ) : null}
        {statuses && selected.includes(agent.id) ? (
          // eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item composes ActionList.Item.
          <ActionList.TrailingVisual>
            <span
              role="img"
              aria-label={status}
              className={classes.Status}
              data-state={status}
              style={{'--status-angle': `${((time - filmTiming.statuses) % 1_000) * 0.36}deg`} as CSSProperties}
            >
              {status === 'done' ? (
                <CheckCircleFillIcon size={16} />
              ) : status === 'working' ? (
                <Spinner size="small" srText={null} className={classes.StatusSpinner} />
              ) : (
                <span className={classes.QueuedStatus} />
              )}
            </span>
          </ActionList.TrailingVisual>
        ) : null}
      </SelectPanel.Item>
    )
  }

  return (
    <FeatureFlags
      flags={{
        primer_react_css_anchor_positioning: false,
        primer_react_select_panel_native_dialog: false,
        primer_react_select_panel_native_invokers: false,
      }}
    >
      <SelectPanel.Root
        open={mobile ? time >= filmTiming.mobileOpen : !issueContext || time >= filmTiming.listDrop}
        selected={selected}
        selectionMode={multiple ? 'multiple' : 'single'}
        closeOnSelect={false}
        filterValue={filter}
        onFilterChange={setFilter}
      >
        <section
          className={clsx(issueContext ? classes.DraftWorkbench : classes.Workbench, mobile && classes.MobileWorkbench)}
          style={issueContext ? motion : undefined}
        >
          {mobile ? (
            <SelectPanelFilmIssue mobile>
              <h3 className={classes.DraftHeading}>Agents</h3>
              <div className={classes.MobileTrigger}>
                <SelectPanel.Trigger leadingVisual={AgentIcon} block>
                  Assign agents
                </SelectPanel.Trigger>
                <span
                  className={classes.TapIndicator}
                  aria-hidden="true"
                  data-active={time >= filmTiming.mobileTap && time < filmTiming.mobileTap + 500}
                  style={{'--tap-age': `${filmTiming.mobileTap - time}ms`} as CSSProperties}
                />
              </div>
            </SelectPanelFilmIssue>
          ) : issueContext ? (
            <div className={classes.DraftBrowser}>
              <SelectPanelFilmBrowserChrome />
              <div className={classes.DraftPage}>
                <SelectPanelFilmIssue>
                  <h3 className={classes.DraftHeading}>Agents</h3>
                  <div ref={draftTarget} className={classes.DraftTarget} data-film-trigger-target>
                    <div
                      className={classes.DraftTrigger}
                      style={{visibility: time < filmTiming.triggerDrop ? 'hidden' : undefined}}
                    >
                      <SelectPanel.Trigger leadingVisual={AgentIcon} block>
                        Assign agents
                      </SelectPanel.Trigger>
                    </div>
                  </div>
                </SelectPanelFilmIssue>
              </div>
            </div>
          ) : (
            <>
              <div className={classes.WorkbenchHeading}>
                <IssueOpenedIcon size={20} />
                <span>
                  Add agent assignment to issues <span className={classes.IssueNumber}>#2048</span>
                </span>
              </div>
              <div className={classes.IssuePreview}>
                <div className={classes.PreviewLines}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={classes.AgentField}>
                  <strong>Agents</strong>
                  <SelectPanel.Trigger leadingVisual={AgentIcon} block>
                    Assign agents
                  </SelectPanel.Trigger>
                  <span className={classes.Assigned}>
                    <AgentIcon size={14} /> Architect{multiple ? ' + Developer' : ''}
                  </span>
                </div>
              </div>
            </>
          )}
          <SelectPanel.Overlay
            width="medium"
            variant={mobile ? {narrow: 'bottom-sheet'} : undefined}
            cssAnchorPositioningSettings={{disable: true}}
            focusTrapSettings={{disabled: true}}
            overlayProps={{
              preventFocusOnOpen: issueContext || mobile,
              preventFocusOnClose: issueContext || mobile,
              ...(issueContext ? {anchorSide: undefined} : {}),
              className: clsx(issueContext ? classes.DraftList : classes.Picker, mobile && classes.MobilePicker),
              style: {
                ...(issueContext
                  ? {
                      ...motion,
                      position: 'fixed',
                      left: origin.panelX,
                      top: origin.panelY,
                      width: origin.panelWidth,
                      maxHeight: origin.panelMaxHeight,
                    }
                  : {}),
                '--mobile-sheet-age': `${filmTiming.mobileOpen - time}ms`,
              } as CSSProperties,
              'aria-label': 'Assign agents',
            }}
          >
            <SelectPanel.Content>
              <SelectPanel.Form className={classes.PickerForm}>
                {!issueContext ? (
                  <SelectPanel.Header>
                    <SelectPanel.Title>Assign agents</SelectPanel.Title>
                    <SelectPanel.CloseButton aria-label="Close agent picker" />
                  </SelectPanel.Header>
                ) : null}
                {search ? (
                  <div className={classes.Insert} style={reveal(filmTiming.search)}>
                    <SelectPanel.SearchInput
                      aria-label="Search agents"
                      placeholder="Find an agent…"
                      leadingVisual={<SearchIcon />}
                    />
                  </div>
                ) : null}
                <SelectPanel.List className={classes.AgentList} aria-label="Available agents">
                  {['Plan', 'Build', 'Review']
                    .filter(group => results.some(agent => agent.group === group))
                    .map(group => (
                      <SelectPanel.Group
                        key={group}
                        label={grouped ? group : ''}
                        data-grouped={grouped}
                        className={classes.Group}
                        style={{'--group-clock': `${filmTiming.groups - time}ms`} as CSSProperties}
                      >
                        {results.filter(agent => agent.group === group).map(row)}
                      </SelectPanel.Group>
                    ))}
                </SelectPanel.List>
                {results.length === 0 ? (
                  <SelectPanel.Message variant="empty" title="No matching agents" size="inline">
                    Try another role.
                  </SelectPanel.Message>
                ) : null}
                {footer ? (
                  <SelectPanel.Footer
                    className={clsx(classes.Insert, classes.PickerFooter)}
                    style={reveal(filmTiming.footer)}
                  >
                    <span className={classes.SelectionCount}>{selected.length} agents selected</span>
                    <div className={classes.FooterActions}>
                      <SelectPanel.CancelButton size="small">Cancel</SelectPanel.CancelButton>
                      <SelectPanel.SubmitButton size="small" variant="primary">
                        Apply
                      </SelectPanel.SubmitButton>
                    </div>
                  </SelectPanel.Footer>
                ) : null}
              </SelectPanel.Form>
            </SelectPanel.Content>
          </SelectPanel.Overlay>
        </section>
        {/* The cursor must sit above the isolated stacking contexts of later menus. */}
        {issueContext && time >= filmTiming.minimizeEnd && time < filmTiming.mobileReveal && cursorContainer
          ? createPortal(<FilmPointer className={classes.ContinuousPointer} continuous />, cursorContainer)
          : null}
        {time >= filmTiming.modeOpen - filmRequestTiming.approach - filmRequestTiming.readingPause && issueContext ? (
          <Portal>
            <div
              className={classes.ModeSwitch}
              style={{
                right: 1440 - origin.panelX + 28,
                top: origin.panelY + 68,
                visibility: time >= filmTiming.multiple + 700 ? 'hidden' : undefined,
              }}
            >
              <code>selectionMode=&quot;</code>
              <ActionMenu open={modeOpen} onOpenChange={open => setModeMenu({time, open})}>
                <ActionMenu.Button
                  className={classes.ModeValue}
                  variant="invisible"
                  size="small"
                  aria-label="Selection mode"
                >
                  {multiple ? 'multiple' : 'single'}
                </ActionMenu.Button>
                <ActionMenu.Overlay
                  width="small"
                  className={classes.ModeMenu}
                  anchorSide={undefined}
                  style={{zIndex: 700}}
                  preventFocusOnOpen
                >
                  <ActionList selectionVariant="single">
                    {(['single', 'multiple'] as const).map(value => (
                      <ActionList.Item
                        key={value}
                        selected={(value === 'multiple') === multiple}
                        onSelect={() => {
                          setModeChoice({time, multiple: value === 'multiple'})
                          setModeMenu({time, open: false})
                        }}
                      >
                        <code>{value}</code>
                      </ActionList.Item>
                    ))}
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
              <code>&quot;</code>
            </div>
          </Portal>
        ) : null}
      </SelectPanel.Root>
    </FeatureFlags>
  )
}

function FilmPlatformScene({time}: {time: number}) {
  const scene = useRef<HTMLElement>(null)
  const capabilities = useRef<HTMLDivElement>(null)
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)', false)
  const age = time - filmTiming.platform
  const duration = filmTiming.closing - filmTiming.platform
  const capabilityAge = Math.max(0, time - filmTiming.platformCapabilities)
  const capabilityDuration = filmTiming.closing - filmTiming.platformCapabilities
  const title = 'Platform and performance. Future proof.'
  useLayoutEffect(() => {
    for (const animation of scene.current?.getAnimations({subtree: true}) ?? []) {
      animation.pause()
      animation.currentTime = age
    }
    for (const animation of capabilities.current?.getAnimations({subtree: true}) ?? []) {
      animation.pause()
      animation.currentTime = capabilityAge
    }
  }, [age, capabilityAge, reducedMotion])
  return (
    <section
      ref={scene}
      className={clsx(showcaseClasses.Film, classes.Platform)}
      data-layout="slideshow"
      data-scene="platform"
      data-motion={!reducedMotion && age > 0}
      aria-label="Platform and performance"
      style={{'--showcase-phase-duration': `${duration}ms`} as CSSProperties}
    >
      <div className={showcaseClasses.Narrative}>
        <h1 aria-label={title}>
          <ShowcaseTypewriter title={title} />
        </h1>
        <div
          ref={capabilities}
          style={
            {
              '--showcase-phase-duration': `${capabilityDuration}ms`,
              visibility: time < filmTiming.platformCapabilities ? 'hidden' : undefined,
            } as CSSProperties
          }
        >
          <PlatformCapabilities time={capabilityAge} duration={capabilityDuration} reducedMotion={reducedMotion} />
        </div>
      </div>
    </section>
  )
}

function FilmSlackNotifications({time}: {time: number}) {
  const delivered = filmRequests.slice(1).filter(message => time >= message.time + filmRequestTiming.delivery)
  if (delivered.length === 0) return null
  return (
    <section className={classes.Notifications} aria-label="Slack notifications">
      {delivered.map(request => (
        <FilmSlackNotification
          key={request.time}
          request={request}
          age={Math.min(filmRequestTiming.entrance, time - request.time - filmRequestTiming.delivery)}
        />
      ))}
    </section>
  )
}

const FilmSlackNotification = memo(function FilmSlackNotification({
  request,
  age,
}: {
  request: (typeof filmRequests)[number]
  age: number
}) {
  return (
    <aside className={classes.Notification} aria-label="Slack notification" style={{animationDelay: `-${age}ms`}}>
      <svg className={classes.NotificationIcon} width="48" height="48" viewBox="0 0 24 24" aria-hidden="true">
        <g fill="#36c5f0">
          <rect x="6" y="0" width="5" height="5" rx="2.5" />
          <rect x="0" y="6" width="11" height="5" rx="2.5" />
        </g>
        <g fill="#2eb67d">
          <rect x="12" y="0" width="5" height="11" rx="2.5" />
          <rect x="18" y="6" width="5" height="5" rx="2.5" />
        </g>
        <g fill="#e01e5a">
          <rect x="0" y="12" width="5" height="5" rx="2.5" />
          <rect x="6" y="12" width="5" height="11" rx="2.5" />
        </g>
        <g fill="#ecb22e">
          <rect x="12" y="12" width="11" height="5" rx="2.5" />
          <rect x="12" y="18" width="5" height="5" rx="2.5" />
        </g>
      </svg>
      <div className={classes.NotificationContent}>
        <div className={classes.NotificationHeader}>
          <strong>Slack</strong>
          <span className={classes.NotificationSender}>
            <strong>{request.author}</strong>
            <span> in #feature-agent-assignment</span>
          </span>
          <time>now</time>
        </div>
        <p>{request.message}</p>
      </div>
    </aside>
  )
})

export function SelectPanelFilmSequence({time}: {time: number}) {
  const phoneFrame = useRef<HTMLIFrameElement>(null)
  const phoneTime = Math.max(filmTiming.mobile, Math.min(time, filmTiming.teamReturn))
  useLayoutEffect(() => {
    const synchronize = () => {
      phoneFrame.current?.contentWindow?.postMessage(
        {type: 'select-panel-film-time', time: phoneTime},
        window.location.origin,
      )
    }
    const receive = (event: MessageEvent<unknown>) => {
      if (
        event.origin === window.location.origin &&
        event.source === phoneFrame.current?.contentWindow &&
        typeof event.data === 'object' &&
        event.data !== null &&
        'type' in event.data &&
        event.data.type === 'select-panel-film-ready'
      ) {
        synchronize()
      }
    }
    window.addEventListener('message', receive)
    synchronize()
    return () => window.removeEventListener('message', receive)
  }, [phoneTime])
  const conversation = time < filmTiming.draft
  const draft = time >= filmTiming.draft && time < filmTiming.build
  const capturing = time >= filmTiming.draftScreenshot && time < filmTiming.draftShare
  const sharing = time >= filmTiming.draftShare && time < filmTiming.draftShareEnd
  const mobile = time >= filmTiming.mobile && time < filmTiming.teamReturn
  const phoneExiting = time >= filmTiming.teamReturn && time < filmTiming.teamReturn + 600
  const teamReturn = time >= filmTiming.teamReturn && time < filmTiming.platform
  const platform = time >= filmTiming.platform && time < filmTiming.closing
  const closing = time >= filmTiming.closing
  const request = filmRequests.findLast(message => time >= message.time)
  const age = request ? time - request.time : 0
  const scene =
    capturing || sharing
      ? 'share-draft'
      : conversation
        ? 'conversation'
        : draft
          ? 'draft'
          : closing
            ? 'closing'
            : platform
              ? 'platform'
              : teamReturn
                ? 'team-return'
                : mobile
                  ? 'mobile'
                  : 'build'
  return (
    <div
      className={classes.Sequence}
      data-film-scene={scene}
      style={
        {
          '--cue-age': `-${age}ms`,
          '--scene-age': `-${time - (closing ? filmTiming.closing : platform ? filmTiming.platform : mobile ? filmTiming.mobile : filmTiming.build)}ms`,
          '--draft-zoom-age': `${filmTiming.minimizeEnd - time}ms`,
        } as CSSProperties
      }
    >
      {conversation || draft ? (
        <div className={classes.DraftDesktop}>
          <SelectPanelFilmDesktopBackground application={conversation ? 'Slack' : 'Chrome'} />
        </div>
      ) : null}
      {time < filmTiming.minimizeEnd || sharing || teamReturn ? (
        <FilmTeamChat time={time} alone />
      ) : !draft && !closing && !platform && time >= filmTiming.draftShareEnd ? (
        <FilmSlackNotifications time={time} />
      ) : null}
      {closing ? (
        <div className={classes.Closing}>
          <h1>
            <span>SelectPanel</span>
            <span className={classes.ClosingSuffix}>, now composable</span>
          </h1>
          <p>what will you build?</p>
        </div>
      ) : platform ? (
        <FilmPlatformScene time={time} />
      ) : (
        <FilmAgentPicker time={time} />
      )}
      {capturing ? <FilmDraftCapture time={time} /> : null}
      <div
        className={classes.Phone}
        data-active={(mobile || phoneExiting) && time >= filmTiming.mobileReveal}
        data-exiting={phoneExiting}
        aria-hidden={(!mobile && !phoneExiting) || time < filmTiming.mobileReveal}
        style={
          {
            '--phone-age': `${filmTiming.mobileReveal - time}ms`,
            '--phone-exit-age': `${filmTiming.teamReturn - time}ms`,
          } as CSSProperties
        }
      >
        <div className={classes.PhoneBar}>
          <span>9:41</span>
          <span>•••</span>
        </div>
        {/* eslint-disable-next-line @eslint-react/dom/no-missing-iframe-sandbox -- Trusted same-origin story; its real narrow viewport drives responsive SelectPanel. */}
        <iframe
          ref={phoneFrame}
          title="Agent assignment on a phone"
          src="/iframe.html?id=components-selectpanel-film--mobile-surface&viewMode=story"
        />
        <span className={classes.HomeIndicator} />
      </div>
    </div>
  )
}
