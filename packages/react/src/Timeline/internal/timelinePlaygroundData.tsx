/**
 * Internal, story-only Timeline "playground" sample data. Not part of the public
 * API (stories don't ship) and intentionally NOT exported from the package index.
 *
 * `PLAYGROUND_SURFACES` is an ILLUSTRATIVE, github-flavored map of representative
 * event surfaces/categories used only to drive the Timeline Playground and the
 * Timeline "Viewing" filter stories. It is NOT an authoritative taxonomy.
 *
 * The canonical Timeline event taxonomy lives in github-ui as
 * `@github-ui/timeline-taxonomy`. primer/react is taxonomy-agnostic: do not treat
 * this sample as a source of truth, do not promote it into an exported reusable
 * taxonomy module, and do not add it to `packages/react/src/index.ts`. It stays
 * confined to internal story scaffolding (alongside `timelineStoryHelpers.tsx`) so
 * the surfaces stay consistent across stories without leaking into the public
 * package. Keep it in sync with github-ui only as needed for the demos.
 */
import type React from 'react'
import {
  AlertIcon,
  BlockedIcon,
  CheckCircleIcon,
  CheckIcon,
  CommentIcon,
  CrossReferenceIcon,
  DotFillIcon,
  GitBranchIcon,
  type Icon,
  IssueOpenedIcon,
  IssueReopenedIcon,
  LinkExternalIcon,
  MarkGithubIcon,
  NoteIcon,
  PinIcon,
  ShieldCheckIcon,
  ShieldIcon,
  ShieldSlashIcon,
  ShieldXIcon,
  SyncIcon,
  TagIcon,
  XIcon,
} from '@primer/octicons-react'
import {Button} from '../../Button'
import Label from '../../Label'
import Link from '../../Link'
import {type TimelineBadgeVariant} from '../Timeline'
import {BoldLink, EventSubRow, MONALISA_AVATAR, MutedTime, Strong, UserActor} from './timelineStoryHelpers'

export type PlaygroundSurfaceId = 'code-scanning' | 'secret-scanning' | 'dependabot' | 'license-compliance' | 'issue'
export type PlaygroundCategoryId = 'findings' | 'status' | 'reviews' | 'references' | 'moderation' | 'metadata'
// Actor classification, mirrors the authoritative `ActorType` value space (`user | bot`):
// first-party automation such as the GitHub secret-scanning system actor is `bot`.
type PlaygroundActorType = 'user' | 'bot'

export type PlaygroundEvent = {
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

export type PlaygroundSurface = {
  label: string
  /** Accessible name for the rendered `<Timeline>` */
  ariaLabel: string
  categories: Partial<Record<PlaygroundCategoryId, {label: string; description?: string; events: PlaygroundEvent[]}>>
}

// Story-local demo avatars (MONALISA_AVATAR is imported from the shared helpers).
const DEPENDABOT_BOT_AVATAR = 'https://avatars.githubusercontent.com/u/27347476?v=4'
const LICENSE_BOT_AVATAR = 'https://avatars.githubusercontent.com/u/9919?s=40&v=4'
const HUBOT_AVATAR = 'https://avatars.githubusercontent.com/u/480938?v=4'

// ILLUSTRATIVE representative data (see the module header above). Each event mirrors the
// badge/icon/copy/actor of the matching VariantSection in that surface's existing
// `Timeline.<surface>.features.stories.tsx`, reduced to a demonstrative subset. The four
// security surfaces offer findings/status/reviews; issues offers status/references/moderation/metadata.
export const PLAYGROUND_SURFACES: Record<PlaygroundSurfaceId, PlaygroundSurface> = {
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
                <Strong>First detected in commit</Strong> <MutedTime date={new Date('2024-01-08T11:46:07Z')} />
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
                <Strong>Fixed in branch</Strong> <Strong>main</Strong>{' '}
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
                <Strong>false positive</Strong> <MutedTime date={new Date('2024-01-14T08:20:00Z')} />
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
            actorType: 'bot',
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
            actorType: 'bot',
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
                <Strong>revoked</Strong> <MutedTime date={new Date('2022-07-26T11:46:07Z')} />
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
                <Strong>risk is tolerable</Strong> <MutedTime date={new Date('2022-08-02T14:00:00Z')} />
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
                <Strong>feature-branch</Strong> <MutedTime date={new Date('2025-10-20T10:01:00Z')} />
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
  issue: {
    label: 'Issues',
    ariaLabel: 'Issue timeline',
    // Per-category `description` strings below are REPRESENTATIVE one-liners, surfaced by
    // the Viewing menu via `ActionList.Description`. They are NOT authoritative: the
    // canonical per-category descriptions (and cross-surface consistency) belong to
    // `@github-ui/timeline-taxonomy` (event-categories.ts). Primer renders the slot but
    // does not own the category semantics.
    categories: {
      status: {
        label: 'Status',
        description: 'Opened, closed, and reopened lifecycle events.',
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
        description: 'Cross-links to pull requests, commits, and other issues.',
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
        description: 'Blocks, hides, and other moderation actions.',
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
        description: 'Labels, milestones, and other bookkeeping changes.',
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

export const PLAYGROUND_SURFACE_IDS = Object.keys(PLAYGROUND_SURFACES) as PlaygroundSurfaceId[]

export const playgroundCategoryIds = (surface: PlaygroundSurfaceId): PlaygroundCategoryId[] =>
  Object.keys(PLAYGROUND_SURFACES[surface].categories) as PlaygroundCategoryId[]

export const playgroundEvents = (surface: PlaygroundSurfaceId, categories: PlaygroundCategoryId[]): PlaygroundEvent[] =>
  categories.flatMap(category => PLAYGROUND_SURFACES[surface].categories[category]?.events ?? [])
