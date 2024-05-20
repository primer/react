import React, { useId } from 'react'
import styled from 'styled-components'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'

const sizeMap = {
  small: '16px',
  medium: '32px',
  large: '64px',
}

export interface SpinnerInternalProps {
  /** Sets the width and height of the spinner. */
  size?: keyof typeof sizeMap
  alt?: string
}

function Spinner({size: sizeKey = 'medium', alt = 'Loading...', ...props}: SpinnerInternalProps) {
  const size = sizeMap[sizeKey]

  let title: React.JSX.Element | null = null
  let titleId: string | undefined

  if (alt && alt.trim() !== "") {
    // Get an id for the title
    titleId = useId()
    title = <title id={titleId}>{alt}</title>
  }

  return (
    <svg height={size} width={size} aria-labelledby={titleId} viewBox="0 0 16 16" fill="none" {...props}>
      {title}
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

export type SpinnerProps = ComponentProps<typeof StyledSpinner>
export default StyledSpinner
