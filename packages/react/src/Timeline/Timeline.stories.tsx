import type {Meta, StoryFn} from '@storybook/react-vite'
import React from 'react'
import {useArgs} from 'storybook/preview-api'
import type {ComponentProps} from '../utils/types'
import Timeline, {type TimelineBadgeVariant} from './Timeline'
import {TimelineBadgeVariants} from './constants'
import Avatar from '../Avatar'
import {Button} from '../Button'
import Link from '../Link'
import Label from '../Label'
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
  // Additional badge icons used by the Timeline Playground story below.
  BlockedIcon,
  CheckIcon,
  CommentIcon,
  DotFillIcon,
  type Icon,
  LinkExternalIcon,
  MarkGithubIcon,
  NoteIcon,
  ShieldCheckIcon,
  ShieldSlashIcon,
  ShieldXIcon,
  SyncIcon,
  XIcon,
} from '@primer/octicons-react'
import {FeatureFlags} from '../FeatureFlags'
import Octicon from '../Octicon'
import Text from '../Text'
import {BoldLink, EventSubRow, Examples, MONALISA_AVATAR, MutedTime, UserActor} from './internal/timelineStoryHelpers'
import classes from './Timeline.stories.module.css'

export default {
  title: 'Components/Timeline',
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
    // `clipSidebar` only matters with multiple Timeline.Items. `className` is a passthrough
    // prop that isn't useful in the Playground. Hide both from the controls panel.
    clipSidebar: {table: {disable: true}},
    className: {table: {disable: true}},
  },
} as Meta<ComponentProps<typeof Timeline>>

export const Default = () => (
  <Timeline>
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
)

// Helpers for the Event Playground (declared above the story export).
// The story-level JSDoc lives on the `EventPlayground` export so Storybook attaches it
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
  eventScope: 'shared' | 'pr' | 'issue' | 'dependabot' | 'custom'
  eventType: string
  badgeIcon: BadgeIconName
  badgeVariant: TimelineBadgeVariant | 'none'
  eventTimestamp: TimestampPreset
  showActions: boolean
  actionsPreset: ActionsPreset
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

// Right-side action presets that populate `Timeline.Actions`. Each preset renders
// a different pattern that mirrors real GitHub timeline rows:
//   `Single button`  — one small button (e.g. "Compare" on force-push events)
//   `Two buttons`    — two small buttons (e.g. "View details" + "Revert" on merge events)
const ACTIONS_PRESETS = ['Single button', 'Two buttons'] as const

type ActionsPreset = (typeof ACTIONS_PRESETS)[number]

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
 * The **Event Playground**: recreates the Figma "Custom event" component (Primer-Web
 * library, node `46191-13560`) as a compositional Storybook playground for a SINGLE
 * configurable Timeline event. Every slot is built from existing public primitives
 * (`Timeline`, `Timeline.Item`, `Timeline.Badge`, `Timeline.Body`, `Timeline.Avatar`,
 * `Timeline.Actions`, `Avatar`, `Link`, `RelativeTime`) — no public API changes.
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
 * - `viaApp` is PR-specific in real GitHub usage. On Issues and Dependabot timelines,
 *   the app is the primary actor instead.
 * - Comments, review comments, and threaded comments are intentionally out of scope.
 */
