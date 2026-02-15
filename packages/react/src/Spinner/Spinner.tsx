import {clsx} from 'clsx'
import type React from 'react'
import {useEffect, useState} from 'react'
import {VisuallyHidden} from '../VisuallyHidden'
import type {HTMLDataAttributes} from '../internal/internal-types'
import {useId} from '../hooks'
import classes from './Spinner.module.css'
import {useMedia} from '../hooks/useMedia'
import {useFeatureFlag} from '../FeatureFlags'

const ANIMATION_DURATION_MS = 1000

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
  /** Controls whether and how long to delay rendering the spinner. Set to `true` to delay by 1000ms, `'short'` to delay by 300ms, `'long'` to delay by 1000ms, or provide a custom number of milliseconds. */
  delay?: boolean | 'short' | 'long' | number
} & HTMLDataAttributes

function Spinner({
  size: sizeKey = 'medium',
  srText = 'Loading',
  'aria-label': ariaLabel,
  className,
  style,
  delay = false,
  ...props
}: SpinnerProps) {
  const syncAnimationsEnabled = useFeatureFlag('primer_react_spinner_synchronize_animations')
  const noMotionPreference = useMedia('(prefers-reduced-motion: no-preference)', false)
  const syncDelay = useSpinnerSyncDelay()
  const size = sizeMap[sizeKey]
  const hasHiddenLabel = srText !== null && ariaLabel === undefined
  const labelId = useId()

  const [isVisible, setIsVisible] = useState(!delay)

  useEffect(() => {
    if (delay) {
      const delayDuration = typeof delay === 'number' ? delay : delay === 'short' ? 300 : 1000
      const timeoutId = setTimeout(() => {
        setIsVisible(true)
      }, delayDuration)

      return () => clearTimeout(timeoutId)
    }
  }, [delay])

  if (!isVisible) {
    return null
  }

  const shouldSync = syncAnimationsEnabled && noMotionPreference
  const mergedStyle = shouldSync ? {...style, animationDelay: `${syncDelay}ms`} : style

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
        className={clsx(className, classes.SpinnerAnimation)}
        style={mergedStyle}
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

Spinner.displayName = 'Spinner'

/**
 * Computes a negative animation-delay so all spinners land at the same
 * rotation angle regardless of when they mount. Because every instance
 * references the same clock (performance.now()), the CSS animation engine
 * keeps them visually in sync without any Web Animations API calls
 * (getAnimations, element.animate, startTime), which are significantly
 * slower in Safari/WebKit.
 */
function useSpinnerSyncDelay(): number {
  const [delay] = useState(() => {
    const now = typeof performance !== 'undefined' ? performance.now() : 0
    return -(now % ANIMATION_DURATION_MS)
  })
  return delay
}

export default Spinner
