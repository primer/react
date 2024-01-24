import React from 'react'
import styled from 'styled-components'
import sx, {SxProp} from '../sx'
import {Status} from '../internal/components/LiveRegion'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'

const sizeMap = {
  small: '16px',
  medium: '32px',
  large: '64px',
}

export type SpinnerProps = React.PropsWithChildren<{
  /**
   * Provide a message to be announced to screen readers while the current
   * context is loading
   */
  loadingMessage?: string

  /** Sets the width and height of the spinner. */
  size?: keyof typeof sizeMap
}>

function Spinner({loadingMessage, size: sizeKey = 'medium', ...props}: SpinnerProps) {
  const size = sizeMap[sizeKey]

  return (
    <Status>
      {loadingMessage ? <VisuallyHidden>{loadingMessage}</VisuallyHidden> : null}
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
    </Status>
  )
}

const StyledSpinner = styled(Spinner)<SxProp>`
  @keyframes rotate-keyframes {
    100% {
      transform: rotate(360deg);
    }
  }

  animation: rotate-keyframes 1s linear infinite;

  ${sx}
`

StyledSpinner.displayName = 'Spinner'

export default StyledSpinner