// Heads up if you're copying from this file: this playground uses story-local CSS
// (`Timeline.stories.module.css`) to reserve a left-rail gutter so the large actor
// avatar (via `Timeline.Avatar`) has room to display. The gutter wrapper is only
// needed because the playground is a standalone demo — in product code the page
// layout typically provides the gutter already.
export const EventPlayground: StoryFn<PlaygroundArgs> = args => {
  const Icon = BADGE_ICONS[args.badgeIcon]
  const isAppLike = args.actorType === 'bot' || args.actorType === 'app'
  // Allow the `actorAvatarSrc` control to override the default user avatar; for
  // bot/app/copilot we always use the matching default since those represent the
  // GitHub App identity rather than an arbitrary user.
  const avatarSrc =
    args.actorType === 'user' && args.actorAvatarSrc ? args.actorAvatarSrc : ACTOR_AVATARS[args.actorType]
  // Bot and Copilot actor types use baked-in canonical names; user and app are editable.
  // Fall back to a placeholder when the user clears the field entirely so the actor link
  // always has accessible text (an empty <Link> would fail axe's link-name check).
  // The cast is needed because Storybook hides the `actorName` arg entirely when
  // `actorType` is `copilot` (via the conditional argType), but our type says it's a string.
  const customActorName = (args.actorName as string | undefined)?.trim() || 'Unknown actor'
  const resolvedActorName = BAKED_ACTOR_NAMES[args.actorType] ?? customActorName
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
    <div className={`${classes.RealisticTimeline} ${classes.LeftRailGutter}`}>
      <Timeline>
        <Timeline.Item
          data-event-scope={args.eventScope}
          data-event-type={args.eventType || undefined}
          data-actor-type={args.actorType}
        >
          {args.actorSize === 'large' && (
            <Timeline.Avatar>
              <Avatar size={40} square={isAppLike} src={avatarSrc} alt="" />
            </Timeline.Avatar>
          )}
          <Timeline.Badge variant={args.badgeVariant === 'none' ? undefined : args.badgeVariant}>
            {/* Decorative: the badge icon visually reinforces the summary text. Hiding it from
                AT avoids announcing developer-facing icon names like "git-commit" or "x-circle". */}
            <Icon aria-hidden="true" />
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
          {args.showActions &&
            (args.actionsPreset === 'Two buttons' ? (
              <Timeline.Actions>
                <Button size="small">View details</Button>
                <Button size="small">Revert</Button>
              </Timeline.Actions>
            ) : (
              <Timeline.Actions>
                <Button size="small">Compare</Button>
              </Timeline.Actions>
            ))}
        </Timeline.Item>
      </Timeline>
    </div>
  )
}

EventPlayground.parameters = {
  // Compact Controls panel (no inline Description / Default columns). The story-level
  // JSDoc on the EventPlayground export plus the auto-generated props table on the Docs tab
  // cover the longer-form context.
  controls: {expanded: false},
}

// Per-type default actor names. Used by the decorator below to keep the
// `actorName` field in sync with `actorType` changes (e.g. user picks `bot`
// → field flips to `dependabot`; back to `user` → field flips to `monalisa`).
const DEFAULT_ACTOR_NAMES: Record<PlaygroundArgs['actorType'], string> = {
  user: 'monalisa',
  bot: 'dependabot',
  app: 'GitHub Actions',
  copilot: 'Copilot',
}

// Sync the visible `actorName` field whenever `actorType` changes, so the field
// reflects a sensible default for the new type rather than carrying over a value
// from the previous type. Users can still edit the field from there.
EventPlayground.decorators = [
  (Story, context) => {
    const [args, updateArgs] = useArgs<PlaygroundArgs>()
    const previousActorType = React.useRef(args.actorType)
    React.useEffect(() => {
      if (args.actorType !== previousActorType.current) {
        previousActorType.current = args.actorType
        updateArgs({actorName: DEFAULT_ACTOR_NAMES[args.actorType]})
      }
    }, [args.actorType, updateArgs])
    return <Story {...context} />
  },
]

EventPlayground.args = {
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
  actionsPreset: 'Single button' as ActionsPreset,
  eventScope: 'custom',
  eventType: '',
}

