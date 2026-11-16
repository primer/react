import type React from 'react'
import {clsx} from 'clsx'
import {KebabHorizontalIcon, SmileyIcon} from '@primer/octicons-react'
import Avatar from '../../Avatar'
import {IconButton} from '../../Button'
import Label from '../../Label'
import Link from '../../Link'
import Timeline from '../Timeline'
import {InlineAvatar, MutedTime} from './timelineStoryHelpers'
import classes from './CommentCard.module.css'

/**
 * Internal, reusable comment-card composition for the Timeline story surfaces. NOT part
 * of the public API (stories don't ship; not exported from the package index — same as
 * `timelineStoryHelpers`). Extracted from the Comments story so it can be reused across
 * event-story surfaces rather than baked into a single story file (#8072 review).
 *
 * There is no Primer "Comment" primitive, so the card is composed directly from Primer
 * primitives + a scoped CSS module: a `Timeline.Item` with a 40px gutter avatar seated
 * on the rail, and a bordered card (header bar with author + badges + timestamp +
 * actions, markdown body, optional reactions, speech-bubble caret bridging avatar →
 * card).
 *
 * RESPONSIVE: the default large-gutter card COLLAPSES to the compact inline form below
 * 768px (both avatars stay in the DOM, toggled by a container query — mirrors live
 * github.com: gutter avatar + 56px indent only at ≥768px; small inline header avatar +
 * full-width body below). The consuming story establishes the container
 * (`container-type: inline-size`) on a root wrapper and uses `commentCardClasses.GutterGroup`
 * to wrap the large-gutter sections.
 *
 * AVATAR MATRIX (verified against github-ui `ActivityHeader` + labels): users = circle
 * photo; bots (github-actions) = square photo; Copilot = muted `CopilotIcon` octicon in
 * a circle; Dependabot = white `DependabotIcon` on an accent-blue rounded square (Figma
 * brand spec). App/agent co-authored comments add a small app avatar overlapping the
 * bottom-right of the author avatar (parent-child), reconstructed with a symmetric
 * offset + opaque ring to avoid Primer `.avatar-child`'s asymmetric offset
 * (github/github#439417).
 */

export type CommentCardProps = {
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
   * responsively (via the container query in `CommentCard.module.css`) — that is the
   * live narrow-viewport behavior (`.avatarHiddenOnMedium` + `.nonLeadingElement`'s 56px
   * indent only inside `@container (min-width: 768px)`). This prop forces the compact
   * form at all widths for the dedicated demo section.
   */
  inlineAvatar?: boolean
  /**
   * Threaded reply: drops the card border + speech-bubble caret + gutter avatar.
   * Wired now for the deferred threaded-reply stories; no reply story ships yet.
   */
  isReply?: boolean
  children: React.ReactNode
}

export const CommentCard = ({
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
              <MutedTime date={new Date(timestamp)} href="#" />
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
