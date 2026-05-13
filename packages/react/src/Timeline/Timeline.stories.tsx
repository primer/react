import type {Meta, StoryFn} from '@storybook/react-vite'
import React from 'react'
import {useArgs} from 'storybook/preview-api'
import type {ComponentProps} from '../utils/types'
import Timeline, {type TimelineBadgeVariant} from './Timeline'
import Octicon from '../Octicon'
import Avatar from '../Avatar'
import Link from '../Link'
import RelativeTime from '../RelativeTime'
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
import classes from './Timeline.stories.module.css'

export default {
  title: 'Components/Timeline',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Badge': Timeline.Badge,
    'Timeline.Body': Timeline.Body,
    'Timeline.Break': Timeline.Break,
  },
  argTypes: {
    // `clipSidebar` only matters with multiple Timeline.Items. Hide it from the controls
    // panel on this file's stories (Default and Playground) since both are single-item.
    // The Features story file demonstrates clipSidebar variants instead.
    clipSidebar: {table: {disable: true}},
  },
} as Meta<ComponentProps<typeof Timeline>>

export const Default = () => (
  <Timeline>
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
    <Timeline.Item>
      <Timeline.Badge>
        <Octicon icon={GitCommitIcon} aria-label="Commit" />
      </Timeline.Badge>
      <Timeline.Body>This is a message</Timeline.Body>
    </Timeline.Item>
  </Timeline>
)

// Helpers for the Custom Event playground (declared above the story export).
// The story-level JSDoc lives on the `Playground` export so Storybook attaches it
// to the Docs tab.
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

const BADGE_VARIANTS: TimelineBadgeVariant[] = [
  'accent',
  'success',
  'attention',
  'severe',
  'danger',
  'done',
  'open',
  'closed',
  'sponsors',
]

type PlaygroundArgs = {
  actorSize: 'small' | 'large'
  actorName: string
  actorType: 'user' | 'bot' | 'app' | 'copilot'
  actorAvatarSrc: string
  summaryText: string
  showNote: boolean
  noteText: string
  viaApp: boolean
  appPreset: AppPreset
  customAppName: string
  customAppAvatar: string
  className: string
  eventScope: 'shared' | 'pr' | 'issue' | 'dependabot' | 'custom'
  eventType: string
  badgeIcon: BadgeIconName
  badgeVariant: TimelineBadgeVariant | 'none'
  eventTimestamp: TimestampPreset
}

// Default actor names baked in for bot / copilot since those represent fixed
// GitHub identities (Dependabot, Copilot). Apps and users remain editable.
const BAKED_ACTOR_NAMES: Partial<Record<PlaygroundArgs['actorType'], string>> = {
  bot: 'dependabot',
  copilot: 'Copilot',
}

const ACTOR_AVATARS: Record<PlaygroundArgs['actorType'], string> = {
  user: 'https://avatars.githubusercontent.com/u/92997159?v=4',
  bot: 'https://avatars.githubusercontent.com/in/29110?v=4',
  app: 'https://avatars.githubusercontent.com/in/15368?v=4',
  copilot: 'https://avatars.githubusercontent.com/in/1143301?v=4',
}

// Apps that can be appended via the PR `viaApp` slot. Avatar and name are paired
// so toggling the preset swaps both at once (mirrors how real "... \u2014 with
// [appAvatar] [appName]" rows render on PR timelines).
//
// `viaApp` is generic GitHub App attribution — any integration with a `via_app`
// value can render here. We omit Dependabot and Copilot because they almost always
// appear as the primary actor (e.g. `dependabot[bot]` opens a PR), not as the
// trailing app attribution. GitHub Actions is the most common visible case because
// many deployment / check-related events run through it. The `Custom App` preset
// exposes free-text name + avatar URL controls for any other integration.
const APP_PRESETS = {
  'GitHub Actions': {
    name: 'GitHub Actions',
    avatar: 'https://avatars.githubusercontent.com/in/15368?v=4',
  },
  'Custom App': {
    name: '',
    avatar: '',
  },
} as const

type AppPreset = keyof typeof APP_PRESETS

// Timestamp presets mirror the 5 options shown in the Figma "Custom event" component.
// Each entry is an offset in milliseconds before "now" plus a render mode.
// Render modes:
//   `literal`     → the string in `text` (used for "just now" since the relative-time
//                   element renders sub-minute offsets as bare "now")
//   `relative`    → <RelativeTime format="relative"> (live-updating phrase)
//   `today`       → "Today h:mm AM/PM TZ" (custom hybrid — RelativeTime can't model this)
//   `full`        → "Mon DD, h:mm AM/PM TZ" (Intl.DateTimeFormat)
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

// Time-only formatter for the "Today h:mm AM/PM TZ" preset.
const TIME_ONLY_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
})

// Full-timestamp formatter for "Mon DD, h:mm AM/PM TZ".
const FULL_TIMESTAMP_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
})

type TimestampPreset =
  | 'Relative (now)'
  | 'Relative (recent day)'
  | 'Relative (3 weeks)'
  | 'Absolute (today)'
  | 'Absolute (full timestamp)'