EventPlayground.argTypes = {
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
    options: ['none', ...TimelineBadgeVariants],
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
  // Write-only DOM-level attributes that don't drive any visual state on their own.
  // Descriptions are useful here because the controls' purpose isn't visually obvious.
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

// ============================================================================
// Timeline Playground
// ============================================================================

/**
 * ILLUSTRATIVE, REPRESENTATIVE DATA — read this before treating anything below as canonical.
 *
 * The **Timeline Playground** demonstrates how filtering `data-*` attributes
 * (`data-event-scope`, `data-event-type`, `data-event-category`, `data-event-visibility`,
 * `data-actor-type`) are embedded on each `Timeline.Item` across GitHub surfaces. It mirrors
 * the Figma prototype: a `surface` control picks a surface, a categories control filters by the
 * categories that surface offers, and an event-types control selects which event types render.
 * Changing the surface reveals that surface's category and event-type controls and hides the
 * others.
 *
 * The `PLAYGROUND_SURFACES` map below is a small, hardcoded, story-local sample of
 * github-flavored events (a handful per surface, NOT the full ~160-row catalog). Its
 * surface/category/type shape and every copy string are ILLUSTRATIVE examples for this demo
 * only. The AUTHORITATIVE, per-surface timeline taxonomy lives in `github-ui` (the product
 * repositories that render these timelines), NOT in Primer. Do not treat this inline map as
 * the real catalog, do not export it, and do not promote it into a reusable module — it is
 * intentionally confined to this story file.
 *
 * The picker is structured so a future `Timeline.Filter` can drive it: the render pipeline
 * derives `visibleRows` from the selected categories and types, then maps each row to a
 * `<Timeline.Item>`.
 */

type PlaygroundSurfaceId = 'code-scanning' | 'secret-scanning' | 'dependabot' | 'license-compliance' | 'issues'
type PlaygroundCategoryId = 'findings' | 'status' | 'reviews' | 'references' | 'moderation' | 'metadata'
type PlaygroundActorType = 'user' | 'bot' | 'system'

type PlaygroundEvent = {
  /** `data-event-type` value */
  type: string
  /** `data-event-category` value */
  category: PlaygroundCategoryId
  /** Human-readable label shown in the event-type picker */
  label: string
  /**
   * `data-event-visibility` value. Matches the authoritative `EventVisibility` value space
   * (`@github-ui/timeline-taxonomy`): `primary` rows render in the main timeline; `auditOnly`
   * rows are metadata-only.
   */
  visibility: 'primary' | 'auditOnly'
  /** `data-actor-type` value; omit for actor-less rows so no `data-actor-type` attribute renders */
  actorType?: PlaygroundActorType
  badge: {icon: Icon; variant?: TimelineBadgeVariant}
  /** Contents of `Timeline.Body` */
  body: React.ReactNode
  /** Optional contents of the right-aligned `Timeline.Actions` slot */
  actions?: React.ReactNode
}

type PlaygroundSurface = {
  label: string
  /** Accessible name for the rendered `<Timeline>` */
  ariaLabel: string
  categories: Partial<Record<PlaygroundCategoryId, {label: string; events: PlaygroundEvent[]}>>
}

// Story-local demo avatars (MONALISA_AVATAR is imported from the shared helpers).
const DEPENDABOT_BOT_AVATAR = 'https://avatars.githubusercontent.com/u/27347476?v=4'
const LICENSE_BOT_AVATAR = 'https://avatars.githubusercontent.com/u/9919?s=40&v=4'
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/u/480938?v=4'

// ILLUSTRATIVE representative data (see the canon note above). Each event mirrors the
// badge/icon/copy/actor of the matching VariantSection in that surface's existing
// `Timeline.<surface>.features.stories.tsx`, reduced to a demonstrative subset. The four
// security surfaces offer findings/status/reviews; issues offers status/references/moderation.
const PLAYGROUND_SURFACES: Record<PlaygroundSurfaceId, PlaygroundSurface> = {
  'code-scanning': {
    label: 'Code scanning',
    ariaLabel: 'Code scanning alert timeline',
    categories: {
      findings: {
        label: 'Findings',
        events: [
          {
            type: 'detected',
            category: 'findings',
            label: 'First detected in commit',
            visibility: 'primary',
            badge: {icon: ShieldIcon},
            body: (
              <>
                <span className={classes.Strong}>First detected in commit</span>{' '}
                <MutedTime date={new Date('2024-01-08T11:46:07Z')} />
              </>
            ),
          },
          {
            type: 'fixed',
            category: 'findings',
            label: 'Fixed in branch',
            visibility: 'primary',
            badge: {icon: ShieldCheckIcon, variant: 'done'},
            body: (
              <>
                <span className={classes.Strong}>Fixed in branch</span> <span className={classes.Strong}>main</span>{' '}
                <MutedTime date={new Date('2024-01-12T10:15:00Z')} />
              </>
            ),
          },
        ],
      },
      status: {
        label: 'Status',
        events: [
          {
            type: 'closed',
            category: 'status',
            label: 'Closed as false positive',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: ShieldXIcon, variant: 'danger'},
            body: (
              <>
                <UserActor href="#" muted />
                {'closed this as '}
                <span className={classes.Strong}>false positive</span>{' '}
                <MutedTime date={new Date('2024-01-14T08:20:00Z')} />
              </>
            ),
          },
          {
            type: 'reopened',
            category: 'status',
            label: 'Reopened',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: DotFillIcon, variant: 'success'},
            body: (
              <>
                <UserActor href="#" muted />
                {'reopened this '}
                <MutedTime date={new Date('2024-01-15T11:05:00Z')} />
              </>
            ),
          },
        ],
      },
      reviews: {
        label: 'Reviews',
        events: [
          {
            type: 'dismissal_requested',
            category: 'reviews',
            label: 'Requested to dismiss',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: CommentIcon},
            body: (
              <>
                <UserActor href="#" muted />
                {'requested to dismiss this as false positive '}
                <MutedTime date={new Date('2024-01-16T09:00:00Z')} />
                <EventSubRow icon={NoteIcon}>This finding is a test-only helper, safe to dismiss.</EventSubRow>
              </>
            ),
            actions: (
              <Button size="small" variant="primary">
                Review request
              </Button>
            ),
          },
          {
            type: 'dismissal_reviewed',
            category: 'reviews',
            label: 'Approved dismissal',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: CheckIcon},
            body: (
              <>
                <UserActor href="#" muted />
                {'approved dismissal '}
                <MutedTime date={new Date('2024-01-17T13:30:00Z')} />
              </>
            ),
          },
        ],
      },
    },
  },
  'secret-scanning': {
    label: 'Secret scanning',
    ariaLabel: 'Secret scanning alert timeline',
    categories: {
      findings: {
        label: 'Findings',
        events: [
          {
            type: 'detected',
            category: 'findings',
            label: 'Created',
            visibility: 'primary',
            actorType: 'system',
            badge: {icon: ShieldIcon, variant: 'success'},
            body: (
              <>
                <UserActor login="GitHub" icon={MarkGithubIcon} />
                {'opened this alert '}
                <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
              </>
            ),
          },
          {
            type: 'validity_active',
            category: 'findings',
            label: 'Validity: active',
            visibility: 'primary',
            actorType: 'system',
            badge: {icon: AlertIcon, variant: 'danger'},
            body: (
              <>
                <UserActor login="GitHub" icon={MarkGithubIcon} />
                {'verified this secret is active '}
                <MutedTime date={new Date('2022-07-26T13:00:00Z')} />
              </>
            ),
          },
        ],
      },
      status: {
        label: 'Status',
        events: [
          {
            type: 'closed',
            category: 'status',
            label: 'Closed as revoked',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: ShieldCheckIcon, variant: 'done'},
            body: (
              <>
                <UserActor size={16} />
                {'closed this as '}
                <span className={classes.Strong}>revoked</span> <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
                <EventSubRow icon={CommentIcon} iconSize={12}>
                  Rotated the leaked token and confirmed the provider revoked it.
                </EventSubRow>
              </>
            ),
          },
          {
            type: 'reopened',
            category: 'status',
            label: 'Reopened',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: SyncIcon, variant: 'success'},
            body: (
              <>
                <UserActor size={16} />
                {'reopened this '}
                <MutedTime date={new Date('2022-07-27T09:10:00Z')} />
              </>
            ),
          },
        ],
      },
      reviews: {
        label: 'Reviews',
        events: [
          {
            type: 'closure_requested',
            category: 'reviews',
            label: 'Requested to dismiss',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: CommentIcon},
            body: (
              <>
                <UserActor size={16} />
                {'requested to dismiss this as false positive '}
                <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
              </>
            ),
            actions: (
              <Button size="small" variant="primary">
                Review request
              </Button>
            ),
          },
          {
            type: 'bypass_approved',
            category: 'reviews',
            label: 'Bypass approved',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: CheckCircleIcon},
            body: (
              <>
                <UserActor size={16} />
                {'approved a bypass '}
                <MutedTime date={new Date('2022-07-26T12:10:00Z')} />
              </>
            ),
          },
        ],
      },
    },
  },
  dependabot: {
    label: 'Dependabot',
    ariaLabel: 'Dependabot alert timeline',
    categories: {
      findings: {
        label: 'Findings',
        events: [
          {
            type: 'opened',
            category: 'findings',
            label: 'Opened',
            visibility: 'primary',
            actorType: 'bot',
            badge: {icon: ShieldIcon, variant: 'success'},
            body: (
              <>
                <UserActor login="dependabot[bot]" src={DEPENDABOT_BOT_AVATAR} />
                {'opened this '}
                <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
              </>
            ),
          },
          {
            type: 'fixed',
            category: 'findings',
            label: 'Fixed',
            visibility: 'primary',
            actorType: 'bot',
            badge: {icon: ShieldCheckIcon, variant: 'done'},
            body: (
              <>
                <UserActor login="dependabot[bot]" src={DEPENDABOT_BOT_AVATAR} />
                {'closed this as completed '}
                <MutedTime date={new Date('2022-08-01T09:30:00Z')} />
              </>
            ),
          },
        ],
      },
      status: {
        label: 'Status',
        events: [
          {
            type: 'reopened',
            category: 'status',
            label: 'Reopened',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: SyncIcon, variant: 'success'},
            body: (
              <>
                <UserActor href="#" muted />
                {'reopened this '}
                <MutedTime date={new Date('2022-08-04T10:15:00Z')} />
              </>
            ),
          },
          {
            type: 'dismissed',
            category: 'status',
            label: 'Dismissed',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: ShieldSlashIcon},
            body: (
              <>
                <UserActor href="#" muted />
                {'dismissed this as '}
                <span className={classes.Strong}>risk is tolerable</span>{' '}
                <MutedTime date={new Date('2022-08-02T14:00:00Z')} />
                <EventSubRow icon={NoteIcon}>Only reachable from a dev-only script we do not ship.</EventSubRow>
              </>
            ),
          },
        ],
      },
      reviews: {
        label: 'Reviews',
        events: [
          {
            type: 'dismissal_requested',
            category: 'reviews',
            label: 'Dismissal requested',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: CommentIcon},
            body: (
              <>
                <UserActor href="#" muted />
                {'requested to dismiss this '}
                <MutedTime date={new Date('2022-08-03T08:45:00Z')} />
              </>
            ),
            actions: (
              <Button size="small" variant="primary">
                Review request
              </Button>
            ),
          },
        ],
      },
    },
  },
  'license-compliance': {
    label: 'License compliance',
    ariaLabel: 'License compliance alert timeline',
    categories: {
      findings: {
        label: 'Findings',
        events: [
          {
            type: 'opened',
            category: 'findings',
            label: 'Opened',
            visibility: 'primary',
            actorType: 'bot',
            badge: {icon: ShieldIcon, variant: 'success'},
            body: (
              <>
                <UserActor login="github-license-compliance[bot]" src={LICENSE_BOT_AVATAR} />
                {' opened this alert '}
                <MutedTime date={new Date('2025-10-20T10:00:00Z')} />
              </>
            ),
          },
          {
            type: 'appeared_in_branch',
            category: 'findings',
            label: 'Appeared in branch',
            visibility: 'primary',
            badge: {icon: GitBranchIcon},
            body: (
              <>
                {'Appeared in branch '}
                <span className={classes.Strong}>feature-branch</span>{' '}
                <MutedTime date={new Date('2025-10-20T10:01:00Z')} />
              </>
            ),
          },
        ],
      },
      status: {
        label: 'Status',
        events: [
          {
            type: 'closed',
            category: 'status',
            label: 'Closed as amendment',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: ShieldCheckIcon, variant: 'done'},
            body: (
              <>
                <UserActor login="monalisa" src={MONALISA_AVATAR} href="#" />
                {' closed as amendment '}
                <MutedTime date={new Date('2025-10-25T10:00:00Z')} />
                <EventSubRow icon={NoteIcon}>Added a policy exception covering this package.</EventSubRow>
              </>
            ),
          },
        ],
      },
      reviews: {
        label: 'Reviews',
        events: [
          {
            type: 'review_requested',
            category: 'reviews',
            label: 'Requested to close',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: CommentIcon},
            body: (
              <>
                <UserActor login="monalisa" src={MONALISA_AVATAR} href="#" />
                {' requested to close '}
                <MutedTime date={new Date('2025-10-21T09:00:00Z')} />
              </>
            ),
            actions: (
              <Button size="small" variant="primary">
                Review request
              </Button>
            ),
          },
          {
            type: 'review_approved',
            category: 'reviews',
            label: 'Approved closure request',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: CheckIcon},
            body: (
              <>
                <UserActor login="hubot" src={HUBOT_AVATAR} href="#" />
                {' approved closure request '}
                <MutedTime date={new Date('2025-10-22T10:00:00Z')} />
              </>
            ),
          },
          {
            type: 'review_denied',
            category: 'reviews',
            label: 'Denied closure request',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: XIcon},
            body: (
              <>
                <UserActor login="hubot" src={HUBOT_AVATAR} href="#" />
                {' denied closure request '}
                <MutedTime date={new Date('2025-10-22T11:00:00Z')} />
              </>
            ),
          },
        ],
      },
    },
  },
  issues: {
    label: 'Issues',
    ariaLabel: 'Issue timeline',
    categories: {
      status: {
        label: 'Status',
        events: [
          {
            type: 'closed',
            category: 'status',
            label: 'Closed as completed',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: CheckCircleIcon, variant: 'done'},
            body: (
              <>
                <UserActor href="#" muted />
                {'closed this as '}
                <Link href="#" inline>
                  completed
                </Link>{' '}
                <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
              </>
            ),
          },
          {
            type: 'reopened',
            category: 'status',
            label: 'Reopened',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: IssueReopenedIcon, variant: 'open'},
            body: (
              <>
                <UserActor href="#" muted />
                {'reopened this '}
                <MutedTime date={new Date('2022-07-27T09:30:00Z')} href="#" />
              </>
            ),
          },
        ],
      },
      references: {
        label: 'References',
        events: [
          {
            type: 'connected',
            category: 'references',
            label: 'Linked pull request',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: CrossReferenceIcon},
            body: (
              <>
                <UserActor href="#" muted />
                {'linked a pull request that will close this issue '}
                <BoldLink href="#">Add retry logic to the uploader</BoldLink>
                {' #42 '}
                <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
              </>
            ),
          },
          {
            type: 'cross_referenced',
            category: 'references',
            label: 'Mentioned in an issue',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: LinkExternalIcon},
            body: (
              <>
                <UserActor href="#" muted />
                {'mentioned this '}
                <MutedTime date={new Date('2022-07-25T09:12:00Z')} href="#" />
                <EventSubRow icon={IssueOpenedIcon}>
                  <Link href="#" inline>
                    Track flaky upload retries
                  </Link>
                  {' #128'}
                </EventSubRow>
              </>
            ),
          },
        ],
      },
      moderation: {
        label: 'Moderation',
        events: [
          {
            type: 'user_blocked',
            category: 'moderation',
            label: 'User blocked',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: BlockedIcon},
            body: (
              <>
                <UserActor href="#" muted />
                {'blocked '}
                <BoldLink href="#">six7</BoldLink> <MutedTime date={new Date('2022-07-26T11:46:07Z')} href="#" />
              </>
            ),
          },
          {
            type: 'comment_pinned',
            category: 'moderation',
            label: 'Comment pinned',
            visibility: 'primary',
            actorType: 'user',
            badge: {icon: PinIcon},
            body: (
              <>
                <UserActor href="#" muted />
                {'pinned a '}
                <Link href="#" inline>
                  comment
                </Link>{' '}
                <MutedTime date={new Date('2022-07-24T16:40:00Z')} href="#" />
              </>
            ),
          },
        ],
      },
      metadata: {
        label: 'Metadata',
        events: [
          {
            type: 'labeled',
            category: 'metadata',
            label: 'Labeled (audit only)',
            visibility: 'auditOnly',
            actorType: 'user',
            badge: {icon: TagIcon},
            body: (
              <>
                <UserActor href="#" muted />
                {'added the '}
                <Label>bug</Label>
                {' label '}
                <MutedTime date={new Date('2022-07-23T08:15:00Z')} href="#" />
              </>
            ),
          },
        ],
      },
    },
  },
}

