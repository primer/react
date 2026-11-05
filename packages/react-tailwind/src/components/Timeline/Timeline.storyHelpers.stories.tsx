import type {Meta, StoryObj} from '@storybook/react-vite'
import {MarkGithubIcon, NoteIcon} from '@primer/octicons-react'
import {
  BoldLink,
  EventSubRow,
  Examples,
  InlineAvatar,
  MONALISA_AVATAR,
  MutedTime,
  RealisticTimeline,
  UserActor,
  VariantSection,
} from './Timeline.storyHelpers'

const meta = {
  title: 'React Tailwind/Layout/Timeline/Internal',
  component: VariantSection,
  parameters: {controls: {disable: true}},
} satisfies Meta<typeof VariantSection>
export default meta

type Story = StoryObj<typeof meta>

/** Story-only helpers shared by the Timeline event stories. They are not part of the package API. */
export const Helpers: Story = {
  args: {label: '', children: null},
  render: () => (
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
          <BoldLink href="#">monalisa</BoldLink> opened this — the actor link renders bold until Primer ships a
          bold/actor weight affordance.
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
      <VariantSection label="UserActor — avatar + actor name (composed from InlineAvatar + BoldLink)">
        <p>
          <UserActor href="#" muted /> linked+muted, <UserActor size={16} /> unlinked 16px, and a system actor{' '}
          <UserActor login="GitHub" icon={MarkGithubIcon} /> rendering a glyph instead of an avatar.
        </p>
      </VariantSection>
      <VariantSection label="EventSubRow — muted icon + small-text sub-row below an event body">
        <EventSubRow icon={NoteIcon}>Example note sub-row</EventSubRow>
      </VariantSection>
      <VariantSection label="MutedTime (permalink) — muted relative time linking to the event">
        <p>
          Updated <MutedTime date={new Date('2022-07-26T12:00:00Z')} href="#" /> as a permalink, beside a plain{' '}
          <MutedTime date={new Date('2022-07-26T12:00:00Z')} /> with no href.
        </p>
      </VariantSection>
    </RealisticTimeline>
  ),
}
