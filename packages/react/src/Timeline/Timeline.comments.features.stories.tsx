import type {Meta} from '@storybook/react-vite'
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
 * `IssueCommentViewer.tsx`, `ActivityHeader.tsx`, `CommentHeader.tsx`,
 * `CommentAuthorAssociation.tsx`).
 *
 * TITLE CHOICE: These live under `Components/Timeline/Events/Comments` rather than
 * `.../Events/Issues`. A comment is a bordered CARD (header bar + body + reactions),
 * not a one-line badge row like the Issue events, and the comment surface is SHARED
 * between Issue and Pull Request timelines (via different implementations — Issue =
 * React `IssueComment`; PR = ERB). Giving comments their own folder keeps the badge
 * rows clean and leaves room for the PR-sourced variant later.
 *
 * SCOPE: Storybook-only by design, like the Issue badge-row stories. They are
 * intentionally NOT wired into components-json / the primer.style docs page (do NOT
 * add this file to `Timeline.docs.json` or `build.ts`). Individual timeline events
 * are not consumer-facing components.
 *
 * FAITHFULNESS: There is no Primer "Comment" primitive, so the card is composed
 * directly from `Avatar`, `Link`, `Label`, `RelativeTime`, `IconButton`, and a
 * bordered container. The Timeline rail + gutter avatar come from `Timeline.Item` +
 * `Timeline.Avatar` (the comment uses the gutter avatar, not a `Timeline.Badge`).
 * The goal is a clean, recognizable GitHub comment card, not pixel-perfection.
 */

const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'

/**
 * A single standard USER comment card (proof-of-pattern). Structure, top to bottom:
 *
 * - Gutter: a 40px circular `Avatar` placed in `Timeline.Avatar`, sitting on the
 *   rail. The card's speech-bubble caret (CSS) points back at it.
 * - Header bar (`bgColor-muted`, bottom divider): bold author `Link` + an "Author"
 *   author-association `Label` (`secondary`) + a muted, underlined relative-time
 *   permalink `Link`, with a kebab `IconButton` actions affordance on the right.
 * - Body: a short markdown-style paragraph (with inline `<code>` and an inline
 *   `<Link>`).
 * - Reactions: a simple row of emoji pills with counts.
 *
 * In-text links are bold (author) or underlined (timestamp, inline body link) so
 * they clear the high-contrast axe threshold per the a11y in-text-link rule.
 */
export const CommentStandard = () => (
  <div
    className={classes.RealisticTimeline}
    // Prevent the placeholder `href="#"` links from navigating inside Storybook.
    onClick={e => {
      if ((e.target as HTMLElement).closest('a')) e.preventDefault()
    }}
  >
    <section className={classes.Variant}>
      <h3 className={classes.VariantLabel}>Standard user comment</h3>
      <Timeline aria-label="Issue timeline">
        <Timeline.Item>
          <Timeline.Avatar>
            <Avatar size={40} src={MONALISA_AVATAR} alt="" />
          </Timeline.Avatar>
          <div className={classes.Card}>
            <div className={classes.CardHeader}>
              <div className={classes.HeaderText}>
                <Link href="#" className={classes.AuthorLink} muted>
                  monalisa
                </Link>
                <Label variant="secondary" aria-label="This user has previously committed to this repository.">
                  Author
                </Label>
                <Link href="#" className={classes.Timestamp} muted>
                  <RelativeTime date={new Date('2022-07-26T11:46:07Z')} format="relative" />
                </Link>
              </div>
              <div className={classes.CardActions}>
                <IconButton icon={KebabHorizontalIcon} aria-label="Comment actions" variant="invisible" size="small" />
              </div>
            </div>
            <div className={classes.CardBody}>
              <p>
                Thanks for the report! I can reproduce this with <code>npm run build</code> on a clean checkout. Looks
                like the regression landed in{' '}
                <Link href="#" inline>
                  #1234
                </Link>{' '}
                — I&apos;ll open a fix shortly.
              </p>
            </div>
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
          </div>
        </Timeline.Item>
      </Timeline>
    </section>
  </div>
)

export default {
  title: 'Components/Timeline/Events/Comments',
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
