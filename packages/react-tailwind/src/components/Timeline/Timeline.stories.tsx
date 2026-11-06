import type {Meta, StoryObj} from '@storybook/react-vite'
import {
  AlertIcon,
  BellIcon,
  BellSlashIcon,
  BookmarkIcon,
  CheckCircleIcon,
  CommentDiscussionIcon,
  CopilotIcon,
  CrossReferenceIcon,
  EyeIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitMergeIcon,
  GitPullRequestClosedIcon,
  GitPullRequestDraftIcon,
  GitPullRequestIcon,
  IssueClosedIcon,
  IssueOpenedIcon,
  IssueReopenedIcon,
  LockIcon,
  MilestoneIcon,
  PencilIcon,
  PersonAddIcon,
  PersonIcon,
  PinIcon,
  ProjectIcon,
  RocketIcon,
  ShieldIcon,
  SkipIcon,
  TagIcon,
  TrashIcon,
  UnlockIcon,
  XCircleIcon,
} from '@primer/octicons-react'
import React from 'react'
import {useArgs} from 'storybook/preview-api'
import {Avatar} from '../Avatar'
import {Button} from '../Button'
import {Link} from '../Link'
import {RelativeTime} from '../RelativeTime'
import {Text} from '../Text'
import {type TimelineBadgeVariant, TimelineBadgeVariants} from './constants'
import {Timeline} from './Timeline'
import {
  PLAYGROUND_SURFACES,
  PLAYGROUND_SURFACE_IDS,
  playgroundCategoryIds,
  playgroundEvents,
  type PlaygroundCategoryId,
  type PlaygroundSurfaceId,
} from './Timeline.playground.storyHelpers'
import {Examples} from './Timeline.storyHelpers'

const meta = {
  title: 'React Tailwind/Layout/Timeline',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Avatar': Timeline.Avatar,
    'Timeline.Badge': Timeline.Badge,
    'Timeline.Body': Timeline.Body,
    'Timeline.Break': Timeline.Break,
    'Timeline.Actions': Timeline.Actions,
  },
  argTypes: {
    clipSidebar: {table: {disable: true}},
    className: {table: {disable: true}},
  },
} satisfies Meta<typeof Timeline>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Timeline {...args}>
      <Timeline.Item>
        <Timeline.Badge>
          <GitCommitIcon aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>This is a message</Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge>
          <GitCommitIcon aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>This is a message</Timeline.Body>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Badge>
          <GitCommitIcon aria-label="Commit" />
        </Timeline.Badge>
        <Timeline.Body>This is a message</Timeline.Body>
      </Timeline.Item>
    </Timeline>
  ),
}

const BADGE_ICONS = {
  alert: AlertIcon,
  bell: BellIcon,
  'bell-slash': BellSlashIcon,
  bookmark: BookmarkIcon,
  'check-circle': CheckCircleIcon,
  'comment-discussion': CommentDiscussionIcon,
  copilot: CopilotIcon,
  'cross-reference': CrossReferenceIcon,
  eye: EyeIcon,
  'git-branch': GitBranchIcon,
  'git-commit': GitCommitIcon,
  'git-merge': GitMergeIcon,
  'git-pull-request': GitPullRequestIcon,
  'git-pull-request-closed': GitPullRequestClosedIcon,
  'git-pull-request-draft': GitPullRequestDraftIcon,
  'issue-closed': IssueClosedIcon,
  'issue-opened': IssueOpenedIcon,
  'issue-reopened': IssueReopenedIcon,
  lock: LockIcon,
  milestone: MilestoneIcon,
  pencil: PencilIcon,
  person: PersonIcon,
  'person-add': PersonAddIcon,
  pin: PinIcon,
  project: ProjectIcon,
  rocket: RocketIcon,
  shield: ShieldIcon,
  skip: SkipIcon,
  tag: TagIcon,
  trash: TrashIcon,
  unlock: UnlockIcon,
  'x-circle': XCircleIcon,
} as const

type BadgeIconName = keyof typeof BADGE_ICONS
type ActorType = 'user' | 'bot' | 'app' | 'copilot'

const APP_PRESETS = {
  'GitHub Actions': {name: 'GitHub Actions', avatar: 'https://avatars.githubusercontent.com/in/15368?v=4'},
  'Custom App': {name: '', avatar: ''},
} as const
type AppPreset = keyof typeof APP_PRESETS

const ACTIONS_PRESETS = ['Single button', 'Two buttons'] as const
type ActionsPreset = (typeof ACTIONS_PRESETS)[number]

