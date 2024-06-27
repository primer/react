import React from 'react'
import styled from 'styled-components'
import sx, {type SxProp} from '../sx'
import {VisuallyHidden} from '../internal/components/VisuallyHidden'
import type {HTMLDataAttributes} from '../internal/internal-types'
import Box from '../Box'
import {useId} from '../hooks'

const sizeMap = {
  small: '16px',
  medium: '32px',
  large: '64px',
}

export type SpinnerProps = {
  /** Sets the width and height of the spinner. */
  size?: keyof typeof sizeMap
  /** Sets the text conveyed by assistive technologies such as screen readers. Set to `null` if the loading state is displayed in a text node somewhere else on the page. */
  srText?: string | null
  /** @deprecated Use `srText` instead. */
  'aria-label'?: string
} & HTMLDataAttributes &
  SxProp

function Spinner({size: sizeKey = 'medium', srText = 'Loading', 'aria-label': ariaLabel, ...props}: SpinnerProps) {
  const size = sizeMap[sizeKey]
  const hasHiddenLabel = srText !== null && ariaLabel === undefined
  const labelId = useId()

  return (
    /* inline-flex removes the extra line height */
    <Box as="span" sx={{display: 'inline-flex'}}>
      <svg
        height={size}
        width={size}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        aria-label={ariaLabel ?? undefined}
        aria-labelledby={hasHiddenLabel ? labelId : undefined}
        {...props}
      >
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
      {hasHiddenLabel ? <VisuallyHidden id={labelId}>{srText}</VisuallyHidden> : null}
    </Box>
  )
}

const StyledSpinner = styled(Spinner)`
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
