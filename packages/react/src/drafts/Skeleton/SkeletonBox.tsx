import type React from 'react'
import styled, {keyframes} from 'styled-components'
import sx, {type SxProp} from '../../sx'
import {get} from '../../constants'

type SkeletonBoxProps = {
  /** Height of the skeleton "box". Accepts any valid CSS `height` value. */
  height?: React.CSSProperties['height']
  /** Width of the skeleton "box". Accepts any valid CSS `width` value. */
  width?: React.CSSProperties['width']
} & SxProp

const shimmer = keyframes`
  from { mask-position: 200%; }
  to { mask-position: 0%; }
`

export const SkeletonBox = styled.div<SkeletonBoxProps>`
  animation: ${shimmer};
  display: block;
  background-color: var(--bgColor-muted, ${get('colors.canvas.subtle')});
  border-radius: 3px;
  height: ${props => props.height || '1rem'};
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

  ${sx};
`
