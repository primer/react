import React from 'react'
import styled, {keyframes} from 'styled-components'
import sx, {SxProp} from '../../sx'
import {get} from '../../constants'

type BaseSkeletonBoneProps = {
  height?: React.CSSProperties['height']
  width?: React.CSSProperties['width']
} & SxProp

const shimmer = keyframes`
  from { mask-position: 200%; }
  to { mask-position: 0%; }
`

export const BaseSkeletonBone = styled.div<BaseSkeletonBoneProps>`
  animation: ${shimmer};
  display: block;
  background-color: var(--bgColor-muted, ${get('colors.canvas.subtle')});
  border-radius: 3px;
  height: ${props => props.height};
  width: ${props => props.width};

  @media (prefers-reduced-motion: no-preference) {
    mask-image: linear-gradient(75deg, #000 30%, rgba(0, 0, 0, 0.65) 80%);
    mask-size: 200%;
    animation: ${shimmer};
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }

  @media (forced-colors: active) {
    outline: 1px solid transparent;
    outline-offset: -1px;
  }

  &[data-component='SkeletonAvatar'] {
    border-radius: 50%;
    box-shadow: 0 0 0 1px ${get('colors.avatar.border')};
    display: inline-block;
    line-height: ${get('lineHeights.condensedUltra')};
    height: var(--avatar-size);
    width: var(--avatar-size);
  }

  &[data-avatar-shape='square'] {
    border-radius: clamp(4px, var(--avatar-size) - 24px, 6px);
  }

  &[data-component='SkeletonText'] {
    --font-size: var(--text-body-size-medium, 0.875rem);
    --line-height: var(--text-body-lineHeight-medium, 1.4285);
    --leading: calc(var(--font-size) * var(--line-height) - var(--font-size));
    border-radius: var(--borderRadius-small, 0.1875rem);
    height: var(--font-size);
    /* We divide the total amount of leading between the top and bottom */
    margin-block: calc(var(--leading) / 2);
  }

  /* We double the margin between lines to counteract margin collapse. This keeps the spaces the skeleton lines the same way lines of text are spaced */
  &[data-in-multiline='true'] {
    margin-block-end: calc(var(--leading) * 2);
  }

  &[data-in-multiline='true']:last-child {
    max-width: 65%;
    min-width: 50px;
    margin-bottom: 0;
  }

  /*
   * The new 'mod()' function is more straight forward than using the 'calc()' equation to calculate the
   * vertical space around letters created by line-height.
   * Once more browsers suppot 'mod()', we can replace the margin-block 'calc()' with this.
   */
  @supports (margin-block: mod(1px, 1px)) {
    &[data-component='SkeletonText'] {
      --leading: mod(var(--font-size) * var(--line-height), var(--font-size));
    }
  }

  &[data-text-skeleton-size='display'],
  &[data-text-skeleton-size='titleLarge'] {
    border-radius: var(--borderRadius-medium, 0.375rem);
  }

  &[data-text-skeleton-size='display'] {
    --font-size: var(--text-display-size, 2.5rem);
    --line-height: var(--text-display-lineHeight, 1.4);
  }

  &[data-text-skeleton-size='titleLarge'] {
    --font-size: var(--text-title-size-large, 2.5rem);
    --line-height: var(--text-title-lineHeight-large, 1.5);
  }

  &[data-text-skeleton-size='titleMedium'] {
    --font-size: var(--text-title-size-medium, 1.25rem);
    --line-height: var(--text-title-lineHeight-medium, 1.6);
  }

  &[data-text-skeleton-size='titleSmall'] {
    --font-size: var(--text-title-size-small, 1rem);
    --line-height: var(--text-title-lineHeight-small, 1.5);
  }

  &[data-text-skeleton-size='subtitle'] {
    --font-size: var(--text-subtitle-size, 1.25rem);
    --line-height: var(--text-subtitle-lineHeight, 1.6);
  }

  &[data-text-skeleton-size='bodyLarge'] {
    --font-size: var(--text-body-size-large, 1rem);
    --line-height: var(--text-body-lineHeight-large, 1.5);
  }

  &[data-text-skeleton-size='bodySmall'] {
    --font-size: var(--text-body-size-small, 0.75rem);
    --line-height: var(--text-body-lineHeight-small, 1.6666);
  }

  ${sx};
`