type TimestampPreset =
  | 'Relative (now)'
  | 'Relative (recent day)'
  | 'Relative (3 weeks)'
  | 'Absolute (today)'
  | 'Absolute (full timestamp)'

// Offsets before "now". `literal` renders fixed text because relative time shows sub-minute offsets as "now".
const TIMESTAMP_PRESETS: Record<
  TimestampPreset,
  {offsetMs: number; mode: 'literal' | 'relative' | 'today' | 'full'; text?: string}
> = {
  'Relative (now)': {offsetMs: 30 * 1000, mode: 'literal', text: 'just now'},
  'Relative (recent day)': {offsetMs: 26 * 60 * 60 * 1000, mode: 'relative'},
  'Relative (3 weeks)': {offsetMs: 21 * 24 * 60 * 60 * 1000, mode: 'relative'},
  'Absolute (today)': {offsetMs: 3 * 60 * 60 * 1000, mode: 'today'},
  'Absolute (full timestamp)': {offsetMs: 90 * 24 * 60 * 60 * 1000, mode: 'full'},
}

const TIME_ONLY_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
})
const FULL_TIMESTAMP_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
})

type EventPlaygroundArgs = {
  actorSize: 'small' | 'large'
  actorName: string
  actorType: ActorType
  actorAvatarSrc: string
  summaryText: string
  showNote: boolean
  noteText: string
  viaApp: boolean
  appPreset: AppPreset
  customAppName: string
  customAppAvatar: string
  eventScope: 'pull' | 'issue' | 'dependabot' | 'code-scanning' | 'secret-scanning' | 'license-compliance'
  eventType: string
  badgeIcon: BadgeIconName
  badgeVariant: TimelineBadgeVariant | 'none'
  eventTimestamp: TimestampPreset
  showActions: boolean
  actionsPreset: ActionsPreset
}

// Bot and Copilot represent fixed GitHub identities, so their names are not editable.
const BAKED_ACTOR_NAMES: Partial<Record<ActorType, string>> = {bot: 'dependabot', copilot: 'Copilot'}

const DEFAULT_ACTOR_NAMES: Record<ActorType, string> = {
  user: 'monalisa',
  bot: 'dependabot',
  app: 'GitHub Actions',
  copilot: 'Copilot',
}

const ACTOR_AVATARS: Record<ActorType, string> = {
  user: 'https://avatars.githubusercontent.com/u/92997159?v=4',
  bot: 'https://avatars.githubusercontent.com/in/29110?v=4',
  app: 'https://avatars.githubusercontent.com/in/15368?v=4',
  copilot: 'https://avatars.githubusercontent.com/in/1143301?v=4',
}

// `data-actor-type` only distinguishes people from automation, so app and Copilot presets serialize to `bot`.
const DATA_ACTOR_TYPE: Record<ActorType, 'user' | 'bot'> = {user: 'user', bot: 'bot', app: 'bot', copilot: 'bot'}

