import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import {clsx} from 'clsx'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {KebabHorizontalIcon, SmileyIcon} from '@primer/octicons-react'
import Avatar from '../Avatar'
import {IconButton} from '../Button'
import Label from '../Label'
import Link from '../Link'
import RelativeTime from '../RelativeTime'
import classes from './Timeline.comments.features.stories.module.css'

/**
 * Issue Timeline COMMENT examples (Phase 2 of github/primer#6663).
 *
 * These stories recreate GitHub's issue-timeline comment card using Primer React
 * primitives, sourced from the live React implementation in `github/github-ui`
 * (`packages/commenting/components/issue-comment/IssueComment.tsx`,
 * `IssueCommentViewer.tsx`, `ActivityHeader.tsx`, `CommentAuthorAssociation.tsx`,
 * `CommentSubjectAuthor.tsx`).
 *
 * TITLE / IA: These live under `Components/Timeline/Events/Issues` — the same node
 * as the badge-row Issue stories — even though a comment is a bordered CARD rather
 * than a one-line badge row. We keep the per-SURFACE nesting decision: shared
 * events' Issue-sourced versions live in the Issue folder; the PR-sourced comment
 * version (ERB implementation) will land later under a PR folder. The filename
 * (`Timeline.comments.features.stories.tsx`) does not drive Storybook IA — the
 * `title` does — so comment stories nest beside the badge rows from a separate file.
 *
 * SCOPE: Storybook-only by design, like the Issue badge-row stories. They are
 * intentionally NOT wired into components-json / the primer.style docs page (do NOT
 * add this file to `Timeline.docs.json` or `build.ts`). Individual timeline events
 * are not consumer-facing components.
 *
 * FAITHFULNESS: There is no Primer "Comment" primitive, so the card is composed
 * directly via the local `CommentCard` helper below (header bar + body + reactions +
 * speech-bubble caret). The Timeline rail + gutter avatar come from `Timeline.Item` +
 * `Timeline.Avatar`. The goal is a clean, recognizable GitHub comment card, not
 * pixel-perfection.
 *
 * VERIFIED LIVE DENOTATIONS (`ActivityHeader` + labels):
 * - Author-of-issue badge: text "Author" (`LABELS.commentAuthor`), `Label` variant
 *   `secondary`, shown when the commenter opened the issue (`CommentSubjectAuthor`).
 * - Author-association badge (Member/Owner/Collaborator/Contributor): variant
 *   `secondary` (`CommentAuthorAssociation`).
 * - Bot/AI badge: `LABELS.authorLabel(isBot, isCopilot)` → "bot" for bots, "AI" for
 *   Copilot, "mannequin" for mannequins; `Label` variant `secondary`, next to the name.
 * - Copilot: name renders as "Copilot" and the avatar is SQUARE (`square={isCopilot}`).
 * - via-app: the timestamp line gets a " – with {app}" suffix, the app name an
 *   `inline` (underlined) `Link` — see the CommentViaApp story.
 *
 * AUDIT-vs-LIVE DRIFT (flagged for review): the live React comment header squares
 * the avatar for COPILOT ONLY (`square={isCopilot}`); generic bots and Dependabot
 * would render with a CIRCLE avatar in that exact component. We render bot and
 * Dependabot comment avatars as SQUARE here to match (a) GitHub product appearance,
 * (b) the already-shipped Dependabot badge-row surface (ERB
 * `ActorComponent`, square avatar + "bot" tag), and (c) this task's brief. If strict
 * React-comment-path fidelity is preferred, switch those `avatarShape` props to
 * 'circle'.
 */

const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'
// dependabot[bot] (u/27347476) — same public avatar used on the Dependabot badge-row
// surface, kept for cross-surface consistency.
const DEPENDABOT_AVATAR = 'https://avatars.githubusercontent.com/u/27347476?v=4'
// github-actions[bot] (u/44036562) — a representative generic GitHub App bot.
const GITHUB_ACTIONS_AVATAR = 'https://avatars.githubusercontent.com/u/44036562?v=4'
// Copilot (u/198982749) — renders SQUARE, matching the live `square={isCopilot}`.
const COPILOT_AVATAR = 'https://avatars.githubusercontent.com/u/198982749?v=4'

