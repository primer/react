import React from 'react'
import styled from 'styled-components'

const StyledProse = styled.div<ProseProps>`
  font-size: var(--text-body-size-medium);
  line-height: var(--text-body-lineHeight-medium);
  max-width: ${props => (props.fullWidth ? undefined : '70ch')};

  /* ------------------------------------------------------------ */
  /* Inter-child spacing                                          */
  /* NOTE: The '--spacing' var gets changed for certain elements. */
  /* ------------------------------------------------------------ */
  * + * {
    margin-block-start: var(--spacing, 1em);
  }

  /* ------------------------------------------------------------ */
  /* Headings                                                     */
  /* Note: Does not override styles if Heading component is used. */
  /* TODO: decide whether we need to set different max-widths
      to accomodate larger font sizes.                            */
  /* ------------------------------------------------------------ */

  /* Display - https://primer.style/primitives/storybook/?path=/story/typography-functional--display */
  h1:not(.pc-Heading) {
    font-size: var(--text-display-size);
    font-weight: var(--text-display-weight);
    line-height: var(--text-display-lineHeight);
  }

  /* Title large - https://primer.style/primitives/storybook/?path=/story/typography-functional--title-large */
  h2:not(.pc-Heading) {
    font-size: var(--text-title-size-large);
    font-weight: var(--text-title-weight-large);
    line-height: var(--text-title-lineHeight-large);
  }

  /* Title medium - https://primer.style/primitives/storybook/?path=/story/typography-functional--title-medium */
  h3:not(.pc-Heading) {
    font-size: var(--text-title-size-medium);
    font-weight: var(--text-title-weight-medium);
    line-height: var(--text-title-lineHeight-medium);
  }

  /* Title small - https://primer.style/primitives/storybook/?path=/story/typography-functional--title-small */
  h4:not(.pc-Heading) {
    font-size: var(--text-title-size-small);
    font-weight: var(--text-title-weight-small);
    line-height: var(--text-title-lineHeight-small);
  }

  /* Body medium, heavier weight - https://primer.style/primitives/storybook/?path=/story/typography-functional--display */
  h5:not(.pc-Heading),
  h6:not(.pc-Heading) {
    font-size: var(--text-body-size-medium);
    font-weight: var(--text-title-weight-small);
    line-height: var(--text-body-lineHeight-medium);
  }

  h6:not(.pc-Heading) {
    color: var(--fgColor-muted);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  * + h1,
  * + h2,
  * + h3,
  * + h4,
  * + h5,
  * + h6 {
    margin-block-start: 1.5em;
  }

  /* ---------------------------------------------------------- */
  /* Paragraphs                                                 */
  /* ---------------------------------------------------------- */
  p {
    --spacing: var(--base-size-24);
    margin-block-end: 0;
  }

  /* ------------------------------------------------------------ */
  /* Lists                                                        */
  /* ------------------------------------------------------------ */
  ul,
  ol {
    --spacing: var(--base-size-16);
    display: flex;
    flex-direction: column;
    gap: var(--base-size-8);
    padding: 0;
    margin-inline-start: var(--base-size-24);
  }

  li {
    --spacing: 0;
  }

  /* ------------------------------------------------------------ */
  /* Images                                                       */
  /* ------------------------------------------------------------ */
  img {
    --spacing: var(--base-size-32);
    display: block;
    max-width: 100%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    margin-block-end: var(--spacing);
  }

  /* ------------------------------------------------------------ */
  /* Links                                                        */
  /* ------------------------------------------------------------ */
  a {
    color: var(--fgColor-link);
    text-decoration: underline;
  }

  /* ------------------------------------------------------------ */
  /* Other inline elements                                        */
  /* ------------------------------------------------------------ */
  strong {
    font-weight: var(--base-text-weight-semibold);
  }

  em {
    font-style: italic;
  }

  /* ------------------------------------------------------------ */
  /* Adjust spacing following headings                            */
  /* NOTE: This needs to come last so it overrides other          */
  /* element-specific spacing.                                    */
  /* ------------------------------------------------------------ */
  h4,
  h5,
  h6 {
    & + * {
      --spacing: var(--base-size-16);
    }
  }
`

export type ProseProps = {
  /** The semantic HTML element to render the component as. */
  as?: 'div' | 'section' | 'article' | 'main'
  /** Whether the width of the component should fill its parent. The default behavior is to enhance readability by limiting the width to keep line-lengths shorter. */
  fullWidth?: boolean
}

export const Prose: React.FC<React.PropsWithChildren<ProseProps>> = props => <StyledProse {...props} />