const PLAYGROUND_SURFACE_IDS = Object.keys(PLAYGROUND_SURFACES) as PlaygroundSurfaceId[]

const playgroundCategoryIds = (surface: PlaygroundSurfaceId): PlaygroundCategoryId[] =>
  Object.keys(PLAYGROUND_SURFACES[surface].categories) as PlaygroundCategoryId[]

const playgroundEvents = (surface: PlaygroundSurfaceId, categories: PlaygroundCategoryId[]): PlaygroundEvent[] =>
  categories.flatMap(category => PLAYGROUND_SURFACES[surface].categories[category]?.events ?? [])

/**
 * Args for the {@link TimelinePlayground} story. A single `surface` selector, plus a categories
 * multi-select and an event-types multi-select for each of the five surfaces. Only the selected
 * surface's two controls are shown (see the surface-gated `argTypes` below); the render reads the
 * active surface's two arrays and filters the representative rows by them.
 */
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

// Storybook args share a single flat namespace, so each surface needs distinctly named
// category/type args. This maps a surface to its two arg names for both the render and defaults.
const PLAYGROUND_ARG_KEYS: Record<
  PlaygroundSurfaceId,
  {categories: keyof TimelinePlaygroundArgs; types: keyof TimelinePlaygroundArgs}
> = {
  'code-scanning': {categories: 'codeScanningCategories', types: 'codeScanningTypes'},
  'secret-scanning': {categories: 'secretScanningCategories', types: 'secretScanningTypes'},
  dependabot: {categories: 'dependabotCategories', types: 'dependabotTypes'},
  'license-compliance': {categories: 'licenseComplianceCategories', types: 'licenseComplianceTypes'},
  issues: {categories: 'issueCategories', types: 'issueTypes'},
}