type CommentCardProps = {
  /** Display name of the comment author (rendered as a bold link). */
  authorName: string
  authorHref?: string
  avatarSrc: string
  /** Circle for users; square for Copilot (live) and — per the drift note above — bots. */
  avatarShape?: 'circle' | 'square'
  /** "Author"/"Member"/"Owner"/… subject-author or association badge (variant secondary). */
  associationLabel?: string
  associationAriaLabel?: string
  /** "bot"/"AI"/"mannequin" actor badge shown next to the name (variant secondary). */
  badgeLabel?: string
  badgeAriaLabel?: string
  /** ISO timestamp for the relative-time permalink. */
  timestamp: string
  /** Renders the live " – with {app}" suffix in the timestamp line. */
  viaApp?: {name: string; href?: string}
  /** Show the reactions footer. */
  reactions?: boolean
  /**
   * Threaded reply: drops the card border + speech-bubble caret + gutter avatar.
   * Wired now for the deferred threaded-reply stories; no reply story ships yet.
   */
  isReply?: boolean
  children: React.ReactNode
}

/**
 * Self-contained comment-card composition (NOT exported — local to this file, like
 * the badge-row stories' `Actor`/`Time` helpers). Renders the full `Timeline.Item`:
 * the gutter `Timeline.Avatar` (40px, circle or square) on the rail, and the bordered
 * card (header bar with author + badges + timestamp + actions, markdown body, optional
 * reactions). The speech-bubble caret (CSS) points from the card back at the avatar.
 */
const CommentCard = ({
  authorName,
  authorHref = '#',
  avatarSrc,
  avatarShape = 'circle',
  associationLabel,
  associationAriaLabel,
  badgeLabel,
  badgeAriaLabel,
  timestamp,
  viaApp,
  reactions = false,
  isReply = false,
  children,
}: CommentCardProps) => (
  <Timeline.Item>
    {!isReply && (
      <Timeline.Avatar>
        <Avatar size={40} src={avatarSrc} square={avatarShape === 'square'} alt="" />
      </Timeline.Avatar>
    )}
    <div className={clsx(classes.Card, isReply && classes.CardReply)}>
      <div className={classes.CardHeader}>
        <div className={classes.HeaderText}>
          {/* Bold (not just muted) keeps the author link above the high-contrast axe
              threshold per the a11y in-text-link rule. */}
          <Link href={authorHref} className={classes.AuthorLink} muted>
            {authorName}
          </Link>
          {badgeLabel ? (
            <Label variant="secondary" aria-label={badgeAriaLabel}>
              {badgeLabel}
            </Label>
          ) : null}
          {associationLabel ? (
            <Label variant="secondary" aria-label={associationAriaLabel}>
              {associationLabel}
            </Label>
          ) : null}
          <span className={classes.TimestampLine}>
            {/* Muted + underlined keeps this muted permalink high-contrast accessible. */}
            <Link href="#" className={classes.Timestamp} muted>
              <RelativeTime date={new Date(timestamp)} format="relative" />
            </Link>
            {viaApp ? (
              <>
                {' – with '}
                {/* `inline` (underline) satisfies the a11y in-text-link rule. */}
                <Link href={viaApp.href ?? '#'} inline>
                  {viaApp.name}
                </Link>
              </>
            ) : null}
          </span>
        </div>
        <div className={classes.CardActions}>
          <IconButton icon={KebabHorizontalIcon} aria-label="Comment actions" variant="invisible" size="small" />
        </div>
      </div>
      <div className={classes.CardBody}>{children}</div>
      {reactions ? (
        <div className={classes.Reactions}>
          <button type="button" className={classes.Reaction} aria-label="👍 3 reactions">
            <span aria-hidden="true">👍</span>
            <span className={classes.ReactionCount}>3</span>
          </button>
          <button type="button" className={classes.Reaction} aria-label="🎉 1 reaction">
            <span aria-hidden="true">🎉</span>
            <span className={classes.ReactionCount}>1</span>
          </button>
          <IconButton icon={SmileyIcon} aria-label="Add reaction" variant="invisible" size="small" />
        </div>
      ) : null}
    </div>
  </Timeline.Item>
)

/**
 * Story-only scaffolding: a captioned `<section>` wrapping a single `<Timeline>`,
 * mirroring the badge-row Issue stories so the card itself renders as it would in
 * product. The placeholder `href="#"` links are prevented from navigating in
 * Storybook.
 */
const Variant = ({label, children}: {label: string; children: React.ReactNode}) => (
  <div
    className={classes.RealisticTimeline}
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>{label}</h3>
      <Timeline aria-label="Issue timeline">{children}</Timeline>
    </section>
  </div>
)

/**
 * A standard USER comment (proof-of-pattern): circular 40px avatar, the "Author"
 * subject-author badge (the commenter opened the issue), a muted relative-time
 * permalink, a short markdown-style body, and a reactions row.
 */
