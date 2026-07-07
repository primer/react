import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import {clsx} from 'clsx'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {CopilotIcon, DependabotIcon, KebabHorizontalIcon, SmileyIcon} from '@primer/octicons-react'
import Avatar from '../Avatar'
import {IconButton} from '../Button'
import Label from '../Label'
import Link from '../Link'
import RelativeTime from '../RelativeTime'
import {InlineAvatar, RealisticTimeline, VariantSection} from './internal/timelineStoryHelpers'
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
 * - Copilot: name renders as "Copilot"; the 40px GUTTER avatar is a muted `CopilotIcon`
 *   octicon in a circle (audit: "Copilot = octicon avatar"). The live `square={isCopilot}`
 *   applies to the small 24px HEADER avatar, a different element from this gutter avatar.
 * - via-app: the timestamp line gets a " – with {app}" suffix, the app name an
 *   `inline` (underlined) `Link` — see the via-app section.
 *
 * AVATAR SHAPE (resolved matrix):
 * - Users → CIRCLE photo avatar.
 * - Bot (github-actions) → SQUARE photo avatar. Source-of-truth precedence is "what
 *   renders on github.com" > literal component behavior: bot/app accounts have square
 *   avatars by ACCOUNT TYPE, set upstream of the comment component, so the live result
 *   is square. The React `ActivityHeader` only FORCES `square={isCopilot}`, which
 *   avoids overriding an already-square bot avatar; it does NOT make bots circular.
 * - Copilot → OCTICON avatar: a muted `CopilotIcon` in a 40px CIRCLE with a subtle
 *   muted background (audit "Copilot = octicon avatar"). The earlier "square Copilot"
 *   note referred to the live 24px header avatar, not this 40px gutter avatar.
 * - Dependabot → OCTICON avatar (per Figma spec): a white `DependabotIcon` in a 40px
 *   ROUNDED-SQUARE with an accent-blue background — the clean Dependabot brand avatar.
 *   `bgColor-accent-emphasis` is the closest Primer token to the Dependabot brand blue.
 *   (Replaces the old photo URL, which rendered an off-brand hexagonal design.)
 *
 * PARENT-CHILD AVATAR (app/agent co-authored comments): a small app avatar (rounded
 * square) overlaps the bottom-right of the large author avatar — GitHub renders this
 * for comments created "with" an app/agent (e.g. "monalisa … – with GitHub Actions").
 * See the `appAvatar` prop + the app-avatar-badge section. Primer's upstream
 * `.avatar-child` has a long-standing asymmetric offset (`right: -15%` / `bottom: -9%`)
 * and a translucent `#fffc` shadow that renders the badge unevenly; we deliberately
 * reconstruct it with a SYMMETRIC offset and an OPAQUE ring so it sits cleanly in the
 * corner (github/github#439417).
 */

const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'
// github-actions[bot] (u/44036562) — a representative generic GitHub App bot.
const GITHUB_ACTIONS_AVATAR = 'https://avatars.githubusercontent.com/u/44036562?v=4'

type CommentCardProps = {
  /** Display name of the comment author (rendered as a bold link). */
  authorName: string
  authorHref?: string
  /** Photo avatar URL. Omit when using `avatarIcon` (e.g. Copilot). */
  avatarSrc?: string
  /** Circle for users; square for bots/Dependabot photo avatars. Ignored when `avatarIcon` is set. */
  avatarShape?: 'circle' | 'square'
  /**
   * Octicon avatar mode: render this icon inside a 40px container instead of a photo
   * `Avatar` (Copilot, Dependabot). Pair with `avatarIconShape` / `avatarIconTone`.
   */
  avatarIcon?: React.ElementType
  /** Octicon-avatar container shape (default 'circle'; 'square' for Dependabot). */
  avatarIconShape?: 'circle' | 'square'
  /** Octicon-avatar tone: 'muted' (subtle gray, Copilot) or 'accent' (blue + white icon, Dependabot). */
  avatarIconTone?: 'muted' | 'accent'
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
  /**
   * A small app/agent avatar overlapping the bottom-right of the large gutter avatar
   * (the "parent-child" avatar pattern GitHub renders for app/agent co-authored
   * comments, e.g. "monalisa … – with Claude"). App avatars are rounded squares.
   */
  appAvatar?: {src: string; alt: string}
  /** Show the reactions footer. */
  reactions?: boolean
  /**
   * ALWAYS-inline (compact) form: no 40px left-gutter avatar at any width; instead a
   * ~24px avatar sits inline in the header before the author, the header reads
   * "{author} commented {time}", and the body spans full width with no gutter indent or
   * speech-bubble caret. This is the new Issues `issue_inline_avatars` rendering
   * (github-ui `ActivityHeader` `forceInlineAvatar` branch).
   *
   * NOTE: the DEFAULT (large-gutter) cards ALSO collapse to this exact form below 768px
   * responsively (see the `.CommentsRoot` container query in the CSS module) — that is
   * the live narrow-viewport behavior (`.avatarHiddenOnMedium` +
   * `.nonLeadingElement`'s 56px indent only inside `@container (min-width: 768px)`).
   * This prop forces the compact form at all widths for the dedicated demo section.
   */
  inlineAvatar?: boolean
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
 * the gutter `Timeline.Avatar` (40px photo or octicon) seated ON the rail, and the
 * bordered card (header bar with author + badges + timestamp + actions, markdown body,
 * optional reactions). The speech-bubble caret (CSS) bridges the avatar to the card.
 */
const CommentCard = ({
  authorName,
  authorHref = '#',
  avatarSrc,
  avatarShape = 'circle',
  avatarIcon: AvatarIcon,
  avatarIconShape = 'circle',
  avatarIconTone = 'muted',
  associationLabel,
  associationAriaLabel,
  badgeLabel,
  badgeAriaLabel,
  timestamp,
  viaApp,
  appAvatar,
  reactions = false,
  inlineAvatar = false,
  isReply = false,
  children,
}: CommentCardProps) => {
  // A large-gutter card that responsively COLLAPSES to the inline form below 768px
  // (both avatars are in the DOM; CSS toggles them via a container query, mirroring
  // live github-ui). The always-inline compact demo (`inlineAvatar`) and threaded
  // replies (`isReply`) are not responsive.
  const isResponsive = !isReply && !inlineAvatar
  // Whether an inline header avatar + "commented" verb is present: for the
  // always-inline demo (shown at all widths) and for responsive cards (shown only
  // <768px via CSS). Threaded replies have no avatar.
  const hasInlineHeader = !isReply

  // The 40px gutter avatar (octicon actor, or photo, optionally with an app badge).
  const gutterAvatarNode = AvatarIcon ? (
    <span
      className={clsx(
        classes.OcticonAvatar,
        avatarIconShape === 'square' && classes.OcticonAvatarSquare,
        avatarIconTone === 'accent' && classes.OcticonAvatarAccent,
      )}
    >
      <AvatarIcon size={24} />
    </span>
  ) : (
    <span className={appAvatar ? classes.AvatarParent : undefined}>
      <Avatar size={40} src={avatarSrc ?? ''} square={avatarShape === 'square'} alt="" />
      {appAvatar ? (
        // Parent-child avatar: the small app avatar overlaps the bottom-right of
        // the large avatar. Primer's `.avatar-child` has a long-standing asymmetric
        // offset (right: -15% / bottom: -9%) and a translucent white shadow; we
        // deliberately reconstruct it with a SYMMETRIC offset and an opaque ring so
        // the badge sits cleanly in the corner (github/github#439417).
        <img className={classes.AppAvatarChild} src={appAvatar.src} alt={appAvatar.alt} />
      ) : null}
    </span>
  )

  // The ~24px inline header avatar mirroring the actor (octicon actors keep their
  // octicon; everyone else uses the shared 24px photo InlineAvatar).
  const inlineAvatarNode = AvatarIcon ? (
    <span
      className={clsx(
        classes.InlineHeaderAvatar,
        classes.InlineOcticonAvatar,
        avatarIconShape === 'square' && classes.OcticonAvatarSquare,
        avatarIconTone === 'accent' && classes.OcticonAvatarAccent,
      )}
    >
      <AvatarIcon size={16} />
    </span>
  ) : (
    <InlineAvatar className={classes.InlineHeaderAvatar} src={avatarSrc ?? ''} size={24} />
  )

  return (
    <Timeline.Item>
      {!isReply && !inlineAvatar && (
        <Timeline.Avatar className={classes.GutterAvatar}>{gutterAvatarNode}</Timeline.Avatar>
      )}
      <div
        className={clsx(
          classes.Card,
          inlineAvatar && classes.CardInline,
          isResponsive && classes.CardResponsive,
          isReply && classes.CardReply,
        )}
      >
        <div className={classes.CardHeader}>
          <div className={classes.HeaderText}>
            {/* Inline-avatar form: a ~24px avatar sits inline in the header before the
                author (github-ui `ActivityHeader` forceInlineAvatar / DefaultAvatar
                size={24}). Shown always for the compact demo, and only <768px for the
                responsive large cards (CSS container query). */}
            {hasInlineHeader ? inlineAvatarNode : null}
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
            {/* The inline/compact header reads "{author} commented {time}", matching the
                live forceInlineAvatar header phrasing. */}
            {hasInlineHeader ? <span className={classes.CommentedVerb}>commented</span> : null}
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
}

/**
 * Story-only scaffolding: the shared captioned `VariantSection` wrapping a single
 * `<Timeline>`, so each card renders as it would in product.
 */
const CommentSection = ({label, children}: {label: string; children: React.ReactNode}) => (
  <VariantSection label={label}>
    <Timeline aria-label="Issue timeline">{children}</Timeline>
  </VariantSection>
)

/**
 * The Comment event group — all actor variants of a timeline comment card, stacked in
 * one export so they can be scanned like a Figma component set (matching the badge-row
 * stories' "one export per event group" pattern). Each `<section>` is captioned and
 * holds a single `CommentCard`. Deferred (NOT shown): threaded review replies,
 * embedded-in-thread comments, minimized/collapsed states — the `CommentCard` helper's
 * `isReply` prop is wired for those later.
 */
export const EventComment = () => (
  <RealisticTimeline>
    <div
      // Establishes the container for the responsive collapse (see `.CommentsRoot`):
      // the large-gutter cards below switch to the inline layout when this container
      // is narrower than 768px, mirroring live github.com.
      className={classes.CommentsRoot}
      // Prevent the placeholder `href="#"` links from navigating inside Storybook.
      onClick={e => {
        if (e.target instanceof Element && e.target.closest('a')) e.preventDefault()
      }}
    >
      {/* Default (large-gutter) comment forms: a 40px avatar sits in the left gutter and
          the card is indented past it. The `.GutterGroup` reserves that ~72px column. */}
      <div className={classes.GutterGroup}>
        {/* Standard USER comment: circular photo avatar, the "Author" subject-author badge
        (the commenter opened the issue), a muted relative-time permalink, and reactions. */}
        <CommentSection label="Standard user comment">
          <CommentCard
            authorName="monalisa"
            avatarSrc={MONALISA_AVATAR}
            associationLabel="Author"
            associationAriaLabel="This user is the author of this issue."
            timestamp="2022-07-26T11:46:07Z"
            reactions
          >
            <p>
              Thanks for the report! I can reproduce this with <code>npm run build</code> on a clean checkout. Looks
              like the regression landed in{' '}
              <Link href="#" inline>
                #1234
              </Link>{' '}
              — I&apos;ll open a fix shortly.
            </p>
          </CommentCard>
        </CommentSection>

        {/* Bot comment (e.g. github-actions): live `ActivityHeader` renders the actor badge
        as "bot" (`LABELS.authorLabel`). */}
        <CommentSection label="Bot comment (GitHub App)">
          <CommentCard
            authorName="github-actions"
            avatarSrc={GITHUB_ACTIONS_AVATAR}
            // Square: github.com renders bot/app avatars square by account type; the live
            // result is square even though ActivityHeader.tsx only forces square={isCopilot}.
            // Do NOT "fix" to 'circle'.
            avatarShape="square"
            badgeLabel="bot"
            badgeAriaLabel="This comment was posted by a bot."
            timestamp="2022-07-26T12:02:00Z"
          >
            <p>
              All checks have passed ✅ — <code>build</code>, <code>test</code>, and <code>lint</code> are green on the
              latest commit.
            </p>
          </CommentCard>
        </CommentSection>

        {/* Copilot comment: name renders as "Copilot", the actor badge is "AI"
        (`LABELS.authorLabel(true, true)`). The 40px gutter avatar is a muted CopilotIcon
        octicon in a circle (audit "Copilot = octicon avatar"); the live square={isCopilot}
        applies to the separate 24px header avatar, not this gutter avatar. */}
        <CommentSection label="Copilot comment">
          <CommentCard
            authorName="Copilot"
            avatarIcon={CopilotIcon}
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
        </CommentSection>

        {/* Dependabot comment: live `ActivityHeader` renders the actor badge as "bot". */}
        <CommentSection label="Dependabot comment">
          <CommentCard
            authorName="dependabot"
            // Octicon avatar per Figma spec: white DependabotIcon on an accent-blue rounded
            // square — the clean Dependabot brand avatar. accent-emphasis approximates the
            // Dependabot brand blue; replaces the off-brand hexagonal photo (u/27347476).
            avatarIcon={DependabotIcon}
            avatarIconShape="square"
            avatarIconTone="accent"
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
        </CommentSection>

        {/* User comment via a GitHub App: the timestamp line gains a " – with {app}" suffix,
        the app name an `inline` (underlined) `Link`. */}
        <CommentSection label="User comment via a GitHub App">
          <CommentCard
            authorName="monalisa"
            avatarSrc={MONALISA_AVATAR}
            timestamp="2022-07-26T12:24:00Z"
            viaApp={{name: 'Acme Sync'}}
          >
            <p>Mirrored from our internal tracker — closing the loop here so the thread stays in sync.</p>
          </CommentCard>
        </CommentSection>

        {/* User comment via an app, WITH the app's avatar badge overlapping the author avatar
        (the parent-child avatar pattern — GitHub renders this for app/agent co-authored
        comments, e.g. "monalisa … – with GitHub Actions"). The small app avatar (rounded
        square) sits at the bottom-right of the large author avatar. We reconstruct it
        with a symmetric offset + opaque ring, avoiding Primer `.avatar-child`'s
        long-standing asymmetric offset (github/github#439417). */}
        <CommentSection label="User comment via an app (with app avatar badge)">
          <CommentCard
            authorName="monalisa"
            avatarSrc={MONALISA_AVATAR}
            appAvatar={{src: GITHUB_ACTIONS_AVATAR, alt: 'GitHub Actions'}}
            timestamp="2022-07-26T12:30:00Z"
            viaApp={{name: 'GitHub Actions'}}
          >
            <p>Deploy preview is ready — the changes are live on the staging environment.</p>
          </CommentCard>
        </CommentSection>
      </div>

      {/* Inline-avatar (compact) comment: NO left gutter / 40px avatar column — a ~24px
          avatar sits inline in the header before the author, and the body spans full
          width. This is BOTH the new Issues `issue_inline_avatars` rendering
          (github-ui `ActivityHeader` forceInlineAvatar branch) AND the responsive
          narrow-viewport form for all comments. Rendered as a full-width sibling of the
          `.GutterGroup` above so it gets no gutter indent. */}
      <CommentSection label="Comment (inline avatar / compact)">
        <CommentCard
          authorName="monalisa"
          avatarSrc={MONALISA_AVATAR}
          timestamp="2022-07-26T12:36:00Z"
          reactions
          inlineAvatar
        >
          <p>
            Same comment, compact form — the avatar is inline in the header and the body runs full width with no gutter.
          </p>
        </CommentCard>
      </CommentSection>
    </div>
  </RealisticTimeline>
)

export default {
  title: 'Components/Timeline/Internal/Comments',
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
