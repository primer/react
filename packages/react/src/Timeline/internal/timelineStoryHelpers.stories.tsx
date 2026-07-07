import type {Meta} from '@storybook/react-vite'
import {BoldLink, Examples, InlineAvatar, MutedTime, RealisticTimeline, VariantSection} from './timelineStoryHelpers'

/**
 * Reference stories for the internal, story-only Timeline helpers
 * (`./timelineStoryHelpers`). These are NOT public components — they're shared
 * scaffolding for the Timeline event-story surfaces, rendered here in isolation so the
 * module is discoverable and self-documenting.
 *
 * `BoldLink`, `InlineAvatar`, and `MutedTime` reproduce live-GitHub styling that Primer
 * doesn't express natively yet — tracked to remove in
 * github/primer#6826 / #6827 / #6828.
 */

const MONALISA_AVATAR = 'https://avatars.githubusercontent.com/u/583231?v=4'

export const Helpers = () => (
  <RealisticTimeline>
    <VariantSection label="VariantSection — labeled section wrapper (this very wrapper)">
      <p>Wraps a story variant with an uppercase muted caption heading. Used for every label on this page.</p>
    </VariantSection>

    <VariantSection label="RealisticTimeline — max-width (1012px) container">
      <p>Bare container constraining content to GitHub&apos;s product timeline width. (This page is inside one.)</p>
    </VariantSection>

    <VariantSection label="Examples — a11y wrapper (click guard + link-underlines)">
      <Examples>
        <p>
          Wraps surfaces that render in-text links: adds the <code>data-a11y-link-underlines</code> hint and a click
          guard so placeholder <code>href=&quot;#&quot;</code> links don&apos;t navigate inside Storybook.
        </p>
      </Examples>
    </VariantSection>

    <VariantSection label="BoldLink — bold inline actor/reference link (TODO github/primer#6826)">
      <p>
        <BoldLink href="#">monalisa</BoldLink> opened this — the actor link renders bold until Primer ships a bold/actor
        weight affordance.
      </p>
    </VariantSection>

    <VariantSection label="InlineAvatar — inline avatar next to text (TODO github/primer#6827)">
      <p>
        <InlineAvatar src={MONALISA_AVATAR} /> a 20px inline avatar (override <code>size</code> for 24px), pending an
        upstream inline avatar treatment.
      </p>
    </VariantSection>

    <VariantSection label="MutedTime — muted relative timestamp (TODO github/primer#6828)">
      <p>
        Updated <MutedTime date={new Date('2022-07-26T11:46:07Z')} /> — muted relative time, pending a Timeline muted
        time treatment.
      </p>
    </VariantSection>
  </RealisticTimeline>
)

export default {
  title: 'Components/Timeline/Internal/Helpers',
  component: VariantSection,
} as Meta