function EventPlaygroundStory(args: EventPlaygroundArgs) {
  const Icon = args.badgeIcon in BADGE_ICONS ? BADGE_ICONS[args.badgeIcon] : GitCommitIcon
  const isAppLike = args.actorType === 'bot' || args.actorType === 'app'
  const avatarSrc =
    args.actorType === 'user' && args.actorAvatarSrc ? args.actorAvatarSrc : ACTOR_AVATARS[args.actorType]
  const customActorName = (args.actorName as string | undefined)?.trim() || 'Unknown actor'
  const resolvedActorName = BAKED_ACTOR_NAMES[args.actorType] ?? customActorName
  const [now] = React.useState(() => Date.now())
  // Storybook can restore stale or empty select values from the URL.
  const timestampPreset =
    args.eventTimestamp in TIMESTAMP_PRESETS
      ? TIMESTAMP_PRESETS[args.eventTimestamp]
      : TIMESTAMP_PRESETS['Relative (now)']
  const timestampDate = new Date(now - timestampPreset.offsetMs)
  const appPreset = args.appPreset in APP_PRESETS ? APP_PRESETS[args.appPreset] : APP_PRESETS['GitHub Actions']
  const isCustomApp = args.appPreset === 'Custom App'
  const appName = isCustomApp ? args.customAppName : appPreset.name
  const appAvatar = isCustomApp ? args.customAppAvatar : appPreset.avatar

  let timestamp: React.ReactNode
  if (timestampPreset.mode === 'literal') timestamp = timestampPreset.text
  else if (timestampPreset.mode === 'relative') timestamp = <RelativeTime date={timestampDate} format="relative" />
  else if (timestampPreset.mode === 'today') timestamp = `Today ${TIME_ONLY_FORMATTER.format(timestampDate)}`
  else timestamp = FULL_TIMESTAMP_FORMATTER.format(timestampDate)

  return (
    // The left gutter reserves room for the large actor avatar so toggling `actorSize` does not shift the rail.
    <div className="max-w-[1012px] pl-[72px]">
      <Timeline>
        <Timeline.Item
          data-event-scope={args.eventScope}
          data-event-type={args.eventType || undefined}
          data-actor-type={DATA_ACTOR_TYPE[args.actorType]}
        >
          {args.actorSize === 'large' ? (
            <Timeline.Avatar>
              <Avatar alt="" shape={isAppLike ? 'square' : 'circle'} size={40} src={avatarSrc} />
            </Timeline.Avatar>
          ) : null}
          <Timeline.Badge variant={args.badgeVariant === 'none' ? undefined : args.badgeVariant}>
            <Icon aria-hidden="true" />
          </Timeline.Badge>
          <Timeline.Body>
            {args.actorSize === 'small' ? (
              <Avatar
                alt=""
                className="relative -top-px mr-1 align-middle"
                shape={isAppLike ? 'square' : 'circle'}
                size={20}
                src={avatarSrc}
              />
            ) : null}
            <Link className="inline font-semibold text-default hover:text-default" href="#" muted>
              {resolvedActorName}
            </Link>{' '}
            {args.summaryText}{' '}
            <span data-a11y-link-underlines="true">
              <Link href="#" inline muted>
                {timestamp}
              </Link>
              {args.viaApp && appName ? (
                <>
                  {' — with '}
                  {appAvatar ? (
                    <Avatar
                      alt=""
                      className="relative -top-px mr-1 rounded-md align-middle"
                      shape="square"
                      size={16}
                      src={appAvatar}
                    />
                  ) : null}
                  <Link className="font-semibold text-default hover:text-default" href="#" inline muted>
                    {appName}
                  </Link>
                </>
              ) : null}
            </span>
            {args.showNote && args.noteText ? <div className="mt-1 text-muted">{args.noteText}</div> : null}
          </Timeline.Body>
          {args.showActions ? (
            <Timeline.Actions>
              {args.actionsPreset === 'Two buttons' ? (
                <>
                  <Button size="small">View details</Button>
                  <Button size="small">Revert</Button>
                </>
              ) : (
                <Button size="small">Compare</Button>
              )}
            </Timeline.Actions>
          ) : null}
        </Timeline.Item>
      </Timeline>
    </div>
  )
}

/**
 * A single configurable Timeline event built only from public primitives. `Timeline.Item` carries the
 * `data-event-scope`, `data-event-type`, and `data-actor-type` filtering attributes.
 */
