import type React from 'react'
import {useState, useEffect} from 'react'
import {VisuallyHidden} from '../VisuallyHidden'
import type {HTMLDataAttributes} from '../internal/internal-types'
import {useId} from '../hooks'
import classes from './Spinner.module.css'
import {useCallback, useRef} from 'react'
import {useMedia} from '../hooks/useMedia'

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
  const animation = useSpinnerAnimation()
  const size = sizeMap[sizeKey]
  const hasHiddenLabel = srText !== null && ariaLabel === undefined
  const labelId = useId()

  const [isVisible, setIsVisible] = useState(!delay)

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
        ref={animation}
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

Spinner.displayName = 'Spinner'

/**
 * Uses a technique from Spectrum to coordinate animations:
 * @see https://github.com/adobe/react-spectrum/blob/ab5e6f3dba4235dafab9f81f8b5c506ce5f11230/packages/%40react-spectrum/s2/src/Skeleton.tsx#L21
 */
function useSpinnerAnimation() {
  const ref = useRef<Animation | null>(null)
  const noMotionPreference = useMedia('(prefers-reduced-motion: no-preference)', false)
  return useCallback(
    (element: HTMLElement | SVGSVGElement | null) => {
      if (!element) {
        return
      }

      if (ref.current !== null) {
        return
      }

      if (noMotionPreference) {
        ref.current = element.animate(
          [
            {
              transform: 'rotate(0deg)',
            },
            {
              transform: 'rotate(360deg)',
            },
          ],
          {
            // var(--base-duration-1000)
            duration: 1000,
            iterations: Infinity,
            // var(--base-easing-linear)
            easing: 'cubic-bezier(0,0,1,1)',
          },
        )

        // Used to sync different animations. When all animations have the same
        // startTime they will be in sync.
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Animation/startTime#syncing_different_animations
        ref.current.startTime = 0
      }
    },
    [noMotionPreference],
  )
}

export default Spinner
