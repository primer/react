import type React from 'react'
import {useState, useEffect} from 'react'
import {VisuallyHidden} from '../VisuallyHidden'
import type {HTMLDataAttributes} from '../internal/internal-types'
import {useId} from '../hooks'
import classes from './Spinner.module.css'
import {clsx} from 'clsx'

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
  /** Whether to delay the spinner before rendering by the defined 1000ms. */
  delay?: boolean
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
  const size = sizeMap[sizeKey]
  const hasHiddenLabel = srText !== null && ariaLabel === undefined
  const labelId = useId()

  const [isVisible, setIsVisible] = useState(delay === 0)

  useEffect(() => {
    if (delay) {
      const timeoutId = setTimeout(() => {
        setIsVisible(true)
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [delay])

  if (!isVisible) {
    return null
  }

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

Spinner.displayName = 'Spinner'

export default Spinner