export const EventPlayground: StoryObj<EventPlaygroundArgs> = {
  render: args => <EventPlaygroundStory {...args} />,
  parameters: {controls: {expanded: false}},
  decorators: [
    function SyncActorName(Story) {
      const [args, updateArgs] = useArgs<EventPlaygroundArgs>()
      const [actorType, setActorType] = React.useState(args.actorType)
      if (args.actorType !== actorType) {
        setActorType(args.actorType)
        updateArgs({actorName: DEFAULT_ACTOR_NAMES[args.actorType]})
      }
      return <Story />
    },
  ],
  args: {
    actorSize: 'small',
    actorType: 'user',
    actorAvatarSrc: 'https://avatars.githubusercontent.com/u/92997159?v=4',
    actorName: 'monalisa',
    badgeVariant: 'none',
    badgeIcon: 'git-commit',
    summaryText: 'performed an action',
    eventTimestamp: 'Relative (now)',
    viaApp: false,
    appPreset: 'GitHub Actions',
    customAppName: 'My GitHub App',
    customAppAvatar: 'https://avatars.githubusercontent.com/in/15368?v=4',
    showNote: false,
    noteText: 'Additional context or details',
    showActions: false,
    actionsPreset: 'Single button',
    eventScope: 'issue',
    eventType: '',
  },
  argTypes: {
    actorSize: {control: {type: 'inline-radio'}, options: ['small', 'large'], table: {category: 'Actor'}},
    actorType: {
      control: {type: 'select'},
      options: ['user', 'bot', 'app', 'copilot'],
      description:
        '`bot` and `copilot` use fixed names (`dependabot`, `Copilot`); `user` and `app` allow a custom name and avatar. Emitted `data-actor-type` is `user` for the user preset, otherwise `bot`.',
      table: {category: 'Actor'},
    },
    actorAvatarSrc: {control: {type: 'text'}, if: {arg: 'actorType', eq: 'user'}, table: {category: 'Actor'}},
    actorName: {control: {type: 'text'}, if: {arg: 'actorType', neq: 'copilot'}, table: {category: 'Actor'}},
    badgeIcon: {control: {type: 'select'}, options: Object.keys(BADGE_ICONS), table: {category: 'Badge'}},
    badgeVariant: {
      control: {type: 'select'},
      options: ['none', ...TimelineBadgeVariants],
      table: {category: 'Badge'},
    },
    summaryText: {control: {type: 'text'}, table: {category: 'Event'}},
    eventTimestamp: {control: {type: 'select'}, options: Object.keys(TIMESTAMP_PRESETS), table: {category: 'Event'}},
    showNote: {control: {type: 'boolean'}, table: {category: 'Optional content'}},
    noteText: {control: {type: 'text'}, if: {arg: 'showNote', truthy: true}, table: {category: 'Optional content'}},
    viaApp: {
      control: {type: 'boolean'},
      description: 'PR-specific in real usage. On Issues and other timelines, an app is the primary actor instead.',
      table: {category: 'Optional content'},
    },
    appPreset: {
      control: {type: 'select'},
      options: Object.keys(APP_PRESETS),
      if: {arg: 'viaApp', truthy: true},
      table: {category: 'Optional content'},
    },
    customAppName: {
      control: {type: 'text'},
      if: {arg: 'appPreset', eq: 'Custom App'},
      table: {category: 'Optional content'},
    },
    customAppAvatar: {
      control: {type: 'text'},
      if: {arg: 'appPreset', eq: 'Custom App'},
      table: {category: 'Optional content'},
    },
    showActions: {
      control: {type: 'boolean'},
      description: 'Renders a `Timeline.Actions` slot with right-aligned buttons.',
      table: {category: 'Optional content'},
    },
    actionsPreset: {
      control: {type: 'select'},
      options: [...ACTIONS_PRESETS],
      if: {arg: 'showActions', truthy: true},
      table: {category: 'Optional content'},
    },
    eventScope: {
      control: {type: 'select'},
      options: ['pull', 'issue', 'dependabot', 'code-scanning', 'secret-scanning', 'license-compliance'],
      description: 'Sets `data-event-scope` on the Timeline.Item to identify which timeline an event belongs to.',
      table: {category: 'DOM attributes'},
    },
    eventType: {
      control: {type: 'text'},
      description: 'Sets `data-event-type` on the Timeline.Item (for example `assigned`, `merged`, or `subscribed`).',
      table: {category: 'DOM attributes'},
    },
  },
}

type TimelinePlaygroundArgs = {
  surface: PlaygroundSurfaceId
  codeScanningCategories: PlaygroundCategoryId[]
  codeScanningTypes: string[]
  secretScanningCategories: PlaygroundCategoryId[]
  secretScanningTypes: string[]
  dependabotCategories: PlaygroundCategoryId[]
  dependabotTypes: string[]
  licenseComplianceCategories: PlaygroundCategoryId[]
  licenseComplianceTypes: string[]
  issueCategories: PlaygroundCategoryId[]
  issueTypes: string[]
}

// Storybook args share one flat namespace, so each surface needs distinctly named category and type args.
const PLAYGROUND_ARG_KEYS = {
  'code-scanning': {categories: 'codeScanningCategories', types: 'codeScanningTypes'},
  'secret-scanning': {categories: 'secretScanningCategories', types: 'secretScanningTypes'},
  dependabot: {categories: 'dependabotCategories', types: 'dependabotTypes'},
  'license-compliance': {categories: 'licenseComplianceCategories', types: 'licenseComplianceTypes'},
  issue: {categories: 'issueCategories', types: 'issueTypes'},
} as const satisfies Record<
  PlaygroundSurfaceId,
  {categories: keyof TimelinePlaygroundArgs; types: keyof TimelinePlaygroundArgs}
>

const allPlaygroundEvents = (surface: PlaygroundSurfaceId) => playgroundEvents(surface, playgroundCategoryIds(surface))