const playgroundTypeIds = (surface: PlaygroundSurfaceId): string[] =>
  playgroundEvents(surface, playgroundCategoryIds(surface)).map(event => event.type)

// Surface-gated `check` control for a surface's categories. Gated with `if: {arg: 'surface',
// eq: id}` so it only shows when that surface is selected.
const playgroundCategoryControl = (surface: PlaygroundSurfaceId) => {
  const categoryIds = playgroundCategoryIds(surface)
  return {
    control: {
      type: 'check' as const,
      labels: Object.fromEntries(
        categoryIds.map(category => [category, PLAYGROUND_SURFACES[surface].categories[category]!.label]),
      ),
    },
    options: categoryIds,
    if: {arg: 'surface', eq: surface},
    table: {category: PLAYGROUND_SURFACES[surface].label},
  }
}

// Surface-gated `check` control for a surface's representative event types.
const playgroundTypeControl = (surface: PlaygroundSurfaceId) => {
  const events = playgroundEvents(surface, playgroundCategoryIds(surface))
  return {
    control: {
      type: 'check' as const,
      labels: Object.fromEntries(events.map(event => [event.type, event.label])),
    },
    options: events.map(event => event.type),
    if: {arg: 'surface', eq: surface},
    table: {category: PLAYGROUND_SURFACES[surface].label},
  }
}

