import React from 'react'
import styled from 'styled-components'
import sx, {type SxProp} from '../sx'
import {VisuallyHidden} from '../VisuallyHidden'
import type {HTMLDataAttributes} from '../internal/internal-types'
import {useId} from '../hooks'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './Spinner.module.css'

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
  className?: string
  style?: React.CSSProperties
} & HTMLDataAttributes &
  SxProp

function Spinner({
  size: sizeKey = 'medium',
  srText = 'Loading',
  'aria-label': ariaLabel,
  className,
  style,
  ...props
}: SpinnerProps) {
  const size = sizeMap[sizeKey]
  const hasHiddenLabel = srText !== null && ariaLabel === undefined
  const labelId = useId()

  return (
    /* inline-flex removes the extra line height */
    <span className={classes.Box}>
      <svg
        height={size}
        width={size}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        aria-label={ariaLabel ?? undefined}
        aria-labelledby={hasHiddenLabel ? labelId : undefined}
        className={className}
        style={style}
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
    </span>
  )
}

const StyledComponentSpinner = styled(Spinner)`
  @keyframes rotate-keyframes {
    100% {
      transform: rotate(360deg);
    }
  }

  animation: rotate-keyframes 1s linear infinite;

  ${sx}
`

const StyledBaseSpinner = styled.div`
  ${sx}
`

function StyledSpinner({sx, ...props}: SpinnerProps) {
  const enabled = useFeatureFlag('primer_react_css_modules_team')
  if (enabled) {
    if (sx) {
      return <StyledBaseSpinner sx={sx} as={Spinner} className={classes.SpinnerAnimation} {...props} />
    }

    return <Spinner className={classes.SpinnerAnimation} {...props} />
  }

  return <StyledComponentSpinner sx={sx} {...props} />
}

StyledSpinner.displayName = 'Spinner'

export default StyledSpinner