const playgroundCategoryControl = (surface: PlaygroundSurfaceId) => {
  const categoryIds = playgroundCategoryIds(surface)
  return {
    control: {
      type: 'check' as const,
      labels: Object.fromEntries(
        categoryIds.map(category => [category, PLAYGROUND_SURFACES[surface].categories[category]?.label]),
      ),
    },
    options: categoryIds,
    if: {arg: 'surface', eq: surface},
    table: {category: PLAYGROUND_SURFACES[surface].label},
  }
}

const playgroundTypeControl = (surface: PlaygroundSurfaceId) => {
  const events = allPlaygroundEvents(surface)
  return {
    control: {type: 'check' as const, labels: Object.fromEntries(events.map(event => [event.type, event.label]))},
    options: events.map(event => event.type),
    if: {arg: 'surface', eq: surface},
    table: {category: PLAYGROUND_SURFACES[surface].label},
  }
}

function TimelinePlaygroundStory(args: TimelinePlaygroundArgs) {
  const surface = args.surface in PLAYGROUND_SURFACES ? args.surface : 'code-scanning'
  const surfaceDefinition = PLAYGROUND_SURFACES[surface]
  const argKeys = PLAYGROUND_ARG_KEYS[surface]
  const selectedCategories = (args[argKeys.categories] as string[] | undefined) ?? []
  const selectedTypes = (args[argKeys.types] as string[] | undefined) ?? []
  const visibleRows = allPlaygroundEvents(surface).filter(
    event => selectedCategories.includes(event.category) && selectedTypes.includes(event.type),
  )

  return (
    <Examples>
      {visibleRows.length > 0 ? (
        <Timeline aria-label={surfaceDefinition.ariaLabel}>
          {visibleRows.map(event => {
            const BadgeIcon = event.badge.icon
            return (
              <Timeline.Item
                key={`${surface}-${event.type}`}
                data-event-scope={surface}
                data-event-type={event.type}
                data-event-category={event.category}
                data-event-visibility={event.visibility}
                data-actor-type={event.actorType}
              >
                <Timeline.Badge variant={event.badge.variant}>
                  <BadgeIcon aria-hidden="true" />
                </Timeline.Badge>
                <Timeline.Body>{event.body}</Timeline.Body>
                {event.actions ? <Timeline.Actions>{event.actions}</Timeline.Actions> : null}
              </Timeline.Item>
            )
          })}
        </Timeline>
      ) : (
        <Text className="max-w-[1012px] text-muted">
          No rows match. In the Controls panel, pick a surface then check its categories and event types.
        </Text>
      )}
    </Examples>
  )
}

const playgroundDefaults = Object.fromEntries(
  PLAYGROUND_SURFACE_IDS.flatMap(surface => [
    [PLAYGROUND_ARG_KEYS[surface].categories, playgroundCategoryIds(surface)],
    [PLAYGROUND_ARG_KEYS[surface].types, allPlaygroundEvents(surface).map(event => event.type)],
  ]),
) as Omit<TimelinePlaygroundArgs, 'surface'>

/**
 * Renders representative rows for one surface, filtered by the selected categories and event types.
 * Every surface's category and type controls are declared up front and gated on `surface`, because
 * Storybook cannot repopulate one control's options from another control's value. Each row carries the
 * `data-event-*` and `data-actor-type` filtering attributes.
 */
export const TimelinePlayground: StoryObj<TimelinePlaygroundArgs> = {
  render: args => <TimelinePlaygroundStory {...args} />,
  parameters: {controls: {expanded: false}},
  args: {surface: 'code-scanning', ...playgroundDefaults},
  argTypes: {
    surface: {
      control: {type: 'inline-radio'},
      options: PLAYGROUND_SURFACE_IDS,
      description:
        "Which surface's events to show. Switching it reveals that surface's category and event-type controls and hides the others.",
      table: {category: 'Surface'},
    },
    codeScanningCategories: playgroundCategoryControl('code-scanning'),
    codeScanningTypes: playgroundTypeControl('code-scanning'),
    secretScanningCategories: playgroundCategoryControl('secret-scanning'),
    secretScanningTypes: playgroundTypeControl('secret-scanning'),
    dependabotCategories: playgroundCategoryControl('dependabot'),
    dependabotTypes: playgroundTypeControl('dependabot'),
    licenseComplianceCategories: playgroundCategoryControl('license-compliance'),
    licenseComplianceTypes: playgroundTypeControl('license-compliance'),
    issueCategories: playgroundCategoryControl('issue'),
    issueTypes: playgroundTypeControl('issue'),
  },
}