/**
 * Recreates the Figma "Custom event" component (Primer-Web library, node `46191-13560`)
 * as a compositional Storybook playground. Every slot is built from existing public primitives
 * (`Timeline`, `Timeline.Item`, `Timeline.Badge`, `Timeline.Body`, `Avatar`, `Link`, `RelativeTime`)
 * — no public API changes.
 *
 * **`data-*` filtering convention** (applied to `Timeline.Item`):
 *
 * - `data-event-scope` — `'shared' | 'pr' | 'issue' | 'dependabot' | 'custom'`
 * - `data-event-type` — short identifier (e.g. `assigned`, `merged`, `subscribed`)
 * - `data-actor-type` — `'user' | 'bot' | 'app' | 'copilot'`
 *
 * These have no visual effect today; they're reserved for Phase 4 filtering work
 * (e.g. "hide all `subscribed` rows", or the planned summary-events rollup).
 *
 * **Known Phase 1 limitations** (tracked for Phase 2 named events):
 *
 * - No right-controls slot on `Timeline.Item`. Floated buttons / SHAs / status pills
 *   are common on PR + Issue + Shared events; needs a real slot rather than a hack.
 * - No avatar slot in Primer React's Timeline. The `large` actor size is faked via
 *   story-local CSS that mirrors the Rails ViewComponents `.TimelineItem-avatar`
 *   treatment (`position: absolute; left: -72px`).
 * - `viaApp` is PR-specific in real GitHub usage. On Issues and Dependabot timelines,
 *   the app is the primary actor instead.
 * - Comments, review comments, and threaded comments are intentionally out of scope.
 */
export const Playground: StoryFn<PlaygroundArgs> = args => {
  const Icon = BADGE_ICONS[args.badgeIcon]
  const isAppLike = args.actorType === 'bot' || args.actorType === 'app'
  // Allow the `actorAvatarSrc` control to override the default user avatar; for
  // bot/app/copilot we always use the matching default since those represent the
  // GitHub App identity rather than an arbitrary user.
  const avatarSrc =
    args.actorType === 'user' && args.actorAvatarSrc ? args.actorAvatarSrc : ACTOR_AVATARS[args.actorType]
  // Bot and Copilot actor types use baked-in canonical names; user and app are editable.
  const resolvedActorName = BAKED_ACTOR_NAMES[args.actorType] ?? args.actorName
  const avatarLabel = `@${resolvedActorName}`
  // Anchor "now" to first render so timestamps don't drift as the user toggles controls.
  const [now] = React.useState(() => Date.now())
  // Defensive fallback in case Storybook resets `eventTimestamp` to no value ("Choose option")
  // or restores a stale value from the URL that no longer exists in `TIMESTAMP_PRESETS`.
  // The `in` check is needed because the typed lookup would otherwise narrow to never-undefined.
  const timestampPreset =
    args.eventTimestamp in TIMESTAMP_PRESETS
      ? TIMESTAMP_PRESETS[args.eventTimestamp]
      : TIMESTAMP_PRESETS['Relative (now)']
  const timestampDate = new Date(now - timestampPreset.offsetMs)
  const isCustomApp = args.appPreset === 'Custom App'
  // Defensive fallback in case Storybook restores a stale `appPreset` from the URL
  // that no longer exists in `APP_PRESETS` (e.g. after removing a preset like 'Renovate').
  // The `in` check is needed because the typed lookup would otherwise narrow to never-undefined.
  const resolvedAppPreset = args.appPreset in APP_PRESETS ? APP_PRESETS[args.appPreset] : APP_PRESETS['GitHub Actions']
  const appName = isCustomApp ? args.customAppName : resolvedAppPreset.name
  const appAvatar = isCustomApp ? args.customAppAvatar : resolvedAppPreset.avatar

  let timestampNode: React.ReactNode
  if (timestampPreset.mode === 'literal') {
    timestampNode = timestampPreset.text
  } else if (timestampPreset.mode === 'relative') {
    timestampNode = <RelativeTime date={timestampDate} format="relative" />
  } else if (timestampPreset.mode === 'today') {
    timestampNode = `Today ${TIME_ONLY_FORMATTER.format(timestampDate)}`
  } else {
    timestampNode = FULL_TIMESTAMP_FORMATTER.format(timestampDate)
  }

  return (
    <div className={classes.LeftRailGutter}>
      <Timeline>
        <Timeline.Item
          className={args.className || undefined}
          data-event-scope={args.eventScope}
          data-event-type={args.eventType || undefined}
          data-actor-type={args.actorType}
        >
          {args.actorSize === 'large' && (
            <Avatar
              className={classes.LargeActorAvatar}
              size={40}
              square={isAppLike}
              src={avatarSrc}
              alt={avatarLabel}
            />
          )}
          <Timeline.Badge variant={args.badgeVariant === 'none' ? undefined : args.badgeVariant}>
            <Icon aria-label={args.badgeIcon} />
          </Timeline.Badge>
          <Timeline.Body>
            {args.actorSize === 'small' && (
              <Avatar className={classes.SmallActorAvatar} size={20} square={isAppLike} src={avatarSrc} alt="" />
            )}
            <Link href="#" muted className={classes.ActorName}>
              {resolvedActorName}
            </Link>{' '}
            {args.summaryText}{' '}
            {/* Force the always-underlined link treatment that mirrors the GitHub a11y
                setting `data-a11y-link-underlines='true'`. Wrapping with `inline muted`
                gives us muted color + persistent underline for the timestamp + app name. */}
            <span data-a11y-link-underlines="true">
              <Link href="#" inline muted>
                {timestampNode}
              </Link>
              {args.viaApp && appName ? (
                <>
                  {' \u2014 with '}
                  {appAvatar ? <Avatar className={classes.AppAvatar} size={16} square src={appAvatar} alt="" /> : null}
                  <Link href="#" inline muted className={classes.AppName}>
                    {appName}
                  </Link>
                </>
              ) : null}
            </span>
            {args.showNote && args.noteText ? <div className={classes.Note}>{args.noteText}</div> : null}
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>
    </div>
  )
}

