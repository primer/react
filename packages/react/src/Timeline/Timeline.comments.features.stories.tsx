import type {Meta} from '@storybook/react-vite'
import type React from 'react'
import type {ComponentProps} from '../utils/types'
import {FeatureFlags} from '../FeatureFlags'
import Timeline from './Timeline'
import {CopilotIcon, DependabotIcon} from '@primer/octicons-react'
import Link from '../Link'
import {RealisticTimeline, VariantSection} from './internal/timelineStoryHelpers'
import {CommentCard} from './internal/CommentCard'
import cardClasses from './internal/CommentCard.module.css'
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
 * The reusable card composition lives in `./internal/CommentCard` (extracted so other
 * event surfaces can reuse it, per the #8072 review); this file only holds the example
 * data + variant catalog. See `CommentCard.tsx` for the avatar matrix (user/bot/Copilot/
 * Dependabot), the parent-child app-avatar reconstruction, the responsive collapse, and
 * the verified live denotations.
 *
 * TITLE / IA: The story is a LEAF named "Comment cards" directly under
 * `Components/Timeline/Internal` (title `Components/Timeline/Internal` + export
 * `CommentCards`), a sibling of the "Helpers" leaf. Storybook sidebar location is driven
 * by the `title` string + story name, decoupled from code location. There is only ever
 * one comment story and it documents the internal `CommentCard` component, so it lives
 * under `Internal/` next to the helper docs (keeping the tree small).
 *
 * SCOPE: Storybook-only by design, like the badge-row event stories. Intentionally NOT
 * wired into components-json / the primer.style docs page (do NOT add this file to
 * `Timeline.docs.json` or `build.ts`). Individual timeline events are not consumer-facing
 * components.
 */

const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'
// github-actions[bot] (u/44036562) — a representative generic GitHub App bot.
const GITHUB_ACTIONS_AVATAR = 'https://avatars.githubusercontent.com/u/44036562?v=4'

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
export const CommentCards = () => (
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
          the card is indented past it. The `.GutterGroup` reserves that ~72px column
          (from CommentCard's module, since the responsive `@container` rules toggle it). */}
      <div className={cardClasses.GutterGroup}>
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
  title: 'Components/Timeline/Internal',
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