export const CommentStandard = () => (
  <Variant label="Standard user comment">
    <CommentCard
      authorName="monalisa"
      avatarSrc={MONALISA_AVATAR}
      associationLabel="Author"
      associationAriaLabel="This user is the author of this issue."
      timestamp="2022-07-26T11:46:07Z"
      reactions
    >
      <p>
        Thanks for the report! I can reproduce this with <code>npm run build</code> on a clean checkout. Looks like the
        regression landed in{' '}
        <Link href="#" inline>
          #1234
        </Link>{' '}
        — I&apos;ll open a fix shortly.
      </p>
    </CommentCard>
  </Variant>
)

/**
 * A bot comment (e.g. github-actions). Live `ActivityHeader` renders the actor badge
 * as "bot" (`LABELS.authorLabel`) next to the name. Avatar is SQUARE here per the
 * drift note (live squares Copilot only).
 */
export const CommentBot = () => (
  <Variant label="Bot comment (GitHub App)">
    <CommentCard
      authorName="github-actions"
      avatarSrc={GITHUB_ACTIONS_AVATAR}
      avatarShape="square"
      badgeLabel="bot"
      badgeAriaLabel="This comment was posted by a bot."
      timestamp="2022-07-26T12:02:00Z"
    >
      <p>
        All checks have passed ✅ — <code>build</code>, <code>test</code>, and <code>lint</code> are green on the latest
        commit.
      </p>
    </CommentCard>
  </Variant>
)

/**
 * A Copilot comment. Live denotation: the name renders as "Copilot", the actor badge
 * is "AI" (`LABELS.authorLabel(true, true)`), and the avatar is SQUARE
 * (`square={isCopilot}`) — the one square case confirmed directly in the live header.
 */
export const CommentCopilot = () => (
  <Variant label="Copilot comment">
    <CommentCard
      authorName="Copilot"
      avatarSrc={COPILOT_AVATAR}
      avatarShape="square"
      badgeLabel="AI"
      badgeAriaLabel="This comment was generated by Copilot."
      timestamp="2022-07-26T12:10:00Z"
    >
      <p>
        I&apos;ve analyzed the failing test. The assertion in{' '}
        <Link href="#" inline>
          parser.test.ts
        </Link>{' '}
        expects the old token shape — updating the fixture should resolve it.
      </p>
    </CommentCard>
  </Variant>
)

/**
 * A Dependabot comment. Live `ActivityHeader` renders the actor badge as "bot". Avatar
 * is SQUARE here, matching the shipped Dependabot badge-row surface and product
 * appearance (see drift note — the React comment header itself squares Copilot only).
 */
export const CommentDependabot = () => (
  <Variant label="Dependabot comment">
    <CommentCard
      authorName="dependabot"
      avatarSrc={DEPENDABOT_AVATAR}
      avatarShape="square"
      badgeLabel="bot"
      badgeAriaLabel="This comment was posted by a bot."
      timestamp="2022-07-26T12:18:00Z"
    >
      <p>
        Bumps <code>lodash</code> from 4.17.20 to 4.17.21. This update includes a security fix —{' '}
        <Link href="#" inline>
          view the advisory
        </Link>
        .
      </p>
    </CommentCard>
  </Variant>
)

/**
 * A user comment posted via a GitHub App. Live denotation: the timestamp line gains a
 * " – with {app}" suffix, the app name an `inline` (underlined) `Link`. Live does not
 * add a child/app avatar in this path, so only the text suffix is shown.
 */
export const CommentViaApp = () => (
  <Variant label="User comment via a GitHub App">
    <CommentCard
      authorName="monalisa"
      avatarSrc={MONALISA_AVATAR}
      timestamp="2022-07-26T12:24:00Z"
      viaApp={{name: 'Acme Sync'}}
    >
      <p>Mirrored from our internal tracker — closing the loop here so the thread stays in sync.</p>
    </CommentCard>
  </Variant>
)

export default {
  title: 'Components/Timeline/Events/Issues',
  component: Timeline,
  subcomponents: {
    'Timeline.Item': Timeline.Item,
    'Timeline.Avatar': Timeline.Avatar,
    'Timeline.Body': Timeline.Body,
  },
  decorators: [
    // File-scoped: render every story in the future-state list semantics
    // (`<ol>`/`<li>`). The `primer_react_timeline_list_semantics` flag is merged
    // on main; this opts these stories into the DOM the timeline will ship.
    Story => (
      <FeatureFlags flags={{primer_react_timeline_list_semantics: true}}>
        <Story />
      </FeatureFlags>
    ),
  ],
} as Meta<ComponentProps<typeof Timeline>>
