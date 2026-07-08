import type React from 'react'
import {clsx} from 'clsx'
import Avatar from '../../Avatar'
import Label from '../../Label'
import Link from '../../Link'
import Octicon from '../../Octicon'
import RelativeTime from '../../RelativeTime'
import classes from './timelineStoryHelpers.module.css'

/**
 * Internal, story-only Timeline helpers. Not part of the public API (stories don't
 * ship). The BoldLink/InlineAvatar/MutedTime helpers reproduce live-GitHub styling
 * Primer doesn't express natively yet — tracked to remove in
 * github/primer#6826/#6827/#6828.
 *
 * Shared across the Timeline event-story surfaces (Issues, Comments, and the other
 * per-surface story files) so the scaffolding stays consistent and the live-GitHub
 * shims live in exactly one place.
 */

/**
 * A captioned `<section>` wrapping one story variant: an uppercase muted caption
 * heading above the variant content. Consumers pass the timeline (or card) as
 * `children`.
 */
export const VariantSection = ({label, children}: {label: string; children: React.ReactNode}) => (
  <section className={classes.VariantSection}>
    <h3 className={classes.VariantLabel}>{label}</h3>
    {children}
  </section>
)

/**
 * Bare max-width container matching GitHub's product timeline width (1012px). Used by
 * surfaces that have no in-text links (and therefore need no click guard). Surfaces
 * with in-text placeholder links should use `Examples` instead.
 */
export const RealisticTimeline = ({children}: {children: React.ReactNode}) => (
  <div className={classes.RealisticTimeline}>{children}</div>
)

/**
 * `RealisticTimeline` plus the story-only affordances for surfaces that render in-text
 * links: the `data-a11y-link-underlines` hint and a click guard that prevents the
 * placeholder `href="#"` links from navigating inside Storybook.
 */
export const Examples = ({children}: {children: React.ReactNode}) => (
  <div
    className={classes.RealisticTimeline}
    data-a11y-link-underlines="true"
    onClick={e => {
      if (e.target instanceof Element && e.target.closest('a')) e.preventDefault()
    }}
  >
    {children}
  </div>
)

// TODO(github/primer#6826): remove when Primer Link ships a bold/actor weight affordance
export const BoldLink = ({className, ...props}: React.ComponentProps<typeof Link>) => (
  <Link {...props} className={clsx(classes.BoldLink, className)} />
)

// TODO(github/primer#6827): remove when Primer ships an inline (in-text) avatar treatment
export const InlineAvatar = ({className, size = 20, alt = '', ...props}: React.ComponentProps<typeof Avatar>) => (
  <Avatar {...props} size={size} alt={alt} className={clsx(classes.InlineAvatar, className)} />
)

export const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'

/**
 * An actor "avatar + name" cluster, composed from the shared `InlineAvatar` + `BoldLink`
 * helpers so every Timeline surface renders actors identically.
 *
 * The bot shape mirrors live-GitHub `shared.tsx`: a `[bot]` suffix is stripped from the
 * display name, the name renders as an unlinked `<span>`, and a secondary `bot` `Label`
 * follows it. The optional `icon` prop renders a glyph instead of an avatar for system
 * actors (e.g. Secret scanning's GitHubActor: `<UserActor login="GitHub" icon={MarkGithubIcon} />`).
 *
 * TODO(github/primer#6827): remove when Primer ships an inline (in-text) avatar treatment.
 */
export const UserActor = ({
  login = 'monalisa',
  src = MONALISA_AVATAR,
  size = 20,
  href,
  muted = false,
  icon,
}: {
  login?: string
  src?: string
  size?: number
  href?: string
  muted?: boolean
  icon?: React.ElementType
}) => {
  const isBot = login.endsWith('[bot]')
  const display = isBot ? login.replace(/\[bot\]$/i, '') : login
  return (
    <>
      {icon ? <Octicon icon={icon} className={classes.ActorIcon} /> : <InlineAvatar src={src} size={size} />}
      {href && !isBot ? (
        <BoldLink href={href} muted={muted}>
          {display}
        </BoldLink>
      ) : (
        <span className={classes.BoldName}>{display}</span>
      )}
      {isBot && (
        <Label variant="secondary" className={classes.BotLabel}>
          bot
        </Label>
      )}
    </>
  )
}

/**
 * A muted "icon + small text" sub-row rendered below an event body (e.g. a commit
 * reference or a note). The four current surfaces drift between flex/margin-top-4 and
 * block/margin-top-8 layouts — that variance is incidental, so this canonicalizes to a
 * single flex-centered layout. Only the icon and its size vary.
 */
export const EventSubRow = ({
  icon,
  iconSize = 16,
  children,
}: {
  icon: React.ElementType
  iconSize?: number
  children: React.ReactNode
}) => (
  <div className={classes.EventSubRow}>
    <Octicon icon={icon} size={iconSize} className={classes.EventSubRowIcon} />
    <span>{children}</span>
  </div>
)

// TODO(github/primer#6828): remove when Timeline provides a muted relative-time treatment
export const MutedTime = ({date, href}: {date: Date; href?: string}) =>
  href ? (
    <Link href={href} muted className={clsx(classes.MutedTime, classes.MutedTimeLink)}>
      <RelativeTime date={date} format="relative" />
    </Link>
  ) : (
    <RelativeTime date={date} format="relative" className={classes.MutedTime} />
  )