Playground.parameters = {
  // Compact Controls panel (no inline Description / Default columns). The story-level
  // JSDoc on the Playground export plus the auto-generated props table on the Docs tab
  // cover the longer-form context.
  controls: {expanded: false},
}

// When `actorType` switches to `bot`, sync the visible `actorName` field to the canonical
// `dependabot` value. The field stays editable so users can pick a different bot identity
// (e.g. `renovate[bot]`) from there. Without this sync, switching to `bot` would still
// render `dependabot` (via BAKED_ACTOR_NAMES) but the controls panel would show whatever
// the user had typed previously — confusing.
Playground.decorators = [
  (Story, context) => {
    const [args, updateArgs] = useArgs<PlaygroundArgs>()
    React.useEffect(() => {
      if (args.actorType === 'bot' && args.actorName !== 'dependabot') {
        updateArgs({actorName: 'dependabot'})
      }
    }, [args.actorType, args.actorName, updateArgs])
    return <Story {...context} />
  },
]

Playground.args = {
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
  className: '',
  eventScope: 'custom',
  eventType: '',
}

Playground.argTypes = {
  actorSize: {
    control: {type: 'inline-radio'},
    options: ['small', 'large'],
    table: {category: 'Actor'},
  },
  actorType: {
    control: {type: 'select'},
    options: ['user', 'bot', 'app', 'copilot'],
    description:
      '`bot` and `copilot` use baked-in canonical names (`dependabot`, `Copilot`); `user` and `app` allow a custom name and avatar.',
    table: {category: 'Actor'},
  },
  actorAvatarSrc: {
    control: {type: 'text'},
    if: {arg: 'actorType', eq: 'user'},
    table: {category: 'Actor'},
  },
  actorName: {
    control: {type: 'text'},
    // Hide entirely for `copilot` (the name is fixed and not editable). For `bot` the
    // field stays visible but its value is auto-synced to `dependabot` by the decorator
    // below — users can edit from there if they want a different bot identity.
    if: {arg: 'actorType', neq: 'copilot'},
    table: {category: 'Actor'},
  },
  badgeIcon: {
    control: {type: 'select'},
    options: Object.keys(BADGE_ICONS) as BadgeIconName[],
    table: {category: 'Badge'},
  },
  badgeVariant: {
    control: {type: 'select'},
    options: ['none', ...BADGE_VARIANTS],
    table: {category: 'Badge'},
  },
  summaryText: {control: {type: 'text'}, table: {category: 'Event'}},
  eventTimestamp: {
    control: {type: 'select'},
    options: Object.keys(TIMESTAMP_PRESETS) as TimestampPreset[],
    table: {category: 'Event'},
  },
  showNote: {control: {type: 'boolean'}, table: {category: 'Optional content'}},
  noteText: {
    control: {type: 'text'},
    if: {arg: 'showNote', truthy: true},
    table: {category: 'Optional content'},
  },
  viaApp: {
    control: {type: 'boolean'},
    description: 'PR-specific in real usage. On Issues and other timelines, an app is the primary actor instead.',
    table: {category: 'Optional content'},
  },
  appPreset: {
    control: {type: 'select'},
    options: Object.keys(APP_PRESETS) as AppPreset[],
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
  // Write-only DOM-level attributes that don't drive any visual state on their own.
  // Descriptions are useful here because the controls' purpose isn't visually obvious.
  className: {
    control: {type: 'text'},
    description: 'Custom CSS class on the Timeline.Item element. Useful for scoped styling overrides.',
    table: {category: 'DOM attributes'},
  },
  eventScope: {
    control: {type: 'select'},
    options: ['shared', 'pr', 'issue', 'dependabot', 'custom'],
    description:
      'Sets `data-event-scope` on the Timeline.Item. Identifies which timeline an event belongs to. Reserved for Phase 4 filtering work.',
    table: {category: 'DOM attributes'},
  },
  eventType: {
    control: {type: 'text'},
    description:
      'Sets `data-event-type` on the Timeline.Item (e.g. `assigned`, `merged`, `subscribed`). Reserved for Phase 4 filtering and summary-event rollups.',
    table: {category: 'DOM attributes'},
  },
}