/**
 * The **Timeline Playground** (see the canon note above for the illustrative-data caveat).
 *
 * The picker is built from real Storybook controls, not in-canvas form elements. Storybook cannot
 * repopulate one control's options from another control's value, so instead of a single dependent
 * surface -> category -> type chain, every surface's category and event-type controls are declared
 * up front and each is gated with `if: {arg: 'surface', eq: '<surface>'}`. Only the selected
 * surface's two controls are shown; the other four surfaces' pairs are hidden, faking the dynamic
 * swap. The render then reads the active surface's selected categories and types and filters the
 * representative rows, mapping each to a `<Timeline.Item>` carrying the `data-*` event contract,
 * the same shape a future `Timeline.Filter` would consume.
 */
export const TimelinePlayground: StoryFn<TimelinePlaygroundArgs> = args => {
  // Defensive fallback in case Storybook restores a stale/empty `surface` from the URL.
  const surface = args.surface in PLAYGROUND_SURFACES ? args.surface : 'code-scanning'
  const surfaceDef = PLAYGROUND_SURFACES[surface]
  const argKeys = PLAYGROUND_ARG_KEYS[surface]
  const selectedCategories = (args[argKeys.categories] as PlaygroundCategoryId[] | undefined) ?? []
  const selectedTypes = (args[argKeys.types] as string[] | undefined) ?? []

  // Category -> type filtering lives here because `if:` gates a control on one arg's scalar
  // value, not on array membership. Keep rows whose category and type are both selected for the
  // active surface, then map to Timeline.Item rows (the future Timeline.Filter shape).
  const visibleRows = playgroundEvents(surface, playgroundCategoryIds(surface)).filter(
    event => selectedCategories.includes(event.category) && selectedTypes.includes(event.type),
  )

  return (
    <FeatureFlags flags={{primer_react_timeline_list_semantics: true}}>
      <Examples>
        {visibleRows.length > 0 ? (
          <Timeline aria-label={surfaceDef.ariaLabel}>
            {visibleRows.map(event => (
              <Timeline.Item
                key={`${surface}-${event.type}`}
                data-event-scope={surface}
                data-event-type={event.type}
                data-event-category={event.category}
                data-event-visibility={event.visibility}
                data-actor-type={event.actorType}
              >
                <Timeline.Badge variant={event.badge.variant}>
                  {/* Decorative: the summary text in Timeline.Body is the accessible description. */}
                  <Octicon icon={event.badge.icon} />
                </Timeline.Badge>
                <Timeline.Body>{event.body}</Timeline.Body>
                {event.actions ? <Timeline.Actions>{event.actions}</Timeline.Actions> : null}
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Text className={classes.PlaygroundEmpty}>
            No rows match. In the Controls panel, pick a surface then check its categories and event types.
          </Text>
        )}
      </Examples>
    </FeatureFlags>
  )
}

TimelinePlayground.parameters = {
  controls: {expanded: false},
}

// Default to the first surface with all of its categories and event types checked, so the story
// renders a populated timeline on load. Generated from the surface ids so the per-surface
// defaults can't drift from PLAYGROUND_SURFACES.
const buildPlaygroundDefaults = (): TimelinePlaygroundArgs => {
  const perSurface: Record<string, PlaygroundCategoryId[] | string[]> = {}
  for (const id of PLAYGROUND_SURFACE_IDS) {
    const argKeys = PLAYGROUND_ARG_KEYS[id]
    perSurface[argKeys.categories] = playgroundCategoryIds(id)
    perSurface[argKeys.types] = playgroundTypeIds(id)
  }
  return {surface: 'code-scanning', ...perSurface} as TimelinePlaygroundArgs
}

TimelinePlayground.args = buildPlaygroundDefaults()

TimelinePlayground.argTypes = {
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
  issueCategories: playgroundCategoryControl('issues'),
  issueTypes: playgroundTypeControl('issues'),
}
