import React from 'react'
import styled from 'styled-components'
import {COMMON, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const sizeMap = {
  small: '16px',
  medium: '32px',
  large: '64px'
}

export interface SpinnerInternalProps {
  size?: keyof typeof sizeMap
}

function Spinner({size: sizeKey, ...props}: SpinnerInternalProps) {
  const size = (sizeKey && sizeMap[sizeKey]) ?? sizeMap.medium

  return (
    <svg height={size} width={size} viewBox="0 0 16 16" fill="none" {...props}>
      <circle
        cx="8"
        cy="8"
        r="7"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M15 8a7.002 7.002 0 00-7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

const StyledSpinner = styled(Spinner)<SystemCommonProps & SxProp>`
  @keyframes rotate-keyframes {
    100% {
      transform: rotate(360deg);
    }
  }

  animation: rotate-keyframes 1s linear infinite;

  ${COMMON}
  ${sx}
`

StyledSpinner.displayName = 'Spinner'

export type SpinnerProps = ComponentProps<typeof StyledSpinner>
export default StyledSpinner
