import type React from 'react'
import {clsx} from 'clsx'
import Avatar from '../../Avatar'
import Link from '../../Link'
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

// TODO(github/primer#6828): remove when Timeline provides a muted relative-time treatment
export const MutedTime = ({date}: {date: Date}) => (
  <RelativeTime date={date} format="relative" className={classes.MutedTime} />
)
